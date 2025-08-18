import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguageStore } from "@/store/language/languageStore";
import { findPersonTranslations, getFeatureTranslations } from "@/localization";
import { getDirectionalClasses } from "@/lib/rtl-utils";

interface SearchResult {
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

interface SearchResultsProps {
  results: SearchResult[];
  showResults: boolean;
  onNewSearch: () => void;
}

export function SearchResults({ results, showResults, onNewSearch }: SearchResultsProps) {
  const { currentLanguage } = useLanguageStore();
  const t = getFeatureTranslations(findPersonTranslations, currentLanguage);
  const dir = getDirectionalClasses(currentLanguage);
  const [selectedPerson, setSelectedPerson] = useState<SearchResult | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  if (!showResults) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>{t.noSearchMessage || (currentLanguage === 'ar' ? 'استخدم النموذج أعلاه للبحث عن شخص مفقود' : 'Use the form above to search for a lost person')}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>{t.noResultsMessage}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={onNewSearch}
        >
          {t.newSearch}
        </Button>
      </div>
    );
  }

  const handleShowMap = (person: SearchResult) => {
    setSelectedPerson(person);
    setShowMapModal(true);
  };

  return (
    <>
      <div className="space-y-4">
        {results.map((result) => (
          <Card key={result.id} className="p-4 border-l-4 border-l-green-500">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {new Date(result.timestamp).toLocaleDateString('ar-IQ')}
              </span>
              <h3 className="font-semibold">{result.displayName}</h3>
            </div>
            
            <div className={`text-sm text-gray-600 space-y-1 ${dir.textAlign}`}>
              <p><strong>{t.age}:</strong> {result.age} {currentLanguage === 'ar' ? 'سنة' : 'years'}</p>
              <p><strong>{t.clothing}:</strong> {result.clothingColor}</p>
              <p><strong>{t.lastSeen}:</strong> {result.lastSeenLocation}</p>
              <p><strong>{"الهاتف"}:</strong> {result.phone}</p>
              {result.distinctiveFeature && (
                <p><strong>{t.distinctiveMark}:</strong> {result.distinctiveFeature}</p>
              )}
            </div>
            
            {result.coordinates && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-600">📍</span>
                  <span className="text-sm font-medium text-blue-800">
                    {currentLanguage === 'ar' ? 'الإحداثيات:' : 'Coordinates:'}
                  </span>
                </div>
                <p className="font-mono text-sm text-blue-700">
                  {result.coordinates.lat.toFixed(5)}, {result.coordinates.lng.toFixed(5)}
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => handleShowMap(result)}
                >
                  {currentLanguage === 'ar' ? 'عرض التفاصيل' : 'Show Details'}
                </Button>
              </div>
            )}
          </Card>
        ))}
        
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            {results.length} {currentLanguage === 'ar' ? 'شخص مفقود' : 'lost people'}
          </p>
        </div>
      </div>

      {/* Location Details Modal */}
      <Dialog open={showMapModal} onOpenChange={setShowMapModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className={dir.textAlign}>
              {currentLanguage === 'ar' ? 'تفاصيل' : 'Details of'} {selectedPerson?.displayName}
            </DialogTitle>
          </DialogHeader>
<<<<<<< HEAD
          
          {selectedPerson && (
            <div className="space-y-4">
              {/* Location Information */}
              {selectedPerson.coordinates && (
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200">
                  <div className={`text-center space-y-3 ${dir.textAlign}`}>
                    <div className="text-3xl">📍</div>
                    <h3 className="font-semibold text-blue-800">
                      {currentLanguage === 'ar' ? 'معلومات الموقع' : 'Location Information'}
                    </h3>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">
                        {currentLanguage === 'ar' ? 'الإحداثيات:' : 'Coordinates:'}
                      </p>
                      <p className="font-mono text-blue-600 text-lg">
                        {selectedPerson.coordinates.lat.toFixed(6)}, {selectedPerson.coordinates.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Person Details */}
              <Card className="p-4">
                <h3 className={`font-semibold mb-3 ${dir.textAlign}`}>
                  {currentLanguage === 'ar' ? 'معلومات الشخص' : 'Person Information'}
                </h3>
                <div className={`text-sm space-y-2 ${dir.textAlign}`}>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.lastSeen}:</span>
                    <span className="font-medium">{selectedPerson.lastSeenLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{currentLanguage === 'ar' ? 'الهاتف:' : 'Phone:'}:</span>
                    <span className="font-mono">{selectedPerson.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.age}:</span>
                    <span className="font-medium">{selectedPerson.age} {currentLanguage === 'ar' ? 'سنة' : 'years'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.clothing}:</span>
                    <span className="font-medium">{selectedPerson.clothingColor}</span>
                  </div>
                  {selectedPerson.distinctiveFeature && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t.distinctiveMark}:</span>
                      <span className="font-medium">{selectedPerson.distinctiveFeature}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowMapModal(false)}
                  className="flex-1"
                >
                  {currentLanguage === 'ar' ? 'إغلاق' : 'Close'}
                </Button>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    // Handle tracking action if needed
                    console.log('Start tracking:', selectedPerson.id);
                    setShowMapModal(false);
                  }}
                >
                  {currentLanguage === 'ar' ? 'بدء التتبع' : 'Start Tracking'}
                </Button>
              </div>
            </div>
          )}
=======
          <div className="h-96">
            {selectedPerson?.coordinates && (
              <SearcherMap
                initialCoordinates={selectedPerson.coordinates}
                isSelectable={false}
                showPin={true}
                personName={selectedPerson.displayName}
                showFullScreen={true}
              />
            )}
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>{t.lastSeen}:</strong> {selectedPerson?.lastSeenLocation}</p>
            <p><strong>{"الهاتف"}:</strong> {selectedPerson?.phone}</p>
            {selectedPerson?.distinctiveFeature && (
              <p><strong>{t.distinctiveMark}:</strong> {selectedPerson.distinctiveFeature}</p>
            )}
          </div>
>>>>>>> 0b8b9e88898342a781af43426cec2fff85362bb8
        </DialogContent>
      </Dialog>
    </>
  );
}