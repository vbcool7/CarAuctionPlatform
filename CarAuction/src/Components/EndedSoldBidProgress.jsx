import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

// Static data mimicking the bid progression seen in your reference
const staticBidData = [
  { step: 'Start', amount: 120000 },
  { step: '1', amount: 135000 },
  { step: '2', amount: 155000 },
  { step: '3', amount: 185000 },
  { step: '4', amount: 200000 },
  { step: '5', amount: 215000 },
  { step: '6', amount: 230000 },
  { step: '7', amount: 245000 },
  { step: '8', amount: 260000 },
  { step: 'End', amount: 285000 },
];

function EndedSoldBidProgress() {
  // Static values for testing
  const openingBid = 120000;
  const finalBid = 285000;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm w-full">
      <h2 className="text-xl font-bold text-[#0B1E3D] mb-6">Bid Progress</h2>

      {/* Header Info */}
      <div className="flex justify-between mb-6">
        <div>
          <p className="text-sm text-slate-500">Opening Bid</p>
          <p className="text-lg font-bold text-[#0B1E3D]">AED {openingBid.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Final Bid</p>
          <p className="text-lg font-bold text-[#0B1E3D]">AED {finalBid.toLocaleString()}</p>
        </div>
      </div>

      {/* Chart Wrapper with fixed height to prevent Recharts container error */}
      <div className="h-48 w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={staticBidData}>
            <defs>
              <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis hide domain={['dataMin - 10000', 'dataMax + 10000']} />
            <Tooltip 
              formatter={(value) => [`AED ${value.toLocaleString()}`, 'Bid']}
              contentStyle={{ borderRadius: '8px', fontSize: '12px', borderColor: '#e2e8f0' }}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#3B82F6" 
              strokeWidth={3} 
              fill="url(#bidGradient)" 
              dot={{ r: 4, fill: '#fff', stroke: '#3B82F6', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#3B82F6' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
        <span className="w-3 h-3 rounded-xs bg-[#3B82F6]"></span>
        <span>Bid Amount (AED)</span>
      </div>
    </div>
  );
}

export default EndedSoldBidProgress;