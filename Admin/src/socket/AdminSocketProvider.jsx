
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import useAdminAuthStore from '../store/useAdminAuthStore';

const AdminSocketContext = createContext(null);

// VITE_SOCKET_URL na ho to VITE_API_URL ka origin use hoga (path /api/v1 hata ke)
const getSocketUrl = () => {
    if (import.meta.env.VITE_SOCKET_URL) return import.meta.env.VITE_SOCKET_URL;
    try {
        return new URL(import.meta.env.VITE_API_URL).origin;
    } catch {
        return undefined;
    }
};

export function AdminSocketProvider({ children }) {
    const token = useAdminAuthStore((state) => state.token);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!token) {
            setSocket(null);
            return;
        }

        const newSocket = io(getSocketUrl(), { auth: { token } });

        newSocket.on('connect', () => console.log('✅ admin socket connected:', newSocket.id));
        newSocket.on('connect_error', (err) => console.log('❌ admin socket error:', err.message));

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [token]);

    return (
        <AdminSocketContext.Provider value={socket}>
            {children}
        </AdminSocketContext.Provider>
    );
}

export const useAdminSocket = () => useContext(AdminSocketContext);