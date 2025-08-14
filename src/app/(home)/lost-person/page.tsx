"use client";

import { useState, useEffect } from "react";
import { useApiData } from "@/hooks/useApi";
import { Card } from "@/components/ui/card";
import { LostPersonHeader } from "@/components/features/lost-person/LostPersonHeader";
import { PersonalInfoForm } from "@/components/features/lost-person/PersonalInfoForm";
import { ConsentSection } from "@/components/features/lost-person/ConsentSection";
import { FormActions } from "@/components/features/lost-person/FormActions";
import { LiveTracking } from "@/components/features/lost-person/LiveTracking";
import { WaitingInterface } from "@/components/features/lost-person/WaitingInterface";
import { SessionMonitor } from "@/components/features/lost-person/SessionMonitor";
import LostPersonMap from "@/components/common/LostPersonMap";
import NotificationService from "@/services/NotificationService";
import { useLanguageStore } from "@/store/language/languageStore";

export default function LostPersonPage() {
  const { currentLanguage } = useLanguageStore();
  
  // Check for existing profile ID on mount
  useEffect(() => {
    const existingProfileId = localStorage.getItem('userProfileId');
    if (existingProfileId) {
      setCreatedProfileId(existingProfileId);
    }
  }, []);
  const [formData, setFormData] = useState({
    displayName: "",
    age: 0,
    clothingColor: "",
    distinctiveFeature: "",
    phone: "",
    consent: false,
    trackingEnabled: false,
  });

  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdProfileId, setCreatedProfileId] = useState<string | null>(null);
  const [showLiveTracking, setShowLiveTracking] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [notificationRequested, setNotificationRequested] = useState(false);

  // API hook for profile creation
  const { post } = useApiData('/gfl/profiles');
  const notificationService = NotificationService.getInstance();
  
  // Request notification permission when profile is created and tracking is enabled
  useEffect(() => {
    if (createdProfileId && formData.trackingEnabled && !notificationRequested) {
      requestNotificationPermission();
      setNotificationRequested(true);
    }
  }, [createdProfileId, formData.trackingEnabled, notificationRequested]);
  
  // Check for active sessions periodically
  useEffect(() => {
    if (!createdProfileId) return;
    
    const checkForSessions = () => {
      // In a real implementation, you might want to poll for active sessions
      // For now, we'll rely on the search page to create sessions and pass the session ID
      const storedSessionId = localStorage.getItem(`activeSession_${createdProfileId}`);
      if (storedSessionId && storedSessionId !== currentSessionId) {
        setCurrentSessionId(storedSessionId);
      }
    };
    
    checkForSessions();
    const interval = setInterval(checkForSessions, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, [createdProfileId, currentSessionId]);
  
  const requestNotificationPermission = async () => {
    const permission = await notificationService.requestPermission();
    setNotificationPermission(permission);
    
    if (permission === 'granted') {
      // Show a welcome notification
      notificationService.showNotification(
        currentLanguage === 'ar' ? 'تم تفعيل التنبيهات' : 'Notifications Enabled',
        {
          body: currentLanguage === 'ar' 
            ? 'ستتلقى تنبيهات عندما يبدأ شخص في تتبعك.'
            : 'You will receive notifications when someone starts tracking you.',
          icon: '/favicon.ico'
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if location is detected
    if (!coordinates) {
      setLocationError("يرجى انتظار تحديد الموقع أو السماح بالوصول للموقع");
      return;
    }

    setIsSubmitting(true);
    setLocationError("");

    try {
      // Prepare data for backend API
      const profileData = {
        displayName: formData.displayName,
        age: formData.age,
        topColor: formData.clothingColor,
        distinctive: formData.distinctiveFeature,
        phone: formData.phone,
        consentPublic: formData.consent,
        lat: coordinates.lat,
        lng: coordinates.lng,
      };

      // Submit to backend API
      const response = await post({
        data: profileData,
        onSuccess: (apiResponse) => {
          console.log("Profile created successfully:", apiResponse);
          console.log("Response structure:", JSON.stringify(apiResponse, null, 2));
          
          // Handle different response structures
          const profileId = apiResponse.data?.id || apiResponse.id || apiResponse?.data?.data?.id;
          
          if (profileId) {
            setCreatedProfileId(profileId);
            // Store profile ID in localStorage if tracking is enabled
            if (formData.trackingEnabled) {
              localStorage.setItem('userProfileId', profileId);
            }
            alert(`تم حفظ البيانات بنجاح! معرف الملف الشخصي: ${profileId}`);
          } else {
            console.error("No profile ID found in response. Full response:", apiResponse);
            // Try to show a generic success message if we can't get the ID
            alert("تم حفظ البيانات بنجاح!");
            // Still allow live tracking even without ID for now
            const tempId = "temp-id-" + Date.now();
            setCreatedProfileId(tempId);
            if (formData.trackingEnabled) {
              localStorage.setItem('userProfileId', tempId);
            }
          }
        },
        onError: (error) => {
          console.error("Profile creation failed:", error);
          setLocationError("فشل في حفظ البيانات. يرجى المحاولة مرة أخرى.");
        }
      });

    } catch (error) {
      console.error("Submission error:", error);
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

  const isFormValid = formData.displayName && formData.age > 0 && formData.clothingColor && formData.phone && formData.consent && coordinates;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <LostPersonHeader />

        <main>
          {!createdProfileId ? (
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <PersonalInfoForm 
                  formData={formData} 
                  setFormData={setFormData} 
                >
                  <LostPersonMap
                    onLocationDetected={handleLocationDetected}
                    onLocationError={handleLocationError}
                  />
                </PersonalInfoForm>
                
                {locationError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {locationError}
                  </div>
                )}
                
                <ConsentSection 
                  consent={formData.consent}
                  setConsent={(consent) => setFormData({...formData, consent})}
                  trackingEnabled={formData.trackingEnabled}
                  setTrackingEnabled={(trackingEnabled) => setFormData({...formData, trackingEnabled})}
                />

                <FormActions isValid={isFormValid} isLoading={isSubmitting} />
              </form>
            </Card>
          ) : (
            <>
              {/* Session Monitor - Always show if there's an active session */}
              {currentSessionId && (
                <div className="mb-6">
                  <SessionMonitor 
                    profileId={createdProfileId}
                    currentSessionId={currentSessionId}
                    onSessionUpdate={(sessionData) => {
                      // Handle session updates, maybe update UI state
                      if (sessionData?.session?.status === 'ended') {
                        setCurrentSessionId(null);
                        localStorage.removeItem(`activeSession_${createdProfileId}`);
                      }
                    }}
                  />
                </div>
              )}
              
              {!showLiveTracking ? (
                <WaitingInterface
                  profileId={createdProfileId}
                  onNavigationRequest={() => setShowLiveTracking(true)}
                  onNewRegistration={() => {
                    setCreatedProfileId(null);
                    setShowLiveTracking(false);
                    setCurrentSessionId(null);
                    setNotificationRequested(false);
                    localStorage.removeItem(`activeSession_${createdProfileId}`);
                    setFormData({
                      displayName: "",
                      age: 0,
                      clothingColor: "",
                      distinctiveFeature: "",
                      phone: "",
                      consent: false,
                      trackingEnabled: false,
                    });
                    setCoordinates(null);
                  }}
                />
              ) : (
                <LiveTracking 
                  profileId={createdProfileId}
                  currentSessionId={currentSessionId}
                  onClose={() => {
                    setShowLiveTracking(false);
                    setCreatedProfileId(null);
                    setCurrentSessionId(null);
                    localStorage.removeItem(`activeSession_${createdProfileId}`);
                  }}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}