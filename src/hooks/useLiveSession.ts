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
    const sseUrl = `${baseUrl}/sessions/${sessionId}/live`;
    console.log('[useLiveSession] Attempting SSE connection:', {
      sessionId,
      baseUrl,
      sseUrl,
      timestamp: new Date().toISOString()
    });
    
    const eventSource = new EventSource(sseUrl);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('[useLiveSession] ✅ SSE connection successfully opened:', {
        sessionId,
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
        console.log('[useLiveSession] 📨 Received SSE message:', {
          rawEventData: event.data,
          parsedData: data,
          dataType: data.type,
          nestedDataType: data.data?.type,
          hasDataProperty: 'data' in data,
          timestamp: new Date().toISOString()
        });
        
        // Handle both flat and nested data structures
        const messageType = data.type || data.data?.type;
        const messageData = data.data || data;
        
        console.log('[useLiveSession] 🔍 Processing message:', {
          messageType,
          isNested: !!data.data,
          messageData: messageData
        });
        
        // Handle different types of session events
        if (messageType === 'not_found') {
          console.log('[useLiveSession] ❌ Session not found');
          setError('Session not found');
          setSessionData(null);
        } else if (messageType === 'ended') {
          console.log('[useLiveSession] 🔚 Session ended via SSE');
          setSessionData(prev => prev ? { ...prev, session: { ...prev.session!, status: 'ended' } } : null);
          
          // Don't close SSE immediately - give time for message to be processed
          setTimeout(() => {
            if (eventSourceRef.current) {
              eventSource.close();
              setIsConnected(false);
            }
          }, 1000); // 1 second delay to ensure message processing
        } else if (messageType === 'resolved') {
          console.log('[useLiveSession] 🎉 Lost person found!');
          setSessionData(prev => prev ? { ...prev, lostPerson: messageData, type: 'resolved' } : null);
          eventSource.close();
          setIsConnected(false);
        } else if (messageType === 'session') {
          // Session data (searcher location, status, etc.)
          console.log('[useLiveSession] 📋 Processing session data:', {
            messageData,
            sessionId: messageData.sessionId,
            status: messageData.status,
            hasSearcher: !!messageData.searcher,
            searcherGeopoint: messageData.searcher?.geopoint
          });
          
          // Check if session status is 'ended' in regular session messages
          if (messageData.status === 'ended') {
            console.log('[useLiveSession] 🔚 Session ended detected in session message');
            setSessionData(prev => prev ? { ...prev, session: { ...prev.session!, status: 'ended' } } : null);
            
            // Don't close SSE immediately - give time for message to be processed
            setTimeout(() => {
              if (eventSourceRef.current) {
                eventSource.close();
                setIsConnected(false);
              }
            }, 1000); // 1 second delay to ensure message processing
            return;
          }
          
          setSessionData(prev => ({
            ...prev,
            session: {
              sessionId: messageData.sessionId,
              status: messageData.status,
              campaignId: messageData.campaignId,
              searcher: messageData.searcher, // This should now work correctly
              updatedAt: messageData.updatedAt
            }
          }));
          
          console.log('[useLiveSession] ✅ Session data updated:', {
            searcher: messageData.searcher,
            hasGeopoint: !!messageData.searcher?.geopoint,
            searcherLocation: messageData.searcher?.geopoint
          });
        } else if (messageType === 'lost_update') {
          // Lost person location update
          console.log('[useLiveSession] 📍 Processing lost person location update:', messageData);
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
          // Generic data update
          console.log('[useLiveSession] 🔄 Generic data update:', messageData);
          setSessionData(prev => ({ ...prev, ...messageData }));
        }
      } catch (err) {
        console.error('Error parsing session SSE data:', err, 'Raw event data:', event.data);
        setError('Error parsing live session data');
      }
    };

    // Handle named 'ended' event specifically
    eventSource.addEventListener('ended', (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[useLiveSession] 🔚 Named "ended" event received:', {
          eventData: event.data,
          parsedData: data,
          sessionId: data.sessionId,
          timestamp: new Date().toISOString()
        });
        
        // Set session status to ended
        setSessionData(prev => prev ? { ...prev, session: { ...prev.session!, status: 'ended' } } : null);
        
        // Close SSE connection after delay
        setTimeout(() => {
          if (eventSourceRef.current) {
            eventSource.close();
            setIsConnected(false);
          }
        }, 1000);
      } catch (err) {
        console.error('[useLiveSession] Error parsing ended event data:', err, 'Raw data:', event.data);
      }
    });

    // Handle named 'lost_not_found' event
    eventSource.addEventListener('lost_not_found', (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('[useLiveSession] ❌ Named "lost_not_found" event received:', data);
        setError('Lost person profile not found');
      } catch (err) {
        console.error('[useLiveSession] Error parsing lost_not_found event:', err);
      }
    });

    eventSource.onerror = (event) => {
      console.error('[useLiveSession] ❌ SSE connection error:', {
        event,
        readyState: eventSource.readyState,
        readyStateText: eventSource.readyState === EventSource.CONNECTING ? 'CONNECTING' :
                       eventSource.readyState === EventSource.OPEN ? 'OPEN' : 'CLOSED',
        url: eventSource.url,
        sessionId,
        timestamp: new Date().toISOString()
      });
      
      setIsConnected(false);
      
      let errorMessage = 'Connection error. Retrying...';
      
      // More specific error handling based on readyState
      switch (eventSource.readyState) {
        case EventSource.CONNECTING:
          errorMessage = 'Connecting to session stream...';
          console.warn('[useLiveSession] 🔄 SSE attempting to reconnect');
          break;
        case EventSource.CLOSED:
          errorMessage = 'Session stream connection closed. Retrying...';
          console.error('[useLiveSession] 💀 SSE connection closed');
          break;
        default:
          errorMessage = 'Session stream connection error. Retrying...';
          console.error('[useLiveSession] ❓ SSE unknown connection error');
      }
      
      setError(errorMessage);
      
      // Auto-retry connection after a delay
      setTimeout(() => {
        if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
          console.log('[useLiveSession] 🔄 Attempting to reconnect SSE session...');
          setError('');
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