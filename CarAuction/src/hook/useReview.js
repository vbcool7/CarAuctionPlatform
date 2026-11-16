
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// ============================================ HOME

// home reviews
export const useGetHomeReviews = () => {
    return useQuery({
        queryKey: ['home-reviews'],
        queryFn: async () => {
            const res = await API.get('/review/public/home-reviews');
            return res.data.reviews;
        },
        staleTime: 60 * 1000,
    });
};

// ============================================ SELLER

// my reviews
export const useGetMyReceivedReviews = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['received-reviews', page, limit],
        queryFn: async () => {
            const res = await API.get('/review/received', { params: { page, limit } });
            return res.data;
        },
        placeholderData: (prev) => prev,
    });
};

// review reply list
export const useReplyFromList = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, text }) => (await API.post(`/review/reply/${id}`, { text })).data,
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ['received-reviews'] });
            qc.invalidateQueries({ queryKey: ['order-review'] });
        },
    });
};

// seller card reviews - public
export const useGetSellerPublicReviews = (sellerId, page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['seller-public-reviews', sellerId, page, limit],
        queryFn: async () => {
            const res = await API.get(`/review/public/seller-reviews/${sellerId}`, { params: { page, limit } });
            return res.data;
        },
        enabled: !!sellerId,
        placeholderData: (prev) => prev,
    });
};

// ============================================ BUYER + SELLER

// get order reviews
export const useGetOrderReview = (orderId) => {
    return useQuery({
        queryKey: ['order-review'],
        queryFn: async () => {
            const res = await API.get(`/review/reviews/${orderId}`);
            return res.data;
        },
        enabled: !!orderId,
    });
};

const useReviewMutation = (orderId, fn) => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: fn,
        onSettled: () => qc.invalidateQueries({ queryKey: ['order-review', orderId] }),
    });
};

// create review
export const useCreateReview = (orderId) => {
    return useReviewMutation(orderId, async (body) => (
        await API.post(`/review/create/${orderId}`, body)).data
    );
};

// update review
export const useUpdateReview = (orderId) => {
    return useReviewMutation(orderId, async ({ id, ...body }) => (
        await API.patch(`/review/update/${id}`, body)).data
    );
};

// reply to review 
export const useReplyToReview = (orderId) => {
    return useReviewMutation(orderId, async ({ id, ...body }) => (
        await API.post(`/review/reply/${id}`, body)).data
    );
};

// my given reviews
export const useGetMyGivenReviews = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ['given-reviews', page, limit],
        queryFn: async () => {
            const res = await API.get('/review/given', { params: { page, limit } });
            return res.data;
        },
        placeholderData: (prev) => prev,
    });
};

export const useUpdateFromList = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, rating, comment }) => (
            await API.patch(`/review/update/${id}`, { rating, comment })
        ).data,
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ['given-reviews'] });
            qc.invalidateQueries({ queryKey: ['order-review'] });
        },
    });
};