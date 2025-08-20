import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLanguageStore } from "@/store/language/languageStore";

interface SearcherMapProps {
  initialCoordinates?: { lat: number; lng: number };
  onLocationSelect?: (coords: { lat: number; lng: number }) => void;
  isSelectable?: boolean;
  showPin?: boolean;
  personName?: string;
  showFullScreen?: boolean;
  allLostPeople?: Array<{
    id: string;
    displayName: string;
    coordinates?: { lat: number; lng: number };
    clothingColor?: string;
  }>;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

// مركز سامراء
const CENTER: [number, number] = [43.88504, 34.19625]; // [lng, lat]

// حدود منطقة سامراء (4 كم × 4 كم)
const SAMARRA_BOUNDS: [[number, number], [number, number]] = [
  [43.86334, 34.17822], // SW
  [43.90674, 34.21428], // NE
];

export default function SearcherMap({ 
  initialCoordinates,
  onLocationSelect,
  isSelectable = true,
  showPin = false,
  personName,
  showFullScreen = false,
  allLostPeople = []
}: SearcherMapProps) {
  const { currentLanguage } = useLanguageStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [expanded, setExpanded] = useState(showFullScreen);

  useEffect(() => {
    if (!mapRef.current) return;
    if (typeof window === "undefined") return;

    // إنشاء الخريطة
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: initialCoordinates ? [initialCoordinates.lng, initialCoordinates.lat] : CENTER,
      zoom: initialCoordinates ? 16 : 15,
      bounds: SAMARRA_BOUNDS,
      fitBoundsOptions: { padding: 20 },
      interactive: isSelectable,
      attributionControl: false,
      renderWorldCopies: false,
    });

    mapInstanceRef.current = map;

    map.on('load', () => {
      // إضافة التضاريس ثلاثية الأبعاد
      if (showFullScreen) {
        enable3DView(map);
      }

      // عرض العلامات
      displayMarkers(map);
    });

    // إضافة حدث النقر للاختيار اليدوي
    if (isSelectable && onLocationSelect) {
      map.on('click', (e) => {
        const coords = clampLocationToBounds(e.lngLat.lng, e.lngLat.lat);
        onLocationSelect(coords);
        
        // إضافة علامة مؤقتة
        clearTemporaryMarkers();
        const marker = new mapboxgl.Marker({ color: '#3b82f6' })
          .setLngLat([coords.lng, coords.lat])
          .addTo(map);
        markersRef.current.push(marker);
      });
    }

    return () => {
      clearAllMarkers();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, [initialCoordinates, isSelectable, showPin, personName, showFullScreen, allLostPeople]);

  // قَصّ الإحداثيات للحدود المسموحة
  const clampLocationToBounds = (lng: number, lat: number) => {
    const [sw, ne] = SAMARRA_BOUNDS;
    const clampedLng = Math.min(Math.max(lng, sw[0]), ne[0]);
    const clampedLat = Math.min(Math.max(lat, sw[1]), ne[1]);
    return { lng: clampedLng, lat: clampedLat };
  };

  // إضافة ميزات ثلاثية الأبعاد
  const enable3DView = (map: mapboxgl.Map) => {
    map.setPitch(45);
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

    if (labelLayerId) {
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
    }
  };

  // عرض العلامات على الخريطة
  const displayMarkers = (map: mapboxgl.Map) => {
    clearAllMarkers();

    // عرض شخص واحد محدد
    if (showPin && initialCoordinates) {
      const marker = new mapboxgl.Marker({ color: '#ef4444', scale: 1.2 })
        .setLngLat([initialCoordinates.lng, initialCoordinates.lat]);
      
      if (personName) {
        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setHTML(`
            <div class="text-center">
              <div class="font-semibold text-gray-900">${personName}</div>
              <div class="text-xs text-gray-600">
                ${initialCoordinates.lat.toFixed(5)}, ${initialCoordinates.lng.toFixed(5)}
              </div>
            </div>
          `);
        marker.setPopup(popup);
      }
      
      marker.addTo(map);
      markersRef.current.push(marker);

      // التركيز على الموقع
      map.flyTo({
        center: [initialCoordinates.lng, initialCoordinates.lat],
        zoom: 17,
        duration: 1000
      });
    }

    // عرض جميع الأشخاص المفقودين
    if (allLostPeople.length > 0) {
      allLostPeople.forEach((person) => {
        if (person.coordinates) {
          const marker = new mapboxgl.Marker({ 
            color: getColorByClothing(person.clothingColor),
            scale: 0.8 
          }).setLngLat([person.coordinates.lng, person.coordinates.lat]);
          
          const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
            .setHTML(`
              <div class="text-center">
                <div class="font-semibold text-gray-900">${person.displayName}</div>
                <div class="text-xs text-gray-600">${person.clothingColor || ''}</div>
                <div class="text-xs text-gray-500">
                  ${person.coordinates.lat.toFixed(5)}, ${person.coordinates.lng.toFixed(5)}
                </div>
              </div>
            `);
          marker.setPopup(popup);
          marker.addTo(map);
          markersRef.current.push(marker);
        }
      });

      // ضبط الخريطة لتظهر جميع العلامات
      if (markersRef.current.length > 1) {
        const coordinates = allLostPeople
          .filter(p => p.coordinates)
          .map(p => [p.coordinates!.lng, p.coordinates!.lat] as [number, number]);
        
        if (coordinates.length > 0) {
          const bounds = coordinates.reduce((bounds, coord) => {
            return bounds.extend(coord);
          }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
          
          map.fitBounds(bounds, { padding: 50, maxZoom: 16 });
        }
      }
    }
  };

  // تحديد لون العلامة حسب لون الملابس
  const getColorByClothing = (clothingColor?: string): string => {
    if (!clothingColor) return '#6b7280';
    
    const colorMap: { [key: string]: string } = {
      'أزرق': '#3b82f6',
      'أحمر': '#ef4444', 
      'أخضر': '#10b981',
      'أسود': '#374151',
      'أبيض': '#9ca3af',
      'أصفر': '#f59e0b',
      'وردي': '#ec4899',
      'بني': '#92400e',
      'رمادي': '#6b7280'
    };
    
    return colorMap[clothingColor] || '#6b7280';
  };

  // مسح العلامات المؤقتة
  const clearTemporaryMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  // مسح جميع العلامات
  const clearAllMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  return (
    <div className="space-y-3">
      <div 
        ref={mapRef} 
        className={`w-full rounded-lg border border-gray-200 bg-gray-100 ${
          expanded ? 'h-96' : 'h-48'
        }`}
        style={{ minHeight: expanded ? '384px' : '192px' }}
      />
      
      {isSelectable && onLocationSelect && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {currentLanguage === 'ar' 
              ? 'انقر على الخريطة لتحديد الموقع'
              : 'Click on the map to select location'
            }
          </p>
        </div>
      )}
      
      {allLostPeople.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {allLostPeople.length} {currentLanguage === 'ar' ? 'أشخاص مفقودين' : 'lost people'}
          </p>
        </div>
      )}
    </div>
  );
}