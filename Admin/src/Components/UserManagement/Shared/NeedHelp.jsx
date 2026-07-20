
import React from 'react';
import { Headset } from 'lucide-react';

function NeedHelp() {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-bold text-[#0B1E3D] text-lg mb-1">Need Help?</h3>
      <p className="text-sm text-slate-500 mb-4">
        If you need help with managing listings.
      </p>

      <button
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#D97706] hover:bg-[#B46305] rounded-xl transition-colors"
        onClick={() => console.log("Contacting support...")}
      >
        <Headset size={18} />
        Contact Support
      </button>
    </div>
  );
}
export default NeedHelp;