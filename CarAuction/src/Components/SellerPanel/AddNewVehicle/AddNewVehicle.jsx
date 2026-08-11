
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Car, CarFront, Check, Gauge, Images, Info, MapPin, Settings, SlidersHorizontal, Tag, Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';
import FormInputFields from '../../SellerRegistration/FormInputFields';

const steps = [
    { label: "Vehicle Details", },
    { label: "Condition & Details", },
    { label: "Images", },
    { label: "Pricing & Auction", },
    { label: "Review & Submit", },
];

function AddNewVehicle({ setCurrentPage }) {

    const stepRefs = useRef([]);
    const [currentStep, setCurrentStep] = useState(1);

    const [images, setImages] = useState([]);

    const [formData, setFormData] = useState({
        vehicleType: "",
        make: "",
        model: "",
        year: "",
        trim: "",
        bodyType: "",
        vin: "",
        mileage: "",
        transmission: "",
        fuelType: "",
        drivetrain: "",
        exteriorColor: "",
        country: "united-rab-emirates",
        state: "",
        city: "",
        zipCode: "",
        titleStatus: "",
        accidentHistory: "",
        overallCondition: "",
        mechanicalCondition: "",
        interiorCondition: "",
        exteriorCondition: "",
        doors: "",
        seats: "",
        engineSize: "",
        cylinders: "",
        driveType: "",
        keyType: "",
        additionalFeatures: "",
        bidPrice: "",
        buyPrice: "",
        reservePrice: "",
    });

    // stepper
    useEffect(() => {
        const element = stepRefs.current[currentStep - 1];
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest"
            });
        }
    }, [currentStep]);

    // i/p handler
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // images handler
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        addImages(files);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        addImages(files);
    }

    const addImages = (files) => {
        const imageFiles = files.filter((f) => f.type.startsWith("image/"));
        const remainingSlots = 20 - images.length;
        const filesToAdd = imageFiles.slice(0, remainingSlots);

        const newImages = filesToAdd.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));

        setImages((prev) => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        setImages((prev) => {
            URL.revokeObjectURL(prev[index].previewUrl);
            return prev.filter((_, i) => i !== index);
        });
    };

    //     const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    // const validFiles = imageFiles.filter((f) => {
    //     if (f.size > MAX_SIZE) {
    //         toast.error(`${f.name} exceeds 10MB limit`);
    //         return false;
    //     }
    //     return true;
    // });

    // btns control
    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        } else {
            setCurrentPage('dashboard');
        }
    };

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep((prev) => prev + 1);
        }
    }

    return (
        <div className='pb-6'>
            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>
                <div className='flex flex-col'>
                    <h1 className='text-xl md:text-2xl font-bold'>Add New Vehicle</h1>
                    <p className='text-xs md:text-sm text-gray-600 p-px'>
                        Fill in the details below to list your vehicle for auction.
                    </p>
                </div>
                <div className='flex flex-col md:flex-row w-full md:w-auto gap-3'>
                    <button
                        onClick={() => setCurrentPage('dashboard')}
                        className='flex flex-1 md:flex-none items-center justify-center gap-1 font-medium text-gray-600 rounded-xl text-xs sm:text-sm transition-all duration-200 whitespace-nowrap cursor-pointer active:scale-95 hover:text-amber-600'>
                        <ArrowLeft className='w-4 h-4 shrink-0' />
                        Back to Dashboard
                    </button>
                </div>
            </div>

            {/* stepper */}
            <div className="w-full overflow-x-auto no-scrollbar pb-2 mt-6">
                <div className="min-w-max flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                    {steps.map((step, index) => {
                        const stepNumber = index + 1;
                        const isActive = stepNumber === currentStep;
                        const isCompleted = stepNumber < currentStep;

                        return (
                            <div
                                key={stepNumber}
                                ref={(el) => (stepRefs.current[index] = el)}
                                onClick={() =>
                                    isCompleted && onStepChange(stepNumber)
                                }
                                className={`flex items-start ${isCompleted
                                    ? "cursor-pointer"
                                    : "cursor-default"
                                    }`}
                            >
                                {/* Step */}
                                <div className="flex flex-col items-center w-24 sm:w-28">
                                    {/* Circle */}
                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-all duration-300
                                ${isCompleted
                                                ? "bg-green-600 text-white shadow-sm"
                                                : isActive
                                                    ? "bg-[#D97706] text-white shadow-md shadow-orange-200 ring-4 ring-orange-50"
                                                    : "bg-white text-slate-500 border-2 border-slate-200"
                                            }
                            `}
                                    >
                                        {isCompleted ? (
                                            <Check size={16} strokeWidth={3} />
                                        ) : (
                                            stepNumber
                                        )}
                                    </div>

                                    {/* Label */}
                                    <p
                                        className={`mt-2 text-center text-[11px] sm:text-xs font-semibold leading-4 whitespace-nowrap
                                ${isActive
                                                ? "text-[#D97706]"
                                                : isCompleted
                                                    ? "text-slate-700"
                                                    : "text-slate-400"
                                            }
                            `}
                                    >
                                        {step.label}
                                    </p>
                                </div>

                                {/* Connecting Line */}
                                {index !== steps.length - 1 && (
                                    <div className="w-16 sm:w-20 md:w-24 px-2 mt-5">
                                        <div
                                            className={`h-0.5 w-full rounded-full transition-colors duration-300 ${isCompleted
                                                ? "bg-[#D97706]"
                                                : "bg-slate-200"
                                                }`}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* main container */}
            <div className='flex justify-between gap-6 mt-5 '>

                {/* ------------------ left ------------------ */}
                <div className="w-[65%] bg-white border border-slate-200 rounded-2xl px-4 py-4 shadow-sm">
                    {currentStep === 1 && (
                        <div className='space-y-8'>

                            {/* ======== Basic Information ======== */}
                            <div className=''>
                                <h2 className="mt-2 mb-5 flex items-center gap-2 text-md font-bold text-[#0B1E3D]">
                                    <Info size={18} className="text-[#D97706]" />
                                    Basic Information
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                                    {/* Vehicle Type */}
                                    <FormInputFields
                                        label="Vehicle Type"
                                        type="select"
                                        name="vehicleType"
                                        value={formData.vehicleType}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "SUV", value: "suv" },
                                            { label: "Sedan", value: "sedan" },
                                            { label: "Hatchback", value: "hatchback" },
                                            { label: "Truck", value: "truck" },
                                            { label: "Coupe", value: "coupe" },
                                            { label: "Convertible", value: "convertible" },
                                            { label: "Other", value: "other" },
                                        ]}
                                    />

                                    {/* Make */}
                                    <FormInputFields
                                        label="Make"
                                        type="select"
                                        name="make"
                                        value={formData.make}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "Toyota", value: "toyota" },
                                            { label: "Honda", value: "honda" },
                                            { label: "BMW", value: "bmw" },
                                            { label: "Mercedes-Benz", value: "mercedes" },
                                            { label: "Audi", value: "audi" },
                                            { label: "Ford", value: "ford" },
                                            { label: "Other", value: "other" },
                                        ]}
                                    />

                                    {/* Model */}
                                    <FormInputFields
                                        label="Model"
                                        type="select"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "Camry", value: "camry" },
                                            { label: "Civic", value: "civic" },
                                            { label: "Corolla", value: "corolla" },
                                            { label: "3 Series", value: "3-series" },
                                            { label: "C-Class", value: "c-class" },
                                            { label: "Other", value: "other" },
                                        ]}
                                    />

                                    {/* Year */}
                                    <FormInputFields
                                        label="Year"
                                        type="select"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "2026", value: "2026" },
                                            { label: "2025", value: "2025" },
                                            { label: "2024", value: "2024" },
                                            { label: "2023", value: "2023" },
                                            { label: "2022", value: "2022" },
                                            { label: "2021", value: "2021" },
                                            { label: "2020", value: "2020" },
                                            { label: "2019", value: "2019" },
                                            { label: "2018", value: "2018" },
                                            { label: "2017", value: "2017" },
                                            { label: "2016", value: "2016" },
                                        ]}
                                    />

                                    {/* Trim */}
                                    <FormInputFields
                                        label="Trim (Optional)"
                                        name="trim"
                                        value={formData.trim}
                                        onChange={handleChange}
                                    />

                                    {/* Body Type */}
                                    <FormInputFields
                                        label="Body Type"
                                        type="select"
                                        name="bodyType"
                                        value={formData.bodyType}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "SUV", value: "suv" },
                                            { label: "Sedan", value: "sedan" },
                                            { label: "Hatchback", value: "hatchback" },
                                            { label: "Coupe", value: "coupe" },
                                            { label: "Convertible", value: "convertible" },
                                            { label: "Wagon", value: "wagon" },
                                            { label: "Truck", value: "truck" },
                                        ]}
                                    />

                                    {/* VIN */}
                                    <FormInputFields
                                        label="VIN"
                                        name="vin"
                                        value={formData.vin}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter VIN Number"
                                        helperText="Enter 17-digit VIN number"
                                    />

                                    {/* Mileage */}
                                    <FormInputFields
                                        label="Mileage"
                                        name="mileage"
                                        value={formData.mileage}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter Mileage"
                                        helperText="In miles"
                                    />

                                    {/* Transmission */}
                                    <FormInputFields
                                        label="Transmission"
                                        type="select"
                                        name="transmission"
                                        value={formData.transmission}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "Automatic", value: "automatic" },
                                            { label: "Manual", value: "manual" },
                                            { label: "CVT", value: "cvt" },
                                            { label: "Semi-Automatic", value: "semi-automatic" },
                                        ]}
                                    />

                                    {/* Fuel Type */}
                                    <FormInputFields
                                        label="Fuel Type"
                                        type="select"
                                        name="fuelType"
                                        value={formData.fuelType}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "Petrol", value: "petrol" },
                                            { label: "Diesel", value: "diesel" },
                                            { label: "Electric", value: "electric" },
                                            { label: "Hybrid", value: "hybrid" },
                                            { label: "CNG", value: "cng" },
                                        ]}
                                    />

                                    {/* Drivetrain */}
                                    <FormInputFields
                                        label="Drivetrain"
                                        type="select"
                                        name="drivetrain"
                                        value={formData.drivetrain}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "FWD", value: "fwd" },
                                            { label: "RWD", value: "rwd" },
                                            { label: "AWD", value: "awd" },
                                            { label: "4WD", value: "4wd" },
                                        ]}
                                    />

                                    {/* Exterior Color */}
                                    <FormInputFields
                                        label="Exterior Color"
                                        type="select"
                                        name="exteriorColor"
                                        value={formData.exteriorColor}
                                        onChange={handleChange}
                                        options={[
                                            { label: "Black", value: "black" },
                                            { label: "White", value: "white" },
                                            { label: "Silver", value: "silver" },
                                            { label: "Gray", value: "gray" },
                                            { label: "Blue", value: "blue" },
                                            { label: "Red", value: "red" },
                                            { label: "Green", value: "green" },
                                            { label: "Other", value: "other" },
                                        ]}
                                    />

                                </div>
                            </div>

                            {/* ======== Location ======== */}
                            <div className=''>
                                <h2 className="mt-2 mb-5 flex items-center gap-2 text-md font-bold text-[#0B1E3D]">
                                    <MapPin size={18} className="text-[#D97706]" />
                                    Location
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                                    {/* Country */}
                                    <FormInputFields
                                        label="Country"
                                        type="select"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "United Arab Emirates", value: "united-rab-emirates" },
                                        ]}
                                    />

                                    {/* State */}
                                    <FormInputFields
                                        label="State"
                                        type="select"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "California", value: "california" },
                                            { label: "Texas", value: "texas" },
                                            { label: "Florida", value: "florida" },
                                            { label: "New York", value: "new-york" },
                                        ]}
                                    />

                                    {/* City */}
                                    <FormInputFields
                                        label="City"
                                        type="select"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "Los Angeles", value: "los-angeles" },
                                            { label: "Houston", value: "houston" },
                                            { label: "Miami", value: "miami" },
                                            { label: "New York City", value: "new-york-city" },
                                        ]}
                                    />

                                    {/* Zip Code */}
                                    <FormInputFields
                                        label="Zip Code"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter Zip Code"
                                    />

                                </div>
                            </div>

                            {/* ======== Vehicle history ======== */}
                            <div className="">
                                <h2 className="mt-2 mb-5 flex items-center gap-2 text-md font-bold text-[#0B1E3D]">
                                    <CarFront size={18} className="text-[#D97706]" />
                                    Vehicle History
                                </h2>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                                    {/* Title Status */}
                                    <div>
                                        <FormInputFields
                                            label="Title Status"
                                            type="select"
                                            name="titleStatus"
                                            value={formData.titleStatus}
                                            onChange={handleChange}
                                            required
                                            options={[
                                                { label: "Clean", value: "clean", },
                                                { label: "Salvage", value: "salvage", },
                                            ]}
                                        />

                                        <p className="mt-1 text-[11px] text-[#D97706] cursor-pointer">
                                            Learn more about title status
                                        </p>
                                    </div>

                                    {/* Accident History */}
                                    <div>
                                        <label className="block text-[13px] font-medium text-[#0B1E3D] mb-2">
                                            Accident History <span className="text-red-500">*</span>
                                        </label>

                                        <div className="flex flex-wrap items-center gap-2">

                                            {/* Yes */}
                                            <label className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                                <input
                                                    type="radio"
                                                    name="accidentHistory"
                                                    value="yes"
                                                    checked={formData.accidentHistory === "yes"}
                                                    onChange={handleChange}
                                                    className="accent-[#D97706]"
                                                />
                                                <span className="text-xs text-slate-600">
                                                    Yes
                                                </span>
                                            </label>

                                            {/* No */}
                                            <label className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                                <input
                                                    type="radio"
                                                    name="accidentHistory"
                                                    value="no"
                                                    checked={formData.accidentHistory === "no"}
                                                    onChange={handleChange}
                                                    className="accent-[#D97706]"
                                                />
                                                <span className="text-xs text-slate-600">
                                                    No
                                                </span>
                                            </label>

                                            {/* Not Sure */}
                                            <label className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                                <input
                                                    type="radio"
                                                    name="accidentHistory"
                                                    value="not-sure"
                                                    checked={formData.accidentHistory === "not-sure"}
                                                    onChange={handleChange}
                                                    className="accent-[#D97706]"
                                                />
                                                <span className="text-xs text-slate-600">
                                                    Not Sure
                                                </span>
                                            </label>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className='space-y-8'>

                            {/* ======== Vehicle condition ======== */}
                            <div className=''>
                                <h2 className="mt-2 mb-5 flex items-center gap-2 text-md font-bold text-[#0B1E3D]">
                                    <Gauge size={18} className="text-[#D97706]" />
                                    Vehicle Condition
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                                    {/* Overall Condition */}
                                    <FormInputFields
                                        label="Overall Condition"
                                        type="select"
                                        name="overallCondition"
                                        value={formData.overallCondition}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "Excellent", value: "excellent" },
                                            { label: "Good", value: "good" },
                                            { label: "Fair", value: "fair" },
                                            { label: "Poor", value: "poor" },
                                        ]}
                                    />

                                    {/* Mechanical Condition */}
                                    <FormInputFields
                                        label="Mechanical Condition"
                                        type="select"
                                        name="mechanicalCondition"
                                        value={formData.mechanicalCondition}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "Excellent", value: "excellent" },
                                            { label: "Good", value: "good" },
                                            { label: "Fair", value: "fair" },
                                            { label: "Poor", value: "poor" },
                                        ]}
                                    />

                                    {/* Interior Condition */}
                                    <FormInputFields
                                        label="Interior Condition"
                                        type="select"
                                        name="interiorCondition"
                                        value={formData.interiorCondition}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "Excellent", value: "excellent" },
                                            { label: "Good", value: "good" },
                                            { label: "Fair", value: "fair" },
                                            { label: "Poor", value: "poor" },
                                        ]}
                                    />

                                    {/* Exterior Condition */}
                                    <FormInputFields
                                        label="Exterior Condition"
                                        type="select"
                                        name="exteriorCondition"
                                        value={formData.exteriorCondition}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "Excellent", value: "excellent" },
                                            { label: "Good", value: "good" },
                                            { label: "Fair", value: "fair" },
                                            { label: "Poor", value: "poor" },
                                        ]}
                                    />

                                </div>
                            </div>

                            {/* ======== Vehicle details ======== */}
                            <div className=''>
                                <h2 className="mt-2 mb-5 flex items-center gap-2 text-md font-bold text-[#0B1E3D]">
                                    <SlidersHorizontal size={18} className="text-[#D97706]" />
                                    Vehicle Details
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                                    {/* Doors */}
                                    <FormInputFields
                                        label="Doors"
                                        type="select"
                                        name="doors"
                                        value={formData.doors}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "Select Doors", value: "" },
                                            { label: "2", value: "2" },
                                            { label: "3", value: "3" },
                                            { label: "4", value: "4" },
                                            { label: "5", value: "5" },
                                        ]}
                                    />

                                    {/* Seats */}
                                    <FormInputFields
                                        label="Seats"
                                        type="select"
                                        name="seats"
                                        value={formData.seats}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "Select Seats", value: "" },
                                            { label: "2", value: "2" },
                                            { label: "4", value: "4" },
                                            { label: "5", value: "5" },
                                            { label: "6", value: "6" },
                                            { label: "7", value: "7" },
                                            { label: "8", value: "8" },
                                        ]}
                                    />

                                    {/* Engine Size */}
                                    <FormInputFields
                                        label="Engine Size"
                                        name="engineSize"
                                        value={formData.engineSize}
                                        onChange={handleChange}
                                        placeholder="Enter Engine Size (e.g. 2.0L)"
                                    />

                                    {/* Cylinders */}
                                    <FormInputFields
                                        label="Cylinders"
                                        type="select"
                                        name="cylinders"
                                        value={formData.cylinders}
                                        onChange={handleChange}
                                        options={[
                                            { label: "Select Cylinders", value: "" },
                                            { label: "3 Cylinder", value: "3" },
                                            { label: "4 Cylinder", value: "4" },
                                            { label: "6 Cylinder", value: "6" },
                                            { label: "8 Cylinder", value: "8" },
                                            { label: "10 Cylinder", value: "10" },
                                            { label: "12 Cylinder", value: "12" },
                                        ]}
                                    />

                                    {/* Drive Type */}
                                    <FormInputFields
                                        label="Drive Type"
                                        type="select"
                                        name="driveType"
                                        value={formData.driveType}
                                        onChange={handleChange}
                                        options={[
                                            { label: "Select Drive Type", value: "" },
                                            { label: "FWD", value: "fwd" },
                                            { label: "RWD", value: "rwd" },
                                            { label: "AWD", value: "awd" },
                                            { label: "4WD", value: "4wd" },
                                        ]}
                                    />

                                    {/* Key Type */}
                                    <FormInputFields
                                        label="Key Type"
                                        type="select"
                                        name="keyType"
                                        value={formData.keyType}
                                        onChange={handleChange}
                                        options={[
                                            { label: "Select Key Type", value: "" },
                                            { label: "Original Key", value: "original" },
                                            { label: "Spare Key", value: "spare" },
                                            { label: "Both Keys", value: "both" },
                                            { label: "No Key", value: "no-key" },
                                        ]}
                                    />

                                </div>

                                {/* Additional Features */}
                                <div className="mt-5">
                                    <FormInputFields
                                        label="Additional Features"
                                        type="textarea"
                                        name="additionalFeatures"
                                        value={formData.additionalFeatures}
                                        onChange={handleChange}
                                        placeholder="Enter features (e.g. Sunroof, Leather Seats, Bluetooth, Backup Camera)"
                                        rows={4}
                                    />

                                    <div className="flex justify-end mt-1">
                                        <span className="text-[10px] text-slate-400">
                                            {formData.additionalFeatures?.length || 0}/300
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className='space-y-8'>
                            <h2 className="mt-2 mb-5 flex items-center gap-2 text-md font-bold text-[#0B1E3D]">
                                <Images size={18} className="text-[#D97706]" />
                                Vehicle Images
                            </h2>

                            {/* guidline */}
                            <div className="w-full flex items-start gap-3 p-4 bg-blue-50/60 border border-blue-200 rounded-lg">
                                <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center shrink-0">
                                    <Info className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-xs sm:text-sm font-semibold text-blue-700">Image Guidelines</h3>
                                    <p className="mt-1 text-xs sm:text-sm text-slate-600">Upload up to 20 images. First image will be your cover photo.</p>
                                    <p className="mt-1 text-xs sm:text-sm text-slate-600">Accepted formats: JPG, PNG, WebP. Max size: 10MB per image.</p>
                                </div>

                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <label
                                    onDrop={handleDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                    className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center cursor-pointer hover:border-[#D97706] transition-colors"
                                >
                                    <Upload size={28} className="text-slate-400" />
                                    <p className="text-sm font-medium text-slate-600">Upload Images</p>
                                    <p className="text-xs text-slate-400">Drag & drop files here or</p>
                                    <span className="mt-1 inline-flex items-center rounded-lg bg-[#D97706] px-4 py-2 text-xs font-semibold text-white">
                                        Choose Files
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />
                                </label>

                                {/* Thumbnails */}
                                {images.slice(0, 7).map((img, index) => (
                                    <div key={img.previewUrl} className="relative">
                                        <img
                                            src={img.previewUrl}
                                            alt={`Vehicle image ${index + 1}`}
                                            className="h-32 w-full rounded-xl object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                                        >
                                            <X size={14} />
                                        </button>
                                        {index === 0 && (
                                            <p className="mt-1 text-xs font-medium text-green-600">Cover Photo</p>
                                        )}
                                    </div>
                                ))}

                                {/* if only 8 images are there then show only 8 no thumbnail required */}
                                {images.length > 8 && (
                                    <div className="relative h-32 w-full overflow-hidden rounded-xl">
                                        <img
                                            src={images[7].previewUrl}
                                            alt="More images"
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-lg font-semibold text-white">
                                            +{images.length - 7} More
                                        </div>
                                    </div>
                                )}
                                {images.length === 8 && (
                                    <div className="relative">
                                        <img
                                            src={images[7].previewUrl}
                                            alt="Vehicle image 8"
                                            className="h-32 w-full rounded-xl object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(7)}
                                            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* hint */}
                            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                <p className="mb-2 text-sm font-medium text-[#0B1E3D]">
                                    Suggested angles for better listings
                                </p>
                                <p className="text-xs text-slate-600">
                                    Front, Rear, Left Side, Right Side, Interior Dashboard, Front Seats, Rear Seats, Engine Bay, Trunk Space
                                </p>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className='space-y-8'>

                            {/* ======== Pricing info ======== */}
                            <div className=''>
                                <h2 className="mt-2 mb-5 flex items-center gap-2 text-md font-bold text-[#0B1E3D]">
                                    <Tag size={18} className="text-[#D97706]" />
                                    Pricing Information
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                                    {/* starting bid price */}
                                    <div className="space-y-2">
                                        <label className="block text-[13px] font-medium text-[#0B1E3D]">
                                            Starting Bid Price <span className="text-red-500">*</span>
                                        </label>

                                        <div className="flex">
                                            <div className="flex py-2.5 w-12 items-center justify-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-sm font-medium text-[#0B1E3D]">
                                                $
                                            </div>
                                            <input
                                                name="bidPrice"
                                                value={formData.bidPrice}
                                                onChange={handleChange}
                                                placeholder="28,500"
                                                className="py-2.5 flex-1 rounded-r-lg border border-slate-300 px-4 text-sm text-[#0B1E3D] outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/15"
                                            />
                                        </div>
                                    </div>

                                    {/* buy now price */}
                                    <div className="">
                                        <label className="mb-2 block text-[13px] font-medium text-[#0B1E3D]">
                                            Buy Now Price (Optional) <span className="text-red-500">*</span>
                                        </label>

                                        <div className="flex">
                                            <div className="flex py-2.5 w-12 items-center justify-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-sm font-medium text-[#0B1E3D]">
                                                $
                                            </div>
                                            <input
                                                name="buyPrice"
                                                value={formData.buyPrice}
                                                onChange={handleChange}
                                                placeholder="28,500"
                                                className="py-2.5 flex-1 rounded-r-lg border border-slate-300 px-4 text-sm text-[#0B1E3D] outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/15"
                                            />
                                        </div>
                                        <span className='text-[12px] text-gray-600'>Buyers can purchase immediately at this price</span>
                                    </div>

                                    {/* reserve price */}
                                    <div className="space-y-2">
                                        <label className="block text-[13px] font-medium text-[#0B1E3D]">
                                            Reserve Price (Optional) <span className="text-red-500">*</span>
                                        </label>

                                        <div className="flex">
                                            <div className="flex py-2.5 w-12 items-center justify-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-sm font-medium text-[#0B1E3D]">
                                                $
                                            </div>
                                            <input
                                                name="reservePrice"
                                                value={formData.reservePrice}
                                                onChange={handleChange}
                                                placeholder="28,500"
                                                className="py-2.5 flex-1 rounded-r-lg border border-slate-300 px-4 text-sm text-[#0B1E3D] outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/15"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ======== Auction setting ======== */}
                            <div className=''>
                                <h2 className="mt-2 mb-5 flex items-center gap-2 text-md font-bold text-[#0B1E3D]">
                                    <Settings size={18} className="text-[#D97706]" />
                                    Auction Settings
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                </div>
                            </div>

                            {/* ======== Additional Setting ======== */}
                            <div className=''>
                                <h2 className="mt-2 mb-5 flex items-center gap-2 text-md font-bold text-[#0B1E3D]">
                                    <SlidersHorizontal size={18} className="text-[#D97706]" />
                                    Additional Settings
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                </div>
                            </div>
                        </div>
                    )}


                    {/* footer btns */}
                    <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-100">

                        {currentStep === 1 && (
                            <button
                                type="button"
                                onClick={() => setCurrentPage('dashboard')}
                                className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]">
                                Cancel
                            </button>
                        )}

                        {(currentStep >= 2 && currentStep <= 7) && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
                            >
                                <ArrowLeft size={16} /> Back
                            </button>
                        )}

                        {(currentStep >= 1 && currentStep <= 6) && (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="inline-flex h-11 items-center gap-2 rounded-xl bg-linear-to-r from-[#D97706] to-[#B45309] px-8 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-all duration-200 hover:from-[#B45309] hover:to-[#92400E] hover:shadow-lg hover:shadow-orange-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Save & Continue <ArrowRight size={16} />
                            </button>
                        )}

                        {currentStep === 7 && (
                            <button
                                type="button"
                                className="inline-flex h-11 items-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-emerald-700 px-8 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 transition-all duration-200 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Submit <ArrowRight size={16} />
                            </button>
                        )}

                    </div>
                </div>

                {/* ------------------ right ------------------ */}
                <div className='w-[35%]'>

                </div>
            </div>
        </div>
    )
}

export default AddNewVehicle