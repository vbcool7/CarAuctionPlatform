
import React from 'react';
import { PiCarFill } from 'react-icons/pi';
import { HiOutlineUser, HiOutlineUserGroup } from 'react-icons/hi';
import { MdOutlineMonetizationOn } from 'react-icons/md';

const stats = [
    {
        icon: <PiCarFill className="text-green-500" size={18} />,
        label: 'Sold Vehicles',
        value: '1,256',
    },
    {
        icon: <HiOutlineUser className="text-green-500" size={18} />,
        label: 'Not Sold',
        value: '486',
    },
    {
        icon: <HiOutlineUserGroup className="text-green-500" size={18} />,
        label: 'Reserve Not Met',
        value: '100',
    },
    {
        icon: <MdOutlineMonetizationOn className="text-green-500" size={18} />,
        label: 'Total Sales Value',
        value: 'AED 220M+',
        highlight: true,
    },
];

function EndedAuctionStatistics() {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-[#0F172A] mb-4">Auction Statistics</h3>

            <div className="space-y-3">
                {stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {stat.icon}
                            <span className="text-sm text-slate-600">{stat.label}</span>
                        </div>
                        <span className={`text-sm font-semibold ${stat.highlight ? 'text-[#D97706]' : 'text-[#0F172A]'}`}>
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>

            <button className="mt-5 w-full border border-[#D97706] text-[#D97706] py-2.5 rounded-lg text-sm font-semibold hover:bg-[#D97706]/5 transition cursor-pointer">
                View Full Report
            </button>
        </div>
    );
}

export default EndedAuctionStatistics;