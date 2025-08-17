"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguageStore } from "@/store/language/languageStore";
import { getDirectionalClasses } from "@/lib/rtl-utils";
import { useApiData } from "@/hooks/useApi";
import { useLiveSession } from "@/hooks/useLiveSession";
import { useLiveProfile } from "@/hooks/useLiveProfile";
import { MapPin, Navigation, Users, Route, Clock, AlertCircle } from "lucide-react";
import { NavigationDebugPanel } from "@/components/debug/NavigationDebugPanel";
import { RouteSelectionPanel } from "./RouteSelectionPanel";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface RouteInfo {
  layerId: string;
  borderLayerId: string;
}

interface RealTimeNavigationMapProps {
  sessionId: string;
  userType: 'searcher' | 'lost';
  profileId?: string;
  onClose: () => void;
}

interface NavigationRoute {
  distance: number;
  estimatedTime: {
    minutes: number;
    seconds: number;
  };
  directions: (string | { instruction: string; distance: number })[];
  waypoints: Array<{ lat: number; lng: number }>;
}

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
  // Support for nested route structure from API
  route?: {
    distance: number;
    duration: number;
    geometry: {
      coordinates: [number, number][];
    };
  };
}

// Mapbox configuration
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

// Samarra center coordinates
const SAMARRA_CENTER: [number, number] = [43.88504, 34.19625]; // [lng, lat]

// Samarra bounds (4km x 4km)
const SAMARRA_BOUNDS: [[number, number], [number, number]] = [
  [43.86334, 34.17822], // SW
  [43.90674, 34.21428], // NE
];

export function RealTimeNavigationMap({ 
  sessionId, 
  userType,
  profileId,
  onClose 
}: RealTimeNavigationMapProps) {
  const { currentLanguage } = useLanguageStore();
  const dir = getDirectionalClasses(currentLanguage);
  
  // Real-time data hooks
  const { sessionData, isConnected: sessionConnected } = useLiveSession(sessionId);
  const { profileData, isConnected: profileConnected } = useLiveProfile(profileId || null);
  
  // Monitor session status for lost persons - automatically close when session ends
  useEffect(() => {
    if (userType === 'lost' && sessionData?.session?.status === 'ended') {
      console.log('[RealTimeNavigationMap] Session ended detected for lost person - closing navigation');
      // For lost persons, automatically close when session ends (return to waiting state)
      onClose();
    }
  }, [sessionData?.session?.status, userType, onClose]);
  
  // Additional backup: Monitor SSE connection status for lost persons
  useEffect(() => {
    if (userType === 'lost' && sessionConnected === false && sessionId) {
      // If SSE connection is lost, it might indicate session ended
      console.log('[RealTimeNavigationMap] SSE connection lost for lost person - potential session end');
      
      // Give a short delay then check if we should close
      const timeout = setTimeout(() => {
        if (!sessionConnected && userType === 'lost') {
          console.log('[RealTimeNavigationMap] Backup session end detection - closing navigation');
          onClose();
        }
      }, 5000); // 5 second delay to avoid false positives
      
      return () => clearTimeout(timeout);
    }
  }, [sessionConnected, userType, sessionId, onClose]);
  
  // Periodic session validation for lost persons (additional safety net)
  useEffect(() => {
    if (userType !== 'lost' || !sessionId) return;
    
    const validateSession = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3010/api';
        const response = await fetch(`${baseUrl}/sessions/${sessionId}/status`);
        
        if (response.ok) {
          const sessionData = await response.json();
          console.log('[RealTimeNavigationMap] Session validation check:', sessionData);
          
          if (!sessionData.exists || sessionData.status === 'ended') {
            console.log('[RealTimeNavigationMap] Session validation: session ended - closing navigation');
            onClose();
          }
        }
      } catch (error) {
        console.log('[RealTimeNavigationMap] Session validation error:', error);
      }
    };
    
    // Check session status every 10 seconds as a backup
    const interval = setInterval(validateSession, 10000);
    
    return () => clearInterval(interval);
  }, [userType, sessionId, onClose]);
  
  // Local state
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [navigationRoute, setNavigationRoute] = useState<NavigationRoute | null>(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [locationError, setLocationError] = useState<string>("");
  const [lastRouteCalculation, setLastRouteCalculation] = useState<number>(0);
  
  // Route selection state
  const [routeAlternatives, setRouteAlternatives] = useState<RouteAlternative[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [showRouteSelection, setShowRouteSelection] = useState(false);
  const [allRouteLines, setAllRouteLines] = useState<{[key: string]: RouteInfo}>({});
  
  // Refs for location tracking and map
  const watchIdRef = useRef<number | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const searcherMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const lostPersonMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const routeLayerRef = useRef<boolean>(false);
  
  // API hooks
  const { post: updateSearcherLocation } = useApiData(`/sessions/${sessionId}/searcher/location`);
  const { post: updateProfileLocation } = useApiData(profileId ? `/gfl/profiles/${profileId}/location` : '/gfl/profiles/dummy/location');
  const { post: calculateRouteAlternatives } = useApiData('/navigation/route-alternatives');
  const { get: getSessionRoute } = useApiData(`/navigation/sessions/${sessionId}/route`);
  const { get: getRouteAlternatives } = useApiData(`/navigation/sessions/${sessionId}/route-alternatives`);
  const { post: selectRoute } = useApiData(`/navigation/sessions/${sessionId}/select-route`);
  
  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;
    if (typeof window === "undefined") return;

    console.log(`[RealTimeNavigationMap:${userType}] Initializing map...`, {
      sessionId,
      profileId,
      mapboxToken: !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    });

    // Create map
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/streets-v12", // Life360-style street map
      center: SAMARRA_CENTER,
      zoom: 15,
      bounds: SAMARRA_BOUNDS,
      fitBoundsOptions: { padding: 50 },
      attributionControl: false,
      renderWorldCopies: false,
    });

    mapInstanceRef.current = map;

    map.on('load', () => {
      console.log('[RealTimeNavigationMap] Map loaded successfully');
      
      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Initialize markers and route layer
      updateMapMarkers();
    });

    return () => {
      console.log('[RealTimeNavigationMap] Cleaning up map...');
      clearMapMarkers();
      clearRouteVisualization();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);
  
  // Start location tracking
  useEffect(() => {
    if ('geolocation' in navigator) {
      console.log(`[RealTimeNavigationMap] Starting location tracking for user type: ${userType}`);
      
      // Check permission status first
      if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
          console.log(`[RealTimeNavigationMap] Geolocation permission status: ${permissionStatus.state}`);
          
          if (permissionStatus.state === 'denied') {
            setLocationError(
              currentLanguage === 'ar'
                ? 'تم رفض إذن الموقع. يرجى تفعيل إذن الموقع من إعدادات المتصفح.'
                : 'Location permission denied. Please enable location permission in browser settings.'
            );
            return;
          }
          
          // Handle permission state changes
          permissionStatus.onchange = () => {
            console.log(`[RealTimeNavigationMap] Permission state changed to: ${permissionStatus.state}`);
            if (permissionStatus.state === 'granted') {
              // Retry location acquisition after permission granted
              setLocationError("");
              startLocationTracking();
            } else if (permissionStatus.state === 'denied') {
              setLocationError(
                currentLanguage === 'ar'
                  ? 'تم رفض إذن الموقع. يرجى تفعيل إذن الموقع من إعدادات المتصفح.'
                  : 'Location permission denied. Please enable location permission in browser settings.'
              );
            }
          };
        });
      }
      
      const startLocationTracking = () => {
        // Clear any existing watch
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
        
        watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          console.log(`[RealTimeNavigationMap] Location updated:`, {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp).toISOString()
          });
          
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(coords);
          setLocationError("");
          
          // Update backend location based on user type
          updateLocationToBackend(coords);
        },
        (error) => {
          console.error('Location tracking error:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          
          let errorMessage = '';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = currentLanguage === 'ar'
                ? 'تم رفض إذن الموقع. يرجى تفعيل إذن الموقع وإعادة المحاولة.'
                : 'Location permission denied. Please enable location access and try again.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = currentLanguage === 'ar'
                ? 'الموقع غير متاح. تأكد من تفعيل GPS والاتصال بالإنترنت.'
                : 'Location unavailable. Please ensure GPS is enabled and you have internet connection.';
              break;
            case error.TIMEOUT:
              errorMessage = currentLanguage === 'ar'
                ? 'انتهت مهلة تحديد الموقع. يرجى المحاولة مرة أخرى.'
                : 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage = currentLanguage === 'ar'
                ? 'فشل في تتبع الموقع. يرجى التأكد من تفعيل خدمة الموقع.'
                : 'Failed to track location. Please ensure location service is enabled.';
          }
          
          setLocationError(errorMessage);
        },
        {
          enableHighAccuracy: true, // Force GPS for navigation accuracy
          timeout: 45000, // 45 seconds timeout for GPS
          maximumAge: 30000 // 30 seconds cache for real-time navigation
        }
      );
      };
      
      // Start tracking immediately if permission is already granted
      startLocationTracking();
    } else {
      console.error('[RealTimeNavigationMap] Geolocation is not supported by this browser');
      setLocationError(
        currentLanguage === 'ar'
          ? 'متصفحك لا يدعم خدمة تحديد الموقع.'
          : 'Your browser does not support geolocation.'
      );
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [sessionId, profileId, userType]);

  // Calculate route when locations change
  useEffect(() => {
    try {
      const now = Date.now();
      if (now - lastRouteCalculation < 5000) return; // Throttle to every 5 seconds

      console.log(`[RealTimeNavigationMap:${userType}] Checking if route calculation should trigger:`, {
        hasSearcherGeopoint: !!sessionData?.session?.searcher?.geopoint,
        hasLostPersonGeopoint: !!sessionData?.lostPerson?.geopoint,
        searcherGeopoint: sessionData?.session?.searcher?.geopoint,
        lostPersonGeopoint: sessionData?.lostPerson?.geopoint,
        sessionDataStructure: sessionData
      });

      if (sessionData?.session?.searcher?.geopoint && sessionData?.lostPerson?.geopoint) {
        calculateNavigationRoute();
        setLastRouteCalculation(now);
      }
    } catch (error) {
      console.error('[RealTimeNavigationMap] Error in route calculation effect:', error);
    }
  }, [sessionData?.session?.searcher?.geopoint, sessionData?.lostPerson?.geopoint]);

  // Update map markers and route when locations change
  useEffect(() => {
    try {
      updateMapMarkers();
      updateRouteVisualization();
    } catch (error) {
      console.error('[RealTimeNavigationMap] Error in location update effect:', error);
    }
  }, [sessionData?.session?.searcher?.geopoint, sessionData?.lostPerson?.geopoint, currentLocation, navigationRoute]);

  // Map marker management functions
  const clearMapMarkers = () => {
    if (searcherMarkerRef.current) {
      searcherMarkerRef.current.remove();
      searcherMarkerRef.current = null;
    }
    if (lostPersonMarkerRef.current) {
      lostPersonMarkerRef.current.remove();
      lostPersonMarkerRef.current = null;
    }
  };

  // Function to render multiple route alternatives on map
  const renderRouteAlternatives = (alternatives: RouteAlternative[]) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing route layers first
    clearRouteVisualization();

    const colors = ['#007cbf', '#28a745', '#fd7e14']; // Blue, Green, Orange
    
    alternatives.forEach((alt, index) => {
      const color = colors[index] || '#007cbf';
      const layerId = `route-${alt.id}`;
      const borderLayerId = `route-border-${alt.id}`;
      
      // Add route source - validate coordinates first (geometry is nested in route property)
      // Handle both flat structure (alt.geometry) and nested structure (alt.route.geometry)
      const routeGeometry = alt.route?.geometry || alt.geometry;
      console.log('[RealTimeNavigationMap] 🔍 Geometry validation for route alternative:', {
        altId: alt.id,
        hasRouteProperty: !!alt.route,
        hasDirectGeometry: !!alt.geometry,
        routeGeometry: routeGeometry,
        geometryKeys: routeGeometry ? Object.keys(routeGeometry) : [],
        coordinates: routeGeometry?.coordinates,
        coordinatesType: typeof routeGeometry?.coordinates,
        coordinatesIsArray: Array.isArray(routeGeometry?.coordinates),
        coordinatesLength: routeGeometry?.coordinates?.length
      });
      
      // More flexible validation - try different possible structures
      let coordinates = null;
      
      if (routeGeometry?.coordinates && Array.isArray(routeGeometry.coordinates)) {
        coordinates = routeGeometry.coordinates;
      } else if (routeGeometry && 'geometry' in routeGeometry) {
        const nestedGeometry = (routeGeometry as {geometry: {coordinates?: [number, number][]}}).geometry;
        if (nestedGeometry?.coordinates && Array.isArray(nestedGeometry.coordinates)) {
          coordinates = nestedGeometry.coordinates;
        }
      } else if (typeof routeGeometry?.coordinates === 'string') {
        // Handle encoded polyline strings
        try {
          coordinates = JSON.parse(routeGeometry.coordinates);
        } catch (e) {
          console.warn('[RealTimeNavigationMap] Failed to parse coordinates string:', e);
        }
      }
      
      if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
        console.error('[RealTimeNavigationMap] Invalid route alternative geometry:', {
          alt,
          routeGeometry,
          extractedCoordinates: coordinates,
          coordinatesType: typeof routeGeometry?.coordinates
        });
        return;
      }
      
      // Coordinates successfully extracted and validated
      
      if (!map.getSource(layerId)) {
        map.addSource(layerId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coordinates
            }
          }
        });
      }

      // Add route border layer
      if (!map.getLayer(borderLayerId)) {
        map.addLayer({
          id: borderLayerId,
          type: 'line',
          source: layerId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#ffffff',
            'line-width': 8,
            'line-opacity': selectedRouteId === alt.id ? 1 : 0.5
          }
        });
      }

      // Add route main layer
      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: 'line',
          source: layerId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': color,
            'line-width': 4,
            'line-opacity': selectedRouteId === alt.id ? 1 : 0.7
          }
        });

        // Add click handler for route selection
        map.on('click', layerId, () => {
          handleRouteSelection(alt.id, alt.routeIndex, alt);
        });

        map.on('mouseenter', layerId, () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', layerId, () => {
          map.getCanvas().style.cursor = '';
        });
      }

      // Store route line reference
      setAllRouteLines(prev => ({
        ...prev,
        [alt.id]: { layerId, borderLayerId, color }
      }));
    });
  };

  const handleRouteSelection = async (routeId: string, routeIndex: number, route: RouteAlternative) => {
    console.log('[RealTimeNavigationMap] Selecting route:', routeId);
    
    try {
      await selectRoute({
        data: { routeId, routeIndex },
        onSuccess: () => {
          setSelectedRouteId(routeId);
          
          // Update route visualization to highlight selected route
          updateSelectedRouteVisualization(routeId);
          
          // Convert to NavigationRoute format for existing logic
          // Add validation for geometry and coordinates (check both route.route.geometry and route.geometry)
          const routeGeometry = route.route?.geometry || route.geometry;
          const routeDistance = route.route?.distance || route.distance;
          const routeDuration = route.route?.duration || route.duration;
          
          if (!routeGeometry || !routeGeometry.coordinates || !Array.isArray(routeGeometry.coordinates)) {
            console.error('[RealTimeNavigationMap] Invalid route geometry:', route);
            return;
          }

          const navRoute: NavigationRoute = {
            distance: routeDistance,
            estimatedTime: {
              minutes: Math.floor(routeDuration / 60),
              seconds: routeDuration % 60
            },
            directions: [`البدء من موقعك الحالي نحو ${route.characteristics.description}`],
            waypoints: routeGeometry.coordinates.map(coord => ({ lat: coord[1], lng: coord[0] }))
          };
          
          setNavigationRoute(navRoute);
          setShowRouteSelection(false);
        }
      });
    } catch (error) {
      console.error('[RealTimeNavigationMap] Failed to select route:', error);
    }
  };

  const updateSelectedRouteVisualization = (selectedRouteId: string) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Update opacity of all route layers
    Object.entries(allRouteLines).forEach(([routeId, routeInfo]) => {
      const isSelected = routeId === selectedRouteId;
      
      if (map.getLayer(routeInfo.layerId)) {
        map.setPaintProperty(routeInfo.layerId, 'line-opacity', isSelected ? 1 : 0.5);
        map.setPaintProperty(routeInfo.layerId, 'line-width', isSelected ? 6 : 4);
      }
      
      if (map.getLayer(routeInfo.borderLayerId)) {
        map.setPaintProperty(routeInfo.borderLayerId, 'line-opacity', isSelected ? 1 : 0.3);
        map.setPaintProperty(routeInfo.borderLayerId, 'line-width', isSelected ? 10 : 8);
      }
    });
  };

  const clearRouteVisualization = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove all route layers and sources
    Object.values(allRouteLines).forEach((routeInfo) => {
      if (map.getLayer(routeInfo.layerId)) {
        map.removeLayer(routeInfo.layerId);
      }
      if (map.getLayer(routeInfo.borderLayerId)) {
        map.removeLayer(routeInfo.borderLayerId);
      }
      if (map.getSource(routeInfo.layerId)) {
        map.removeSource(routeInfo.layerId);
      }
    });

    // Clear legacy route layers if they exist
    if (map.getLayer('route')) {
      map.removeLayer('route');
    }
    if (map.getLayer('route-border')) {
      map.removeLayer('route-border');
    }
    if (map.getSource('route')) {
      map.removeSource('route');
    }

    setAllRouteLines({});
  };

  const updateMapMarkers = () => {
    try {
      const map = mapInstanceRef.current;
      if (!map) {
        console.log('[RealTimeNavigationMap] Map not initialized, skipping marker update');
        return;
      }

      console.log('[RealTimeNavigationMap] Updating map markers...');

      // Get locations from different sources
      const searcherLocation = sessionData?.session?.searcher?.geopoint;
      const lostPersonLocation = sessionData?.lostPerson?.geopoint || profileData?.geopoint;

    // Update searcher marker (blue for searcher)
    if (searcherLocation) {
      const searcherGeo = searcherLocation as { latitude?: number; longitude?: number; _latitude?: number; _longitude?: number };
      const lat = searcherGeo._latitude || searcherGeo.latitude;
      const lng = searcherGeo._longitude || searcherGeo.longitude;

      if (lat && lng) {
        console.log('[RealTimeNavigationMap] Adding searcher marker at:', { lat, lng });
        
        if (searcherMarkerRef.current) {
          searcherMarkerRef.current.setLngLat([lng, lat]);
        } else {
          // Create searcher marker element
          const searcherEl = document.createElement('div');
          searcherEl.className = 'searcher-marker';
          searcherEl.style.cssText = `
            width: 30px;
            height: 30px;
            border: 3px solid #3b82f6;
            border-radius: 50%;
            background: #1d4ed8;
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            animation: pulse 2s infinite;
          `;
          
          // Add pulse animation for real-time effect
          if (!document.getElementById('marker-animations')) {
            const style = document.createElement('style');
            style.id = 'marker-animations';
            style.textContent = `
              @keyframes pulse {
                0% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.7), 0 0 0 0 rgba(59, 130, 246, 0.7); }
                70% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.7), 0 0 0 10px rgba(59, 130, 246, 0); }
                100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.7), 0 0 0 0 rgba(59, 130, 246, 0); }
              }
              @keyframes pulse-red {
                0% { box-shadow: 0 0 15px rgba(239, 68, 68, 0.7), 0 0 0 0 rgba(239, 68, 68, 0.7); }
                70% { box-shadow: 0 0 15px rgba(239, 68, 68, 0.7), 0 0 0 10px rgba(239, 68, 68, 0); }
                100% { box-shadow: 0 0 15px rgba(239, 68, 68, 0.7), 0 0 0 0 rgba(239, 68, 68, 0); }
              }
            `;
            document.head.appendChild(style);
          }
          searcherEl.textContent = 'S';

          searcherMarkerRef.current = new mapboxgl.Marker({ element: searcherEl })
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup().setHTML(`
              <div style="text-align: center;">
                <strong>${currentLanguage === 'ar' ? 'الباحث' : 'Searcher'}</strong><br>
                <small>${lat.toFixed(6)}, ${lng.toFixed(6)}</small>
              </div>
            `))
            .addTo(map);
        }
      }
    }

    // Update lost person marker (red for lost person)
    if (lostPersonLocation) {
      const lostGeo = lostPersonLocation as { latitude?: number; longitude?: number; _latitude?: number; _longitude?: number };
      const lat = lostGeo._latitude || lostGeo.latitude;
      const lng = lostGeo._longitude || lostGeo.longitude;

      if (lat && lng) {
        console.log('[RealTimeNavigationMap] Adding lost person marker at:', { lat, lng });
        
        if (lostPersonMarkerRef.current) {
          lostPersonMarkerRef.current.setLngLat([lng, lat]);
        } else {
          // Create lost person marker element
          const lostEl = document.createElement('div');
          lostEl.className = 'lost-person-marker';
          lostEl.style.cssText = `
            width: 30px;
            height: 30px;
            border: 3px solid #ef4444;
            border-radius: 50%;
            background: #dc2626;
            box-shadow: 0 0 15px rgba(239, 68, 68, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            animation: pulse-red 2s infinite;
          `;
          lostEl.textContent = 'L';

          lostPersonMarkerRef.current = new mapboxgl.Marker({ element: lostEl })
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup().setHTML(`
              <div style="text-align: center;">
                <strong>${currentLanguage === 'ar' ? 'الشخص المفقود' : 'Lost Person'}</strong><br>
                <small>${lat.toFixed(6)}, ${lng.toFixed(6)}</small>
              </div>
            `))
            .addTo(map);
        }
      }
    }

    // Fit map bounds to show both markers if both exist
    if (searcherLocation && lostPersonLocation) {
      const searcherGeo = searcherLocation as { latitude?: number; longitude?: number; _latitude?: number; _longitude?: number };
      const lostGeo = lostPersonLocation as { latitude?: number; longitude?: number; _latitude?: number; _longitude?: number };
      
      const searcherLat = searcherGeo._latitude || searcherGeo.latitude;
      const searcherLng = searcherGeo._longitude || searcherGeo.longitude;
      const lostLat = lostGeo._latitude || lostGeo.latitude;
      const lostLng = lostGeo._longitude || lostGeo.longitude;

      if (searcherLat && searcherLng && lostLat && lostLng) {
        const bounds = new mapboxgl.LngLatBounds()
          .extend([searcherLng, searcherLat])
          .extend([lostLng, lostLat]);
        
        map.fitBounds(bounds, { padding: 100, maxZoom: 17 });
      }
    }
    } catch (error) {
      console.error('[RealTimeNavigationMap] Error in updateMapMarkers:', error);
      // Don't crash the app, just log the error
    }
  };

  // Route visualization function
  const updateRouteVisualization = () => {
    try {
      const map = mapInstanceRef.current;
      if (!map || !navigationRoute || !navigationRoute.waypoints || navigationRoute.waypoints.length < 2) {
        console.log('[RealTimeNavigationMap] Skipping route visualization - insufficient data');
        return;
      }

      console.log('[RealTimeNavigationMap] Updating route visualization with waypoints:', navigationRoute.waypoints);

      // Validate waypoints before processing
      const validWaypoints = navigationRoute.waypoints.filter(point => 
        point && 
        typeof point.lat === 'number' && 
        typeof point.lng === 'number' && 
        !isNaN(point.lat) && 
        !isNaN(point.lng)
      );

      if (validWaypoints.length < 2) {
        console.warn('[RealTimeNavigationMap] Not enough valid waypoints for route visualization');
        return;
      }

      // Remove existing route layers safely
      try {
        if (map.getLayer('route')) {
          map.removeLayer('route');
        }
      } catch (e) {
        console.warn('[RealTimeNavigationMap] Error removing route layer:', e);
      }
      
      try {
        if (map.getLayer('route-border')) {
          map.removeLayer('route-border');
        }
      } catch (e) {
        console.warn('[RealTimeNavigationMap] Error removing route-border layer:', e);
      }
      
      try {
        if (map.getSource('route')) {
          map.removeSource('route');
        }
      } catch (e) {
        console.warn('[RealTimeNavigationMap] Error removing route source:', e);
      }

      // Create route line from waypoints
      const routeCoordinates = validWaypoints.map(point => [point.lng, point.lat]);
      
      console.log('[RealTimeNavigationMap] 🎨 Route visualization coordinates:', {
        validWaypointCount: validWaypoints.length,
        routeCoordinatesCount: routeCoordinates.length,
        firstCoordinate: routeCoordinates[0],
        lastCoordinate: routeCoordinates[routeCoordinates.length - 1],
        allCoordinates: routeCoordinates.length <= 10 ? routeCoordinates : 'Too many to display (showing first 5)',
        sampleCoordinates: routeCoordinates.slice(0, 5)
      });
      
      // Add route source
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates
          }
        }
      });

      // Add route border first (so it appears behind the main route)
      map.addLayer({
        id: 'route-border',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#1e40af', // Darker blue border
          'line-width': 8,
          'line-opacity': 0.6
        }
      });

      // Add main route layer on top
      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3b82f6', // Blue route line
          'line-width': 6,
          'line-opacity': 0.8
        }
      });

      console.log('[RealTimeNavigationMap] Route visualization added successfully');
    } catch (error) {
      console.error('[RealTimeNavigationMap] Error in updateRouteVisualization:', error);
      // Don't crash the app, just log the error
    }
  };

  const updateLocationToBackend = async (coords: {lat: number, lng: number}) => {
    try {
      console.log(`[RealTimeNavigationMap] Updating location to backend for ${userType}:`, coords);
      
      if (userType === 'searcher') {
        console.log(`[RealTimeNavigationMap] Updating searcher location for session: ${sessionId}`);
        // Update searcher location in session
        await updateSearcherLocation({
          data: coords,
          onSuccess: (response) => {
            console.log('[RealTimeNavigationMap] Searcher location updated successfully:', response);
          },
          onError: (error) => {
            console.error('[RealTimeNavigationMap] Failed to update searcher location:', error);
            console.error('[RealTimeNavigationMap] Error details:', error.response?.data || error.message);
          }
        });
      } else if (userType === 'lost' && profileId) {
        console.log(`[RealTimeNavigationMap] Updating profile location for profile: ${profileId}`);
        // Update lost person profile location
        await updateProfileLocation({
          data: coords,
          onSuccess: (response) => {
            console.log('[RealTimeNavigationMap] Profile location updated successfully:', response);
          },
          onError: (error) => {
            console.error('[RealTimeNavigationMap] Failed to update profile location:', error);
            console.error('[RealTimeNavigationMap] Error details:', error.response?.data || error.message);
          }
        });
      }
    } catch (error) {
      console.error('[RealTimeNavigationMap] Location update error:', error);
    }
  };

  const calculateNavigationRoute = async () => {
    if (!sessionData?.session?.searcher?.geopoint || !sessionData?.lostPerson?.geopoint) {
      console.log('[RealTimeNavigationMap] Cannot calculate route - missing location data:', {
        hasSearcherLocation: !!sessionData?.session?.searcher?.geopoint,
        hasLostPersonLocation: !!sessionData?.lostPerson?.geopoint
      });
      return;
    }

    console.log('[RealTimeNavigationMap] Calculating route alternatives between:', {
      searcher: `${sessionData.session.searcher.geopoint.latitude}, ${sessionData.session.searcher.geopoint.longitude}`,
      lostPerson: `${sessionData.lostPerson.geopoint.latitude}, ${sessionData.lostPerson.geopoint.longitude}`
    });

    setIsCalculatingRoute(true);

    try {
      // Handle Firebase GeoPoint structure (_latitude/_longitude vs latitude/longitude)
      const searcherGeo = sessionData.session.searcher.geopoint as { latitude?: number; longitude?: number; _latitude?: number; _longitude?: number };
      const lostGeo = sessionData.lostPerson.geopoint as { latitude?: number; longitude?: number; _latitude?: number; _longitude?: number };
      const searcherLat = searcherGeo._latitude || searcherGeo.latitude;
      const searcherLng = searcherGeo._longitude || searcherGeo.longitude;
      const lostLat = lostGeo._latitude || lostGeo.latitude;
      const lostLng = lostGeo._longitude || lostGeo.longitude;

      console.log('[RealTimeNavigationMap] Extracted coordinates:', {
        searcher: { lat: searcherLat, lng: searcherLng },
        lostPerson: { lat: lostLat, lng: lostLng }
      });

      // Validate coordinates
      if (!searcherLat || !searcherLng || !lostLat || !lostLng) {
        console.error('[RealTimeNavigationMap] Missing coordinates');
        return;
      }

      // Check if coordinates are identical (person found)
      const distance = Math.sqrt(
        Math.pow(searcherLat - lostLat, 2) + Math.pow(searcherLng - lostLng, 2)
      );
      
      if (distance < 0.0001) { // Very close coordinates (less than ~10 meters)
        console.log('[RealTimeNavigationMap] Searcher and lost person are at the same location!');
        setNavigationRoute({
          distance: 0,
          estimatedTime: { minutes: 0, seconds: 0 },
          directions: [currentLanguage === 'ar' ? 'لقد وصلت! الشخص المفقود في موقعك الحالي.' : 'You have arrived! The lost person is at your current location.'],
          waypoints: [{ lat: searcherLat, lng: searcherLng }]
        });
        return;
      }

      // First check if route alternatives already exist in session
      try {
        const alternativesResponse = await getRouteAlternatives();
        
        const apiResponse = alternativesResponse as { data?: { alternatives?: RouteAlternative[]; selected?: string } } | null;
        if (apiResponse?.data?.alternatives && apiResponse.data.alternatives.length > 0) {
          console.log('[RealTimeNavigationMap] Using existing route alternatives from session');
          const alternatives = apiResponse.data.alternatives;
          setRouteAlternatives(alternatives);
          setSelectedRouteId(apiResponse.data.selected || alternatives[0]?.id || null);
          
          // Render all alternatives on map
          renderRouteAlternatives(alternatives);
          
          // Show route selection if multiple alternatives and no selection yet
          if (alternatives.length > 1 && userType === 'searcher' && !apiResponse.data.selected) {
            setShowRouteSelection(true);
          } else if (apiResponse.data.selected) {
            // Use the already selected route
            const selectedRoute = alternatives.find(alt => alt.id === apiResponse.data?.selected);
            if (selectedRoute) {
              const routeGeometry = selectedRoute.route?.geometry || selectedRoute.geometry;
              const routeDistance = selectedRoute.route?.distance || selectedRoute.distance;
              const routeDuration = selectedRoute.route?.duration || selectedRoute.duration;
              
              if (routeGeometry && routeGeometry.coordinates && Array.isArray(routeGeometry.coordinates)) {
                const navRoute: NavigationRoute = {
                  distance: routeDistance,
                  estimatedTime: {
                    minutes: Math.floor(routeDuration / 60),
                    seconds: routeDuration % 60
                  },
                  directions: [`البدء من موقعك الحالي نحو ${selectedRoute.characteristics.description}`],
                  waypoints: routeGeometry.coordinates.map(coord => ({ lat: coord[1], lng: coord[0] }))
                };
                setNavigationRoute(navRoute);
              } else {
                console.error('[RealTimeNavigationMap] Invalid selected route geometry:', selectedRoute);
              }
            }
          }
          return;
        }
      } catch (error) {
        console.log('[RealTimeNavigationMap] No existing alternatives, will calculate new ones');
      }

      // Calculate new route alternatives using Mapbox
      await calculateRouteAlternatives({
        data: {
          fromLat: searcherLat,
          fromLng: searcherLng,
          toLat: lostLat,
          toLng: lostLng
        },
        onSuccess: (response) => {
          console.log('[RealTimeNavigationMap] Route alternatives calculated successfully:', response);
          const apiResponse = response as { data?: { alternatives?: RouteAlternative[] }; alternatives?: RouteAlternative[] };
          const alternatives = (apiResponse.data?.alternatives || apiResponse.alternatives || []);
          
          if (alternatives.length > 0) {
            setRouteAlternatives(alternatives);
            setSelectedRouteId(alternatives[0].id);
            
            // Render all alternatives on map
            renderRouteAlternatives(alternatives);
            
            // Show route selection panel for searcher if multiple alternatives
            if (alternatives.length > 1 && userType === 'searcher') {
              setShowRouteSelection(true);
            } else {
              // Auto-select first route if only one alternative or if lost person
              const firstRoute = alternatives[0];
              if (firstRoute) {
                const routeGeometry = firstRoute.route?.geometry || firstRoute.geometry;
                const routeDistance = firstRoute.route?.distance || firstRoute.distance;
                const routeDuration = firstRoute.route?.duration || firstRoute.duration;
                
                console.log('[RealTimeNavigationMap] 🔍 First route geometry validation:', {
                  routeId: firstRoute.id,
                  hasRouteProperty: !!firstRoute.route,
                  hasDirectGeometry: !!firstRoute.geometry,
                  routeGeometry: routeGeometry,
                  geometryKeys: routeGeometry ? Object.keys(routeGeometry) : [],
                  coordinates: routeGeometry?.coordinates,
                  coordinatesType: typeof routeGeometry?.coordinates,
                  coordinatesIsArray: Array.isArray(routeGeometry?.coordinates),
                  coordinatesLength: routeGeometry?.coordinates?.length,
                  distance: routeDistance,
                  duration: routeDuration
                });
                
                // Apply flexible coordinate extraction
                let navigationCoordinates = null;
                
                if (routeGeometry?.coordinates && Array.isArray(routeGeometry.coordinates)) {
                  navigationCoordinates = routeGeometry.coordinates;
                } else if (routeGeometry && 'geometry' in routeGeometry) {
                  const nestedGeometry = (routeGeometry as {geometry: {coordinates?: [number, number][]}}).geometry;
                  if (nestedGeometry?.coordinates && Array.isArray(nestedGeometry.coordinates)) {
                    navigationCoordinates = nestedGeometry.coordinates;
                  }
                } else if (typeof routeGeometry?.coordinates === 'string') {
                  try {
                    navigationCoordinates = JSON.parse(routeGeometry.coordinates);
                  } catch (e) {
                    console.warn('[RealTimeNavigationMap] Failed to parse navigation coordinates string:', e);
                  }
                }
                
                if (navigationCoordinates && Array.isArray(navigationCoordinates) && navigationCoordinates.length >= 2) {
                  console.log('[RealTimeNavigationMap] 🛣️ Route geometry analysis:', {
                    totalCoordinates: navigationCoordinates.length,
                    firstCoord: navigationCoordinates[0],
                    lastCoord: navigationCoordinates[navigationCoordinates.length - 1],
                    sampleCoords: navigationCoordinates.slice(0, 5), // First 5 coordinates
                    distance: routeDistance,
                    duration: routeDuration
                  });

                  const waypoints = navigationCoordinates.map(coord => ({ lat: coord[1], lng: coord[0] }));
                  const navRoute: NavigationRoute = {
                    distance: routeDistance,
                    estimatedTime: {
                      minutes: Math.floor(routeDuration / 60),
                      seconds: routeDuration % 60
                    },
                    directions: [`البدء من موقعك الحالي نحو ${firstRoute.characteristics.description}`],
                    waypoints: waypoints
                  };
                  
                  console.log('[RealTimeNavigationMap] 🗺️ Setting navigation route with waypoints:', {
                    waypointCount: waypoints.length,
                    firstWaypoint: waypoints[0],
                    lastWaypoint: waypoints[waypoints.length - 1]
                  });
                  
                  setNavigationRoute(navRoute);
                } else {
                  console.error('[RealTimeNavigationMap] Invalid first route geometry:', firstRoute);
                }
              }
            }
          } else {
            console.warn('[RealTimeNavigationMap] No route alternatives returned');
          }
        },
        onError: (error) => {
          console.error('[RealTimeNavigationMap] Failed to calculate route alternatives:', error);
          console.error('[RealTimeNavigationMap] Route error details:', error.response?.data || error.message);
        }
      });
    } catch (error) {
      console.error('[RealTimeNavigationMap] Route calculation error:', error);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  const formatDistance = (distance: number): string => {
    if (distance < 1000) {
      return `${Math.round(distance)} ${currentLanguage === 'ar' ? 'متر' : 'm'}`;
    } else {
      return `${(distance / 1000).toFixed(1)} ${currentLanguage === 'ar' ? 'كم' : 'km'}`;
    }
  };

  const formatTime = (time: { minutes: number; seconds: number }): string => {
    if (time.minutes > 0) {
      return `${time.minutes} ${currentLanguage === 'ar' ? 'دقيقة' : 'min'} ${time.seconds} ${currentLanguage === 'ar' ? 'ثانية' : 'sec'}`;
    } else {
      return `${time.seconds} ${currentLanguage === 'ar' ? 'ثانية' : 'seconds'}`;
    }
  };

  const searcherLocation = sessionData?.session?.searcher?.geopoint;
  const lostPersonLocation = sessionData?.lostPerson?.geopoint || profileData?.geopoint;
  const bothLocationsAvailable = searcherLocation && lostPersonLocation;

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Navigation className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className={`text-xl font-semibold ${dir.textAlign}`}>
                {currentLanguage === 'ar' ? 'التوجيه المباشر' : 'Real-Time Navigation'}
              </h2>
              <p className={`text-sm text-gray-600 ${dir.textAlign}`}>
                {userType === 'searcher' 
                  ? (currentLanguage === 'ar' ? 'توجيه للوصول للشخص المفقود' : 'Navigation to lost person')
                  : (currentLanguage === 'ar' ? 'مراقبة حية للباحث' : 'Live searcher tracking')
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={sessionConnected && profileConnected ? 'default' : 'destructive'} className="animate-pulse">
              {sessionConnected && profileConnected
                ? (currentLanguage === 'ar' ? 'متصل' : 'Connected')
                : (currentLanguage === 'ar' ? 'منقطع' : 'Disconnected')
              }
            </Badge>
            {/* Only show End Session button for searchers, not lost persons */}
            {userType === 'searcher' && (
              <Button variant="outline" size="sm" onClick={onClose} className="hover:bg-red-50 hover:border-red-300">
                {currentLanguage === 'ar' ? 'إنهاء الجلسة' : 'End Session'}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Connection Status */}
      {(!sessionConnected || !profileConnected) && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800">
              {currentLanguage === 'ar' 
                ? 'جاري إعادة الاتصال بالخدمة المباشرة...'
                : 'Reconnecting to live service...'
              }
            </span>
          </div>
        </Card>
      )}

      {/* Life360-Style Real-Time Map */}
      <Card className="p-2">
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-lg overflow-hidden border-2 border-blue-200"
          style={{ minHeight: '400px' }}
        />
        <div className="p-2 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-600 rounded-full border border-blue-800"></div>
                <span className="text-blue-800">{currentLanguage === 'ar' ? 'الباحث' : 'Searcher'}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-600 rounded-full border border-red-800"></div>
                <span className="text-red-800">{currentLanguage === 'ar' ? 'الشخص المفقود' : 'Lost Person'}</span>
              </div>
            </div>
            <div className="text-gray-600">
              {currentLanguage === 'ar' ? 'تحديث مباشر' : 'Live Updates'} • 
              {bothLocationsAvailable 
                ? (currentLanguage === 'ar' ? 'متصل' : 'Connected')
                : (currentLanguage === 'ar' ? 'في انتظار المواقع' : 'Waiting for locations')
              }
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Real-time Locations */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-green-600" />
            <h3 className={`font-semibold ${dir.textAlign}`}>
              {currentLanguage === 'ar' ? 'المواقع المباشرة' : 'Live Locations'}
            </h3>
          </div>

          <div className="space-y-3">
            {/* Searcher Location */}
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-blue-900">
                  {currentLanguage === 'ar' ? 'موقع الباحث:' : 'Searcher Location:'}
                </span>
              </div>
              {searcherLocation ? (
                <p className="text-sm text-blue-700 font-mono">
                  {(() => {
                    const searcherGeoLocation = searcherLocation as { latitude?: number; longitude?: number; _latitude?: number; _longitude?: number };
                    const lat = searcherGeoLocation._latitude || searcherGeoLocation.latitude;
                    const lng = searcherGeoLocation._longitude || searcherGeoLocation.longitude;
                    return (typeof lat === 'number' && typeof lng === 'number')
                      ? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
                      : 'Invalid coordinates';
                  })()}
                </p>
              ) : (
                <p className="text-sm text-blue-600">
                  {currentLanguage === 'ar' ? 'غير متاح' : 'Not available'}
                </p>
              )}
            </div>

            {/* Lost Person Location */}
            <div className="bg-red-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-red-900">
                  {currentLanguage === 'ar' ? 'موقع الشخص المفقود:' : 'Lost Person Location:'}
                </span>
              </div>
              {lostPersonLocation ? (
                <p className="text-sm text-red-700 font-mono">
                  {(() => {
                    const lostGeoLocation = lostPersonLocation as { latitude?: number; longitude?: number; _latitude?: number; _longitude?: number };
                    const lat = lostGeoLocation._latitude || lostGeoLocation.latitude;
                    const lng = lostGeoLocation._longitude || lostGeoLocation.longitude;
                    return (typeof lat === 'number' && typeof lng === 'number')
                      ? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
                      : 'Invalid coordinates';
                  })()}
                </p>
              ) : (
                <p className="text-sm text-red-600">
                  {currentLanguage === 'ar' ? 'غير متاح' : 'Not available'}
                </p>
              )}
            </div>

            {/* Your Current Location */}
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${currentLocation ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                <span className="font-medium text-green-900">
                  {currentLanguage === 'ar' ? 'موقعك الحالي:' : 'Your Current Location:'}
                </span>
              </div>
              {currentLocation ? (
                <p className="text-sm text-green-700 font-mono">
                  {typeof currentLocation.lat === 'number' && typeof currentLocation.lng === 'number'
                    ? `${currentLocation.lat.toFixed(5)}, ${currentLocation.lng.toFixed(5)}`
                    : 'Invalid coordinates'
                  }
                </p>
              ) : (
                <p className="text-sm text-green-600">
                  {currentLanguage === 'ar' ? 'جاري التحديد...' : 'Locating...'}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Navigation Information */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Route className="w-5 h-5 text-purple-600" />
            <h3 className={`font-semibold ${dir.textAlign}`}>
              {currentLanguage === 'ar' ? 'معلومات التوجيه' : 'Navigation Info'}
            </h3>
            {isCalculatingRoute && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
            )}
          </div>

          {bothLocationsAvailable ? (
            <div className="space-y-3">
              {navigationRoute ? (
                <>
                  {/* Special display for when person is found */}
                  {navigationRoute.distance === 0 ? (
                    <div className="bg-green-50 rounded-lg p-4 text-center border-2 border-green-200">
                      <div className="text-green-600 text-2xl mb-2">🎉</div>
                      <h4 className="font-bold text-green-900 mb-2">
                        {currentLanguage === 'ar' ? 'تم العثور على الشخص المفقود!' : 'Lost Person Found!'}
                      </h4>
                      <p className="text-green-700">
                        {currentLanguage === 'ar' 
                          ? 'أنت والشخص المفقود في نفس الموقع'
                          : 'You and the lost person are at the same location'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-purple-900">
                          {currentLanguage === 'ar' ? 'المسافة:' : 'Distance:'}
                        </span>
                        <span className="text-purple-700 font-mono">
                          {formatDistance(navigationRoute.distance)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-purple-900">
                          {currentLanguage === 'ar' ? 'الوقت المتوقع:' : 'Estimated Time:'}
                        </span>
                        <span className="text-purple-700 font-mono">
                          {formatTime(navigationRoute.estimatedTime)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Directions */}
                  {navigationRoute.directions && navigationRoute.directions.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                      <h4 className={`font-medium mb-2 ${dir.textAlign}`}>
                        {currentLanguage === 'ar' ? 'التوجيهات:' : 'Directions:'}
                      </h4>
                      <ol className={`text-sm space-y-1 ${dir.textAlign}`}>
                        {navigationRoute.directions.map((direction, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-xs bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">
                              {typeof direction === 'string' 
                                ? direction 
                                : (direction as { instruction?: string; distance?: number }).instruction || 'Unknown direction'
                              }
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">
                    {currentLanguage === 'ar' ? 'جاري حساب المسار...' : 'Calculating route...'}
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2"
                    onClick={calculateNavigationRoute}
                    disabled={isCalculatingRoute}
                  >
                    {currentLanguage === 'ar' ? 'إعادة حساب' : 'Recalculate'}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">
                {currentLanguage === 'ar' 
                  ? 'في انتظار مواقع كلا الطرفين...'
                  : 'Waiting for both locations...'
                }
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Status Updates */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-indigo-600" />
          <h3 className={`font-semibold ${dir.textAlign}`}>
            {currentLanguage === 'ar' ? 'آخر التحديثات' : 'Recent Updates'}
          </h3>
        </div>
        <div className="space-y-2 text-sm">
          {sessionData?.session?.updatedAt && (
            <p className={`text-gray-600 ${dir.textAlign}`}>
              {currentLanguage === 'ar' ? 'آخر تحديث للجلسة:' : 'Last session update:'} 
              <span className="ml-2 font-mono">
                {new Date(sessionData.session.updatedAt).toLocaleTimeString()}
              </span>
            </p>
          )}
          {profileData?.updatedAt && (
            <p className={`text-gray-600 ${dir.textAlign}`}>
              {currentLanguage === 'ar' ? 'آخر تحديث للموقع:' : 'Last location update:'} 
              <span className="ml-2 font-mono">
                {new Date(profileData.updatedAt).toLocaleTimeString()}
              </span>
            </p>
          )}
        </div>
      </Card>

      {/* Error Messages */}
      {locationError && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{locationError}</span>
          </div>
        </Card>
      )}

      {/* Route Selection Panel */}
      {showRouteSelection && routeAlternatives.length > 1 && userType === 'searcher' && (
        <RouteSelectionPanel
          sessionId={sessionId}
          onRouteSelected={(routeId: string, routeIndex: number, route: RouteAlternative) => {
            handleRouteSelection(routeId, routeIndex, route);
          }}
          selectedRouteId={selectedRouteId}
          className="mb-4"
        />
      )}

      {/* Debug Panel */}
      <NavigationDebugPanel
        sessionId={sessionId}
        profileId={profileId}
        sessionData={sessionData as unknown as Record<string, unknown> | undefined}
        profileData={profileData as unknown as Record<string, unknown> | undefined}
        sessionConnected={sessionConnected}
        profileConnected={profileConnected}
        sessionError={String((sessionData as unknown as { error?: unknown })?.error) || null}
        profileError={String((profileData as unknown as { error?: unknown })?.error) || null}
        currentLocation={currentLocation}
        locationError={locationError}
        navigationRoute={navigationRoute as unknown as Record<string, unknown> | undefined}
        onRefreshConnections={() => {
          // Force refresh connections
          window.location.reload();
        }}
      />
    </div>
  );
}