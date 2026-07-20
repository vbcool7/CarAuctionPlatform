
import React from 'react'
import SummaryDonutCard from '../../SharedComponents/SummaryDonutCard';
import ContactSupport from '../../SharedComponents/ContactSupport';

function ParticipantSidebar({ auction }) {
    const participants = auction.participants || [];
    const countByStatus = (status) => participants.filter(p => p.status === status).length;
    const countByVerification = (v) => participants.filter(p => p.verification === v).length;

    const total = participants.length;
    const active = countByStatus('Active');
    const outbid = countByStatus('Outbid');
    const disconnected = countByStatus('Disconnected');
    const cancelled = countByStatus('Cancelled');

    const verified = countByVerification('Verified');
    const pendingVerification = countByVerification('Pending Verification');
    const notEligible = countByVerification('Not Eligible');

    const topParticipants = [...participants]
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 5);

    return (
        <div className='space-y-6'>

            <SummaryDonutCard
                title="Participant Summary"
                centerValue={total}
                centerLabel="Total"
                showPercentage={true}
                segments={[
                    { name: 'Active', value: active, color: '#10B981' },
                    { name: 'Outbid', value: outbid, color: '#F59E0B' },
                    { name: 'Disconnected', value: disconnected, color: '#6B7280' },
                    { name: 'Cancelled', value: cancelled, color: '#EF4444' },
                ]}
            />

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 text-sm">
                <h3 className="font-semibold text-slate-700 mb-2">Eligibility Summary</h3>
                <div className="flex justify-between"><span className="text-slate-500">Verified</span><span className="font-medium text-green-600">{verified}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Pending Verification</span><span className="font-medium text-amber-600">{pendingVerification}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Not Eligible</span><span className="font-medium text-red-600">{notEligible}</span></div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-slate-700 text-sm">Top Participants</h3>
                    {topParticipants.length > 0 && <button className="text-xs text-[#D97706] font-medium">View All</button>}
                </div>
                {topParticipants.length > 0 ? (
                    <div className="space-y-3">
                        {topParticipants.map((p, i) => (
                            <div key={p.email || i} className="flex justify-between text-sm">
                                <span>{i + 1}. {p.name}</span>
                                <span className="font-medium">{p.score} bids</span>
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