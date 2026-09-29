
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

// get auction detail
export const useGetBuyerAuctionDetail = (id) => {
    return useQuery({
        queryKey: ['auctionDetail', id],
        queryFn: async () => {
            const res = await API.get(`/auction/get-auction-detail/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};

// get upcoming dates
export const useGetUpcomingAuctionDates = () => {
    return useQuery({
        queryKey: ['upcomingDates'],
        queryFn: async () => {
            const res = await API.get('/auction/get-upcoming-auction-dates');
            return res.data;
        }
    });
};

// get lost auctions
export const useGetLostAuctions = ({ tab = 'all', page = 1, limit = 10 } = {}) => {
    return useQuery({
        queryKey: ['lostAuctions', tab, page, limit],
        queryFn: async () => {
            const res = await API.get('/auction/get-lost-auctions-buyer', {
                params: { tab, page, limit }
            });
            return res.data;
        },
        placeholderData: keepPreviousData,
    });
};

// ============================================= USER

// get live auctions - home
export const useGetHomeLiveAuctions = () => {
    return useQuery({
        queryKey: ['homeLiveAuctions'],
        queryFn: async () => {
            const res = await API.get('/auction/get-live-auctions');
            return res.data;
        },
        staleTime: 1 * 60 * 1000 // 1 min
    });
};

// get solded vehicle - home
export const useGetHomeSoldAuctions = () => {
    return useQuery({
        queryKey: ['homeSoldAuctions'],

        queryFn: async () => {
            const res = await API.get('/auction/get-solded-auctions');
            return res.data;
        },
        staleTime: 1 * 60 * 1000
    });
};

// get all auctions
// export const useGetPublicAuctions = ({
//     status = 'live', page = 1, limit = 10, search = '', sort = 'ending_soon',
//     startFrom = '', startTo = '', category, make, emirate, minPrice, maxPrice, fuelType, endFrom, endTo
// } = {}) => {
//     return useQuery({
//         queryKey: ['publicAuctions', status, page, limit, search, sort, startFrom, startTo, category, make, emirate, minPrice, maxPrice, fuelType, endFrom, endTo],

//         queryFn: async () => {
//             const params = new URLSearchParams({ status, page, limit, sort });

//             if (search.trim()) params.append('search', search.trim());
//             if (startFrom) params.append('startFrom', startFrom);
//             if (startTo) params.append('startTo', startTo);
//             if (category) params.append('category', category);
//             if (make) params.append('make', make);
//             if (emirate) params.append('emirate', emirate);
//             if (minPrice) params.append('minPrice', minPrice);
//             if (maxPrice) params.append('maxPrice', maxPrice);
//             if (fuelType) params.append('fuelType', fuelType);
//             if (endFrom) params.append('endFrom', endFrom);
//             if (endTo) params.append('endTo', endTo);

//             const res = await API.get(`/auction/get-auction-list?${params.toString()}`);
//             return res.data;
//         },
//         placeholderData: keepPreviousData,
//         staleTime: 30_000,
//     });
// };

export const useGetPublicAuctions = ({
    status = 'live', page = 1, limit = 10,
    search = '', sort='',

    startFrom = '', startTo = '', endFrom = '', endTo = '',

    // Vehicle filters
    category,
    make,
    model,
    yearFrom,
    yearTo,
    maxMileage,
    emirate,

    // Price filters
    minPrice,
    maxPrice,

    // Other filters
    transmission,
    fuelType,
    drivetrain,
    color,
    condition
} = {}) => {

    return useQuery({
        queryKey: [
            'publicAuctions',
            status,
            page,
            limit,
            search,
            sort,
            startFrom,
            startTo,
            endFrom,
            endTo,
            category,
            make,
            model,
            yearFrom,
            yearTo,
            maxMileage,
            emirate,
            minPrice,
            maxPrice,
            transmission,
            fuelType,
            drivetrain,
            color,
            condition
        ],

        queryFn: async () => {

            const params = new URLSearchParams({ status, page, limit });

            if (search.trim()) { params.append('search', search.trim());}
            if(sort) params.append('sort', sort);

            if (startFrom) params.append('startFrom', startFrom);
            if (startTo) params.append('startTo', startTo);

            if (endFrom) params.append('endFrom', endFrom);
            if (endTo) params.append('endTo', endTo);

            if (category) params.append('category', category);
            if (make) params.append('make', make);
            if (model) params.append('model', model);

            if (yearFrom) params.append('yearFrom', yearFrom);
            if (yearTo) params.append('yearTo', yearTo);

            if (maxMileage) params.append('maxMileage', maxMileage);

            if (emirate) params.append('emirate', emirate);

            if (minPrice) params.append('minPrice', minPrice);
            if (maxPrice) params.append('maxPrice', maxPrice);

            if (transmission) params.append('transmission', transmission);
            if (fuelType) params.append('fuelType', fuelType);
            if (drivetrain) params.append('drivetrain', drivetrain);
            if (color) params.append('color', color);
            if (condition) params.append('condition', condition);

            const res = await API.get(
                `/auction/get-auction-list?${params.toString()}`
            );

            return res.data;
        },

        placeholderData: keepPreviousData,
        staleTime: 30_000,
    });
};

// get auction detail
export const usePublicAuctionDetail = (id) => {
    return useQuery({
        queryKey: ['publicAuctions', id],

        queryFn: async () => {
            const res = await API.get(`/auction/get-public-auction-detail/${id}`);
            return res.data;
        },

        enabled: !!id,
    });
};

// get upcoming auction dates
export const useGetUpcomingAuctionDatesUserSide = () => {
    return useQuery({
        queryKey: ['upcomingDates'],
        queryFn: async () => {
            const res = await API.get('/auction/get-upcoming-auction-dates');
            return res.data;
        },
        staleTime: 1 * 60 * 1000,
    });
};