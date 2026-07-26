
import React from "react";

function QuickActionsCard({ actions }) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-[13px] md:text-base font-bold text-slate-900 mb-3 md:mb-4">
        Quick Actions
      </h3>
      <div className="space-y-2">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <button
              key={i}
              onClick={action.onClick}
              className={`w-full min-w-0 flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-medium transition-colors
                ${action.variant === 'danger'
                  ? 'text-red-600 border-red-100 hover:bg-red-50'
                  : 'text-slate-700 border-slate-100 hover:bg-amber-50 hover:text-[#D97706]'
                }`}
            >
              <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActionsCard;