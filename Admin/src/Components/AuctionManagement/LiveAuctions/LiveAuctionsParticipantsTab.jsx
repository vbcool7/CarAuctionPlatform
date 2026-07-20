
import React from 'react';
import { Filter, Download, MoreVertical, MessageCircleReply } from 'lucide-react';

function LiveAuctionsParticipantsTab({ auction }) {

    if (!auction) return null;

    const participants = auction.participants || [];

    // colorfull first char of name
    const getAvatarColor = (name) => {
        if (!name) return 'bg-slate-100 text-slate-600';

        const firstChar = name.charAt(0).toUpperCase();

        const colors = [
            { bg: 'bg-red-100', text: 'text-red-700' },
            { bg: 'bg-orange-100', text: 'text-orange-700' },
            { bg: 'bg-amber-100', text: 'text-amber-700' },
            { bg: 'bg-yellow-100', text: 'text-yellow-800' },
            { bg: 'bg-lime-100', text: 'text-lime-800' },
            { bg: 'bg-green-100', text: 'text-green-700' },
            { bg: 'bg-emerald-100', text: 'text-emerald-700' },
            { bg: 'bg-teal-100', text: 'text-teal-700' },
            { bg: 'bg-cyan-100', text: 'text-cyan-700' },
            { bg: 'bg-sky-100', text: 'text-sky-700' },
            { bg: 'bg-blue-100', text: 'text-blue-700' },
            { bg: 'bg-indigo-100', text: 'text-indigo-700' },
            { bg: 'bg-violet-100', text: 'text-violet-700' },
            { bg: 'bg-purple-100', text: 'text-purple-700' },
            { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700' },
            { bg: 'bg-pink-100', text: 'text-pink-700' },
            { bg: 'bg-rose-100', text: 'text-rose-700' },
        ];

        const charCode = firstChar.charCodeAt(0);
        const colorIndex = charCode % colors.length;

        return colors[colorIndex];
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-5 py-4 border-b border-slate-200">
                <h3 className="text-[15px] font-semibold text-[#0B1E3D]">
                    All Participants ({participants.length})
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
            {participants.length === 0 ?
                (
                    <div className="px-5 py-10 text-center text-sm text-slate-400">
                        No participants yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[12px]">
                            <thead>
                                <tr className="border-b border-slate-200 text-slate-500">
                                    <th className="px-5 py-3 font-medium min-w-50">Participant</th>
                                    <th className="px-4 py-3 font-medium min-w-40">Contact Details</th>
                                    <th className="px-4 py-3 font-medium min-w-38">Joined On</th>
                                    <th className="px-4 py-3 font-medium min-w-30">Total Bids</th>
                                    <th className="px-4 py-3 font-medium min-w-30">Eligibility</th>
                                    <th className="px-4 py-3 font-medium min-w-30">Status</th>
                                    <th className="px-4 py-3 font-medium text-center min-w-30">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {participants.map((participant) => (
                                    <tr
                                        key={participant.id}
                                        className="border-b last:border-0 border-slate-100 hover:bg-slate-50"
                                    >

                                        {/* Name */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {(() => {
                                                    const color = getAvatarColor(participant.name);

                                                    return (
                                                        <div
                                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${color.bg} ${color.text}`}
                                                        >
                                                            <span className="text-sm font-bold leading-none">
                                                                {participant.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    );
                                                })()}

                                                <span className="font-medium text-[#0B1E3D] text-sm">
                                                    {participant.name}
                                                </span>
                                            </div>
                                        </td>

                                        {/* contact detail */}
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col text-sm">
                                                <span className="text-[#0B1E3D] tracking-tight truncate">
                                                    {participant.email}
                                                </span>
                                                <span className="text-slate-500 text-xs mt-0.5">
                                                    {participant.phone}
                                                </span>
                                            </div>
                                        </td>

                                        {/* joined on */}
                                        <td className="px-5 py-4 text-sm text-[#0B1E3D]">
                                            <div className="flex flex-col">
                                                <span>{participant.date}</span>
                                                <span className="text-slate-500 text-xs">{participant.time}</span>
                                            </div>
                                        </td>

                                        {/* total bids */}
                                        <td className="px-5 py-4 text-sm font-medium text-[#0B1E3D]">
                                            {participant.score}
                                        </td>

                                        {/* eligibility */}
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                                {participant.verification}
                                            </span>
                                        </td>

                                        {/* status */}
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                {participant.status}
                                            </span>
                                        </td>

                                        {/* action */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100">
                                                    <MessageCircleReply size={15} />
                                                </button>

                                                <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100">
                                                    <MoreVertical size={15} />
                                                </button>
                                            </div>
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

export default LiveAuctionsParticipantsTab;