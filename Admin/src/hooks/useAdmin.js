
import { useMutation, useQuery } from '@tanstack/react-query';
import API from "../api/axiosInstance";
import useAdminAuthStore from '../store/useAdminAuthStore';

export const useAdminLogin = () => {
    return useMutation({
        mutationKey: ["login"],
        mutationFn: async (admin) => {
            const res = await API.post('/admin/login', admin);
            return res.data;
        }
    });
};

export const useAdminLogout = () => {
    return useMutation({
        mutationKey: ["adminLogout"],
        mutationFn: async () => {
            const res = await API.post('/admin/admin-logout');
            return res.data;
        }
    });
};

export const useAdminGet = () => {
    const token = useAdminAuthStore((state) => state.token);

    return useQuery({
        queryKey: ['getAdmin'],
        queryFn: async () => {
            const { data } = await API.get('/admin/admin-get');
            return data.data;
        },
        enabled: !!token,
    });
};

// dashboard stats
export const useGetAdminDashboardStats = (range = 'this_week') => {
    return useQuery({
        queryKey: ['adminDashboardStats', range],
        queryFn: async () => {
            const res = await API.get(`/admin/admin-dashboard-stats?range=${range}`);
            return res.data;
        },
        refetchInterval: 30000,
        refetchIntervalInBackground: false,
    });
}