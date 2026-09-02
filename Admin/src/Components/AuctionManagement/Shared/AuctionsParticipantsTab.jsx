
import React from 'react';
import { Filter, Download, MoreVertical, MessageCircleReply } from 'lucide-react';
import { formatLabel } from '../../utils/formatter';

function AuctionsParticipantsTab({ participants }) {

    if (!participants) return null;

    // colorful first char of name
    const getAvatarColor = (name) => {
        if (!name) return { bg: 'bg-slate-100', text: 'text-slate-600' };

        const firstChar = name.charAt(0).toUpperCase();

        const colors = [
            { bg: 'bg-red-100', text: 'text-red-700' },
            { bg: 'bg-orange-100', text: 'text-orange-700' },
            { bg: 'bg-amber-100', text: 'text-amber-700' },
            { bg: 'bg-yellow-100', text: 'text-yellow-800' },
            { bg: 'bg-green-100', text: 'text-green-700' },
            { bg: 'bg-emerald-100', text: 'text-emerald-700' },
            { bg: 'bg-teal-100', text: 'text-teal-700' },
            { bg: 'bg-cyan-100', text: 'text-cyan-700' },
            { bg: 'bg-sky-100', text: 'text-sky-700' },
            { bg: 'bg-blue-100', text: 'text-blue-700' },
            { bg: 'bg-indigo-100', text: 'text-indigo-700' },
            { bg: 'bg-violet-100', text: 'text-violet-700' },
            { bg: 'bg-purple-100', text: 'text-purple-700' },
            { bg: 'bg-pink-100', text: 'text-pink-700' },
        ];

        return colors[firstChar.charCodeAt(0) % colors.length];
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

            {/* Table */}
            {participants.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-slate-400">
                    No participants yet.
                </div>
            ) : (
                <div className="overflow-x-auto">

                    <table className="w-full text-left text-[12px]">

                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500">
                                <th className="px-5 py-3 font-medium min-w-50">
                                    Participant
                                </th>

                                <th className="px-4 py-3 font-medium min-w-40">
                                    Contact Details
                                </th>

                                <th className="px-4 py-3 font-medium min-w-38">
                                    Joined On
                                </th>

                                <th className="px-4 py-3 font-medium min-w-30">
                                    Total Bids
                                </th>

                                <th className="px-4 py-3 font-medium min-w-30">
                                    Bidder Type
                                </th>

                                <th className="px-4 py-3 font-medium text-center min-w-30">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {participants.map((participant) => {

                                const name = participant.bidder?.name || "Unknown";
                                const color = getAvatarColor(name);

                                return (
                                    <tr
                                        key={participant.bidderId}
                                        className="border-b last:border-0 border-slate-100 hover:bg-slate-50"
                                    >

                                        {/* Participant */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">

                                                <div
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${color.bg} ${color.text}`}
                                                >
                                                    <span className="text-sm font-bold leading-none">
                                                        {name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>

                                                <div>
                                                    <span className="font-medium text-[#0B1E3D] text-sm">
                                                        {name}
                                                    </span>

                                                    <p className="text-[11px] text-slate-400">
                                                        {participant.bidderId}
                                                    </p>
                                                </div>

                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col text-[12.5px]">
                                                <span className="text-[#0B1E3D] tracking-tight">
                                                    {participant.bidder?.email || "—"}
                                                </span>

                                                <span className="text-slate-500 text-xs mt-0.5">
                                                    {participant.bidder?.phone || "—"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Joined On */}
                                        <td className="px-5 py-4 text-[13px] text-[#0B1E3D]">

                                            {participant.firstBidAt ? (
                                                <div className="flex flex-col">

                                                    <span>
                                                        {new Date(
                                                            participant.firstBidAt
                                                        ).toLocaleDateString("en-GB", {
                                                            timeZone: "Asia/Dubai",
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </span>

                                                    <span className="text-slate-500 text-xs">
                                                        {new Date(
                                                            participant.firstBidAt
                                                        ).toLocaleTimeString("en-GB", {
                                                            timeZone: "Asia/Dubai",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: true,
                                                        })}
                                                    </span>

                                                </div>
                                            ) : (
                                                "—"
                                            )}

                                        </td>

                                        {/* Total Bids */}
                                        <td className="px-5 py-4 text-sm font-medium text-[#0B1E3D]">
                                            {participant.totalBids}
                                        </td>

                                        {/* Bidder Type */}
                                        <td className="px-5 py-4">

                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200">
                                                {formatLabel(participant.bidderType)}
                                            </span>

                                        </td>

                                        {/* Actions */}
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
                                );
                            })}

                        </tbody>

                    </table>
                </div>
            )}
        </div>
    );
}
export default AuctionsParticipantsTab;