
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import API from '../api/axiosInstance';
import { toast } from "react-toastify";

// get all auctions
export const useGetMyAuctions = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['myAuctions', page, limit],
        queryFn: async () => {
            const res = await API.get(`/auction/get-my-auctions?page=${page}&limit=${limit}`);
            return res.data;
        },
        keepPreviousData: true,
    });
};

// get auc by id
export const useGetAuctionDetail = (id) => {
    return useQuery({
        queryKey: ['auctionDetail', id],
        queryFn: async() => {
            const res = await API.get(`/auction/my-auction-detail/${id}`);
            return res.data;
        },
        enabled: !!id,
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
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['myAuctions'] });
            queryClient.invalidateQueries({ queryKey: ['auctionDetail', variables.id] });
        },
    });
};