
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { toast } from "react-toastify";
import API from '../api/axiosInstance';

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
export const useSellerVehicles = (page=1, limit=10) => {
    return useQuery({
        queryKey: ['sellerVehicles', page, limit],
        queryFn: async() => {
            const res = await API.get(`/vehicle/get-my-vehicles?page=${page}&limit=${limit}`);
            return res.data;
        },
        keepPreviousData: true,
    });
};

// get vehicle
export const useVehicleDetail = (id) => {
    return useQuery({
        queryKey: ['vehicleDetail', id],
        queryFn: async() => {
            const res = await API.get(`/vehicle/get-vehicle-detail/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};