"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguageStore } from "@/store/language/languageStore";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import { useApiData } from "@/hooks/useApi";
import { Route, Clock, MapPin, Check } from "lucide-react";
import { navigationTranslations, getFeatureTranslations } from "@/localization";

interface RouteAlternative {
  id: string;
  routeIndex: number;
  characteristics: {
    name: string;
    description: string;
    type: 'shortest' | 'fastest' | 'walkable';
  };
  distance: number;
  duration: number;
  geometry: {
    coordinates: [number, number][];
  };
}

interface RouteSelectionPanelProps {
  sessionId: string | null;
  onRouteSelected: (routeId: string, routeIndex: number, route: RouteAlternative) => void;
  selectedRouteId?: string | null;
  className?: string;
  onClose?: () => void;
}

export function RouteSelectionPanel({ 
  sessionId, 
  onRouteSelected,
  selectedRouteId,
  className = "",
  onClose
}: RouteSelectionPanelProps) {
  const { currentLanguage } = useLanguageStore();
  const dir = getDirectionalClasses(currentLanguage);
  
  // Translation objects
  const navT = getFeatureTranslations(navigationTranslations, currentLanguage);
  
  const [alternatives, setAlternatives] = useState<RouteAlternative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);

  // API hooks
  const { get: getRouteAlternatives } = useApiData(`/navigation/sessions/${sessionId}/route-alternatives`);
  const { post: selectRoute } = useApiData(`/navigation/sessions/${sessionId}/select-route`);

  // Load route alternatives on mount
  useEffect(() => {
    loadRouteAlternatives();
  }, [sessionId]);

  const loadRouteAlternatives = async () => {
    setIsLoading(true);
    try {
      const response = await getRouteAlternatives();
      console.log('[RouteSelectionPanel] Route alternatives loaded:', response);
      const apiResponse = response as { data?: { alternatives?: RouteAlternative[]; selected?: string } };
      
      if (apiResponse.data?.alternatives) {
        setAlternatives(apiResponse.data.alternatives);
      } else {
        setAlternatives([]);
      }
    } catch (error) {
      console.error('[RouteSelectionPanel] Error loading alternatives:', error);
      setAlternatives([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRouteSelection = async (route: RouteAlternative) => {
    setIsSelecting(true);
    try {
      await selectRoute({
        data: {
          routeId: route.id,
          routeIndex: route.routeIndex
        },
        onSuccess: (response) => {
          console.log('[RouteSelectionPanel] Route selected successfully:', response);
          onRouteSelected(route.id, route.routeIndex, route);
        },
        onError: (error) => {
          console.error('[RouteSelectionPanel] Failed to select route:', error);
        }
      });
    } catch (error) {
      console.error('[RouteSelectionPanel] Route selection error:', error);
    } finally {
      setIsSelecting(false);
    }
  };

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
      return `${minutes} ${navT.time.minuteShort} ${remainingSeconds} ${navT.time.secondShort}`;
    } else {
      return `${remainingSeconds} ${navT.time.seconds}`;
    }
  };

  const getRouteTypeIcon = (type: string) => {
    switch (type) {
      case 'shortest':
        return '🎯';
      case 'fastest':
        return '⚡';
      case 'walkable':
        return '🚶';
      default:
        return '📍';
    }
  };

  const getRouteTypeColor = (type: string) => {
    switch (type) {
      case 'shortest':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'fastest':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'walkable':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };
  
  const getRouteTypeName = (type: string): string => {
    switch (type) {
      case 'shortest':
        return navT.routeSelection.routeTypes.shortest;
      case 'fastest':
        return navT.routeSelection.routeTypes.fastest;
      case 'walking':
        return navT.routeSelection.routeTypes.walking;
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {navT.routeSelection.loadingAlternatives}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Route className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className={`text-xl font-semibold ${dir.textAlign}`}>
                {navT.routeSelection.title}
              </h2>
              <p className={`text-sm text-gray-600 ${dir.textAlign}`}>
                {navT.routeSelection.description}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            {navT.actions.close}
          </Button>
        </div>

        {/* Route Alternatives */}
        {alternatives.length > 0 ? (
          <div className="space-y-3">
            {alternatives.map((route, index) => (
              <Card 
                key={route.id}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  selectedRouteId === route.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md hover:bg-gray-50'
                }`}
                onClick={() => handleRouteSelection(route)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getRouteTypeIcon(route.characteristics.type)}</span>
                      <div>
                        <h3 className={`font-semibold ${dir.textAlign}`}>
                          {route.characteristics.name}
                        </h3>
                        <p className={`text-sm text-gray-600 ${dir.textAlign}`}>
                          {route.characteristics.description}
                        </p>
                      </div>
                      <Badge className={getRouteTypeColor(route.characteristics.type)}>
                        {getRouteTypeName(route.characteristics.type)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          {navT.routeSelection.distance}
                        </span>
                        <span className="font-semibold">{formatDistance(route.distance)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          {navT.routeSelection.time}
                        </span>
                        <span className="font-semibold">{formatTime(route.duration)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedRouteId === route.id && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <Check className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          {navT.routeSelection.selected}
                        </span>
                      </div>
                    )}
                    
                    <Button
                      size="sm"
                      disabled={isSelecting || selectedRouteId === route.id}
                      className={selectedRouteId === route.id ? 'bg-blue-600' : ''}
                    >
                      {isSelecting 
                        ? navT.routeSelection.selecting
                        : selectedRouteId === route.id
                        ? navT.routeSelection.selected
                        : navT.routeSelection.select
                      }
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Route className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">
              {navT.routeSelection.noAlternativesMessage}
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-3"
              onClick={loadRouteAlternatives}
            >
              {navT.routeSelection.reload}
            </Button>
          </div>
        )}

        {/* Instructions */}
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <h3 className={`font-semibold text-yellow-800 mb-2 ${dir.textAlign}`}>
            {navT.routeSelection.instructions}
          </h3>
          <ul className={`text-sm text-yellow-700 space-y-1 ${dir.textAlign}`}>
            {navT.routeSelection.instructionSteps.map((instruction, index) => (
              <li key={index}>• {instruction}</li>
            ))}
          </ul>
        </Card>
      </div>
    </Card>
  );
}