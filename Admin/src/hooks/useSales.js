
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import API from "../api/axiosInstance";

// all sales
export const useGetAllSales = (filters = {}) => {

    const { page = 1, limit = 10, search = '', saleType = 'all', status = 'all', startDate = '', endDate = '', sortBy = 'newest', } = filters;

    return useQuery({
        queryKey: ['allSales', page, limit, search, saleType, status, startDate, endDate, sortBy],
        queryFn: async () => {

            const params = new URLSearchParams({ page, limit, sortBy });

            if (search) params.set('search', search);
            if (saleType !== 'all') params.set('saleType', saleType);
            if (status !== 'all') params.set('status', status);
            if (startDate) params.set('startDate', startDate);
            if (endDate) params.set('endDate', endDate);

            const res = await API.get(`/admin/all-sales?${params.toString()}`);
            return res.data;
        },
        placeholderData: keepPreviousData,
    });
};