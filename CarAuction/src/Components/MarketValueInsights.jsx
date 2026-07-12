
function MarketValueInsights() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Market Value Insights</h3>
      
      <div className="flex flex-col gap-4">
        {/* Market Value Row */}
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Market Value</span>
          <span className="text-slate-900 font-bold">AED 310,000</span>
        </div>
        
        {/* Average Listing Row */}
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Average Listing Price</span>
          <span className="text-slate-900 font-bold">AED 295,000</span>
        </div>
        
        {/* Current Bid Row */}
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Current Bid</span>
          <span className="text-slate-900 font-bold">AED 245,000</span>
        </div>
      </div>

      {/* Potential Saving Highlight */}
      <div className="mt-6 bg-green-50 border border-green-100 rounded-xl p-4 flex justify-between items-center">
        <span className="text-green-800 font-bold">Potential Saving</span>
        <span className="text-green-700 font-bold text-lg">
          AED 65,000 (21%)
        </span>
      </div>
    </div>
  );
}

export default MarketValueInsights;