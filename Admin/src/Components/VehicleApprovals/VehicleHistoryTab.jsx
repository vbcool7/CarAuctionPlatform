
import React from "react";
import { Edit, Upload, Eye, HelpCircle, CheckCircle, Clock, CheckCircle2, XCircle, Circle } from "lucide-react";

function VehicleHistoryTab({ history }) {

  const iconMap = {
    "Request Submitted": Edit,
    "Documents Uploaded": Upload,
    "Under Review": Eye,
    "Additional Info Requested": HelpCircle,
    "Information Provided": CheckCircle,
    "Back to Review": Clock,
    "Approved": CheckCircle2,
    "Rejected": XCircle,
  };

  const statusColors = {
    "Pending Review": "bg-amber-100 text-amber-600",
    "Completed": "bg-green-100 text-green-600",
    "Under Review": "bg-blue-100 text-blue-600",
    "Info Requested": "bg-purple-100 text-purple-600",
    "Submitted": "bg-green-100 text-green-600",
  };

  return (
    <div>
      <h3 className="text-[13px] font-semibold text-[#0B1E3D] mb-1.5 md:mb-3">Approval History</h3>
      <p className="text-[11px] text-gray-500 mb-4">
        Track all actions and updates made on this vehicle approval request.
      </p>

      <div className="space-y-4">
        {history.map((item, i) => {
          const Icon = iconMap[item.action] || Circle;
          return (
            <div
              key={item.id}
              className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center ${statusColors[item.status] || "bg-slate-100 text-slate-500"}`}>
                  <Icon className="w-2.5 h-2.5 md:w-3 md:h-3" />
                </div>
                {i !== history.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1" />}
              </div>

              <div className="pb-4 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[12px] font-semibold text-[#0B1E3D]">{item.action}</p>
                  <span className="text-[9px] text-gray-400 whitespace-nowrap">{item.date}, {item.time}</span>
                </div>

                <p className="text-[11px] text-gray-600 mt-0.5">{item.description}</p>

                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-gray-500">{item.performedBy} · {item.role}</span>
                  <span className={`text-[9px] md:text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColors[item.status] || "bg-slate-100 text-slate-500"}`}>
                    {item.status}
                  </span>
                </div>

                {item.remarks && <p className="text-[11px] text-gray-500 italic mt-1">{item.remarks}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VehicleHistoryTab;