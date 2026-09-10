
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import API from "../api/axiosInstance";

// get distinct makes (for filter dropdown)
export const useGetDistinctMakes = () => {
    return useQuery({
        queryKey: ['vehicle-makes'],
        queryFn: async () => {
            const res = await API.get(`/admin/distinct-makes`);
            return res.data;
        },
        staleTime: 1000 * 60 * 10,
    });
};

// get all vehicles
export const useGetAllVehicles = (filters = {}) => {

    const { page = 1, limit = 10, status = 'all-requests', search = '',
        vehicleType = '', make = '', startDate = '', endDate = '',
    } = filters;

    return useQuery({
        queryKey: ['vehicles', page, limit, status, search, vehicleType, make, startDate, endDate],
        queryFn: async () => {
            const params = new URLSearchParams({ page, limit, status });

            if (search) params.set('search', search);
            if (vehicleType) params.set('vehicleType', vehicleType);
            if (make) params.set('make', make);
            if (startDate) params.set('startDate', startDate);
            if (endDate) params.set('endDate', endDate);

            const res = await API.get(`/admin/all-vehicles-list?${params.toString()}`);
            return res.data;
        },
        placeholderData: keepPreviousData,
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