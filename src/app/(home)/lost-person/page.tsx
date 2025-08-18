"use client";

import { useState, useEffect } from "react";
import { useApiData } from "@/hooks/useApi";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { Card } from "@/components/ui/card";
import { PersonalInfoForm } from "@/components/features/lost-person/PersonalInfoForm";
import { FormActions } from "@/components/features/lost-person/FormActions";
import { RealTimeNavigationMap } from "@/components/features/navigation/RealTimeNavigationMap";
// Cleaned: removed unused NotificationService import
import { useLanguageStore } from "@/store/language/languageStore";
import ErrorBoundary from "@/components/common/ErrorBoundary";
<<<<<<< HEAD
import { AlertDialog, useAlertDialog } from "@/components/ui/alert-dialog";
=======
>>>>>>> 0b8b9e88898342a781af43426cec2fff85362bb8

export default function LostPersonPage() {
  const { currentLanguage } = useLanguageStore();
  const { alertProps, showAlert } = useAlertDialog();
  
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
              setLocationError(
                currentLanguage === 'ar'
                  ? 'تم تنظيف جلسة منتهية - العودة إلى وضع الانتظار'
                  : 'Previous session ended - returning to waiting mode'
              );
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
              setLocationError(
                currentLanguage === 'ar'
                  ? 'انتهت الجلسة - العودة إلى وضع الانتظار'
                  : 'Session ended - returning to waiting mode'
              );
              setTimeout(() => setLocationError(''), 3000);
            }
            
            // CRITICAL FIX: Also clear stored session even if currentSessionId is null
            // This handles the case where localStorage has stale data after page refresh
            if (storedSessionId) {
              console.log('[LostPersonPage] Clearing stale stored session:', storedSessionId);
              localStorage.removeItem(`activeSession_${createdProfileId}`);
              
              // If we had a stored session but no current session, it means we need to show feedback
              if (!currentSessionId) {
                setLocationError(
                  currentLanguage === 'ar'
                    ? 'تم تنظيف جلسة منتهية - العودة إلى وضع الانتظار'
                    : 'Cleaned up ended session - returning to waiting mode'
                );
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
<<<<<<< HEAD

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
          
          setLocationError(
            currentLanguage === 'ar'
              ? 'انتهت الجلسة - العودة إلى وضع الانتظار'
              : 'Session ended - returning to waiting mode'
          );
          setTimeout(() => setLocationError(''), 3000);
          return;
        }
        
        const sessionData = await response.json();
        if (!sessionData.exists || sessionData.status === 'ended') {
          console.log('[LostPersonPage] Session monitoring: session ended - clearing state');
          setCurrentSessionId(null);
          localStorage.removeItem(`activeSession_${createdProfileId}`);
          
          setLocationError(
            currentLanguage === 'ar'
              ? 'انتهت الجلسة - العودة إلى وضع الانتظار'
              : 'Session ended - returning to waiting mode'
          );
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
=======
>>>>>>> 0b8b9e88898342a781af43426cec2fff85362bb8

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coordinates) {
      setLocationError("يرجى انتظار تحديد الموقع أو السماح بالوصول للموقع");
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
<<<<<<< HEAD
            showAlert({
              type: 'success',
              title: currentLanguage === 'ar' ? 'تم حفظ البيانات بنجاح!' : 'Data saved successfully!',
              description: currentLanguage === 'ar' 
                ? `معرف الملف الشخصي: ${profileId}`
                : `Profile ID: ${profileId}`,
              autoClose: 3000
            });
          } else {
            showAlert({
              type: 'success',
              title: currentLanguage === 'ar' ? 'تم حفظ البيانات بنجاح!' : 'Data saved successfully!',
              autoClose: 3000
            });
=======
            alert(`تم حفظ البيانات بنجاح! معرف الملف الشخصي: ${profileId}`);
          } else {
            alert("تم حفظ البيانات بنجاح!");
>>>>>>> 0b8b9e88898342a781af43426cec2fff85362bb8
            const tempId = "temp-id-" + Date.now();
            setCreatedProfileId(tempId);
            localStorage.setItem('userProfileId', tempId);
          }
        },
        onError: () => {
          setLocationError("فشل في حفظ البيانات. يرجى المحاولة مرة أخرى.");
        }
      });
    } catch {
      setLocationError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
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

  const isFormValid = Boolean(formData.displayName && coordinates);

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {createdProfileId ? (
        // REGISTERED USER: Show full map interface
        <div className="w-full max-w-6xl mx-auto p-4 relative">
          <div className="h-[calc(100vh-2rem)] w-full rounded-xl overflow-hidden shadow-lg">
            <ErrorBoundary
              fallbackTitle={currentLanguage === 'ar' ? 'خطأ في الخريطة' : 'Map Error'}
              fallbackMessage={currentLanguage === 'ar' 
                ? 'حدث خطأ في عرض الخريطة. يرجى إعادة تحميل الصفحة.' 
                : 'An error occurred displaying the map. Please reload the page.'
              }
            >
              {currentSessionId ? (
=======
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-6xl mx-auto relative">
        {/* Always show the real-time navigation map */}
        <div className="h-[calc(100vh-2rem)] w-full rounded-xl overflow-hidden shadow-lg">
          <ErrorBoundary
            fallbackTitle={currentLanguage === 'ar' ? 'خطأ في الخريطة' : 'Map Error'}
            fallbackMessage={currentLanguage === 'ar' 
              ? 'حدث خطأ في عرض الخريطة. يرجى إعادة تحميل الصفحة.' 
              : 'An error occurred displaying the map. Please reload the page.'
            }
          >
            {createdProfileId ? (
              // Show full real-time map when user is registered
              currentSessionId ? (
>>>>>>> 0b8b9e88898342a781af43426cec2fff85362bb8
                // Active session - show full navigation map
                <RealTimeNavigationMap
                  sessionId={currentSessionId}
                  userType="lost"
                  profileId={createdProfileId}
                  onClose={() => {
                    // Session ended - clear session state and return to waiting
<<<<<<< HEAD
                    console.log('[LostPersonPage] Session closed - clearing session state and returning to waiting');
                    setCurrentSessionId(null);
                    localStorage.removeItem(`activeSession_${createdProfileId}`);
                    
                    // Show user feedback that session ended
                    setLocationError(
                      currentLanguage === 'ar'
                        ? 'انتهت الجلسة - العودة إلى وضع الانتظار'
                        : 'Session ended - returning to waiting mode'
                    );
                    setTimeout(() => setLocationError(''), 3000);
=======
                    console.log('[LostPersonPage] Session closed - clearing session state');
                    setCurrentSessionId(null);
                    localStorage.removeItem(`activeSession_${createdProfileId}`);
>>>>>>> 0b8b9e88898342a781af43426cec2fff85362bb8
                  }}
                />
              ) : (
                // Registered but no session yet - show map with only user location
                <div className="h-full w-full bg-gray-100 flex items-center justify-center relative">
                  <div className="text-center p-6">
                    <div className="animate-pulse mb-4">
                      <div className="w-16 h-16 bg-green-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl">📍</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      {currentLanguage === 'ar' ? 'جاهز للبحث عنك!' : 'Ready to be Found!'}
                    </h3>
                    <p className="text-green-600 mb-4">
                      {currentLanguage === 'ar' 
                        ? 'تم تسجيلك بنجاح. انتظر حتى يبدأ شخص بالبحث عنك'
                        : 'Successfully registered. Waiting for someone to start searching for you'
                      }
                    </p>
                    <div className="bg-green-100 p-3 rounded-lg mb-3">
                      <p className="text-sm text-green-700">
                        {currentLanguage === 'ar'
                          ? 'ستظهر الخريطة التفاعلية تلقائياً عند بدء جلسة البحث'
                          : 'Interactive map will appear automatically when a search session starts'
                        }
                      </p>
                    </div>
                    
                    {/* Live Location Tracking Status */}
                    <div className={`p-3 rounded-lg ${isTracking ? 'bg-blue-100' : trackingError ? 'bg-red-100' : 'bg-yellow-100'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${
                          isTracking ? 'bg-blue-500 animate-pulse' : 
                          trackingError ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className={`text-sm font-medium ${
                          isTracking ? 'text-blue-800' : 
                          trackingError ? 'text-red-800' : 'text-yellow-800'
                        }`}>
                          {currentLanguage === 'ar' ? 'تتبع الموقع المباشر:' : 'Live Location Tracking:'}
                        </span>
                      </div>
                      <p className={`text-xs ${
                        isTracking ? 'text-blue-700' : 
                        trackingError ? 'text-red-700' : 'text-yellow-700'
                      }`}>
                        {isTracking 
                          ? (currentLanguage === 'ar' 
                            ? `نشط - آخر تحديث: ${lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'جاري التحديث...'}` 
                            : `Active - Last update: ${lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'Updating...'}`)
                          : trackingError 
                            ? (currentLanguage === 'ar' ? 'خطأ في تتبع الموقع' : 'Location tracking error')
                            : (currentLanguage === 'ar' ? 'بدء تتبع الموقع...' : 'Starting location tracking...')
                        }
                      </p>
                    </div>
                  </div>
                </div>
<<<<<<< HEAD
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
                      {currentLanguage === 'ar' ? 'خطأ في تتبع الموقع' : 'Location Tracking Error'}
                    </h4>
                    <p className="text-xs text-red-700 mt-1">
                      {trackingError}
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      {currentLanguage === 'ar' 
                        ? 'يرجى تفعيل خدمة الموقع للحصول على تحديثات مباشرة'
                        : 'Please enable location services for live updates'
                      }
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      ) : (
        // UNREGISTERED USER: Show centered registration form only
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-white/20">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-3xl">📍</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {currentLanguage === 'ar' ? 'تسجيل شخص مفقود' : 'Lost Person Registration'}
                </h1>
                <p className="text-gray-600">
                  {currentLanguage === 'ar' 
                    ? 'املأ المعلومات أدناه لبدء عملية البحث عنك'
                    : 'Fill in the information below to start the search process'
                  }
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
=======
              )
            ) : (
              // Show basic map while registering
              <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="animate-pulse mb-4">
                    <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl">🗺️</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    {currentLanguage === 'ar' ? 'سجل معلوماتك لعرض الخريطة' : 'Register to View Map'}
                  </h3>
                  <p className="text-blue-600">
                    {currentLanguage === 'ar' 
                      ? 'بعد التسجيل، ستظهر الخريطة التفاعلية مع إمكانية التتبع المباشر'
                      : 'After registration, the interactive map with live tracking will appear'
                    }
                  </p>
                </div>
              </div>
            )}
          </ErrorBoundary>
        </div>

        {/* Registration Form Overlay (only show if not registered) */}
        {!createdProfileId && (
          <div className="absolute top-4 left-4 z-20">
            <Card className="p-6 w-96 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-sm shadow-xl">
              <h2 className="text-xl font-semibold mb-4 text-center">
                {currentLanguage === 'ar' ? 'تسجيل شخص مفقود' : 'Lost Person Registration'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
>>>>>>> 0b8b9e88898342a781af43426cec2fff85362bb8
                <PersonalInfoForm 
                  formData={formData} 
                  setFormData={(data) => setFormData({
                    displayName: data.displayName,
                    description: data.description || "",
                    contact: data.contact || ""
                  })}
                />
<<<<<<< HEAD
                
                {locationError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {locationError}
                  </div>
                )}
                
=======
                {locationError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                    {locationError}
                  </div>
                )}
>>>>>>> 0b8b9e88898342a781af43426cec2fff85362bb8
                <FormActions isValid={isFormValid} isLoading={isSubmitting} />
              </form>
              
              {/* Location Status */}
<<<<<<< HEAD
              <div className="mt-6 pt-6 border-t border-gray-200">
=======
              <div className="mt-4 pt-4 border-t border-gray-200">
>>>>>>> 0b8b9e88898342a781af43426cec2fff85362bb8
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {currentLanguage === 'ar' ? 'حالة الموقع:' : 'Location Status:'}
                  </span>
<<<<<<< HEAD
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${coordinates ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                    <span className={`font-medium ${coordinates ? 'text-green-600' : 'text-yellow-600'}`}>
                      {coordinates 
                        ? (currentLanguage === 'ar' ? 'تم تحديد الموقع' : 'Location detected')
                        : (currentLanguage === 'ar' ? 'جاري تحديد الموقع...' : 'Detecting location...')
                      }
                    </span>
                  </div>
                </div>
                {coordinates && (
                  <div className="mt-2 p-2 bg-green-50 rounded-md">
                    <div className="text-xs text-green-700 font-mono text-center">
                      📍 {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
                    </div>
                  </div>
                )}
                
                {!coordinates && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700 text-center">
                      {currentLanguage === 'ar' 
                        ? 'يرجى السماح للتطبيق بالوصول إلى موقعك لضمان العثور عليك بسرعة'
                        : 'Please allow location access to ensure you can be found quickly'
                      }
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h3 className="text-sm font-semibold text-indigo-800 mb-2">
                    {currentLanguage === 'ar' ? 'ماذا سيحدث بعد التسجيل؟' : 'What happens after registration?'}
                  </h3>
                  <ul className="text-xs text-indigo-700 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-0.5">•</span>
                      <span>
                        {currentLanguage === 'ar' 
                          ? 'ستظهر الخريطة التفاعلية مع إمكانية التتبع المباشر'
                          : 'Interactive map with live tracking will appear'
                        }
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-0.5">•</span>
                      <span>
                        {currentLanguage === 'ar' 
                          ? 'سيتمكن الباحثون من العثور عليك والتواصل معك'
                          : 'Searchers will be able to find and communicate with you'
                        }
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-0.5">•</span>
                      <span>
                        {currentLanguage === 'ar' 
                          ? 'ستحصل على تحديثات مباشرة عند بدء عملية البحث'
                          : 'You will receive live updates when search begins'
                        }
                      </span>
                    </li>
                  </ul>
=======
                  <span className={`font-medium ${coordinates ? 'text-green-600' : 'text-yellow-600'}`}>
                    {coordinates 
                      ? (currentLanguage === 'ar' ? 'تم تحديد الموقع' : 'Location detected')
                      : (currentLanguage === 'ar' ? 'جاري تحديد الموقع...' : 'Detecting location...')
                    }
                  </span>
                </div>
                {coordinates && (
                  <div className="text-xs text-gray-500 mt-1 font-mono">
                    {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Session Status Card (show when registered) */}
        {createdProfileId && (
          <div className="absolute top-4 right-4 z-20">
            <Card className="p-4 bg-white/95 backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${currentSessionId ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}></div>
                <div>
                  <h3 className="font-semibold text-sm">
                    {currentSessionId 
                      ? (currentLanguage === 'ar' ? 'جلسة نشطة' : 'Active Session')
                      : (currentLanguage === 'ar' ? 'في انتظار باحث' : 'Waiting for Searcher')
                    }
                  </h3>
                  <p className="text-xs text-gray-600">
                    {currentSessionId
                      ? (currentLanguage === 'ar' ? 'شخص يبحث عنك!' : 'Someone is searching for you!')
                      : (currentLanguage === 'ar' ? 'جاهز للبحث عنك' : 'Ready to be found')
                    }
                  </p>
                </div>
              </div>
              
              {/* Live Location Tracking Status */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${
                    isTracking ? 'bg-blue-500 animate-pulse' : 
                    trackingError ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <p className="text-xs text-gray-600">
                    {currentLanguage === 'ar' ? 'تتبع الموقع:' : 'Location Tracking:'}
                  </p>
                  <span className={`text-xs font-medium ${
                    isTracking ? 'text-blue-600' : 
                    trackingError ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {isTracking 
                      ? (currentLanguage === 'ar' ? 'نشط' : 'Active')
                      : trackingError 
                        ? (currentLanguage === 'ar' ? 'خطأ' : 'Error')
                        : (currentLanguage === 'ar' ? 'بدء...' : 'Starting...')
                    }
                  </span>
                </div>
                {lastUpdate && (
                  <p className="text-xs text-gray-500">
                    {currentLanguage === 'ar' ? 'آخر تحديث:' : 'Last update:'} {new Date(lastUpdate).toLocaleTimeString()}
                  </p>
                )}
              </div>
              
              {/* Profile ID for sharing */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-1">
                  {currentLanguage === 'ar' ? 'معرف ملفك الشخصي:' : 'Your Profile ID:'}
                </p>
                <div className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                  {createdProfileId}
>>>>>>> 0b8b9e88898342a781af43426cec2fff85362bb8
                </div>
              </div>
            </Card>
          </div>
<<<<<<< HEAD
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
                      handleLocationError(
                        currentLanguage === 'ar'
                          ? 'فشل في تحديد الموقع. يرجى تفعيل خدمة الموقع.'
                          : 'Failed to detect location. Please enable location services.'
                      );
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
=======
        )}

        {/* Location Tracking Error Alert */}
        {createdProfileId && trackingError && (
          <div className="absolute top-20 right-4 z-20">
            <Card className="p-3 bg-red-50 border-red-200 shadow-xl max-w-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div>
                  <h4 className="text-xs font-semibold text-red-800">
                    {currentLanguage === 'ar' ? 'خطأ في تتبع الموقع' : 'Location Tracking Error'}
                  </h4>
                  <p className="text-xs text-red-700 mt-1">
                    {trackingError}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    {currentLanguage === 'ar' 
                      ? 'يرجى تفعيل خدمة الموقع للحصول على تحديثات مباشرة'
                      : 'Please enable location services for live updates'
                    }
                  </p>
                </div>
              </div>
            </Card>
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
                        handleLocationError(
                          currentLanguage === 'ar'
                            ? 'فشل في تحديد الموقع. يرجى تفعيل خدمة الموقع.'
                            : 'Failed to detect location. Please enable location services.'
                        );
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
      </div>
>>>>>>> 0b8b9e88898342a781af43426cec2fff85362bb8
    </div>
  );
}