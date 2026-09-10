
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import API from "../api/axiosInstance";
import toast from "react-hot-toast";

// seller stats
export const useSellerStats = () => {
    return useQuery({
        queryKey: ['sellerStats'],
        queryFn: async () => {
            const res = await API.get('/admin/seller-stats');
            return res.data;
        },
    });
};

// add new seller
export const useAddNewSeller = () => {
    return useMutation({
        mutationKey: ['newSellerAdded'],
        mutationFn: async (sellerData) => {
            const res = await API.post('/admin/add-new-seller', sellerData);
            return res.data;
        }
    });
};

// all sellers list
export const useGetAllSellers = (page = 1, limit = 10, filters = {}) => {
    return useQuery({
        queryKey: ['sellers', page, limit, filters],
        queryFn: async () => {
            const params = new URLSearchParams({ page, limit });

            if(filters.search) params.append('search', filters.search);
            if(filters.isEmailVerified !== undefined) params.append('isEmailVerified', filters.isEmailVerified);

            if (filters.businessType) params.append('businessType', filters.businessType);
            if (filters.accountStatus) params.append('accountStatus', filters.accountStatus);
            if (filters.status) params.append('status', filters.status);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate)

            const res = await API.get(`/admin/all-sellers-list?${params}`);
            return res.data;
        },
        placeholderData: keepPreviousData,
    });
};

// toggle seller verification - email
export const useToggleSellerVerification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ sellerId, isVerified }) => {
            const res = await API.patch(`/admin/toggle-seller-verification/${sellerId}`, { isVerified });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sellers'] });
        },
        onError: (err) => {
            console.error('Toggle verification failed:', err);
            toast.error(err?.response?.data?.message || "Failed to update verification status");
        },
    });
};

// get seller by id
export const useGetSellerById = (sellerId) => {
    return useQuery({
        queryKey: ['sellerDetail', sellerId],
        queryFn: async () => {
            const res = await API.get(`/admin/get-seller/${sellerId}`);
            return res.data;
        },
        enabled: !!sellerId,
    });
};

// verify seller doc
export const useVerifySellerDoc = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, document, action, rejectionReason }) => {
            const res = await API.patch(`/admin/seller-document-verification/${id}/${document}`, { action, rejectionReason });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sellerDetail'] });
        },
        onError: (err) => {
            console.error('Error in verify seller:', err);
            toast.error(err?.response?.data?.message || "Failed to verify");
        },
    });
};

// suspend seller
export const useSuspendSeller = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, reason }) => {
            const response = await API.patch(`/admin/suspend-seller/${id}`, {
                reason,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sellers'] });
            queryClient.invalidateQueries({ queryKey: ['sellerStats'] });
        },
        onError: (err) => {
            console.error('Suspend seller failed:', err);
        },
    });
};

// reactive seller
export const useReactivateSeller = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const response = await API.patch(`/admin/reactivate-seller/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sellers'] });
            queryClient.invalidateQueries({ queryKey: ['sellerStats'] });
        },
        onError: (err) => {
            console.error('Reactivate seller failed:', err);
        },
    });
};