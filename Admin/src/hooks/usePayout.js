
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import API from "../api/axiosInstance";

export const useGetAllPayouts = ({
    page = 1,
    limit = 10,
    status = '',
    search = '',
    amountRange = '',
    startDate = '',
    endDate = '',
}) => {
    return useQuery({
        queryKey: [
            'payouts',
            page,
            limit,
            status,
            search,
            amountRange,
            startDate,
            endDate,
        ],
        queryFn: async () => {
            const res = await API.get('/admin/get-all-payouts', {
                params: {
                    page,
                    limit,
                    status,
                    search,
                    amountRange,
                    startDate,
                    endDate,
                },
            });

            return res.data;
        },
        placeholderData: (previousData) => previousData,
    });
};

// payout detail
export const useGetPayoutDetail = (id) => {
    return useQuery({
        queryKey: ['payout-detail', id],
        queryFn: async () => {
            const res = await API.get(`/admin/payout-detail/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
};

// payout actions
export const useAdminPayoutAction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ type, id, body }) => {
            const map = {
                handover: ['patch', `/admin/confirm-handover/${id}`],
                paid: ['patch', `/admin/mark-payout-paid/${id}`],
                reject: ['patch', `/admin/reject-payout-request/${id}`],
                refund: ['post', `/admin/cancel-refund/${id}`],
            };

            const action = map[type];

            if (!action) {
                throw new Error('Invalid payout action');
            }

            const [method, url] = action;

            const res = method === 'post'
                ? await API.post(url, body)
                : await API.patch(url, body);

            return res.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payouts'] });
            queryClient.invalidateQueries({ queryKey: ['payout-detail'] });
            queryClient.invalidateQueries({ queryKey: ['my-payouts'] });
            queryClient.invalidateQueries({ queryKey: ['my-payout-detail'] });
            queryClient.invalidateQueries({ queryKey: ['my-orders'] });
        },
    });
};