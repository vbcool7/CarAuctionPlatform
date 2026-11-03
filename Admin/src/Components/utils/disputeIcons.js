
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

export const DEFAULT_ICON_KEY = 'alert';

export const getDisputeIcon = (key) => DISPUTE_ICONS[key] || DISPUTE_ICONS[DEFAULT_ICON_KEY];