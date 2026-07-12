
import {
  Gavel,
  Timer,
  MapPin,
  User,
  Car,
  Building2,
  Activity,
  CircleDollarSign,
} from "lucide-react";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:border-[#D97706]/30 transition-all">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-xl bg-[#D97706]/10 flex items-center justify-center">
        <Icon size={18} className="text-[#D97706]" />
      </div>

      <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">
        {label}
      </span>
    </div>

    <p className="text-slate-900 font-semibold text-base">
      {value || "—"}
    </p>
  </div>
);

function OverviewTab({ vehicle }) {

  const {
    bid,
    totalBids,
    timer,
    location,
    sellerType,
    vehicleType,
    source,
    status,
  } = vehicle;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

      <StatCard
        icon={CircleDollarSign}
        label="Current Bid"
        value={bid}
      />

      <StatCard
        icon={Gavel}
        label="Total Bids"
        value={totalBids}
      />

      <StatCard
        icon={Timer}
        label="Auction Ends"
        value={timer}
      />

      <StatCard
        icon={MapPin}
        label="Location"
        value={location}
      />

      <StatCard
        icon={User}
        label="Seller Type"
        value={sellerType}
      />

      <StatCard
        icon={Car}
        label="Vehicle Type"
        value={vehicleType}
      />

      <StatCard
        icon={Building2}
        label="Source"
        value={source}
      />

      <StatCard
        icon={Activity}
        label="Status"
        value={status}
      />

    </div>
  );
}

export default OverviewTab;