import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLiveProfile } from "@/hooks/useLiveProfile";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useLanguageStore } from "@/store/language/languageStore";
import { RealTimeNavigationMap } from "@/components/features/navigation/RealTimeNavigationMap";
import { LostPersonNavigationInterface } from "@/components/features/navigation/LostPersonNavigationInterface";
import { Navigation } from "lucide-react";
import { lostPersonTranslations, navigationTranslations, getFeatureTranslations } from "@/localization";

interface LiveTrackingProps {
  profileId: string;
  currentSessionId?: string | null;
  onClose?: () => void;
}

export function LiveTracking({ profileId, currentSessionId, onClose }: LiveTrackingProps) {
  const { currentLanguage } = useLanguageStore();
  const t = getFeatureTranslations(lostPersonTranslations, currentLanguage);
  const navT = getFeatureTranslations(navigationTranslations, currentLanguage);
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

  // Auto-show navigation interface when an active session is detected
  useEffect(() => {
    if (currentSessionId && !showNavigation) {
      // Automatically show navigation interface when session becomes active
      setShowNavigation(true);
    }
  }, [currentSessionId, showNavigation]);

  if (showNavigation && currentSessionId) {
    return (
      <LostPersonNavigationInterface
        sessionId={currentSessionId}
        profileId={profileId}
        searcherName={undefined} // Could be extracted from session data if needed
        onClose={() => setShowNavigation(false)}
      />
    );
  }

  return (
    <Card className="p-6 mt-6 border-green-200 bg-green-50">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-green-800">
            {navT.liveTracking.title}
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
                {navT.liveTracking.liveNavigation}
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDisconnect}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              {navT.liveTracking.stopTracking}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SSE Connection Status */}
          <div className="space-y-2">
            <h4 className="font-medium text-green-700">
              {navT.liveTracking.connectionStatus}
            </h4>
            <div className="flex items-center space-x-2">
              <div 
                className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm">
                {isConnected 
                  ? navT.status.connected
                  : navT.status.disconnected
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
              {navT.liveTracking.locationTracking}
            </h4>
            <div className="flex items-center space-x-2">
              <div 
                className={`w-3 h-3 rounded-full ${
                  isTracking ? 'bg-blue-500' : 'bg-gray-400'
                }`}
              />
              <span className="text-sm">
                {isTracking 
                  ? navT.liveTracking.trackingActive
                  : navT.liveTracking.trackingInactive
                }
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleLocationTracking}
                className="ml-2"
              >
                {isTracking 
                  ? navT.actions.stop
                  : navT.actions.start
                }
              </Button>
            </div>
            {trackingError && (
              <p className="text-red-600 text-sm">{trackingError}</p>
            )}
            {lastUpdate && (
              <p className="text-gray-600 text-sm">
                {navT.liveTracking.lastUpdate} 
                {lastUpdate.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {/* Profile Data Display */}
        {profileData && (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <h4 className="font-medium text-gray-700 mb-2">
              {navT.liveTracking.profileData}
            </h4>
            <div className="text-sm space-y-1">
              <p><strong>{navT.liveTracking.profileFields.name}</strong> {profileData.displayName || 'N/A'}</p>
              <p><strong>Status:</strong> {profileData.status || 'Unknown'}</p>
              
              {/* Safe geopoint display with debugging */}
              {profileData.geopoint && (
                <p>
                  <strong>Location:</strong> 
                  {typeof profileData.geopoint.latitude === 'number' && typeof profileData.geopoint.longitude === 'number'
                    ? ` ${profileData.geopoint.latitude.toFixed(5)}, ${profileData.geopoint.longitude.toFixed(5)}`
                    : ` ${navT.errors.locationUnavailable}`
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
                  <strong>{navT.liveTracking.lastUpdate}</strong> 
                  {new Date(profileData.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-600 mt-4">
          <p>
            {navT.liveTracking.profileId} {profileId}
          </p>
          <p>
            {navT.liveTracking.updateFrequency}
          </p>
        </div>
      </div>
    </Card>
  );
}