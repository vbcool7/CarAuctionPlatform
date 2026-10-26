
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// get all transactions
export const useGetAllTransactions = (filters = {}) => {
    
    const {
        page = 1,
        limit = 10,
        search = '',
        status = '',
        kind = '',
        sortBy = 'newest',
        startDate = '',
        endDate = '',
    } = filters;

    return useQuery({
        queryKey: ['adminTransactions', page, limit, search, status, kind, sortBy, startDate, endDate],
        queryFn: async () => {

            const params = { page, limit, sortBy };

            if (search) params.search = search;
            if (status) params.status = status;
            if (kind) params.saleType = kind;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const res = await API.get('/admin/get-all-transactions', { params });
            return res.data;
        },
        placeholderData: keepPreviousData,
    });
};

// transaction detail
export const useGetTransactionDetail = (key) => {
    return useQuery({
        queryKey: ['adminTransactionDetail', key],
        queryFn: async () => {
            const res = await API.get(`/admin/transaction-detail/${encodeURIComponent(key)}`);
            return res.data;
        },
        enabled: !!key,
    });
};