import React, { useRef, useEffect, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLanguageStore } from "@/store/language/languageStore";

interface LostPersonMapProps {
  onLocationDetected: (coords: { lat: number; lng: number }) => void;
  onLocationError?: (error: string) => void;
  showControls?: boolean;
  centerOnUser?: boolean;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

// مركز سامراء
const CENTER: [number, number] = [43.88504, 34.19625]; // [lng, lat]

// حدود منطقة سامراء (4 كم × 4 كم)
const SAMARRA_BOUNDS: [[number, number], [number, number]] = [
  [43.86334, 34.17822], // SW
  [43.90674, 34.21428], // NE
];

export default function LostPersonMap({ onLocationDetected, onLocationError }: LostPersonMapProps) {
  const { currentLanguage } = useLanguageStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>("");

  useEffect(() => {
    if (!mapRef.current) return;
    if (typeof window === "undefined") return;

    // إنشاء الخريطة
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: CENTER,
      zoom: 15,
      bounds: SAMARRA_BOUNDS,
      fitBoundsOptions: { padding: 20 },
      interactive: false, // غير تفاعلية للشخص المفقود
      attributionControl: false,
      renderWorldCopies: false,
    });

    mapInstanceRef.current = map;

    // تحديد الموقع تلقائياً عند تحميل الخريطة
    map.on('load', () => {
      detectUserLocation();
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  // قَصّ الإحداثيات للحدود المسموحة
  const clampLocationToBounds = (lng: number, lat: number) => {
    const [sw, ne] = SAMARRA_BOUNDS;
    const clampedLng = Math.min(Math.max(lng, sw[0]), ne[0]);
    const clampedLat = Math.min(Math.max(lat, sw[1]), ne[1]);
    return { lng: clampedLng, lat: clampedLat };
  };

  // تحديد موقع المستخدم تلقائياً
  const detectUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      const error = currentLanguage === 'ar' 
        ? "متصفحك لا يدعم تحديد الموقع" 
        : "Your browser doesn't support geolocation";
      setLocationStatus(error);
      onLocationError?.(error);
      return;
    }

    setIsLocating(true);
    setLocationStatus(currentLanguage === 'ar' ? "جاري تحديد موقعك..." : "Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // قَصّ الموقع للمنطقة المسموحة
        const clampedLocation = clampLocationToBounds(longitude, latitude);
        
        // إضافة علامة على الخريطة
        if (markerRef.current) {
          markerRef.current.remove();
        }

        const marker = new mapboxgl.Marker({ color: '#ef4444', scale: 1.2 })
          .setLngLat([clampedLocation.lng, clampedLocation.lat]);

        if (mapInstanceRef.current) {
          marker.addTo(mapInstanceRef.current);
          
          // التحرك إلى الموقع المحدد
          mapInstanceRef.current.flyTo({
            center: [clampedLocation.lng, clampedLocation.lat],
            zoom: 17,
            duration: 1500
          });
        }

        markerRef.current = marker;
        
        setIsLocating(false);
        setLocationStatus(currentLanguage === 'ar' ? "تم تحديد موقعك بنجاح" : "Location detected successfully");
        
        // إرسال الموقع للمكون الأب
        onLocationDetected(clampedLocation);
      },
      (error) => {
        setIsLocating(false);
        let errorMessage = "";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = currentLanguage === 'ar' 
              ? "تم رفض الإذن لتحديد الموقع. يرجى السماح بالوصول للموقع."
              : "Location permission denied. Please allow location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = currentLanguage === 'ar'
              ? "معلومات الموقع غير متاحة"
              : "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = currentLanguage === 'ar'
              ? "انتهت مهلة طلب تحديد الموقع"
              : "Location request timeout";
            break;
          default:
            errorMessage = currentLanguage === 'ar'
              ? "حدث خطأ أثناء تحديد الموقع"
              : "An error occurred while detecting location";
            break;
        }
        
        setLocationStatus(errorMessage);
        onLocationError?.(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, [currentLanguage, onLocationError, onLocationDetected]);

  // إعادة محاولة تحديد الموقع
  const retryLocationDetection = () => {
    detectUserLocation();
  };

  return (
    <div className="space-y-3">
      <div 
        ref={mapRef} 
        className="h-48 w-full rounded-lg border border-gray-200 bg-gray-100"
        style={{ minHeight: '192px' }}
      />
      
      <div className="text-center">
        <div className={`text-sm ${isLocating ? 'text-blue-600' : locationStatus.includes('نجاح') || locationStatus.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
          {isLocating && (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>{locationStatus}</span>
            </div>
          )}
          {!isLocating && locationStatus && (
            <div className="space-y-2">
              <p>{locationStatus}</p>
              {!locationStatus.includes('نجاح') && !locationStatus.includes('success') && (
                <button
                  onClick={retryLocationDetection}
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  {currentLanguage === 'ar' ? 'إعادة المحاولة' : 'Retry'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}