
import { useState } from "react";

// vehicle info row
export const RowData = ({ label, value }) => (
  <div className="flex items-start justify-between py-2.5 border-b border-slate-100 last:border-0">
    <span className="text-slate-500 text-sm">{label}</span>
    <span className="text-slate-800 text-sm font-medium text-right max-w-[55%]">
      {value || "—"}
    </span>
  </div>
);

// vehicle ratings
export const RatingBar = ({ label, value, max = 10 }) => {

  const progrressRating = Math.min((value / max) * 100, 100);

  const color = progrressRating >= 70 ? "#10B981" : progrressRating >= 40 ? "#D97706" : "#EF4444";

  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-500 text-sm w-28 shrink-0">
        {label}
      </span>
      <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${progrressRating}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-slate-900 text-sm font-semibold w-10 text-right">
        {value}/{max}
      </span>
    </div>
  );
};

// badge
export const Badge = ({ children, color = "default" }) => {
  const colors = {
    default: "bg-slate-100 text-slate-600",
    success: "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30",
    warning: "bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/30",
    danger: "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
    ${colors[color]}`}>
      {children}
    </span>
  );
};

function DetailTabs({ tabs, defaultTab }) {

  const [activeTab, setActiveTab] = useState(
    defaultTab || tabs[0]?.key
  );

  const activeContent = tabs.find(
    (tab) => tab.key === activeTab
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">

      {/* Tab Bar */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 px-5 py-3.5 text-sm font-medium transition-colors border-b-2 -mb-px 
              ${activeTab === tab.key
                ? "text-[#D97706] border-[#D97706]"
                : "text-slate-500 border-transparent hover:text-[#D97706]"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5">

        {activeContent?.content}

      </div>
    </div>
  );
}

export default DetailTabs;