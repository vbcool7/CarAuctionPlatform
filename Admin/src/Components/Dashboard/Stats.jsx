
import React from 'react';
import { Users, Gavel, Wallet, TrendingUp, ArrowUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

// Data for each sparkline
const data = [
    { value: 10 }, { value: 15 }, { value: 8 }, { value: 20 },
    { value: 12 }, { value: 25 }, { value: 18 }, { value: 30 }
];

// stats fun
const StatCard = ({ title, value, trend, icon: Icon, color, chartColor }) => (
    <div className="bg-white p-5 md:px-6 md:py-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-xl md:text-2xl font-bold">{value}</h3>
            </div>
        </div>

        <div className="mt-4">
            <p className="text-green-600 text-xs font-semibold flex items-center gap-1">
                <ArrowUp className="w-3 h-3" /> {trend}
            </p>
            <div className="hidden md:flex h-10 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={chartColor}
                            strokeWidth={2}
                            dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
);

function Stats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard
                title="Total Users"
                value="12,458"
                trend="12.5% from last week"
                icon={Users}
                color="bg-blue-50 text-blue-600"
                chartColor="#2563eb" />

            <StatCard title="Total Auctions" value="1,245" trend="8.7% from last week" icon={Gavel} color="bg-purple-50 text-purple-600" chartColor="#7c3aed" />
            <StatCard title="Revenue (AED)" value="1,234,567" trend="15.4% from last week" icon={Wallet} color="bg-green-50 text-green-600" chartColor="#059669" />
            <StatCard title="Active Bids" value="3,456" trend="10.2% from last week" icon={TrendingUp} color="bg-orange-50 text-orange-600" chartColor="#d97706" />
        </div>
    );
}

export default Stats;