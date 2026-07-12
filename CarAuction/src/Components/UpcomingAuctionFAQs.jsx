
import React from 'react'

function UpcomingAuctionFAQs() {
    return (
        <div>
            {/* ── Why Join ── */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 mb-3">Why Join Upcoming Auctions?</h4>
                <ul className="space-y-2.5">
                    {[
                        'Be the first to bid on newly listed vehicles',
                        'Get alerts when an auction begins',
                        'Set reminders and never miss an auction',
                        'Free to register and participate',
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12px] text-slate-600">
                            <span className="text-[#D97706] mt-0.5">✓</span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default UpcomingAuctionFAQs