"use client";

import { useState, useEffect } from "react";
import { useApiData } from "@/hooks/useApi";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PersonalInfoForm } from "@/components/features/lost-person/PersonalInfoForm";
import { FormActions } from "@/components/features/lost-person/FormActions";
import { RealTimeNavigationMap } from "@/components/features/navigation/RealTimeNavigationMap";
// Cleaned: removed unused NotificationService import
import { useLanguageStore } from "@/store/language/languageStore";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { AlertDialog, useAlertDialog } from "@/components/ui/alert-dialog";
import { lostPersonTranslations, errorTranslations, getFeatureTranslations } from "@/localization";
import { getDirectionalClasses } from "@/lib/rtl-utils";

export default function LostPersonPage() {
  const { currentLanguage } = useLanguageStore();
  const { alertProps, showAlert } = useAlertDialog();
  const t = getFeatureTranslations(lostPersonTranslations, currentLanguage);
  const errorT = getFeatureTranslations(errorTranslations, currentLanguage);
  
  // State declarations first
  const [formData, setFormData] = useState({
    displayName: "",
    description: "",
    contact: "",
  });

  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdProfileId, setCreatedProfileId] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionTransitioning, setSessionTransitioning] = useState(false);
  const [lastSearcherName, setLastSearcherName] = useState<string>('');
  
  // Check for existing profile ID on mount
  useEffect(() => {
    const existingProfileId = localStorage.getItem('userProfileId');
    if (existingProfileId) {
      setCreatedProfileId(existingProfileId);
    }
  }, []);
  
  // Session restoration effect - validate any stored session on page load
  useEffect(() => {
    if (!createdProfileId) return;
    
    const storedSessionId = localStorage.getItem(`activeSession_${createdProfileId}`);
    if (storedSessionId && !currentSessionId) {
      console.log('[LostPersonPage] Found stored session on mount, validating:', storedSessionId);
      
      // Validate the stored session immediately
      const validateStoredSession = async () => {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3010/api';
          const response = await fetch(`${baseUrl}/sessions/${storedSessionId}/status`);
          
          if (response.ok) {
            const sessionData = await response.json();
            console.log('[LostPersonPage] Stored session validation result:', sessionData);
            
            if (sessionData.exists && sessionData.status === 'active') {
              console.log('[LostPersonPage] Restoring valid stored session:', storedSessionId);
              setCurrentSessionId(storedSessionId);
            } else {
              console.log('[LostPersonPage] Stored session is ended/invalid - cleaning up');
              localStorage.removeItem(`activeSession_${createdProfileId}`);
              
              // Show user feedback that session was cleaned up
              setLocationError(t.cleanedEndedSession);
              setTimeout(() => setLocationError(''), 3000);
            }
          } else {
            console.log('[LostPersonPage] Could not validate stored session - will be handled by polling');
          }
        } catch (error) {
          console.log('[LostPersonPage] Session validation error:', error);
          // Don't clear the session yet - let the polling handle it
        }
      };
      
      validateStoredSession();
    }
  }, [createdProfileId, currentLanguage]); // Don't include currentSessionId to avoid loops

  // Listen for session ended events for smooth transitions
  useEffect(() => {
    const handleSessionEnded = (event: CustomEvent) => {
      const { sessionId, reason } = event.detail;
      console.log('[LostPersonPage] Session ended event received:', { sessionId, reason });
      
      if (sessionId === currentSessionId) {
        setSessionTransitioning(true);
        setLocationError(t.sessionEnded + ' ' + (t.waitingForSearcher || 'Waiting for next searcher...'));
        
        // Clear transitioning state after 3 seconds
        setTimeout(() => {
          setSessionTransitioning(false);
          if (locationError.includes(t.sessionEnded)) {
            setLocationError('');
          }
        }, 3000);
      }
    };

    window.addEventListener('sessionEnded', handleSessionEnded as EventListener);
    
    return () => {
      window.removeEventListener('sessionEnded', handleSessionEnded as EventListener);
    };
  }, [currentSessionId, t.sessionEnded, t.waitingForSearcher, locationError]);
  // Cleaned: removed unused showLiveTracking, notificationRequested, setNotificationPermission

  // API hook for profile creation
  const { post } = useApiData('/gfl/profiles');
  
  // Continuous location tracking for registered lost persons
  const { isTracking, lastUpdate, trackingError } = useLocationTracking(
    createdProfileId, // Enable tracking when profile is created
    !!createdProfileId, // Only track when registered
    30000 // Update every 30 seconds
  );
  
  // Cleaned: removed unused notificationService
  
  // Notification permission logic removed for lightweight MVP
  
  // Request notification permission when profile is created and tracking is enabled
  // Notification logic removed for lightweight MVP
  
  // Check for active sessions periodically
  useEffect(() => {
    if (!createdProfileId) return;
    
    const checkForSessions = async () => {
      // Check for stored session first (in case same browser created session)
      const storedSessionId = localStorage.getItem(`activeSession_${createdProfileId}`);
      
      console.log('[LostPersonPage] Session check:', {
        storedSessionId,
        currentSessionId,
        hasStoredButNoCurrent: !!storedSessionId && !currentSessionId
      });
      
      // Check backend for active sessions for this profile
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3010/api';
        const response = await fetch(`${baseUrl}/gfl/profiles/${createdProfileId}/sessions/active`);
        if (response.ok) {
          const data = await response.json();
          console.log('[LostPersonPage] Backend session check response:', data);
          
          // Handle different response structures
          const sessionId = data.sessionId || data.data?.sessionId || (data.sessions && data.sessions.length > 0 ? data.sessions[0].sessionId : null);
          
          if (sessionId && sessionId !== currentSessionId) {
            console.log('[LostPersonPage] Found active session from backend:', sessionId);
            setCurrentSessionId(sessionId);
            localStorage.setItem(`activeSession_${createdProfileId}`, sessionId);
          } else if (!sessionId) {
            // No active session found - need to clear any stored session data
            console.log('[LostPersonPage] No active session from backend');
            
            // Clear current session if we have one
            if (currentSessionId) {
              console.log('[LostPersonPage] Clearing current session - session ended');
              setCurrentSessionId(null);
              setSessionTransitioning(true);
              setLocationError(t.sessionEnded);
              setTimeout(() => {
                setLocationError('');
                setSessionTransitioning(false);
              }, 3000);
            }
            
            // CRITICAL FIX: Also clear stored session even if currentSessionId is null
            // This handles the case where localStorage has stale data after page refresh
            if (storedSessionId) {
              console.log('[LostPersonPage] Clearing stale stored session:', storedSessionId);
              localStorage.removeItem(`activeSession_${createdProfileId}`);
              
              // If we had a stored session but no current session, it means we need to show feedback
              if (!currentSessionId) {
                setLocationError(t.cleanedEndedSession);
                setTimeout(() => setLocationError(''), 3000);
              }
            }
          } else if (sessionId === currentSessionId) {
            // Session is still active and matches current - all good
            console.log('[LostPersonPage] Session still active:', sessionId);
          }
        } else if (response.status === 404) {
          // Profile not found or no sessions - clear ALL session data
          console.log('[LostPersonPage] Profile/sessions not found - clearing all session state');
          if (currentSessionId) {
            setCurrentSessionId(null);
          }
          if (storedSessionId) {
            localStorage.removeItem(`activeSession_${createdProfileId}`);
          }
        } else {
          console.log('[LostPersonPage] API error or no sessions:', response.status);
          // For other errors, clean up stale localStorage but keep current session if valid
          if (storedSessionId && !currentSessionId) {
            console.log('[LostPersonPage] API error - cleaning stale stored session');
            localStorage.removeItem(`activeSession_${createdProfileId}`);
          }
        }
      } catch (error) {
        console.log('[LostPersonPage] Session check failed:', error);
        
        // If API fails, we need to handle stored sessions carefully
        if (storedSessionId && !currentSessionId) {
          // We have a stored session but no current session - this could be a valid session
          // that we need to restore, or it could be stale data
          console.log('[LostPersonPage] API failed, attempting to restore stored session:', storedSessionId);
          
          // Try to validate the stored session by checking it directly
          try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3010/api';
            const sessionResponse = await fetch(`${baseUrl}/sessions/${storedSessionId}/status`);
            if (sessionResponse.ok) {
              const sessionData = await sessionResponse.json();
              if (sessionData.exists && sessionData.status === 'active') {
                console.log('[LostPersonPage] Stored session is valid - restoring:', storedSessionId);
                setCurrentSessionId(storedSessionId);
              } else {
                console.log('[LostPersonPage] Stored session is invalid - cleaning up:', sessionData);
                localStorage.removeItem(`activeSession_${createdProfileId}`);
              }
            } else {
              console.log('[LostPersonPage] Could not validate stored session - keeping for now');
              // Keep stored session but don't restore to avoid false positives
            }
          } catch (sessionError) {
            console.log('[LostPersonPage] Session validation failed - keeping stored session for now:', sessionError);
          }
        }
      }
    };
    
    // Initial session check
    checkForSessions();
    
    // More frequent polling during active sessions for better session end detection
    // Also consider stored sessions when determining poll frequency
    const hasActiveOrStoredSession = currentSessionId || localStorage.getItem(`activeSession_${createdProfileId}`);
    const pollInterval = hasActiveOrStoredSession ? 2000 : 5000; // 2s during session, 5s while waiting
    const interval = setInterval(checkForSessions, pollInterval);
    
    return () => clearInterval(interval);
  }, [createdProfileId, currentSessionId]);

  // Additional session state monitoring - ensure we return to waiting state on connection issues
  useEffect(() => {
    if (!createdProfileId || !currentSessionId) return;
    
    // Monitor for session that may have ended abruptly
    const monitorSession = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3010/api';
        const response = await fetch(`${baseUrl}/sessions/${currentSessionId}/status`);
        
        if (!response.ok || response.status === 404) {
          console.log('[LostPersonPage] Session monitoring: session no longer exists - clearing state');
          setCurrentSessionId(null);
          localStorage.removeItem(`activeSession_${createdProfileId}`);
          
          setLocationError(t.sessionEnded);
          setTimeout(() => setLocationError(''), 3000);
          return;
        }
        
        const sessionData = await response.json();
        if (!sessionData.exists || sessionData.status === 'ended') {
          console.log('[LostPersonPage] Session monitoring: session ended - clearing state');
          setCurrentSessionId(null);
          localStorage.removeItem(`activeSession_${createdProfileId}`);
          
          setLocationError(t.sessionEnded);
          setTimeout(() => setLocationError(''), 3000);
        }
      } catch (error) {
        // Network error - don't clear session immediately, just log
        console.log('[LostPersonPage] Session monitoring network error:', error);
      }
    };
    
    // Check session status every 3 seconds when we have an active session
    const interval = setInterval(monitorSession, 3000);
    
    return () => clearInterval(interval);
  }, [createdProfileId, currentSessionId, currentLanguage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coordinates) {
      setLocationError(t.waitLocation);
      return;
    }
    setIsSubmitting(true);
    setLocationError("");
    try {
      const profileData = {
        displayName: formData.displayName,
        description: formData.description,
        contact: formData.contact,
        lat: coordinates.lat,
        lng: coordinates.lng,
      };
      await post({
        data: profileData,
        onSuccess: (apiResponse) => {
          const response = apiResponse as Record<string, unknown>;
          const profileId = (response.data as Record<string, unknown>)?.id || response.id || ((response.data as Record<string, unknown>)?.data as Record<string, unknown>)?.id;
          if (profileId) {
            const profileIdStr = String(profileId);
            setCreatedProfileId(profileIdStr);
            localStorage.setItem('userProfileId', profileIdStr);
            showAlert({
              type: 'success',
              title: t.successTitle,
              description: t.successMessage,
              autoClose: 3000,
              hideClose: true
            });
          } else {
            showAlert({
              type: 'success',
              title: t.successTitle,
              description: t.successMessage,
              autoClose: 3000,
              hideClose: true
            });
            const tempId = "temp-id-" + Date.now();
            setCreatedProfileId(tempId);
            localStorage.setItem('userProfileId', tempId);
          }
        },
        onError: () => {
          setLocationError(errorT.data.saveFailedMessage);
        }
      });
    } catch {
      setLocationError(errorT.general.unexpectedError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationDetected = (coords: { lat: number; lng: number }) => {
    setCoordinates(coords);
    setLocationError("");
  };

  const handleLocationError = (error: string) => {
    setLocationError(error);
    setCoordinates(null);
  };

  const handleReRegisterInfo = () => {
    showAlert({
      type: 'warning',
      title: t.confirmReRegister,
      description: t.reRegisterWarning,
      confirmText: t.confirmButton,
      cancelText: t.cancelButton,
      showCancel: true,
      onConfirm: () => {
        // Clear all saved data and reset to registration form
        localStorage.removeItem('userProfileId');
        setCreatedProfileId(null);
        setCurrentSessionId(null);
        setFormData({
          displayName: "",
          description: "",
          contact: "",
        });
        setCoordinates(null);
      }
    });
  };

  const isFormValid = Boolean(formData.displayName && coordinates);

  return (
    <div className="min-h-screen bg-background">
      {createdProfileId ? (
        // REGISTERED USER: Show full map interface
        <div className="w-full max-w-6xl mx-auto p-4 relative">
          <div className="w-full rounded-xl overflow-hidden shadow-lg">
            <ErrorBoundary
              fallbackTitle={t.mapError}
              fallbackMessage={t.mapErrorMessage}
            >
              {currentSessionId ? (
                // Active session - show full navigation map
                <RealTimeNavigationMap
                  sessionId={currentSessionId}
                  userType="lost"
                  profileId={createdProfileId}
                  onClose={() => {
                    // Session ended - clear session state and return to waiting
                    console.log('[LostPersonPage] Session closed - clearing session state and returning to waiting');
                    setCurrentSessionId(null);
                    localStorage.removeItem(`activeSession_${createdProfileId}`);
                    
                    // Show user feedback that session ended
                    setLocationError(t.sessionEnded);
                    setTimeout(() => setLocationError(''), 3000);
                  }}
                />
              ) : (
                // Registered but no session yet - show map with only user location
                <div className="h-full w-full bg-muted flex items-center justify-center relative">
                  <div className="text-center p-6">
                    <div className="mb-4">
                      <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl">📍</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      {t.readyToBeFound}
                    </h3>
                    <p className="text-primary/80 mb-4">
                      {t.readyToBeFoundMessage}
                    </p>
                    <div className="bg-primary/10 p-3 rounded-lg mb-3">
                      <p className="text-sm text-primary/90">
                        {t.interactiveMapWillAppear}
                      </p>
                    </div>
                    
                    {/* Live Location Tracking Status */}
                    <div className={`p-3 rounded-lg ${isTracking ? 'bg-primary/10' : trackingError ? 'bg-destructive/10' : 'bg-secondary'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${
                          isTracking ? 'bg-primary animate-pulse' : 
                          trackingError ? 'bg-destructive' : 'bg-secondary-foreground'
                        }`}></div>
                        <span className={`text-sm font-medium ${
                          isTracking ? 'text-primary' : 
                          trackingError ? 'text-destructive' : 'text-secondary-foreground'
                        }`}>
                          {t.liveLocationTracking}
                        </span>
                      </div>
                      <p className={`text-xs ${
                        isTracking ? 'text-primary/90' : 
                        trackingError ? 'text-destructive/90' : 'text-secondary-foreground/90'
                      }`}>
                        {isTracking 
                          ? `${t.trackingActive} ${lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : t.updating}` 
                          : trackingError 
                            ? t.trackingError
                            : t.trackingStarting
                        }
                      </p>
                    </div>
                    
                    {/* Register my information again button */}
                    <div className="mt-4">
                      <Button 
                        variant="destructive"
                        onClick={handleReRegisterInfo}
                        className="max-w-xs mx-auto"
                        size="sm"
                      >
                        {t.registerMyInfoAgain}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </ErrorBoundary>
          </div>
          

          {/* Location Tracking Error Alert */}
          {trackingError && (
            <div className="absolute top-20 right-4 z-20">
              <Card className="p-3 bg-red-50 border-red-200 shadow-xl max-w-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div>
                    <h4 className="text-xs font-semibold text-red-800">
                      {t.locationTrackingError}
                    </h4>
                    <p className="text-xs text-red-700 mt-1">
                      {trackingError}
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      {t.enableLocationServices}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      ) : (
        // UNREGISTERED USER: Show centered registration form - matching search form mode
        <div className="w-full max-w-4xl mx-auto p-4">
          <div className="min-h-screen flex items-center justify-center">
            <Card className="p-8 w-full max-w-md mx-auto">
              <h2 className={`text-xl font-semibold mb-6 ${getDirectionalClasses(currentLanguage).textAlign}`}>
                {t.registrationTitle}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                <PersonalInfoForm 
                  formData={formData} 
                  setFormData={(data) => setFormData({
                    displayName: data.displayName,
                    description: data.description || "",
                    contact: data.contact || ""
                  })}
                />
                
                {locationError && (
                  <div className="text-red-600 text-sm mt-2">
                    {locationError}
                  </div>
                )}
                
                <FormActions isValid={isFormValid} isLoading={isSubmitting} />
              </form>
            </Card>
          </div>
        </div>
      )}

      {/* Hidden location detector for unregistered users */}
      {!createdProfileId && (
        <div className="hidden">
          <div
            ref={(el) => {
              if (el && !coordinates) {
                // Get user location for map
                if ('geolocation' in navigator) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      handleLocationDetected({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                      });
                    },
                    (error) => {
                      console.warn('Location detection failed:', error);
                      handleLocationError(t.failedToDetectLocation);
                    },
                    {
                      enableHighAccuracy: true,
                      timeout: 15000,
                      maximumAge: 300000
                    }
                  );
                }
              }
            }}
          />
        </div>
      )}

      {/* Alert Dialog */}
      <AlertDialog {...alertProps} />
    </div>
  );
}