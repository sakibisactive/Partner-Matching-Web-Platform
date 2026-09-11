import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      const serverUrl =
        (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_SOCKET_URL || process.env?.NEXT_PUBLIC_API_URL)) ||
        (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) ||
        window.location.origin;
      const token = typeof window !== 'undefined' ? localStorage.getItem('soul_token') : null;
      const newSocket = io(serverUrl, {
        transports: ['websocket', 'polling'],
        auth: {
          token,
          userId: user.id,
        },
      });

      newSocket.emit('setup', user.id);

      newSocket.on('online_users', (users: string[]) => {
        setOnlineUsers(users);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
