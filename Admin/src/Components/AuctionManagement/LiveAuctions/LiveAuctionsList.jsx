
import React from 'react';
import { Eye, MoreVertical } from 'lucide-react';
import { allAuctionData } from '../../Data';

function LiveAuctionsList({ setCurrentPage, onSelectVehicle }) {
  return (
    <div>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        {/* use table-fixed, eay to control width */}
        <table className="w-full text-left table-fixed">
          <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4 w-75">Auction / Vehicle</th>
              <th className="px-6 py-4 w-35 text-center">Current Bid</th>
              <th className="px-6 py-4 w-30">Bids</th>
              <th className="px-6 py-4 w-40">Participants</th>
              <th className="px-6 py-4 w-38">Time Left</th>
              <th className="px-6 py-4 w-30">Status</th>
              <th className="px-6 py-4 w-25">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-amber-50">
            {allAuctionData.filter((item) => item.status === "Live").map((auction) => (
              <tr
                key={auction.id}
                className="hover:bg-gray-50/50 transition-colors">

                {/* vehicle detail */}
                <td className="px-6 py-4 flex items-center gap-4">
                  <img
                    src={auction.imageUrl}
                    alt={auction.title}
                    className="w-16 h-10 object-cover rounded-lg shrink-0" />
                  <div className="truncate">
                    <div className="text-gray-900 font-bold text-sm truncate">{auction.title}</div>
                    <div className="text-[11px] text-gray-500">VIN: {auction.vin}</div>
                    <div className="text-[11px] text-gray-400 truncate">{auction.specs.body} • {auction.specs.color} • {auction.specs.transmission}</div>
                  </div>
                </td>

                {/* current bid */}
                <td className="px-6 py-4 ">
                  <div className="font-bold text-green-600 text-sm">{auction.currentBid}</div>
                  <div className="text-[11px] text-slate-400">Reserve: {auction.reserve}</div>
                </td>

                {/* bids */}
                <td className="px-6 py-4">
                  <div className="font-bold text-sm text-slate-900">{auction.bids}</div>
                  <div className="text-[11px] text-slate-500">Bidders: {auction.bidders}</div>
                </td>

                {/* participants */}
                <td className="px-6 py-4">
                  -----
                </td>

                {/* Time Left (With Extension Tag) */}
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-900 font-mono">
                    {auction.timeLeft}
                  </div>
                  <div className="text-[10px] text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded w-fit mt-1">
                    {auction.extended}
                  </div>
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-lg text-[11px] text-green-600 bg-green-50 border border-green-100 font-medium flex w-fit items-center gap-1.5 `}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                    {auction.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex gap-2">

                    <button
                      onClick={() => onSelectVehicle(auction)}
                      className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                      <Eye size={16} />
                    </button>

                    <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreVertical size={16} />
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LiveAuctionsList;