
import React, { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';


export interface UseSessionSocketOptions {
  sessionId: string;
  userId: string;
  onLocationUpdate?: (data: Record<string, unknown>) => void;
  onStatusUpdate?: (data: Record<string, unknown>) => void;
  onHeartbeatAck?: (data: Record<string, unknown>) => void;
}


export function useSessionSocket({
  sessionId,
  userId,
  onLocationUpdate,
  onStatusUpdate,
  onHeartbeatAck,
}: UseSessionSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);

  // Persist sessionId and userId in localStorage for restoration
  useEffect(() => {
    if (sessionId && userId) {
      localStorage.setItem('gfl-sessionId', sessionId);
      localStorage.setItem('gfl-userId', userId);
    }
  }, [sessionId, userId]);

  useEffect(() => {
    // Restore sessionId/userId from localStorage if not provided
    let sid = sessionId;
    let uid = userId;
    if (!sid) sid = localStorage.getItem('gfl-sessionId') || '';
    if (!uid) uid = localStorage.getItem('gfl-userId') || '';
    if (!sid || !uid) return;

    // Connect to WebSocket server
    const socket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3010'}/sessions`, {
      transports: ['websocket'],
      autoConnect: true,
    });
    socketRef.current = socket;

    // Join session on connect
    const join = () => {
      socket.emit('joinSession', { sessionId: sid, userId: uid });
    };
    socket.on('connect', () => {
      setIsConnected(true);
      join();
    });
    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    join(); // Initial join

    // Register event listeners if provided
    if (onLocationUpdate) socket.on('locationUpdate', onLocationUpdate);
    if (onStatusUpdate) socket.on('statusUpdate', onStatusUpdate);
    if (onHeartbeatAck) socket.on('heartbeatAck', onHeartbeatAck);

    // Heartbeat every 10s
    heartbeatRef.current = setInterval(() => {
      socket.emit('heartbeat', { sessionId: sid, userId: uid });
    }, 10000);

    // Cleanup on unmount
    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      
      // Properly leave session before disconnecting
      const sid = sessionId || localStorage.getItem('gfl-sessionId') || '';
      const uid = userId || localStorage.getItem('gfl-userId') || '';
      if (sid && uid) {
        socket.emit('leaveSession', { sessionId: sid, userId: uid });
      }
      
      socket.off('connect');
      socket.off('disconnect');
      if (onLocationUpdate) socket.off('locationUpdate', onLocationUpdate);
      if (onStatusUpdate) socket.off('statusUpdate', onStatusUpdate);
      if (onHeartbeatAck) socket.off('heartbeatAck', onHeartbeatAck);
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, userId, onLocationUpdate, onStatusUpdate, onHeartbeatAck]);

  // Send location update
  const sendLocation = (lat: number, lng: number) => {
    const sid = sessionId || localStorage.getItem('gfl-sessionId') || '';
    const uid = userId || localStorage.getItem('gfl-userId') || '';
    socketRef.current?.emit('locationUpdate', { sessionId: sid, userId: uid, lat, lng });
  };

  // Send status update
  const sendStatus = (status: string) => {
    const sid = sessionId || localStorage.getItem('gfl-sessionId') || '';
    const uid = userId || localStorage.getItem('gfl-userId') || '';
    socketRef.current?.emit('statusUpdate', { sessionId: sid, userId: uid, status });
  };

  // Leave session explicitly before cleanup
  const leaveSession = () => {
    const sid = sessionId || localStorage.getItem('gfl-sessionId') || '';
    const uid = userId || localStorage.getItem('gfl-userId') || '';
    if (socketRef.current && sid && uid) {
      socketRef.current.emit('leaveSession', { sessionId: sid, userId: uid });
    }
  };

  // Enhanced session cleanup
  const clearSession = () => {
    leaveSession();
    localStorage.removeItem('gfl-sessionId');
    localStorage.removeItem('gfl-userId');
  };

  // Expose connection status and session management for UI feedback
  return { sendLocation, sendStatus, leaveSession, clearSession, isConnected };
}
