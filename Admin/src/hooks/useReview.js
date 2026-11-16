
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// all reviews
export const useGetAllReviews = (filters = {}) => {
    const { page = 1, limit = 10, search = '', status = '', rating = '', sortBy = 'newest' } = filters;
    return useQuery({
        queryKey: ['adminReviews', page, limit, search, status, rating, sortBy],
        queryFn: async () => {
            const params = { page, limit, sortBy };

            if (search) params.search = search;
            if (status) params.status = status;
            if (rating) params.rating = rating;

            const res = await API.get('/review/get-all-reviews', { params });
            return res.data;
        }
    });
};

const useReviewAction = (path) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id) => (
            await API.patch(`/review/${path}/${id}`)
        ).data,
        onSettled: () => qc.invalidateQueries({ queryKey: ['adminReviews'] }),
    });
};

export const useHideReview = () => useReviewAction('review-hide');
export const useUnhideReview = () => useReviewAction('review-unhide');
export const useFeatureReview = () => useReviewAction('review-feature');
export const useUnfeatureReview = () => useReviewAction('review-unfeature');