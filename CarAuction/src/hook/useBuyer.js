
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import API from '../api/axiosInstance';
import { toast } from "react-toastify";

export const useBuyerRegistration = () => {
    return useMutation({
        mutationFn: async (buyerData) => {
            const res = await API.post('/buyer/buyer-registration', buyerData);
            return res.data;
        }
    });
};

export const useBuyerLogin = () => {
    return useMutation({
        mutationFn: async({email, password, role}) => {
            const res = await API.post('/buyer/buyer-login', {email, password});
            return res.data;
        }
    });
};

export const useBuyerForgotPassword = () => {
    return useMutation({
        mutationFn: async({email}) => {
            const res = await API.post('/buyer/buyer-forgot-password', {email});
            return res.data;
        }
    });
};

export const useBuyerResetpassword = () => {
    return useMutation({
        mutationFn: async({id, token, password, confirmPassword}) => {
            const res = await API.post(`/buyer/buyer-reset-password/${id}/${token}`, {password, confirmPassword});
            return res.data;
        }
    });
};

export const useBuyerGet =(buyer_id) => {
    return useQuery({
        queryKey: ['buyer', buyer_id],
        queryFn: async() => {
            const {data} = await API.get(`/buyer/buyer-get/${buyer_id}`);
            return data.data;
        },
         enabled: !!buyer_id,
    });
};