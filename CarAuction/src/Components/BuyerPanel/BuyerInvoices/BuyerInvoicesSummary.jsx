
import React from 'react';
import BuyerContactSupport from '../BuyerSharedComponents/BuyerContactSupport';
import { Download, ShieldCheck, FileText } from 'lucide-react';
import { VscFilePdf } from "react-icons/vsc";
import { IoIosLock } from "react-icons/io";

function BuyerInvoicesSummary() {

  const invoiceData = {
    totalInvoices: 8,
    paid: 5,
    unpaid: 2,
    refunded: 1,
    totalInvoiced: "890,000",
    totalPaid: "665,625",
    totalDue: "224,375",
    totalRefunded: "10,000"
  };

  return (
    <div className="w-full max-w-sm space-y-6">

      {/* 1. Invoice Summary Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="text-[#D97706]" size={20} />
          <h2 className="text-lg font-bold text-[#0B1E3D]">Invoice Summary</h2>
        </div>

        <p className="text-xs text-slate-500 mb-4">All Amounts in AED</p>

        <div className="space-y-4 mb-6">
          <SummaryRow label="Total Invoices" value={invoiceData.totalInvoices} />
          <SummaryRow label="Paid Invoices" value={invoiceData.paid} color="text-green-600" />
          <SummaryRow label="Unpaid Invoices" value={invoiceData.unpaid} color="text-orange-600" />
          <SummaryRow label="Refunded Invoices" value={invoiceData.refunded} />
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-100">
          <PriceRow label="Total Invoiced" value={`AED ${invoiceData.totalInvoiced}`} />
          <PriceRow label="Total Paid" value={`AED ${invoiceData.totalPaid}`} color="text-green-600" />
          <PriceRow label="Total Due" value={`AED ${invoiceData.totalDue}`} color="text-orange-600" />
          <PriceRow label="Total Refunded" value={`AED ${invoiceData.totalRefunded}`} color="text-purple-600" />
        </div>
      </div>

      {/* 2. Download Statement */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Download className="text-[#D97706]" size={20} />
          <h2 className="text-sm font-bold text-[#0B1E3D]">Download Statement</h2>
        </div>
        <p className="text-xs text-slate-500 mb-4">Download your invoice statement.</p>
        <button className="w-full py-2.5 border border-[#D97706] text-[#D97706] rounded-lg text-sm font-bold hover:bg-amber-50 transition-colors flex items-center justify-center gap-2">
          <Download size={16} /> Download Statement
        </button>
      </div>

      {/* 3. Support & Security */}
      <BuyerContactSupport />

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck className="text-[#D97706]" size={20} />
          <h2 className="text-sm font-bold text-[#0B1E3D]">Secure Invoices</h2>
        </div>
        <p className="text-xs text-slate-500">All invoices are securely generated and protected.</p>
        <div className='flex gap-4 mt-3 items-center'>
          <div className="p-2 bg-red-50 rounded-lg">
            <VscFilePdf className='text-xl text-red-600' />
          </div>
          <div className="p-2 bg-gray-100 rounded-lg">
            <IoIosLock className='text-xl text-gray-500' />
          </div>
        </div>
      </div>

    </div>
  );
}

// Helper components for consistent layout
const SummaryRow = ({ label, value, color = "text-[#0B1E3D]" }) => (
  <div className="flex justify-between items-center text-sm font-medium">
    <span className="text-slate-600">{label}</span>
    <span className={`font-bold ${color}`}>{value}</span>
  </div>
);

const PriceRow = ({ label, value, color = "text-[#0B1E3D]" }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-slate-600 font-medium">{label}</span>
    <span className={`font-bold ${color}`}>{value}</span>
  </div>
);

export default BuyerInvoicesSummary;