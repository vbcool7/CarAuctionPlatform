
import React from 'react';
import { Filter, Download, Trophy } from 'lucide-react';

function LiveAuctionsBidsTab({ auction }) {

  if (!auction) return null;

  const bids = auction.biddersData || [];

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

      {/* table */}
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
                <th className="px-4 py-3 font-medium min-w-30">Bid Time</th>
                <th className="px-4 py-3 font-medium min-w-30">Bid Type</th>
                <th className="px-4 py-3 font-medium min-w-30">Status</th>
              </tr>
            </thead>

            <tbody>
              {bids.map((bid, index) => (
                <tr
                  key={bid.id}
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
                      <span className="text-slate-400 font-medium ml-1.5">{index + 1}</span>
                    )}
                  </td>

                  {/* Bidder Detail */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar Circle */}
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold border border-blue-200">
                        {bid.bidderName.charAt(0).toUpperCase()}
                      </div>

                      {/* Name and Bids */}
                      <div className="flex flex-col">
                        <div className="font-medium text-[#0B1E3D] flex items-center gap-1">
                          {bid.bidderName}
                          {bid.isYou && <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">You</span>}
                        </div>
                        <div className="text-xs text-slate-400">{bid.totalBids} bids</div>
                      </div>
                    </div>
                  </td>

                  {/* Bid Amount */}
                  <td className="px-4 py-4 font-semibold text-[#0B1E3D]">
                    {bid.bidAmount}
                  </td>

                  {/* Bid Time */}
                  <td className="px-4 py-4">
                    <div>{bid.bidDate}</div>
                    <div className="text-slate-400">{bid.bidTime}</div>
                  </td>

                  {/* Bid Type */}
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-md text-[11px] font-medium border
                      ${bid.bidType === 'Manual Bid'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}
                    >
                      {bid.bidType}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-md text-[11px] 
                      ${bid.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-600'}`}>
                      {bid.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      }
    </div>
  )
}

export default LiveAuctionsBidsTab;