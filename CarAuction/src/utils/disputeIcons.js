
import {
    CreditCard, Package, Truck, RefreshCw, DollarSign, User, MessageSquare,
    AlertCircle, FileText, Shield, Tag,
} from 'lucide-react';

export const DISPUTE_ICONS = {
    'credit-card': CreditCard,
    package: Package,
    truck: Truck,
    refresh: RefreshCw,
    dollar: DollarSign,
    user: User,
    message: MessageSquare,
    alert: AlertCircle,
    file: FileText,
    shield: Shield,
    tag: Tag,
};

export const getDisputeIcon = (key) => DISPUTE_ICONS[key] || DISPUTE_ICONS.alert;

export const STATUS_META = {
    open: { label: 'Open', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
    under_review: { label: 'Under Review', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    resolved: { label: 'Resolved', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-600 border-red-200' },
    closed: { label: 'Closed', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
    withdrawn: { label: 'Withdrawn', cls: 'bg-slate-100 text-slate-500 border-slate-200' },
};

export const OUTCOME_LABEL = {
    refund_buyer: 'The buyer was refunded and the order was canceled.',
    release_seller: 'Decided in the seller’s favour. The payout can continue.',
};

export const EVIDENCE_ACCEPT = 'image/jpeg,image/png,image/webp,application/pdf';
export const MAX_EVIDENCE = 5;
export const MAX_EVIDENCE_MB = 10;

// client side check (backend bhi check karta hai)
export const checkEvidenceFiles = (files) => {
    if (files.length > MAX_EVIDENCE) return `You can attach up to ${MAX_EVIDENCE} files`;
    const okTypes = EVIDENCE_ACCEPT.split(',');
    for (const f of files) {
        if (!okTypes.includes(f.type)) return `${f.name}: only JPG, PNG, WEBP or PDF files are allowed`;
        if (f.size > MAX_EVIDENCE_MB * 1024 * 1024) return `${f.name}: file is larger than ${MAX_EVIDENCE_MB} MB`;
    }
    return '';
};