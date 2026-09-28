
import { CheckCircle2, Bell, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import { UseCountDown } from './UseCountDown';

function BidPlacedModal({ vehicle, newBid, previousBid, previousPage, setCurrentPage, onClose }) {

    const { days, hours, mins } = UseCountDown(vehicle.auctionEndDateTime);

    const handleViewAuctionDetails = () => {
        if (setCurrentPage && previousPage) setCurrentPage(previousPage);
        if (onClose) onClose();
    };

    const handleViewMyBids = () => {
        if (setCurrentPage) setCurrentPage('bids');
        if (onClose) onClose();
    };

    useEffect(() => {
        const end = Date.now() + 1500;
        const frame = () => {
            confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.5 } });
            confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.5 } });
            if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
    }, []);

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-[#0B1E3D]/60 backdrop-blur-sm p-4">
    <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Close Button */}
        <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-[#0B1E3D]"
        >
            ✕
        </button>

        <div className="h-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 pt-7 pb-5 text-center border-b border-slate-100">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 ring-8 ring-green-50/70">
                <CheckCircle2 size={34} className="text-green-600" />
            </div>

            <h2 className="text-xl font-bold text-[#0B1E3D]">
                Bid Placed Successfully!
            </h2>

            <p className="mt-1.5 text-sm text-slate-500">
                You're now the highest bidder.
            </p>
        </div>

        {/* Success Message */}
        <div className="mx-6 mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 size={15} className="text-green-600" />
                </div>

                <div>
                    <p className="text-sm font-semibold text-green-800">
                        Congratulations!
                    </p>

                    <p className="mt-1 text-xs leading-5 text-green-700">
                        Your bid of{" "}
                        <span className="font-semibold">
                            AED {newBid.amount?.toLocaleString()}
                        </span>{" "}
                        is the current highest bid
                        {previousBid
                            ? ` — higher than the previous AED ${previousBid.toLocaleString()}.`
                            : "."}
                    </p>
                </div>
            </div>
        </div>

        {/* Bid Summary */}
        <div className="mx-6 mt-4 overflow-hidden rounded-xl border border-slate-200">

            {/* Summary Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-[#0B1E3D]">
                    Your Bid Summary
                </p>

                <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-green-600">
                    Highest Bid
                </span>
            </div>

            <div className="p-4">

                {/* Bid + Countdown */}
                <div className="grid grid-cols-2 gap-3">

                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Your Bid
                        </p>

                        <p className="mt-1 text-base font-bold text-green-600">
                            AED {newBid.amount?.toLocaleString()}
                        </p>
                    </div>

                    <div className="rounded-lg border border-red-100 bg-red-50 p-3">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Auction Ends In
                        </p>

                        <p className="mt-1 text-sm font-bold text-red-600">
                            {String(days).padStart(2, "0")}d{" "}
                            {String(hours).padStart(2, "0")}h{" "}
                            {String(mins).padStart(2, "0")}m
                        </p>
                    </div>

                </div>

                {/* Auction Details */}
                <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Auction
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#0B1E3D]">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>

                    <div className="mt-1.5 flex items-center gap-1.5">
                        <p className="text-xs text-slate-400">
                            VIN: {vehicle.vin}
                        </p>

                        <button
                            type="button"
                            className="flex h-5 w-5 items-center justify-center rounded text-slate-400 transition hover:bg-slate-100 hover:text-[#0B1E3D]"
                        >
                            <Copy size={12} />
                        </button>
                    </div>
                </div>

                {/* Bid Placed */}
                <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Bid Placed On
                    </p>

                    <p className="mt-1 text-sm font-medium text-[#0B1E3D]">
                        {new Date(newBid.createdAt).toLocaleString("en-AE", {
                            dateStyle: "medium",
                            timeStyle: "short",
                            timeZone: "Asia/Dubai",
                        })}
                    </p>
                </div>
            </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-5">
            <button
                onClick={handleViewAuctionDetails}
                className="flex-1 rounded-lg border border-[#0B1E3D] bg-white px-4 py-2.5 text-sm font-semibold text-[#0B1E3D] transition hover:bg-[#0B1E3D] hover:text-white"
            >
                View Auction Details
            </button>

            <button
                onClick={handleViewMyBids}
                className="flex-1 rounded-lg bg-[#D97706] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#B45F05]"
            >
                View My Bids
            </button>
        </div>

</div>
    </div>
</div>
    );
}

export default BidPlacedModal;