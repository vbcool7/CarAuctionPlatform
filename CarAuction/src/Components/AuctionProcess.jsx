
import { User, ShieldCheck, Gavel, Award, Briefcase } from "lucide-react";

function AuctionProcess() {

  const steps = [
    { icon: User, title: "Register", desc: "Create an account and register to bid." },
    { icon: ShieldCheck, title: "Get Approved", desc: "Complete KYC verification to bid." },
    { icon: Gavel, title: "Place Bids", desc: "Bid live when the auction starts." },
    { icon: Award, title: "Win", desc: "If you're the highest bidder." },
    { icon: Briefcase, title: "Pay & Pickup", desc: "Complete payment and pick up your vehicle." },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-[#0F172A] mb-8">
        Auction Process
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-12">
        {steps.map((step, i) => (
          <div
            key={i}
            className="relative flex flex-col items-center text-center border border-slate-200 rounded-2xl p-6 bg-white pt-12"
          >
            {/* Absolute Icon Container that touches/overlaps the border */}
            <div className="absolute -top-8 w-16 h-16 rounded-full bg-amber-50 border border-amber-100 shadow-md flex items-center justify-center">
              <step.icon className="text-[#D97706]" size={24} strokeWidth={1.5} />
            </div>

            {/* Text Content */}
            <h4 className="font-bold text-[#0F172A] text-sm mb-2 mt-2">
              {step.title}
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed max-w-35">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuctionProcess;