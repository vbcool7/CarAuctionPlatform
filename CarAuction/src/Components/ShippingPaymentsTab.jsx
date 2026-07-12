
import {
  Truck,
  MapPin,
  Clock3,
  CreditCard,
  BadgePercent,
  Receipt,
} from "lucide-react";

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl bg-[#D97706]/10 flex items-center justify-center">
        <Icon size={18} className="text-[#D97706]" />
      </div>

      <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">
        {label}
      </span>
    </div>

    <p className="text-slate-900 font-semibold text-sm">
      {value || "—"}
    </p>
  </div>
);

function ShippingPaymentsTab({ vehicle }) {
  const { shipping = {}, payment = {} } = vehicle;

  return (
    <div className="space-y-8">

      {/* Shipping */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Shipping Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard
            icon={MapPin}
            label="Pickup Location"
            value={shipping.pickupLocation}
          />

          <InfoCard
            icon={Truck}
            label="Shipping Available"
            value={shipping.shippingAvailable}
          />

          <InfoCard
            icon={Clock3}
            label="Estimated Delivery"
            value={shipping.estimatedDelivery}
          />
        </div>
      </div>

      {/* Payment */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Payment Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard
            icon={CreditCard}
            label="Accepted Methods"
            value={payment.acceptedMethods}
          />

          <InfoCard
            icon={BadgePercent}
            label="Buyer Premium"
            value={payment.buyerPremium}
          />

          <InfoCard
            icon={Receipt}
            label="Taxes & Fees"
            value={payment.taxesFees}
          />
        </div>
      </div>

    </div>
  );
}

export default ShippingPaymentsTab;