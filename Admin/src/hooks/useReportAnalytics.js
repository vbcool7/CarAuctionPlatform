
import { useQuery } from '@tanstack/react-query';
import API from '../api/axiosInstance';

// get reports
export const useGetReportAnalytics = (range = 'this_week') => {
    return useQuery({
        queryKey: ['reportAnalytics', range],
        queryFn: async () => {
            const res = await API.get(`/admin/report-analytics?range=${range}`);
            return res.data;
        },
        placeholderData: (previousData) => previousData,
    });
};