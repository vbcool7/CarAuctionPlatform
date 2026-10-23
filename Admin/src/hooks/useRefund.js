
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
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

// get all refund
export const useGetAllRefunds = (filters = {}) => {
    const {
        page = 1,
        limit = 10,
        search = '',
        status = '',
        kind = '',
        sortBy = 'newest',
        startDate = '',
        endDate = '',
    } = filters;

    return useQuery({
        queryKey: ['adminRefunds', page, limit, search, status, kind, sortBy, startDate, endDate],
        queryFn: async () => {
            const params = { page, limit, sortBy };

            if (search) params.search = search;
            if (status) params.status = status;
            if (kind) params.kind = kind;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const res = await API.get('/admin/get-all-refunds', { params });
            return res.data;
        },
        placeholderData: keepPreviousData,
    })
};

// get refund detail
export const useGetRefundDetail = (id) => {
    return useQuery({
        queryKey: ['adminRefundDetail', id],
        queryFn: async () => {
            const res = await API.get(`/admin/refund-detail/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};