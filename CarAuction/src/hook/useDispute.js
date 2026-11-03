
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// get categories
export const useGetDisputeCategories = (role) => {
    return useQuery({
        queryKey: ['disputeCategories', role],
        queryFn: async () => {
            const res = await API.get('/dispute/get-dispute-categories', { params: role ? { as: role } : {} });
            return res.data;
        },
        staleTime: 60 * 1000,
    });
};

// my disputes
export const useGetMyDisputes = ({ page = 1, limit = 10, status = '', view = '', search = '' } = {}) => {
    return useQuery({
        queryKey: ['myDisputes', page, limit, status, view, search],
        queryFn: async () => {
            const params = { page, limit };

            if (status) params.status = status;
            if (view) params.view = view;
            if (search) params.search = search;

            const res = await API.get('/dispute/my-disputes', { params });
            return res.data;
        },
        placeholderData: keepPreviousData,
    });
};

// my dispute by id
export const useGetMyDispute = (id) => {
    return useQuery({
        queryKey: ['myDispute', id],
        queryFn: async () => {
            const res = await API.get(`/dispute/my-dispute-detail/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};

// refresh
const useRefreshAll = () => {
    const qc = useQueryClient();
    return () => qc.invalidateQueries();
};

// files: File[] (max 5)
const toFormData = (fields, files) => {
    const fd = new FormData();
    Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
    (files || []).forEach((f) => fd.append('evidence', f));
    return fd;
};

// raise dispute
export const useRaiseDispute = () => {
    const refresh = useRefreshAll();
    return useMutation({
        mutationFn: async ({ orderId, categoryId, description, files }) => {
            const res = await API.post(`/dispute/raise-dispute/${orderId}`, toFormData({ categoryId, description }, files));
            return res.data;
        },
        onSuccess: refresh,
    });
};

// respond to dispute
export const useRespondToDispute = () => {
    const refresh = useRefreshAll();
    return useMutation({
        mutationFn: async ({ id, description, files }) => {
            const res = await API.post(`/dispute/respond-dispute/${id}`, toFormData({ description }, files));
            return res.data;
        },
        onSuccess: refresh,
    });
};

// withdraw dispute
export const useWithdrawDispute = () => {
    const refresh = useRefreshAll();
    return useMutation({
        mutationFn: async (id) => {
            const res = await API.patch(`/dispute/withdraw-dispute/${id}`);
            return res.data;
        },
        onSuccess: refresh,
    });
};