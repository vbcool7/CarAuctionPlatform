const formatEnumText = (str) => {
  if (str === undefined || str === null || str === "") return "N/A";

  return String(str)
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getStatusTheme = (value) => {
  switch (value) {
    case "excellent":
    case "factory_original":
    case "no_cracks":
    case "yes":
      return {
        dot: "bg-emerald-500",
        text: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
      };

    case "good":
      return {
        dot: "bg-green-500",
        text: "text-green-700",
        bg: "bg-green-50",
        border: "border-green-200",
      };

    case "minor_cracks":
      return {
        dot: "bg-amber-500",
        text: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
      };

    case "fair":
    case "needs_replacement":
    case "not_sure":
      return {
        dot: "bg-orange-500",
        text: "text-orange-700",
        bg: "bg-orange-50",
        border: "border-orange-200",
      };

    case "poor":
    case "major_cracks":
      return {
        dot: "bg-rose-500",
        text: "text-rose-700",
        bg: "bg-rose-50",
        border: "border-rose-200",
      };

    default:
      return {
        dot: "bg-slate-400",
        text: "text-slate-500",
        bg: "bg-slate-50",
        border: "border-slate-200",
      };
  }
};

function ConditionTab({ vehicle }) {
  const mainConditions = [
    { label: "Overall Condition", val: vehicle?.overallCondition },
    { label: "Mechanical", val: vehicle?.mechanicalCondition },
    { label: "Exterior", val: vehicle?.exteriorCondition },
    { label: "Interior", val: vehicle?.interiorCondition },
  ];

  const detailRows = [
    { label: "Accident History", val: vehicle?.accidentHistory },
    { label: "Paint Type", val: vehicle?.paintType },
    { label: "Repainted", val: vehicle?.repainted },
    { label: "Glass Condition", val: vehicle?.glassCondition },
    { label: "Tires Condition", val: vehicle?.tiresCondition },
    { label: "Sunroof", val: vehicle?.sunroof },
    { label: "Smoke Odor", val: vehicle?.smokeOdor },
    { label: "Pet Friendly", val: vehicle?.petFriendly },
  ];

  return (
    <div className="space-y-6">
      {/* Core Condition */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1 h-5 rounded-full bg-[#D97706]" />
          <h4 className="text-sm font-semibold text-[#0B1E3D]">
            Core Condition
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {mainConditions.map((item) => {
            const theme = getStatusTheme(item.val);

            return (
              <div
                key={item.label}
                className={`rounded-xl border ${theme.border} bg-white p-4 transition-shadow hover:shadow-sm`}
              >
                <p className="text-xs font-medium text-slate-500 mb-3">
                  {item.label}
                </p>

                <div
                  className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 ${theme.bg}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${theme.dot}`}
                  />
                  <span className={`text-sm font-semibold ${theme.text}`}>
                    {formatEnumText(item.val)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Additional Details */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1 h-5 rounded-full bg-[#D97706]" />
          <h4 className="text-sm font-semibold text-[#0B1E3D]">
            Additional Details
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 overflow-hidden bg-white">
          {detailRows.map((row) => {
            const theme = getStatusTheme(row.val);
            const hasValue =
              row.val !== undefined &&
              row.val !== null &&
              row.val !== "";

            return (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 transition-colors hover:bg-slate-50"
              >
                <span className="text-sm font-medium text-slate-600">
                  {row.label}
                </span>

                {hasValue ? (
                  <span
                    className={`inline-flex max-w-[60%] items-center rounded-md border px-2.5 py-1 text-right text-xs font-semibold ${theme.bg} ${theme.text} ${theme.border}`}
                  >
                    {formatEnumText(row.val)}
                  </span>
                ) : (
                  <span className="text-sm font-medium text-slate-400">
                    N/A
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default ConditionTab;