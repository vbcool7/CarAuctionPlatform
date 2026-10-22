
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import API from "../api/axiosInstance";

// all sales
export const useGetAllSales = (filters = {}) => {
 
    const {
        page = 1,
        limit = 10,
        search = '',
        saleType = '',
        status = '',
        sortBy = 'newest',
        startDate = '',
        endDate = '',
    } = filters;
 
    return useQuery({
        queryKey: ['allSales', page, limit, search, saleType, status, sortBy, startDate, endDate],
        queryFn: async () => {
            const params = { page, limit, sortBy };
 
            if (search) params.search = search;
            if (saleType) params.saleType = saleType;
            if (status) params.status = status;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
 
            const res = await API.get('/admin/get-all-sales', { params });
            return res.data;
        },
        placeholderData: keepPreviousData,
    });
};