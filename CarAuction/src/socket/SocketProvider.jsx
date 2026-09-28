
import { createContext, useContext, useEffect, useState } from "react";
import { io } from 'socket.io-client';
import useAuthStore from '../store/useAuthStore';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
    const token = useAuthStore((state) => state.token);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!token) {
            setSocket(null);
            return;
        }

        const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
            auth: { token },
        });

        newSocket.on("connect", () => console.log("✅ socket connected:", newSocket.id));
        newSocket.on("connect_error", (err) => console.log("❌ socket error:", err.message));

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [token]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext);