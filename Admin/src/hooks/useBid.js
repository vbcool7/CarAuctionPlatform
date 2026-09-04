
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import API from "../api/axiosInstance";
import toast from "react-hot-toast";

// all bids
export const useGetAllBids = (page=1, status = 'all', limit=10) => {
    return useQuery({
        queryKey: ['allBids', page, status, limit],
        queryFn: async() => {
            const res = await API.get(`/admin/all-bids?page=${page}&limit=${limit}&status=${status}`)
            return res.data;
        },
        placeholderData: keepPreviousData,
    });
};

// bid detail
export const useGetBidDetail = (id) => {
    return useQuery({
        queryKey: ['bidDetail', id],
        queryFn: async() => {
            const res = await API.get(`/admin/bid-detail/${id}`)
            return res.data;
        },
        enabled: !!id,
    });
};