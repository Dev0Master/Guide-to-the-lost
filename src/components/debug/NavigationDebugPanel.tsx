"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguageStore } from "@/store/language/languageStore";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import { 
  Bug, 
  Wifi, 
  WifiOff, 
  MapPin, 
  Navigation, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

interface NavigationDebugPanelProps {
  sessionId?: string;
  profileId?: string;
  sessionData?: Record<string, unknown>;
  profileData?: Record<string, unknown>;
  sessionConnected?: boolean;
  profileConnected?: boolean;
  sessionError?: string | null;
  profileError?: string | null;
  currentLocation?: { lat: number; lng: number } | null;
  locationError?: string;
  navigationRoute?: Record<string, unknown>;
  onRefreshConnections?: () => void;
}

export function NavigationDebugPanel({
  sessionId,
  profileId,
  sessionData,
  profileData,
  sessionConnected,
  profileConnected,
  sessionError,
  profileError,
  currentLocation,
  locationError,
  navigationRoute,
  onRefreshConnections
}: NavigationDebugPanelProps) {
  const { currentLanguage } = useLanguageStore();
  const dir = getDirectionalClasses(currentLanguage);
  const [isExpanded, setIsExpanded] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    if (sessionConnected !== undefined) {
      setDebugLogs(prev => [...prev, `${timestamp} - Session connection: ${sessionConnected ? 'Connected' : 'Disconnected'}`].slice(-10));
    }
  }, [sessionConnected]);

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    if (profileConnected !== undefined) {
      setDebugLogs(prev => [...prev, `${timestamp} - Profile connection: ${profileConnected ? 'Connected' : 'Disconnected'}`].slice(-10));
    }
  }, [profileConnected]);

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    if (currentLocation) {
      setDebugLogs(prev => [...prev, `${timestamp} - Location updated: ${currentLocation.lat.toFixed(5)}, ${currentLocation.lng.toFixed(5)}`].slice(-10));
    }
  }, [currentLocation]);

  const getConnectionStatus = () => {
    if (sessionConnected && profileConnected) return 'success';
    if (!sessionConnected && !profileConnected) return 'error';
    return 'warning';
  };

  const getConnectionIcon = () => {
    const status = getConnectionStatus();
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  return (
    <Card className="p-4 bg-gray-50 border-dashed border-2">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-purple-600" />
          <h3 className={`font-semibold text-purple-900 ${dir.textAlign}`}>
            {currentLanguage === 'ar' ? 'لوحة التشخيص' : 'Debug Panel'}
          </h3>
          {getConnectionIcon()}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onRefreshConnections}
            className="p-2"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded 
              ? (currentLanguage === 'ar' ? 'إخفاء' : 'Hide')
              : (currentLanguage === 'ar' ? 'إظهار' : 'Show')
            }
          </Button>
        </div>
      </div>

      {/* Connection Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            {sessionConnected ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-red-600" />}
            <span className="text-xs font-medium">Session SSE</span>
          </div>
          <Badge variant={sessionConnected ? 'default' : 'destructive'} className="text-xs">
            {sessionConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            {profileConnected ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-red-600" />}
            <span className="text-xs font-medium">Profile SSE</span>
          </div>
          <Badge variant={profileConnected ? 'default' : 'destructive'} className="text-xs">
            {profileConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium">Location</span>
          </div>
          <Badge variant={currentLocation ? 'default' : 'secondary'} className="text-xs">
            {currentLocation ? 'Available' : 'Unavailable'}
          </Badge>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Navigation className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-medium">Route</span>
          </div>
          <Badge variant={navigationRoute ? 'default' : 'secondary'} className="text-xs">
            {navigationRoute ? 'Calculated' : 'Pending'}
          </Badge>
        </div>
      </div>

      {/* Errors */}
      {((sessionError && sessionError !== 'undefined' && sessionError.trim() !== '') || 
        (profileError && profileError !== 'undefined' && profileError.trim() !== '') || 
        (locationError && locationError.trim() !== '')) && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-red-900 mb-2">Active Errors:</h4>
          <div className="space-y-1">
            {sessionError && sessionError !== 'undefined' && sessionError.trim() !== '' && (
              <div className="text-xs p-2 bg-red-100 text-red-800 rounded">
                Session: {sessionError}
              </div>
            )}
            {profileError && profileError !== 'undefined' && profileError.trim() !== '' && (
              <div className="text-xs p-2 bg-red-100 text-red-800 rounded">
                Profile: {profileError}
              </div>
            )}
            {locationError && locationError.trim() !== '' && (
              <div className="text-xs p-2 bg-red-100 text-red-800 rounded">
                Location: {locationError}
              </div>
            )}
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="space-y-3">
          {/* IDs */}
          <div>
            <h4 className="text-sm font-medium mb-2">IDs:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-medium">Session ID:</span>
                <div className="font-mono bg-gray-200 p-1 rounded mt-1">{sessionId || 'N/A'}</div>
              </div>
              <div>
                <span className="font-medium">Profile ID:</span>
                <div className="font-mono bg-gray-200 p-1 rounded mt-1">{profileId || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Current Location */}
          {currentLocation && (
            <div>
              <h4 className="text-sm font-medium mb-2">Current Location:</h4>
              <div className="text-xs font-mono bg-green-100 p-2 rounded">
                Lat: {currentLocation.lat.toFixed(6)}<br />
                Lng: {currentLocation.lng.toFixed(6)}
              </div>
            </div>
          )}

          {/* Session Data */}
          {sessionData && (
            <div>
              <h4 className="text-sm font-medium mb-2">Session Data:</h4>
              <div className="text-xs font-mono bg-blue-100 p-2 rounded max-h-32 overflow-y-auto">
                <pre>{JSON.stringify(sessionData, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* Profile Data */}
          {profileData && (
            <div>
              <h4 className="text-sm font-medium mb-2">Profile Data:</h4>
              <div className="text-xs font-mono bg-yellow-100 p-2 rounded max-h-32 overflow-y-auto">
                <pre>{JSON.stringify(profileData, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* Navigation Route */}
          {navigationRoute && (
            <div>
              <h4 className="text-sm font-medium mb-2">Navigation Route:</h4>
              <div className="text-xs font-mono bg-purple-100 p-2 rounded max-h-32 overflow-y-auto">
                <pre>{JSON.stringify(navigationRoute, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* Debug Logs */}
          <div>
            <h4 className="text-sm font-medium mb-2">Recent Events:</h4>
            <div className="text-xs bg-gray-200 p-2 rounded max-h-32 overflow-y-auto">
              {debugLogs.length > 0 ? (
                debugLogs.map((log, index) => (
                  <div key={index} className="mb-1">{log}</div>
                ))
              ) : (
                <div className="text-gray-500">No events yet...</div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}