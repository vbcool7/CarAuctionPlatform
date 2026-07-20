
import React from "react";

function QuickActionsCard({ actions }) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-[14px] md:text-base font-bold text-slate-900 mb-4">Quick Actions</h3>
      <div className="space-y-2">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <button
              key={i}
              onClick={action.onClick}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-[13px] md:text-sm font-medium transition-colors ${
                action.variant === 'danger'
                  ? 'text-red-600 border-red-100 hover:bg-red-50'
                  : 'text-slate-700 border-slate-100 hover:bg-amber-50 hover:text-[#D97706]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActionsCard;