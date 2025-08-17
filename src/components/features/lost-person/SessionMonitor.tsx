"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguageStore } from "@/store/language/languageStore";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import { useLiveSession } from "@/hooks/useLiveSession";
import NotificationService from "@/services/NotificationService";
import { AlertCircle, MapPin, User, Clock, Navigation } from "lucide-react";

interface SessionMonitorProps {
  profileId: string | null;
  currentSessionId?: string | null;
  onSessionUpdate?: (sessionData: Record<string, unknown>) => void;
}

export function SessionMonitor({ 
  currentSessionId,
  onSessionUpdate 
}: SessionMonitorProps) {
  const { currentLanguage } = useLanguageStore();
  const dir = getDirectionalClasses(currentLanguage);
  const notificationService = NotificationService.getInstance();
  
  const { sessionData, isConnected, error } = useLiveSession(currentSessionId || null);
  const [lastNotificationTime, setLastNotificationTime] = useState<number>(0);
  const [hasShownTrackingStarted, setHasShownTrackingStarted] = useState(false);

  // Handle session updates and send notifications
  useEffect(() => {
    if (!sessionData || !currentSessionId) return;

    // Notify parent component of session updates
    if (onSessionUpdate) {
      onSessionUpdate(sessionData as Record<string, unknown>);
    }

    const now = Date.now();
    const session = sessionData.session;
    const lostPerson = sessionData.lostPerson;

    // Notification for tracking started (only once per session)
    if (session?.status === 'active' && !hasShownTrackingStarted) {
      notificationService.notifyTrackingStarted(
        currentLanguage === 'ar' ? 'باحث غير معروف' : 'Unknown Searcher',
        currentLanguage
      );
      setHasShownTrackingStarted(true);
    }

    // Notification when searcher gets close (throttled to avoid spam)
    if (session?.searcher?.geopoint && lostPerson?.geopoint) {
      if (now - lastNotificationTime > 30000) { // 30 seconds throttle
        const distance = notificationService.calculateDistance(
          session.searcher.geopoint.latitude,
          session.searcher.geopoint.longitude,
          lostPerson.geopoint.latitude,
          lostPerson.geopoint.longitude
        );

        if (distance <= 100) { // Within 100 meters
          notificationService.notifySearcherNearby(distance, currentLanguage);
          setLastNotificationTime(now);
        }
      }
    }

    // Notification when session ends
    if (session?.status === 'ended') {
      notificationService.notifyTrackingEnded(currentLanguage);
    }

    // Notification when resolved
    if (sessionData.type === 'resolved') {
      notificationService.notifyResolved(currentLanguage);
    }
  }, [sessionData, currentSessionId, currentLanguage, hasShownTrackingStarted, lastNotificationTime, notificationService, onSessionUpdate]);

  // Reset tracking notification flag when session changes
  useEffect(() => {
    setHasShownTrackingStarted(false);
  }, [currentSessionId]);

  const calculateDistance = (coord1: { lat: number; lng: number }, coord2: { lat: number; lng: number }): number | null => {
    if (!coord1 || !coord2) return null;
    if (coord1.lat == null || coord1.lng == null || coord2.lat == null || coord2.lng == null) return null;
    return notificationService.calculateDistance(
      coord1.lat, coord1.lng,
      coord2.lat, coord2.lng
    );
  };

  const formatDistance = (distance: number): string => {
    if (distance < 1000) {
      return `${Math.round(distance)} ${currentLanguage === 'ar' ? 'متر' : 'm'}`;
    } else {
      return `${(distance / 1000).toFixed(1)} ${currentLanguage === 'ar' ? 'كم' : 'km'}`;
    }
  };

  const formatTime = (dateString: string | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (!currentSessionId) {
    return (
      <Card className="p-4 bg-gray-50">
        <div className={`text-center text-gray-500 ${dir.textAlign}`}>
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">
            {currentLanguage === 'ar' 
              ? 'لا توجد جلسات تتبع نشطة'
              : 'No active tracking sessions'
            }
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div className={`space-y-4 ${dir.textAlign}`}>
        {/* Session Status Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">
              {currentLanguage === 'ar' ? 'مراقب الجلسة' : 'Session Monitor'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? 'default' : 'destructive'} className="text-xs">
              {isConnected
                ? (currentLanguage === 'ar' ? 'متصل' : 'Connected')
                : (currentLanguage === 'ar' ? 'منقطع' : 'Disconnected')
              }
            </Badge>
            {sessionData?.session?.status && (
              <Badge 
                variant={sessionData.session.status === 'active' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {sessionData.session.status === 'active'
                  ? (currentLanguage === 'ar' ? 'نشط' : 'Active')
                  : (currentLanguage === 'ar' ? 'منتهي' : 'Ended')
                }
              </Badge>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}

        {/* Session Information */}
        {sessionData && (
          <div className="space-y-3">
            {/* Searcher Information */}
            {sessionData.session?.searcher?.geopoint && (
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-sm">
                    {currentLanguage === 'ar' ? 'موقع الباحث:' : 'Searcher Location:'}
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>
                      {typeof sessionData.session.searcher.geopoint.latitude === 'number' && typeof sessionData.session.searcher.geopoint.longitude === 'number'
                        ? `${sessionData.session.searcher.geopoint.latitude.toFixed(5)}, ${sessionData.session.searcher.geopoint.longitude.toFixed(5)}`
                        : 'Location unavailable'
                      }
                    </span>
                  </div>
                  {sessionData.lostPerson?.geopoint && sessionData.session?.searcher?.geopoint && (
                    <div className="flex items-center gap-1">
                      <span className="text-orange-600 font-medium">
                        {currentLanguage === 'ar' ? 'المسافة:' : 'Distance:'} 
                      </span>
                      <span>
                        {(() => {
                          try {
                            console.log('[SessionMonitor] Raw geopoint data:', {
                              searcherGeopoint: sessionData.session.searcher.geopoint,
                              lostPersonGeopoint: sessionData.lostPerson.geopoint
                            });

                            // Handle Firebase GeoPoint structure - can be either {latitude, longitude} or {_latitude, _longitude}
                            const searcherGeopoint = sessionData.session.searcher.geopoint as { latitude?: number; longitude?: number; _latitude?: number; _longitude?: number };
                            const lostPersonGeopoint = sessionData.lostPerson.geopoint as { latitude?: number; longitude?: number; _latitude?: number; _longitude?: number };
                            
                            // Extract coordinates with fallback for both formats
                            const searcherLat = searcherGeopoint._latitude || searcherGeopoint.latitude;
                            const searcherLng = searcherGeopoint._longitude || searcherGeopoint.longitude;
                            const lostPersonLat = lostPersonGeopoint._latitude || lostPersonGeopoint.latitude;
                            const lostPersonLng = lostPersonGeopoint._longitude || lostPersonGeopoint.longitude;

                            console.log('[SessionMonitor] Extracted coordinates:', {
                              searcher: { lat: searcherLat, lng: searcherLng },
                              lostPerson: { lat: lostPersonLat, lng: lostPersonLng }
                            });

                            // Validate all coordinates are numbers
                            if (typeof searcherLat !== 'number' || typeof searcherLng !== 'number' || 
                                typeof lostPersonLat !== 'number' || typeof lostPersonLng !== 'number') {
                              console.warn('[SessionMonitor] Invalid coordinates detected');
                              return 'N/A';
                            }

                            const distance = calculateDistance(
                              { lat: searcherLat, lng: searcherLng },
                              { lat: lostPersonLat, lng: lostPersonLng }
                            );

                            console.log('[SessionMonitor] Calculated distance:', distance);
                            return distance ? formatDistance(distance) : 'N/A';
                          } catch (error) {
                            console.error('[SessionMonitor] Error calculating distance:', error);
                            console.error('[SessionMonitor] Error details:', error);
                            return 'N/A';
                          }
                        })()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Your Location Information */}
            {sessionData.lostPerson?.geopoint?.latitude != null && sessionData.lostPerson?.geopoint?.longitude != null && (
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-sm">
                    {currentLanguage === 'ar' ? 'موقعك الحالي:' : 'Your Location:'}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  {typeof sessionData.lostPerson.geopoint.latitude === 'number' && typeof sessionData.lostPerson.geopoint.longitude === 'number'
                    ? `${sessionData.lostPerson.geopoint.latitude.toFixed(5)}, ${sessionData.lostPerson.geopoint.longitude.toFixed(5)}`
                    : 'Location unavailable'
                  }
                </div>
              </div>
            )}

            {/* Last Update Time */}
            {sessionData.session?.updatedAt && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>
                  {currentLanguage === 'ar' ? 'آخر تحديث:' : 'Last Update:'} 
                  {formatTime(sessionData.session.updatedAt)}
                </span>
              </div>
            )}

            {/* Status Messages */}
            {sessionData.session?.status === 'active' && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded text-sm">
                {currentLanguage === 'ar'
                  ? '🔍 يتم تتبعك الآن. يرجى البقاء في مكانك.'
                  : '🔍 You are being tracked. Please stay in place.'
                }
              </div>
            )}

            {sessionData.type === 'resolved' && (
              <div className="bg-green-100 border border-green-300 text-green-800 px-3 py-2 rounded text-sm">
                {currentLanguage === 'ar'
                  ? '🎉 تم العثور عليك! الحمد لله على سلامتك.'
                  : '🎉 You have been found! Glad you are safe!'
                }
              </div>
            )}

            {sessionData.session?.status === 'ended' && (
              <div className="bg-gray-100 border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm">
                {currentLanguage === 'ar'
                  ? '⏹️ تم إنهاء جلسة التتبع.'
                  : '⏹️ Tracking session has ended.'
                }
              </div>
            )}
          </div>
        )}

        {/* Help Instructions */}
        {sessionData?.session?.status === 'active' && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded text-xs">
            {currentLanguage === 'ar'
              ? 'نصائح: ابق في مكانك، تأكد من أن هاتفك مشحون، وانتظر وصول الباحث.'
              : 'Tips: Stay in place, keep your phone charged, and wait for the searcher to arrive.'
            }
          </div>
        )}
      </div>
    </Card>
  );
}