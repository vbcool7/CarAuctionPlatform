
import { Clock, CheckCircle } from "lucide-react";

function BuyerWonAuctionDetailStatusBanner ({ vehicle }) {

  const isCompleted = vehicle.wonStatus === "payment-completed";
  const isPending = vehicle.wonStatus === "payment-pending";
  const isPickup = vehicle.wonStatus === "ready-for-pickup";

  if (isPending) return (
    <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
      <div className="flex items-center gap-3">
        <Clock size={20} className="text-[#D97706]" />
        <div>
          <p className="text-sm font-semibold text-[#D97706]">Payment Pending</p>
          <p className="text-xs text-slate-500">Please complete your payment by May 22, 2024 (2d 14h remaining).</p>
        </div>
      </div>
      <button className="px-4 py-2 text-sm font-semibold bg-[#D97706] text-white rounded-lg hover:bg-amber-600 transition-colors">
        Pay Now
      </button>
    </div>
  );

  if (isCompleted) return (
    <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
      <div className="flex items-center gap-3">
        <CheckCircle size={20} className="text-emerald-600" />
        <div>
          <p className="text-sm font-semibold text-emerald-600">Payment Completed</p>
          <p className="text-xs text-slate-500">Thank You! Your payment was successfully processed on May 20, 2024.</p>
        </div>
      </div>
      <button className="px-2 py-2 text-sm font-semibold border border-slate-200 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors">
        View Invoice
      </button>
    </div>
  );

  if (isPickup) return (
    <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
      <div className="flex items-center gap-3">
        <CheckCircle size={20} className="text-emerald-600" />
        <div>
          <p className="text-sm font-semibold text-emerald-600">Your vehicle is ready for pickup</p>
          <p className="text-xs text-slate-500">Please schedule your pickup within the allowed time.</p>
        </div>
      </div>
      <button className="px-2 py-2 text-sm font-semibold border border-slate-200 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors">
        Schedule Pickup
      </button>
    </div>
  );
};

export default BuyerWonAuctionDetailStatusBanner;