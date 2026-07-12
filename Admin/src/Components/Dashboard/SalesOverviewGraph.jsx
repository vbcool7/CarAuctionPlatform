
import React, { useState } from 'react';
import { Info, ChevronDown } from 'lucide-react';
import { AreaChart, Area, YAxis, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CustomDropdown from '../SharedComponents/CustomDropDown';

const data = [
  { name: 'May 14', value: 200000 },
  { name: 'May 15', value: 500000 },
  { name: 'May 16', value: 400000 },
  { name: 'May 17', value: 800000 },
  { name: 'May 18', value: 550000 },
  { name: 'May 19', value: 750000 },
  { name: 'May 20', value: 950000 },
];

const RANGE_MAP = {
  "This Week": "this_week",
  "One Week Ago": "last_week",
  "Two Weeks Ago": "two_weeks_ago",
};

function SalesOverviewGraph() {

  const [selectedWeek, setSelectedWeek] = useState("This Week");
  const options = Object.keys(RANGE_MAP);

  return (
    <div className="w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">

      {/* header */}
       <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <h2 className="text-base font-bold text-gray-900">
            Sales Overview
          </h2>
          <Info size={14} className="text-gray-400" />
        </div>
        
        {/* drop down */}
        <div className='mt-3 md:mt-0'>
          <CustomDropdown
            selected={selectedWeek}
            onChange={setSelectedWeek}
            options={options}
          />
        </div>
      </div>

<div className="relative w-full h-50 shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            padding={{ left: 10 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={38}
            tickMargin={4}
            tickFormatter={(value) => value >= 1000000 ? `${value / 1000000}M` : `${value / 1000}K`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Area
            type="linear"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
            dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>

    </div>
  )
}

export default SalesOverviewGraph;