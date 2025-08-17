"use client";

import { useState, useEffect } from "react";
import { enhancedSearch } from "@/lib/searchUtils";
import { startSession } from '@/lib/startSession';
import { useApiData } from "@/hooks/useApi";
import { Card } from "@/components/ui/card";
import { SearchForm } from "@/components/features/find-person/SearchForm";
import { useLanguageStore } from "@/store/language/languageStore";
import { findPersonTranslations, getFeatureTranslations } from "@/localization";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import { SearchResultsModal } from "@/components/features/find-person/SearchResultsModal";
import SearcherMap from "@/components/common/SearcherMap";
import { RealTimeNavigationMap } from "@/components/features/navigation/RealTimeNavigationMap";
import ErrorBoundary from "@/components/common/ErrorBoundary";

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
  const dir = getDirectionalClasses(currentLanguage);
  
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

  // API hooks
  const { post: searchPost } = useApiData('/gfl/search');

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
        setSearchError(
          currentLanguage === 'ar' 
            ? "يرجى إدخال الاسم أو وصف أو رقم للتواصل للبحث"
            : "Please enter a name, description, or contact to search."
        );
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
              setSearchError(
                currentLanguage === 'ar' 
                  ? "تم استخدام البحث المحلي. قد لا تكون النتائج محدثة."
                  : "Using offline search. Results may not be up to date."
              );
            } else {
              setSearchError(
                currentLanguage === 'ar' 
                  ? "لا توجد نتائج مطابقة لمعايير البحث."
                  : "No results match your search criteria."
              );
            }
          } else {
            setSearchError(
              currentLanguage === 'ar' 
                ? "فشل في الاتصال بالخادم. يرجى التحقق من الاتصال بالإنترنت."
                : "Failed to connect to server. Please check your internet connection."
            );
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
          setSearchError(
            currentLanguage === 'ar' 
              ? "تم استخدام البحث المحلي بسبب مشكلة في الاتصال."
              : "Using offline search due to connection issues."
          );
        } else {
          setSearchError(
            currentLanguage === 'ar' 
              ? "لا توجد نتائج مطابقة."
              : "No matching results found."
          );
        }
      } else {
        setSearchError(
          currentLanguage === 'ar'
            ? "حدث خطأ غير متوقع أثناء البحث."
            : "An unexpected error occurred during search."
        );
      }
    }
  };

  // Use new /start-session endpoint for lightweight MVP
  const handleStartTracking = async (profileId: string, profileName?: string) => {
    // Validate IDs before making API call
    if (!profileId) {
      alert(currentLanguage === 'ar' ? 'معرف الشخص المفقود غير متوفر.' : 'Lost person ID is missing.');
      return;
    }
    const helperId = 'helper-' + Math.random().toString(36).substring(2, 10);
    if (!helperId) {
      alert(currentLanguage === 'ar' ? 'معرف المساعد غير متوفر.' : 'Helper ID is missing.');
      return;
    }
    try {
      const session = await startSession({ helperId, lostId: profileId });
      if (session.sessionId) {
        localStorage.setItem(`activeSession_${profileId}`, session.sessionId);
        setActiveSessionId(session.sessionId);
        setActiveProfileId(profileId);
        setActiveProfileName(profileName || null);
        setShowSearchModal(false);
  // setShowMapModal(false); // removed
      } else {
        alert(currentLanguage === 'ar' ? 'تم بدء الجلسة بنجاح!' : 'Session started successfully!');
      }
    } catch {
      alert(currentLanguage === 'ar' ? 'فشل في بدء الجلسة. يرجى المحاولة.' : 'Failed to start session. Please try again.');
    }
  };

  // Always show the map, overlay search or session info
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl relative">
        {/* Always show the map */}
        <div className="h-96 w-full mb-4 rounded-xl overflow-hidden shadow">
          <SearcherMap
            isSelectable={false}
            showFullScreen={true}
            allLostPeople={allLostPeople}
          />
        </div>

        {/* Overlay search form and results if no active session */}
        {!activeSessionId && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/80 z-10">
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
            />
          </div>
        )}

        {/* Show direct navigation map if active session */}
        {activeSessionId && activeProfileId && (
          <div className="mt-4">
            <ErrorBoundary
              fallbackTitle={currentLanguage === 'ar' ? 'خطأ في التنقل' : 'Navigation Error'}
              fallbackMessage={currentLanguage === 'ar' 
                ? 'حدث خطأ في واجهة التنقل. يرجى إعادة تحميل الصفحة.' 
                : 'An error occurred in the navigation interface. Please reload the page.'
              }
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
                      // Clean up searcher frontend state
                      setActiveSessionId(null);
                      setActiveProfileId(null);
                      setActiveProfileName(null);
                      
                      // Show success feedback
                      alert(
                        currentLanguage === 'ar'
                          ? 'تم إنهاء الجلسة بنجاح'
                          : 'Session ended successfully'
                      );
                    } else {
                      console.error('[FindPersonPage] Failed to end session:', response.status);
                      // Still clean up frontend state even if API fails
                      setActiveSessionId(null);
                      setActiveProfileId(null);
                      setActiveProfileName(null);
                      
                      alert(
                        currentLanguage === 'ar'
                          ? 'خطأ في إنهاء الجلسة - تم إنهاء الجلسة محلياً'
                          : 'Error ending session - session ended locally'
                      );
                    }
                  } catch (error) {
                    console.error('[FindPersonPage] Session end API error:', error);
                    // Clean up frontend state even if API call fails
                    setActiveSessionId(null);
                    setActiveProfileId(null);
                    setActiveProfileName(null);
                    
                    alert(
                      currentLanguage === 'ar'
                        ? 'خطأ في الاتصال - تم إنهاء الجلسة محلياً'
                        : 'Connection error - session ended locally'
                    );
                  }
                }}
              />
            </ErrorBoundary>
          </div>
        )}
      </div>
    </div>
  );
}