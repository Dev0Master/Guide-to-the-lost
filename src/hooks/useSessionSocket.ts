import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!sessionId || !userId) return;
    const socket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3010'}/sessions`, {
      transports: ['websocket'],
      autoConnect: true,
    });
    socketRef.current = socket;

    socket.emit('joinSession', { sessionId, userId });

    if (onLocationUpdate) {
      socket.on('locationUpdate', onLocationUpdate);
    }
    if (onStatusUpdate) {
      socket.on('statusUpdate', onStatusUpdate);
    }
    if (onHeartbeatAck) {
      socket.on('heartbeatAck', onHeartbeatAck);
    }

    // Heartbeat every 10s
    const heartbeatInterval = setInterval(() => {
      socket.emit('heartbeat', { sessionId, userId });
    }, 10000);

    return () => {
      clearInterval(heartbeatInterval);
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, userId]);

  // Send location update
  const sendLocation = (lat: number, lng: number) => {
    socketRef.current?.emit('locationUpdate', { sessionId, userId, lat, lng });
  };

  // Send status update
  const sendStatus = (status: string) => {
    socketRef.current?.emit('statusUpdate', { sessionId, userId, status });
  };

  return { sendLocation, sendStatus };
}
