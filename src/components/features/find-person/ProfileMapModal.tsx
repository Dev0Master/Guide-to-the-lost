"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguageStore } from "@/store/language/languageStore";
import { getDirectionalClasses } from "@/lib/rtl-utils";

interface Profile {
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

interface ProfileMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  onStartTracking: (profileId: string) => void;
}

export function ProfileMapModal({ 
  isOpen, 
  onClose, 
  profile,
  onStartTracking 
}: ProfileMapModalProps) {
  const { currentLanguage } = useLanguageStore();
  const dir = getDirectionalClasses(currentLanguage);

  // Get location coordinates if available
  const coordinates = profile.geopoint ? {
    lat: profile.geopoint.latitude || profile.geopoint._latitude || 0,
    lng: profile.geopoint.longitude || profile.geopoint._longitude || 0
  } : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className={dir.textAlign}>
            {profile.displayName}
          </DialogTitle>
          <DialogDescription className={dir.textAlign}>
            {currentLanguage === 'ar'
              ? 'تفاصيل الشخص المفقود وموقعه على الخريطة'
              : 'Details of the lost person and their location on the map'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[70vh]">
          {/* Profile Details */}
          <Card className="p-4 lg:col-span-1">
            <h3 className={`font-semibold mb-4 ${dir.textAlign}`}>
              {currentLanguage === 'ar' ? 'تفاصيل الشخص' : 'Person Details'}
            </h3>
            
            <div className={`space-y-3 text-sm ${dir.textAlign}`}>
              <div>
                <span className="font-medium text-gray-700">
                  {currentLanguage === 'ar' ? 'الاسم:' : 'Name:'}
                </span>
                <p className="mt-1">{profile.displayName}</p>
              </div>
              
              {profile.age && (
                <div>
                  <span className="font-medium text-gray-700">
                    {currentLanguage === 'ar' ? 'العمر:' : 'Age:'}
                  </span>
                  <p className="mt-1">{profile.age}</p>
                </div>
              )}
              
              {profile.topColor && (
                <div>
                  <span className="font-medium text-gray-700">
                    {currentLanguage === 'ar' ? 'لون الملابس:' : 'Clothing Color:'}
                  </span>
                  <p className="mt-1">{profile.topColor}</p>
                </div>
              )}
              
              {profile.distinctive && (
                <div>
                  <span className="font-medium text-gray-700">
                    {currentLanguage === 'ar' ? 'علامات مميزة:' : 'Distinctive Features:'}
                  </span>
                  <p className="mt-1">{profile.distinctive}</p>
                </div>
              )}
              
              {profile.phone && (
                <div>
                  <span className="font-medium text-gray-700">
                    {currentLanguage === 'ar' ? 'رقم الهاتف:' : 'Phone Number:'}
                  </span>
                  <p className="mt-1 font-mono">{profile.phone}</p>
                </div>
              )}
              
              {profile.geopoint && (
                <div>
                  <span className="font-medium text-gray-700">
                    {currentLanguage === 'ar' ? 'الموقع:' : 'Location:'}
                  </span>
                  <p className="mt-1 font-mono text-xs">
                    {(profile.geopoint.latitude || profile.geopoint._latitude || 0).toFixed(5)}, {(profile.geopoint.longitude || profile.geopoint._longitude || 0).toFixed(5)}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mt-6">
              <Button
                onClick={() => onStartTracking(profile.id)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {currentLanguage === 'ar' ? 'بدء جلسة التتبع' : 'Start Tracking Session'}
              </Button>
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h4 className={`font-semibold text-blue-800 text-sm mb-2 ${dir.textAlign}`}>
                  {currentLanguage === 'ar' ? 'ما الذي سيحدث بعد ذلك؟' : 'What happens next?'}
                </h4>
                <ul className={`text-xs text-blue-700 space-y-1 ${dir.textAlign}`}>
                  <li>
                    {currentLanguage === 'ar'
                      ? '• سيتم إنشاء جلسة تتبع مع الشخص المفقود'
                      : '• A tracking session will be created with the lost person'
                    }
                  </li>
                  <li>
                    {currentLanguage === 'ar'
                      ? '• سيتم إرسال إشعار للشخص المفقود'
                      : '• The lost person will receive a notification'
                    }
                  </li>
                  <li>
                    {currentLanguage === 'ar'
                      ? '• ستتمكن من رؤية موقعهم والتواصل معهم'
                      : '• You will be able to see their location and communicate'
                    }
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Location Information */}
          <div className="lg:col-span-2">
            {coordinates ? (
              <Card className="p-6 h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className={`text-center space-y-4 ${dir.textAlign}`}>
                  <div className="text-4xl">📍</div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {currentLanguage === 'ar' ? 'معلومات الموقع' : 'Location Information'}
                  </h3>
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <p className="text-sm text-gray-600 mb-2">
                      {currentLanguage === 'ar' ? 'الإحداثيات:' : 'Coordinates:'}
                    </p>
                    <p className="font-mono text-lg text-blue-600">
                      {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                    </p>
                  </div>
                  {profile.lastSeen && (
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                      <p className="text-sm text-gray-600 mb-2">
                        {currentLanguage === 'ar' ? 'آخر مكان شوهد فيه:' : 'Last seen location:'}
                      </p>
                      <p className="text-gray-800">{profile.lastSeen}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    {currentLanguage === 'ar' 
                      ? 'يمكن للفرق المتخصصة استخدام هذه المعلومات للبحث'
                      : 'Specialized teams can use this information for search operations'
                    }
                  </p>
                </div>
              </Card>
            ) : (
              <Card className="p-6 h-full flex items-center justify-center bg-gray-50">
                <div className={`text-center space-y-4 ${dir.textAlign}`}>
                  <div className="text-4xl">❓</div>
                  <h3 className="text-xl font-semibold text-gray-600">
                    {currentLanguage === 'ar'
                      ? 'لا توجد معلومات موقع متاحة'
                      : 'No location information available'
                    }
                  </h3>
                  <p className="text-sm text-gray-500">
                    {currentLanguage === 'ar'
                      ? 'لم يتم تسجيل موقع لهذا الشخص بعد'
                      : 'No location has been recorded for this person yet'
                    }
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-center pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            {currentLanguage === 'ar' ? 'إغلاق' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}