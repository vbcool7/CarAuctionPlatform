
import React from 'react';
import { useGetMySaleDetail } from '../../../hook/useSales';
import { money, fmtDate, fmtTime, fmtDateTime, imgOf, pretty, STATUS_META, SOURCE_LABEL, PAYOUT_LABEL } from '../../../utils/salesUtils';

const iconByState = {
    done: 'bg-green-500 text-white',
    pending: 'bg-orange-400 text-white',
    error: 'bg-red-500 text-white',
    upcoming: 'bg-gray-200 text-gray-400',
};

const iconSymbol = { done: '✓', pending: '⏳', error: '✗', upcoming: '' };

// real order + payout data se timeline
function buildTimeline(s) {
    const p = s.payout;
    const steps = [];

    steps.push({
        title: s.source === 'auction' ? 'Auction Won' : 'Buy Now Started',
        date: s.createdAt,
        description: s.source === 'auction'
            ? 'Auction ended and the winning bidder was selected.'
            : 'A buyer reserved this vehicle.',
        state: 'done',
    });

    if (s.orderStatus === 'pending_payment') {
        steps.push({
            title: 'Awaiting Payment',
            date: null,
            description: `Buyer must pay before ${fmtDateTime(s.paymentDueAt)} (UAE time).`,
            state: 'pending',
        });
        return steps;
    }

    if (s.orderStatus === 'expired') {
        steps.push({
            title: 'Payment Expired',
            date: s.expiredAt,
            description: 'Buyer did not pay in time. The vehicle is unsold and can be relisted by admin.',
            state: 'error',
        });
        return steps;
    }

    steps.push({ title: 'Payment Received', date: s.paidAt, description: 'Buyer payment received.', state: 'done' });

    if (s.orderStatus === 'canceled') {
        steps.push({
            title: 'Sale Cancelled',
            date: s.canceledAt,
            description: 'This sale was cancelled and the buyer was refunded.',
            state: 'error',
        });
        return steps;
    }

    const handoverDone = s.handover?.status === 'confirmed';
    steps.push({
        title: 'Handover Confirmed',
        date: handoverDone ? s.handover.confirmedAt : null,
        description: handoverDone ? 'Vehicle handover was verified.' : 'Waiting for admin to confirm the vehicle handover.',
        state: handoverDone ? 'done' : 'pending',
    });

    const requested = ['requested', 'paid'].includes(p?.status);
    steps.push({
        title: 'Payout Requested',
        date: requested ? p.requestedAt : null,
        description: requested ? 'You requested the payout.' : 'You can request the payout after handover is confirmed.',
        state: requested ? 'done' : 'upcoming',
    });

    const paidOut = p?.status === 'paid';
    steps.push({
        title: 'Payout Completed',
        date: paidOut ? p.paidAt : null,
        description: paidOut ? 'Amount transferred to your bank account.' : 'Amount will be transferred to your bank account.',
        state: paidOut ? 'done' : 'upcoming',
    });

    return steps;
}

const paymentStatusText = {
    pending_payment: 'Pending',
    paid: 'Paid',
    expired: 'Expired',
    canceled: 'Refunded',
};

function Row({ label, value, valueClass = 'font-medium text-gray-800' }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-gray-600">{label}</span>
            <span className={valueClass}>{value}</span>
        </div>
    );
}

function SalesHistoryDetail({ setCurrentPage, salesId }) {

    const { data, isLoading, isError } = useGetMySaleDetail(salesId);
    const sale = data?.sale;

    const back = (
        <button
            onClick={() => setCurrentPage('sales-history')}
            className='flex items-center gap-1 text-xs md:text-sm text-gray-500 hover:text-[#0B1E3D]'
        >
            ← Back to Sales History
        </button>
    );

    if (isLoading) return <div className='pb-6 space-y-6'>{back}<p className='text-sm text-slate-500'>Loading sale details...</p></div>;
    if (isError || !sale) return <div className='pb-6 space-y-6'>{back}<p className='text-sm text-red-600'>Could not load this sale.</p></div>;

    const v = sale.vehicle || {};
    const title = [v.year, v.make, v.model].filter(Boolean).join(' ') || 'Vehicle';
    const image = imgOf(v);
    const meta = STATUS_META[sale.status] || STATUS_META.cancelled;
    const p = sale.payout;
    const steps = buildTimeline(sale);

    return (
        <div className='pb-6 space-y-6'>

            {back}

            {/* header */}
            <div className='flex flex-col'>
                <h1 className='text-xl md:text-2xl font-bold'>Sales Details</h1>
                <p className='text-xs md:text-sm text-gray-600 p-px'>
                    Order {sale.orderId} · {SOURCE_LABEL[sale.source] || sale.source}
                </p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

                {/* left column */}
                <div className='lg:col-span-2 space-y-6'>

                    {/* vehicle card */}
                    <div className='bg-white rounded-xl border border-gray-200 p-5'>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-5'>
                            <div className='rounded-xl overflow-hidden h-36 w-full sm:w-56 bg-gray-100 shrink-0 border border-gray-100'>
                                {image && <img src={image} alt={title} className='w-full h-full object-cover' />}
                            </div>

                            <div className='flex flex-col justify-between w-full gap-4'>
                                <h2 className='text-lg md:text-xl font-bold text-[#0B1E3D] leading-tight'>{title}</h2>

                                <div className='flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-500'>
                                    <span>Stock ID: <span className='ml-1 font-semibold text-gray-700'>{sale.listingId || '—'}</span></span>
                                    <span className='hidden sm:inline text-gray-300'>•</span>
                                    <span>VIN: <span className='ml-1 font-semibold text-gray-700 tracking-wide'>{v.vin || '—'}</span></span>
                                </div>

                                <div className='grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 pt-4 border-t border-gray-100'>
                                    <div>
                                        <p className='text-[11px] uppercase tracking-wide text-gray-400 font-medium mb-1'>Sale Price</p>
                                        <p className='text-lg font-bold text-[#0B1E3D] leading-none'>{money(sale.amount)}</p>
                                    </div>
                                    <div>
                                        <p className='text-[11px] uppercase tracking-wide text-gray-400 font-medium mb-1'>
                                            {sale.paidAt ? 'Sold On' : 'Started On'}
                                        </p>
                                        <p className='text-sm font-semibold text-gray-800'>{fmtDate(sale.paidAt || sale.createdAt)}</p>
                                        <p className='text-[11px] text-gray-400 mt-0.5'>{fmtTime(sale.paidAt || sale.createdAt)}</p>
                                    </div>
                                    <div className='col-span-2 md:col-span-1'>
                                        <p className='text-[11px] uppercase tracking-wide text-gray-400 font-medium mb-1'>Sale Status</p>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${meta.cls}`}>
                                            {meta.label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Summary */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-[#0B1E3D]">Transaction Summary</h3>
                        </div>

                        <div className="px-4 py-3 space-y-3 text-[13px]">
                            <Row label="Sale Price" value={money(sale.amount)} valueClass="font-semibold text-gray-800" />

                            {p ? (
                                <>
                                    <Row
                                        label={`Platform Fee (${p.commissionPercent}%)`}
                                        value={`-${money(p.commissionAmount)}`}
                                        valueClass="font-semibold text-red-500"
                                    />
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <span className="font-semibold text-gray-800">Payout Amount</span>
                                        <span className="font-bold text-green-600">{money(p.netAmount)}</span>
                                    </div>
                                </>
                            ) : (
                                <p className="pt-2 border-t border-gray-100 text-xs text-gray-500">
                                    Payout details will appear after the buyer's payment is received.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white border border-gray-200 rounded-xl">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-[#0B1E3D]">Payment Information</h3>
                        </div>

                        <div className="px-4 py-3 space-y-3 text-[13px]">
                            <Row label="Buyer" value={sale.buyerName} />
                            <Row label="Buyer Payment" value={paymentStatusText[sale.orderStatus] || '—'} />
                            <Row label="Paid On" value={fmtDateTime(sale.paidAt)} />
                            <Row
                                label="Handover"
                                value={sale.orderStatus === 'paid' ? (sale.handover?.status === 'confirmed' ? 'Confirmed' : 'Pending') : '—'}
                            />
                            <Row label="Payout Status" value={p ? PAYOUT_LABEL[p.status] || pretty(p.status) : '—'} />
                            <Row label="Payout ID" value={p?.payoutId || '—'} />
                            <Row label="Transfer Reference" value={p?.transferReference || '—'} />

                            {p?.status === 'available' && (
                                <button
                                    onClick={() => setCurrentPage('payouts')}
                                    className="mt-1 w-full rounded-lg bg-[#D97706] px-3 py-2 text-xs font-semibold text-white hover:bg-[#B45309]"
                                >
                                    Go to Payouts to request your payout
                                </button>
                            )}
                        </div>
                    </div>

                    {/* time line */}
                    <div className='bg-white rounded-xl border border-gray-100 shadow-sm p-5'>
                        <h3 className='text-sm font-semibold text-gray-800 mb-4'>Timeline</h3>

                        <div>
                            {steps.map((step, i) => (
                                <div key={i} className='flex gap-3'>
                                    <div className='flex flex-col items-center'>
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${iconByState[step.state]}`}>
                                            {iconSymbol[step.state]}
                                        </div>

                                        {i < steps.length - 1 && (
                                            <div className={`w-px flex-1 my-1 ${step.state === 'done' ? 'bg-green-200' : 'bg-gray-200'}`} />
                                        )}
                                    </div>

                                    <div className={i < steps.length - 1 ? 'pb-5' : ''}>
                                        <p className='text-[13px] font-medium text-gray-900'>{step.title}</p>
                                        {step.date && <p className='text-xs text-gray-400'>{fmtDateTime(step.date)}</p>}
                                        <p className='text-sm text-gray-500 mt-0.5'>{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* right column */}
                <div className='space-y-6'>

                    {/* Vehicle Information */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-[#0B1E3D]">Vehicle Information</h3>
                        </div>

                        <div className="px-4 py-3 space-y-3 text-[13px]">
                            <Row label="Make / Model" value={[v.make, v.model].filter(Boolean).join(' ') || '—'} />
                            <Row label="Year" value={v.year || '—'} />
                            <Row label="Body Type" value={pretty(v.bodyType)} />
                            <Row label="Mileage" value={v.mileage != null ? `${Number(v.mileage).toLocaleString('en-US')} km` : '—'} />
                            <Row label="Transmission" value={pretty(v.transmission)} />
                            <Row label="Fuel Type" value={pretty(v.fuelType)} />
                            <Row label="Color" value={pretty(v.exteriorColor)} />
                            <Row label="Condition" value={pretty(v.overallCondition)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SalesHistoryDetail;