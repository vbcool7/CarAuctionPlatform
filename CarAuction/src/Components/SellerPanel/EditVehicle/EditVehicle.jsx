
import React, { createContext, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { toast } from "react-toastify";

import FormInputFields from '../../SellerRegistration/FormInputFields';
import { canSellerEdit, sellerEditBlockedMessage } from "../../../utils/vehicleRules";
import { useSellerEditVehicle, useVehicleDetail } from "../../../hook/useVehicle";

// formatter
const formatLabel = (value) => {
    if (!value) return "---";

    return String(value)
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

// context field
const FieldContext = createContext(null);

const Field = ({ name, label, type = "text", options, required = false, disabled = false, placeholder, format = false }) => {

    const { formData, handleChange, canEdit } = React.useContext(FieldContext);
    const value = formData[name] ?? "";

    const opts =
        type === "select" &&
            options &&
            value !== "" &&
            !options.some((o) => String(o.value ?? o) === String(value))
            ? [...options, { label: String(value), value: String(value) }]
            : options;

    return (
        <FormInputFields
            label={label}
            type={type}
            name={name}
            value={format ? formatLabel(value) : value}
            onChange={handleChange}
            options={opts}
            required={required}
            disabled={disabled || !canEdit}
            placeholder={placeholder}
        />
    );
};

// drop-down options
const vehicleTypeOptions = [
    { label: "Sedan", value: "sedan" },
    { label: "SUV", value: "suv" },
    { label: "Hatchback", value: "hatchback" },
    { label: "Coupe", value: "coupe" },
    { label: "Convertible", value: "convertible" },
    { label: "Wagon", value: "wagon" },
    { label: "Pickup Truck", value: "pickup_truck" },
    { label: "Van", value: "van" },
    { label: "Minivan", value: "minivan" },
    { label: "Sports Car", value: "sports_car" },
    { label: "Luxury Car", value: "luxury_car" },
    { label: "Electric Vehicle", value: "electric_vehicle" },
    { label: "Motorcycle", value: "motorcycle" },
];

const bodyTypeOptions = [
    { label: "Sedan", value: "sedan" },
    { label: "SUV", value: "suv" },
    { label: "Hatchback", value: "hatchback" },
    { label: "Coupe", value: "coupe" },
    { label: "Convertible", value: "convertible" },
    { label: "Wagon", value: "wagon" },
    { label: "Pickup Truck", value: "pickup_truck" },
    { label: "Van", value: "van" },
    { label: "Minivan", value: "minivan" },
    { label: "Roadster", value: "roadster" },
    { label: "Crossover", value: "crossover" },
];

const transmissionOptions = [
    { label: "Automatic", value: "automatic" },
    { label: "Manual", value: "manual" },
    { label: "CVT", value: "cvt" },
    { label: "Semi Automatic", value: "semi_automatic" },
];

const emirateOptions = [
    { value: "abu_dhabi", label: "Abu Dhabi" },
    { value: "dubai", label: "Dubai" },
    { value: "sharjah", label: "Sharjah" },
    { value: "ajman", label: "Ajman" },
    { value: "umm_al_quwain", label: "Umm Al Quwain" },
    { value: "ras_al_khaimah", label: "Ras Al Khaimah" },
    { value: "fujairah", label: "Fujairah" },
];

const fuelOptions = [
    { label: "Petrol", value: "petrol" },
    { label: "Diesel", value: "diesel" },
    { label: "Electric", value: "electric" },
    { label: "Hybrid", value: "hybrid" },
    { label: "Plug-in Hybrid", value: "plug_in_hybrid" },
    { label: "CNG", value: "cng" },
    { label: "LPG", value: "lpg" },
];

const drivetrainOptions = [
    { label: "FWD", value: "fwd" },
    { label: "RWD", value: "rwd" },
    { label: "AWD", value: "awd" },
    { label: "4WD", value: "4wd" },
];

const colorOptions = [
    { label: "Black", value: "black" },
    { label: "White", value: "white" },
    { label: "Silver", value: "silver" },
    { label: "Grey", value: "grey" },
    { label: "Red", value: "red" },
    { label: "Blue", value: "blue" },
    { label: "Green", value: "green" },
    { label: "Brown", value: "brown" },
    { label: "Gold", value: "gold" },
    { label: "Beige", value: "beige" },
    { label: "Orange", value: "orange" },
    { label: "Yellow", value: "yellow" },
    { label: "Purple", value: "purple" },
    { label: "Other", value: "other" },
];

const interiorColorOptions = [
    { label: "Black", value: "black" },
    { label: "White", value: "white" },
    { label: "Grey", value: "grey" },
    { label: "Beige", value: "beige" },
    { label: "Brown", value: "brown" },
    { label: "Tan", value: "tan" },
    { label: "Red", value: "red" },
    { label: "Blue", value: "blue" },
    { label: "Other", value: "other" },
];

const conditionOptions = [
    { label: "Excellent", value: "excellent" },
    { label: "Good", value: "good" },
    { label: "Fair", value: "fair" },
    { label: "Poor", value: "poor" },
];

const yesNoOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
    { label: "Not Sure", value: "not_sure" },
];

const yesNoSimpleOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
];

const titleStatusOptions = [
    { label: "Clean", value: "clean" },
    { label: "Salvage", value: "salvage" },
    { label: "Rebuilt", value: "rebuilt" },
];

const doorsOptions = ["2", "3", "4", "5"].map((value) => ({
    label: value,
    value,
}));

const seatsOptions = ["2", "3", "4", "5", "6", "7", "8", "9"].map(
    (value) => ({
        label: value,
        value,
    })
);

const keyOptions = [
    { label: "Standard", value: "standard" },
    { label: "Remote", value: "remote" },
    { label: "Smart Key", value: "smart_key" },
    { label: "Keyless Entry", value: "keyless_entry" },
    { label: "Keyless Start", value: "keyless_start" },
];

const glassOptions = [
    { label: "No Cracks", value: "no_cracks" },
    { label: "Minor Cracks", value: "minor_cracks" },
    { label: "Major Cracks", value: "major_cracks" },
];

const tireConditionOptions = [
    { label: "Excellent", value: "excellent" },
    { label: "Good", value: "good" },
    { label: "Fair", value: "fair" },
    { label: "Poor", value: "poor" },
    { label: "Needs Replacement", value: "needs_replacement" },
];

const seatMaterialOptions = [
    { label: "Fabric", value: "fabric" },
    { label: "Leather", value: "leather" },
    { label: "Synthetic Leather", value: "synthetic_leather" },
    { label: "Suede", value: "suede" },
    { label: "Alcantara", value: "alcantara" },
    { label: "Vinyl", value: "vinyl" },
];

const sunroofOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
    { label: "Panoramic", value: "panoramic" },
];

const navigationOptions = [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
    { label: "Built In", value: "built_in" },
];

const getInitialFormData = (vehicle) => {
    const fields = [
        "vin",
        "vehicleType",
        "make",
        "model",
        "year",
        "trim",
        "bodyType",
        "mileage",
        "transmission",
        "fuelType",
        "drivetrain",
        "exteriorColor",
        "interiorColor",
        "vehicleDescription",
        "country",
        "emirate",
        "city",
        "zipCode",
        "titleStatus",
        "accidentHistory",
        "overallCondition",
        "mechanicalCondition",
        "interiorCondition",
        "exteriorCondition",
        "doors",
        "seats",
        "engineSize",
        "cylinders",
        "keyType",
        "additionalFeatures",
        "numberOfKeys",
        "repainted",
        "smokeOdor",
        "petFriendly",
        "paintType",
        "glassCondition",
        "tiresCondition",
        "tireBrand",
        "tireSize",
        "seatMaterial",
        "sunroof",
        "acHeater",
        "audioSystem",
        "navigation",
        "powerWindows",
        "powerLocks",
        "additionalNotes",
        "buyNowPrice",
        "startingBidPrice",
        "reservePrice",
    ];

    const data = {};

    fields.forEach((field) => {
        data[field] = vehicle?.[field] ?? "";
    });

    return data;
};

function EditVehicle({ vehicleId, setCurrentPage }) {

    const { data, isLoading, isError } = useVehicleDetail(vehicleId);
    const { mutate: sellerEditVehicle, isPending: isEditing } = useSellerEditVehicle();

    const vehicle = data?.data;

    const [activeTab, setActiveTab] = useState("vehicle");
    const [formData, setFormData] = useState({});
    const [existingImages, setExistingImages] = useState([]);
    const [existingDocuments, setExistingDocuments] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [newDocuments, setNewDocuments] = useState([]);
    const [removeImageIds, setRemoveImageIds] = useState([]);
    const [removeDocumentIds, setRemoveDocumentIds] = useState([]);

    useEffect(() => {
        if (!vehicle) return;

        setFormData(getInitialFormData(vehicle));

        setExistingImages(vehicle.images || []);
        setExistingDocuments(vehicle.documents || []);

        setNewImages([]);
        setNewDocuments([]);

        setRemoveImageIds([]);
        setRemoveDocumentIds([]);
    }, [vehicle]);

    const adminStatus = vehicle?.adminStatus;
    const auctionStatus = vehicle?.auctionStatus;

    const canEdit = canSellerEdit(vehicle);
    const isRejected = adminStatus === "rejected";
    const isDraft = auctionStatus === "draft";
    const canEditVin = isDraft;

    const willResubmit = adminStatus !== "pending";
    const isUpcomingApproved = auctionStatus === "upcoming" && adminStatus === "approved";;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // img handler
    const handleImages = (e) => {
        const picked = Array.from(e.target.files || []);
        e.target.value = "";
        if (!picked.length) return;

        const validFiles = picked.filter((f) => f.type.startsWith("image/"));
        if (validFiles.length !== picked.length) toast.error("Only image files are allowed");
        if (!validFiles.length) return;

        const total =
            existingImages.length - removeImageIds.length + newImages.length + validFiles.length;
        if (total > 15) {
            toast.error("Maximum 15 images allowed");
            return;
        }
        setNewImages((prev) => [...prev, ...validFiles]);
    };

    const removeExistingImage = (image) => {
        const remaining = existingImages.length - removeImageIds.length + newImages.length;
        if (remaining <= 1) {
            toast.error("At least one image is required");
            return;
        }
        setRemoveImageIds((prev) => [...prev, String(image._id)]);
    };

    const removeNewImage = (index) => {
        const remaining = existingImages.length - removeImageIds.length + newImages.length;
        if (remaining <= 1) {
            toast.error("At least one image is required");
            return;
        }
        setNewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const undoRemoveImage = (image) => {
        setRemoveImageIds((prev) =>
            prev.filter((id) => id !== String(image._id))
        );
    };

    // doc handler
    const handleDocuments = (e) => {
        const files = Array.from(e.target.files || []);

        if (!files.length) return;

        const total =
            existingDocuments.length -
            removeDocumentIds.length +
            newDocuments.length +
            files.length;

        if (total > 5) {
            toast.error("Maximum 5 documents allowed");
            return;
        }

        setNewDocuments((prev) => [...prev, ...files]);
        e.target.value = "";
    };

    const removeExistingDocument = (document) => {
        setRemoveDocumentIds((prev) => [
            ...prev,
            String(document._id),
        ]);
    };

    const undoRemoveDocument = (document) => {
        setRemoveDocumentIds((prev) =>
            prev.filter((id) => id !== String(document._id))
        );
    };

    const removeNewDocument = (index) => {
        setNewDocuments((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    // submit
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!canEdit) {
            toast.error(sellerEditBlockedMessage(vehicle));
            return;
        }

        const imagesAfter = existingImages.length - removeImageIds.length + newImages.length;
        const docsAfter = existingDocuments.length - removeDocumentIds.length + newDocuments.length;

        if (imagesAfter < 1) return toast.error("At least one image is required");
        if (imagesAfter > 15) return toast.error("Maximum 15 images allowed");
        if (docsAfter > 5) return toast.error("Maximum 5 documents allowed");

        const form = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (key === "vin" && !canEditVin) return;
            if (value !== undefined && value !== null) form.append(key, value);
        });

        newImages.forEach((file) => form.append("images", file));
        newDocuments.forEach((file) => form.append("documents", file));
        removeImageIds.forEach((id) => form.append("removeImageIds", id));
        removeDocumentIds.forEach((id) => form.append("removeDocumentIds", id));

        sellerEditVehicle(
            { id: vehicleId, formData: form },
            {
                onSuccess: (res) => {
                    toast.success(res?.message || "Vehicle updated successfully");
                    setCurrentPage?.("my-vehicles");
                },
                onError: (err) => {
                    toast.error(err?.response?.data?.message || "Failed to update vehicle");
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-100 flex items-center justify-center">
                <div className="text-sm text-gray-500">
                    Loading vehicle details...
                </div>
            </div>
        );
    }

    if (isError || !vehicle) {
        return (
            <div className="min-h-100 flex flex-col items-center justify-center">
                <p className="text-sm text-gray-500">
                    Vehicle details not found
                </p>

                <button
                    onClick={() => setCurrentPage?.("my-vehicles")}
                    className="mt-4 text-sm font-medium text-[#D97706]"
                >
                    Back to My Vehicles
                </button>
            </div>
        );
    }

    // block: except draft/upcoming 
    if (!canEdit) {
        return (
            <div className="p-4 md:p-6">
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
                    <h3 className="text-sm font-semibold text-[#0B1E3D]"> Vehicle cannot be edited</h3>
                    <p className="text-xs text-gray-500 mt-2">{sellerEditBlockedMessage(vehicle)}</p>

                    <button
                        onClick={() => setCurrentPage?.("my-vehicles")}
                        className="mt-5 px-4 py-2 rounded-lg bg-[#0B1E3D] text-white text-xs font-medium">
                        Back to My Vehicles
                    </button>
                </div>
            </div>
        );
    }

    return (
        <FieldContext.Provider value={{ formData, handleChange, canEdit, }}>
            <div className="pb-6">

                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                    <button
                        type="button"
                        onClick={() =>
                            setCurrentPage?.("my-vehicles")
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:text-[#0B1E3D] hover:bg-slate-50">
                        <ArrowLeft size={16} />
                    </button>

                    <div>
                        <h2 className="text-base md:text-lg font-semibold text-[#0B1E3D]"> Edit Vehicle</h2>

                        <p className="text-[12px] text-gray-500 mt-0.5">
                            {vehicle.listingId || "---"} ·{" "}
                            {formatLabel(vehicle.make)} {formatLabel(vehicle.model)}
                        </p>
                    </div>
                </div>

                {/* Status information */}
                <div className="mb-5 space-y-3">
                    {/* Status Pills Container */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
                        <div className="flex flex-wrap items-center gap-6">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                    Admin Status
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-slate-50 text-[#0B1E3D] border border-slate-200/60 shadow-2xs">
                                    {formatLabel(adminStatus)}
                                </span>
                            </div>

                            <div className="h-8 w-px bg-slate-100 hidden sm:block" />

                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                                    Auction Status
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-slate-50 text-[#0B1E3D] border border-slate-200/60 shadow-2xs">
                                    {formatLabel(auctionStatus)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Rejected Alert Banner */}
                    {isRejected && (
                        <div className="px-4 py-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-start gap-3 shadow-2xs">
                            <span className="text-rose-600 text-base leading-none mt-0.5">⚠️</span>
                            <div className="space-y-0.5">
                                <p className="text-xs font-bold text-rose-800">
                                    This vehicle was rejected. Update it and resubmit for review.
                                </p>
                                {vehicle.rejectionReason && (
                                    <p className="text-xs font-medium text-rose-600">
                                        <span className="font-semibold">Reason:</span> {vehicle.rejectionReason}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Upcoming Approved Alert Banner */}
                    {isUpcomingApproved && (
                        <div className="px-4 py-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 shadow-2xs">
                            <span className="text-amber-600 text-base leading-none mt-0.5">ℹ️</span>
                            <p className="text-xs font-medium text-amber-800 leading-relaxed">
                                <strong className="font-bold">Notice:</strong> After you save, this listing goes back to admin review and stays hidden from buyers until it is approved again. If it is not approved before the auction start time, it will need to be rescheduled by the admin.
                            </p>
                        </div>
                    )}
                </div>

                {/* form */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

                    {/* tab */}
                    <div className="border-b border-slate-200 overflow-x-auto mb-6 px-3 pt-3">
                        <div className="flex min-w-max gap-6 sm:gap-8">
                            {[
                                ["vehicle", "Vehicle Details"],
                                ["condition", "Condition & Features"],
                                ["images", "Images"],
                                ["documents", "Documents"],
                                ["auction", "Auction"],
                            ].map(([key, label]) => {
                                const isActive = activeTab === key;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setActiveTab(key)}
                                        className={`relative pb-3 pt-1 text-xs md:text-sm font-semibold transition-colors whitespace-nowrap flex items-center gap-2 ${isActive
                                            ? "text-[#0B1E3D]"
                                            : "text-slate-400 hover:text-slate-700"
                                            }`}
                                    >
                                        <span>{label}</span>

                                        {isActive && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D97706] rounded-full" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* ----------------------- VEHICLE INFO ----------------------- */}
                        {activeTab === "vehicle" && (
                            <div className="p-4 md:p-6">

                                <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">Vehicle Information </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                    <Field
                                        name="vin"
                                        label="VIN"
                                        required
                                        disabled={!canEditVin}
                                        placeholder="Enter VIN"
                                    />

                                    <Field
                                        name="vehicleType"
                                        label="Vehicle Type"
                                        type="select"
                                        options={vehicleTypeOptions}
                                        required
                                    />

                                    <Field
                                        name="make"
                                        label="Make"
                                        required
                                    />

                                    <Field
                                        name="model"
                                        label="Model"
                                        required
                                    />

                                    <Field
                                        name="year"
                                        label="Year"
                                        type="select"
                                        required
                                        options={Array.from(
                                            { length: new Date().getFullYear() + 1 - 1980 + 1 },
                                            (_, i) => {
                                                const year = new Date().getFullYear() + 1 - i;
                                                return {
                                                    value: year,
                                                    label: year,
                                                };
                                            }
                                        )}
                                    />

                                    <Field
                                        name="trim"
                                        label="Trim"
                                    />

                                    <Field
                                        name="bodyType"
                                        label="Body Type"
                                        type="select"
                                        options={bodyTypeOptions}
                                        required
                                    />

                                    <Field
                                        name="mileage"
                                        label="Mileage"
                                        type="number"
                                        required
                                    />

                                    <Field
                                        name="transmission"
                                        label="Transmission"
                                        type="select"
                                        options={transmissionOptions}
                                        required
                                    />

                                    <Field
                                        name="fuelType"
                                        label="Fuel Type"
                                        type="select"
                                        options={fuelOptions}
                                        required
                                    />

                                    <Field
                                        name="drivetrain"
                                        label="Drivetrain"
                                        type="select"
                                        options={drivetrainOptions}
                                        required
                                    />

                                    <Field
                                        name="exteriorColor"
                                        label="Exterior Color"
                                        type="select"
                                        options={colorOptions}
                                        required
                                    />

                                    <Field
                                        name="interiorColor"
                                        label="Interior Color"
                                        type="select"
                                        options={interiorColorOptions}
                                        required
                                    />

                                    <Field
                                        name="titleStatus"
                                        label="Title Status"
                                        type="select"
                                        options={titleStatusOptions}
                                        required
                                    />

                                    <Field
                                        name="accidentHistory"
                                        label="Accident History"
                                        type="select"
                                        options={yesNoOptions}
                                        required
                                    />

                                    <Field name="country" label="Country" disabled format />

                                    <Field
                                        name="emirate"
                                        label="Emirate"
                                        type="select"
                                        options={emirateOptions}
                                        required
                                    />

                                    <Field
                                        name="city"
                                        label="City"
                                        required
                                    />

                                    <Field
                                        name="zipCode"
                                        label="Zip Code"
                                    />
                                </div>

                                <div className="mt-4">
                                    <Field
                                        name="vehicleDescription"
                                        label="Vehicle Description"
                                        type="textarea"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* ----------------------- CONDITONS ----------------------- */}
                        {activeTab === "condition" && (
                            <div className="p-4 md:p-6">

                                <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4">
                                    Condition
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                    <Field
                                        name="overallCondition"
                                        label="Overall Condition"
                                        type="select"
                                        options={conditionOptions}
                                        required
                                    />

                                    <Field
                                        name="mechanicalCondition"
                                        label="Mechanical Condition"
                                        type="select"
                                        options={conditionOptions}
                                        required
                                    />

                                    <Field
                                        name="interiorCondition"
                                        label="Interior Condition"
                                        type="select"
                                        options={conditionOptions}
                                        required
                                    />

                                    <Field
                                        name="exteriorCondition"
                                        label="Exterior Condition"
                                        type="select"
                                        options={conditionOptions}
                                        required
                                    />

                                    <Field
                                        name="doors"
                                        label="Doors"
                                        type="select"
                                        options={doorsOptions}
                                        required
                                    />

                                    <Field
                                        name="seats"
                                        label="Seats"
                                        type="select"
                                        options={seatsOptions}
                                        required
                                    />

                                    <Field
                                        name="engineSize"
                                        label="Engine Size"
                                        required
                                    />

                                    <Field
                                        name="cylinders"
                                        label="Cylinders"
                                    />

                                    <Field
                                        name="keyType"
                                        label="Key Type"
                                        type="select"
                                        options={keyOptions}
                                    />

                                    <Field
                                        name="numberOfKeys"
                                        label="Number of Keys"
                                        type="number"
                                    />

                                    <Field
                                        name="repainted"
                                        label="Repainted"
                                        type="select"
                                        options={yesNoOptions}
                                    />

                                    <Field
                                        name="smokeOdor"
                                        label="Smoke Odor"
                                        type="select"
                                        options={yesNoOptions}
                                    />

                                    <Field
                                        name="petFriendly"
                                        label="Pet Friendly"
                                        type="select"
                                        options={yesNoOptions}
                                    />

                                    <Field
                                        name="paintType"
                                        label="Paint Type"
                                        type="select"
                                        options={[
                                            {
                                                label: "Factory Original",
                                                value: "factory_original",
                                            },
                                            {
                                                label: "Repainted",
                                                value: "repainted",
                                            },
                                        ]}
                                    />

                                    <Field
                                        name="glassCondition"
                                        label="Glass Condition"
                                        type="select"
                                        options={glassOptions}
                                    />

                                    <Field
                                        name="tiresCondition"
                                        label="Tires Condition"
                                        type="select"
                                        options={tireConditionOptions}
                                    />

                                    <Field
                                        name="tireBrand"
                                        label="Tire Brand"
                                    />

                                    <Field
                                        name="tireSize"
                                        label="Tire Size"
                                    />

                                    <Field
                                        name="seatMaterial"
                                        label="Seat Material"
                                        type="select"
                                        options={seatMaterialOptions}
                                    />

                                    <Field
                                        name="sunroof"
                                        label="Sunroof"
                                        type="select"
                                        options={sunroofOptions}
                                    />

                                    <Field
                                        name="acHeater"
                                        label="AC / Heater"
                                    />

                                    <Field
                                        name="audioSystem"
                                        label="Audio System"
                                    />

                                    <Field
                                        name="navigation"
                                        label="Navigation"
                                        type="select"
                                        options={navigationOptions}
                                    />

                                    <Field
                                        name="powerWindows"
                                        label="Power Windows"
                                        type="select"
                                        options={yesNoSimpleOptions}
                                    />

                                    <Field
                                        name="powerLocks"
                                        label="Power Locks"
                                        type="select"
                                        options={yesNoSimpleOptions}
                                    />
                                </div>

                                <div className="mt-4">
                                    <Field
                                        name="additionalFeatures"
                                        label="Additional Features"
                                        type="textarea"
                                    />
                                </div>

                                <div className="mt-4">
                                    <Field
                                        name="additionalNotes"
                                        label="Additional Notes"
                                        type="textarea"
                                    />
                                </div>
                            </div>
                        )}

                        {/* ----------------------- IMAGES ----------------------- */}
                        {activeTab === "images" && (
                            <div className="p-4 md:p-6">

                                <div className="flex items-center justify-between gap-3 mb-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                            Vehicle Images
                                        </h3>

                                        <p className="text-[11px] text-gray-500 mt-1">
                                            Minimum 1 and maximum 15 images
                                        </p>
                                    </div>

                                    <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0B1E3D] text-white text-[11px] font-medium cursor-pointer">
                                        <Upload size={14} />
                                        Add Images

                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={handleImages}
                                            disabled={!canEdit}
                                        />
                                    </label>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                                    {existingImages.map(
                                        (image, index) => {
                                            const isRemoved =
                                                removeImageIds.includes(
                                                    String(image._id)
                                                );

                                            return (
                                                <div
                                                    key={
                                                        image._id ||
                                                        index
                                                    }
                                                    className={`relative aspect-[4/3] rounded-xl overflow-hidden border ${isRemoved
                                                        ? "border-rose-300 opacity-50"
                                                        : "border-slate-200"
                                                        }`}
                                                >
                                                    <img
                                                        src={image.url}
                                                        alt={`Vehicle ${index + 1
                                                            }`}
                                                        className="w-full h-full object-cover"
                                                    />

                                                    {index === 0 &&
                                                        !isRemoved && (
                                                            <span className="absolute top-2 left-2 px-2 py-1 rounded-md bg-[#0B1E3D] text-white text-[10px] font-medium">
                                                                Cover
                                                            </span>
                                                        )}

                                                    {isRemoved ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                undoRemoveImage(
                                                                    image
                                                                )
                                                            }
                                                            className="absolute bottom-2 left-2 right-2 py-1.5 rounded-md bg-white text-[#0B1E3D] text-[10px] font-medium"
                                                        >
                                                            Undo Remove
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeExistingImage(
                                                                    image
                                                                )
                                                            }
                                                            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 text-rose-600"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        }
                                    )}

                                    {newImages.map(
                                        (file, index) => (
                                            <div
                                                key={`${file.name}-${index}`}
                                                className="relative aspect-[4/3] rounded-xl overflow-hidden border border-amber-300 bg-slate-50"
                                            >
                                                <img
                                                    src={URL.createObjectURL(
                                                        file
                                                    )}
                                                    alt={file.name}
                                                    className="w-full h-full object-cover"
                                                />

                                                <span className="absolute top-2 left-2 px-2 py-1 rounded-md bg-[#D97706] text-white text-[10px] font-medium">
                                                    New
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeNewImage(
                                                            index
                                                        )
                                                    }
                                                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 text-rose-600"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )
                                    )}

                                    {!existingImages.length &&
                                        !newImages.length && (
                                            <div className="col-span-full py-12 text-center border border-dashed border-slate-200 rounded-xl">
                                                <ImageIcon
                                                    size={28}
                                                    className="mx-auto text-slate-300"
                                                />

                                                <p className="text-xs text-gray-400 mt-2">
                                                    No images available
                                                </p>
                                            </div>
                                        )}
                                </div>
                            </div>
                        )}

                        {/* ----------------------- DOCUMENTS ----------------------- */}
                        {activeTab === "documents" && (
                            <div className="p-4 md:p-6">

                                <div className="flex items-center justify-between gap-3 mb-4">
                                    <div>
                                        <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                            Vehicle Documents
                                        </h3>

                                        <p className="text-[11px] text-gray-500 mt-1">
                                            Maximum 5 documents
                                        </p>
                                    </div>

                                    <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0B1E3D] text-white text-[11px] font-medium cursor-pointer">
                                        <Upload size={14} />
                                        Add Documents

                                        <input
                                            type="file"
                                            accept=".pdf,image/*"
                                            multiple
                                            className="hidden"
                                            onChange={
                                                handleDocuments
                                            }
                                            disabled={!canEdit}
                                        />
                                    </label>
                                </div>

                                <div className="space-y-2">

                                    {existingDocuments.map(
                                        (document, index) => {
                                            const isRemoved =
                                                removeDocumentIds.includes(
                                                    String(
                                                        document._id
                                                    )
                                                );

                                            return (
                                                <div
                                                    key={
                                                        document._id ||
                                                        index
                                                    }
                                                    className={`flex items-center justify-between gap-3 px-3 py-3 rounded-lg border ${isRemoved
                                                        ? "border-rose-200 bg-rose-50"
                                                        : "border-slate-200"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                                            <FileText
                                                                size={
                                                                    16
                                                                }
                                                                className="text-slate-500"
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="text-xs font-medium text-[#0B1E3D] truncate">
                                                                {
                                                                    document.name
                                                                }
                                                            </p>

                                                            <p className="text-[10px] text-gray-400">
                                                                Existing
                                                                document
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {isRemoved ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                undoRemoveDocument(
                                                                    document
                                                                )
                                                            }
                                                            className="text-[10px] font-medium text-[#0B1E3D] shrink-0"
                                                        >
                                                            Undo
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeExistingDocument(
                                                                    document
                                                                )
                                                            }
                                                            className="w-7 h-7 rounded-full flex items-center justify-center text-rose-600 hover:bg-rose-50 shrink-0"
                                                        >
                                                            <X
                                                                size={
                                                                    14
                                                                }
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        }
                                    )}

                                    {newDocuments.map(
                                        (file, index) => (
                                            <div
                                                key={`${file.name}-${index}`}
                                                className="flex items-center justify-between gap-3 px-3 py-3 rounded-lg border border-amber-200 bg-amber-50"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                                                        <FileText
                                                            size={16}
                                                            className="text-[#D97706]"
                                                        />
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-xs font-medium text-[#0B1E3D] truncate">
                                                            {
                                                                file.name
                                                            }
                                                        </p>

                                                        <p className="text-[10px] text-[#D97706]">
                                                            New document
                                                        </p>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeNewDocument(
                                                            index
                                                        )
                                                    }
                                                    className="w-7 h-7 rounded-full flex items-center justify-center text-rose-600 hover:bg-white shrink-0"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )
                                    )}

                                    {!existingDocuments.length &&
                                        !newDocuments.length && (
                                            <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl">
                                                <FileText
                                                    size={28}
                                                    className="mx-auto text-slate-300"
                                                />

                                                <p className="text-xs text-gray-400 mt-2">
                                                    No documents
                                                    available
                                                </p>
                                            </div>
                                        )}
                                </div>
                            </div>
                        )}


                        {/* ----------------------- AUCTIONS ----------------------- */}
                        {activeTab === "auction" && (
                            <div className="p-4 md:p-6">
                                <h3 className="text-sm font-semibold text-[#0B1E3D] mb-4"> Auction Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                    <div>
                                        <label className="block text-[11px] text-gray-500 mb-1.5">Price Type</label>
                                        <div className="h-10 px-3 flex items-center rounded-lg border border-slate-200 bg-slate-50 text-xs text-[#0B1E3D]">
                                            {formatLabel(vehicle.priceType)}
                                        </div>
                                    </div>

                                    {vehicle.priceType ===
                                        "fixed_price" && (
                                            <Field name="buyNowPrice" label="Buy Now Price" type="number" />
                                        )}

                                    {vehicle.priceType ===
                                        "reserve_price" && (
                                            <>
                                                <Field name="startingBidPrice" label="Starting Bid" type="number" />
                                                <Field name="reservePrice" label="Reserve Price" type="number" />
                                            </>
                                        )}

                                    <div>
                                        <label className="block text-[11px] text-gray-500 mb-1.5"> Auction Type </label>
                                        <div className="h-10 px-3 flex items-center rounded-lg border border-slate-200 bg-slate-50 text-xs text-[#0B1E3D]">
                                            {formatLabel(vehicle.auctionType)}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] text-gray-500 mb-1.5"> Auction Status </label>
                                        <div className="h-10 px-3 flex items-center rounded-lg border border-slate-200 bg-slate-50 text-xs text-[#0B1E3D]">
                                            {formatLabel(vehicle.auctionStatus)}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] text-gray-500 mb-1.5">Admin Status</label>
                                        <div className="h-10 px-3 flex items-center rounded-lg border border-slate-200 bg-slate-50 text-xs text-[#0B1E3D]">
                                            {formatLabel(vehicle.adminStatus)}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] text-gray-500 mb-1.5"> Start Date & Time</label>
                                        <div className="min-h-10 px-3 py-2 flex items-center rounded-lg border border-slate-200 bg-slate-50 text-xs text-[#0B1E3D]">
                                            {vehicle.auctionStartDateTime
                                                ? new Date(
                                                    vehicle.auctionStartDateTime).toLocaleString("en-AE", {
                                                        timeZone: "Asia/Dubai",
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: true,
                                                    }
                                                    )
                                                : "---"}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] text-gray-500 mb-1.5">End Date & Time</label>
                                        <div className="min-h-10 px-3 py-2 flex items-center rounded-lg border border-slate-200 bg-slate-50 text-xs text-[#0B1E3D]">
                                            {vehicle.auctionEndDateTime ? new Date(vehicle.auctionEndDateTime).toLocaleString("en-AE", {
                                                timeZone: "Asia/Dubai",
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            }
                                            )
                                                : "---"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ----------------------- ACTION BUTTONS ----------------------- */}
                        <div className="px-4 md:px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentPage?.("my-vehicles")
                                }
                                className="px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50">
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isEditing || !canEdit}
                                className="px-5 py-2.5 rounded-lg bg-[#D97706] text-white text-xs font-medium hover:bg-[#b96505] disabled:opacity-50 disabled:cursor-not-allowed">
                                {isEditing
                                    ? "Saving..."
                                    : isRejected
                                        ? "Save & Resubmit"
                                        : willResubmit
                                            ? "Save & Send for Review"
                                            : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </FieldContext.Provider>
    );
};

export default EditVehicle;