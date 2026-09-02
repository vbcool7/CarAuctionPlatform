
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function SummaryDonutCard({
    title,
    segments,
    centerLabel,
    showPercentage,
    prefix = ""
}) {
    const total = segments.reduce((acc, s) => acc + s.value, 0);

    const formattedTotal = total.toLocaleString();

    const centerValueSize = formattedTotal.length > 9
        ? "text-[11px] sm:text-sm"
        : formattedTotal.length > 6
            ? "text-sm sm:text-base"
            : "text-lg sm:text-xl";

    return (
        <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-4 md:mb-6">
                {title}
            </h3>

            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3">

                {/* Donut Chart */}
                <div className="relative w-30 h-30 md:w-32 md:h-32">
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
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span
                            className={`${centerValueSize} font-bold text-slate-900 leading-tight text-center px-1`}
                        >
                            {prefix}{formattedTotal}
                        </span>

                        <span className="text-[7px] sm:text-[8px] font-bold text-green-600 uppercase tracking-wider">
                            {centerLabel}
                        </span>
                    </div>
                </div>

                {/* Legend */}
                <div className="w-full flex-1 min-w-0 space-y-2.5 sm:space-y-3">
                    {segments.map((item) => (
                        <div
                            key={item.name}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />

                                <span className="text-xs sm:text-sm font-medium text-slate-600 truncate">
                                    {item.name}
                                </span>
                            </div>

                            <span className="text-xs sm:text-sm font-semibold text-slate-900 whitespace-nowrap">
                                {prefix}
                                {item.value.toLocaleString()}

                                {showPercentage &&
                                    ` (${total > 0
                                        ? Math.round((item.value / total) * 100)
                                        : 0
                                    }%)`
                                }
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SummaryDonutCard;