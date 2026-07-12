
import React from 'react';
import { Search, Filter, Calendar, Edit2, PauseCircle, Trash2, Eye } from 'lucide-react';

import { dummyStaff } from '../Data';

function StaffList({ staffs, onViewStaff, setCurrentPage }) {

  const getRoleStyle = (role) => {
    const styles = {
      'Admin': 'bg-purple-50 text-purple-700 border-purple-200',
      'Manager': 'bg-blue-50 text-blue-700 border-blue-200',
      'Coordinator': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'Support': 'bg-amber-50 text-amber-700 border-amber-200',
      'Reviewer': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Content Editor': 'bg-teal-50 text-teal-700 border-teal-200',
      'Finance Officer': 'bg-pink-50 text-pink-700 border-pink-200',
    };

    return styles[role] || 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mt-6">

      {/* top filter bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">

        <div className="lg:col-span-2">
          <label className="block text-xs font-semibold text-slate-500 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, phone or user ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* Dropdowns */}
        {['Role', 'Department', 'Status'].map((label) => (
          <div key={label}>
            <label className="block text-xs font-semibold text-slate-500 mb-2">{label}</label>
            <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100">
              <option>All</option>
            </select>
          </div>
        ))}

        {/* Date Picker & Filter Button */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-2">Join Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Select Date Range"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
              />
            </div>
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 mt-6 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all">
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
              <th className="px-6 py-4 font-semibold min-w-50">Staff</th>
              <th className="px-6 py-4 font-medium min-w-40">Staff ID</th>
              <th className="px-6 py-4 font-medium min-w-40">Role</th>
              <th className="px-6 py-4 font-medium min-w-40">Department</th>
              <th className="px-6 py-4 font-medium min-w-50">Email/Phone</th>
              <th className="px-6 py-4 font-medium min-w-40">Status</th>
              <th className="px-6 py-4 font-medium min-w-40">Last Login</th>
              <th className="px-6 py-4 font-medium min-w-40">Joined On</th>
              <th className="px-6 py-4 font-medium  min-w-50 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {dummyStaff.length > 0 ? (
              dummyStaff.map((staff, index) => (
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

                  {/* staff */}
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={staff.avatar}
                      alt="buyer avatar"
                      className="w-8 h-8 rounded-full bg-gray-200"
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{staff.name}</p>
                      <p className="text-xs text-gray-500">{staff.username}</p>
                    </div>
                  </td>

                  {/* staff id */}
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {staff.staffId}
                  </td>

                  {/* role */}
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border 
                      ${getRoleStyle(staff.role)}`}>
                      {staff.role}
                    </span>
                  </td>

                  {/* department */}
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {staff.department}
                  </td>

                  {/* email */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800 font-semibold">{staff.email}</p>
                    <p className="text-xs text-gray-500">{staff.phone}</p>
                  </td>

                  {/* status */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[12px] font-semibold border
                    ${staff.status === "active"
                          ? "bg-emerald-50 text-emerald-600 border-green-200"
                          : staff.status === "inactive"
                            ? "bg-purple-100 text-purple-600 border-purple-200"
                            : "bg-red-50 text-red-600 border-red-200"
                        }`}
                    >
                      {staff.status}
                    </span>
                  </td>

                  {/* last active */}
                  <td className="px-6 py-4 text-xs text-gray-600">
                    {staff.lastLogin}
                  </td>

                  {/* joined on */}
                  <td className="px-6 py-4 text-xs text-gray-600">
                    {staff.joinedOn}
                  </td>

                  {/* actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* <button
                        className="rounded-lg border border-gray-200 p-1.5 text-blue-600 hover:text-blue-400">
                        <Eye size={16} />
                      </button> */}
                      <button
                        onClick={() => onViewStaff(staff)}
                        className="rounded-lg border border-gray-200 p-1.5 text-amber-600 hover:text-amber-400">
                        <Edit2 size={16} />
                      </button>
                      <button className="rounded-lg border border-gray-200 p-1.5 text-red-600 hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  No staffs found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StaffList