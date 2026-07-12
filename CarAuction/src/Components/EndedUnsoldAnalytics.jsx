import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, ResponsiveContainer,
    Tooltip, ReferenceLine
} from 'recharts';

// Static data
const data = [
    { time: '10:00 AM', amount: 50000 },
    { time: '11:00 AM', amount: 55000 },
    { time: '12:00 PM', amount: 62000 },
    { time: '01:00 PM', amount: 72000 },
    { time: '02:00 PM', amount: 78000 },
    { time: '03:45 PM', amount: 92000 },
];

const reservePrice = 95000;

function EndedUnsoldAnalytics() {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm w-full h-full">
            <h2 className="text-xl font-bold text-[#0B1E3D] mb-6">Auction Analytics</h2>

            {/* Header Info */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div>
                    <p className="text-sm text-slate-500 mb-1">Opening Bid</p>
                    <p className="text-lg font-bold text-[#0B1E3D]">AED 50,000</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500 mb-1">Highest Bid</p>
                    <p className="text-lg font-bold text-[#0B1E3D]">AED 78,000</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500 mb-1">Reserve Price</p>
                    <p className="text-lg font-bold text-[#0B1E3D]">AED {reservePrice.toLocaleString()}</p>
                </div>
            </div>

            {/* Chart */}
            <div className="h-64 w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            dy={10}
                        />
                        <YAxis
                            hide
                            domain={[20000, 100000]}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                            formatter={(value) => [`AED ${value.toLocaleString()}`, 'Bid Amount']}
                        />

                        {/* Reserve Price Line */}
                        <ReferenceLine y={reservePrice} stroke="#EF4444" strokeDasharray="3 3" />

                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            fill="url(#analyticsGradient)"
                            dot={{ r: 4, fill: '#fff', stroke: '#3B82F6', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex gap-6 text-sm text-slate-600 justify-center">
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-sm bg-[#3B82F6] border border-blue-400"></span>
                    <span>Bid Amount (AED)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-sm bg-[#EF4444]"></span>
                    <span>Reserve Price (AED)</span>
                </div>
            </div>
        </div>
    );
}

export default EndedUnsoldAnalytics;