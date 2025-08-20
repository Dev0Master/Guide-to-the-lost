"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguageStore } from "@/store/language/languageStore";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import { ProfileMapModal } from "./ProfileMapModal";
import { AlertDialog, useAlertDialog } from "@/components/ui/alert-dialog";

interface SearchResult {
  id: string;
  displayName: string;
  age?: number;
  topColor?: string;
  distinctive?: string;
  phone?: string;
  geopoint?: {
    latitude?: number;
    longitude?: number;
    _latitude?: number;
    _longitude?: number;
  };
  lastSeen?: string;
  score?: number;
}

interface SearchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: SearchResult[];
  onStartTracking: (profileId: string, profileName?: string) => void;
  isStartingSession?: boolean;
}

export function SearchResultsModal({ 
  isOpen, 
  onClose, 
  results,
  onStartTracking,
  isStartingSession = false
}: SearchResultsModalProps) {
  const { currentLanguage } = useLanguageStore();
  const dir = getDirectionalClasses(currentLanguage);
  const [selectedProfile, setSelectedProfile] = useState<SearchResult | null>(null);
  const { alertProps, showAlert } = useAlertDialog();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={dir.textAlign}>
              {currentLanguage === 'ar' 
                ? `نتائج البحث (${results.length})`
                : `Search Results (${results.length})`
              }
            </DialogTitle>
            <DialogDescription className={dir.textAlign}>
              {currentLanguage === 'ar'
                ? 'قائمة بالأشخاص المفقودين المطابقين لعملية البحث'
                : 'List of lost people matching your search criteria'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {results.length === 0 ? (
              <div className="text-center py-8">
                <p className={`text-gray-500 ${dir.textAlign}`}>
                  {currentLanguage === 'ar'
                    ? 'لم يتم العثور على نتائج مطابقة'
                    : 'No matching results found'
                  }
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {results.map((result) => (
                  <Card key={result.id} className="p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className={`font-semibold text-lg mb-2 ${dir.textAlign}`}>
                          {result.displayName}
                        </h3>
                        
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 ${dir.textAlign}`}>
                          {result.age && (
                            <div>
                              <span className="font-medium">
                                {currentLanguage === 'ar' ? 'العمر:' : 'Age:'}
                              </span> {result.age}
                            </div>
                          )}
                          
                          {result.topColor && (
                            <div>
                              <span className="font-medium">
                                {currentLanguage === 'ar' ? 'لون الملابس:' : 'Clothing Color:'}
                              </span> {result.topColor}
                            </div>
                          )}
                          
                          {result.distinctive && (
                            <div className="md:col-span-2">
                              <span className="font-medium">
                                {currentLanguage === 'ar' ? 'علامات مميزة:' : 'Distinctive Features:'}
                              </span> {result.distinctive}
                            </div>
                          )}
                          
                          {result.phone && (
                            <div className="md:col-span-2">
                              <span className="font-medium">
                                {currentLanguage === 'ar' ? 'رقم الهاتف:' : 'Phone:'}
                              </span> {result.phone}
                            </div>
                          )}
                        </div>

                        {result.geopoint && (
                          <div className={`mt-2 text-xs text-gray-500 ${dir.textAlign}`}>
                            {currentLanguage === 'ar' ? 'الموقع:' : 'Location:'} 
                            {` ${(result.geopoint.latitude || result.geopoint._latitude || 0).toFixed(5)}, ${(result.geopoint.longitude || result.geopoint._longitude || 0).toFixed(5)}`}
                          </div>
                        )}
                        
                        {result.score && (
                          <div className={`mt-1 text-xs text-blue-600 ${dir.textAlign}`}>
                            {currentLanguage === 'ar' ? 'درجة التطابق:' : 'Match Score:'} {(result.score * 100).toFixed(0)}%
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col">
                        
                        <Button
                          size="sm"
                          onClick={() => {
                            const profileId = result.id;
                            const profileName = result.displayName;
                            
                            showAlert({
                              type: 'warning',
                              title: currentLanguage === 'ar' ? 'تأكيد بدء التتبع' : 'Confirm Tracking',
                              description: currentLanguage === 'ar' 
                                ? 'هل أنت متأكد من بدء تتبع هذا الشخص؟ سيتم إشعارهم بأنك تحاول الوصول إليهم.'
                                : 'Are you sure you want to start tracking this person? They will be notified that you are trying to reach them.',
                              confirmText: currentLanguage === 'ar' ? 'بدء التتبع' : 'Start Tracking',
                              cancelText: currentLanguage === 'ar' ? 'إلغاء' : 'Cancel',
                              showCancel: true,
                              onConfirm: async () => {                                
                                // Call onStartTracking and wait for completion
                                await onStartTracking(profileId, profileName);
                                
                                // Close the modal after successful tracking start
                                onClose();
                              }
                            });
                          }}
                          disabled={isStartingSession}
                          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isStartingSession ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                              {currentLanguage === 'ar' ? 'جاري بدء التتبع...' : 'Starting tracking...'}
                            </>
                          ) : (
                            <>
                              {currentLanguage === 'ar' ? '🔍 بدء التتبع' : '🔍 Start Tracking'}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={onClose}>
                {currentLanguage === 'ar' ? 'إغلاق' : 'Close'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Map Modal */}
      {selectedProfile && (
        <ProfileMapModal
          isOpen={!!selectedProfile}
          onClose={() => setSelectedProfile(null)}
          profile={selectedProfile}
          onStartTracking={(profileId) => {
            onStartTracking(profileId, selectedProfile.displayName);
            setSelectedProfile(null);
            onClose();
          }}
        />
      )}

      {/* Confirmation Alert Dialog */}
      <AlertDialog {...alertProps} />
    </>
  );
}