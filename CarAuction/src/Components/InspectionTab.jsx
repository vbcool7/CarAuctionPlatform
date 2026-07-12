
import { Badge } from "./DetailTabs";

function InspectionTab({ vehicle }) {
  const { inspectionNotes = [] } = vehicle;

  if (inspectionNotes.length === 0) {
    return (
      <p className="text-slate-500 text-sm">
        No inspection notes recorded.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {inspectionNotes.map((note, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
        >
          <span className="text-[#10B981] mt-0.5">✓</span>

          <div className="flex-1">
            <p className="text-slate-800 text-sm font-medium">
              {note.title}
            </p>

            {note.description && (
              <p className="text-slate-500 text-xs mt-0.5">
                {note.description}
              </p>
            )}
          </div>

          {note.status && (
            <Badge
              color={
                note.status === "pass"
                  ? "success"
                  : note.status === "fail"
                  ? "danger"
                  : "warning"
              }
            >
              {note.status}
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
}

export default InspectionTab;