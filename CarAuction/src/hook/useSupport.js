
import { useMutation, useQuery } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// create support
export const useCreateSupportTicket = () => {
    return useMutation({
        mutationKey: ['createTicket'],
        mutationFn: async (formData) => {
            const res = await API.post('/support/create-ticket', formData);
            return res.data
        }
    });
};

// my tickets
export const useGetMySupportTickets = ({
    status = "",
    search = "",
    page = 1,
    limit = 10,
    sortBy = "newest",
} = {}) => {
    return useQuery({
        queryKey: ["myTickets", { status, search, page, limit, sortBy }],
        queryFn: async () => {
            const res = await API.get("/support/my-tickets", {
                params: { status, search, page, limit, sortBy },
            });

            return res.data;
        },
        placeholderData: (previousData) => previousData,
    });
};

// request a call
export const useCreateRequestedCall = () => {
    return useMutation({
        mutationFn: async (formData) => {
            const res = await API.post('/support/request-call', formData);
            return res.data;
        },
    });
};

// my call reqs
export const useGetMyCallRequests = ({
    status = '',
    search = '',
    page = 1,
    limit = 10,
    sortBy = 'newest',
} = {}) => {
    return useQuery({
        queryKey: ['myCallRequests', { status, search, page, limit, sortBy }],
        queryFn: async () => {
            const res = await API.get('/support/my-call-requests', {
                params: { status, search, page, limit, sortBy },
            });

            return res.data;
        },
        placeholderData: (previousData) => previousData,
    });
};