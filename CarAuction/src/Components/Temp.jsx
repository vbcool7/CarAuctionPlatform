
import { useEffect } from "react";
import { io } from "socket.io-client";
import useAuthStore from '../store/useAuthStore';

function Temp() {
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        if (!token) {
            console.log("No token in store yet");
            return;
        }

        const socket = io("http://localhost:5000", {
            auth: { token }
        });

        socket.on("connect", () => console.log("✅ connected:", socket.id));
        socket.on("connect_error", (err) => console.log("❌ error:", err.message));

        return () => socket.disconnect();
    }, [token]);

    return <div>Dashboard Temp</div>;
}

export default Temp;