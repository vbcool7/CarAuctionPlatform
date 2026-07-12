
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Info, ChevronDown } from 'lucide-react';
import CustomDropdown from '../SharedComponents/CustomDropDown';

const data = [
  { name: 'Completed', value: 600, color: '#2563eb' },
  { name: 'Ongoing', value: 425, color: '#22c55e' },
  { name: 'Upcoming', value: 150, color: '#f59e0b' },
  { name: 'Canceled', value: 50, color: '#ef4444' },
];

const RANGE_MAP = {
  "This Week": "this_week",
  "One Week Ago": "last_week",
  "Two Weeks Ago": "two_weeks_ago",
};

const total = data.reduce((sum, d) => sum + d.value, 0);

function AuctionPerformanceGraph() {

  const [selectedWeek, setSelectedWeek] = useState("This Week");

  const options = Object.keys(RANGE_MAP);

  return (
    <div className="w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">

      {/* header */}
       <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <h2 className="text-base font-bold text-gray-900">Auction Performance</h2>
          <Info size={14} className="text-gray-400" />
        </div>

        <div className='mt-3 md:mt-0'>
          <CustomDropdown
            selected={selectedWeek}
            onChange={setSelectedWeek}
            options={options}
          />
        </div>
      </div>

      {/* Chart Section - Responsive Flex */}
      <div className="flex flex-col md:flex-row items-center justify-center xl:justify-start gap-8">

        {/* Chart Wrapper */}
        <div className="relative w-40 h-50 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={55}
                outerRadius={75}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-gray-900">{total.toLocaleString()}</span>
            <span className="text-xs text-gray-500">Total Auctions</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          {data.map((entry) => (
            <div 
            key={entry.name} 
            className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-[13px] md:text-sm text-gray-700 flex-1">{entry.name}</span>
              <span className="text-[13px] md:text-sm text-gray-500 font-medium">
                {entry.value} <span className="text-gray-400">({((entry.value / total) * 100).toFixed(1)}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AuctionPerformanceGraph;