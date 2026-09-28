
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../SocketProvider";

export function useBidSocket(vehicleId) {
    const socket = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket || !vehicleId) return;

        socket.emit('joinVehicleRoom', vehicleId);

        const handleBidUpdate = (data) => {
            if (data.vehicleId === vehicleId) {
                queryClient.invalidateQueries({ queryKey: ['auctionDetail', vehicleId] });
            }
        };

        socket.on('bidUpdate', handleBidUpdate);

        return () => {
            socket.emit('leaveVehicleRoom', vehicleId);
            socket.off('bidUpdate', handleBidUpdate);
        };
    }, [socket, vehicleId, queryClient]);
}