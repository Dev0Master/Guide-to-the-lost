import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLiveProfile } from "@/hooks/useLiveProfile";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useLanguageStore } from "@/store/language/languageStore";
import { RealTimeNavigationMap } from "@/components/features/navigation/RealTimeNavigationMap";
import { Navigation } from "lucide-react";

interface LiveTrackingProps {
  profileId: string;
  currentSessionId?: string | null;
  onClose?: () => void;
}

export function LiveTracking({ profileId, currentSessionId, onClose }: LiveTrackingProps) {
  const { currentLanguage } = useLanguageStore();
  const [locationTrackingEnabled, setLocationTrackingEnabled] = useState(true);
  const [showNavigation, setShowNavigation] = useState(false);

  // Real-time profile updates via SSE
  const { profileData, isConnected, error: sseError, disconnect } = useLiveProfile(profileId);

  // Location tracking
  const { 
    isTracking, 
    lastUpdate, 
    trackingError, 
    stopTracking 
  } = useLocationTracking(profileId, locationTrackingEnabled, 30000); // Update every 30 seconds

  const handleToggleLocationTracking = () => {
    if (isTracking) {
      stopTracking();
      setLocationTrackingEnabled(false);
    } else {
      setLocationTrackingEnabled(true);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    stopTracking();
    onClose?.();
  };

  const handleNavigationToggle = () => {
    setShowNavigation(!showNavigation);
  };

  if (showNavigation && currentSessionId) {
    return (
      <RealTimeNavigationMap
        sessionId={currentSessionId}
        userType="lost"
        profileId={profileId}
        onClose={() => setShowNavigation(false)}
      />
    );
  }

  return (
    <Card className="p-6 mt-6 border-green-200 bg-green-50">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-green-800">
            {currentLanguage === 'ar' ? 'التتبع المباشر' : 'Live Tracking'}
          </h3>
          <div className="flex gap-2">
            {currentSessionId && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNavigationToggle}
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                <Navigation className="w-4 h-4 mr-1" />
                {currentLanguage === 'ar' ? 'التوجيه المباشر' : 'Live Navigation'}
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDisconnect}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              {currentLanguage === 'ar' ? 'إيقاف التتبع' : 'Stop Tracking'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SSE Connection Status */}
          <div className="space-y-2">
            <h4 className="font-medium text-green-700">
              {currentLanguage === 'ar' ? 'حالة الاتصال المباشر' : 'Live Connection Status'}
            </h4>
            <div className="flex items-center space-x-2">
              <div 
                className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm">
                {isConnected 
                  ? (currentLanguage === 'ar' ? 'متصل' : 'Connected')
                  : (currentLanguage === 'ar' ? 'غير متصل' : 'Disconnected')
                }
              </span>
            </div>
            {sseError && (
              <p className="text-red-600 text-sm">{sseError}</p>
            )}
          </div>

          {/* Location Tracking Status */}
          <div className="space-y-2">
            <h4 className="font-medium text-green-700">
              {currentLanguage === 'ar' ? 'تتبع الموقع' : 'Location Tracking'}
            </h4>
            <div className="flex items-center space-x-2">
              <div 
                className={`w-3 h-3 rounded-full ${
                  isTracking ? 'bg-blue-500' : 'bg-gray-400'
                }`}
              />
              <span className="text-sm">
                {isTracking 
                  ? (currentLanguage === 'ar' ? 'نشط' : 'Active')
                  : (currentLanguage === 'ar' ? 'متوقف' : 'Stopped')
                }
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleLocationTracking}
                className="ml-2"
              >
                {isTracking 
                  ? (currentLanguage === 'ar' ? 'إيقاف' : 'Stop')
                  : (currentLanguage === 'ar' ? 'تشغيل' : 'Start')
                }
              </Button>
            </div>
            {trackingError && (
              <p className="text-red-600 text-sm">{trackingError}</p>
            )}
            {lastUpdate && (
              <p className="text-gray-600 text-sm">
                {currentLanguage === 'ar' ? 'آخر تحديث: ' : 'Last update: '}
                {lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {/* Profile Data Display */}
        {profileData && (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <h4 className="font-medium text-gray-700 mb-2">
              {currentLanguage === 'ar' ? 'بيانات الملف الشخصي المباشرة' : 'Live Profile Data'}
            </h4>
            <div className="text-sm space-y-1">
              <p><strong>{currentLanguage === 'ar' ? 'الاسم:' : 'Name:'}</strong> {profileData.displayName || 'N/A'}</p>
              <p><strong>{currentLanguage === 'ar' ? 'الحالة:' : 'Status:'}</strong> {profileData.status || 'Unknown'}</p>
              
              {/* Safe geopoint display with debugging */}
              {profileData.geopoint && (
                <p>
                  <strong>{currentLanguage === 'ar' ? 'الموقع:' : 'Location:'}</strong> 
                  {typeof profileData.geopoint.latitude === 'number' && typeof profileData.geopoint.longitude === 'number'
                    ? ` ${profileData.geopoint.latitude.toFixed(5)}, ${profileData.geopoint.longitude.toFixed(5)}`
                    : (currentLanguage === 'ar' ? ' الموقع غير متاح' : ' Location unavailable')
                  }
                </p>
              )}
              
              {/* Debug info (will be removed later) */}
              {process.env.NODE_ENV === 'development' && profileData.geopoint && (
                <p className="text-xs text-gray-400">
                  Debug: lat type: {typeof profileData.geopoint.latitude}, lng type: {typeof profileData.geopoint.longitude}
                </p>
              )}
              
              {profileData.updatedAt && (
                <p>
                  <strong>{currentLanguage === 'ar' ? 'آخر تحديث:' : 'Updated:'}</strong> 
                  {new Date(profileData.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-600 mt-4">
          <p>
            {currentLanguage === 'ar' 
              ? `معرف الملف الشخصي: ${profileId}`
              : `Profile ID: ${profileId}`
            }
          </p>
          <p>
            {currentLanguage === 'ar'
              ? 'سيتم تحديث موقعك تلقائياً كل 30 ثانية'
              : 'Your location will be updated automatically every 30 seconds'
            }
          </p>
        </div>
      </div>
    </Card>
  );
}