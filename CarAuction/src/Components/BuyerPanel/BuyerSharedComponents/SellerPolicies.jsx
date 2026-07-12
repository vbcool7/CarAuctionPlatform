
import { Shield, RotateCcw, CreditCard, Search, Truck, AlertTriangle } from 'lucide-react';

function SellerPolicies() {

  const policies = [
    {
      icon: Shield,
      title: 'Warranty Policy',
      text: '30-day warranty covering engine and transmission on all vehicles sold through this dealership.',
    },
    {
      icon: RotateCcw,
      title: 'Return & Refund Policy',
      text: '7-day return window if the vehicle does not match its listed condition report.',
    },
    {
      icon: CreditCard,
      title: 'Payment Terms',
      text: 'Bank transfer, certified cheque, or financing through partner banks. Full payment due before pickup.',
    },
    {
      icon: Search,
      title: 'Inspection Policy',
      text: 'Independent pre-purchase inspection permitted before final payment is made.',
    },
    {
      icon: Truck,
      title: 'Delivery & Pickup',
      text: 'Free pickup from showroom; delivery available within Dubai for an additional fee.',
    },
    {
      icon: AlertTriangle,
      title: 'Disclaimer',
      text: 'All vehicles are sold as-is. Buyer is responsible for registration transfer and associated fees.',
    },
  ];

  return (
    <div className="space-y-4 mt-6 pb-6">
      {policies.map((policy) => {
        const Icon = policy.icon;
        return (
          <div 
          key={policy.title} 
          className="flex gap-4 p-5 bg-white border border-slate-200 rounded-xl">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Icon size={18} className="text-[#D97706]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B1E3D] mb-1">{policy.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{policy.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SellerPolicies;