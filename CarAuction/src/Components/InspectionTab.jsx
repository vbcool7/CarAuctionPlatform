
import { Activity, Car, CircleCheck, CircleAlert, Cog, Palette, ShieldCheck, Sparkles, StickyNote,} from "lucide-react";

const formatLabel = (value) => {
    if (!value) return "—";

    return String(value)
        .replace(/_/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getConditionStyle = (value) => {
    switch (value) {
        case "excellent":
            return {
                bg: "bg-emerald-50",
                text: "text-emerald-700",
                border: "border-emerald-200",
                icon: CircleCheck,
            };

        case "good":
            return {
                bg: "bg-green-50",
                text: "text-green-700",
                border: "border-green-200",
                icon: CircleCheck,
            };

        case "fair":
            return {
                bg: "bg-amber-50",
                text: "text-amber-700",
                border: "border-amber-200",
                icon: CircleAlert,
            };

        case "poor":
            return {
                bg: "bg-red-50",
                text: "text-red-700",
                border: "border-red-200",
                icon: CircleAlert,
            };

        default:
            return {
                bg: "bg-slate-50",
                text: "text-slate-600",
                border: "border-slate-200",
                icon: Activity,
            };
    }
};

const ConditionCard = ({ label, value, icon: Icon }) => {

    const style = getConditionStyle(value);
    const StatusIcon = style.icon;

    return (
        <div
            className={`rounded-xl border ${style.border} ${style.bg} p-4`}
        >
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/80 flex items-center justify-center">
                    <Icon size={17} className="text-[#D97706]" />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                        {label}
                    </p>

                    <div className="flex items-center gap-1.5 mt-1">
                        <StatusIcon
                            size={14}
                            className={style.text}
                        />

                        <p className={`text-sm font-semibold ${style.text}`}>
                            {formatLabel(value)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({ label, value }) => (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
        <span className="text-xs text-slate-500">
            {label}
        </span>

        <span className="text-sm font-medium text-slate-800 text-right">
            {formatLabel(value)}
        </span>
    </div>
);

function InspectionTab({ vehicle }) {
    return (
        <div className="space-y-7">

            {/* Condition Overview */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck
                        size={18}
                        className="text-[#D97706]"
                    />

                    <h3 className="text-sm font-bold text-slate-900">
                        Condition Overview
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ConditionCard
                        icon={Car}
                        label="Overall Condition"
                        value={vehicle?.overallCondition}
                    />

                    <ConditionCard
                        icon={Cog}
                        label="Mechanical Condition"
                        value={vehicle?.mechanicalCondition}
                    />

                    <ConditionCard
                        icon={Sparkles}
                        label="Exterior Condition"
                        value={vehicle?.exteriorCondition}
                    />

                    <ConditionCard
                        icon={Activity}
                        label="Interior Condition"
                        value={vehicle?.interiorCondition}
                    />
                </div>
            </div>

            {/* Vehicle History */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck
                        size={18}
                        className="text-[#D97706]"
                    />

                    <h3 className="text-sm font-bold text-slate-900">
                        Vehicle History
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 rounded-xl border border-slate-200 px-4">
                    <div>
                        <InfoItem
                            label="Accident History"
                            value={vehicle?.accidentHistory}
                        />

                        <InfoItem
                            label="Title Status"
                            value={vehicle?.titleStatus}
                        />

                        <InfoItem
                            label="Paint Type"
                            value={vehicle?.paintType}
                        />
                    </div>

                    <div>
                        <InfoItem
                            label="Glass Condition"
                            value={vehicle?.glassCondition}
                        />

                        <InfoItem
                            label="Smoke Odor"
                            value={vehicle?.smokeOdor}
                        />

                        <InfoItem
                            label="Pet Friendly"
                            value={vehicle?.petFriendly}
                        />
                    </div>
                </div>
            </div>

            {/* Exterior & Interior Checks */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Palette
                        size={18}
                        className="text-[#D97706]"
                    />

                    <h3 className="text-sm font-bold text-slate-900">
                        Exterior & Interior Checks
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    <InfoItem
                        label="Sunroof"
                        value={vehicle?.sunroof}
                    />

                    <InfoItem
                        label="AC / Heater"
                        value={vehicle?.acHeater}
                    />

                    <InfoItem
                        label="Audio System"
                        value={vehicle?.audioSystem}
                    />

                    <InfoItem
                        label="Navigation"
                        value={vehicle?.navigation}
                    />

                    <InfoItem
                        label="Power Windows"
                        value={vehicle?.powerWindows}
                    />

                    <InfoItem
                        label="Power Locks"
                        value={vehicle?.powerLocks}
                    />

                </div>
            </div>

            {/* Additional Features */}
            {vehicle?.additionalFeatures && (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles
                            size={18}
                            className="text-[#D97706]"
                        />

                        <h3 className="text-sm font-bold text-slate-900">
                            Additional Features
                        </h3>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-600 leading-6">
                            {vehicle.additionalFeatures}
                        </p>
                    </div>
                </div>
            )}

            {/* Additional Notes */}
            {vehicle?.additionalNotes && (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <StickyNote
                            size={18}
                            className="text-[#D97706]"
                        />

                        <h3 className="text-sm font-bold text-slate-900">
                            Inspection Notes
                        </h3>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-600 leading-6">
                            {vehicle.additionalNotes}
                        </p>
                    </div>
                </div>
            )}

        </div>
    );
}

export default InspectionTab;