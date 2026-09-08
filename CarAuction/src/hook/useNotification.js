
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// get all notifications - for notification drop-down page
export const useGetAllNotifications = (page=1, limit=10) => {
    return useQuery({
        queryKey: ['getAllNotifications', page, limit],
        queryFn: async() => {
            const res = await API.get(`/notification/get-all-notifications?page=${page}&limit=${limit}`);
            return res.data;
        }
    });
};

// get all notifications - for full page notification (infinite scroll)
export const useGetAllNotificationsInfinite = (limit = 10, isRead) => {
    return useInfiniteQuery({
        queryKey: ['getAllNotificationsInfinite', limit, isRead],
        queryFn: async ({ pageParam = 1 }) => {
            const params = new URLSearchParams({ page: pageParam, limit });
            if (isRead !== undefined) params.append('isRead', isRead);
            const res = await API.get(`/notification/get-all-notifications?${params}`);
            return res.data;
        },
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            return nextPage <= lastPage.totalPages ? nextPage : undefined;
        },
        initialPageParam: 1,
    });
};

// read notification
export const useReadNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(id) => {
            const res = await API.patch(`/notification/mark-read-notification/${id}`);
            return res.data; 
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getAllNotifications'] });
            queryClient.invalidateQueries({ queryKey: ['getAllNotificationsInfinite'] });
        }
    });
};

// mark all read
export const useMarkAllReadNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async() => {
            const res = await API.patch('/notification/mark-all-read-notifications');
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getAllNotifications'] });
            queryClient.invalidateQueries({ queryKey: ['getAllNotificationsInfinite'] });
        }
    });
};