import { useEffect, useRef, useState } from 'react';
import { useApiData } from './useApi';

export const useLocationTracking = (
  profileId: string | null, 
  enabled: boolean = false,
  intervalMs: number = 30000 // 30 seconds default
) => {
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const { post } = useApiData(`/gfl/profiles/${profileId}/location`);

  const updateLocation = async (latitude: number, longitude: number) => {
    if (!profileId) return;

    try {
      await post({
        data: {
          lat: latitude,
          lng: longitude
        },
        onSuccess: () => {
          setLastUpdate(new Date());
          setTrackingError(null);
        },
        onError: (error) => {
          console.error('Location update failed:', error);
          setTrackingError('Failed to update location');
        }
      });
    } catch (error) {
      console.error('Location update error:', error);
      setTrackingError('Location update error');
    }
  };

  useEffect(() => {
    if (!profileId || !enabled) {
      setIsTracking(false);
      setTrackingError(null);
      
      // Clear existing watch
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      
      // Clear existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      return;
    }

    setIsTracking(true);
    setTrackingError(null);

    // Get current position immediately
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateLocation(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Initial geolocation error:', error);
        setTrackingError('Unable to get current location');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );

    // Set up continuous tracking
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        // Only update immediately if it's been more than the interval
        const now = Date.now();
        const lastUpdateTime = lastUpdate?.getTime() || 0;
        
        if (now - lastUpdateTime >= intervalMs) {
          updateLocation(position.coords.latitude, position.coords.longitude);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMsg = 'Location tracking error';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMsg = 'Location request timeout';
            break;
        }
        
        setTrackingError(errorMsg);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 60000 
      }
    );

    // Set up interval for regular updates (as backup to watchPosition)
    intervalRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Interval geolocation error:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }, intervalMs);

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      setIsTracking(false);
    };
  }, [profileId, enabled, intervalMs, post, lastUpdate]);

  const stopTracking = () => {
    setIsTracking(false);
    setTrackingError(null);
    
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return {
    isTracking,
    lastUpdate,
    trackingError,
    stopTracking
  };
};