
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import API from '../api/axiosInstance';
import { toast } from "react-toastify";
import useAuthStore from '../store/useAuthStore';

export const useSellerRegistrationStep1 = () => {
    return useMutation({
        mutationFn: async (sellerData) => {
            const res = await API.post('/seller/seller_register_step1', sellerData);
            return res.data;
        }
    });
};

export const useSellerRegistrationStep2 = () => {
    return useMutation({
        mutationFn: async ({ sellerId, sellerData }) => {
            const res = await API.patch(`/seller/seller_register_step2/${sellerId}`, sellerData);
            return res.data;
        }
    });
};

export const useSellerRegistrationStep3 = () => {
    return useMutation({
        mutationFn: async ({ sellerId, sellerData }) => {
            const res = await API.patch(`/seller/seller_register_step3/${sellerId}`, sellerData);
            return res.data;
        }
    });
};

export const useSellerRegistrationStep4 = () => {
    return useMutation({
        mutationFn: async ({ sellerId, sellerData }) => {
            const res = await API.patch(`/seller/seller_register_step4/${sellerId}`, sellerData);
            return res.data;
        }
    });
};

export const useSellerRegistrationStep5 = () => {
    return useMutation({
        mutationFn: async ({ sellerId, sellerData }) => {
            const res = await API.patch(`/seller/seller_register_step5/${sellerId}`, sellerData);
            return res.data;
        }
    });
};

export const useSendSellerOTP = () => {
    return useMutation({
        mutationFn: async ({ email }) => {
            const res = await API.post('/otp/send-otp', { email, role: 'seller' });
            return res.data;
        }
    });
};

export const useVerifySellerOTP = () => {
    return useMutation({
        mutationFn: async ({ sellerId, otp }) => {
            const res = await API.patch(`/seller/seller_register_step6/${sellerId}`, { otp });
            return res.data;
        }
    });
};

export const useSellerRegistrationStep7 = () => {
    return useMutation({
        mutationFn: async ({ sellerId }) => {
            const res = await API.post(`/seller/seller_register_step7/${sellerId}`);
            return res.data;
        }
    });
};

export const useSellerLogin = () => {
    return useMutation({
        mutationFn: async ({ email, password, role }) => {
            const res = await API.post('/seller/seller-login', { email, password });
            return res.data;
        }
    });
};

export const useSellerLogout = () => {
    return useMutation({
        mutationKey: ["sellerLogout"],
        mutationFn: async () => {
            const res = await API.post('/seller/seller-logout');
            return res.data;
        }
    });
};

export const useSellerGet = () => {
    const token = useAuthStore((state) => state.token);

    return useQuery({
        queryKey: ['getSeller'],
        queryFn: async () => {
            const { data } = await API.get('/seller/seller-get');
            return data.data;
        },
        enabled: !!token,
    });
};