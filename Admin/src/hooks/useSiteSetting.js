
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import API from '../api/axiosInstance';

const BASE = '/site-setting'; 

// get settings
export const useGetAdminSettings = () =>
    useQuery({
        queryKey: ['admin-site-settings'],
        queryFn: async () => {
            const { data } = await API.get(`${BASE}/settings`);
            return data.settings;
        },
        refetchOnWindowFocus: false
    });

// update setting
export const useUpdateSettings = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await API.patch(`${BASE}/update-settings`, payload);
            return data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Settings updated');
            qc.setQueryData(['admin-site-settings'], data.settings);
            qc.invalidateQueries({ queryKey: ['public-site-settings'] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to update settings');
        },
    });
};