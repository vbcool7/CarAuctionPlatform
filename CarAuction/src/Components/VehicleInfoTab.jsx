const RowData = ({ label, value }) => (
  <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-100 last:border-0">
    <span className="text-slate-500 text-sm">{label}</span>

    <span className="text-slate-800 text-sm font-medium text-right max-w-[55%] break-words">
      {value !== undefined && value !== null && value !== ""
        ? value
        : "—"}
    </span>
  </div>
);

const formatLabel = (value) => {
  if (!value) return null;

  return String(value)
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

function VehicleInfoTab({ vehicle }) {
  if (!vehicle) {
    return (
      <p className="text-sm text-slate-500 py-6 text-center">
        Vehicle details are not available.
      </p>
    );
  }

  const {
    make,
    model,
    year,
    trim,
    vin,
    mileage,
    vehicleType,
    bodyType,
    fuelType,
    transmission,
    drivetrain,
    exteriorColor,
    interiorColor,
    country,
    emirate,
    city,
    zipCode,
    titleStatus,
    accidentHistory,
    vehicleDescription,
    engineSize,
    cylinders,
    doors,
    seats,
  } = vehicle;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
      {/* Basic Details */}
      <div>
        <p className="text-slate-500 text-xs uppercase tracking-wider mb-3 font-medium">
          Basic Details
        </p>

        <RowData label="Make" value={make} />
        <RowData label="Model" value={model} />
        <RowData label="Year" value={year} />
        <RowData label="Trim" value={trim} />
        <RowData label="VIN" value={vin} />

        <RowData label="Vehicle Type" value={formatLabel(vehicleType)} />
        <RowData label="Body Type" value={formatLabel(bodyType)} />
        <RowData label="Exterior Color" value={formatLabel(exteriorColor)} />
        <RowData label="Interior Color" value={formatLabel(interiorColor)} />
        <RowData label="Title Status" value={formatLabel(titleStatus)} />
        <RowData label="Accident History" value={formatLabel(accidentHistory)} />
      </div>

      {/* Technical Details */}
      <div>
        <p className="text-slate-500 text-xs uppercase tracking-wider mb-3 font-medium">
          Technical Details
        </p>

        <RowData label="Fuel Type" value={formatLabel(fuelType)} />
        <RowData label="Transmission" value={formatLabel(transmission)} />
        <RowData label="Drivetrain" value={formatLabel(drivetrain)} />

        <RowData
          label="Mileage"
          value={
            mileage != null
              ? `${Number(mileage).toLocaleString("en-US")} km`
              : null
          }
        />

        <RowData label="Engine Size" value={engineSize} />
        <RowData label="Cylinders" value={cylinders} />
        <RowData label="Doors" value={doors} />
        <RowData label="Seats" value={seats} />
      </div>

      {/* Location */}
      <div>
        <p className="text-slate-500 text-xs uppercase tracking-wider mb-3 font-medium">
          Location
        </p>

        <RowData label="Country" value={formatLabel(country)} />
        <RowData label="Emirate" value={formatLabel(emirate)} />
        <RowData label="City" value={city} />
        <RowData label="Zip Code" value={zipCode} />
      </div>

      {/* Description */}
      <div>
        <p className="text-slate-500 text-xs uppercase tracking-wider mb-3 font-medium">
          Description
        </p>

        <p className="text-sm text-slate-600 leading-6 whitespace-pre-wrap">
          {vehicleDescription || "No vehicle description available."}
        </p>
      </div>
    </div>
  );
}

export default VehicleInfoTab;