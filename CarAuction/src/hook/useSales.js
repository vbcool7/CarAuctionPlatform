
import { useQuery } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// =========================== SELLER

// get my sales
export const useGetMySales = (page = 1, limit = 10, status = '', source = '', search = '', startDate = '', endDate = '') => {
    return useQuery({
        queryKey: ['my-sales', page, limit, status, source, search, startDate, endDate],
        queryFn: async () => {
            const res = await API.get('/sales/get-my-sales', {params: { page, limit, status, source, search, startDate, endDate },});
            return res.data;
        },
    });
};

// get my sales
export const useGetSellerDashboard = () => {
    return useQuery({
        queryKey: ['seller-dashboard'],
        queryFn: async () => {
            const res = await API.get('/sales/get-dashboard-summary');
            return res.data;
        },
    });
};

// get my sales summary
export const useGetMySalesSummary = () => {
    return useQuery({
        queryKey: ['my-sales-summary'],
        queryFn: async () => {
            const res = await API.get('/sales/get-my-sales-summary');
            return res.data;
        },
    });
};

// get my sales detail
export const useGetMySaleDetail = (id) => {
    return useQuery({
        queryKey: ['my-sale-detail', id],
        queryFn: async () => {
            const res = await API.get(`/sales/get-sale-detail/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};