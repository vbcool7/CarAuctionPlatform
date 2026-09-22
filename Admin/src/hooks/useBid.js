
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import API from "../api/axiosInstance";

// bid stats
export const useGetBidStats = () => {
    return useQuery({
        queryKey: ['bidStats'],
        queryFn: async() => {
            const res = await API.get('/admin/bids-stats')
            return res.data;
        }
    });
};

// all bids
// export const useGetAllBids = (page=1, status = 'all', limit=10) => {
//     return useQuery({
//         queryKey: ['allBids', page, status, limit],
//         queryFn: async() => {
//             const res = await API.get(`/admin/all-bids?page=${page}&limit=${limit}&status=${status}`)
//             return res.data;
//         },
//         placeholderData: keepPreviousData,
//     });
// };

// all bids
export const useGetAllBids = (filters = {}) => {

    const {
        page = 1,
        limit = 10,
        status = 'all',
        auctionStatus = 'all',
        bidderType = 'all',
        search = '',
        startDate = '',
        endDate = '',
    } = filters;

    return useQuery({
        queryKey: [
            'allBids',
            page,
            limit,
            status,
            auctionStatus,
            bidderType,
            search,
            startDate,
            endDate
        ],

        queryFn: async () => {
            const params = new URLSearchParams({
                page,
                limit,
                status,
                auctionStatus,
                bidderType
            });

            if (search) params.set('search', search);
            if (startDate) params.set('startDate', startDate);
            if (endDate) params.set('endDate', endDate);

            const res = await API.get(
                `/admin/all-bids?${params.toString()}`
            );

            return res.data;
        },

        placeholderData: keepPreviousData,
    });
};

// bid detail
export const useGetBidDetail = (id) => {
    return useQuery({
        queryKey: ['bidDetail', id],
        queryFn: async() => {
            const res = await API.get(`/admin/bid-detail/${id}`)
            return res.data;
        },
        enabled: !!id,
    });
};