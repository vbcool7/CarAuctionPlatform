
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../SocketProvider";

export function useBidSocket(vehicleId) {
    const socket = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket || !vehicleId) return;

        // connect (initial + reconnect) pe room join
        const join = () => socket.emit('joinVehicleRoom', vehicleId);
        if (socket.connected) join();
        socket.on('connect', join);

        const handleBidUpdate = (data) => {
            if (String(data.vehicleId) !== String(vehicleId)) return;

            // turant update: response shape { success, data: {...vehicle} }
            queryClient.setQueryData(['publicAuctionDetail', vehicleId], (old) =>
                old?.data
                    ? {
                        ...old,
                        data: {
                            ...old.data,
                            currentBid: data.currentBid,
                            auctionEndDateTime: data.auctionEndDateTime,
                            extensionCount: data.extensionCount,
                        },
                    }
                    : old
            );

            // recentBids / totalBids ke liye refetch
            queryClient.invalidateQueries({ queryKey: ['publicAuctionDetail', vehicleId] });
            queryClient.invalidateQueries({ queryKey: ['publicAuctionBids', vehicleId] });
        };

        socket.on('bidUpdate', handleBidUpdate);

        return () => {
            socket.emit('leaveVehicleRoom', vehicleId);
            socket.off('connect', join);
            socket.off('bidUpdate', handleBidUpdate);
        };
    }, [socket, vehicleId, queryClient]);
}