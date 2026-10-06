const RowData = ({ label, value }) => (
  <div className="flex items-start justify-between py-2.5 border-b border-slate-100 last:border-0">
    <span className="text-slate-500 text-sm">{label}</span>

    <span className="text-slate-800 text-sm font-medium text-right max-w-[55%]">
      {value || "—"}
    </span>
  </div>
);

const formatLabel = (value) => {
  if (!value) return null;

  return value
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

function VehicleInfoTab({ vehicle }) {
  const {
    make,
    model,
    year,
    trim,
    mileage,
    vehicleType,
    bodyType,
    fuelType,
    transmission,
    drivetrain,
    exteriorColor,
    interiorColor,
  } = vehicle;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">

      {/* Basic Details */}
      <div>
        <p className="text-slate-500 text-xs uppercase tracking-wider mb-3 font-medium">
          Basic Details
        </p>

        <RowData label="Make" value={make} />
        <RowData label="Model" value={model} />
        <RowData label="Year" value={year} />
        <RowData label="Trim" value={trim} />

        <RowData
          label="Vehicle Type"
          value={formatLabel(vehicleType)}
        />

        <RowData
          label="Body Type"
          value={formatLabel(bodyType)}
        />

        <RowData
          label="Exterior Color"
          value={formatLabel(exteriorColor)}
        />

        <RowData
          label="Interior Color"
          value={formatLabel(interiorColor)}
        />
      </div>

      {/* Technical */}
      <div className="mt-6 sm:mt-0">
        <p className="text-slate-500 text-xs uppercase tracking-wider mb-3 font-medium">
          Technical Details
        </p>

        <RowData
          label="Fuel Type"
          value={formatLabel(fuelType)}
        />

        <RowData
          label="Transmission"
          value={formatLabel(transmission)}
        />

        <RowData
          label="Drive Type"
          value={formatLabel(drivetrain)}
        />

        <RowData
          label="Mileage"
          value={
            mileage != null
              ? `${mileage.toLocaleString("en-IN")} km`
              : null
          }
        />
      </div>

    </div>
  );
}

export default VehicleInfoTab;