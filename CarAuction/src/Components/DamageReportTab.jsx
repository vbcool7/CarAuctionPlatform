
import { Badge } from "./DetailTabs";

function DamageReportTab({ vehicle }) {
  const { damageReport = [] } = vehicle;

  if (damageReport.length === 0) {
    return (
      <div className="flex items-center gap-2 p-3 bg-[#10B981]/5 border border-[#10B981]/20 rounded-lg">
        <span className="text-[#10B981]">✓</span>

        <p className="text-[#10B981] text-sm">
          No damage reported.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {damageReport.map((item, i) => (
        <div
          key={i}
          className="p-3 bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#EF4444] text-xs">⚠</span>

            <span className="text-slate-800 text-sm font-medium">
              {item.area}
            </span>

            {item.severity && (
              <Badge
                color={
                  item.severity === "minor"
                    ? "warning"
                    : "danger"
                }
              >
                {item.severity}
              </Badge>
            )}
          </div>

          {item.description && (
            <p className="text-slate-500 text-xs">
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default DamageReportTab;