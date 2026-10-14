
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// get my payouts
export const useGetMyPayouts = (page = 1, limit = 10, status = '') => {
    return useQuery({
        queryKey: ['my-payouts', page, limit, status],
        queryFn: async () => {
            const res = await API.get('/payout/get-my-payouts', { params: { page, limit, status } })
            return res.data;
        },
    })
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
        },
    })
};