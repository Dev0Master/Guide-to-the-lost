"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguageStore } from "@/store/language/languageStore";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import { useApiData } from "@/hooks/useApi";
import { useLiveSession } from "@/hooks/useLiveSession";
import { useLiveProfile } from "@/hooks/useLiveProfile";
import { MapPin, Navigation, Users, Route, Clock, AlertCircle } from "lucide-react";
import { NavigationDebugPanel } from "@/components/debug/NavigationDebugPanel";

interface RealTimeNavigationMapProps {
  sessionId: string;
  userType: 'searcher' | 'lost';
  profileId?: string;
  onClose: () => void;
}

interface NavigationRoute {
  distance: number;
  estimatedTime: {
    minutes: number;
    seconds: number;
  };
  directions: string[];
  waypoints: Array<{ lat: number; lng: number }>;
}

export function RealTimeNavigationMap({ 
  sessionId, 
  userType,
  profileId,
  onClose 
}: RealTimeNavigationMapProps) {
  const { currentLanguage } = useLanguageStore();
  const dir = getDirectionalClasses(currentLanguage);
  
  // Real-time data hooks
  const { sessionData, isConnected: sessionConnected } = useLiveSession(sessionId);
  const { profileData, isConnected: profileConnected } = useLiveProfile(profileId || null);
  
  // Local state
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [navigationRoute, setNavigationRoute] = useState<NavigationRoute | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [locationError, setLocationError] = useState<string>("");
  const [lastRouteCalculation, setLastRouteCalculation] = useState<number>(0);
  
  // Refs for location tracking
  const watchIdRef = useRef<number | null>(null);
  
  // API hooks
  const { post: updateSearcherLocation } = useApiData(`/sessions/${sessionId}/searcher/location`);
  const { post: updateProfileLocation } = useApiData(profileId ? `/gfl/profiles/${profileId}/location` : '/gfl/profiles/dummy/location');
  const { post: calculateRoute } = useApiData('/navigation/route');
  const { get: getSessionRoute } = useApiData(`/navigation/sessions/${sessionId}/route`);
  
  // Start location tracking
  useEffect(() => {
    if ('geolocation' in navigator) {
      console.log(`[RealTimeNavigationMap] Starting location tracking for user type: ${userType}`);
      
      // Check permission status first
      if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
          console.log(`[RealTimeNavigationMap] Geolocation permission status: ${permissionStatus.state}`);
          
          if (permissionStatus.state === 'denied') {
            setLocationError(
              currentLanguage === 'ar'
                ? 'تم رفض إذن الموقع. يرجى تفعيل إذن الموقع من إعدادات المتصفح.'
                : 'Location permission denied. Please enable location permission in browser settings.'
            );
            return;
          }
        });
      }
      
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          console.log(`[RealTimeNavigationMap] Location updated:`, {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp).toISOString()
          });
          
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(coords);
          setLocationError("");
          
          // Update backend location based on user type
          updateLocationToBackend(coords);
        },
        (error) => {
          console.error('Location tracking error:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          
          let errorMessage = '';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = currentLanguage === 'ar'
                ? 'تم رفض إذن الموقع. يرجى تفعيل إذن الموقع وإعادة المحاولة.'
                : 'Location permission denied. Please enable location access and try again.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = currentLanguage === 'ar'
                ? 'الموقع غير متاح. تأكد من تفعيل GPS والاتصال بالإنترنت.'
                : 'Location unavailable. Please ensure GPS is enabled and you have internet connection.';
              break;
            case error.TIMEOUT:
              errorMessage = currentLanguage === 'ar'
                ? 'انتهت مهلة تحديد الموقع. يرجى المحاولة مرة أخرى.'
                : 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage = currentLanguage === 'ar'
                ? 'فشل في تتبع الموقع. يرجى التأكد من تفعيل خدمة الموقع.'
                : 'Failed to track location. Please ensure location service is enabled.';
          }
          
          setLocationError(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000 // 10 seconds
        }
      );
    } else {
      console.error('[RealTimeNavigationMap] Geolocation is not supported by this browser');
      setLocationError(
        currentLanguage === 'ar'
          ? 'متصفحك لا يدعم خدمة تحديد الموقع.'
          : 'Your browser does not support geolocation.'
      );
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [sessionId, profileId, userType]);

  // Calculate route when locations change
  useEffect(() => {
    const now = Date.now();
    if (now - lastRouteCalculation < 5000) return; // Throttle to every 5 seconds

    console.log('[RealTimeNavigationMap] Checking if route calculation should trigger:', {
      hasSearcherGeopoint: !!sessionData?.session?.searcher?.geopoint,
      hasLostPersonGeopoint: !!sessionData?.lostPerson?.geopoint,
      searcherGeopoint: sessionData?.session?.searcher?.geopoint,
      lostPersonGeopoint: sessionData?.lostPerson?.geopoint
    });

    if (sessionData?.session?.searcher?.geopoint && sessionData?.lostPerson?.geopoint) {
      calculateNavigationRoute();
      setLastRouteCalculation(now);
    }
  }, [sessionData?.session?.searcher?.geopoint, sessionData?.lostPerson?.geopoint]);

  const updateLocationToBackend = async (coords: {lat: number, lng: number}) => {
    try {
      console.log(`[RealTimeNavigationMap] Updating location to backend for ${userType}:`, coords);
      
      if (userType === 'searcher') {
        console.log(`[RealTimeNavigationMap] Updating searcher location for session: ${sessionId}`);
        // Update searcher location in session
        await updateSearcherLocation({
          data: coords,
          onSuccess: (response) => {
            console.log('[RealTimeNavigationMap] Searcher location updated successfully:', response);
          },
          onError: (error) => {
            console.error('[RealTimeNavigationMap] Failed to update searcher location:', error);
            console.error('[RealTimeNavigationMap] Error details:', error.response?.data || error.message);
          }
        });
      } else if (userType === 'lost' && profileId) {
        console.log(`[RealTimeNavigationMap] Updating profile location for profile: ${profileId}`);
        // Update lost person profile location
        await updateProfileLocation({
          data: coords,
          onSuccess: (response) => {
            console.log('[RealTimeNavigationMap] Profile location updated successfully:', response);
          },
          onError: (error) => {
            console.error('[RealTimeNavigationMap] Failed to update profile location:', error);
            console.error('[RealTimeNavigationMap] Error details:', error.response?.data || error.message);
          }
        });
      }
    } catch (error) {
      console.error('[RealTimeNavigationMap] Location update error:', error);
    }
  };

  const calculateNavigationRoute = async () => {
    if (!sessionData?.session?.searcher?.geopoint || !sessionData?.lostPerson?.geopoint) {
      console.log('[RealTimeNavigationMap] Cannot calculate route - missing location data:', {
        hasSearcherLocation: !!sessionData?.session?.searcher?.geopoint,
        hasLostPersonLocation: !!sessionData?.lostPerson?.geopoint
      });
      return;
    }

    console.log('[RealTimeNavigationMap] Calculating navigation route between:', {
      searcher: `${sessionData.session.searcher.geopoint.latitude}, ${sessionData.session.searcher.geopoint.longitude}`,
      lostPerson: `${sessionData.lostPerson.geopoint.latitude}, ${sessionData.lostPerson.geopoint.longitude}`
    });

    setIsCalculatingRoute(true);

    try {
      // Handle Firebase GeoPoint structure (_latitude/_longitude vs latitude/longitude)
      const searcherLat = sessionData.session.searcher.geopoint._latitude || sessionData.session.searcher.geopoint.latitude;
      const searcherLng = sessionData.session.searcher.geopoint._longitude || sessionData.session.searcher.geopoint.longitude;
      const lostLat = sessionData.lostPerson.geopoint._latitude || sessionData.lostPerson.geopoint.latitude;
      const lostLng = sessionData.lostPerson.geopoint._longitude || sessionData.lostPerson.geopoint.longitude;

      console.log('[RealTimeNavigationMap] Extracted coordinates:', {
        searcher: { lat: searcherLat, lng: searcherLng },
        lostPerson: { lat: lostLat, lng: lostLng }
      });

      // Check if coordinates are identical (person found)
      const distance = Math.sqrt(
        Math.pow(searcherLat - lostLat, 2) + Math.pow(searcherLng - lostLng, 2)
      );
      
      if (distance < 0.0001) { // Very close coordinates (less than ~10 meters)
        console.log('[RealTimeNavigationMap] Searcher and lost person are at the same location!');
        setNavigationRoute({
          distance: 0,
          estimatedTime: { minutes: 0, seconds: 0 },
          directions: [currentLanguage === 'ar' ? 'لقد وصلت! الشخص المفقود في موقعك الحالي.' : 'You have arrived! The lost person is at your current location.'],
          waypoints: [{ lat: searcherLat, lng: searcherLng }]
        });
        return;
      }

      await calculateRoute({
        data: {
          fromLat: searcherLat,
          fromLng: searcherLng,
          toLat: lostLat,
          toLng: lostLng
        },
        onSuccess: (response) => {
          console.log('[RealTimeNavigationMap] Route calculated successfully:', response);
          setNavigationRoute(response.data || response);
        },
        onError: (error) => {
          console.error('[RealTimeNavigationMap] Failed to calculate route:', error);
          console.error('[RealTimeNavigationMap] Route error details:', error.response?.data || error.message);
        }
      });
    } catch (error) {
      console.error('[RealTimeNavigationMap] Route calculation error:', error);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  const formatDistance = (distance: number): string => {
    if (distance < 1000) {
      return `${Math.round(distance)} ${currentLanguage === 'ar' ? 'متر' : 'm'}`;
    } else {
      return `${(distance / 1000).toFixed(1)} ${currentLanguage === 'ar' ? 'كم' : 'km'}`;
    }
  };

  const formatTime = (time: { minutes: number; seconds: number }): string => {
    if (time.minutes > 0) {
      return `${time.minutes} ${currentLanguage === 'ar' ? 'دقيقة' : 'min'} ${time.seconds} ${currentLanguage === 'ar' ? 'ثانية' : 'sec'}`;
    } else {
      return `${time.seconds} ${currentLanguage === 'ar' ? 'ثانية' : 'seconds'}`;
    }
  };

  const searcherLocation = sessionData?.session?.searcher?.geopoint;
  const lostPersonLocation = sessionData?.lostPerson?.geopoint || profileData?.geopoint;
  const bothLocationsAvailable = searcherLocation && lostPersonLocation;

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Navigation className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className={`text-xl font-semibold ${dir.textAlign}`}>
                {currentLanguage === 'ar' ? 'التوجيه المباشر' : 'Real-Time Navigation'}
              </h2>
              <p className={`text-sm text-gray-600 ${dir.textAlign}`}>
                {userType === 'searcher' 
                  ? (currentLanguage === 'ar' ? 'توجيه للوصول للشخص المفقود' : 'Navigation to lost person')
                  : (currentLanguage === 'ar' ? 'مراقبة حية للباحث' : 'Live searcher tracking')
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={sessionConnected && profileConnected ? 'default' : 'destructive'}>
              {sessionConnected && profileConnected
                ? (currentLanguage === 'ar' ? 'متصل' : 'Connected')
                : (currentLanguage === 'ar' ? 'منقطع' : 'Disconnected')
              }
            </Badge>
            <Button variant="outline" size="sm" onClick={onClose}>
              {currentLanguage === 'ar' ? 'إغلاق' : 'Close'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Connection Status */}
      {(!sessionConnected || !profileConnected) && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800">
              {currentLanguage === 'ar' 
                ? 'جاري إعادة الاتصال بالخدمة المباشرة...'
                : 'Reconnecting to live service...'
              }
            </span>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Real-time Locations */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-green-600" />
            <h3 className={`font-semibold ${dir.textAlign}`}>
              {currentLanguage === 'ar' ? 'المواقع المباشرة' : 'Live Locations'}
            </h3>
          </div>

          <div className="space-y-3">
            {/* Searcher Location */}
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-blue-900">
                  {currentLanguage === 'ar' ? 'موقع الباحث:' : 'Searcher Location:'}
                </span>
              </div>
              {searcherLocation ? (
                <p className="text-sm text-blue-700 font-mono">
                  {(() => {
                    const lat = searcherLocation._latitude || searcherLocation.latitude;
                    const lng = searcherLocation._longitude || searcherLocation.longitude;
                    return (typeof lat === 'number' && typeof lng === 'number')
                      ? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
                      : 'Invalid coordinates';
                  })()}
                </p>
              ) : (
                <p className="text-sm text-blue-600">
                  {currentLanguage === 'ar' ? 'غير متاح' : 'Not available'}
                </p>
              )}
            </div>

            {/* Lost Person Location */}
            <div className="bg-red-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-red-900">
                  {currentLanguage === 'ar' ? 'موقع الشخص المفقود:' : 'Lost Person Location:'}
                </span>
              </div>
              {lostPersonLocation ? (
                <p className="text-sm text-red-700 font-mono">
                  {(() => {
                    const lat = lostPersonLocation._latitude || lostPersonLocation.latitude;
                    const lng = lostPersonLocation._longitude || lostPersonLocation.longitude;
                    return (typeof lat === 'number' && typeof lng === 'number')
                      ? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
                      : 'Invalid coordinates';
                  })()}
                </p>
              ) : (
                <p className="text-sm text-red-600">
                  {currentLanguage === 'ar' ? 'غير متاح' : 'Not available'}
                </p>
              )}
            </div>

            {/* Your Current Location */}
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${currentLocation ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                <span className="font-medium text-green-900">
                  {currentLanguage === 'ar' ? 'موقعك الحالي:' : 'Your Current Location:'}
                </span>
              </div>
              {currentLocation ? (
                <p className="text-sm text-green-700 font-mono">
                  {typeof currentLocation.lat === 'number' && typeof currentLocation.lng === 'number'
                    ? `${currentLocation.lat.toFixed(5)}, ${currentLocation.lng.toFixed(5)}`
                    : 'Invalid coordinates'
                  }
                </p>
              ) : (
                <p className="text-sm text-green-600">
                  {currentLanguage === 'ar' ? 'جاري التحديد...' : 'Locating...'}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Navigation Information */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Route className="w-5 h-5 text-purple-600" />
            <h3 className={`font-semibold ${dir.textAlign}`}>
              {currentLanguage === 'ar' ? 'معلومات التوجيه' : 'Navigation Info'}
            </h3>
            {isCalculatingRoute && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
            )}
          </div>

          {bothLocationsAvailable ? (
            <div className="space-y-3">
              {navigationRoute ? (
                <>
                  {/* Special display for when person is found */}
                  {navigationRoute.distance === 0 ? (
                    <div className="bg-green-50 rounded-lg p-4 text-center border-2 border-green-200">
                      <div className="text-green-600 text-2xl mb-2">🎉</div>
                      <h4 className="font-bold text-green-900 mb-2">
                        {currentLanguage === 'ar' ? 'تم العثور على الشخص المفقود!' : 'Lost Person Found!'}
                      </h4>
                      <p className="text-green-700">
                        {currentLanguage === 'ar' 
                          ? 'أنت والشخص المفقود في نفس الموقع'
                          : 'You and the lost person are at the same location'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-purple-900">
                          {currentLanguage === 'ar' ? 'المسافة:' : 'Distance:'}
                        </span>
                        <span className="text-purple-700 font-mono">
                          {formatDistance(navigationRoute.distance)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-purple-900">
                          {currentLanguage === 'ar' ? 'الوقت المتوقع:' : 'Estimated Time:'}
                        </span>
                        <span className="text-purple-700 font-mono">
                          {formatTime(navigationRoute.estimatedTime)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Directions */}
                  {navigationRoute.directions && navigationRoute.directions.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                      <h4 className={`font-medium mb-2 ${dir.textAlign}`}>
                        {currentLanguage === 'ar' ? 'التوجيهات:' : 'Directions:'}
                      </h4>
                      <ol className={`text-sm space-y-1 ${dir.textAlign}`}>
                        {navigationRoute.directions.map((direction, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-xs bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{direction}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">
                    {currentLanguage === 'ar' ? 'جاري حساب المسار...' : 'Calculating route...'}
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2"
                    onClick={calculateNavigationRoute}
                    disabled={isCalculatingRoute}
                  >
                    {currentLanguage === 'ar' ? 'إعادة حساب' : 'Recalculate'}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">
                {currentLanguage === 'ar' 
                  ? 'في انتظار مواقع كلا الطرفين...'
                  : 'Waiting for both locations...'
                }
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Status Updates */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-indigo-600" />
          <h3 className={`font-semibold ${dir.textAlign}`}>
            {currentLanguage === 'ar' ? 'آخر التحديثات' : 'Recent Updates'}
          </h3>
        </div>
        <div className="space-y-2 text-sm">
          {sessionData?.session?.updatedAt && (
            <p className={`text-gray-600 ${dir.textAlign}`}>
              {currentLanguage === 'ar' ? 'آخر تحديث للجلسة:' : 'Last session update:'} 
              <span className="ml-2 font-mono">
                {new Date(sessionData.session.updatedAt).toLocaleTimeString()}
              </span>
            </p>
          )}
          {profileData?.updatedAt && (
            <p className={`text-gray-600 ${dir.textAlign}`}>
              {currentLanguage === 'ar' ? 'آخر تحديث للموقع:' : 'Last location update:'} 
              <span className="ml-2 font-mono">
                {new Date(profileData.updatedAt).toLocaleTimeString()}
              </span>
            </p>
          )}
        </div>
      </Card>

      {/* Error Messages */}
      {locationError && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{locationError}</span>
          </div>
        </Card>
      )}

      {/* Debug Panel */}
      <NavigationDebugPanel
        sessionId={sessionId}
        profileId={profileId}
        sessionData={sessionData}
        profileData={profileData}
        sessionConnected={sessionConnected}
        profileConnected={profileConnected}
        sessionError={sessionData?.error || null}
        profileError={profileData?.error || null}
        currentLocation={currentLocation}
        locationError={locationError}
        navigationRoute={navigationRoute}
        onRefreshConnections={() => {
          // Force refresh connections
          window.location.reload();
        }}
      />
    </div>
  );
}