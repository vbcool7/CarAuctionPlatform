
import React, { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock, Loader2, XCircle } from 'lucide-react';
import { formatLabel, formatPrice } from '../utils/formatters';

import { useOrderDetail } from '../hook/usePayment';
import useAuthStore from '../store/useAuthStore';

function PaymentResult() {

    const [params] = useSearchParams();
    const navigate = useNavigate();
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);

    const urlStatus = params.get('status');
    const orderId = params.get('order');
    const isSuccessReturn = urlStatus === 'success';

    useEffect(() => {
        if (!token) navigate('/login', { replace: true });
    }, [token, navigate]);

    const { data, isLoading, isError, dataUpdateCount } = useOrderDetail(orderId, { poll: isSuccessReturn });
    const order = data?.order;

    const dashboardPath = user?.role === 'seller' ? '/seller-dashboard' : '/buyer-dashboard?page=payments';

    const vehicleName = order?.vehicleId
        ? `${order.vehicleId.year ?? ''} ${formatLabel(order.vehicleId.make)} ${formatLabel(order.vehicleId.model)}`.trim()
        : order?.listingId;

    let state;
    if (!orderId || isError) state = 'error';
    else if (isLoading) state = 'loading';
    else if (order?.status === 'paid') state = 'paid';
    else if (order?.status === 'expired' || order?.status === 'canceled') state = 'closed';
    else if (!isSuccessReturn) state = 'cancelled';
    else if (dataUpdateCount >= 15) state = 'slow';
    else state = 'confirming';

    const views = {
        loading: { icon: <Loader2 className="animate-spin text-slate-400" size={48} />, title: 'Loading...', text: '' },
        confirming: { icon: <Loader2 className="animate-spin text-[#D97706]" size={48} />, title: 'Confirming your payment...', text: 'Please do not close this page. This takes a few seconds.' },
        paid: { icon: <CheckCircle2 className="text-emerald-600" size={56} />, title: 'Payment successful', text: `We received your payment for ${vehicleName}. The seller and our team have been notified.` },
        slow: { icon: <Clock className="text-[#D97706]" size={56} />, title: 'Payment is being processed', text: 'Your payment is taking longer than usual to confirm. If money was deducted, the order will update shortly. Check your Payments page in a few minutes.' },
        cancelled: { icon: <XCircle className="text-red-500" size={56} />, title: 'Payment cancelled', text: 'No money was charged. Your vehicle is still reserved until the payment deadline. You can pay again from your Payments page.' },
        closed: { icon: <XCircle className="text-red-500" size={56} />, title: `Order ${order?.status}`, text: 'This order is no longer open for payment.' },
        error: { icon: <XCircle className="text-red-500" size={56} />, title: 'Order not found', text: 'We could not load this order. Check your Payments page.' },
    };

    const v = views[state];

    return (
        <section className="w-full min-h-[60vh] flex items-center justify-center px-4 py-16">
            <div className="max-w-md w-full bg-white border border-slate-100 rounded-2xl shadow-sm p-8 text-center">
                <div className="flex justify-center">{v.icon}</div>
                <h1 className="mt-5 text-2xl font-extrabold text-slate-900">{v.title}</h1>
                {v.text && <p className="mt-2 text-sm text-slate-500">{v.text}</p>}

                {order && state !== 'error' && (
                    <div className="mt-6 text-sm text-left space-y-2 border-t border-slate-100 pt-4">
                        <div className="flex justify-between"><span className="text-slate-500">Order</span><span className="font-medium">{order.orderId}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Vehicle</span><span className="font-medium">{vehicleName}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Amount</span><span className="font-medium">{formatPrice(order.amount)}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="font-medium">{formatLabel(order.status)}</span></div>
                    </div>
                )}

                <Link
                    to={dashboardPath}
                    className="mt-6 inline-block w-full bg-[#0B1E3D] hover:bg-slate-800 text-white text-sm font-bold py-2.5 rounded-lg transition-all"
                >
                    Go to Dashboard
                </Link>
            </div>
        </section>
    )
}

export default PaymentResult;