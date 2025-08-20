"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguageStore } from "@/store/language/languageStore";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import { useLiveSession } from "@/hooks/useLiveSession";
import { RealTimeNavigationMap } from "./RealTimeNavigationMap";
import { navigationTranslations, errorTranslations, getFeatureTranslations } from "@/localization";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Users, 
  ArrowLeft, 
  CheckCircle,
  AlertCircle,
  Phone,
  Eye
} from "lucide-react";
import ErrorBoundary from "@/components/common/ErrorBoundary";

interface LostPersonNavigationInterfaceProps {
  sessionId: string;
  profileId: string;
  searcherName?: string;
  onClose: () => void;
}

interface SearcherLocation {
  latitude?: number;
  longitude?: number;
  _latitude?: number;
  _longitude?: number;
}

export function LostPersonNavigationInterface({ 
  sessionId, 
  profileId,
  searcherName,
  onClose 
}: LostPersonNavigationInterfaceProps) {
  const { currentLanguage } = useLanguageStore();
  const dir = getDirectionalClasses(currentLanguage);
  
  // Translation objects
  const navT = getFeatureTranslations(navigationTranslations, currentLanguage);
  const errorT = getFeatureTranslations(errorTranslations, currentLanguage);
  
  // Real-time session data
  const { sessionData, isConnected: sessionConnected } = useLiveSession(sessionId);
  
  // Local state
  const [showFullMap, setShowFullMap] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [estimatedArrival, setEstimatedArrival] = useState<number | null>(null);
  const [searcherConfirmed, setSearcherConfirmed] = useState(false);
  
  // Calculate distance and ETA when searcher location updates
  useEffect(() => {
    console.log('[LostPersonNavigationInterface] Session data changed:', {
      hasSessionData: !!sessionData,
      hasSession: !!sessionData?.session,
      hasSearcher: !!sessionData?.session?.searcher,
      hasSearcherGeopoint: !!sessionData?.session?.searcher?.geopoint,
      hasLostPerson: !!sessionData?.lostPerson,
      hasLostPersonGeopoint: !!sessionData?.lostPerson?.geopoint,
      searcherGeopoint: sessionData?.session?.searcher?.geopoint,
      lostPersonGeopoint: sessionData?.lostPerson?.geopoint
    });
    
    if (sessionData?.session?.searcher?.geopoint && sessionData?.lostPerson?.geopoint) {
      const searcherGeo = sessionData.session.searcher.geopoint as SearcherLocation;
      const lostGeo = sessionData.lostPerson.geopoint as SearcherLocation;
      
      const searcherLat = searcherGeo._latitude || searcherGeo.latitude;
      const searcherLng = searcherGeo._longitude || searcherGeo.longitude;
      const lostLat = lostGeo._latitude || lostGeo.latitude;
      const lostLng = lostGeo._longitude || lostGeo.longitude;
      
      console.log('[LostPersonNavigationInterface] Location data:', {
        searcherLat, searcherLng, lostLat, lostLng
      });
      
      if (searcherLat && searcherLng && lostLat && lostLng && 
          typeof searcherLat === 'number' && typeof searcherLng === 'number' &&
          typeof lostLat === 'number' && typeof lostLng === 'number') {
        // Calculate distance using Haversine formula (rough estimate)
        const R = 6371e3; // Earth's radius in meters
        const φ1 = searcherLat * Math.PI/180;
        const φ2 = lostLat * Math.PI/180;
        const Δφ = (lostLat-searcherLat) * Math.PI/180;
        const Δλ = (lostLng-searcherLng) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        const calculatedDistance = R * c;
        setDistance(calculatedDistance);
        
        // Estimate arrival time (assuming walking speed of 1.4 m/s)
        const walkingSpeed = 1.4; // m/s
        const eta = Math.round(calculatedDistance / walkingSpeed);
        setEstimatedArrival(eta);
      }
    }
  }, [sessionData]);

  const formatDistance = (distance: number): string => {
    if (distance < 1000) {
      return `${Math.round(distance)} ${navT.distance.meterShort}`;
    } else {
      return `${(distance / 1000).toFixed(1)} ${navT.distance.kilometerShort}`;
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes} ${navT.time.minute} ${remainingSeconds > 0 ? `${navT.time.and} ${remainingSeconds} ${navT.time.second}` : ''}`;
    } else {
      return `${remainingSeconds} ${navT.time.seconds}`;
    }
  };

  const getStatusMessage = (): { text: string; color: string; icon: React.JSX.Element } => {
    if (!sessionConnected) {
      return {
        text: navT.status.noConnection,
        color: 'text-gray-500',
        icon: <AlertCircle className="w-5 h-5" />
      };
    }
    
    if (searcherConfirmed) {
      return {
        text: navT.lostPerson.foundMessage,
        color: 'text-green-600',
        icon: <CheckCircle className="w-5 h-5" />
      };
    }
    
    if (distance && distance < 20) {
      return {
        text: navT.lostPerson.veryCloseMessage,
        color: 'text-green-600',
        icon: <Eye className="w-5 h-5" />
      };
    }
    
    if (distance && distance < 100) {
      return {
        text: navT.lostPerson.approachingMessage,
        color: 'text-blue-600',
        icon: <Navigation className="w-5 h-5" />
      };
    }
    
    return {
      text: navT.lostPerson.headingToYouMessage,
      color: 'text-blue-600',
      icon: <Users className="w-5 h-5" />
    };
  };

  const handleSearcherFound = () => {
    setSearcherConfirmed(true);
    // Here you could also call an API to update the session status
  };

  const status = getStatusMessage();
  
  // Remove the translations object as we now use navT directly

  if (showFullMap) {
    return (
      <ErrorBoundary
        fallbackTitle={navT.lostPerson.mapError}
        fallbackMessage={navT.lostPerson.errorDescription}
      >
        <RealTimeNavigationMap
          sessionId={sessionId}
          userType="lost"
          profileId={profileId}
          onClose={() => setShowFullMap(false)}
        />
      </ErrorBoundary>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto p-4">
      {/* Header */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-white shadow-md ${status.color}`}>
              {status.icon}
            </div>
            <div className={dir.textAlign}>
              <h1 className="text-lg font-bold text-gray-800">
                {navT.lostPerson.title}
              </h1>
              <p className="text-sm text-gray-600">
                {navT.lostPerson.subtitle}
              </p>
            </div>
          </div>
          
          <Button variant="outline" size="sm" onClick={onClose}>
            <ArrowLeft className="w-4 h-4 ml-2" />
            {navT.lostPerson.back}
          </Button>
        </div>

        {/* Status Badge and Distance/ETA in one row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Badge 
            className={`text-base px-3 py-2 ${
              searcherConfirmed 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {status.text}
          </Badge>

          {/* Distance and ETA - Compact Version */}
          {distance && estimatedArrival && !searcherConfirmed && (
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div className="text-center">
                  <p className="text-xs text-gray-500">{navT.lostPerson.distance}</p>
                  <p className="font-bold text-blue-800">{formatDistance(distance)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                <div className="text-center">
                  <p className="text-xs text-gray-500">{navT.lostPerson.estimatedArrival}</p>
                  <p className="font-bold text-green-800">{formatTime(estimatedArrival)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Main Navigation Map - Always show when session exists */}
      <Card className="p-2">
        <ErrorBoundary
          fallbackTitle={navT.lostPerson.mapError}
          fallbackMessage={navT.lostPerson.errorDescription}
        >
          <div className="h-96 lg:h-[500px]">
            <RealTimeNavigationMap
              sessionId={sessionId}
              userType="lost"
              profileId={profileId}
              onClose={() => {}} // No close needed in embedded mode
            />
          </div>
        </ErrorBoundary>
      </Card>

      {/* Searcher Information */}
      {searcherName && (
        <Card className="p-4">
          <h3 className={`font-semibold mb-2 ${dir.textAlign}`}>
            {navT.lostPerson.searcherInfo}
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">{searcherName}</p>
              <p className="text-sm text-gray-500">
                {navT.lostPerson.searchVolunteer}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 gap-3">
        {!searcherConfirmed && distance && distance < 50 && (
          <Button 
            onClick={handleSearcherFound}
            size="lg"
            className="bg-green-600 hover:bg-green-700"
          >
            <Eye className="w-5 h-5 ml-2" />
            {navT.lostPerson.canSeeSearcher}
          </Button>
        )}
        
        {searcherName && (
          <Button variant="outline" size="lg" className="w-full">
            <Phone className="w-5 h-5 ml-2" />
            {navT.lostPerson.call}
          </Button>
        )}
      </div>

      {/* Instructions */}
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <h3 className={`font-semibold text-yellow-800 mb-2 ${dir.textAlign}`}>
          {navT.lostPerson.instructions}
        </h3>
        <ul className={`text-sm text-yellow-700 space-y-1 ${dir.textAlign}`}>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
            {navT.lostPerson.stayInPlace}
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
            {navT.lostPerson.lookOutForSearcher}
          </li>
          {searcherName && (
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
              {`${navT.lostPerson.searcherName} ${searcherName}`}
            </li>
          )}
        </ul>
      </Card>

      {/* Connection Status */}
      <Card className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{navT.lostPerson.connectionStatus}:</span>
          <Badge variant={sessionConnected ? "default" : "secondary"}>
            {sessionConnected 
              ? navT.status.connected
              : navT.status.disconnected
            }
          </Badge>
        </div>
      </Card>
    </div>
  );
}