
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from "../api/axiosInstance";

// get all payouts
export const useGetAllPayouts = (page = 1, limit = 10, status = '') => {
    return useQuery({
        queryKey: ['payouts', page, limit, status],
        queryFn: async () => {
            const res = await API.get('/admin/get-all-payouts', { params: { page, limit, status } })
            return res.data;
        },
    })
};

// confirm handover
export const useConfirmHandOver = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['confirmHandOver'],
        mutationFn: async ({ orderId, note }) => {
            const res = await API.patch(`/admin/confirm-handover/${orderId}`, { note })
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payouts'] });
        }
    })
};

// mark payout
export const useMarkPayoutPaid = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['markPayout'],
        mutationFn: async ({ id, transferReference }) => {
            const res = await API.patch(`/admin/mark-payout-paid/${id}`, { transferReference })
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payouts'] });
        }
    })
};

// reject payout req
export const useRejectPayoutRequest =() => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['rejectPayout'],
        mutationFn: async({ id, reason }) => {
            const res = await API.patch(`/admin/reject-payout-request/${id}`, { reason })
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payouts'] });
        }
    })
};