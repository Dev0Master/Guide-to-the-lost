"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/store/language/languageStore";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import { NavigationMap } from "./NavigationMap";

interface WaitingInterfaceProps {
  profileId: string;
  onNavigationRequest: () => void;
  onNewRegistration: () => void;
}

export function WaitingInterface({ 
  profileId, 
  onNewRegistration 
}: WaitingInterfaceProps) {
  const { currentLanguage } = useLanguageStore();
  const dir = getDirectionalClasses(currentLanguage);
  const [showNavigation, setShowNavigation] = useState(false);

  if (showNavigation) {
    return (
      <NavigationMap 
        profileId={profileId}
        onClose={() => setShowNavigation(false)}
      />
    );
  }

  return (
    <Card className="p-8">
      <div className="text-center space-y-6">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">📍</span>
          </div>
        </div>
        
        <h2 className={`text-2xl font-bold text-blue-600 ${dir.textAlign}`}>
          {currentLanguage === 'ar' 
            ? 'في انتظار الباحثين...' 
            : 'Waiting for searchers...'
          }
        </h2>
        
        <p className={`text-gray-600 ${dir.textAlign} leading-relaxed`}>
          {currentLanguage === 'ar'
            ? 'تم تسجيل ملفك الشخصي بنجاح. الآن يمكن للباحثين العثور عليك والتواصل معك. سيتم إشعارك عندما يبدأ أحد الباحثين جلسة تتبع معك.'
            : 'Your profile has been registered successfully. Now searchers can find you and communicate with you. You will be notified when a searcher starts a tracking session with you.'
          }
        </p>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className={`text-sm text-blue-700 ${dir.textAlign}`}>
            {currentLanguage === 'ar'
              ? `معرف ملفك الشخصي: ${profileId}`
              : `Your profile ID: ${profileId}`
            }
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => setShowNavigation(true)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {currentLanguage === 'ar' 
                ? 'فتح التوجيه والملاحة' 
                : 'Open Navigation & Guidance'
              }
            </Button>

            <Button 
              variant="outline"
              onClick={() => {
                // Clear saved profile ID when registering new person
                localStorage.removeItem('userProfileId');
                onNewRegistration();
              }}
              className="w-full"
            >
              {currentLanguage === 'ar' 
                ? 'تسجيل شخص آخر' 
                : 'Register Another Person'
              }
            </Button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className={`font-semibold text-yellow-800 mb-2 ${dir.textAlign}`}>
            {currentLanguage === 'ar' 
              ? 'نصائح مهمة:' 
              : 'Important Tips:'
            }
          </h3>
          <ul className={`text-sm text-yellow-700 space-y-1 ${dir.textAlign}`}>
            <li>
              {currentLanguage === 'ar'
                ? '• حافظ على هاتفك مشحوناً ومتصلاً بالإنترنت'
                : '• Keep your phone charged and connected to the internet'
              }
            </li>
            <li>
              {currentLanguage === 'ar'
                ? '• ابق في مكان آمن ومرئي'
                : '• Stay in a safe and visible location'
              }
            </li>
            <li>
              {currentLanguage === 'ar'
                ? '• اتصل بالطوارئ إذا كنت في خطر'
                : '• Call emergency services if you are in danger'
              }
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}