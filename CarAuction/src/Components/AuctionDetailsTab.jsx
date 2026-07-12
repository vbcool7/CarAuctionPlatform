
import { Gavel, Tag, CalendarDays, ReceiptText } from "lucide-react";
import { RowData } from "./DetailTabs";

function AuctionDetailsTab({ vehicle }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Financial Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
          <Tag size={16} className="text-[#D97706]" /> Financials
        </h4>
        <RowData label="Starting Bid" value={vehicle.startingBid} />
        <RowData label="Reserve Price" value={vehicle.reservePrice} />
        <RowData label="Bid Increment" value={vehicle.increment} />
        <RowData label="Currency" value="AED" />
      </div>

      {/* Process Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
          <Gavel size={16} className="text-[#D97706]" /> Auction Terms
        </h4>
        <RowData label="Auction ID" value={vehicle.auctionId} />
        <RowData label="Auction Type" value={vehicle.auctionType} />
        <RowData label="Buyer Fee" value={vehicle.buyerFee} />
        <RowData label="Terms" value="Standard Auction Terms" />
      </div>
    </div>
  );
}

export default AuctionDetailsTab;