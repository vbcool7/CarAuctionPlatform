
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import API from "../api/axiosInstance";
import toast from "react-hot-toast";

// get all auction + live + upcoming + completed + cancel
export const useGetAllAuctions = (filters = {}) => {
    const { page = 1, limit = 10, status = 'all', dateRange = null, search = '', vehicleType = '', fuelType = '', startDate = '', endDate = '', sortBy = '',} = filters;

    return useQuery({
        queryKey: ['allAuctions', page, limit, status, dateRange, search, vehicleType, fuelType, startDate, endDate, sortBy],
        queryFn: async () => {
            const params = new URLSearchParams({ page, limit });

            if (status && status !== 'all') params.append('status', status);
            if (dateRange) params.append('dateRange', dateRange);
            if (search) params.append('search', search);
            if (vehicleType) params.append('vehicleType', vehicleType);
            if (fuelType) params.append('fuelType', fuelType);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            if (sortBy) params.append('sortBy', sortBy);

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
        refetchInterval: 10000, 
        refetchIntervalInBackground: false,
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
        refetchInterval: 10000, 
        refetchIntervalInBackground: false,
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
        refetchInterval: 10000, 
        refetchIntervalInBackground: false,
    });
};

// get completed auction stats
export const useGetCompletedAuctionStats = () => {
    return useQuery({
        queryKey: ["completedAuctionStats"],
        queryFn: async () => {
            const res = await API.get("/admin/completed-auction-stats");
            return res.data;
        },
        refetchInterval: 10000, 
        refetchIntervalInBackground: false,
    });
};

// get canceled auction stats
export const useGetCanceledAuctionStats = () => {
    return useQuery({
        queryKey: ["canceledAuctionStats"],
        queryFn: async () => {
            const res = await API.get("/admin/canceled-auction-stats");
            return res.data;
        },
        refetchInterval: 10000, 
        refetchIntervalInBackground: false,
    });
};

// cancel auction
export const useCancelAuction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, reason }) => {
            const res = await API.patch(`/auction/cancel-auction/${id}`, { reason });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allAuctions'] });
        },
    });
};