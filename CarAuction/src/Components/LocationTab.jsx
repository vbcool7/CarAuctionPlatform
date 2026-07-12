
import { MapPin, Phone, Building2, Globe } from "lucide-react";
import { RowData } from "./DetailTabs";

function LocationTab({ vehicle }) {
  const { yardName, address, contact, city } = vehicle.locationDetails || {};

  return (
    <div className="space-y-6">
      

      {/* Details Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Contact & Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
           <RowData label="City" value={city} />
           <RowData label="Phone" value={contact} />
           <RowData label="Region" value="UAE" />
           <RowData label="Operating Hours" value="08:00 AM - 06:00 PM" />
        </div>
      </div>
    </div>
  );
}

export default LocationTab;