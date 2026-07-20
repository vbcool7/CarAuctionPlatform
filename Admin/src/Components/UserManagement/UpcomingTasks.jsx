
import React from 'react';

function UpcomingTasks({ tasks = [] }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm w-full max-w-md">
            {/* Header */}
            <h2 className="font-bold text-slate-900 mb-4">Upcoming Tasks</h2>

            {/* Task List */}
            <div className="space-y-3">
                {tasks.map((task, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            {/* Icon placeholder */}
                            <div className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded">
                                <span className="text-[10px]">📁</span>
                            </div>
                            <span className="text-gray-800 text-sm">{task.title}</span>
                        </div>
                        <span className="text-xs text-amber-500 font-medium">
                            Due: {task.dueDate}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UpcomingTasks;