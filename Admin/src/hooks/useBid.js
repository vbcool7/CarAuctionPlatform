
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from "../api/axiosInstance";
import toast from "react-hot-toast";

export const useGetAllBids = (page=1, limit=10) => {
    return useQuery({
        queryKey: ['allBids', page, limit],
        queryFn: async() => {
            const res = await API.get(`/admin/all-bids?page=${page}&limit=${limit}`)
            return res.data;
        },
        keepPreviousData: true,
    });
};