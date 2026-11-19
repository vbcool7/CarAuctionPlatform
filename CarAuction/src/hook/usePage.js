
import { useQuery } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// get pages
export const useGetPublicPage = (slug) =>
    useQuery({
        queryKey: ['public-page', slug],
        queryFn: async () => {
            const { data } = await API.get(`/page/public/${encodeURIComponent(slug)}`);
            return data.page;
        },
        enabled: !!slug,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        // don't retry on 404, warna "not found" screen der se aati hai
        retry: (count, err) => err?.response?.status !== 404 && count < 1,
    });

// published page for footer
export const useGetPublicFooterPages = () =>
    useQuery({
        queryKey: ['public-footer-pages'],
        queryFn: async () => {
            const { data } = await API.get('/page/public-footer');
            return data.columns;
        },
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
    });