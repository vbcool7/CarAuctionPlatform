
import { useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// =========================== SELLER

// all my-bids
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