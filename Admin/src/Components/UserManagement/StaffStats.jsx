
import React from 'react';
import { Users, ShieldCheck, UserMinus, ShieldAlert, ArrowUp, ArrowDown } from 'lucide-react';

const staffStats = [
    {
        title: "Total Staff",
        value: "24",
        icon: Users,
        theme: "text-blue-600 bg-blue-50",
        subTitle: "12.5% from last week",
        subTextColor: "text-green-600",
        isPositive: true
    },
    {
        title: "Active Staff",
        value: "20",
        icon: ShieldCheck,
        theme: "text-emerald-600 bg-emerald-50",
        subTitle: "9.3% from last week",
        subTextColor: "text-green-600",
        isPositive: true
    },
    {
        title: "Inactive Staff",
        value: "3",
        icon: UserMinus,
        theme: "text-red-500 bg-red-50",
        subTitle: "10.8% from last week",
        subTextColor: "text-red-500",
        isPositive: false
    },
    {
        title: "Suspended Staff",
        value: "1",
        icon: ShieldAlert,
        theme: "text-red-500 bg-red-50",
        subTitle: "2.6% from last week",
        subTextColor: "text-red-500",
        isPositive: false
    }
];

function StaffStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {staffStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={index}
                        className="bg-white p-4 md:p-5 rounded-2xl border border-slate-100 shadow-md flex items-start gap-4">

                        <div className={`p-3 rounded-full ${stat.theme}`}>
                            <Icon className="w-5 h-5 md:w-6 md:h-6" />
                        </div>

                        {/* Content */}
                        <div>
                            <p className="text-[13px] md:text-sm text-slate-500 font-medium">{stat.title}</p>
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                            <div className={`flex items-center text-[12px] md:text-xs font-medium mt-1 ${stat.subTextColor}`}>
                                {stat.isPositive
                                    ? <ArrowUp size={14} className="mr-1" />
                                    : <ArrowDown size={14} className="mr-1" />}
                                {stat.subTitle}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default StaffStats;