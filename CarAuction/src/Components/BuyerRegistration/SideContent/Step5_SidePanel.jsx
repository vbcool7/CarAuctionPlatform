
import React from 'react';
import DCCImg from '../../../assets/Images/DCCImg.png';
import SSLImg from '../../../assets/Images/SSLImg.png';
import VISAImg from '../../../assets/Images/VISAImg.png';
import MaterCardImg from '../../../assets/Images/MaterCardImg.png';
import { ShieldCheck, Lock, Headset, CreditCard } from 'lucide-react';

function Step5_SidePanel() {
  return (
    <section className='w-full py-10'>
      <div className="w-full space-y-6">

        {/* 1. Deposit Summary */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-[#0B1E3D] mb-6">Deposit Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Required Bid Deposit</span>
              <span className="font-semibold text-[#0B1E3D]">AED 5,000</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Platform Fee (VAT 5%)</span>
              <span className="font-semibold text-[#0B1E3D]">AED 250</span>
            </div>
            <div className="border-t border-dashed border-slate-200 my-2 pt-4 flex justify-between items-center">
              <span className="font-bold text-[#0B1E3D]">Total Payable</span>
              <span className="text-xl font-bold text-[#D97706]">AED 5,250</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-3">
            <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
            <div className='text-xs'>
              <p className="font-bold text-emerald-800">Your deposit is safe with us.</p>
              <p className="text-emerald-600 mt-1">It will be used only for bidding purposes and refunded if you don't win any vehicle.</p>
            </div>
          </div>
        </div>
       
       {/* 2. section */}
        <div className="p-4 rounded-2xl border border-slate-100 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="text-emerald-600" size={18} />
            <h4 className="font-bold text-[#0B1E3D]">Secure Payment</h4>
          </div>

          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Your payment is protected with 256-bit SSL encryption.
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <img src={DCCImg} alt="PCI DSS" className="h-6 object-contain" />
            <img src={SSLImg} alt="256-bit SSL" className="h-6 object-contain" />
            <img src={VISAImg} alt="Verified by Visa" className="h-6 object-contain" />
            <img src={MaterCardImg} alt="Mastercard SecureCode" className="h-6 object-contain" />
          </div>
        </div>

        {/* 3. Need Help Section */}
        <div className="p-6 rounded-2xl border border-slate-100 bg-white">
          <h4 className="font-bold text-[#0B1E3D] mb-2">Need Help?</h4>
          <p className="text-sm text-slate-500 mb-4">Our support team is here to help you with any payment related queries.</p>
          <button className="flex items-center gap-2 border border-[#D97706] text-[#D97706] font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 transition">
            <Headset size={18} /> Contact Support
          </button>
        </div>

      </div>
    </section>
  );
}

export default Step5_SidePanel;