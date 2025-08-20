import { useState, useEffect, useRef } from 'react';

interface LiveProfileData {
  id: string;
  status: string;
  displayName: string;
  geopoint?: {
    latitude: number;
    longitude: number;
  };
  lastSeenRefId?: string;
  updatedAt?: string;
}

export const useLiveProfile = (profileId: string | null) => {
  const [profileData, setProfileData] = useState<LiveProfileData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!profileId) {
      setProfileData(null);
      setIsConnected(false);
      return;
    }

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3010/api';
    const eventSource = new EventSource(`${baseUrl}/gfl/profiles/${profileId}/live`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('SSE connection opened for profile:', profileId);
      setIsConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received profile update:', data);
        console.log('Profile data structure:', JSON.stringify(data, null, 2));
        
        if (data.type === 'not_found') {
          setError('Profile not found');
          setProfileData(null);
        } else if (data.type === 'resolved') {
          setProfileData(data.data);
          // Auto-close connection when resolved
          eventSource.close();
          setIsConnected(false);
        } else {
          const profileData = data.data || data;
          
          // Validate geopoint structure
          if (profileData.geopoint) {
            console.log('Geopoint data:', profileData.geopoint);
            console.log('Latitude type:', typeof profileData.geopoint.latitude);
            console.log('Longitude type:', typeof profileData.geopoint.longitude);
          }
          
          setProfileData(profileData);
        }
      } catch (err) {
        console.error('Error parsing SSE data:', err, 'Raw event data:', event.data);
        setError('Error parsing live data');
      }
    };

    eventSource.onerror = (event) => {
      console.error('SSE profile connection error:', event);
      console.error('EventSource readyState:', eventSource.readyState);
      console.error('EventSource URL:', eventSource.url);
      setIsConnected(false);
      
      let errorMessage = 'Connection error. Retrying...';
      
      // More specific error handling based on readyState
      switch (eventSource.readyState) {
        case EventSource.CONNECTING:
          errorMessage = 'Connecting to profile stream...';
          break;
        case EventSource.CLOSED:
          errorMessage = 'Profile stream connection closed. Retrying...';
          break;
        default:
          errorMessage = 'Profile stream connection error. Retrying...';
      }
      
      setError(errorMessage);
      
      // Auto-retry connection after a delay
      setTimeout(() => {
        if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
          console.log('Attempting to reconnect SSE profile...');
          setError(null);
        }
      }, 5000);
    };

    return () => {
      console.log('Closing SSE connection for profile:', profileId);
      eventSource.close();
      setIsConnected(false);
    };
  }, [profileId]);

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
      setProfileData(null);
    }
  };

  return { 
    profileData, 
    isConnected, 
    error,
    disconnect 
  };
};