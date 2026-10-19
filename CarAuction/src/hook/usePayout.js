
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// ======================================= SELLER

// get my payouts
export const useGetMyPayouts = (page = 1, limit = 10, status = '') => {
    return useQuery({
        queryKey: ['my-payouts', page, limit, status],
        queryFn: async () => {
            const res = await API.get('/payout/get-my-payouts', { params: { page, limit, status } })
            return res.data;
        },
        placeholderData: (previousData) => previousData,
    })
};

// get payout detail
export const useGetMyPayoutById = (id) => {
    return useQuery({
        queryKey: ['my-payout-detail', id],
        queryFn: async () => {
            const res = await API.get(`/payout/get-my-payout-detail/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};

// request for payout
export const useRequestPayout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const res = await API.post(`/payout/request-for-payout/${id}`)
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-payouts'] });
            queryClient.invalidateQueries({ queryKey: ['payouts'] });
            queryClient.invalidateQueries({ queryKey: ['my-payout-detail', id] });
        },
    })
};