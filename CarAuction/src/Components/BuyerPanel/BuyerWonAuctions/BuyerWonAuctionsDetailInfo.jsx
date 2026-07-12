
import React from 'react';
import { CheckCircle, Truck, Clock, Headphones, ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import BuyerAuctionSellerCard from '../BuyerAuctionSellerCard';
import BuyerContactSupport from '../BuyerSharedComponents/BuyerContactSupport';

function BuyerWonAuctionsDetailInfo({ vehicle }) {

    const isPending = vehicle.wonStatus === "payment-pending";
    const isCompleted = vehicle.wonStatus === "payment-completed";
    const isPickup = vehicle.wonStatus === "ready-for-pickup";

    const winningBid = vehicle.winningBid ?? 120000;
    const premiumRate = vehicle.buyerPremiumRate ?? 0.05;
    const vatRate = vehicle.vatRate ?? 0.05;
    const shipping = vehicle.shippingHandling ?? 2500;
    const premium = Math.round(winningBid * premiumRate);
    const vat = Math.round(premium * vatRate);
    const subtotal = winningBid + premium + vat;
    const total = subtotal + shipping;
    const fmt = (n) => "AED " + Number(n).toLocaleString("en-AE");

    const auctionId = vehicle.auctionId ?? "245678";
    const lotNumber = vehicle.lotNumber ?? "245678";
    const auctionDate = vehicle.auctionDate ?? "May 20, 2024 • 11:00 AM GST";
    const sellerName = vehicle.seller?.name ?? "Al Yousuf Motors";
    const location = vehicle.location ?? "Dubai, UAE";
    const paymentDueDate = vehicle.paymentDueDate ?? "May 22, 2024 • 11:00 AM GST";
    const timeRemaining = vehicle.timeRemaining ?? "2d 14h 30m 15s";

    return (
        <div className="w-full">

            {/* ── PENDING: Auction Details ── */}
            {isPending && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
                    <h2 className="text-base font-bold text-[#0B1E3D] mb-4">Auction Details</h2>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Auction ID</span>
                            <span className="font-medium text-[#0B1E3D]">{auctionId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Lot Number</span>
                            <span className="font-medium text-[#0B1E3D]">{lotNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Auction Date</span>
                            <span className="font-medium text-[#0B1E3D] text-right max-w-[55%]">{auctionDate}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">Seller</span>
                            <span className="font-medium text-[#0B1E3D] flex items-center gap-1">
                                {sellerName}
                                <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Location</span>
                            <span className="font-medium text-[#0B1E3D]">{location}</span>
                        </div>
                    </div>

                    <button className="mt-4 text-xs font-medium text-[#D97706] hover:text-amber-700 flex items-center gap-1">
                        View Auction Details <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
            )}

            {/* ── PENDING: Next Step + Countdown ── */}
            {isPending && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
                    <h2 className="text-base font-bold text-[#0B1E3D] mb-3">Next Step</h2>

                    <p className="text-xs text-slate-500">Complete payment by</p>
                    <p className="text-sm font-medium text-[#0B1E3D] mt-1">{paymentDueDate}</p>

                    <p className="text-xs text-slate-500 mt-4 mb-1">Time Remaining</p>
                    <p className="text-lg font-bold text-[#D97706]">{timeRemaining}</p>

                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                        If payment is not completed within the due date, the vehicle may be offered to the next highest bidder.
                    </p>
                </div>
            )}

            {/* ── COMPLETED: Summary + Invoice ── */}
            {isCompleted && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
                    <h2 className="text-base font-bold text-[#0B1E3D] mb-4">Summary</h2>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-slate-600">
                            <span>Winning Bid</span>
                            <span>{fmt(winningBid)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Buyer Premium ({premiumRate * 100}%)</span>
                            <span>{fmt(premium)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>VAT ({vatRate * 100}% on Buyer Premium)</span>
                            <span>{fmt(vat)}</span>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 my-3" />

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span>{fmt(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Shipping &amp; Handling</span>
                            <span>{fmt(shipping)}</span>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 my-3" />

                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-[#0B1E3D]">Total Paid</span>
                        <span className="text-base font-bold text-[#0B1E3D]">{fmt(total)}</span>
                    </div>

                    <button className="w-full mt-5 py-2.5 border border-[#D97706] text-[#D97706] rounded-lg text-sm font-medium hover:bg-amber-100/20 transition-colors">
                        View Invoice
                    </button>
                </div>
            )}

            {/* ── COMPLETED: Next Step ── */}
            {isCompleted && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
                    <h2 className="text-base font-bold text-[#0B1E3D] mb-3">Next Step</h2>
                    <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-emerald-50 rounded-full shrink-0">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#0B1E3D]">Vehicle Ready for Pickup</p>
                            <p className="text-xs text-slate-500 mt-0.5">The vehicle is ready for pickup.</p>
                            <button className="mt-2 text-xs text-white font-medium bg-[#0B1E3D] border border-[#0B1E3D] rounded-md px-3 py-1.5 hover:scale-95 active:scale-95 transition-all duration-300">
                                View Pickup Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── PICKUP: Next Step ── */}
            {isPickup && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
                    <h2 className="text-base font-bold text-[#0B1E3D] mb-3">Next Step</h2>
                    <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-emerald-50 rounded-full shrink-0">
                            <Truck className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#0B1E3D]">Pick up your vehicle</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Please schedule your pickup and collect your vehicle within the allowed time.
                            </p>
                            <button className="mt-2 text-xs font-medium bg-[#D97706] hover:bg-amber-600 text-white rounded-md px-3 py-1.5 hover:scale-95 active:scale-95 duration-300 transition-all">
                                Schedule Pickup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── PICKUP: Summary + Invoice ── */}
            {isPickup && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
                    <h2 className="text-base font-bold text-[#0B1E3D] mb-4">Summary</h2>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-slate-600">
                            <span>Winning Bid</span>
                            <span>{fmt(winningBid)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Buyer Premium ({premiumRate * 100}%)</span>
                            <span>{fmt(premium)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>VAT ({vatRate * 100}% on Buyer Premium)</span>
                            <span>{fmt(vat)}</span>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 my-3" />

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span>{fmt(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span>Shipping &amp; Handling</span>
                            <span>{fmt(shipping)}</span>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 my-3" />

                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-[#0B1E3D]">Total Paid</span>
                        <span className="text-base font-bold text-[#0B1E3D]">{fmt(total)}</span>
                    </div>

                    <button className="w-full mt-5 py-2.5 border border-[#D97706] text-[#D97706] rounded-lg text-sm font-medium hover:bg-amber-100/30 transition-colors">
                        View Invoice
                    </button>
                </div>
            )}

            {/* ── COMPLETED + PICKUP: Seller Info ── */}
            {(isCompleted || isPickup) && (
                <div className="mb-6">
                    <BuyerAuctionSellerCard vehicle={vehicle} />
                </div>
            )}

            {isPending && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldCheck className="text-blue-500" />
                        <h2 className="font-bold text-[#0B1E3D]">Secure Payment</h2>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">Your payment information is secure with us.</p>
                    <div className="space-y-2 text-sm text-slate-600">
                        <p className="flex items-center gap-2"><Lock size={14} /> Encrypted & Secure Transactions</p>
                        <p className="flex items-center gap-2"><ShieldCheck size={14} /> 100% Safe and Reliable</p>
                    </div>
                </div>
            )}

            {/* ── Need Help ── */}
            {(isCompleted || isPickup || isPending) && (
                <BuyerContactSupport />
            )}
        </div>
    );
}

export default BuyerWonAuctionsDetailInfo;