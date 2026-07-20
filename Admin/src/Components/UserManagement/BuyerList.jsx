
import React, { useState } from 'react';
import { Search, Filter, Calendar, Edit2, PauseCircle, Trash2 } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { dummyBuyers } from '../Data';
import DeleteModal from './Shared/DeleteModal';

const filterConfig = [
  {
    label: 'Verification Status',
    key: 'verificationStatus',
    options: ['All', 'Verified', 'Unverified', 'Pending'],
  },
  {
    label: 'Status',
    key: 'status',
    options: ['All', 'Active', 'Inactive', 'Suspended'],
  },
  {
    label: 'KYC Status',
    key: 'kycStatus',
    options: ['All', 'Verified', 'Pending', 'Rejected'],
  },
];

function BuyerList({ setCurrentPage, onViewBuyer, buyers }) {

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // filter drop down
  const [filters, setFilters] = useState({
    verificationStatus: 'All',
    status: 'All',
    kycStatus: 'All',
  });

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // delete 
  const handleDeleteClick = (buyer) => {
    setDeleteTarget(buyer);
  };

  const handleDeleteConfirm = () => {
    console.log('deleting buyer:', deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm mt-6">

      {/* top filter part */}
      <div className="bg-white rounded-2xl md:border md:border-slate-100 md:shadow-sm p- sm:p-6 space-y-4">

        {/* Row 1: Search full width on its own */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, phone or user ID..."
              className="w-full pl-10 pr-4 py-2 md:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* Row 2: Dropdowns + date + button, wraps naturally */}
        <div className="flex flex-wrap gap-4 items-end">
          {filterConfig.map(({ label, key, options }) => (
            <div key={key} className="flex-1 min-w-35">
              <label className="block text-xs font-semibold text-slate-500 mb-2">{label}</label>
              <select
                value={filters[key]}
                onChange={(e) => updateFilter(key, e.target.value)}
                className="w-full px-3 py-2 md:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-100"
              >
                {options.map((opt) => (
                  <option
                    key={opt}
                    value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* date selector */}
          <div className="flex-1 min-w-40">
            <label className="block text-xs font-semibold text-slate-500 mb-2">Join Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 z-10 text-slate-400 pointer-events-none" size={18} />
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setStartDate(update[0]);
                  setEndDate(update[1]);
                }}
                placeholderText="Select Date Range"
                className="w-full pl-10 pr-4 py-2 md:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#D97706] transition-colors"
                calendarClassName="rounded-xl shadow-lg border-slate-200"
              />
            </div>
          </div>

          <button className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all whitespace-nowrap">
            <Filter size={18} />
            Filters
          </button>
        </div>

      </div>

      {/* table */}
      <div className="mt-6 w-full overflow-x-auto bg-white border border-gray-200 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-gray-800 uppercase bg-gray-100 border-b border-gray-200">
              <th className="px-6 py-4 font-semibold ">NA</th>
              <th className="px-6 py-4 font-semibold min-w-50">User</th>
              <th className="px-6 py-4 font-medium min-w-40">User ID</th>
              <th className="px-6 py-4 font-medium min-w-50">Email/Phone</th>
              <th className="px-6 py-4 font-medium min-w-40">KYC Status</th>
              <th className="px-6 py-4 font-medium min-w-40">Status</th>
              <th className="px-6 py-4 font-medium min-w-40">Joined On</th>
              <th className="px-6 py-4 font-medium min-w-40">Last Active</th>
              <th className="px-6 py-4 font-medium  min-w-50 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {dummyBuyers.length > 0 ? (
              dummyBuyers.map((buyer, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* check box */}
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded"
                    />
                  </td>

                  {/* user */}
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={buyer.avatar}
                      alt="buyer avatar"
                      className="w-8 h-8 rounded-full bg-gray-200"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{buyer.name}</p>
                      <p className="text-xs text-gray-500">{buyer.username}</p>
                    </div>
                  </td>

                  {/* user id */}
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {buyer.id}
                  </td>

                  {/* email */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800 font-semibold">{buyer.email}</p>
                    <p className="text-xs text-gray-500">{buyer.phone}</p>
                  </td>

                  {/* kyc status */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[12px] font-semibold border
              ${buyer.kycStatus === "verified"
                          ? "bg-emerald-50 text-emerald-600 border-green-200"
                          : buyer.kycStatus === "pending"
                            ? "bg-amber-50 text-amber-600 border-amber-200"
                            : "bg-red-50 text-red-600 border-red-200"
                        }`}
                    >
                      {buyer.kycStatus}
                    </span>
                  </td>

                  {/* status */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[12px] font-semibold border
                        ${buyer.status === "active"
                          ? "bg-emerald-50 text-emerald-600 border-green-200"
                          : buyer.status === "inactive"
                            ? "bg-purple-100 text-purple-600 border-purple-200"
                            : "bg-red-50 text-red-600 border-red-200"
                        }`}
                    >
                      {buyer.status}
                    </span>
                  </td>

                  {/* joined on */}
                  <td className="px-6 py-4 text-xs text-gray-600">
                    {buyer.joinedOn}
                  </td>

                  {/* last active */}
                  <td className="px-6 py-4 text-xs text-gray-600">
                    {buyer.lastActive}
                  </td>

                  {/* actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">

                      <button
                        onClick={() => onViewBuyer(buyer)}
                        className="rounded-lg border border-gray-200 p-1.5 text-blue-700 hover:text-blue-500">
                        <Edit2 size={16} />
                      </button>

                      <button className="rounded-lg border border-gray-200 p-1.5 text-amber-700 hover:text-amber-500">
                        <PauseCircle size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(buyer)}
                        className="rounded-lg border border-gray-200 p-1.5 text-red-700 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  No buyers found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* delete modal */}
      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName="Buyer"
      />
    </div>
  );
}

export default BuyerList;