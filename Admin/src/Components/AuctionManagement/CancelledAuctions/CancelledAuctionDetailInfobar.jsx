
// import React from 'react'
// import { XCircle, FileText } from "lucide-react";
// import AuctionsGallery from '../Shared/AuctionsGallery';

// function CancelledAuctionDetailInfobar({ auction }) {
//     if (!auction) return null;

//     return (
//         <div className="bg-white border border-slate-200 rounded-2xl p-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

//                 {/* left Gallery */}
//                 <AuctionsGallery
//                     images={auction.images}
//                     status="cancelled"
//                 />

//                 {/* Right Section */}
//                 <div className="flex flex-col">

//                     {/* Title */}
//                     <h2 className="text-2xl font-bold text-[#0B1E3D]">
//                         {auction.title}
//                     </h2>

//                     {/* Tags */}
//                     <div className="flex flex-wrap gap-2 mt-3 mb-6">
//                         <Tag>{auction.specs.body}</Tag>
//                         <Tag>{auction.specs.color}</Tag>
//                         <Tag>{auction.specs.transmission}</Tag>
//                         <Tag>{auction.specs.fuelType}</Tag>
//                     </div>

//                     {/* Auction Details */}
//                     <div className="grid grid-cols-3 gap-x-8 gap-y-3 text-[13px] mb-8">
//                         <Info label="Auction ID" value={auction.id} />
//                         <Info label="Auction Type" value={auction.type} />

//                         <Info label="VIN" value={auction.vin} />
//                         <Info label="Start Date" value={auction.startDate} />

//                         <Info label="Start Time" value={auction.startTime} />
//                         <Info label="End Time" value={auction.endTime} />

//                         <Info label="Starting Price" value={auction.currentBid} />
//                         <Info label="Reserve Price" value={auction.reserve} />

//                         <Info label="Total Bids" value={auction.bids} />
//                         <Info label="Bidders" value={auction.bidders} />

//                         <Info label="Buy Now Price" value={auction.bidders} />
//                     </div>

//                     {/* Auction Cancellation Details */}
//                     {/* Auction Cancellation Details */}
//                     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//                         {/* Header */}
//                         <div className="flex items-center justify-between border-b border-slate-200 pb-3">
//                             <div>
//                                 <h3 className="text-sm font-semibold text-slate-700">
//                                     Auction Status
//                                 </h3>
//                                 <p className="mt-0.5 text-[11px] text-slate-400">
//                                     Cancellation details
//                                 </p>
//                             </div>

//                             <span className="inline-flex items-center gap-1.5 rounded-md border border-red-100 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
//                                 <XCircle size={13} />
//                                 Cancelled
//                             </span>
//                         </div>

//                         {/* Cancellation Details */}
//                         <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4">
//                             {/* Cancelled Date */}
//                             <div>
//                                 <p className="text-[11px] font-medium text-slate-500">
//                                     Cancelled Date
//                                 </p>
//                                 <p className="mt-1 text-xs font-semibold text-slate-700">
//                                     May 14, 2024 09:30 AM
//                                 </p>
//                             </div>

//                             {/* Cancelled By */}
//                             <div>
//                                 <p className="text-[11px] font-medium text-slate-500">
//                                     Cancelled By
//                                 </p>
//                                 <p className="mt-1 text-xs font-semibold text-slate-700">
//                                     Admin User
//                                 </p>
//                             </div>

//                             {/* Reason */}
//                             <div className="col-span-2">
//                                 <p className="text-[11px] font-medium text-slate-500">
//                                     Reason
//                                 </p>
//                                 <p className="mt-1 text-xs font-semibold text-slate-700">
//                                     Not enough participants
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Footer Action */}
//                         <div className="border-t border-slate-200 pt-3">
//                             <button
//                                 type="button"
//                                 className="inline-flex items-center gap-2 rounded-lg bg-[#0B1E3D] px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#142B50]"
//                             >
//                                 <FileText size={13} />
//                                 View Cancellation Log
//                             </button>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// }

// const Info = ({ label, value }) => (
//     <div className="flex flex-col">
//         <span className="text-slate-500 text-xs">{label}</span>
//         <span className="font-semibold text-[#0B1E3D]">{value || "--"}</span>
//     </div>
// );

// const Tag = ({ children }) => (
//     <span className="px-3 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700">
//         {children}
//     </span>
// );

// export default CancelledAuctionDetailInfobar;