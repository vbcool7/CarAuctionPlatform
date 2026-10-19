
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { formatDateTime } from "../../../utils/formatters";

function BuyerWonAuctionDetailStatusBanner({ order, wonStatus, onPay, paying }) {

  if (wonStatus === 'payment-pending') return (
    <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
      <div className="flex items-center gap-3">
        <Clock size={20} className="text-[#D97706]" />
        <div>
          <p className="text-sm font-semibold text-[#D97706]">Payment Pending</p>
          <p className="text-xs text-slate-500">Complete your payment by {formatDateTime(order.paymentDueAt)}.</p>
        </div>
      </div>
      
      <button onClick={onPay} disabled={paying}
        className="px-4 py-2 text-sm font-semibold bg-[#D97706] text-white rounded-lg hover:bg-amber-600 disabled:opacity-50">
        {paying ? 'Opening...' : 'Pay Now'}
      </button>
    </div>
  );

  if (wonStatus === 'payment-completed' || wonStatus === 'handed-over') return (
    <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
      <CheckCircle size={20} className="text-emerald-600" />
      <div>
        <p className="text-sm font-semibold text-emerald-600">
          {wonStatus === 'handed-over' ? 'Vehicle handed over' : 'Payment Completed'}
        </p>
        <p className="text-xs text-slate-500">
          {wonStatus === 'handed-over'
            ? 'Handover has been confirmed.'
            : `Payment received on ${formatDateTime(order.paidAt)}. Waiting for handover confirmation.`}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
      <XCircle size={20} className="text-slate-500" />
      <div>
        <p className="text-sm font-semibold text-slate-600">Payment window ended</p>
        <p className="text-xs text-slate-500">This order expired on {formatDateTime(order.expiredAt)}.</p>
      </div>
    </div>
  );
}

export default BuyerWonAuctionDetailStatusBanner;