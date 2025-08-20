import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLanguageStore } from "@/store/language/languageStore";
import { navigationTranslations, getFeatureTranslations } from '@/localization';

interface MiniMapBoxProps {
  value?: { lat: number; lng: number };
  onChange?: (coords: { lat: number; lng: number }) => void;
  initialCoordinates?: { lat: number; lng: number };
  onLocationSelect?: (coords: { lat: number; lng: number }) => void;
  isSelectable?: boolean;
  showPin?: boolean;
  personName?: string;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

// مركز تقريبي للمنطقة
const CENTER: [number, number] = [43.88504, 34.19625]; // [lng, lat]

// صندوق حدود 4 كم × 4 كم حول المركز
const SAMARRA_BOUNDS: [[number, number], [number, number]] = [
  [43.86334, 34.17822], // SW
  [43.90674, 34.21428], // NE
];

const SHRINE_ZOOM = 16;

export default function MiniMapBox({ 
  value, 
  onChange, 
  initialCoordinates, 
  showPin = false, 
  personName 
}: MiniMapBoxProps) {
  const [expanded, setExpanded] = useState(false);

  const miniMapRef = useRef<HTMLDivElement>(null);
  const modalMapRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  // خريطة مصغّرة غير تفاعلية ضمن الحدود
  useEffect(() => {
    if (!miniMapRef.current) return;
    if (typeof window === "undefined") return;

    const mini = new mapboxgl.Map({
      container: miniMapRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      bounds: SAMARRA_BOUNDS,
      fitBoundsOptions: { padding: 10 },
      interactive: false,
      attributionControl: false,
      renderWorldCopies: false,
    });

    // Show pin for selected location or initial coordinates
    const coords = value || initialCoordinates;
    if (coords && showPin) {
      const marker = new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat([coords.lng, coords.lat]);
      
      if (personName) {
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setText(personName);
        marker.setPopup(popup);
      }
      
      marker.addTo(mini);
      
      // Center on the marker if showing a person
      if (initialCoordinates && personName) {
        mini.flyTo({
          center: [coords.lng, coords.lat],
          zoom: 17,
          duration: 1000
        });
      }
    }

    return () => mini.remove();
  }, [value, initialCoordinates, showPin, personName]);

  // أداة تحديد الموقع (GPS)
  const addGeolocate = (map: mapboxgl.Map) => {
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
      fitBoundsOptions: { maxZoom: 16 },
    });
    map.addControl(geolocate);
    map.once("load", () => {
      geolocate.trigger();
    });
  };

  // قَصّ الإحداثيات للحدود
  const clampLngLatToBounds = (lng: number, lat: number) => {
    const [sw, ne] = SAMARRA_BOUNDS;
    const clampedLng = Math.min(Math.max(lng, sw[0]), ne[0]);
    const clampedLat = Math.min(Math.max(lat, sw[1]), ne[1]);
    return { lng: clampedLng, lat: clampedLat };
  };

  // إضافة ميزات 3D بعد تحميل الخريطة
  const enable3DView = (map: mapboxgl.Map) => {
    map.setPitch(60);
    map.setBearing(-17.6);

    // إضافة التضاريس
    map.addSource("mapbox-dem", {
      type: "raster-dem",
      url: "mapbox://mapbox.terrain-rgb",
      tileSize: 512,
      maxzoom: 14,
    });
    map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

    // إضافة المباني ثلاثية الأبعاد
    const layers = map.getStyle().layers;
    const labelLayerId = layers?.find(
      (layer) => layer.type === "symbol" && layer.layout?.["text-field"]
    )?.id;

    map.addLayer(
      {
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 15,
        paint: {
          "fill-extrusion-color": "#aaa",
          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            0,
            15.05,
            ["get", "height"]
          ],
          "fill-extrusion-base": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            0,
            15.05,
            ["get", "min_height"]
          ],
          "fill-extrusion-opacity": 0.6,
        },
      },
      labelLayerId
    );

    // إضافة السماء
    map.addLayer({
      id: "sky",
      type: "sky",
      paint: {
        "sky-type": "atmosphere",
        "sky-atmosphere-sun": [0.0, 0.0],
        "sky-atmosphere-sun-intensity": 15,
      },
    });
  };

  // خريطة المودال التفاعلية
  useEffect(() => {
    if (!expanded || !modalMapRef.current) return;
    if (typeof window === "undefined") return;

    const map = new mapboxgl.Map({
      container: modalMapRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: value ? [value.lng, value.lat] : CENTER,
      zoom: value ? SHRINE_ZOOM : 15,
      maxBounds: SAMARRA_BOUNDS,
      attributionControl: false,
      renderWorldCopies: false,
    });
    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }));
    addGeolocate(map);

    map.on("load", () => {
      enable3DView(map);
    });

    const placeOrMoveMarker = (lng: number, lat: number) => {
      const { lng: L, lat: A } = clampLngLatToBounds(lng, lat);
      if (markerRef.current) {
        markerRef.current.setLngLat([L, A]);
      } else {
        markerRef.current = new mapboxgl.Marker({ draggable: true })
          .setLngLat([L, A])
          .addTo(map)
          .on("dragend", () => {
            const p = markerRef.current!.getLngLat();
            const c = clampLngLatToBounds(p.lng, p.lat);
            markerRef.current!.setLngLat([c.lng, c.lat]);
            onChange?.({ lat: c.lat, lng: c.lng });
          });
      }
      onChange?.({ lat: A, lng: L });
    };

    if (value) placeOrMoveMarker(value.lng, value.lat);

    const clickHandler = (e: mapboxgl.MapMouseEvent) => {
      placeOrMoveMarker(e.lngLat.lng, e.lngLat.lat);
    };
    map.on("click", clickHandler);

    return () => {
      map.off("click", clickHandler);
      markerRef.current?.remove();
      markerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [expanded, value, onChange]);

  return (
    <>
      <div
        ref={miniMapRef}
        className="w-full h-32 rounded border cursor-pointer"
        onClick={() => setExpanded(true)}
        title={(() => {
          const { currentLanguage } = useLanguageStore();
          const t = getFeatureTranslations(navigationTranslations, currentLanguage);
          return t.map.clickToSelectLocation;
        })()}
      />
      {expanded && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
          onClick={() => setExpanded(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-2 relative"
            style={{ width: 420, height: 460 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div ref={modalMapRef} className="w-full h-full rounded" />
            <button
              className="absolute top-2 left-2 bg-gray-100 rounded px-2 py-1 text-sm"
              onClick={() => setExpanded(false)}
            >
{(() => {
                const { currentLanguage } = useLanguageStore();
                const t = getFeatureTranslations(navigationTranslations, currentLanguage);
                return t.common.close;
              })()}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
