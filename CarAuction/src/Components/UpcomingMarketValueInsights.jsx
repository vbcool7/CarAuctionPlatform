
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';

const UpcomingMarketValueInsights = ({ data }) => {

    const chartData = [
        { month: 'Dec', price: 150 }, { month: '', price: 154 }, { month: 'Jan', price: 156 },
        { month: '', price: 158 }, { month: 'Feb', price: 161 }, { month: '', price: 160 },
        { month: 'Mar', price: 161 }, { month: '', price: 167 }, { month: 'Apr', price: 166 },
        { month: '', price: 170 }, { month: 'May', price: 176 }
    ];

    return (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <h3 className="text-lg font-bold text-[#0F172A] mb-4">Market Insights</h3>

            {/* Top Value Stats */}
            <div className="mb-8">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Market Value</p>
                <p className="text-xl font-black text-[#0F172A] mt-1">AED 165,000 – 185,000</p>

                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-100">
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Avg. Selling Price</p>
                        <p className="font-bold text-[#0F172A] mt-1">AED 172,000</p>
                    </div>
                    <div className="pl-4 border-l border-slate-100">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Potential Saving</p>
                        <p className="font-bold text-[#D97706] mt-1">Up to AED 32,000</p>
                    </div>
                </div>
            </div>

            {/* Price Trend Graph */}
            <div className="mt-4">
                <p className="text-sm font-bold text-[#0F172A] mb-4">
                    Price Trend <span className="text-slate-400 font-normal">(Last 6 Months)</span>
                </p>

                <div className="h-46 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[140, 180]} />
                            <Area type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default UpcomingMarketValueInsights;