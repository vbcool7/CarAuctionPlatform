
import React from 'react'
import SummaryDonutCard from '../../SharedComponents/SummaryDonutCard';
import ContactSupport from '../../SharedComponents/ContactSupport';

function ParticipantSidebar({ vehicle, participants = [], bids = [] }) {

    const total = participants.length;

    // Kitne participants ki koi active (abhi valid) bid hai
    const activeParticipantIds = new Set(
        bids
            .filter((b) => b.status === 'active' || b.status === 'won')
            .map((b) => b.bidderId?.toString())
    );
    const activeCount = activeParticipantIds.size;
    const inactiveCount = total - activeCount;

    const topParticipants = [...participants]
        .sort((a, b) => (b.totalBids || 0) - (a.totalBids || 0))
        .slice(0, 5);

    return (
        <div className='space-y-6'>

            <SummaryDonutCard
                title="Participant Summary"
                centerLabel="Participants"
                showPercentage={true}
                segments={[
                    { name: 'Currently Bidding', value: activeCount, color: '#10B981' },
                    { name: 'Not Currently Bidding', value: inactiveCount, color: '#F59E0B' },
                ]}
            />

            <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-slate-700 text-sm">Top Participants</h3>
                    {topParticipants.length > 0 && <button className="text-xs text-[#D97706] font-medium">View All</button>}
                </div>
                {topParticipants.length > 0 ? (
                    <div className="space-y-3">
                        {topParticipants.map((p, i) => (
                            <div key={p.bidderId || i} className="flex justify-between text-sm">
                                <span>{i + 1}. {p.bidder?.name || "Unknown"}</span>
                                <span className="font-medium">{p.totalBids} bids</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-slate-400">No participants yet</div>
                )}
            </div>

            <ContactSupport />
        </div>
    )
}

export default ParticipantSidebar;