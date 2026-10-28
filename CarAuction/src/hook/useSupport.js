
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
    });
};