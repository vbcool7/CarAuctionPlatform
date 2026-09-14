
import { useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// get all auctions
export const useGetMyAuctions = ({
    tab = 'active',
    page = 1,
    limit = 10,
    search = '',
    auctionType = 'all',
    sortBy = 'newest'
} = {}) => {
    return useQuery({
        queryKey: ['myAuctions', tab, page, limit, search, auctionType, sortBy],
        queryFn: async () => {
            const params = new URLSearchParams({
                tab,
                page,
                limit,
                sortBy
            });

            if (search.trim()) params.append('search', search.trim());
            if (auctionType !== 'all') params.append('auctionType', auctionType);

            const res = await API.get(`/auction/get-my-auctions?${params.toString()}`);
            return res.data;
        },
        placeholderData: keepPreviousData,
    });
};

// get auc by id
export const useGetAuctionDetail = (id) => {
    return useQuery({
        queryKey: ['auctionDetail', id],
        queryFn: async () => {
            const res = await API.get(`/auction/my-auction-detail/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};

// cancel auction
export const useCancelAuction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, reason }) => {
            const res = await API.patch(`/auction/cancel-auction/${id}`, { reason });
            return res.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['myAuctions'] });
            queryClient.invalidateQueries({ queryKey: ['auctionDetail', variables.id] });
        },
    });
};