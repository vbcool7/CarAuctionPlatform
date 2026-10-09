
import React, { useEffect, useState, createContext, useContext } from "react";
import {
    ArrowLeft,
    FileText,
    Gauge,
    Image as ImageIcon,
    Info,
    MapPin,
    Upload,
    X,
    CarFront,
    SlidersHorizontal,
    Lock,
} from "lucide-react";
import { toast } from "react-hot-toast";

import FormInputFields from '../SharedComponents/FormInputFields';
import { useGetVehicleById, useAdminEditVehicle } from '../../hooks/useVehicle';

const FieldContext = createContext(null);

const Field = ({
    name, label, type = "text", options,
    required = false, disabled = false, placeholder,
}) => {
    const { formData, handleChange, canEdit } = useContext(FieldContext);
    const value = formData[name] ?? "";

    // DB ki value options list mein na ho (jaise VIN decode se aayi make "MERCEDES-BENZ")
    // to select khaali dikhta. Us case mein current value ko option bana do.
    const opts =
        type === "select" && options && value !== "" &&
            !options.some((o) => String(o.value ?? o) === String(value))
            ? [...options, { label: String(value), value: String(value) }]
            : options;

    return (
        <FormInputFields
            label={label}
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            options={opts}
            required={required}
            disabled={disabled || !canEdit}
            placeholder={placeholder}
        />
    );
};

function EditVehicle({ vehicleId, returnPage = 'all-auctions', setCurrentPage }) {

    const { data, isLoading, isError } = useGetVehicleById(vehicleId);
    const { mutate: adminEditVehicle, isPending: isEditing } = useAdminEditVehicle();

    const vehicle = data?.data;

    /*
    |--------------------------------------------------------------------------
    | STATUS RULES
    |--------------------------------------------------------------------------
    */

    const isRejected = vehicle?.adminStatus === "rejected";
    const isSold = vehicle?.auctionStatus === "sold";

    const canEdit = !isRejected && !isSold;

    // VIN is editable only while adminStatus is pending
    const canEditVin = vehicle?.adminStatus === "pending";

    /*
    |--------------------------------------------------------------------------
    | TABS
    |--------------------------------------------------------------------------
    */

    const tabs = [
        {
            id: "details",
            label: "Vehicle Details",
            icon: CarFront,
        },
        {
            id: "condition",
            label: "Condition & Features",
            icon: Gauge,
        },
        {
            id: "images",
            label: "Images",
            icon: ImageIcon,
        },
        {
            id: "documents",
            label: "Documents",
            icon: FileText,
        },
        {
            id: "auction",
            label: "Auction Info",
            icon: Info,
        },
    ];

    const [activeTab, setActiveTab] = useState("details");

    /*
    |--------------------------------------------------------------------------
    | FORM DATA
    |--------------------------------------------------------------------------
    */

    const [formData, setFormData] = useState({});

    /*
    |--------------------------------------------------------------------------
    | EXISTING / NEW FILES
    |--------------------------------------------------------------------------
    */

    const [existingImages, setExistingImages] = useState([]);
    const [existingDocuments, setExistingDocuments] = useState([]);

    const [newImages, setNewImages] = useState([]);
    const [newDocuments, setNewDocuments] = useState([]);

    const [removedImageIds, setRemovedImageIds] = useState([]);
    const [removedDocumentIds, setRemovedDocumentIds] = useState([]);

    /*
    |--------------------------------------------------------------------------
    | PREFILL
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!vehicle) return;

        setFormData({
            vehicleType: vehicle.vehicleType || "",
            make: vehicle.make || "",
            model: vehicle.model || "",
            year: vehicle.year || "",
            trim: vehicle.trim || "",
            bodyType: vehicle.bodyType || "",
            vin: vehicle.vin || "",
            mileage: vehicle.mileage ?? "",
            transmission: vehicle.transmission || "",
            fuelType: vehicle.fuelType || "",
            drivetrain: vehicle.drivetrain || "",
            exteriorColor: vehicle.exteriorColor || "",
            interiorColor: vehicle.interiorColor || "",

            country: vehicle.country || "united_arab_emirates",
            emirate: vehicle.emirate || "",
            city: vehicle.city || "",
            zipCode: vehicle.zipCode || "",

            titleStatus: vehicle.titleStatus || "",
            accidentHistory: vehicle.accidentHistory || "",
            vehicleDescription: vehicle.vehicleDescription || "",

            overallCondition: vehicle.overallCondition || "",
            mechanicalCondition: vehicle.mechanicalCondition || "",
            interiorCondition: vehicle.interiorCondition || "",
            exteriorCondition: vehicle.exteriorCondition || "",

            doors: vehicle.doors ?? "",
            seats: vehicle.seats ?? "",
            engineSize: vehicle.engineSize || "",
            cylinders: vehicle.cylinders ?? "",
            keyType: vehicle.keyType || "",
            additionalFeatures: vehicle.additionalFeatures || "",
            numberOfKeys: vehicle.numberOfKeys ?? "",

            repainted: vehicle.repainted || "",
            smokeOdor: vehicle.smokeOdor || "",
            petFriendly: vehicle.petFriendly || "",
            paintType: vehicle.paintType || "",
            glassCondition: vehicle.glassCondition || "",
            tiresCondition: vehicle.tiresCondition || "",
            tireBrand: vehicle.tireBrand || "",
            tireSize: vehicle.tireSize || "",
            seatMaterial: vehicle.seatMaterial || "",
            sunroof: vehicle.sunroof || "",
            acHeater: vehicle.acHeater || "",
            audioSystem: vehicle.audioSystem || "",
            navigation: vehicle.navigation || "",
            powerWindows: vehicle.powerWindows || "",
            powerLocks: vehicle.powerLocks || "",
            additionalNotes: vehicle.additionalNotes || "",
        });

        setExistingImages(vehicle.images || []);
        setExistingDocuments(vehicle.documents || []);

        setNewImages([]);
        setNewDocuments([]);
        setRemovedImageIds([]);
        setRemovedDocumentIds([]);
    }, [vehicle]);

    /*
    |--------------------------------------------------------------------------
    | INPUT HANDLER
    |--------------------------------------------------------------------------
    */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | OPTIONS
    |--------------------------------------------------------------------------
    */

    const makeOptions = [
        { label: "Toyota", value: "toyota" },
        { label: "Nissan", value: "nissan" },
        { label: "Honda", value: "honda" },
        { label: "Mercedes-Benz", value: "mercedes" },
        { label: "BMW", value: "bmw" },
        { label: "Land Rover", value: "land_rover" },
        { label: "Lexus", value: "lexus" },
        { label: "Mitsubishi", value: "mitsubishi" },
        { label: "Hyundai", value: "hyundai" },
        { label: "Kia", value: "kia" },
        { label: "Audi", value: "audi" },
        { label: "Ford", value: "ford" },
        { label: "Chevrolet", value: "chevrolet" },
        { label: "Porsche", value: "porsche" },
        { label: "Volkswagen", value: "volkswagen" },
        { label: "GMC", value: "gmc" },
        { label: "Jeep", value: "jeep" },
        { label: "Other", value: "other" },
    ];

    const vehicleTypeOptions = [
        { label: "SUV", value: "suv" },
        { label: "Sedan", value: "sedan" },
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

    const yearOptions = Array.from(
        { length: new Date().getFullYear() - 1980 + 1 },
        (_, i) => {
            const year = new Date().getFullYear() - i;

            return {
                label: String(year),
                value: String(year),
            };
        }
    );

    const conditionOptions = [
        { label: "Excellent", value: "excellent" },
        { label: "Good", value: "good" },
        { label: "Fair", value: "fair" },
        { label: "Poor", value: "poor" },
    ];

    /*
    |--------------------------------------------------------------------------
    | IMAGE HANDLING
    |--------------------------------------------------------------------------
    */

    const addImages = (files) => {
        const imageFiles = Array.from(files).filter((file) =>
            file.type.startsWith("image/")
        );

        const currentCount =
            existingImages.length +
            newImages.length;

        const remainingSlots = 15 - currentCount;

        if (remainingSlots <= 0) {
            toast.error("Maximum 15 images allowed");
            return;
        }

        if (imageFiles.length > remainingSlots) {
            toast.error(
                `Only ${remainingSlots} more image(s) allowed`
            );
        }

        const filesToAdd = imageFiles.slice(0, remainingSlots);

        const prepared = filesToAdd.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));

        setNewImages((prev) => [...prev, ...prepared]);
    };

    const handleImageSelect = (e) => {
        addImages(e.target.files);
        e.target.value = "";
    };

    const removeExistingImage = (image) => {
        if (existingImages.length + newImages.length <= 1) {
            toast.error("At least one image is required");
            return;
        }

        setRemovedImageIds((prev) => [
            ...prev,
            String(image._id),
        ]);

        setExistingImages((prev) =>
            prev.filter((item) => item._id !== image._id)
        );
    };

    const removeNewImage = (index) => {
        setNewImages((prev) => {
            const image = prev[index];

            if (image?.previewUrl) {
                URL.revokeObjectURL(image.previewUrl);
            }

            return prev.filter((_, i) => i !== index);
        });
    };

    /*
    |--------------------------------------------------------------------------
    | DOCUMENT HANDLING
    |--------------------------------------------------------------------------
    */

    const addDocuments = (files) => {
        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/jpg",
        ];

        const currentCount =
            existingDocuments.length +
            newDocuments.length;

        const remainingSlots = 5 - currentCount;

        if (remainingSlots <= 0) {
            toast.error("Maximum 5 documents allowed");
            return;
        }

        const validFiles = Array.from(files).filter(
            (file) =>
                allowedTypes.includes(file.type) &&
                file.size <= 10 * 1024 * 1024
        );

        if (validFiles.length > remainingSlots) {
            toast.error(
                `Only ${remainingSlots} more document(s) allowed`
            );
        }

        const prepared = validFiles
            .slice(0, remainingSlots)
            .map((file) => ({
                file,
                previewUrl: URL.createObjectURL(file),
                name: file.name,
            }));

        setNewDocuments((prev) => [...prev, ...prepared]);
    };

    const handleDocumentSelect = (e) => {
        addDocuments(e.target.files);
        e.target.value = "";
    };

    const removeExistingDocument = (document) => {
        setRemovedDocumentIds((prev) => [
            ...prev,
            String(document._id),
        ]);

        setExistingDocuments((prev) =>
            prev.filter((item) => item._id !== document._id)
        );
    };

    const removeNewDocument = (index) => {
        setNewDocuments((prev) => {
            const document = prev[index];

            if (document?.previewUrl) {
                URL.revokeObjectURL(document.previewUrl);
            }

            return prev.filter((_, i) => i !== index);
        });
    };

    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

    const handleSubmit = () => {
        if (!canEdit) return;

        const payload = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            if (key === "vin" && !canEditVin) return;

            payload.append(key, String(value));
        });

        newImages.forEach(({ file }) => {
            payload.append("images", file);
        });

        newDocuments.forEach(({ file }) => {
            payload.append("documents", file);
        });

        removedImageIds.forEach((id) => {
            payload.append("removeImageIds", id);
        });

        removedDocumentIds.forEach((id) => {
            payload.append("removeDocumentIds", id);
        });

        adminEditVehicle(
            {
                id: vehicle._id,
                formData: payload,
            },
            {
                onSuccess: () => {
                    toast.success("Vehicle updated successfully");
                    setCurrentPage(returnPage);
                },
                onError: (error) => {
                    toast.error(
                        error?.response?.data?.message ||
                        "Failed to update vehicle"
                    );
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | STATUS LABEL
    |--------------------------------------------------------------------------
    */

    const statusLabel = (status) => {
        if (!status) return "N/A";

        return status
            .replaceAll("_", " ")
            .replaceAll("-", " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    };

    if (isLoading) return <p className="p-10 text-center">Loading vehicle details...</p>;
    if (isError || !vehicle) {
        return <p className="p-10 text-center text-red-500">Failed to load vehicle details</p>;
    }

    /*
    |--------------------------------------------------------------------------
    | BLOCKED SCREEN
    |--------------------------------------------------------------------------
    */

    if (isRejected || isSold) {
        return (
            <div className="pb-6">

                <div className="flex items-center gap-3 mb-6">
                    <button
                        type="button"
                        onClick={() => setCurrentPage(returnPage)}
                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-[#D97706]"
                    >
                        <ArrowLeft size={17} />
                        Back
                    </button>

                    <h1 className="text-xl font-bold text-[#0B1E3D]">
                        Edit Vehicle
                    </h1>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">

                    <div className="w-12 h-12 mx-auto rounded-full bg-red-50 flex items-center justify-center">
                        <Lock
                            size={21}
                            className="text-red-500"
                        />
                    </div>

                    <h2 className="mt-4 text-lg font-bold text-[#0B1E3D]">
                        Vehicle Cannot Be Edited
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        {isRejected
                            ? "Rejected vehicles cannot be edited. The seller must edit and resubmit."
                            : "Sold vehicles cannot be edited."
                        }
                    </p>

                    <button
                        type="button"
                        onClick={() => setCurrentPage(returnPage)}
                        className="mt-5 px-5 py-2.5 rounded-lg bg-[#D97706] text-white text-sm font-semibold"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <FieldContext.Provider value={{ formData, handleChange, canEdit }}>
            <div className="pb-8">

                {/* HEADER */}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">

                    <div>
                        <div className="flex items-center gap-3">

                            <button
                                type="button"
                                onClick={() => setCurrentPage(returnPage)}
                                className="text-slate-500 hover:text-[#D97706]"
                            >
                                <ArrowLeft size={18} />
                            </button>

                            <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                                Edit Vehicle
                            </h1>
                        </div>

                        <p className="text-xs md:text-sm text-slate-500 mt-1 ml-7">
                            Update vehicle listing information.
                        </p>
                    </div>

                    {/* STATUS */}

                    <div className="flex flex-wrap gap-2">

                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                            Admin: {statusLabel(vehicle.adminStatus)}
                        </span>

                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Auction: {statusLabel(vehicle.auctionStatus)}
                        </span>

                    </div>
                </div>

                {/* STATUS INFO */}

                <div className="mb-5 p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">

                    <Info
                        size={17}
                        className="text-blue-600 mt-0.5 shrink-0"
                    />

                    <div className="text-xs text-blue-800">

                        <p className="font-semibold">
                            Edit permissions
                        </p>

                        <p className="mt-0.5">
                            {canEditVin
                                ? "This vehicle is pending approval, so VIN can also be edited."
                                : "VIN cannot be changed because this vehicle is already approved."
                            }
                        </p>

                    </div>
                </div>

                {/* TABS */}

                <div className="bg-white border border-slate-200 rounded-xl p-2 mb-5 overflow-x-auto">

                    <div className="flex min-w-max gap-1">

                        {tabs.map((tab) => {

                            const Icon = tab.icon;

                            const active =
                                activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                    flex items-center gap-2
                                    px-4 py-2.5
                                    rounded-lg
                                    text-xs sm:text-sm
                                    font-semibold
                                    whitespace-nowrap
                                    transition-colors
                                    ${active
                                            ? "bg-[#D97706] text-white"
                                            : "text-slate-500 hover:bg-slate-50 hover:text-[#0B1E3D]"
                                        }
                                `}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                </button>
                            );
                        })}

                    </div>
                </div>

                {/* MAIN CARD */}

                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">

                    {/* ======================================================
                    TAB 1 : VEHICLE DETAILS
                ====================================================== */}

                    {activeTab === "details" && (
                        <div className="space-y-8">

                            {/* BASIC */}

                            <section>

                                <h2 className="mb-5 flex items-center gap-2 text-md font-bold text-[#0B1E3D]">
                                    <CarFront
                                        size={18}
                                        className="text-[#D97706]"
                                    />
                                    Basic Information
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                                    <Field
                                        name="vehicleType"
                                        label="Vehicle Type"
                                        type="select"
                                        options={vehicleTypeOptions}
                                        required
                                    />

                                    <Field
                                        name="vin"
                                        label="VIN"
                                        required
                                        disabled={!canEditVin}
                                        placeholder="Enter VIN Number"
                                    />

                                    <Field
                                        name="make"
                                        label="Make"
                                        type="select"
                                        options={makeOptions}
                                        required
                                    />

                                    <Field
                                        name="model"
                                        label="Model"
                                        required
                                        placeholder="Enter Model"
                                    />

                                    <Field
                                        name="year"
                                        label="Year"
                                        type="select"
                                        options={yearOptions}
                                        required
                                    />

                                    <Field
                                        name="trim"
                                        label="Trim (Optional)"
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
                                        required
                                        placeholder="Enter Mileage"
                                    />

                                    <Field
                                        name="transmission"
                                        label="Transmission"
                                        type="select"
                                        options={[
                                            { label: "Automatic", value: "automatic" },
                                            { label: "Manual", value: "manual" },
                                            { label: "CVT", value: "cvt" },
                                            { label: "Semi-Automatic", value: "semi_automatic" },
                                        ]}
                                        required
                                    />

                                    <Field
                                        name="fuelType"
                                        label="Fuel Type"
                                        type="select"
                                        options={[
                                            { label: "Petrol", value: "petrol" },
                                            { label: "Diesel", value: "diesel" },
                                            { label: "Electric", value: "electric" },
                                            { label: "Hybrid", value: "hybrid" },
                                            { label: "Plug-in Hybrid", value: "plug_in_hybrid" },
                                            { label: "CNG", value: "cng" },
                                            { label: "LPG", value: "lpg" },
                                        ]}
                                        required
                                    />

                                    <Field
                                        name="drivetrain"
                                        label="Drivetrain"
                                        type="select"
                                        options={[
                                            { label: "Front-Wheel Drive (FWD)", value: "fwd" },
                                            { label: "Rear-Wheel Drive (RWD)", value: "rwd" },
                                            { label: "All-Wheel Drive (AWD)", value: "awd" },
                                            { label: "Four-Wheel Drive (4WD)", value: "4wd" },
                                        ]}
                                        required
                                    />

                                    <Field
                                        name="exteriorColor"
                                        label="Exterior Color"
                                        type="select"
                                        options={[
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
                                        ]}
                                        required
                                    />

                                    <Field
                                        name="interiorColor"
                                        label="Interior Color"
                                        type="select"
                                        options={[
                                            { label: "Black", value: "black" },
                                            { label: "White", value: "white" },
                                            { label: "Grey", value: "grey" },
                                            { label: "Beige", value: "beige" },
                                            { label: "Brown", value: "brown" },
                                            { label: "Tan", value: "tan" },
                                            { label: "Red", value: "red" },
                                            { label: "Blue", value: "blue" },
                                            { label: "Other", value: "other" },
                                        ]}
                                        required
                                    />

                                </div>

                                <div className="mt-5">

                                    <Field
                                        name="vehicleDescription"
                                        label="Vehicle Description"
                                        type="textarea"
                                        placeholder="Enter description about vehicle"
                                    />

                                </div>

                            </section>

                            {/* LOCATION */}

                            <section>

                                <h2 className="mb-5 flex items-center gap-2 text-md font-bold text-[#0B1E3D]">
                                    <MapPin
                                        size={18}
                                        className="text-[#D97706]"
                                    />
                                    Location
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                                    <Field
                                        name="country"
                                        label="Country"
                                        type="select"
                                        options={[
                                            {
                                                label: "United Arab Emirates",
                                                value: "united_arab_emirates",
                                            },
                                        ]}
                                        required
                                    />

                                    <Field
                                        name="emirate"
                                        label="Emirate"
                                        type="select"
                                        options={[
                                            { label: "Abu Dhabi", value: "abu_dhabi" },
                                            { label: "Dubai", value: "dubai" },
                                            { label: "Sharjah", value: "sharjah" },
                                            { label: "Ajman", value: "ajman" },
                                            { label: "Umm Al Quwain", value: "umm_al_quwain" },
                                            { label: "Ras Al Khaimah", value: "ras_al_khaimah" },
                                            { label: "Fujairah", value: "fujairah" },
                                        ]}
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

                            </section>

                            {/* HISTORY */}

                            <section>

                                <h2 className="mb-5 flex items-center gap-2 text-md font-bold text-[#0B1E3D]">
                                    <Info
                                        size={18}
                                        className="text-[#D97706]"
                                    />
                                    Vehicle History
                                </h2>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                                    <Field
                                        name="titleStatus"
                                        label="Title Status"
                                        type="select"
                                        options={[
                                            { label: "Clean", value: "clean" },
                                            { label: "Salvage", value: "salvage" },
                                            { label: "Rebuilt", value: "rebuilt" },
                                        ]}
                                        required
                                    />

                                    <div>

                                        <label className="block text-[13px] font-medium text-[#0B1E3D] mb-2">
                                            Accident History
                                            <span className="text-red-500">
                                                {" "}*
                                            </span>
                                        </label>

                                        <div className="flex flex-wrap gap-2">

                                            {[
                                                ["yes", "Yes"],
                                                ["no", "No"],
                                                ["not_sure", "Not Sure"],
                                            ].map(([value, label]) => (
                                                <label
                                                    key={value}
                                                    className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50"
                                                >
                                                    <input
                                                        type="radio"
                                                        name="accidentHistory"
                                                        value={value}
                                                        checked={
                                                            formData.accidentHistory === value
                                                        }
                                                        onChange={handleChange}
                                                        disabled={!canEdit}
                                                        className="accent-[#D97706]"
                                                    />

                                                    <span className="text-xs text-slate-600">
                                                        {label}
                                                    </span>
                                                </label>
                                            ))}

                                        </div>

                                    </div>

                                </div>

                            </section>

                        </div>
                    )}

                    {/* ======================================================
                    TAB 2 : CONDITION
                ====================================================== */}

                    {activeTab === "condition" && (
                        <div className="space-y-8">

                            <section>

                                <h2 className="mb-5 flex items-center gap-2 text-md font-bold text-[#0B1E3D]">
                                    <Gauge
                                        size={18}
                                        className="text-[#D97706]"
                                    />
                                    Vehicle Condition
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

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

                                </div>

                            </section>

                            <section>

                                <h2 className="mb-5 flex items-center gap-2 text-md font-bold text-[#0B1E3D]">
                                    <SlidersHorizontal
                                        size={18}
                                        className="text-[#D97706]"
                                    />
                                    Vehicle Details
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                                    <Field
                                        name="doors"
                                        label="Doors"
                                        type="select"
                                        options={[
                                            { label: "2 Doors", value: "2" },
                                            { label: "3 Doors", value: "3" },
                                            { label: "4 Doors", value: "4" },
                                            { label: "5 Doors", value: "5" },
                                        ]}
                                        required
                                    />

                                    <Field
                                        name="seats"
                                        label="Seats"
                                        type="select"
                                        options={[
                                            { label: "2 Seats", value: "2" },
                                            { label: "3 Seats", value: "3" },
                                            { label: "4 Seats", value: "4" },
                                            { label: "5 Seats", value: "5" },
                                            { label: "6 Seats", value: "6" },
                                            { label: "7 Seats", value: "7" },
                                            { label: "8 Seats", value: "8" },
                                            { label: "9 Seats", value: "9" },
                                        ]}
                                        required
                                    />

                                    <Field
                                        name="engineSize"
                                        label="Engine Size"
                                        required
                                        placeholder="e.g. 2.0L"
                                    />

                                    <Field
                                        name="cylinders"
                                        label="Cylinders"
                                        type="select"
                                        options={[
                                            { label: "3 Cylinder", value: "3" },
                                            { label: "4 Cylinder", value: "4" },
                                            { label: "6 Cylinder", value: "6" },
                                            { label: "8 Cylinder", value: "8" },
                                            { label: "10 Cylinder", value: "10" },
                                            { label: "12 Cylinder", value: "12" },
                                        ]}
                                    />

                                    <Field
                                        name="keyType"
                                        label="Key Type"
                                        type="select"
                                        options={[
                                            { label: "Standard Key", value: "standard" },
                                            { label: "Remote Key", value: "remote" },
                                            { label: "Smart Key", value: "smart_key" },
                                            { label: "Keyless Entry", value: "keyless_entry" },
                                            { label: "Keyless Start", value: "keyless_start" },
                                        ]}
                                    />

                                    <Field
                                        name="numberOfKeys"
                                        label="Number of Keys"
                                        type="number"
                                    />

                                </div>

                                <div className="mt-5">
                                    <Field
                                        name="additionalFeatures"
                                        label="Additional Features"
                                        type="textarea"
                                        placeholder="Sunroof, Leather Seats, Bluetooth..."
                                    />
                                </div>

                            </section>

                            <section>

                                <h2 className="mb-5 flex items-center gap-2 text-md font-bold text-[#0B1E3D]">
                                    <SlidersHorizontal
                                        size={18}
                                        className="text-[#D97706]"
                                    />
                                    Additional Information
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                                    {[
                                        ["repainted", "Repainted", [
                                            ["yes", "Yes"],
                                            ["no", "No"],
                                        ]],
                                        ["smokeOdor", "Smoke Odor", [
                                            ["yes", "Yes"],
                                            ["no", "No"],
                                        ]],
                                        ["petFriendly", "Pet Friendly", [
                                            ["yes", "Yes"],
                                            ["no", "No"],
                                        ]],
                                        ["paintType", "Paint Type", [
                                            ["factory_original", "Factory Original"],
                                            ["repainted", "Repainted"],
                                        ]],
                                        ["glassCondition", "Glass Condition", [
                                            ["no_cracks", "No Cracks"],
                                            ["minor_cracks", "Minor Cracks"],
                                            ["major_cracks", "Major Cracks"],
                                        ]],
                                        ["tiresCondition", "Tires Condition", [
                                            ["excellent", "Excellent"],
                                            ["good", "Good"],
                                            ["fair", "Fair"],
                                            ["poor", "Poor"],
                                            ["needs_replacement", "Needs Replacement"],
                                        ]],
                                        ["seatMaterial", "Seat Material", [
                                            ["fabric", "Fabric"],
                                            ["leather", "Leather"],
                                            ["synthetic_leather", "Synthetic Leather"],
                                            ["suede", "Suede"],
                                            ["alcantara", "Alcantara"],
                                            ["vinyl", "Vinyl"],
                                        ]],
                                        ["sunroof", "Sunroof", [
                                            ["yes", "Yes"],
                                            ["no", "No"],
                                            ["panoramic", "Panoramic"],
                                        ]],
                                        ["navigation", "Navigation", [
                                            ["yes", "Yes"],
                                            ["no", "No"],
                                            ["built_in", "Built In"],
                                        ]],
                                        ["powerWindows", "Power Windows", [
                                            ["yes", "Yes"],
                                            ["no", "No"],
                                        ]],
                                        ["powerLocks", "Power Locks", [
                                            ["yes", "Yes"],
                                            ["no", "No"],
                                        ]],
                                    ].map(([name, label, values]) => (
                                        <Field
                                            key={name}
                                            name={name}
                                            label={label}
                                            type="select"
                                            options={values.map(([value, label]) => ({
                                                value,
                                                label,
                                            }))}
                                        />
                                    ))}

                                    <Field
                                        name="tireBrand"
                                        label="Tire Brand"
                                        placeholder="e.g. Michelin"
                                    />

                                    <Field
                                        name="tireSize"
                                        label="Tire Size"
                                        placeholder="e.g. 255/50 R19"
                                    />

                                    <Field
                                        name="acHeater"
                                        label="AC / Heater"
                                        placeholder="e.g. AC Dual Zone"
                                    />

                                    <Field
                                        name="audioSystem"
                                        label="Audio System"
                                        placeholder="e.g. Harman Kardon"
                                    />

                                </div>

                                <div className="mt-5">
                                    <Field
                                        name="additionalNotes"
                                        label="Additional Notes"
                                        type="textarea"
                                        placeholder="Any additional notes about the vehicle's condition"
                                    />
                                </div>

                            </section>

                        </div>
                    )}

                    {/* ======================================================
                    TAB 3 : IMAGES
                ====================================================== */}

                    {activeTab === "images" && (
                        <div className="space-y-6">

                            <div className="flex items-center justify-between">

                                <div>
                                    <h2 className="text-md font-bold text-[#0B1E3D]">
                                        Vehicle Images
                                    </h2>

                                    <p className="text-xs text-slate-500 mt-1">
                                        Maximum 15 images. First image is the cover photo.
                                    </p>
                                </div>

                                <span className="text-xs font-medium text-slate-500">
                                    {existingImages.length + newImages.length}/15
                                </span>

                            </div>

                            <label
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    addImages(e.dataTransfer.files);
                                }}
                                className="flex flex-col items-center justify-center min-h-[180px] border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:border-[#D97706] cursor-pointer transition-colors"
                            >

                                <Upload
                                    size={28}
                                    className="text-slate-400"
                                />

                                <p className="mt-2 text-sm font-semibold text-slate-600">
                                    Upload Images
                                </p>

                                <p className="text-xs text-slate-400 mt-1">
                                    Drag & drop or choose files
                                </p>

                                <span className="mt-3 px-4 py-2 rounded-lg bg-[#D97706] text-white text-xs font-semibold">
                                    Choose Files
                                </span>

                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    disabled={!canEdit}
                                    onChange={handleImageSelect}
                                />

                            </label>

                            {/* EXISTING */}

                            {existingImages.length > 0 && (
                                <div>

                                    <h3 className="text-sm font-semibold text-[#0B1E3D] mb-3">
                                        Existing Images
                                    </h3>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

                                        {existingImages.map((image, index) => (
                                            <div
                                                key={image._id}
                                                className="relative group"
                                            >

                                                <img
                                                    src={image.url}
                                                    alt={`Vehicle ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-xl border border-slate-200"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeExistingImage(image)
                                                    }
                                                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={14} />
                                                </button>

                                                {index === 0 && (
                                                    <span className="absolute bottom-2 left-2 text-[10px] font-semibold bg-green-600 text-white px-2 py-1 rounded">
                                                        Cover
                                                    </span>
                                                )}

                                            </div>
                                        ))}

                                    </div>

                                </div>
                            )}

                            {/* NEW */}

                            {newImages.length > 0 && (
                                <div>

                                    <h3 className="text-sm font-semibold text-[#0B1E3D] mb-3">
                                        New Images
                                    </h3>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

                                        {newImages.map((image, index) => (
                                            <div
                                                key={image.previewUrl}
                                                className="relative"
                                            >

                                                <img
                                                    src={image.previewUrl}
                                                    alt={`New ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-xl border border-slate-200"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeNewImage(index)
                                                    }
                                                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center"
                                                >
                                                    <X size={14} />
                                                </button>

                                            </div>
                                        ))}

                                    </div>

                                </div>
                            )}

                        </div>
                    )}

                    {/* ======================================================
                    TAB 4 : DOCUMENTS
                ====================================================== */}

                    {activeTab === "documents" && (
                        <div className="space-y-6">

                            <div className="flex items-center justify-between">

                                <div>
                                    <h2 className="text-md font-bold text-[#0B1E3D]">
                                        Vehicle Documents
                                    </h2>

                                    <p className="text-xs text-slate-500 mt-1">
                                        PDF, JPG and PNG. Maximum 5 documents, 10MB each.
                                    </p>
                                </div>

                                <span className="text-xs font-medium text-slate-500">
                                    {existingDocuments.length + newDocuments.length}/5
                                </span>

                            </div>

                            <label className="flex flex-col items-center justify-center min-h-[160px] border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:border-[#D97706] cursor-pointer">

                                <Upload
                                    size={28}
                                    className="text-slate-400"
                                />

                                <p className="mt-2 text-sm font-semibold text-slate-600">
                                    Upload Documents
                                </p>

                                <p className="text-xs text-slate-400 mt-1">
                                    PDF, JPG or PNG
                                </p>

                                <span className="mt-3 px-4 py-2 rounded-lg bg-[#D97706] text-white text-xs font-semibold">
                                    Choose Files
                                </span>

                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    multiple
                                    className="hidden"
                                    disabled={!canEdit}
                                    onChange={handleDocumentSelect}
                                />

                            </label>

                            {/* EXISTING DOCUMENTS */}

                            {existingDocuments.length > 0 && (
                                <div>

                                    <h3 className="text-sm font-semibold text-[#0B1E3D] mb-3">
                                        Existing Documents
                                    </h3>

                                    <div className="space-y-2">

                                        {existingDocuments.map((document) => (
                                            <div
                                                key={document._id}
                                                className="flex items-center justify-between gap-3 border border-slate-200 rounded-xl p-3"
                                            >

                                                <div className="flex items-center gap-3 min-w-0">

                                                    <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                                                        <FileText
                                                            size={17}
                                                            className="text-red-500"
                                                        />
                                                    </div>

                                                    <div className="min-w-0">

                                                        <p className="text-sm font-medium text-[#0B1E3D] truncate">
                                                            {document.name || "Document"}
                                                        </p>

                                                        <a
                                                            href={document.url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-[11px] text-[#D97706] hover:underline"
                                                        >
                                                            View Document
                                                        </a>

                                                    </div>

                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeExistingDocument(document)
                                                    }
                                                    className="w-8 h-8 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center shrink-0"
                                                >
                                                    <X size={16} />
                                                </button>

                                            </div>
                                        ))}

                                    </div>

                                </div>
                            )}

                            {/* NEW DOCUMENTS */}

                            {newDocuments.length > 0 && (
                                <div>

                                    <h3 className="text-sm font-semibold text-[#0B1E3D] mb-3">
                                        New Documents
                                    </h3>

                                    <div className="space-y-2">

                                        {newDocuments.map((document, index) => (
                                            <div
                                                key={document.previewUrl}
                                                className="flex items-center justify-between gap-3 border border-amber-200 bg-amber-50/40 rounded-xl p-3"
                                            >

                                                <div className="flex items-center gap-3 min-w-0">

                                                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
                                                        <FileText
                                                            size={17}
                                                            className="text-[#D97706]"
                                                        />
                                                    </div>

                                                    <p className="text-sm font-medium text-[#0B1E3D] truncate">
                                                        {document.name}
                                                    </p>

                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeNewDocument(index)
                                                    }
                                                    className="w-8 h-8 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center"
                                                >
                                                    <X size={16} />
                                                </button>

                                            </div>
                                        ))}

                                    </div>

                                </div>
                            )}

                        </div>
                    )}

                    {/* ======================================================
                    TAB 5 : AUCTION INFO
                ====================================================== */}

                    {activeTab === "auction" && (
                        <div className="space-y-6">

                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">

                                <div className="flex items-start gap-3">

                                    <Info
                                        size={18}
                                        className="text-[#D97706] mt-0.5"
                                    />

                                    <div>

                                        <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                            Auction information is read-only
                                        </h3>

                                        <p className="text-xs text-slate-600 mt-1">
                                            Pricing and auction scheduling are not part
                                            of the current vehicle edit API.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                                {[
                                    ["Admin Status", statusLabel(vehicle.adminStatus)],
                                    ["Auction Status", statusLabel(vehicle.auctionStatus)],
                                    ["Price Type", statusLabel(vehicle.priceType)],
                                    ["Auction Type", statusLabel(vehicle.auctionType)],
                                    [
                                        "Starting Bid",
                                        vehicle.startingBidPrice
                                            ? `AED ${Number(vehicle.startingBidPrice).toLocaleString()}`
                                            : "—",
                                    ],
                                    [
                                        "Buy Now Price",
                                        vehicle.buyNowPrice
                                            ? `AED ${Number(vehicle.buyNowPrice).toLocaleString()}`
                                            : "—",
                                    ],
                                    [
                                        "Reserve Price",
                                        vehicle.reservePrice
                                            ? `AED ${Number(vehicle.reservePrice).toLocaleString()}`
                                            : "—",
                                    ],
                                    [
                                        "Current Bid",
                                        vehicle.currentBid
                                            ? `AED ${Number(vehicle.currentBid).toLocaleString()}`
                                            : "—",
                                    ],
                                    [
                                        "Auction Start",
                                        vehicle.auctionStartDateTime
                                            ? new Date(
                                                vehicle.auctionStartDateTime
                                            ).toLocaleString("en-AE", {
                                                timeZone: "Asia/Dubai",
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })
                                            : "—",
                                    ],
                                    [
                                        "Auction End",
                                        vehicle.auctionEndDateTime
                                            ? new Date(
                                                vehicle.auctionEndDateTime
                                            ).toLocaleString("en-AE", {
                                                timeZone: "Asia/Dubai",
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })
                                            : "—",
                                    ],
                                ].map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="border border-slate-200 rounded-xl p-4 bg-slate-50/50"
                                    >
                                        <p className="text-[11px] text-slate-500">
                                            {label}
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-[#0B1E3D]">
                                            {value}
                                        </p>
                                    </div>
                                ))}

                            </div>

                        </div>
                    )}

                    {/* FOOTER */}

                    <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-3">

                        <button
                            type="button"
                            onClick={() => setCurrentPage(returnPage)}
                            className="h-10 px-5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isEditing}
                            className="h-10 px-6 rounded-lg bg-[#D97706] text-white text-sm font-semibold hover:bg-[#B45309] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isEditing ? "Saving Changes..." : "Save Changes"}
                        </button>

                    </div>

                </div>
            </div>
        </FieldContext.Provider>
    );
}

export default EditVehicle;