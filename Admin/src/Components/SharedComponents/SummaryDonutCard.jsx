
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function SummaryDonutCard({ title, segments, centerValue, centerLabel, showPercentage }) {
    const total = segments.reduce((acc, s) => acc + s.value, 0);

    return (
        <div className="w-full bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">{title}</h3>

            <div className="flex items-center gap-3">
                {/* Donut Chart */}
                <div className="relative w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={segments}
                                innerRadius={45}
                                outerRadius={60}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                            >
                                {segments.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center text  */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-slate-900">{centerValue}</span>
                        <span className="text-[8px] font-bold text-green-600 uppercase tracking-wider">
                            {centerLabel}
                        </span>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-3">
                    {segments.map(item => (
                        <div 
                        key={item.name} 
                        className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-sm font-medium text-slate-600">{item.name}</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900">
                                {item.value}{showPercentage && ` (${Math.round(item.value / total * 100)}%)`}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SummaryDonutCard;