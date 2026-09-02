
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import API from "../api/axiosInstance";
import toast from "react-hot-toast";

// get all auction + live + upcoming + completed + cancel
export const useGetAllAuctions = (page = 1, limit = 10, status = 'all', dateRange = null) => {
    return useQuery({
        queryKey: ['allAuctions', page, limit, status, dateRange],
        queryFn: async () => {
            const params = new URLSearchParams({ page, limit });
            if (status && status !== 'all') params.append('status', status);
            if (dateRange) params.append('dateRange', dateRange);
            const res = await API.get(`/admin/all-auctions?${params.toString()}`);
            return res.data;
        },
        placeholderData: keepPreviousData,
    });
};

// get auction detail
export const useGetAuctionDetail = (id) => {
    return useQuery({
        queryKey: ['auctionDetail', id],
        queryFn: async () => {
            const res = await API.get(`/admin/auction-detail/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};

// all auction stats
export const useGetAllAuctionStats = () => {
    return useQuery({
        queryKey: ["allAuctionStats"],
        queryFn: async () => {
            const res = await API.get('/admin/all-auction-stats');
            return res.data;
        },
    });
};

// live auction stats
export const useGetLiveAuctionStats = () => {
    return useQuery({
        queryKey: ["liveAuctionStats"],
        queryFn: async () => {
            const res = await API.get('/admin/live-auction-stats');
            return res.data;
        },
    });
};

// get upcoming auction stats
export const useGetUpcomingAuctionStats = () => {
    return useQuery({
        queryKey: ["upcomingAuctionStats"],
        queryFn: async () => {
            const res = await API.get("/admin/upcoming-auction-stats");
            return res.data;
        },
    });
};

// cancel auction
export const useCancelAuction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, reason }) => {
            const res = await API.patch(`/admin/cancel-auction/${id}`, { reason });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allAuctions'] });
        },
    });
};