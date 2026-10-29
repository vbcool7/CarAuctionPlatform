
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../api/axiosInstance";

export const useGetAllSupportTickets = ({
    status = 'all',
    priority = 'all',
    search = '',
    userType = 'all',
    page = 1,
    limit = 10,
    sortBy = 'newest',
    startDate = '',
    endDate = '',
} = {}) => {
    return useQuery({
        queryKey: ['adminSupportTickets', { status, priority, search, userType, page, limit, sortBy, startDate, endDate },],
        queryFn: async () => {
            const res = await API.get('/admin/get-all-tickets', {
                params: { status, priority, search, userType, page, limit, sortBy, startDate, endDate },
            });

            return res.data;
        },
        placeholderData: (previousData) => previousData,
    });
};

export const useGetSupportTicketById = (id) => {
    return useQuery({
        queryKey: ['supportTicketDetail', id],
        queryFn: async () => {
            const res = await API.get(`/admin/ticket-detail/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};

export const useUpdateSupportTicketStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ supportId, status }) => {
            const res = await API.patch(`/admin/update-ticket-status/${supportId}`, { status });
            return res.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['adminSupportTickets'] });
            queryClient.invalidateQueries({ queryKey: ['supportTicketDetail'] });
        },
    });
};

export const useGetAllCallRequests = (
    page = 1,
    limit = 10,
    search = "",
    status = "",
    userType = "",
    startDate = "",
    endDate = "",
    sortBy = "newest"
) => {
    return useQuery({
        queryKey: ["call-requests", page, limit, search, status, userType, startDate, endDate, sortBy,],
        queryFn: async () => {
            const res = await API.get("/admin/get-all-call-requests", {
                params: { page, limit, search, status, userType, startDate, endDate, sortBy, },
            });
            return res.data;
        },
        placeholderData: (previousData) => previousData,
    });
};

export const useGetCallRequestById = (id) => {
    return useQuery({
        queryKey: ["call-request-detail", id],
        queryFn: async () => {
            const res = await API.get(`/admin/call-request-detail/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};

export const useUpdateCallRequestStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }) => {
            const res = await API.patch(`/admin/update-call-request-status/${id}`, { status });
            return res.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["call-requests"], });
            queryClient.invalidateQueries({ queryKey: ["call-request-detail", variables.id], });
        },
    });
};