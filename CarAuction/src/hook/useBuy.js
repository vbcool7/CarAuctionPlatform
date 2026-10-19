
import { useMutation } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// =========================== SELLER + BUYER

// buy now - fixed price
export const useBuyNow = () => {
    return useMutation({
        mutationKey: ['buyNow'],
        mutationFn: async (vehicleId) => {
            const res = await API.post('/buy/buy-now', { vehicleId })
            return res.data;
        },
    })
};

// Stripe checkout URL
export const useCheckout = () => {
    return useMutation({
        mutationKey: ['checkout'],
        mutationFn: async (orderId) => {
            const res = await API.post(`/payment/order-checkout/${orderId}`);
            return res.data;   
        },
    });
};