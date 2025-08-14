"use client";

import { useState, useEffect } from "react";
import { useApiData } from "@/hooks/useApi";
import { Card } from "@/components/ui/card";
import { FindPersonHeader } from "@/components/features/find-person/FindPersonHeader";
import { SearchForm } from "@/components/features/find-person/SearchForm";
import { SearchResults } from "@/components/features/find-person/SearchResults";
import { useLanguageStore } from "@/store/language/languageStore";
import { findPersonTranslations, getFeatureTranslations } from "@/localization";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SearchResultsModal } from "@/components/features/find-person/SearchResultsModal";
import SearcherMap from "@/components/common/SearcherMap";
import { SearcherNavigationInterface } from "@/components/features/navigation/SearcherNavigationInterface";

export default function FindPersonPage() {
  const { currentLanguage } = useLanguageStore();
  const t = getFeatureTranslations(findPersonTranslations, currentLanguage);
  const dir = getDirectionalClasses(currentLanguage);
  
  const [searchData, setSearchData] = useState({
    name: "",
    age: 0,
    clothingColor: "",
    gender: "",
    lastSeenArea: "",
    marker: "",
  });

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [allLostPeople, setAllLostPeople] = useState<any[]>([]);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string>("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [activeProfileName, setActiveProfileName] = useState<string | null>(null);

  // API hooks
  const { post: searchPost } = useApiData('/gfl/search');
  const { post: sessionPost } = useApiData('/sessions');

  // Auto-detect user location on component mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(coords);
          console.log('User location detected:', coords);
        },
        (error) => {
          console.error('Location detection failed:', error);
          setLocationError(
            currentLanguage === 'ar'
              ? 'فشل في تحديد الموقع. سيتم استخدام موقع افتراضي.'
              : 'Failed to detect location. Using default location.'
          );
          // Use Samarra as default location
          setUserLocation({ lat: 34.19625, lng: 43.88504 });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      setLocationError(
        currentLanguage === 'ar'
          ? 'خدمة تحديد الموقع غير متاحة.'
          : 'Geolocation service is not available.'
      );
      // Use Samarra as default location
      setUserLocation({ lat: 34.19625, lng: 43.88504 });
    }
  }, [currentLanguage]);

  // Load lost people data from localStorage on component mount
  useEffect(() => {
    const initializeMockData = () => {
      const existingData = localStorage.getItem('lostPeople');
      if (!existingData) {
        // Create 4 mock lost people for testing
        const mockLostPeople = [
          {
            id: "1",
            displayName: "أحمد محمد علي",
            age: 25,
            clothingColor: "أزرق",
            distinctiveFeature: "نظارة طبية",
            phone: "+964 770 123 4567",
            lastSeenLocation: "المنطقة الشمالية الشرقية (34.20125, 43.88756)",
            coordinates: { lat: 34.20125, lng: 43.88756 },
            consent: true,
            timestamp: "2024-01-15T10:30:00.000Z"
          },
          {
            id: "2", 
            displayName: "فاطمة حسن",
            age: 40,
            clothingColor: "أسود",
            distinctiveFeature: "حقيبة حمراء",
            phone: "+964 771 987 6543",
            lastSeenLocation: "المنطقة الجنوبية الغربية (34.18950, 43.87890)",
            coordinates: { lat: 34.18950, lng: 43.87890 },
            consent: true,
            timestamp: "2024-01-15T14:20:00.000Z"
          },
          {
            id: "3",
            displayName: "محمد حسين",
            age: 15, 
            clothingColor: "أخضر",
            distinctiveFeature: "حذاء رياضي أبيض",
            phone: "+964 772 555 1234",
            lastSeenLocation: "المنطقة الوسطى (34.19545, 43.88345)",
            coordinates: { lat: 34.19545, lng: 43.88345 },
            consent: true,
            timestamp: "2024-01-15T16:45:00.000Z"
          },
          {
            id: "4",
            displayName: "زينب أحمد",
            age: 28,
            clothingColor: "وردي",
            distinctiveFeature: "وشاح أزرق",
            phone: "+964 773 444 9876",
            lastSeenLocation: "المنطقة الشمالية الغربية (34.20080, 43.87655)",
            coordinates: { lat: 34.20080, lng: 43.87655 },
            consent: true,
            timestamp: "2024-01-15T18:10:00.000Z"
          }
        ];
        
        localStorage.setItem('lostPeople', JSON.stringify(mockLostPeople));
        setAllLostPeople(mockLostPeople);
      } else {
        setAllLostPeople(JSON.parse(existingData));
      }
    };

    initializeMockData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search for missing person:", searchData);
    
    setIsSearching(true);
    setSearchError("");
    setSearchResults([]);
    setShowResults(false);

    try {
      // Prepare search data for backend API using user's location or default
      const currentLocation = userLocation || { lat: 34.19625, lng: 43.88504 };
      const searchPayload = {
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        radiusM: 2000, // 2km search radius
        ...(searchData.name && { name: searchData.name }),
        ...(searchData.age > 0 && { age: searchData.age }),
        ...(searchData.clothingColor && { topColor: searchData.clothingColor }),
      };

      // Call backend search API
      await searchPost({
        data: searchPayload,
        onSuccess: (apiResponse) => {
          console.log("Search results:", apiResponse);
          // Handle different response structures - check if results are at the top level or nested in data
          const results = apiResponse.results || apiResponse.data?.results || [];
          console.log("Extracted results:", results);
          
          setSearchResults(results);
          setShowSearchModal(true);
        },
        onError: (error) => {
          console.error("Search failed:", error);
          setSearchError("فشل في البحث. يرجى المحاولة مرة أخرى.");
          // Fallback to localStorage data if API fails
          setSearchResults(allLostPeople);
          setShowSearchModal(true);
        }
      });

    } catch (error) {
      console.error("Search error:", error);
      setSearchError("حدث خطأ غير متوقع أثناء البحث.");
      // Fallback to localStorage data
      setSearchResults(allLostPeople);
      setShowSearchModal(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleStartTracking = async (profileId: string, profileName?: string) => {
    console.log('Starting tracking session for profile:', profileId);
    
    try {
      const sessionData = {
        profileId: profileId,
        searcherName: currentLanguage === 'ar' ? 'باحث غير معروف' : 'Unknown Searcher',
        note: currentLanguage === 'ar' ? 'جلسة تتبع بدأت من تطبيق البحث' : 'Tracking session started from search app'
      };

      await sessionPost({
        data: sessionData,
        onSuccess: (response) => {
          console.log('Tracking session created:', response);
          const sessionId = response.data?.id || response.id;
          if (sessionId) {
            // Store the session ID for the lost person to access
            localStorage.setItem(`activeSession_${profileId}`, sessionId);
            
            // Set active session state for navigation
            setActiveSessionId(sessionId);
            setActiveProfileId(profileId);
            setActiveProfileName(profileName || null);
            
            // Close any open modals
            setShowSearchModal(false);
            setShowMapModal(false);
          } else {
            alert(
              currentLanguage === 'ar'
                ? 'تم بدء جلسة التتبع بنجاح!'
                : 'Tracking session started successfully!'
            );
          }
        },
        onError: (error) => {
          console.error('Failed to create tracking session:', error);
          alert(
            currentLanguage === 'ar'
              ? 'فشل في بدء جلسة التتبع. يرجى المحاولة مرة أخرى.'
              : 'Failed to start tracking session. Please try again.'
          );
        }
      });
    } catch (error) {
      console.error('Session creation error:', error);
      alert(
        currentLanguage === 'ar'
          ? 'حدث خطأ غير متوقع أثناء بدء الجلسة.'
          : 'An unexpected error occurred while starting the session.'
      );
    }
  };

  // Show navigation interface if there's an active session
  if (activeSessionId && activeProfileId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <SearcherNavigationInterface
            sessionId={activeSessionId}
            targetProfileId={activeProfileId}
            targetProfileName={activeProfileName || undefined}
            onClose={() => {
              setActiveSessionId(null);
              setActiveProfileId(null);
              setActiveProfileName(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto">
        <FindPersonHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className={`text-xl font-semibold mb-6 ${dir.textAlign}`}>{t.searchInfoTitle}</h2>
            
            {/* Location Status */}
            <div className="mb-4 p-3 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">
                  {currentLanguage === 'ar' ? 'حالة الموقع:' : 'Location Status:'}
                </span>
                {userLocation ? (
                  <span className="text-green-600 text-sm">
                    {currentLanguage === 'ar' ? 'تم تحديد الموقع' : 'Location detected'}
                  </span>
                ) : (
                  <span className="text-yellow-600 text-sm">
                    {currentLanguage === 'ar' ? 'جاري تحديد الموقع...' : 'Detecting location...'}
                  </span>
                )}
              </div>
              {locationError && (
                <p className="text-yellow-700 text-xs">{locationError}</p>
              )}
              {userLocation && (
                <p className="text-xs text-gray-500">
                  {currentLanguage === 'ar' 
                    ? `الإحداثيات: ${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`
                    : `Coordinates: ${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`
                  }
                </p>
              )}
            </div>
            
            <SearchForm 
              searchData={searchData}
              setSearchData={setSearchData}
              onSubmit={handleSearch}
            />
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-semibold ${dir.textAlign}`}>{t.searchResultsTitle}</h2>
              {allLostPeople.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMapModal(true)}
                >
                  {currentLanguage === 'ar' ? 'عرض الكل على الخريطة' : 'Show All on Map'}
                </Button>
              )}
            </div>
            {searchError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {searchError}
              </div>
            )}
            {isSearching && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-2">{currentLanguage === 'ar' ? 'جاري البحث...' : 'Searching...'}</span>
              </div>
            )}
            <SearchResults 
              results={searchResults}
              showResults={showResults}
              onNewSearch={() => {
                setShowResults(false);
                setSearchError("");
              }}
            />
          </Card>
        </div>
      </div>

      {/* Search Results Modal */}
      <SearchResultsModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        results={searchResults}
        onStartTracking={handleStartTracking}
      />

      {/* All Lost People Map Modal */}
      <Dialog open={showMapModal} onOpenChange={setShowMapModal}>
        <DialogContent className="max-w-5xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {currentLanguage === 'ar' ? 'جميع الأشخاص المفقودين على الخريطة' : 'All Lost People on Map'}
            </DialogTitle>
            <DialogDescription>
              {currentLanguage === 'ar'
                ? 'عرض جميع الأشخاص المفقودين على الخريطة'
                : 'Display all lost people on the map'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="h-96">
            <SearcherMap
              isSelectable={false}
              showFullScreen={true}
              allLostPeople={allLostPeople}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}