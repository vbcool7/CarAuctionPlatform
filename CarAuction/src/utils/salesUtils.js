
// Sales History + Detail ke shared helpers (sab UAE time me)

const TZ = 'Asia/Dubai';

export const money = (n) =>
    `AED ${Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

export const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: TZ }) : '—';

export const fmtTime = (d) =>
    d ? new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: TZ }) : '';

export const fmtDateTime = (d) => (d ? `${fmtDate(d)}, ${fmtTime(d)}` : '—');

export const imgOf = (vehicle) => {
    const first = vehicle?.images?.[0];
    if (!first) return '';
    return typeof first === 'string' ? first : first.url || first.secure_url || '';
};

export const pretty = (s) =>
    s ? String(s).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '—';

export const STATUS_META = {
    pending: { label: 'Pending', cls: 'bg-orange-100 text-orange-700' },
    sold: { label: 'Sold', cls: 'bg-blue-100 text-blue-700' },
    completed: { label: 'Completed', cls: 'bg-green-100 text-green-700' },
    expired: { label: 'Expired', cls: 'bg-red-100 text-red-700' },
    cancelled: { label: 'Cancelled', cls: 'bg-gray-100 text-gray-600' },
};

export const SOURCE_LABEL = { auction: 'Auction', buy_now: 'Buy Now' };

export const PAYOUT_LABEL = {
    on_hold: 'On hold (waiting for handover)',
    available: 'Available to request',
    requested: 'Requested',
    paid: 'Paid',
    canceled: 'Canceled',
};