
import React from 'react';
import { Car, Users, Gavel, Globe, ShieldCheck } from 'lucide-react';

function AboutFeaturebar() {
    
    const stats = [
        { icon: Car, count: "50K+", label: "Vehicles Sold", bg: "bg-blue-50", color: "text-blue-600" },
        { icon: Users, count: "25K+", label: "Happy Customers", bg: "bg-green-50", color: "text-green-600" },
        { icon: Gavel, count: "15K+", label: "Auctions Completed", bg: "bg-purple-50", color: "text-purple-600" },
        { icon: Globe, count: "6+", label: "Countries Served", bg: "bg-orange-50", color: "text-orange-600" },
        { icon: ShieldCheck, count: "4.8/5", label: "Average Rating", bg: "bg-emerald-50", color: "text-emerald-600" },
    ];

    return (
        <section className="w-full py-8 ">
            <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
                
                {/* Main White Card with Shadow */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 flex flex-wrap justify-between items-center gap-8">
                    
                    {stats.map((stat, index) => (
                        <div key={index} className="flex items-center gap-4 flex-1">
                            {/* Colorful Icon Circle */}
                            <div className={`w-14 h-14 rounded-full ${stat.bg} flex items-center justify-center`}>
                                <stat.icon size={24} className={`${stat.color}`} />
                            </div>
                            
                            {/* Text Content */}
                            <div>
                                <h3 className="text-2xl font-bold text-[#0B1E3D]">{stat.count}</h3>
                                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
}

export default AboutFeaturebar;