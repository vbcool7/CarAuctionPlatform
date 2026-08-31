
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from "../api/axiosInstance";
import toast from "react-hot-toast";

export const useGetAllAuctions = (page = 1, limit = 10, status = 'all') => {
    return useQuery({
        queryKey: ['allAuctions', page, limit, status],
        queryFn: async () => {
            const params = new URLSearchParams({ page, limit });
            if (status && status !== 'all') params.append('status', status);
            
            const res = await API.get(`/admin/all-auctions?${params.toString()}`);
            return res.data;
        },
        keepPreviousData: true,
    });
};