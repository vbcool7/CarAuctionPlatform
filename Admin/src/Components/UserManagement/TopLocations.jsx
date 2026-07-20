
import React from 'react';

function TopLocations({ locations = [] }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm w-full max-w-md">
            {/* Header */}
            <h2 className="font-bold text-slate-900 mb-4">
                Top Locations
            </h2>

            {/* List */}
            <div className="space-y-3">
                {locations.map((loc, index) => {
                    const FlagIcon = loc.Flag;
                    return(
                         <div
                        key={index}
                        className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            {FlagIcon && <FlagIcon className="w-5 h-4" />}
                            <span className="text-sm text-gray-800">{loc.name}</span>
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                            {loc.count} ({loc.percentage}%)
                        </span>
                    </div>
                    )
                })}
            </div>
        </div>
    );
}

export default TopLocations;