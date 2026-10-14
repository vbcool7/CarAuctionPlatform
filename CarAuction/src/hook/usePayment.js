
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
export const useGetMyOrders = (page = 1, limit = 10, status = '') => {
    return useQuery({
        queryKey: ['my-orders', page, limit, status],
        queryFn: async () => {
            const res = await API.get('/payment/get-my-orders', { params: { page, limit, status } })
            return res.data;
        },
    })
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