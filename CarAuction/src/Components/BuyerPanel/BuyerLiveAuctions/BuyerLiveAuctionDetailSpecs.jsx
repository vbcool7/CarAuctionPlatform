
import React from 'react';
import { Copy, Gauge, Car, Palette, Armchair, MapPin, CheckCircle2, FileText, User } from 'lucide-react';

const specs = [
  { icon: Gauge, label: 'Odometer', value: '45,230 km' },
  { icon: Car, label: 'Engine', value: '3.0L I6' },
  { icon: Palette, label: 'Exterior Color', value: 'Dark Grey Metallic' },
  { icon: Armchair, label: 'Interior Color', value: 'Black' },
  { icon: MapPin, label: 'Location', value: 'Dubai, UAE' },
  { icon: CheckCircle2, label: 'Condition', value: 'Run & Drive' },
  { icon: FileText, label: 'Title', value: 'Clean' },
  { icon: User, label: 'Seller Type', value: 'Dealer' },
];

const badges = ['Lot # 45821', 'SUV', 'Automatic', 'Petrol', 'All Wheel Drive', '5 Seats'];

function BuyerLiveAuctionDetailSpecs() {
  return (
    <div className="w-full max-w-lg p-6 bg-white rounded-2xl">

      {/* Header */}
      <h1 className="text-xl font-bold text-[#0B1E3D] mb-2">2021 BMW X5 xDrive40i</h1>
      <div className="flex items-center gap-2 text-sm text-[#0B1E3D] mb-6">
        <span className="text-[12px] text-gray-500 font-semibold">VIN: 5UXCR6C07M9H12345</span>
        <Copy className="w-4 h-4 cursor-pointer text-[#D97706]" />
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-8">
        {badges.map((badge) => (
          <span key={badge} className="px-3 py-1 bg-gray-100 text-[#0B1E3D] rounded-md text-xs font-medium">
            {badge}
          </span>
        ))}
      </div>

      {/* Specification List */}
      <div className="space-y-5 text-[14px]">
        {specs.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-[#0B1E3D]">
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600 font-medium">{item.label}</span>
            </div>
            <span className="font-bold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuyerLiveAuctionDetailSpecs;