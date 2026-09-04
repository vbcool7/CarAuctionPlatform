
import React from 'react';
import { Filter, Download, Trophy } from 'lucide-react';
import { formatLabel, formatPrice } from '../../utils/formatter';

function AuctionsBidsTab({ bids }) {

  if (!bids) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-5 py-4 border-b border-slate-200">
        <h3 className="text-[15px] font-semibold text-[#0B1E3D]">
          All Bids ({bids.length})
        </h3>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50">
            <Download size={14} />
            Download List
          </button>

          <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium border border-slate-200 rounded-lg hover:bg-slate-50">
            <Filter size={14} />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      {bids.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-slate-400">
          No bids yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-5 py-3 font-medium min-w-20">SN</th>
                <th className="px-4 py-3 font-medium min-w-50">Bidder</th>
                <th className="px-4 py-3 font-medium min-w-30">Bid Amount</th>
                <th className="px-4 py-3 font-medium min-w-40">Bid Time</th>
                <th className="px-4 py-3 font-medium min-w-30">Bidder Type</th>
                <th className="px-4 py-3 font-medium min-w-30">Status</th>
              </tr>
            </thead>

            <tbody>
              {bids.map((bid, index) => (
                <tr
                  key={bid._id}
                  className="border-b last:border-0 border-slate-100 hover:bg-slate-50"
                >

                  {/* SN */}
                  <td className="px-5 py-4">
                    {index === 0 ? (
                      <Trophy size={18} className="text-amber-500" />
                    ) : index === 1 ? (
                      <Trophy size={18} className="text-slate-400" />
                    ) : index === 2 ? (
                      <Trophy size={18} className="text-orange-700" />
                    ) : (
                      <span className="text-slate-400 font-medium ml-1.5">
                        {index + 1}
                      </span>
                    )}
                  </td>

                  {/* Bidder */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">

                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold border border-blue-200">
                        {bid.bidder?.name?.charAt(0).toUpperCase() || "?"}
                      </div>

                      <div className="flex flex-col">
                        <div className="font-medium text-[#0B1E3D]">
                          {bid.bidder?.name || "Unknown Bidder"}
                        </div>

                        <div className="text-xs text-slate-400">
                          {bid.bidId}
                        </div>
                      </div>

                    </div>
                  </td>

                  {/* Bid Amount */}
                  <td className="px-4 py-4 font-semibold text-[#0B1E3D]">
                    {formatPrice(bid.amount)}
                  </td>

                  {/* Bid Time */}
                  <td className="px-4 py-4">
                    {bid.createdAt ? (
                      <>
                        <div>
                          {new Date(bid.createdAt).toLocaleDateString("en-GB", {
                            timeZone: "Asia/Dubai",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>

                        <div className="text-slate-500 text-[11px] mt-1">
                          {new Date(bid.createdAt).toLocaleTimeString("en-GB", {
                            timeZone: "Asia/Dubai",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </div>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Bidder Type */}
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 rounded-md text-[11px] font-medium border bg-slate-50 text-slate-700 border-slate-200">
                      {formatLabel(bid.bidderType) || "—"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 text-[10px] font-medium rounded-full 
                        ${bid.status === "active"
                          ? "bg-green-100 text-green-700"
                          : bid.status === "outbid"
                            ? "bg-yellow-100 text-yellow-700"
                            : bid.status === "won"
                              ? "bg-purple-100 text-purple-700"
                              : bid.status === "canceled"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-600"
                        }`}
                    >

                      {formatLabel(bid.status) || "—"}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AuctionsBidsTab;