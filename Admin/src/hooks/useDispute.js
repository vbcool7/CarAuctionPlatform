
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// create cat
export const useCreateDisputeCategory = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (body) => {
            const res = await API.post('/dispute/create-dispute-category', body);
            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['adminDisputeCategories'] });
        },
    });
};

// update category
export const useUpdateDisputeCategory = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...body }) => {
            const res = await API.patch(`/dispute/update-dispute-category/${id}`, body);
            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['adminDisputeCategories'] });
            qc.invalidateQueries({ queryKey: ['adminDisputeCategory'] });
        },
    });
};

// get all catergories
export const useGetDisputeCategories = (filters = {}) => {
    const { page = 1, limit = 10, search = '', status = '', appliesTo = '' } = filters;

    return useQuery({
        queryKey: ['adminDisputeCategories', page, limit, search, status, appliesTo],
        queryFn: async () => {
            const params = { page, limit };

            if (search) params.search = search;
            if (status) params.status = status;
            if (appliesTo) params.appliesTo = appliesTo;

            const res = await API.get('/dispute/dispute-categories', { params });
            return res.data;
        },
        placeholderData: keepPreviousData,
    });
};

// get category detail
export const useGetDisputeCategory = (id) => {
    return useQuery({
        queryKey: ['adminDisputeCategory', id],
        queryFn: async () => {
            const res = await API.get(`/dispute/dispute-category/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};

// get disputes
export const useGetAllDisputes = (filters = {}) => {
    const {
        page = 1,
        limit = 10,
        search = '',
        status = '',
        categoryId = '',
        raisedByRole = '',
        sortBy = 'newest',
        startDate = '',
        endDate = '',
    } = filters;

    return useQuery({
        queryKey: ['adminDisputes', page, limit, search, status, categoryId, raisedByRole, sortBy, startDate, endDate],
        queryFn: async () => {
            const params = { page, limit, sortBy };

            if (search) params.search = search;
            if (status) params.status = status;
            if (categoryId) params.categoryId = categoryId;
            if (raisedByRole) params.raisedByRole = raisedByRole;
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;

            const res = await API.get('/dispute/get-all-disputes', { params });
            return res.data;
        },
        placeholderData: keepPreviousData,
    });
};

// get dispute detail
export const useGetDisputeDetail = (id) => {
    return useQuery({
        queryKey: ['adminDisputeDetail', id],
        queryFn: async () => {
            const res = await API.get(`/dispute/dispute-detail/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};

// after disputeaction - list + detail both refresh
const useRefreshDisputes = () => {
    const qc = useQueryClient();
    return () => {
        qc.invalidateQueries({ queryKey: ['adminDisputes'] });
        qc.invalidateQueries({ queryKey: ['adminDisputeDetail'] });
    };
};

// start dispute review
export const useStartDisputeReview = () => {
    const refresh = useRefreshDisputes();
    return useMutation({
        mutationFn: async (id) => {
            const res = await API.patch(`/dispute/dispute-start-review/${id}`);
            return res.data;
        },
        onSuccess: refresh,
    });
};

// add internal note
export const useAddDisputeNote = () => {
    const refresh = useRefreshDisputes();
    return useMutation({
        mutationFn: async ({ id, note }) => {
            const res = await API.post(`/dispute/dispute-add-note/${id}`, { note });
            return res.data;
        },
        onSuccess: refresh,
    });
};

// dispute resolve
export const useResolveDispute = () => {
    const refresh = useRefreshDisputes();
    return useMutation({
        mutationFn: async ({ id, action, note }) => {
            const res = await API.patch(`/dispute/dispute-resolve/${id}`, { action, note });
            return res.data;
        },
        onSuccess: () => {
            refresh();
        },
    });
};