
import { useQuery } from '@tanstack/react-query';
import API from '../api/axiosInstance';

export const useGetPublicSettings = () =>
    useQuery({
        queryKey: ['public-site-settings'],
        queryFn: async () => {
            const { data } = await API.get('/site-setting/public');
            return data.settings;
        },
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
    });