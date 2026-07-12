
import { RatingBar } from "./DetailTabs";
import { Badge } from "./DetailTabs";

function ConditionTab({ vehicle }) {

  const {
    exteriorRating,
    interiorRating,
    mechanicalRating,
  } = vehicle;

  return (
    <div className="flex flex-col gap-6">

      <div>
        <p className="text-[#94A3B8] text-xs uppercase tracking-wider mb-4 font-medium">
          Condition Ratings
        </p>

        <div className="flex flex-col gap-4">
          <RatingBar label="Exterior" value={exteriorRating ?? 0} />
          <RatingBar label="Interior" value={interiorRating ?? 0} />
          <RatingBar label="Mechanical" value={mechanicalRating ?? 0} />
        </div>
      </div>

      <div>
        <p className="text-[#94A3B8] text-xs uppercase tracking-wider mb-3 font-medium">
          Overall Assessment
        </p>

        {exteriorRating && interiorRating && mechanicalRating ? (() => {
          const avg =
            (exteriorRating + interiorRating + mechanicalRating) / 3;

          const label =
            avg >= 8
              ? "Excellent"
              : avg >= 6
              ? "Good"
              : avg >= 4
              ? "Fair"
              : "Poor";

          const color =
            avg >= 8
              ? "success"
              : avg >= 6
              ? "warning"
              : "danger";

          return (
            <div className="flex items-center gap-3">
              <Badge color={color}>{label}</Badge>

              <span className="text-[#94A3B8] text-sm">
                Average score: {avg.toFixed(1)}/10
              </span>
            </div>
          );
        })() : (
          <p className="text-[#94A3B8] text-sm">
            Ratings not available yet.
          </p>
        )}
      </div>

    </div>
  );
}

export default ConditionTab;