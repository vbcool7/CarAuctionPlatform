
import React from 'react';
import { Eye, MoreVertical, User, Car, Briefcase, ShieldAlert } from 'lucide-react';

const tasks = [
  {
    id: 1,
    title: 'Review New Seller Registrations',
    desc: 'Verify and approve new seller applications',
    module: 'Seller Management',
    icon: <User className="w-4 h-4 text-slate-500" />,
    assignedBy: 'Admin User',
    date: 'Apr 20, 2024',
    priority: 'High',
    dueDate: 'May 15, 2024',
    timeLeft: '2 days left',
    status: 'In Progress',
    progress: 60
  },
  {
    id: 2,
    title: 'Approve Vehicle Listings',
    desc: 'Review and approve vehicle listings submitted',
    module: 'Vehicle Approvals',
    icon: <Car className="w-4 h-4 text-slate-500" />,
    assignedBy: 'Admin User',
    date: 'Apr 20, 2024',
    priority: 'High',
    dueDate: 'May 14, 2024',
    timeLeft: '1 day left',
    status: 'In Progress',
    progress: 40
  },
  {
    id: 3,
    title: 'Verify Payments',
    desc: 'Check and verify pending seller payments',
    module: 'Payment Management',
    icon: <Briefcase className="w-4 h-4 text-slate-500" />,
    assignedBy: 'Admin User',
    date: 'Apr 19, 2024',
    priority: 'Medium',
    dueDate: 'May 16, 2024',
    timeLeft: '3 days left',
    status: 'Pending',
    progress: 0
  }
];

function StaffAssignedTaskTab() {
  return (
    <div>

      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-bold text-slate-900">Assigned Tasks</h2>
          <p className="text-[13px] text-slate-500 mt-1">View and manage tasks assigned to this staff member.</p>
        </div>

        <div className="flex justify-between">
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#D97706] border border-slate-200 rounded-lg hover:bg-amber-700 transition-all active:scale-95"
          >
            + Assign New Task
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl">
        <table className="w-full text-sm">

          {/* Table Header */}
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr className="text-[11px] font-bold uppercase text-slate-500">

              <th className="px-5 py-4 text-left min-w-65">
                Task Title
              </th>

              <th className="px-4 py-4 text-left min-w-45">
                Module
              </th>

              <th className="px-4 py-4 text-left min-w-30">
                Assigned By
              </th>

              <th className="px-4 py-4 text-center min-w-35">
                Priority
              </th>

              <th className="px-4 py-4 text-left min-w-35">
                Due Date
              </th>

              <th className="px-4 py-4 text-center min-w-38">
                Status
              </th>

              <th className="px-4 py-4 text-left min-w-45">
                Progress
              </th>

              <th className="px-4 py-4 text-center min-w-25">
                Actions
              </th>

            </tr>
          </thead>

          {/* Table Body */}
          <tbody>

            {tasks.map((task) => (

              <tr
                key={task.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >

                {/* Task */}
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">
                    {task.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {task.desc}
                  </p>
                </td>

                {/* Module */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-slate-700">
                    {task.icon}
                    <span>{task.module}</span>
                  </div>
                </td>

                {/* Assigned By */}
                <td className="px-4 py-4">
                  <p className="font-medium text-slate-900">
                    {task.assignedBy}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {task.date}
                  </p>
                </td>

                {/* Priority */}
                <td className="px-4 py-4 text-center">
                  <span
                    className={`inline-flex rounded-md px-2.5 py-1 text-[10px] font-semibold ${task.priority === "High"
                        ? "bg-red-50 text-red-600"
                        : "bg-orange-50 text-orange-600"
                      }`}
                  >
                    {task.priority}
                  </span>
                </td>

                {/* Due Date */}
                <td className="px-4 py-4">
                  <p className="text-slate-900">
                    {task.dueDate}
                  </p>

                  <p className="mt-1 text-xs text-red-500">
                    {task.timeLeft}
                  </p>
                </td>

                {/* Status */}
                <td className="px-4 py-4 text-center">
                  <span
                    className={`inline-flex rounded-md px-2.5 py-1 text-[10px] font-semibold ${task.status === "In Progress"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-orange-50 text-orange-600"
                      }`}
                  >
                    {task.status}
                  </span>
                </td>

                {/* Progress */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">

                    <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>

                    <span className="text-xs text-slate-600">
                      {task.progress}%
                    </span>

                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-4">
                  <div className="flex justify-center gap-2">

                    <button className="rounded-lg border border-slate-200 p-2 text-slate-400 transition hover:text-[#0B1E3D]">
                      <Eye size={16} />
                    </button>

                    <button className="rounded-lg border border-slate-200 p-2 text-slate-400 transition hover:text-[#0B1E3D]">
                      <MoreVertical size={16} />
                    </button>

                  </div>
                </td>

              </tr>

            ))}

          </tbody>

        </table>
      </div>
    </div>
  );
}

export default StaffAssignedTaskTab;