
import {useMutation} from '@tanstack/react-query';
import API from "../api/axiosInstance";

export const useAdminLogin = () => {
    return useMutation({
        mutationKey : ["adminLogin"],
        mutationFn: async(admin) => {
            const res = await API.post('/admin/admin-login', admin);
            return res.data;
        }
    });
};

export const useAdminLogout = () => {
    return useMutation({
        mutationKey: ["adminLogout"],
        mutationFn: async() => {
            const res = await API.post('/admin/admin-logout');
            return res.data;
        }
    });
};