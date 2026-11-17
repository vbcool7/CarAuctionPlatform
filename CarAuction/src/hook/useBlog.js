
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// =================================================== PUBLIC 

export const useGetPublicBlogs = (filters = {}) => {
    const { page = 1, limit = 9, category = '', search = '' } = filters;

    return useQuery({
        queryKey: ['publicBlogs', page, limit, category, search],
        queryFn: async () => {
            const params = { page, limit };
            if (category) params.category = category;
            if (search) params.search = search;

            const res = await API.get('/blog/public/blogs', { params });
            return res.data;
        },
        placeholderData: keepPreviousData,
    });
};

export const useGetPublicBlogBySlug = (slug) => {
    return useQuery({
        queryKey: ['publicBlog', slug],
        queryFn: async () => {
            const res = await API.get(`/blog/public/blog/${slug}`);
            return res.data;
        },
        enabled: !!slug,
        retry: false, 
    });
};