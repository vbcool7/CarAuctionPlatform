
import { ArrowLeft, Download, Printer, Calendar, FileText } from "lucide-react";

const statusConfig = {

    "payment-completed": {
        title: "Payment Completed",
        badge: { label: "Payment Completed", classes: "bg-emerald-50 text-emerald-600" },
        subtitle: "Your payment has been successfully completed. Thank you!",
        actions: [
            { label: "Download Invoice", icon: <Download size={15} />, onClick: () => { } },
            { label: "Print", icon: <Printer size={15} />, onClick: () => { } },
        ],
    },

    "payment-pending": {
        title: "Payment Pending",
        badge: { label: "Payment Pending", classes: "bg-amber-50 text-[#D97706]" },
        subtitle: "Complete your payment to secure your vehicle.",
        actions: [],
    },

    "ready-for-pickup": {
        title: "Ready for Pickup",
        badge: { label: "Ready for Pickup", classes: "bg-emerald-50 text-emerald-600" },
        subtitle: "Your vehicle is ready for pickup. Please schedule or contact the seller to arrange pickup.",
        actions: [
            { label: "Schedule Pickup", icon: <Calendar size={15} />, onClick: () => { } },
            { label: "Download Documents", icon: <FileText size={15} />, onClick: () => { } },
            { label: "Print", icon: <Printer size={15} />, onClick: () => { } },
        ],
    },
};

const BuyerWonAuctionDetailHeader = ({ vehicle, setCurrentPage }) => {
    
    const config = statusConfig[vehicle.wonStatus];

    return (
        <div className="mb-6">
            <button
                onClick={() => setCurrentPage("won-auctions")}
                className="flex items-center gap-1.5 text-sm text-[#0B1E3D] font-medium hover:opacity-70 transition-opacity mb-3"
            >
                <ArrowLeft size={15} />
                Back to Won Auctions
            </button>

            {/* Title row */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-[#0B1E3D]">{config.title}</h1>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${config.badge.classes}`}>
                            {config.badge.label}
                        </span>
                    </div>
                    <p className="text-sm text-slate-500">{config.subtitle}</p>
                </div>

                {/* Action buttons */}
                {config.actions.length > 0 && (
                    <div className="flex items-center gap-3">
                        {config.actions.map((action, i) => (
                            <button
                                key={i}
                                onClick={action.onClick}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0B1E3D] border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                {action.icon}
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <hr className="mt-4 border-slate-200" />
        </div>
    );
};

export default BuyerWonAuctionDetailHeader;