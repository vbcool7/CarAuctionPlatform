
import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, Globe, CheckCircle } from 'lucide-react';

const SellerAbout = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6 pb-6">

      {/* Left side */}
      <div className="lg:col-span-2 flex flex-col gap-8">

        {/* About Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            About Al Yousuf Motors
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Al Yousuf Motors is a leading used car dealer in the UAE with over 10 years of experience in the automotive industry. We pride ourselves on transparency, quality, and customer satisfaction. All our vehicles are carefully inspected and verified to ensure the best buying experience.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Quality Vehicles', 'Transparent Deals', 'Customer First', 'Secure Transactions'].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-[#D97706] mb-2"><CheckCircle size={20} /></div>
                <span className="text-[11px] font-bold text-slate-900">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dealer Information */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Dealer Information</h2>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Dealer Name', value: 'Al Yousuf Motors' },
              { label: 'Business Type', value: 'Verified Dealer' },
              { label: 'Member Since', value: 'Jan 2022' },
              { label: 'Location', value: 'Dubai, UAE' },
              { label: 'Phone', value: '+971 4 123 4567' },
              { label: 'Email', value: 'info@alyousufmotors.ae' },
              { label: 'Website', value: 'www.alyousufmotors.ae' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-2 border-b border-slate-50 pb-2">
                <span className="text-slate-500">{row.label}</span>
                <span className="font-medium text-slate-900">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Verified Badge */}
          <div className="mt-6 flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
            <ShieldCheck className="text-green-600" />
            <div>
              <p className="text-sm font-bold text-green-800">Verified Dealer</p>
              <p className="text-xs text-green-700">This dealer has been verified by AutoBid. All information is accurate and trusted.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col gap-8">

        {/* Dealer Stats */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Dealer Stats</h2>
          <div className="space-y-4">
            {[
              { label: 'Total Vehicles', value: '245' },
              { label: 'Active Auctions', value: '18' },
              { label: 'Sold Vehicles', value: '127' },
              { label: 'Response Rate', value: '92%' },
              { label: 'Positive Reviews', value: '128' },
            ].map((stat, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-slate-600">{stat.label}</span>
                <span className="font-bold text-slate-900">{stat.value}</span>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-2.5 border border-[#D97706] text-[#D97706] rounded-lg font-bold text-sm hover:bg-slate-50 transition-all">
            Contact Dealer
          </button>
        </div>

        {/* Location Box */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Location</h2>
          <div className="h-32 bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
            <MapPin className="text-slate-400" />
          </div>
          <p className="text-sm font-bold">Al Yousuf Motors Showroom</p>
          <p className="text-xs text-slate-500 mb-2">Sheikh Zayed Road, Al Quoz 2, Dubai, UAE</p>
          <a href="#" className="text-sm text-[#D97706] font-bold hover:underline">Get Directions →</a>
        </div>
      </div>
    </div>
  );
};

export default SellerAbout;