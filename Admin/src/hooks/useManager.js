
import { useMutation, useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import API from "../api/axiosInstance";

// add new manager
export const useAddNewManager = () => {
    return useMutation({
        mutationKey: ['newManagerAdded'],
        mutationFn: async (managerData) => {
            const res = await API.post('/admin/add-manager', managerData);
            return res.data;
        }
    });
};

// get all managers
export const useGetAllManagers = ({ page = 1, limit = 10, search = "", status = "" }) => {
    return useQuery({
        queryKey: ["managers", page, limit, search, status],

        queryFn: async () => {
            const res = await API.get("/admin/all-managers-list", {
                params: { page, limit, search, status }
            });
            return res.data;
        },

        placeholderData: keepPreviousData
    });
};

// get manager by id
export const useGetManagerById = (id) => {
    return useQuery({
        queryKey: ["manager", id],

        queryFn: async () => {
            const res = await API.get(`/admin/get-manager/${id}`);
            return res.data;
        },

        enabled: !!id
    });
};

// edit manager permssions 
export const useEditManagerPermissions = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, permissions }) => {
            const res = await API.patch(`/admin/edit-manager-permissions/${id}`, { permissions });
            return res.data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['managers'] });
            queryClient.invalidateQueries({ queryKey: ['manager', variables.id] });
        }
    });
};

// update manager status
export const useToggleManagerStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, isActive }) => {
            const res = await API.patch(`/admin/toggle-manager-status/${id}`, { isActive });
            return res.data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['managers'] });
            queryClient.invalidateQueries({ queryKey: ['manager', variables.id] });
        }
    });
};