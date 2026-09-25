
import { useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// ============================================= SELLER

// get my auctions
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

// ============================================= BUYER

// all auctions

// get distinct makes (for filter dropdown)
export const useGetDistinctMakes = () => {
    return useQuery({
        queryKey: ['vehicle-makes'],
        queryFn: async () => {
            const res = await API.get(`/auction/distinct-makes`);
            return res.data;
        },
        staleTime: 1000 * 60 * 10,
    });
};

// get distinct model (for filter dropdown) — cascading on selected make
export const useGetDistinctModel = (make) => {
    return useQuery({
        queryKey: ['vehicle-model', make],
        queryFn: async () => {
            const res = await API.get(`/auction/distinct-model`, { params: { make } });
            return res.data;
        },
        enabled: !!make,
        staleTime: 1000 * 60 * 10,
    });
};

// get all auctions
export const useGetAllAuctions = ({
    tab = 'all', make = '', model = '', year = '', priceRange = '',
    bodyType = '', sortBy = 'newest', search = '', dateFilter = '', page = 1, limit = 20,
} = {}) => {
    return useQuery({
        queryKey: ['allAuctions', tab, make, model, year, priceRange, bodyType, sortBy, search, dateFilter, page, limit],
        queryFn: async () => {
            const params = new URLSearchParams({ tab, page: String(page), limit: String(limit) });

            if (make && make !== 'all') params.append('make', make);
            if (model && model !== 'all') params.append('model', model);
            if (year && year !== 'all') params.append('year', year);
            if (priceRange && priceRange !== 'all') params.append('priceRange', priceRange);
            if (bodyType && bodyType !== 'all') params.append('bodyType', bodyType);
            if (sortBy) params.append('sortBy', sortBy);
            if (search && search.trim()) params.append('search', search.trim());
            if (dateFilter && dateFilter !== 'all') params.append('dateFilter', dateFilter);

            const res = await API.get(`/auction/get-all-auctions?${params.toString()}`);
            return res.data;
        },
        placeholderData: keepPreviousData,
    });
};

// get upcoming dates
export const useGetUpcomingAuctionDates = () => {
    return useQuery({
        queryKey: ['upcomingDates'],
        queryFn: async() => {
            const res = await API.get('/auction/get-upcoming-auction-dates');
            return res.data;
        }
    });
};