
import { MapPin, Building2 } from "lucide-react";
import { RowData } from "./DetailTabs";

const formatLabel = (value) => {
    if (!value) return "—";

    return String(value)
        .replace(/_/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

function LocationTab({ vehicle }) {
    return (
        <div className="space-y-6">

            {/* Location Details */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                    <MapPin size={16} className="text-[#D97706]" />
                    Location Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                    <RowData
                        label="City"
                        value={vehicle?.city}
                    />

                    <RowData
                        label="Emirate"
                        value={formatLabel(vehicle?.emirate)}
                    />

                    <RowData
                        label="Country"
                        value={formatLabel(vehicle?.country)}
                    />

                    <RowData
                        label="Postal Code"
                        value={vehicle?.zipCode}
                    />
                </div>
            </div>

            {/* Vehicle Location Note */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <Building2
                        size={17}
                        className="text-[#D97706] mt-0.5 shrink-0"
                    />

                    <div>
                        <p className="text-sm font-bold text-slate-900">
                            Vehicle Location
                        </p>

                        <p className="text-xs text-slate-500 leading-5 mt-1.5">
                            This vehicle is located in{" "}
                            <span className="font-medium text-slate-700">
                                {vehicle?.city
                                    ? `${formatLabel(vehicle.city)}, ${formatLabel(vehicle?.emirate)}`
                                    : formatLabel(vehicle?.emirate)}
                            </span>
                            . Contact and pickup details may be provided
                            after the purchase or auction process.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LocationTab;