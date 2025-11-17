import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const useSocket = (userId, onUpdate) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to Socket.IO server
    socketRef.current = io('http://localhost:5000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    // Join user room
    socketRef.current.emit('join-user', userId);

    // Listen for updates
    socketRef.current.on('referral-applied', (data) => {
      onUpdate({
        type: 'referral-applied',
        data
      });
    });

    socketRef.current.on('new-referral', (data) => {
      onUpdate({
        type: 'new-referral',
        data
      });
    });

    socketRef.current.on('coins-updated', (data) => {
      onUpdate({
        type: 'coins-updated',
        data
      });
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId]);

  return socketRef.current;
};

export default useSocket;
