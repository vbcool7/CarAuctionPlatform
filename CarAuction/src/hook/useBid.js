
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import API from '../api/axiosInstance';
import { toast } from "react-toastify";

// =========================== SELLER

// all my-bids
export const useGetMyBids = (page=1, status='', limit=10,) => {
    return useQuery({
        queryKey: ['myBids', page,status, limit],
        queryFn: async() => {
            const res = await API.get(`/bid/my-bids?page=${page}&limit=${limit}&status=${status}`)
            return res.data;
        },
        keepPreviousData: true,
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
export const useGetVehicleBids = (page=1, limit=10, id) => {
    return useQuery({
        queryKey: ['vehicleBids', page, limit, id],
        queryFn: async() => {
            const res = await API.get(`/bid/vehicle-bids/${id}?page=${page}&limit=${limit}`);
            return res.data;
        },
        keepPreviousData: true,
    });
};