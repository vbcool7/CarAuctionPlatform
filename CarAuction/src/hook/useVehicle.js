
import { useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { toast } from "react-toastify";
import API from '../api/axiosInstance';

// =========================== SELLER SIDE

export const useDecodeVin = () => {
    return useMutation({
        mutationKey: ['decodeVin'],
        mutationFn: async (vin) => {
            const res = await API.get(`/vehicle/decode-vin/${vin}`);
            return res.data;
        },
        onError: () => {
            toast.error('VIN decode request failed');
        }
    });
};

export const useAddVehicle = () => {
    return useMutation({
        mutationKey: ['addVehicle'],
        mutationFn: async (vehicleData) => {
            const res = await API.post('/vehicle/add-vehicle', vehicleData);
            return res.data;
        },
        onError: (error) => {
            const message = error?.response?.data?.message || 'Failed to create listing';
            toast.error(message);
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Vehicle listed successfully');
        }
    });
};

// vehicle stats
export const useVehicleStats = () => {
    return useQuery({
        queryKey: ['vehicleStats'],
        queryFn: async () => {
            const res = await API.get('/vehicle/get-vehicle-stats');
            return res.data;
        }
    });
};

// all seller vehicles
export const useSellerVehicles = ({ page = 1, limit = 10, search = '', status = 'all', auctionType = 'all', sortBy = 'newest' } = {}) => {
    return useQuery({
        queryKey: ['sellerVehicles', page, limit, search, status, auctionType, sortBy],
        queryFn: async () => {
            const params = new URLSearchParams({ page, limit, sortBy });

            if (search.trim()) params.append('search', search.trim());
            if (status !== 'all') params.append('status', status);
            if (auctionType !== 'all') params.append('auctionType', auctionType);

            const res = await API.get(`/vehicle/get-my-vehicles?${params.toString()}`);
            return res.data;
        },
        placeholderData: keepPreviousData,
    });
};

// get vehicle
export const useVehicleDetail = (id) => {
    return useQuery({
        queryKey: ['vehicleDetail', id],
        queryFn: async () => {
            const res = await API.get(`/vehicle/get-vehicle-detail/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};

// =========================== USER SIDE

// get categories
export const useGetCategoryCounts = () => {
    return useQuery({
        queryKey: ['categoryCounts'],
        queryFn: async () => {
            const res = await API.get('/vehicle/category-counts');
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
    });
};

// get public vehicles
export const useGetPublicVehicles = (params) => {
    return useQuery({
        queryKey: ['publicVehicles', params],
        queryFn: async () => {
            const res = await API.get('/vehicle/get-public-vehicles', { params });
            return res.data;
        },
        placeholderData: keepPreviousData,
    });
};

// get filter options 
export const useGetFilterOptions = () => {
    return useQuery({
        queryKey: ['vehicleFilterOptions'],
        queryFn: async () => {
            const res = await API.get('/vehicle/get-filter-options');
            return res.data;
        },
        staleTime: 10 * 60 * 1000,
    });
};

// get public stats
export const useGetPublicStats = () => {
    return useQuery({
        queryKey: ['publicStats'],
        queryFn: async () => {
            const res = await API.get('/vehicle/get-public-stats');
            return res.data;
        },
    });
};