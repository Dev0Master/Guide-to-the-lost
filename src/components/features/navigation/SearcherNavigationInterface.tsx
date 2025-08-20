"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguageStore } from "@/store/language/languageStore";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import { RealTimeNavigationMap } from "./RealTimeNavigationMap";
import { Navigation, ArrowLeft, MapPin } from "lucide-react";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { navigationTranslations, errorTranslations, getFeatureTranslations } from "@/localization";

interface SearcherNavigationInterfaceProps {
  sessionId: string;
  targetProfileId: string;
  targetProfileName?: string;
  onClose: () => void;
}

export function SearcherNavigationInterface({ 
  sessionId, 
  targetProfileId,
  targetProfileName,
  onClose 
}: SearcherNavigationInterfaceProps) {
  const { currentLanguage } = useLanguageStore();
  const dir = getDirectionalClasses(currentLanguage);
  const [showFullNavigation, setShowFullNavigation] = useState(false);
  
  // Translation objects
  const navT = getFeatureTranslations(navigationTranslations, currentLanguage);
  const errorT = getFeatureTranslations(errorTranslations, currentLanguage);

  if (showFullNavigation) {
    return (
      <ErrorBoundary
        fallbackTitle={errorT.navigation.navigationError}
        fallbackMessage={errorT.navigation.interfaceErrorMessage}
      >
        <RealTimeNavigationMap
          sessionId={sessionId}
          userType="searcher"
          profileId={targetProfileId}
          onClose={() => setShowFullNavigation(false)}
        />
      </ErrorBoundary>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Navigation className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className={`font-semibold text-blue-900 ${dir.textAlign}`}>
                {navT.searcher.title}
              </h2>
              <p className={`text-sm text-blue-700 ${dir.textAlign}`}>
                {targetProfileName
                  ? `${navT.searcher.searcherInfo}: ${targetProfileName}`
                  : navT.searcher.searcherInfoDescription
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-600">
              {navT.searcher.active}
            </Badge>
            <Button variant="outline" size="sm" onClick={onClose}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              {navT.searcher.back}
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <h3 className={`font-semibold mb-2 ${dir.textAlign}`}>
              {navT.searcher.liveNavigation}
            </h3>
            <p className={`text-sm text-gray-600 mb-4 ${dir.textAlign}`}>
              {navT.searcher.liveNavigationDescription}
            </p>
            <Button 
              onClick={() => setShowFullNavigation(true)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Navigation className="w-4 h-4 mr-2" />
              {navT.searcher.openNavigation}
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <div className="p-3 bg-orange-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className={`font-semibold mb-2 ${dir.textAlign}`}>
              {navT.searcher.directContact}
            </h3>
            <p className={`text-sm text-gray-600 mb-4 ${dir.textAlign}`}>
              {navT.searcher.contactDescription}
            </p>
            <Button 
              variant="outline" 
              className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              {navT.searcher.call}
            </Button>
          </div>
        </Card>
      </div>

      {/* Session Information */}
      <Card className="p-4">
        <h3 className={`font-semibold mb-3 ${dir.textAlign}`}>
          {navT.searcher.sessionInfo}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">
              {navT.searcher.sessionId}
            </span>
            <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mt-1">{sessionId}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">
              {navT.searcher.profileId}
            </span>
            <p className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mt-1">{targetProfileId}</p>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h3 className={`font-semibold text-blue-900 mb-3 ${dir.textAlign}`}>
          {navT.searcher.searchInstructions}
        </h3>
        <ul className={`text-sm text-blue-800 space-y-2 ${dir.textAlign}`}>
          {navT.searcher.instructionsList.map((instruction, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>{instruction}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}