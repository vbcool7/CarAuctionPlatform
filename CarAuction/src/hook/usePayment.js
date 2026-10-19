
import { useMutation, useQuery } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// create order checkout session
export const useCreateCheckoutSession = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await API.post(`/payment/order-checkout/${id}`)
            return res.data;
        },
    })
};

// get my orders
export const useGetMyOrders = (page = 1, limit = 10, status = '', source = '') => {
    return useQuery({
        queryKey: ['my-orders', page, limit, status, source],
        queryFn: async () => {
            const res = await API.get('/payment/get-my-orders', { params: { page, limit, status, source } });
            return res.data;
        },
        placeholderData: (previousData) => previousData,
    });
};

// get my order detail
export const useGetMyOrderDetail = (id) => {
    return useQuery({
        queryKey: ['my-order-detail', id],
        queryFn: async () => {
            const res = await API.get(`/payment/get-my-order-detail/${id}`)
            return res.data;
        },
        enabled: !!id,
    })
};

// order detail
export const useOrderDetail = (orderId, { poll = false } = {}) => {
    return useQuery({
        queryKey: ['orderDetail', orderId],
        enabled: !!orderId,
        retry: false,
        queryFn: async () => {
            const res = await API.get(`/payment/get-my-order-detail/${orderId}`);
            return res.data;
        },
        refetchInterval: (query) => {
            if (!poll) return false;
            const status = query.state.data?.order?.status;
            if (status && status !== 'pending_payment') return false;
            if (query.state.dataUpdateCount >= 15) return false;
            return 2000;
        },
    })
};

// get my orders summary
export const useGetMyOrdersSummary = (source = '') => {
    return useQuery({
        queryKey: ['my-orders-summary', source],
        queryFn: async () => {
            const res = await API.get('/payment/get-my-orders-summary', {
                params: source ? { source } : {},
            });
            return res.data;
        },
    });
};