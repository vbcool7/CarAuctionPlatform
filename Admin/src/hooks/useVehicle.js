
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from "../api/axiosInstance";

// get all vehicles
export const useGetAllVehicles = (page = 1, limit = 10, status = 'all-requests') => {
    return useQuery({
        queryKey: ['vehicles', page, limit, status],
        queryFn: async () => {
            const res = await API.get(`/admin/all-vehicles-list?page=${page}&limit=${limit}&status=${status}`);
            return res.data;
        },
        keepPreviousData: true,
    });
};

// review vehicle
export const useReviewVehicle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['reviewVehicle'],
        mutationFn: async ({ id, action, rejectionReason }) => {
            const res = await API.patch(`/admin/vehicle-review/${id}`, {
                action,
                rejectionReason
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        }
    });
};

// Get vehicle by ID
export const useGetVehicleById = (id) => {
    return useQuery({
        queryKey: ['vehicle', id],
        queryFn: async () => {
            const res = await API.get(`/admin/get-vehicle/${id}`);
            return res.data;
        },
        enabled: !!id
    });
};

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

// get vehicle approval summary
export const useGetVehicleApprovalSummary = () => {
    return useQuery({
        queryKey: ['vehicleApprovalSummary'],
        queryFn: async () => {
            const res = await API.get('/admin/vehicle-approval-summary');
            return res.data;
        }
    });
};