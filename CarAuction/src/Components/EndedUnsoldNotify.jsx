
import React from 'react';
import { Bell } from 'lucide-react';

function EndedUnsoldNotify() {
  return (
    <div className="w-full bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between gap-4">
      {/* Left side: Icon and Text */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-red-100 rounded-lg shadow-sm border border-red-100">
          <Bell className="text-red-500" size={24} />
        </div>
        <div>
          <h3 className="font-bold text-[#0B1E3D]">Interested in this vehicle?</h3>
          <p className="text-sm text-slate-600">
            Get notified if this vehicle returns to auction.
          </p>
        </div>
      </div>

      {/* Right side: Action Button */}
      <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-sm">
        <Bell size={18} />
        Notify Me
      </button>
    </div>
  );
}

export default EndedUnsoldNotify;