
import React from 'react';
import {
    CalendarClock, CheckCircle2, ClipboardCheck, Clock3, CreditCard, FileEdit, Gavel, Info,
    RotateCcw, Trophy, Wallet, X, XCircle,
} from 'lucide-react';

export const getIcon = (type) => {
    switch (type) {
        case 'vehicle_reviewed': return <ClipboardCheck size={18} />;
        case 'vehicle_edited': return <FileEdit size={17} />;
        case 'new_bid_received':
        case 'reserve_price_met':
        case 'reserve_not_met': return <Gavel size={17} />;
        case 'auction_sold':
        case 'auction_won': return <Trophy size={17} />;
        case 'auction_unsold': return <Clock3 size={17} />;
        case 'auction_canceled': return <X size={17} />;
        case 'auction_relisted': return <RotateCcw size={17} />;
        case 'auction_rescheduled': return <CalendarClock size={17} />;

        // payment: meri khareedi hui car (seller as buyer)
        case 'purchase_pending': return <CreditCard size={17} />;
        case 'payment_received': return <CheckCircle2 size={17} />;
        case 'purchase_expired': return <XCircle size={17} />;
        case 'purchase_canceled': return <RotateCcw size={17} />;

        // payment: meri bikri hui car (seller as seller)
        case 'payment_pending': return <Clock3 size={17} />;
        case 'payment_expired': return <XCircle size={17} />;
        case 'order_canceled': return <X size={17} />;

        // payout
        case 'handover_confirmed':
        case 'payout_paid':
        case 'payout_rejected': return <Wallet size={17} />;

        default: return <Info size={17} />;
    }
};

export const getIconStyle = (type) => {
    switch (type) {
        case 'vehicle_reviewed': return 'bg-amber-50 text-amber-600';
        case 'vehicle_edited':
        case 'new_bid_received':
        case 'auction_rescheduled': return 'bg-blue-50 text-blue-600';
        case 'reserve_price_met':
        case 'auction_sold':
        case 'auction_won':
        case 'auction_relisted':
        case 'payment_received':
        case 'handover_confirmed':
        case 'payout_paid': return 'bg-green-50 text-green-600';
        case 'auction_unsold':
        case 'purchase_pending':
        case 'payment_pending': return 'bg-orange-50 text-orange-600';
        case 'reserve_not_met':
        case 'payout_rejected': return 'bg-amber-50 text-amber-600';
        case 'auction_canceled':
        case 'purchase_expired':
        case 'purchase_canceled':
        case 'payment_expired':
        case 'order_canceled': return 'bg-red-50 text-red-600';
        default: return 'bg-slate-50 text-slate-600';
    }
};

export const NOTIFICATION_REDIRECT_MAP = {
    vehicle_reviewed: 'my-vehicles',
    vehicle_edited: 'my-vehicles',
    new_bid_received: 'my-auctions',
    reserve_price_met: 'my-auctions',
    auction_unsold: 'my-auctions',
    reserve_not_met: 'my-auctions',
    auction_canceled: 'my-auctions',
    auction_relisted: 'my-auctions',
    auction_rescheduled: 'my-auctions',

    // meri bikri hui car
    auction_sold: 'sales-history',
    payment_pending: 'sales-history',
    payment_expired: 'sales-history',
    order_canceled: 'sales-history',

    // meri khareedi hui car (Pay Now yahin hai)
    auction_won: 'my-purchases',
    purchase_pending: 'my-purchases',
    payment_received: 'my-purchases',
    purchase_expired: 'my-purchases',
    purchase_canceled: 'my-purchases',

    // payout
    handover_confirmed: 'payouts',
    payout_paid: 'payouts',
    payout_rejected: 'payouts',
};