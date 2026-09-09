
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from "../api/axiosInstance";
import toast from "react-hot-toast";

// buyer stats
export const useBuyerStats = () => {
    return useQuery({
        queryKey: ['buyerStats'],
        queryFn: async () => {
            const res = await API.get('/admin/buyer-stats');
            return res.data;
        },
    });
};

// add new buyer
export const useAddNewBuyer = () => {
    return useMutation({
        mutationKey: ['newBuyerAdded'],
        mutationFn: async (buyerData) => {
            const res = await API.post('/admin/add-new-buyer', buyerData);
            return res.data;
        }
    });
};

// all buyers list
export const useGetAllBuyers = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['buyers', page, limit],
        queryFn: async () => {
            const res = await API.get(`/admin/all-buyers-list?page=${page}&limit=${limit}`);
            return res.data;
        },
        keepPreviousData: true,
    });
};

// toggle buyer verification - email
export const useToggleBuyerVerification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ buyerId, isVerified }) => {
            const res = await API.patch(`/admin/toggle-buyer-verification/${buyerId}`, { isVerified });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['buyers'] });
        },
        onError: (err) => {
            console.error('Toggle verification failed:', err);
            toast.error(err?.response?.data?.message || "Failed to update verification status");
        },
    });
};

// get buyer by id
export const useGetBuyerById = (id) => {
    return useQuery({
        queryKey: ['buyerDetail', id],
        queryFn: async () => {
            const res = await API.get(`/admin/get-buyer/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};

// verify buyer doc
export const useVerifyBuyerDoc = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, group, action, rejectionReason }) => {
            const res = await API.patch(`/admin/buyer-document-verification/${id}/${group}`, { action, rejectionReason });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['buyers'] });
            queryClient.invalidateQueries({ queryKey: ['buyerDetail'] });
        },
        onError: (err) => {
            console.error('Error in verify buyer:', err);
            toast.error(err?.response?.data?.message || "Failed to verify");
        },
    });
};

// suspend buyer
export const useSuspendBuyer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, reason }) => {
            const response = await API.patch(`/admin/suspend-buyer/${id}`, {
                reason,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['buyers'] });
            queryClient.invalidateQueries({ queryKey: ['buyerStats'] }); // stats-cards bhi turant refresh honi chahiye (Active/Suspended count badlega)
        },
        onError: (err) => {
            console.error('Suspend buyer failed:', err);
        },
    });
};

// reactive buyer
export const useReactivateBuyer = () => {
    return useMutation({
        mutationFn: async (id) => {
            const response = await API.patch(`/admin/reactivate-buyer/${id}`);
            return response.data;
        },
    });
};