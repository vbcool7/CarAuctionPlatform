
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from "../api/axiosInstance";

// get seller vehicles
export const useGetVehiclesBySeller = (sellerId, page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['vehiclesBySeller', sellerId, page, limit],
        queryFn: async () => {
            const res = await API.get(`/admin/get-seller-vehicles/${sellerId}?page=${page}&limit=${limit}`);
            return res.data;
        },
        enabled: !!sellerId
    });
};

// Get vehicle by ID
export const useGetVehicleById = (vehicleId) => {
     return useQuery({
        queryKey: ['vehicle', vehicleId],
        queryFn: async () => {
            const res = await API.get(`/admin/get-vehicle/${vehicleId}`);
            return res.data;
        },
        enabled: !!vehicleId
    });
};