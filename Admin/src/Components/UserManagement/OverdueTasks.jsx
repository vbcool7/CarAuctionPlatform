
import React from 'react';
import { ArrowRight } from 'lucide-react';

function OverdueTasks({ tasks = [] }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm w-full max-w-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-slate-900">Overdue Tasks</h2>
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
          Tasks are overdue
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-3 mb-4">
        {tasks.map((task, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded text-[10px]">
                {task.count}
              </span>
              <span className="text-gray-800 text-sm">{task.title}</span>
            </div>
            <span className="text-xs text-red-500 font-medium">
              Due: {task.dueDate}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Link */}
      <button className="flex justify-between items-center w-full text-[#D97706] text-xs pt-3 border-t border-gray-50">
        View All Overdue Tasks
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}

export default OverdueTasks;