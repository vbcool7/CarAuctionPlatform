import { HiCalendar, HiOutlineTag, HiOutlineCurrencyDollar, HiLocationMarker, HiCheckCircle } from "react-icons/hi";

function UpcomingBiddingControlPanel({ vehicle }) {
  
  const bidDetails = [
    { label: 'Start Date', val: '27 May 2026, 10:00 AM', icon: HiCalendar },
    { label: 'End Date', val: '27 May 2026, 12:00 PM', icon: HiCalendar },
    { label: 'Starting Bid', val: 'AED 120,000', icon: HiOutlineTag },
    { label: 'Est. Value', val: 'AED 175,000', icon: HiOutlineTag },
    { label: 'Bid Increment', val: 'AED 2,000', icon: HiOutlineCurrencyDollar },
    { label: 'Reserve Price', val: 'AED 150,000', tag: 'Met', icon: HiCheckCircle },
    { label: 'Auction Type', val: 'Live Auction', icon: null },
    { label: 'Location', val: 'Dubai, UAE', icon: HiLocationMarker }
  ];

  return (
    <div className="w-full h-full bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
      
      {/* Header: Timer Section - Minimized margins */}
      <div className="text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Auction Starts In</p>
        <div className="flex justify-center gap-4 text-[#0F172A]">
          {['02', '14', '30', '15'].map((val, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-3xl font-black">{val}</span>
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">{['Days', 'Hrs', 'Mins', 'Secs'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Details Grid - Optimized spacing */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 border-y border-slate-100 py-5 my-4">
        {bidDetails.map((item, i) => (
          <div key={i} className={`${i % 2 !== 0 ? 'pl-3 border-l border-slate-100' : ''}`}>
            <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest">{item.label}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {item.icon && <item.icon size={13} className="text-[#D97706]" />}
              <span className="text-[11px] font-bold text-[#0F172A] truncate">
                {item.val}
              </span>
              {item.tag && (
                <span className="text-[8px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{item.tag}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button className="w-full bg-[#0B1E3D] hover:bg-[#1a3a6e] text-white py-3.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-[0.98]">
          Register to Bid
        </button>
        <button className="w-full border border-slate-200 text-slate-600 py-3.5 rounded-xl text-sm font-semibold hover:border-[#D97706] hover:text-[#D97706] transition-all flex items-center justify-center gap-2">
          <HiCalendar size={15} /> Add to Calendar
        </button>
      </div>
    </div>
  );
}

export default UpcomingBiddingControlPanel;