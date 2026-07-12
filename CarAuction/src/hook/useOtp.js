
import {useMutation, useQueryClient} from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import API from '../api/axiosInstance';
import toast from 'react-hot-toast';

export const useSendOtp = () => {
    return useMutation({
        mutationFn: async (data) => {

            // verifyData should be { email, otp, role }
            const res = await API.post('/otp/send-otp', data);
            return res.data;
        }
    });
};

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: async (verifyData) => {

            // verifyData should be { email, otp, role }
            const res = await API.post('/otp/verify-otp', verifyData);
            return res.data
        }
    });
};