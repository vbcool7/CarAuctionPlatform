
import { useQuery } from '@tanstack/react-query';
import API from '../api/axiosInstance';

export const useGetPublicFaqs = () => {
    return useQuery({
        queryKey: ['publicFaqs'],
        queryFn: async () => {
            const res = await API.get('/faq/public');
            return res.data;
        },
        staleTime: 60 * 1000, 
    });
};