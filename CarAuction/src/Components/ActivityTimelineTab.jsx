
import {
    Trophy,
    CreditCard,
    CheckCircle2,
    CarFront,
    Clock,
    XCircle,
    Circle,
} from "lucide-react";

const formatDateTime = (value) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return null;

    return date.toLocaleString("en-GB", {
        timeZone: "Asia/Dubai",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

function ActivityTimelineTab({ order }) {
    if (!order) {
        return (
            <p className="text-sm text-slate-500 text-center py-8">
                Activity information is not available.
            </p>
        );
    }

    const isPaid = order.status === "paid";
    const isPending = order.status === "pending_payment";
    const handoverStatus = order.handover?.status;
    const isHandedOver = handoverStatus === "confirmed";

    const paymentDate =
        order.paidAt ||
        order.payment?.paidAt ||
        order.paymentCompletedAt;

    const handoverDate =
        order.handover?.confirmedAt ||
        order.handover?.completedAt;

    const events = [
        {
            id: "won",
            title: "Auction Won",
            description: "You successfully won this vehicle.",
            date: order.wonAt || order.createdAt,
            completed: true,
            icon: Trophy,
        },
        {
            id: "payment",
            title: isPaid ? "Payment Completed" : "Payment Pending",
            description: isPaid
                ? "Your payment has been confirmed."
                : "Complete your payment to proceed with the purchase.",
            date: isPaid ? paymentDate : null,
            completed: isPaid,
            pending: isPending,
            icon: isPaid ? CheckCircle2 : CreditCard,
        },
        {
            id: "handover",
            title: isHandedOver
                ? "Vehicle Handed Over"
                : "Vehicle Handover",
            description: isHandedOver
                ? "The vehicle handover has been confirmed."
                : isPaid
                    ? "Your payment is complete. Vehicle handover is awaiting confirmation."
                    : "Handover will proceed after payment is completed.",
            date: isHandedOver ? handoverDate : null,
            completed: isHandedOver,
            pending: isPaid && !isHandedOver,
            icon: CarFront,
        },
    ];

    if (
        ["expired", "cancelled", "canceled"].includes(
            String(order.status).toLowerCase()
        )
    ) {
        events.push({
            id: "closed",
            title: order.status.toLowerCase() === "expired"
                ? "Order Expired"
                : "Order Cancelled",
            description: order.reason || "This order is no longer active.",
            date: order.updatedAt,
            completed: true,
            failed: true,
            icon: XCircle,
        });
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
            <div className="mb-7">
                <h3 className="text-base font-bold text-slate-900">
                    Activity Timeline
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                    Track the progress of your vehicle purchase.
                </p>
            </div>

            <div className="relative">
                {events.map((event, index) => {
                    const Icon = event.icon;
                    const isLast = index === events.length - 1;

                    return (
                        <div
                            key={event.id}
                            className="relative flex gap-4 pb-8 last:pb-0"
                        >
                            {!isLast && (
                                <div
                                    className={`absolute left-[19px] top-10 bottom-0 w-0.5 ${
                                        event.completed
                                            ? "bg-[#D97706]/40"
                                            : "bg-slate-200"
                                    }`}
                                />
                            )}

                            <div
                                className={`relative z-10 w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${
                                    event.failed
                                        ? "bg-red-50 text-red-500"
                                        : event.completed
                                            ? "bg-[#D97706]/10 text-[#D97706]"
                                            : "bg-slate-100 text-slate-400"
                                }`}
                            >
                                <Icon size={19} />
                            </div>

                            <div className="flex-1 min-w-0 pt-0.5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h4 className="text-sm font-semibold text-slate-900">
                                        {event.title}
                                    </h4>

                                    <span
                                        className={`text-[11px] font-medium px-2 py-1 rounded-full ${
                                            event.failed
                                                ? "bg-red-50 text-red-600"
                                                : event.completed
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        {event.failed
                                            ? "Closed"
                                            : event.completed
                                                ? "Completed"
                                                : "Pending"}
                                    </span>
                                </div>

                                <p className="text-sm text-slate-500 leading-5 mt-1">
                                    {event.description}
                                </p>

                                {formatDateTime(event.date) && (
                                    <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                                        <Clock size={13} />
                                        {formatDateTime(event.date)}
                                        <span>· Dubai time</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ActivityTimelineTab;