
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// get watchlist
export const useGetMyWatchlist = ({ page = 1, limit = 10, search = '', auctionStatus = 'all', priceType = 'all', auctionType = 'all', } = {}) => {
    return useQuery({
        queryKey: ['watchlist',
            page,
            limit,
            search,
            auctionStatus,
            priceType,
            auctionType,
        ],

        queryFn: async () => {
            const res = await API.get('/watchlist/get-my-watchlist', {
                params: {
                    page,
                    limit,
                    search,
                    auctionStatus,
                    priceType,
                    auctionType,
                },
            });

            return res.data;
        },

        placeholderData: (previousData) => previousData,
    });
};

// toggle watchlist
export const useToggleWatchlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (vehicleId) => {
            const res = await API.post('/watchlist/toggle-watchlist', { vehicleId });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlist'] });
        },
    });
};

// Clear watchlist
export const useClearWatchlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const res = await API.delete('/watchlist/clear-watchlist');
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlist'] });
        },
    });
};