
import React from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
    { name: 'Dec', value: 153000 },
    { name: 'Jan', value: 158000 },
    { name: 'Feb', value: 164000 },
    { name: 'Mar', value: 170000 },
    { name: 'Apr', value: 179000 },
    { name: 'May', value: 192000 },
];

function EndedSoldMarketInsights() {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm w-full h-full flex flex-col">
            <h2 className="text-xl font-bold text-[#0B1E3D] mb-4">Market Insights</h2>

            {/* Stats Section */}
            <div className="space-y-4 flex-1">
                <div>
                    <p className="text-sm text-slate-500">Market Value</p>
                    <p className="text-lg font-bold text-[#0B1E3D]">AED 165,000 – 185,000</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500">Avg. Selling Price</p>
                    <p className="text-lg font-bold text-[#0B1E3D]">AED 172,000</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500">This Vehicle Sold For</p>
                    <p className="text-lg font-bold text-[#10B981]">AED 285,000</p>
                </div>
            </div>

            <div className="border-t border-slate-100 my-3" />

            {/* Recharts Trend Chart */}
            <div className="mt-auto">
                <h3 className="font-bold text-[#0B1E3D] mb-2 text-sm">Price Trend (Last 6 Months)</h3>
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                {/* Defining the blue gradient shadow */}
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" hide />
                            <YAxis hide domain={['auto', 'auto']} />
                            <Tooltip
                                cursor={{ stroke: '#3B82F6', strokeWidth: 1 }}
                                contentStyle={{ borderRadius: '8px' }}
                            />
                            {/* Apply the gradient to the fill */}
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#3B82F6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                                dot={{
                                    r: 4,
                                    fill: '#ffffff',
                                    stroke: '#3B82F6',
                                    strokeWidth: 2
                                }}
                                activeDot={{
                                    r: 6,
                                    fill: '#3B82F6'
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default EndedSoldMarketInsights;