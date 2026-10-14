
import { useMutation } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// =========================== SELLER + BUYER

// buy now - fixed price
export const useBuyNow = () => {
    return useMutation({
        mutationKey: ['buyNow'],
        mutationFn: async () => {
            const res = await API.post('/buy/buy-now', { vehicleId })
            return res.data;
        },
    })
};