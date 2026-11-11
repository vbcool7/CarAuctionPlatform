
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { STATUS_META } from '../../../utils/disputeIcons';

// order.dispute (buyer) ya sale.dispute (seller) ka shape:
// { role, canRaise, reason, deadline, openDispute{_id,disputeId,status,raisedByMe}|null, myDispute{_id,disputeId,status}|null }
// Order/sale detail page par card. onRaise() modal kholta hai, onView(disputeMongoId) detail page.
function DisputeActionCard({ dispute, onRaise, onView }) {
    if (!dispute) return null;

    const { canRaise, reason, deadline, openDispute, myDispute } = dispute;
    const shown = openDispute || myDispute;
    const meta = shown ? STATUS_META[shown.status] : null;

    // na raise ho sakta hai na koi dispute hai: kuch dikhane ko nahi (reason sirf tab jab useful ho)
    if (!canRaise && !shown) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-[#0B1E3D]">Dispute</h3>
            </div>

            <div className="px-4 py-3 space-y-3 text-[13px]">
                {shown && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-gray-800">{shown.disputeId}</span>
                            {meta && <span className={`px-2 py-0.5 rounded border text-[11px] font-medium ${meta.cls}`}>{meta.label}</span>}
                        </div>
                        {openDispute && !openDispute.raisedByMe && (
                            <p className="flex items-start gap-1.5 text-xs text-amber-700">
                                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                                The other party has raised a dispute on this order. You can respond to it.
                            </p>
                        )}
                        <button
                            type="button"
                            onClick={() => onView(shown._id)}
                            className="w-full rounded-lg border border-[#D97706] py-2 text-xs font-semibold text-[#D97706] hover:bg-amber-50">
                            View Dispute
                        </button>
                    </div>
                )}

                {!shown && canRaise && (
                    <>
                        <p className="text-xs text-gray-500">
                            Problem with the payment or this order? You can raise a dispute
                            {deadline ? ` until ${new Date(deadline).toLocaleDateString('en-GB')}` : ''}.
                        </p>
                        <button
                            type="button"
                            onClick={onRaise}
                            className="w-full rounded-lg bg-[#D97706] py-2 text-xs font-semibold text-white hover:bg-[#B45309]">
                            Raise a Dispute
                        </button>
                    </>
                )}

                {shown && !openDispute && canRaise === false && reason && (
                    <p className="text-[11px] text-gray-400">{reason}</p>
                )}
            </div>
        </div>
    );
}

export default DisputeActionCard;