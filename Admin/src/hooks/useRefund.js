
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from "../api/axiosInstance";

// cancel and refund order
export const useCancelAndRefundOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, reason }) => {
            const res = await API.post(`/admin/cancel-refund/${id}`, { reason })
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payouts'] });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    })
};