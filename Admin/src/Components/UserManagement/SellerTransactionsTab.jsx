
import React from 'react';
import { Eye, Calendar, Filter, Download, ArrowDown, User, Tag, ArrowUp } from 'lucide-react';

const transactions = [
  {
    id: "TRX-20240513-001",
    invoice: "INV-20240513-12580",
    type: "Payout",
    subType: "Withdrawal",
    relatedTo: "Wallet Balance",
    date: "May 13, 2024",
    time: "02:45 PM",
    amount: "AED 25,000.00",
    method: "Bank Transfer",
    methodDetail: "Emirates NBD",
    status: "Completed",
    icon: ArrowDown,
    iconColor: "text-green-600",
    bg: "bg-green-50"
  },
  {
    id: "TRX-20240512-089",
    invoice: "INV-20240512-12579",
    type: "Sale",
    subType: "Vehicle Sold",
    relatedTo: "Toyota Land Cruiser 2021",
    date: "May 12, 2024",
    time: "11:30 AM",
    amount: "AED 235,000.00",
    method: "Credit Card",
    methodDetail: "**** 4242",
    status: "Completed",
    icon: User,
    iconColor: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    id: "TRX-20240509-045",
    invoice: "BID-FEE-12576",
    type: "Fee Deduction",
    subType: "Bid Fee",
    relatedTo: "Ford F-150 Raptor 2021",
    date: "May 09, 2024",
    time: "09:10 AM",
    amount: "- AED 580.00",
    method: "Auto Deduct",
    methodDetail: "From Wallet",
    status: "Deducted",
    icon: Tag,
    iconColor: "text-purple-600",
    bg: "bg-purple-50"
  }
];

function SellerTransactionsTab() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#0B1E3D]">All Transactions</h2>
          <p className="text-sm text-slate-500">Here are all payment transactions of this seller.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 bg-white">
            <Calendar size={16} /> May 01, 2024 - May 31, 2024
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl">
        <table className="w-full border-collapse text-left text-sm">

          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-4 text-left min-w-45">Transaction ID</th>
              <th className="px-4 py-4 text-left min-w-55">Type</th>
              <th className="px-4 py-4 text-left min-w-45">Related To</th>
              <th className="px-4 py-4 text-left min-w-40">Date & Time</th>
              <th className="px-4 py-4 text-left min-w-35">Amount</th>
              <th className="px-4 py-4 text-left min-w-45">Payment Method</th>
              <th className="px-4 py-4 text-center min-w-30">Status</th>
              <th className="px-4 py-4 text-center min-w-25">Actions</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                {/* Transaction ID */}
                <td className="px-5 py-4">
                  <div className="font-medium text-slate-900">{tx.id}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {tx.invoice}
                  </div>
                </td>

                {/* Type */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${tx.bg} ${tx.iconColor}`}>
                      <tx.icon size={18} />
                    </div>

                    <div>
                      <div className="font-medium text-slate-900">
                        {tx.type}
                      </div>
                      <div className="text-xs text-slate-500">
                        ({tx.subType})
                      </div>
                    </div>
                  </div>
                </td>

                {/* Related To */}
                <td className="px-4 py-4 text-slate-700">
                  <div>{tx.relatedTo}</div>

                  {tx.invoice.startsWith("TRX") &&
                    tx.invoice.split("-").slice(1).join("-") && (
                      <div className="text-xs text-slate-400 mt-1">
                        LST-12579
                      </div>
                    )}
                </td>

                {/* Date & Time */}
                <td className="px-4 py-4 text-slate-700">
                  <div>{tx.date}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {tx.time}
                  </div>
                </td>

                {/* Amount */}
                <td className="px-4 py-4">
                  <span className="font-semibold text-slate-900">
                    {tx.amount}
                  </span>
                </td>

                {/* Payment Method */}
                <td className="px-4 py-4 text-slate-700">
                  <div>{tx.method}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {tx.methodDetail}
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-4 text-center">
                  <span
                    className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${tx.status === "Completed"
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-500"
                      }`}
                  >
                    {tx.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-4 text-center">
                  <button className="inline-flex items-center justify-center p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-[#0B1E3D] hover:border-slate-300 transition-colors">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default SellerTransactionsTab;