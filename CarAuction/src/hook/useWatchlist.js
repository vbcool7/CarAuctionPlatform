
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../api/axiosInstance';
import useAuthStore from '../store/useAuthStore';

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

// ids of my watchlisted vehicles (only when logged in)
export const useGetWatchlistIds = () => {
    const token = useAuthStore((s) => s.token);

    return useQuery({
        // token key mein: logout/login pe doosre user ki watchlist cache nahi dikhegi
        queryKey: ['watchlistIds', token],
        queryFn: async () => {
            const res = await API.get('/watchlist/get-my-watchlist-ids');
            return res.data.ids;
        },
        enabled: !!token,
        staleTime: 5 * 60 * 1000,
        select: (ids) => new Set(ids),
    });
};

// toggle watchlist
// export const useToggleWatchlist = () => {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async (vehicleId) => {
//             const res = await API.post('/watchlist/toggle-watchlist', { vehicleId });
//             return res.data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['watchlist'] });
//             queryClient.invalidateQueries({ queryKey: ['allAuctions'] });
//             queryClient.invalidateQueries({ queryKey: ['auctionDetail'] });
//             queryClient.invalidateQueries({ queryKey: ['publicVehicles'] });
//         },
//     });
// };

export const useToggleWatchlist = () => {

    const queryClient = useQueryClient();
    const token = useAuthStore((s) => s.token);

    return useMutation({
        mutationFn: async (vehicleId) => {
            const res = await API.post('/watchlist/toggle-watchlist', { vehicleId });
            return res.data;
        },
        onSuccess: (data, vehicleId) => {
            // heart turant flip ho, refetch ka wait nahi
            queryClient.setQueryData(['watchlistIds', token], (old = []) =>
                data.action === 'added'
                    ? [...new Set([...old, String(vehicleId)])]
                    : old.filter((id) => id !== String(vehicleId))
            );

            queryClient.invalidateQueries({ queryKey: ['watchlist'] });
            queryClient.invalidateQueries({ queryKey: ['publicAuctionDetail'] });
            queryClient.invalidateQueries({ queryKey: ['allAuctions'] });
            queryClient.invalidateQueries({ queryKey: ['auctionDetail'] });
            queryClient.invalidateQueries({ queryKey: ['publicVehicles'] });
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
            queryClient.invalidateQueries({ queryKey: ['watchlistIds'] });
        },
    });
};