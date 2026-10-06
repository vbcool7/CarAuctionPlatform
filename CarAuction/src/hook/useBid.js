
import { useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// =========================== SELLER + BUYER

// place bid 
export const usePlaceBid = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ vehicleId, amount }) => {
            const res = await API.post('/bid/place-bid', { vehicleId, amount });
            return res.data;
        },
        onSuccess: (data, { vehicleId }) => {
            queryClient.invalidateQueries({ queryKey: ['publicAuctionDetail', vehicleId] });
            queryClient.invalidateQueries({ queryKey: ['publicAuctionBids'] });
            queryClient.invalidateQueries({ queryKey: ['myBids'] });
        },
    });
};

// withdraw-bid
export const useWithdrawBid = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (bidId) => {
            const res = await API.patch(`/bid/withdraw-bid/${bidId}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['publicAuctionDetail'] });
            queryClient.invalidateQueries({ queryKey: ['publicAuctionBids'] });
            queryClient.invalidateQueries({ queryKey: ['myBids'] });
        },
    });
};

// =========================== SELLER

// all my-bids : seller + buyer
export const useGetMyBids = ({
    status = 'all',
    page = 1,
    limit = 10,
    search = '',
    auctionType = 'all'
} = {}) => {
    return useQuery({
        queryKey: ['myBids', status, page, limit, search, auctionType],
        queryFn: async () => {
            const params = new URLSearchParams({ page, limit });

            if (status !== 'all') params.append('status', status);
            if (search.trim()) params.append('search', search.trim());
            if (auctionType !== 'all') params.append('auctionType', auctionType);

            const res = await API.get(`/bid/my-bids?${params.toString()}`);
            return res.data;
        },
        placeholderData: keepPreviousData,
    });
};

// get my bid detail
export const useGetMyBidDetail = (id, page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['myBidDetail', id, page, limit],
        queryFn: async () => {
            const res = await API.get(`/bid/my-bid-detail/${id}`, {
                params: { page, limit },
            });
            return res.data;
        },
        enabled: !!id,
        placeholderData: (previousData) => previousData, // avoids flash-to-loading when changing page
    });
};

// vehicle bids
export const useGetVehicleBids = (page = 1, limit = 10, id) => {
    return useQuery({
        queryKey: ['vehicleBids', page, limit, id],
        queryFn: async () => {
            const res = await API.get(`/bid/vehicle-bids/${id}?page=${page}&limit=${limit}`);
            return res.data;
        },
        keepPreviousData: true,
    });
};

// =========================== BUYER

// get bid detail
export const useGetMyBidDetailBuyer = (id, page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['myBidDetailBuyer', id, page, limit],
        queryFn: async () => {
            const res = await API.get(`/bid/my-bid-detail-buyer/${id}`, {
                params: { page, limit },
            });
            return res.data;
        },
        enabled: !!id,
        placeholderData: (previousData) => previousData,
    });
};

// top bidders
export const useGetTopBidders = (limit) => {
    return useQuery({
        queryKey: ['topBidders', limit],
        queryFn: async () => {
            const res = await API.get(`/bid/get-top-bidders?limit=${limit}`);
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
        placeholderData: keepPreviousData,
    });
};

// =========================== USER

// get public bids for particular vehicle
export const useGetPublicAuctionBids = (id, page = 1, limit = 10) =>
    useQuery({
        queryKey: ['publicAuctionBids', id, page, limit],
        queryFn: async () => (await API.get(`/bid/get-auction-bids/${id}?page=${page}&limit=${limit}`)).data,
        enabled: !!id,
        placeholderData: keepPreviousData,
    });