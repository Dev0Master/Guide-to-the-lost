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
  const [error, setError] = useState<string>('');
  const eventSourceRef = useRef<EventSource | null>(null);

  // Persist sessionId in localStorage
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('gfl-sessionId', sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    // Try to restore sessionId from localStorage if not provided
    let sid = sessionId;
    if (!sid) {
      sid = localStorage.getItem('gfl-sessionId');
    }
    if (!sid) {
      setSessionData(null);
      setIsConnected(false);
      return;
    }

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3010/api';
    const sseUrl = `${baseUrl}/sessions/${sid}/live`;
    console.log('[useLiveSession] Attempting SSE connection:', {
      sessionId: sid,
      baseUrl,
      sseUrl,
      timestamp: new Date().toISOString()
    });
    
    const eventSource = new EventSource(sseUrl);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('[useLiveSession] ✅ SSE connection successfully opened:', {
        sessionId: sid,
        readyState: eventSource.readyState,
        url: eventSource.url,
        timestamp: new Date().toISOString()
      });
      setIsConnected(true);
      setError('');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // ...existing code...
        // Handle both flat and nested data structures
        const messageType = data.type || data.data?.type;
        const messageData = data.data || data;
        // ...existing code...
        // Handle different types of session events
        if (messageType === 'not_found') {
          setError('Session not found');
          setSessionData(null);
        } else if (messageType === 'ended') {
          setSessionData(prev => prev ? { ...prev, session: { ...prev.session!, status: 'ended' }, type: 'session_ended' } : null);
          // Broadcast session end to allow for smooth transition
          window.dispatchEvent(new CustomEvent('sessionEnded', { 
            detail: { sessionId: sid, reason: 'ended' } 
          }));
          setTimeout(() => {
            if (eventSourceRef.current) {
              eventSource.close();
              setIsConnected(false);
            }
          }, 1000);
        } else if (messageType === 'resolved') {
          setSessionData(prev => prev ? { ...prev, lostPerson: messageData, type: 'resolved' } : null);
          eventSource.close();
          setIsConnected(false);
        } else if (messageType === 'session') {
          if (messageData.status === 'ended') {
            setSessionData(prev => prev ? { ...prev, session: { ...prev.session!, status: 'ended' }, type: 'session_ended' } : null);
            // Broadcast session end event
            window.dispatchEvent(new CustomEvent('sessionEnded', { 
              detail: { sessionId: messageData.sessionId, reason: 'ended' } 
            }));
            setTimeout(() => {
              if (eventSourceRef.current) {
                eventSource.close();
                setIsConnected(false);
              }
            }, 1000);
            return;
          }
          setSessionData(prev => ({
            ...prev,
            session: {
              sessionId: messageData.sessionId,
              status: messageData.status,
              campaignId: messageData.campaignId,
              searcher: messageData.searcher,
              updatedAt: messageData.updatedAt
            }
          }));
        } else if (messageType === 'lost_update') {
          setSessionData(prev => ({
            ...prev,
            lostPerson: {
              id: messageData.id,
              status: messageData.status,
              geopoint: messageData.geopoint,
              lastSeenRefId: messageData.lastSeenRefId,
              updatedAt: messageData.updatedAt
            }
          }));
        } else {
          setSessionData(prev => ({ ...prev, ...messageData }));
        }
      } catch (err) {
        setError('Error parsing live session data');
      }
    };

    // Handle named 'ended' event specifically
    eventSource.addEventListener('ended', (event) => {
      try {
        const data = JSON.parse(event.data);
        setSessionData(prev => prev ? { ...prev, session: { ...prev.session!, status: 'ended' }, type: 'session_ended' } : null);
        // Broadcast session end event
        window.dispatchEvent(new CustomEvent('sessionEnded', { 
          detail: { sessionId: data.sessionId || sid, reason: 'ended' } 
        }));
        setTimeout(() => {
          if (eventSourceRef.current) {
            eventSource.close();
            setIsConnected(false);
          }
        }, 1000);
      } catch (err) {}
    });

    // Handle named 'lost_not_found' event
    eventSource.addEventListener('lost_not_found', (event) => {
      try {
        const data = JSON.parse(event.data);
        setError('Lost person profile not found');
      } catch (err) {}
    });

    eventSource.onerror = (event) => {
      setIsConnected(false);
      let errorMessage = 'Connection error. Retrying...';
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
      setTimeout(() => {
        if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
          setError('');
        }
      }, 5000);
    };

    return () => {
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
    // Optionally clear sessionId from localStorage
    // localStorage.removeItem('gfl-sessionId');
  };

  return { 
    sessionData, 
    isConnected, 
    error,
    disconnect 
  };
};