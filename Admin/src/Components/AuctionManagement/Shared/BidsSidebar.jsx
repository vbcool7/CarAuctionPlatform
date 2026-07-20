
import React from 'react'
import SummaryDonutCard from '../../SharedComponents/SummaryDonutCard'
import ContactSupport from '../../SharedComponents/ContactSupport'

function BidsSidebar({ auction }) {
    return (
        <div className='space-y-6'>

            {/* donut */}
            <SummaryDonutCard
                title="Bid Summary"
                centerValue="23"
                centerLabel="Total Bids"
                showPercentage={true}
                segments={[
                    { name: 'Active', value: 1, color: '#10B981' },
                    { name: 'Outbid', value: 21, color: '#F59E0B' },
                    { name: 'Cancelled', value: 1, color: '#EF4444 ' },
                ]}
            />

            {/* bid info */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 text-sm">
                <h3 className="font-semibold text-slate-700 mb-2">Bid Information</h3>
                <div className="flex justify-between"><span className="text-slate-500">Starting Bid</span><span className="font-medium">{auction.startingBid || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Reserve Price</span><span className="font-medium">{auction.reserve || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Buy Now Price</span><span className="font-medium">{auction.buyNowPrice || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Bid Increment</span><span className="font-medium">{auction.bidIncrement || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Total Bids</span><span className="font-medium">0</span></div>
            </div>

            {/* bid activity */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 text-sm">
                <h3 className="font-semibold text-slate-700 mb-2">Your Bidding Activity</h3>
                {auction.you ? (
                    <>
                        <div className="flex justify-between"><span className="text-slate-500">Your Total Bids</span><span className="font-medium">45</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Your Highest Bid</span><span className="font-medium text-green-600">450000</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Last Bid Time</span><span className="font-medium">11.20 PM</span></div>
                    </>
                ) : (
                    <div className="text-slate-400">You haven't placed a bid on this auction</div>
                )}
            </div>

            {/* support */}
            <ContactSupport />
        </div>
    )
}

export default BidsSidebar