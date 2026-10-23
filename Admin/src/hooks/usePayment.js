
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import API from "../api/axiosInstance";

// get all payments
export const useGetAllPayments = (filters = {}) => {
    const {
        page = 1,
        limit = 10,
        search = '',
        status = '',
        saleType = '',
        sortBy = 'newest',
        startDate = '',
        endDate = '',
    } = filters;

    return useQuery({
        queryKey: ['adminPayments', page, limit, search, status, saleType, sortBy, startDate, endDate],
        queryFn: async () => {

            const params = { page, limit, sortBy };

            if (search) params.search = search;
            if (status) params.status = status;
            if (saleType) params.saleType = saleType;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const res = await API.get('/admin/get-all-payments', { params });
            return res.data;
        },
        placeholderData: keepPreviousData,
    });
};

// payment detail
export const useGetPaymentDetail = (id) => {
    return useQuery({
        queryKey: ['adminPaymentDetail', id],
        queryFn: async () => {
            const res = await API.get(`/admin/payment-detail/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};

// order level - admin cancel
//   handover -> PATCH /admin/confirm-handover/:id   body { note }
//   refund   -> POST  /admin/cancel-refund/:id      body { reason }
export const useAdminOrderAction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ type, id, body }) => {
            const map = {
                handover: ['patch', `/admin/confirm-handover/${id}`],
                refund: ['post', `/admin/cancel-refund/${id}`],
            };

            const action = map[type];
            if (!action) throw new Error('Invalid order action');

            const [method, url] = action;
            const res = method === 'post' ? await API.post(url, body) : await API.patch(url, body);
            return res.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminPayments'] });
            queryClient.invalidateQueries({ queryKey: ['adminPaymentDetail'] });
            queryClient.invalidateQueries({ queryKey: ['allSales'] });
            queryClient.invalidateQueries({ queryKey: ['payouts'] });
            queryClient.invalidateQueries({ queryKey: ['payout-detail'] });
            queryClient.invalidateQueries({ queryKey: ['my-payouts'] });
            queryClient.invalidateQueries({ queryKey: ['my-payout-detail'] });
            queryClient.invalidateQueries({ queryKey: ['my-orders'] });
        },
    });
};