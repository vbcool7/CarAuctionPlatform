
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import API from '../api/axiosInstance'

const BASE = '/page';

// get all pages
export const useGetAllPages = (params = {}) =>
    useQuery({
        queryKey: ['admin-pages', params],
        queryFn: async () => {
            const { data } = await API.get(`${BASE}/pages`, { params });
            return data; 
        },
        placeholderData: keepPreviousData,
    });

// page by id    
export const useGetPageById = (id) =>
    useQuery({
        queryKey: ['admin-page', id],
        queryFn: async () => {
            const { data } = await API.get(`${BASE}/page-detail/${id}`);
            return data.page;
        },
        enabled: !!id,
    });

// create page    
export const useCreatePage = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await API.post(`${BASE}/create-page`, payload);
            return data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Page created');
            qc.invalidateQueries({ queryKey: ['admin-pages'] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to create page');
        },
    });
};

// update page
export const useUpdatePage = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, payload }) => {
            const { data } = await API.patch(`${BASE}/update-page/${id}`, payload);
            return data;
        },
        onSuccess: (data, vars) => {
            toast.success(data.message || 'Page updated');
            qc.invalidateQueries({ queryKey: ['admin-pages'] });
            qc.invalidateQueries({ queryKey: ['admin-page', vars.id] });
            qc.invalidateQueries({ queryKey: ['public-page'] });
            qc.invalidateQueries({ queryKey: ['public-footer-pages'] }); 
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to update page');
        },
    });
};

// delete page
export const useDeletePage = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const { data } = await API.delete(`${BASE}/delete-page/${id}`);
            return data;
        },
        onSuccess: (data) => {
            toast.success(data.message || 'Page deleted');
            qc.invalidateQueries({ queryKey: ['admin-pages'] });
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to delete page');
        },
    });
};