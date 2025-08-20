"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, useAlertDialog } from "@/components/ui/alert-dialog";
import { useLanguageStore } from "@/store/language/languageStore";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import { NavigationMap } from "./NavigationMap";
import { lostPersonTranslations, getFeatureTranslations } from "@/localization";

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
  const t = getFeatureTranslations(lostPersonTranslations, currentLanguage);
  const [showNavigation, setShowNavigation] = useState(false);
  const { alertProps, showAlert } = useAlertDialog();

  const handleNewRegistration = () => {
    showAlert({
      type: 'warning',
      title: t.newRegistrationTitle, // changed from t.confirmNewRegistration
      description: t.newRegistrationWarning,
      confirmText: t.confirmButton,
      cancelText: t.cancelButton,
      showCancel: true,
      onConfirm: () => {
        // Clear saved profile ID when registering new person
        localStorage.removeItem('userProfileId');
        onNewRegistration();
      }
    });
  };


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
          {t.waitingTitle}
        </h2>
        
        <p className={`text-gray-600 ${dir.textAlign} leading-relaxed`}>
          {t.waitingMessage}
        </p>

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className={`text-sm text-blue-700 ${dir.textAlign}`}>
            {t.profileIdLabel} {profileId}
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => setShowNavigation(true)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {t.openNavigation}
            </Button>

            <Button 
              variant="outline"
              onClick={handleNewRegistration}
              className="w-full"
            >
              {t.newRegistrationForSite}
            </Button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className={`font-semibold text-yellow-800 mb-2 ${dir.textAlign}`}>
            {t.importantTips}
          </h3>
          <ul className={`text-sm text-yellow-700 space-y-1 ${dir.textAlign}`}>
            {t.tipsList.map((tip, index) => (
              <li key={index}>• {tip}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <AlertDialog {...alertProps} />
    </Card>
  );
}