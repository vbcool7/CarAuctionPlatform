
const RowData = ({ label, value }) => (
  <div className="flex items-start justify-between py-2.5 border-b border-slate-100 last:border-0">
    <span className="text-slate-500 text-sm">{label}</span>

    <span className="text-slate-800 text-sm font-medium text-right max-w-[55%]">
      {value || "—"}
    </span>
  </div>
);

function VehicleInfoTab({ vehicle }) {
  const {
    make,
    model,
    year,
    mileage,
    engine,
    engineSize,
    cylinders,
    vehicleType,
    fuelType,
    transmission,
    color,
    bodyStyle,
    doors,
    seats,
    driveType,
    vin,
  } = vehicle;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">

      <div>
        <p className="text-slate-500 text-xs uppercase tracking-wider mb-3 font-medium">
          Basic Details
        </p>

        <RowData label="Make" value={make} />
        <RowData label="Model" value={model} />
        <RowData label="Year" value={year} />
        <RowData label="Body Style" value={bodyStyle} />
        <RowData label="Color" value={color} />
        <RowData label="Doors" value={doors} />
        <RowData label="Seats" value={seats} />
        <RowData label="Vehicle Type" value={vehicleType} />
      </div>

      <div className="mt-6 sm:mt-0">
        <p className="text-slate-500 text-xs uppercase tracking-wider mb-3 font-medium">
          Technical
        </p>

        <RowData label="Engine" value={engine} />
        <RowData label="Engine Size" value={engineSize} />
        <RowData label="Fuel Type" value={fuelType} />
        <RowData label="Cylinder" value={cylinders} />
        <RowData label="Transmission" value={transmission} />
        <RowData label="Drive Type" value={driveType} />
        <RowData
          label="Mileage"
          value={mileage ? `${mileage.toLocaleString("en-IN")} km` : null}
        />

        <RowData
          label="VIN"
          value={
            vin ? (
              <span className="font-mono text-xs tracking-widest">
                {vin}
              </span>
            ) : null
          }
        />
      </div>

    </div>
  );
}

export default VehicleInfoTab;