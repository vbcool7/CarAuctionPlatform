
import { useMutation } from '@tanstack/react-query';
import API from '../api/axiosInstance';

const downloadPdf = async (url, filename) => {
    const res = await API.get(url, { responseType: 'blob' });

    const blob = new Blob([res.data], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 1000);

    return res.data;
};

// buyer invoice
export const useDownloadBuyerInvoice = () =>
    useMutation({
        mutationKey: ['download-buyer-invoice'],
        mutationFn: (orderId) =>
            downloadPdf(
                `/invoice/get-invoice/${orderId}`,
                `invoice-${orderId}.pdf`
            ),
    });

// seller sale statement
export const useDownloadSellerSaleStatement = () =>
    useMutation({
        mutationKey: ['download-seller-sale-statement'],
        mutationFn: (orderId) =>
            downloadPdf(
                `/invoice/get-sale-statement/${orderId}`,
                `sale-statement-${orderId}.pdf`
            ),
    });