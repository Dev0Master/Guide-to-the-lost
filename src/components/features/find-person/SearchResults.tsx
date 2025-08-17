import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguageStore } from "@/store/language/languageStore";
import { findPersonTranslations, getFeatureTranslations } from "@/localization";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import SearcherMap from "@/components/common/SearcherMap";

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
            
            <div className="mt-4">
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => handleShowMap(result)}
                disabled={!result.coordinates}
              >
                {t.showOnMap || "عرض على الخريطة"}
              </Button>
            </div>
          </Card>
        ))}
        
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            {results.length} {currentLanguage === 'ar' ? 'شخص مفقود' : 'lost people'}
          </p>
        </div>
      </div>

      {/* Map Modal */}
      <Dialog open={showMapModal} onOpenChange={setShowMapModal}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {currentLanguage === 'ar' ? 'موقع' : 'Location of'} {selectedPerson?.displayName}
            </DialogTitle>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>
    </>
  );
}