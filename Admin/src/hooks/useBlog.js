
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// all blogs
export const useGetAllBlogs = (filters = {}) => {
    const { page = 1, limit = 10, search = '', status = '', category = '', sortBy = 'newest' } = filters;

    return useQuery({
        queryKey: ['adminBlogs', page, limit, search, status, category, sortBy],
        queryFn: async () => {
            const params = { page, limit, sortBy };

            if (search) params.search = search;
            if (status) params.status = status;
            if (category) params.category = category;

            const res = await API.get('/blog/blogs', { params });
            return res.data;
        },
        placeholderData: keepPreviousData,
    });
};

// blog by id
export const useGetBlogById = (id) => {
    return useQuery({
        queryKey: ['adminBlog', id],
        queryFn: async () => {
            const res = await API.get(`/blog/blog/${id}`);
            return res.data;
        },
        enabled: !!id
    });
};

// create blog
export const useCreateBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const res = await API.post('/blog/create-blog', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
        }
    });
};

// update blog
export const useUpdateBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }) => {
            const res = await API.patch(`/blog/update-blog/${id}`, data);
            return res.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
            queryClient.invalidateQueries({ queryKey: ['adminBlog', variables.id] });
        }
    });
};

// delete blog
export const useDeleteBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const res = await API.delete(`/blog/delete/${id}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminBlogs'] });
        }
    });
};

// upload blog content image
export const useUploadBlogContentImage = () => {
    return useMutation({
        mutationFn: async (data) => {
            const res = await API.post('/blog/upload-image', data);
            return res.data;
        }
    });
};