"use client";

import { useState, useEffect } from "react";
import { enhancedSearch } from "@/lib/searchUtils";
import { startSession } from '@/lib/startSession';
import { useApiData } from "@/hooks/useApi";
import { Card } from "@/components/ui/card";
import { SearchForm } from "@/components/features/find-person/SearchForm";
import { useLanguageStore } from "@/store/language/languageStore";
import { findPersonTranslations, errorTranslations, navigationTranslations, uiTranslations, getFeatureTranslations } from "@/localization";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import { SearchResultsModal } from "@/components/features/find-person/SearchResultsModal";
import { RealTimeNavigationMap } from "@/components/features/navigation/RealTimeNavigationMap";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { AlertDialog, useAlertDialog } from "@/components/ui/alert-dialog";

interface SearchResult extends Record<string, unknown> {
  id: string;
  displayName: string;
  age: number;
  clothingColor: string;
  lastSeenLocation: string;
  distinctiveFeature?: string;
  phone: string;
  coordinates?: { lat: number; lng: number };
  timestamp: string;
}

export default function FindPersonPage() {
  const { currentLanguage } = useLanguageStore();
  const t = getFeatureTranslations(findPersonTranslations, currentLanguage);
  const errorT = getFeatureTranslations(errorTranslations, currentLanguage);
  const navT = getFeatureTranslations(navigationTranslations, currentLanguage);
  const uiT = getFeatureTranslations(uiTranslations, currentLanguage);
  const dir = getDirectionalClasses(currentLanguage);
  const { alertProps, showAlert } = useAlertDialog();
  
  const [searchData, setSearchData] = useState({
    name: "",
    description: "",
    contact: ""
  });

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  // ...existing code...
  const [allLostPeople] = useState<SearchResult[]>([]);
  // const [showMapModal, setShowMapModal] = useState(false); // unused
  const [showSearchModal, setShowSearchModal] = useState(false);
  // ...existing code...
  const [searchError, setSearchError] = useState<string>("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number, accuracy?: number} | null>(null);
  // ...existing code...
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [activeProfileName, setActiveProfileName] = useState<string | null>(null);
  // ...existing code...
  const [locationRetryCount, setLocationRetryCount] = useState(0);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // API hooks
  const { post: searchPost } = useApiData('/gfl/search');

  // Session restoration on mount - check for existing active sessions
  useEffect(() => {
    const restoreSession = async () => {
      console.log('[FindPersonPage] Starting session restoration check...');
      
      try {
        // Check unified session storage
        const storedSessionId = localStorage.getItem('gfl-sessionId');
        const storedMetadata = localStorage.getItem('gfl-sessionMetadata');
        
        if (!storedSessionId) {
          console.log('[FindPersonPage] No stored session found');
          setIsLoadingSession(false);
          return;
        }

        let metadata = null;
        try {
          metadata = storedMetadata ? JSON.parse(storedMetadata) : null;
        } catch (e) {
          console.warn('[FindPersonPage] Invalid session metadata, clearing session');
          localStorage.removeItem('gfl-sessionId');
          localStorage.removeItem('gfl-sessionMetadata');
          setIsLoadingSession(false);
          return;
        }

        const profileId = metadata?.profileId;
        if (!profileId) {
          console.warn('[FindPersonPage] No profileId in session metadata, clearing session');
          localStorage.removeItem('gfl-sessionId');
          localStorage.removeItem('gfl-sessionMetadata');
          setIsLoadingSession(false);
          return;
        }

        console.log(`[FindPersonPage] Found stored session: ${storedSessionId} for profile: ${profileId}`);

        // Validate session using the correct API endpoint
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3010/api';
          const response = await fetch(`${baseUrl}/gfl/profiles/${profileId}/sessions/active`);
          
          if (response.ok) {
            const data = await response.json();
            console.log('[FindPersonPage] Active session check response:', data);
            
            // Handle different response structures
            const activeSessionId = data.sessionId || data.data?.sessionId || 
              (data.sessions && data.sessions.length > 0 ? data.sessions[0].sessionId : null);
            
            if (activeSessionId && activeSessionId === storedSessionId) {
              console.log(`[FindPersonPage] Session validation successful, restoring: ${storedSessionId}`);
              setActiveSessionId(storedSessionId);
              setActiveProfileId(profileId);
              setActiveProfileName(metadata.profileName || null);
              setIsLoadingSession(false);
              return; // Successfully restored session
            } else if (activeSessionId && activeSessionId !== storedSessionId) {
              console.log(`[FindPersonPage] Different active session found: ${activeSessionId}, updating storage`);
              // Update storage with the correct session ID
              localStorage.setItem('gfl-sessionId', activeSessionId);
              setActiveSessionId(activeSessionId);
              setActiveProfileId(profileId);
              setActiveProfileName(metadata.profileName || null);
              setIsLoadingSession(false);
              return; // Restored with updated session
            } else {
              console.log('[FindPersonPage] No active session for this profile, cleaning up');
              localStorage.removeItem('gfl-sessionId');
              localStorage.removeItem('gfl-sessionMetadata');
            }
          } else if (response.status === 404) {
            console.log('[FindPersonPage] Profile not found or no active sessions, cleaning up');
            localStorage.removeItem('gfl-sessionId');
            localStorage.removeItem('gfl-sessionMetadata');
          } else {
            console.warn(`[FindPersonPage] Session validation API error: ${response.status}, keeping session for now`);
            // Keep the session, the SSE connection will handle validation
            setActiveSessionId(storedSessionId);
            setActiveProfileId(profileId);
            setActiveProfileName(metadata.profileName || null);
            setIsLoadingSession(false);
            return;
          }
        } catch (error) {
          console.log('[FindPersonPage] Session validation network error:', error);
          // Network error - keep the session, let SSE handle validation
          setActiveSessionId(storedSessionId);
          setActiveProfileId(profileId);
          setActiveProfileName(metadata.profileName || null);
          setIsLoadingSession(false);
          return;
        }

        console.log('[FindPersonPage] No valid active session found, showing search form');
      } catch (error) {
        console.error('[FindPersonPage] Session restoration failed:', error);
      } finally {
        setIsLoadingSession(false);
      }
    };

    restoreSession();
  }, []); // Run once on mount

  // Listen for session ended events from SSE
  useEffect(() => {
    const handleSessionEnded = (event: CustomEvent) => {
      const { sessionId, reason } = event.detail;
      console.log('[FindPersonPage] Session ended event received:', { sessionId, reason });
      
      if (sessionId === activeSessionId) {
        console.log('[FindPersonPage] Current session ended, cleaning up state');
        // Clean up unified storage
        localStorage.removeItem('gfl-sessionId');
        localStorage.removeItem('gfl-sessionMetadata');
        // Reset state
        setActiveSessionId(null);
        setActiveProfileId(null);
        setActiveProfileName(null);
        
        // Show user feedback
        showAlert({
          type: 'info',
          title: currentLanguage === 'ar' ? 'انتهت الجلسة' : 
                currentLanguage === 'fa' ? 'جلسه به پایان رسید' : 
                'Session Ended',
          description: currentLanguage === 'ar' ? 'انتهت جلسة التتبع' : 
                      currentLanguage === 'fa' ? 'جلسه ردیابی به پایان رسید' : 
                      'Tracking session has ended',
          autoClose: 3000
        });
      }
    };

    // Listen for session ended events
    window.addEventListener('sessionEnded', handleSessionEnded as EventListener);
    
    return () => {
      window.removeEventListener('sessionEnded', handleSessionEnded as EventListener);
    };
  }, [activeSessionId, currentLanguage, showAlert]);

  // Periodic session validation - less aggressive than before
  useEffect(() => {
    if (!activeSessionId || !activeProfileId) return;

    const validateSession = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3010/api';
        const response = await fetch(`${baseUrl}/gfl/profiles/${activeProfileId}/sessions/active`);
        
        if (!response.ok) {
          console.log('[FindPersonPage] Session validation failed, session may have ended');
          // Don't immediately clear - let SSE handle this
          return;
        }
        
        const data = await response.json();
        const activeSessionFromAPI = data.sessionId || data.data?.sessionId || 
          (data.sessions && data.sessions.length > 0 ? data.sessions[0].sessionId : null);
        
        if (!activeSessionFromAPI) {
          console.log('[FindPersonPage] No active session found in API, cleaning up');
          localStorage.removeItem('gfl-sessionId');
          localStorage.removeItem('gfl-sessionMetadata');
          setActiveSessionId(null);
          setActiveProfileId(null);
          setActiveProfileName(null);
        } else if (activeSessionFromAPI !== activeSessionId) {
          console.log(`[FindPersonPage] Session ID mismatch, updating: ${activeSessionFromAPI}`);
          localStorage.setItem('gfl-sessionId', activeSessionFromAPI);
          setActiveSessionId(activeSessionFromAPI);
        }
      } catch (error) {
        // Network errors are common, don't log as errors
        console.log('[FindPersonPage] Session validation network issue (normal)');
      }
    };

    // Validate every 10 seconds - less frequent than before
    const interval = setInterval(validateSession, 10000);
    
    return () => clearInterval(interval);
  }, [activeSessionId, activeProfileId]);

  // Clean up old session storage format on mount
  useEffect(() => {
    // Clean up any old activeSession_* entries
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('activeSession_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => {
      console.log(`[FindPersonPage] Cleaning up old session storage: ${key}`);
      localStorage.removeItem(key);
    });
  }, []);

  // Auto-detect user location on component mount
  useEffect(() => {
    const detectLocation = async () => {
  // setIsDetectingLocation(true); // removed
      
      // Check if geolocation is supported
      if (!('geolocation' in navigator)) {
  // setLocationError(...) // removed
  // setIsDetectingLocation(false); // removed
        return;
      }

      // Check if we're on HTTPS or localhost (required for geolocation on modern browsers)
      const isSecureContext = window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
      if (!isSecureContext) {
  // setLocationError(...) // removed
  // setIsDetectingLocation(false); // removed
        return;
      }

      // Check permissions first if available
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'geolocation' });
          console.log('[FindPersonPage] Geolocation permission status:', permission.state);
          
          if (permission.state === 'denied') {
            // setLocationError(...) // removed
            // setIsDetectingLocation(false); // removed
            return;
          }
        } catch (permissionError) {
          console.warn('[FindPersonPage] Could not check geolocation permission:', permissionError);
        }
      }

      // Attempt to get current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setUserLocation(coords);
          // setLocationError(''); // removed
          setLocationRetryCount(0); // Reset retry count on success
          // setIsDetectingLocation(false); // removed
          console.log('[FindPersonPage] User location detected:', coords, `Accuracy: ${position.coords.accuracy}m`);
        },
        (error) => {
          console.error('[FindPersonPage] Location detection failed:', error);
          console.error('[FindPersonPage] Error code:', error.code, 'Message:', error.message);
          
          // setIsDetectingLocation(false); // removed
          
          // Provide more specific error messages based on error code
              // ...existing code...
              // ...existing code...
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  // Location access denied
                  break;
                case error.POSITION_UNAVAILABLE:
                  // ...existing code...
                  break;
                case error.TIMEOUT:
                  // ...existing code...
                  break;
                default:
                  // ...existing code...
                  break;
              }
              // Optionally, you can display errorMessage somewhere if needed
        },
        {
          enableHighAccuracy: true, // Force GPS instead of network location
          timeout: 45000, // 45 seconds timeout for GPS acquisition
          maximumAge: 60000 // 1 minute cache - fresher for GPS accuracy
        }
      );
    };

    detectLocation();
  }, [currentLanguage, locationRetryCount]);

  // ...existing code...


  // Only show search results when user actively searches
  // No automatic loading on mount to prevent unnecessary API calls

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search for missing person:", searchData);
    
  // ...existing code...
    setSearchError("");
    setSearchResults([]);
  // setShowResults(false); // removed

    try {
      // Prepare search data for backend API with improved field mapping
      const searchPayload: Record<string, unknown> = {};
      let hasSearchCriteria = false;
      
      // Add search criteria only if they have values
      if (searchData.name && searchData.name.trim()) {
        searchPayload.name = searchData.name.trim();
        hasSearchCriteria = true;
      }
      if (searchData.description && searchData.description.trim()) {
        searchPayload.description = searchData.description.trim();
        hasSearchCriteria = true;
      }
      if (searchData.contact && searchData.contact.trim()) {
        searchPayload.contact = searchData.contact.trim();
        hasSearchCriteria = true;
      }
      if (!hasSearchCriteria) {
        setSearchError(t.searchValidation.enterSearchCriteria);
      // setIsSearching(false); // removed
        return;
      }

      // Add location data - use user location if available, otherwise use Samarra center
      if (userLocation) {
        searchPayload.lat = userLocation.lat;
        searchPayload.lng = userLocation.lng;
        searchPayload.radiusM = 5000; // 5km search radius
      } else {
        // Default to Samarra center if no user location
        searchPayload.lat = 34.19625; // Samarra latitude
        searchPayload.lng = 43.88504; // Samarra longitude  
        searchPayload.radiusM = 10000; // 10km radius for wider search when no user location
        console.log('[FindPersonPage] Using default Samarra location for search');
      }

      console.log('[FindPersonPage] Search payload:', searchPayload);

      // Call backend search API
      await searchPost({
        data: searchPayload,
        onSuccess: (apiResponse) => {
          console.log("[FindPersonPage] Search results:", apiResponse);
          // Handle different response structures - check if results are at the top level or nested in data
          const response = apiResponse as Record<string, unknown>;
          const results = response.results || (response.data as Record<string, unknown>)?.results || [];
          console.log("Extracted results:", results);
          
          setSearchResults(results as SearchResult[]);
          setShowSearchModal(true);
        },
        onError: (error) => {
          console.error("Search failed:", error);
          
          // Try enhanced local search as fallback if we have cached data
          if (allLostPeople.length > 0) {
            console.log('[FindPersonPage] Falling back to enhanced local search');
            const enhancedResults = enhancedSearch(allLostPeople, searchData, 0.2);
            
            if (enhancedResults.length > 0) {
              setSearchResults(enhancedResults as SearchResult[]);
              setShowSearchModal(true);
              setSearchError(t.searchValidation.offlineSearch);
            } else {
              setSearchError(t.searchValidation.noMatchingResults);
            }
          } else {
            setSearchError(errorT.connection.failed);
          }
        }
      });

  } catch (error) {
      console.error("Search error:", error);
      
      // Try enhanced local search as final fallback
      if (allLostPeople.length > 0) {
        console.log('[FindPersonPage] Using enhanced search fallback');
        const enhancedResults = enhancedSearch(allLostPeople, searchData, 0.1);
        if (enhancedResults.length > 0) {
          setSearchResults(enhancedResults as SearchResult[]);
          setShowSearchModal(true);
          setSearchError(t.searchValidation.offlineSearchResults);
        } else {
          setSearchError(t.searchValidation.noMatchingResults);
        }
      } else {
        setSearchError(t.searchValidation.unexpectedError);
      }
    }
  };

  // Use new /start-session endpoint for lightweight MVP
  const handleStartTracking = async (profileId: string, profileName?: string) => {
    // Validate IDs before making API call
    if (!profileId) {
      showAlert({
        type: 'error',
        title: errorT.general.error,
        description: t.session.missingPersonId
      });
      return;
    }
    const helperId = 'helper-' + Math.random().toString(36).substring(2, 10);
    if (!helperId) {
      showAlert({
        type: 'error',
        title: errorT.general.error,
        description: t.session.missingHelperId
      });
      return;
    }
    
    setIsStartingSession(true);
    try {
      const session = await startSession({ helperId, lostId: profileId });
      if (session.sessionId) {
        // Use unified session storage system
        localStorage.setItem('gfl-sessionId', session.sessionId);
        localStorage.setItem('gfl-sessionMetadata', JSON.stringify({
          profileId,
          profileName: profileName || null,
          helperId,
          startTime: new Date().toISOString()
        }));
        setActiveSessionId(session.sessionId);
        setActiveProfileId(profileId);
        setActiveProfileName(profileName || null);
        setShowSearchModal(false);
        if (session.existing) {
          showAlert({
            type: 'info',
            title: navT.status.activeSession,
            description: session.message || t.session.alreadyActiveSession
          });
        }
      } else {
        showAlert({
          type: 'error',
          title: errorT.general.error,
          description: t.session.sessionCreateError
        });
      }
    } catch (error) {
      const err = error as { message?: string };
      
      if (err.message === 'ACTIVE_SESSION_EXISTS') {
        showAlert({
          type: 'warning',
          title: currentLanguage === 'ar' ? 'جلسة نشطة موجودة' : 'Active Session Exists',
          description: currentLanguage === 'ar' 
            ? 'يوجد باحث آخر يتتبع هذا الشخص حالياً. يرجى المحاولة لاحقاً.'
            : 'Another searcher is currently tracking this person. Please try again later.'
        });
      } else if (err.message === 'PROFILE_NOT_FOUND') {
        showAlert({
          type: 'error',
          title: errorT.general.error,
          description: currentLanguage === 'ar'
            ? 'لم يتم العثور على ملف الشخص المفقود'
            : 'Lost person profile not found'
        });
      } else if (err.message === 'SERVER_ERROR') {
        showAlert({
          type: 'error',
          title: errorT.general.error,
          description: currentLanguage === 'ar'
            ? 'خطأ في الخادم. يرجى المحاولة لاحقاً'
            : 'Server error. Please try again later'
        });
      } else {
        showAlert({
          type: 'error',
          title: errorT.general.error,
          description: t.session.sessionStartError
        });
      }
    } finally {
      setIsStartingSession(false);
    }
  };

  // Show loading, search form, or navigation interface
  return (
    <div className="min-h-screen bg-background">
      <div className="w-full max-w-4xl mx-auto p-4">
        {/* Show loading while checking for existing sessions */}
        {isLoadingSession && (
          <div className="min-h-screen flex items-center justify-center">
            <Card className="p-8 w-full max-w-md mx-auto text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <h2 className={`text-xl font-semibold ${dir.textAlign}`}>
                  {currentLanguage === 'ar' ? 'جاري التحقق من الجلسات النشطة...' : 
                   currentLanguage === 'fa' ? 'در حال بررسی جلسات فعال...' : 
                   'Checking for active sessions...'}
                </h2>
                <p className={`text-muted-foreground ${dir.textAlign}`}>
                  {currentLanguage === 'ar' ? 'يرجى الانتظار' : 
                   currentLanguage === 'fa' ? 'لطفا صبر کنید' : 
                   'Please wait'}
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Show search form if no active session and not loading */}
        {!isLoadingSession && !activeSessionId && (
          <div className="min-h-screen flex items-center justify-center">
            <Card className="p-8 w-full max-w-md mx-auto">
              <h2 className={`text-xl font-semibold mb-6 ${dir.textAlign}`}>{t.searchInfoTitle}</h2>
              <SearchForm
                searchData={searchData}
                setSearchData={(data: { name: string; description?: string; contact?: string }) => setSearchData({
                  name: data.name,
                  description: data.description || "",
                  contact: data.contact || ""
                })}
                onSubmit={handleSearch}
              />
              {searchError && (
                <div className="text-red-600 text-sm mt-2">{searchError}</div>
              )}
            </Card>
            <SearchResultsModal
              isOpen={showSearchModal}
              onClose={() => setShowSearchModal(false)}
              results={searchResults}
              onStartTracking={handleStartTracking}
              isStartingSession={isStartingSession}
            />
          </div>
        )}

        {/* Show direct navigation map if active session */}
        {activeSessionId && activeProfileId && (
          <div className="py-4">
            <ErrorBoundary
              fallbackTitle={navT.errors.navigationError}
              fallbackMessage={errorT.navigation.interfaceErrorMessage}
            >
              <RealTimeNavigationMap
                sessionId={activeSessionId}
                userType="searcher"
                profileId={activeProfileId}
                onClose={async () => {
                  // Proper session end implementation - call backend API
                  try {
                    console.log('[FindPersonPage] Ending session via API:', activeSessionId);
                    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3010/api';
                    const response = await fetch(`${baseUrl}/sessions/${activeSessionId}/end`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    });
                    
                    if (response.ok) {
                      const result = await response.json();
                      console.log('[FindPersonPage] Session ended successfully:', result);
                      
                      // Backend successfully ended session
                      // SSE will automatically notify lost person
                      // Clean up searcher frontend state using unified storage
                      localStorage.removeItem('gfl-sessionId');
                      localStorage.removeItem('gfl-sessionMetadata');
                      setActiveSessionId(null);
                      setActiveProfileId(null);
                      setActiveProfileName(null);
                      
                      // Show success feedback
                      showAlert({
                        type: 'success',
                        title: errorT.session.sessionEndedSuccessfully,
                        autoClose: 3000
                      });
                    } else {
                      console.error('[FindPersonPage] Failed to end session:', response.status);
                      // Still clean up frontend state even if API fails using unified storage
                      localStorage.removeItem('gfl-sessionId');
                      localStorage.removeItem('gfl-sessionMetadata');
                      setActiveSessionId(null);
                      setActiveProfileId(null);
                      setActiveProfileName(null);
                      
                      showAlert({
                        type: 'warning',
                        title: uiT.warning,
                        description: errorT.connection.sessionEnded
                      });
                    }
                  } catch (error) {
                    console.error('[FindPersonPage] Session end API error:', error);
                    // Clean up frontend state even if API call fails using unified storage
                    localStorage.removeItem('gfl-sessionId');
                    localStorage.removeItem('gfl-sessionMetadata');
                    setActiveSessionId(null);
                    setActiveProfileId(null);
                    setActiveProfileName(null);
                    
                    showAlert({
                      type: 'error',
                      title: errorT.connection.connectionError,
                      description: errorT.connection.sessionEnded
                    });
                  }
                }}
              />
            </ErrorBoundary>
          </div>
        )}

      {/* Alert Dialog */}
      <AlertDialog {...alertProps} />
      </div>
    </div>
  );
}