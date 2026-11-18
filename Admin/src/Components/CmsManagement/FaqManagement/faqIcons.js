
import {
    BadgeHelp, Car, CreditCard, DollarSign, Ellipsis, FileText, Gavel,
    MessageSquare, RefreshCw, ShieldCheck, Truck, User,
} from 'lucide-react';

export const FAQ_ICONS = {
    'gavel': Gavel,
    'credit-card': CreditCard,
    'truck': Truck,
    'user': User,
    'refresh': RefreshCw,
    'file': FileText,
    'shield': ShieldCheck,
    'car': Car,
    'dollar': DollarSign,
    'message': MessageSquare,
    'help': BadgeHelp,
    'more': Ellipsis,
};

export const getFaqIcon = (key) => FAQ_ICONS[key] || BadgeHelp;