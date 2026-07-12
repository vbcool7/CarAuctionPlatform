
function MaintenanceTab({ vehicle }) {
  const { maintenanceHistory = [] } = vehicle;

  if (maintenanceHistory.length === 0) {
    return (
      <p className="text-slate-500 text-sm">
        No maintenance records available.
      </p>
    );
  }

  return (
    <div className="relative border-l-2 border-slate-200 ml-3 flex flex-col gap-0">
      {maintenanceHistory.map((record, i) => (
        <div
          key={i}
          className="relative pl-6 pb-5 last:pb-0"
        >
          <div className="absolute -left-2.25 top-1 w-4 h-4 rounded-full bg-white border-2 border-[#D97706] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-800 text-sm font-medium">
                {record.service}
              </span>

              <span className="text-slate-500 text-xs">
                {record.date}
              </span>
            </div>

            {record.mileageAtService && (
              <span className="text-slate-500 text-xs">
                at {record.mileageAtService.toLocaleString("en-IN")} km
              </span>
            )}

            {record.notes && (
              <p className="text-slate-500 text-xs mt-1">
                {record.notes}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MaintenanceTab;