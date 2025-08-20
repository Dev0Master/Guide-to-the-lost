import { useState, useEffect, useRef } from 'react';

interface SessionData {
  sessionId: string;
  status: string;
  campaignId?: string;
  searcher?: {
    geopoint: {
      latitude: number;
      longitude: number;
    };
    geohash: string;
  };
  updatedAt?: string;
}

interface LostPersonUpdate {
  id: string;
  status: string;
  geopoint?: {
    latitude: number;
    longitude: number;
  };
  lastSeenRefId?: string;
  updatedAt?: string;
}

interface LiveSessionData {
  session?: SessionData;
  lostPerson?: LostPersonUpdate;
  type?: string;
}

export const useLiveSession = (sessionId: string | null) => {
  const [sessionData, setSessionData] = useState<LiveSessionData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setSessionData(null);
      setIsConnected(false);
      return;
    }

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3010/api';
    const eventSource = new EventSource(`${baseUrl}/sessions/${sessionId}/live`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('SSE session connection opened for session:', sessionId);
      setIsConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received session update:', data);
        
        // Handle different types of session events
        if (data.type === 'not_found') {
          setError('Session not found');
          setSessionData(null);
        } else if (data.type === 'ended') {
          console.log('Session ended');
          setSessionData(prev => prev ? { ...prev, session: { ...prev.session!, status: 'ended' } } : null);
          eventSource.close();
          setIsConnected(false);
        } else if (data.type === 'resolved') {
          console.log('Lost person found!');
          setSessionData(prev => prev ? { ...prev, lostPerson: data.data, type: 'resolved' } : null);
          eventSource.close();
          setIsConnected(false);
        } else if (data.type === 'session') {
          // Session data (searcher location, status, etc.)
          setSessionData(prev => ({
            ...prev,
            session: {
              sessionId: data.sessionId,
              status: data.status,
              campaignId: data.campaignId,
              searcher: data.searcher,
              updatedAt: data.updatedAt
            }
          }));
        } else if (data.type === 'lost_update') {
          // Lost person location update
          setSessionData(prev => ({
            ...prev,
            lostPerson: {
              id: data.id,
              status: data.status,
              geopoint: data.geopoint,
              lastSeenRefId: data.lastSeenRefId,
              updatedAt: data.updatedAt
            }
          }));
        } else {
          // Generic data update
          const updateData = data.data || data;
          setSessionData(prev => ({ ...prev, ...updateData }));
        }
      } catch (err) {
        console.error('Error parsing session SSE data:', err, 'Raw event data:', event.data);
        setError('Error parsing live session data');
      }
    };

    eventSource.onerror = (event) => {
      console.error('SSE session connection error:', event);
      console.error('EventSource readyState:', eventSource.readyState);
      console.error('EventSource URL:', eventSource.url);
      setIsConnected(false);
      
      let errorMessage = 'Connection error. Retrying...';
      
      // More specific error handling based on readyState
      switch (eventSource.readyState) {
        case EventSource.CONNECTING:
          errorMessage = 'Connecting to session stream...';
          break;
        case EventSource.CLOSED:
          errorMessage = 'Session stream connection closed. Retrying...';
          break;
        default:
          errorMessage = 'Session stream connection error. Retrying...';
      }
      
      setError(errorMessage);
      
      // Auto-retry connection after a delay
      setTimeout(() => {
        if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
          console.log('Attempting to reconnect SSE session...');
          setError(null);
        }
      }, 5000);
    };

    return () => {
      console.log('Closing SSE session connection for session:', sessionId);
      eventSource.close();
      setIsConnected(false);
    };
  }, [sessionId]);

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
      setSessionData(null);
    }
  };

  return { 
    sessionData, 
    isConnected, 
    error,
    disconnect 
  };
};