
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import API from "../api/axiosInstance";
import toast from "react-hot-toast";

// add new seller
export const useAddNewSeller =() => {
    return useMutation({
        mutationKey:['newSellerAdded'],
        mutationFn: async(sellerData) => {
            const res = await API.post('/admin/add-new-seller', sellerData);
            return res.data;
        }
    });
};

// all sellers list
export const useGetAllSellers = (page=1, limit=10) => {
    return useQuery({
        queryKey: ['sellers', page, limit],
        queryFn: async () => {
            const res = await API.get(`/admin/all-sellers-list?page=${page}&limit=${limit}`);
            return res.data;
        },
        keepPreviousData: true, 
    });
};

// toggle seller verification
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
        queryKey: ['seller', sellerId],
        queryFn: async () => {
            const res = await API.get(`/admin/get-seller/${sellerId}`);
            return res.data;
        },
        enabled: !!sellerId,
    });
};