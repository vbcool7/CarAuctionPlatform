
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// ------------------ Faq Category ------------------

// all faq categories (response: categories, icons, stats)
export const useGetFaqCategories = () => {
    return useQuery({
        queryKey: ['adminFaqCategories'],
        queryFn: async () => {
            const res = await API.get('/faq/categories');
            return res.data;
        },
    });
};

// create faq category
export const useCreateFaqCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const res = await API.post('/faq/category', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminFaqCategories'] });
        },
    });
};

// update faq category (name / icon / isActive)
export const useUpdateFaqCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }) => {
            const res = await API.patch(`/faq/category/${id}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminFaqCategories'] });
            queryClient.invalidateQueries({ queryKey: ['adminFaqs'] });
        },
    });
};

// move faq category up / down
export const useMoveFaqCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, direction }) => {
            const res = await API.patch(`/faq/category-move/${id}`, { direction });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminFaqCategories'] });
        },
    });
};

// delete faq category
export const useDeleteFaqCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const res = await API.delete(`/faq/category/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminFaqCategories'] });
        },
    });
};

// ------------------ Faq ------------------

// all faqs (response: faqs, stats, pagination)
export const useGetAllFaqs = (filters = {}) => {
    const { page = 1, limit = 10, search = '', status = '', categoryId = '' } = filters;

    return useQuery({
        queryKey: ['adminFaqs', page, limit, search, status, categoryId],
        queryFn: async () => {
            const params = { page, limit };

            if (search) params.search = search;
            if (status) params.status = status;
            if (categoryId) params.categoryId = categoryId;

            const res = await API.get('/faq/faqs', { params });
            return res.data;
        },
        placeholderData: keepPreviousData,
    });
};

// faq by id
export const useGetFaqById = (id) => {
    return useQuery({
        queryKey: ['adminFaq', id],
        queryFn: async () => {
            const res = await API.get(`/faq/faq/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};

// create faq
export const useCreateFaq = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const res = await API.post('/faq/create-faq', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminFaqs'] });
            // category cards me faqCount hai
            queryClient.invalidateQueries({ queryKey: ['adminFaqCategories'] });
        },
    });
};

// update faq
export const useUpdateFaq = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }) => {
            const res = await API.patch(`/faq/update-faq/${id}`, data);
            return res.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['adminFaqs'] });
            queryClient.invalidateQueries({ queryKey: ['adminFaq', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['adminFaqCategories'] });
        },
    });
};

// move faq up / down (sirf category ke andar)
export const useMoveFaq = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, direction }) => {
            const res = await API.patch(`/faq/faq-move/${id}`, { direction });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminFaqs'] });
        },
    });
};

// delete faq
export const useDeleteFaq = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const res = await API.delete(`/faq/delete-faq/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminFaqs'] });
            queryClient.invalidateQueries({ queryKey: ['adminFaqCategories'] });
        },
    });
};