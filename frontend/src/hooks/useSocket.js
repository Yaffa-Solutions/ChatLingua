import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

// Dev: separate backend port. Prod: same origin (frontend served by backend)
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (import.meta.env.DEV ? 'http://localhost:5000' : undefined);

export function useSocket() {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  const emit = useCallback((event, ...args) => {
    socketRef.current?.emit(event, ...args);
  }, []);

  const on = useCallback((event, handler) => {
    socketRef.current?.on(event, handler);
    return () => socketRef.current?.off(event, handler);
  }, []);

  const off = useCallback((event, handler) => {
    socketRef.current?.off(event, handler);
  }, []);

  return { socket: socketRef, emit, on, off };
}
