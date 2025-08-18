"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/store/language/languageStore";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import { useApiData } from "@/hooks/useApi";
import LostPersonMap from "@/components/common/LostPersonMap";

interface NavigationMapProps {
  profileId: string;
  sessionId?: string;
  onClose: () => void;
}

export function NavigationMap({ 
  profileId, 
  sessionId,
  onClose 
}: NavigationMapProps) {
  const { currentLanguage } = useLanguageStore();
  const dir = getDirectionalClasses(currentLanguage);
  
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);

  // API hook for location updates
  const { post: updateLocation } = useApiData(`/gfl/profiles/${profileId}/location`);
  const { post: updateSessionLocation } = useApiData(sessionId ? `/sessions/${sessionId}/searcher/location` : '/sessions/dummy/searcher/location');

  const updateLocationToBackend = useCallback(async (coords: {lat: number, lng: number}) => {
    if (isUpdatingLocation) return; // Prevent multiple simultaneous updates
    
    setIsUpdatingLocation(true);
    
    try {
      // Update profile location
      await updateLocation({
        data: coords,
        onSuccess: () => {
          console.log('Profile location updated successfully');
        },
        onError: (error) => {
          console.error('Failed to update profile location:', error);
        }
      });

      // Update session location if session exists
      if (sessionId) {
        await updateSessionLocation({
          data: coords,
          onSuccess: () => {
            console.log('Session location updated successfully');
          },
          onError: (error) => {
            console.error('Failed to update session location:', error);
          }
        });
      }
    } catch (error) {
      console.error('Location update error:', error);
    } finally {
      setIsUpdatingLocation(false);
    }
  }, [isUpdatingLocation, updateLocation, sessionId, updateSessionLocation]);

  // Track user location continuously
  useEffect(() => {
    let watchId: number;

    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(coords);
          setLocationError("");
          
          // Auto-update location to backend
          updateLocationToBackend(coords);
        },
        (error) => {
          console.error('Location tracking error:', error);
          setLocationError(
            currentLanguage === 'ar'
              ? 'فشل في تتبع الموقع. يرجى التأكد من تفعيل خدمة الموقع.'
              : 'Failed to track location. Please ensure location service is enabled.'
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000 // 30 seconds
        }
      );
    } else {
      setLocationError(
        currentLanguage === 'ar'
          ? 'خدمة تحديد الموقع غير متاحة على هذا الجهاز.'
          : 'Geolocation service is not available on this device.'
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [profileId, sessionId, currentLanguage, updateLocationToBackend]);

  const handleManualLocationUpdate = () => {
    if (currentLocation) {
      updateLocationToBackend(currentLocation);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-semibold ${dir.textAlign}`}>
            {currentLanguage === 'ar' ? 'التوجيه والملاحة' : 'Navigation & Guidance'}
          </h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            {currentLanguage === 'ar' ? 'إغلاق' : 'Close'}
          </Button>
        </div>

        {/* Location Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${currentLocation ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
            <span className={`font-medium ${dir.textAlign}`}>
              {currentLanguage === 'ar' ? 'حالة الموقع:' : 'Location Status:'}
            </span>
            <span className={`text-sm ${currentLocation ? 'text-green-600' : 'text-yellow-600'}`}>
              {currentLocation 
                ? (currentLanguage === 'ar' ? 'متصل' : 'Connected')
                : (currentLanguage === 'ar' ? 'جاري التحديد...' : 'Locating...')
              }
            </span>
          </div>
          
          {locationError && (
            <p className={`text-red-600 text-sm ${dir.textAlign}`}>{locationError}</p>
          )}
          
          {currentLocation && (
            <div className={`text-xs text-gray-600 ${dir.textAlign}`}>
              <p>
                {currentLanguage === 'ar' ? 'الإحداثيات:' : 'Coordinates:'} 
                {` ${currentLocation.lat.toFixed(5)}, ${currentLocation.lng.toFixed(5)}`}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleManualLocationUpdate}
                  disabled={isUpdatingLocation}
                  className="text-xs"
                >
                  {isUpdatingLocation 
                    ? (currentLanguage === 'ar' ? 'جاري التحديث...' : 'Updating...')
                    : (currentLanguage === 'ar' ? 'تحديث الموقع' : 'Update Location')
                  }
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="h-96 border rounded-lg overflow-hidden">
          <LostPersonMap
            onLocationDetected={setCurrentLocation}
            onLocationError={setLocationError}
            showControls={true}
            centerOnUser={true}
          />
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className={`font-semibold text-yellow-800 mb-2 ${dir.textAlign}`}>
            {currentLanguage === 'ar' ? 'تعليمات التوجيه:' : 'Navigation Instructions:'}
          </h3>
          <ul className={`text-sm text-yellow-700 space-y-1 ${dir.textAlign}`}>
            <li>
              {currentLanguage === 'ar'
                ? '• سيتم تحديث موقعك تلقائياً كل 30 ثانية'
                : '• Your location will be updated automatically every 30 seconds'
              }
            </li>
            <li>
              {currentLanguage === 'ar'
                ? '• الباحثون يمكنهم رؤية موقعك والتواصل معك'
                : '• Searchers can see your location and communicate with you'
              }
            </li>
            <li>
              {currentLanguage === 'ar'
                ? '• ابق في مكان آمن واتبع التعليمات من الباحثين'
                : '• Stay in a safe place and follow instructions from searchers'
              }
            </li>
            <li>
              {currentLanguage === 'ar'
                ? '• اتصل بالطوارئ إذا كنت في خطر فوري'
                : '• Call emergency services if you are in immediate danger'
              }
            </li>
          </ul>
        </div>

        {/* Profile Info */}
        <div className="text-center pt-4 border-t">
          <p className={`text-sm text-gray-600 ${dir.textAlign}`}>
            {currentLanguage === 'ar' ? 'معرف الملف الشخصي:' : 'Profile ID:'} 
            <span className="font-mono ml-2">{profileId}</span>
          </p>
          {sessionId && (
            <p className={`text-sm text-gray-600 ${dir.textAlign}`}>
              {currentLanguage === 'ar' ? 'معرف الجلسة:' : 'Session ID:'} 
              <span className="font-mono ml-2">{sessionId}</span>
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}