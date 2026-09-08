
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Car, CarFront, Check, CheckCircle2, ClipboardCheck, Gauge, ImagePlus, Images, Info, LockKeyhole, Mail, MapPin, Pencil, Settings, ShieldCheck, SlidersHorizontal, Tag, Upload, X, FileText, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';
import FormInputFields from '../../SellerRegistration/FormInputFields';
import { useAddVehicle, useDecodeVin } from '../../../hook/useVehicle';

const steps = [
    { label: "Vehicle Details", },
    { label: "Condition & Details", },
    { label: "Images", },
    { label: "Vehicle Documents", },
    { label: "Pricing & Auction", },
    { label: "Review & Submit", },
];

function AddNewVehicle({ setCurrentPage }) {

    const stepRefs = useRef([]);

    const { mutate: addVehicle, isPending: isContinue } = useAddVehicle();
    const { mutate: decodeVin, isPending: isDecoding } = useDecodeVin();

    const [currentStep, setCurrentStep] = useState(1);

    const [images, setImages] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

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
        interiorColor: "",
        country: "united_arab_emirates",
        emirate: "",
        city: "",
        zipCode: "",
        titleStatus: "",
        accidentHistory: "",
        vehicleDescription: "",
        // step - 2
        overallCondition: "",
        mechanicalCondition: "",
        interiorCondition: "",
        exteriorCondition: "",
        doors: "",
        seats: "",
        engineSize: "",
        cylinders: "",
        keyType: "",
        additionalFeatures: "",
        numberOfKeys: "",
        repainted: "",
        smokeOdor: "",
        petFriendly: "",
        paintType: "",
        glassCondition: "",
        tiresCondition: "",
        tireBrand: "",
        tireSize: "",
        seatMaterial: "",
        sunroof: "",
        acHeater: "",
        audioSystem: "",
        navigation: "",
        powerWindows: "",
        powerLocks: "",
        additionalNotes: "",
        // step - 3
        startingBidPrice: "",
        buyNowPrice: "",
        reservePrice: "",
        priceType: "",
        auctionType: "live",
        auctionStartDate: "",
        auctionStartTime: "",
        auctionDuration: "7_days",
        allowBiddersToSave: true,
        shareOnSocialMedia: true,
        featuredListing: false,
        autoRelist: false,
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

        if (name === 'priceType') {
            setFormData((prev) => ({
                ...prev,
                priceType: value,
                startingBidPrice: '',
                buyNowPrice: '',
                reservePrice: '',
            }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

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

    // images handler
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        addImages(files);
    };

    const formatTo12Hour = (time) => {
        if (!time) return "";

        const [hours, minutes] = time.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        const twelveHour = hours % 12 || 12;

        return `${String(twelveHour).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        addImages(files);
    }

    const addImages = (files) => {
        const imageFiles = files.filter((f) => f.type.startsWith("image/"));
        const invalidCount = files.length - imageFiles.length;

        const remainingSlots = 15 - images.length;

        if (remainingSlots <= 0) {
            toast.error("Maximum 15 images allowed");
            return;
        }

        if (imageFiles.length > remainingSlots) {
            toast.error(`Only ${remainingSlots} more image(s) allowed (max 15 total)`);
        }

        if (invalidCount > 0) {
            toast.error(`${invalidCount} file(s) skipped — only image files allowed`);
        }

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

    // doc upload
    const handleDocFileSelect = (e) => {
        const files = Array.from(e.target.files);
        addDocuments(files);
    };

    const handleDocDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        addDocuments(files);
    };

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    const addDocuments = (files) => {
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

        const validFiles = [];
        let typeInvalidCount = 0;
        let oversizedCount = 0;

        files.forEach(f => {
            const validType = allowedTypes.includes(f.type);
            const validSize = f.size <= MAX_FILE_SIZE;
            if (validType && validSize) {
                validFiles.push(f);
            } else {
                if (!validType) typeInvalidCount++;
                if (!validSize) oversizedCount++;
            }
        });

        const remainingSlots = 5 - documents.length;

        if (remainingSlots <= 0) {
            toast.error("Maximum 5 documents allowed");
            return;
        }

        if (validFiles.length > remainingSlots) {
            toast.error(`Only ${remainingSlots} more document(s) allowed (max 5 total)`);
        }

        if (typeInvalidCount > 0) {
            toast.error(`${typeInvalidCount} file(s) skipped — only PDF/JPG/PNG allowed`);
        }

        if (oversizedCount > 0) {
            toast.error(`${oversizedCount} file(s) exceed 10MB limit`);
        }

        const filesToAdd = validFiles.slice(0, remainingSlots);

        const newDocs = filesToAdd.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
            name: file.name,
            docType: "",
        }));

        setDocuments((prev) => [...prev, ...newDocs]);
    };

    const removeDocument = (index) => {
        setDocuments((prev) => {
            URL.revokeObjectURL(prev[index].previewUrl);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleDocNameChange = (index, value) => {
        setDocuments((prev) =>
            prev.map((doc, i) => (i === index ? { ...doc, name: value } : doc))
        );
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        const digitsOnly = value.replace(/\D/g, '');
        setFormData({ ...formData, [name]: digitsOnly });
    };

    // validation
    const isStepValid = () => {
        switch (currentStep) {
            case 1:
                return (
                    formData.vehicleType &&
                    formData.vin &&
                    formData.make &&
                    formData.model &&
                    formData.year &&
                    formData.bodyType &&
                    formData.mileage &&
                    formData.transmission &&
                    formData.fuelType &&
                    formData.drivetrain &&
                    formData.exteriorColor &&
                    formData.interiorColor &&
                    formData.vehicleDescription &&
                    formData.emirate &&
                    formData.city &&
                    formData.titleStatus &&
                    formData.accidentHistory
                );
            case 2:
                return (
                    formData.overallCondition &&
                    formData.mechanicalCondition &&
                    formData.interiorCondition &&
                    formData.exteriorCondition &&
                    formData.doors &&
                    formData.seats &&
                    formData.engineSize
                );
            case 3:
                return images.length > 0; // at least 1 image, matches backend rule
            case 4:
                return true; // documents optional
            case 5:
                const priceOk = formData.priceType === 'fixed_price'
                    ? Number(formData.buyNowPrice) > Number(formData.startingBidPrice)
                    : formData.priceType === 'reserve_price'
                        ? Number(formData.reservePrice) > Number(formData.startingBidPrice)
                        : false;

                const startDateOk = formData.auctionStartDate && formData.auctionStartTime
                    ? new Date(`${formData.auctionStartDate}T${formData.auctionStartTime}`) > new Date()
                    : false;
                return !!(
                    (formData.priceType === 'reserve_price' ? formData.startingBidPrice : true) &&
                    formData.priceType &&
                    priceOk &&
                    formData.auctionType &&
                    startDateOk &&
                    formData.auctionDuration
                );
        }
    };

    // btns control
    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        } else {
            setCurrentPage('dashboard');
        }
    };

    const handleNext = () => {
        if (!isStepValid()) {
            showStepError(currentStep);
            return;
        }
        if (currentStep < steps.length) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const showStepError = (step) => {
        if (step === 5) {
            if (!formData.priceType) {
                toast.error("Select a price type");
            } else if (formData.priceType === 'reserve_price' && !formData.startingBidPrice) {
                toast.error("Enter a starting bid price");
            } else if (formData.priceType === 'reserve_price' &&
                !(Number(formData.reservePrice) > Number(formData.startingBidPrice))) {
                toast.error("Reserve Price must be greater than Starting Bid Price");
            } else if (formData.priceType === 'fixed_price' && !formData.buyNowPrice) {
                toast.error("Enter a Buy Now Price");
            } else if (!formData.auctionStartDate || !formData.auctionStartTime ||
                new Date(`${formData.auctionStartDate}T${formData.auctionStartTime}`) <= new Date()) {
                toast.error("Auction start date/time must be in the future");
            } else if (!formData.auctionType || !formData.auctionDuration) {
                toast.error("Complete auction type and duration");
            } else {
                toast.error("Please complete all required fields");
            }
        } else {
            toast.error("Please complete all required fields");
        }
    };

    {/* ======== Vehicle Summary (sidebar, Steps 2-5) ======== */ }
    const VehicleSummaryCard = ({ formData, images, onEdit, compact = false }) => {
        const coverImage = images?.[0];

        return (
            <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-[#0B1E3D]">Vehicle Summary</h3>
                    {onEdit && (
                        <button type="button" onClick={onEdit} className="text-xs font-medium text-[#D97706] hover:underline flex items-center gap-1">
                            <Pencil size={12} /> Edit
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3 mb-6">
                    <img
                        src={coverImage?.previewUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQbzMBAYcmRKCN_FuR1TQC0WgfQ7Ayg9M76jc2npaWppzTy7HVcqkXCuI&s=10"}
                        alt="Vehicle"
                        className="w-18 h-16 object-cover rounded-lg bg-slate-100"
                    />
                    <div>
                        <p className="text-sm font-bold text-[#0B1E3D]">
                            {formData.year || "2024"} {formData.make || "Toyota"} {formData.model || "Land Cruiser"}
                        </p>
                        <p className="text-xs text-slate-400">VIN: {formData.vin || "JTMHV05J8M1234567"}</p>
                    </div>
                </div>

                <div className="mb-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        <CheckCircle2 size={12} /> All details saved
                    </span>
                </div>

                {!compact && (
                    <div className="space-y-4 text-[13px]">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Vehicle Type</span>
                            <span className="text-[#0B1E3D] font-medium">{formData.vehicleType || "NA"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Make / Model</span>
                            <span className="text-[#0B1E3D] font-medium">{formData.make} / {formData.model}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Year</span>
                            <span className="text-[#0B1E3D] font-medium">{formData.year}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Body Type</span>
                            <span className="text-[#0B1E3D] font-medium">{formData.bodyType}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Mileage</span>
                            <span className="text-[#0B1E3D] font-medium">{formData.mileage} miles</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Fuel Type</span>
                            <span className="text-[#0B1E3D] font-medium">{formData.fuelType}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Transmission</span>
                            <span className="text-[#0B1E3D] font-medium">{formData.transmission}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Drivetrain</span>
                            <span className="text-[#0B1E3D] font-medium">{formData.drivetrain}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Exterior Color</span>
                            <span className="text-[#0B1E3D] font-medium">{formData.exteriorColor || "---"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Interior Color</span>
                            <span className="text-[#0B1E3D] font-medium">{formData.interiorColor || "---"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Location</span>
                            <span className="text-[#0B1E3D] font-medium">{formData.city}, {formData.emirate}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Title Status</span>
                            <span className="text-[#0B1E3D] font-medium">{formData.titleStatus}</span>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const handleVinBlur = () => {
        const vin = formData.vin.trim().toUpperCase();

        if (!vin) return;

        decodeVin(vin, {
            onSuccess: (res) => {

                const decodedMake = res?.data?.make || res?.make || "";
                const decodedModel = res?.data?.model || res?.model || "";

                const normalizedMake = decodedMake
                    .toLowerCase()
                    .trim()
                    .replace(/mercedes[-\s]?benz/, "mercedes")
                    .replace(/land[-\s]?rover/, "land_rover");

                const matchedMake = makeOptions.find(
                    (make) => make.value === normalizedMake
                );

                setFormData((prev) => ({
                    ...prev,
                    make: matchedMake ? matchedMake.value : "other",
                    model: decodedModel || prev.model,
                }));
                if (!matchedMake) {
                    toast.info("VIN decoded, but make is not in the list. Please select Other or choose manually.");
                }
            },
            onError: () => {
                toast.error("VIN could not be decoded. Please select make and enter model manually.");
            }
        })
    }

    const handleSubmit = () => {
        const payload = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '') return;
            payload.append(
                key,
                key === "auctionStartTime" ? formatTo12Hour(value) : String(value)
            );
        });

        images.forEach(({ file }) => {
            payload.append("images", file);
        });

        documents.forEach(({ file }) => {
            payload.append("documents", file);
        });

        addVehicle(payload, {
            onSuccess: () => setIsSubmitModalOpen(true),
        });
    }

    useEffect(() => {
        if (isSubmitModalOpen) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }, [isSubmitModalOpen]);

    const yearOptions = Array.from({ length: 2026 - 1980 + 1 }, (_, i) => {
        const year = 2026 - i;
        return {
            label: year.toString(),
            value: year.toString(),
        };
    });

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
                                        ]}
                                    />

                                    {/* vin */}
                                    <div>
                                        <FormInputFields
                                            label="VIN"
                                            name="vin"
                                            value={formData.vin}
                                            onChange={handleChange}
                                            onBlur={handleVinBlur}
                                            disabled={isDecoding}
                                            required
                                            placeholder="Enter VIN Number"
                                        />
                                        {isDecoding && (
                                            <p className="mt-1 text-[12px] text-[#D97706] flex items-center gap-1">
                                                <Loader2 size={12} className="animate-spin" />
                                                Decoding VIN...
                                            </p>
                                        )}
                                    </div>

                                    {/* Make */}
                                    <FormInputFields
                                        label="Make"
                                        type="select"
                                        name="make"
                                        value={formData.make}
                                        onChange={handleChange}
                                        required
                                        options={makeOptions}
                                    />

                                    {/* Model */}
                                    <FormInputFields
                                        label="Model"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter Model"
                                    />

                                    {/* Year */}
                                    <FormInputFields
                                        label="Year"
                                        type="select"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        required
                                        options={yearOptions}
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
                                        ]}
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
                                            { label: "Plug-in Hybrid", value: "plug_in_hybrid" },
                                            { label: "CNG", value: "cng" },
                                            { label: "LPG", value: "lpg" },
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
                                            { label: "Front-Wheel Drive (FWD)", value: "fwd" },
                                            { label: "Rear-Wheel Drive (RWD)", value: "rwd" },
                                            { label: "All-Wheel Drive (AWD)", value: "awd" },
                                            { label: "Four-Wheel Drive (4WD)", value: "4wd" },
                                        ]}
                                    />

                                    {/* Exterior Color */}
                                    <FormInputFields
                                        label="Exterior Color"
                                        type="select"
                                        name="exteriorColor"
                                        value={formData.exteriorColor}
                                        onChange={handleChange}
                                        required
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
                                    />

                                    {/* Interior Color */}
                                    <FormInputFields
                                        label="Interior Color"
                                        type="select"
                                        name="interiorColor"
                                        value={formData.interiorColor}
                                        onChange={handleChange}
                                        required
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
                                    />

                                </div>

                                {/* vehicle description */}
                                <div className="mt-5">
                                    <FormInputFields
                                        label="Vehicle Description"
                                        type="textarea"
                                        name="vehicleDescription"
                                        value={formData.vehicleDescription}
                                        onChange={handleChange}
                                        placeholder="Enter description about vehicles"
                                        rows={4}
                                        required
                                    />

                                    <div className="flex justify-end mt-1">
                                        <span className="text-[10px] text-slate-400">
                                            {formData.additionalFeatures?.length || 0}/300
                                        </span>
                                    </div>
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
                                            { label: "United Arab Emirates", value: "united_arab_emirates" },
                                        ]}
                                    />

                                    {/* emirate */}
                                    <FormInputFields
                                        label="Emirate"
                                        type="select"
                                        name="emirate"
                                        value={formData.emirate}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "Abu Dhabi", value: "abu_dhabi" },
                                            { label: "Dubai", value: "dubai" },
                                            { label: "Sharjah", value: "sharjah" },
                                            { label: "Ajman", value: "ajman" },
                                            { label: "Umm Al Quwain", value: "umm_al_quwain" },
                                            { label: "Ras Al Khaimah", value: "ras_al_khaimah" },
                                            { label: "Fujairah", value: "fujairah" },
                                        ]}
                                    />

                                    {/* City */}
                                    <FormInputFields
                                        label="City"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter City"
                                    />

                                    {/* Zip Code */}
                                    <FormInputFields
                                        label="Zip Code"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
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
                                                { label: "Clean", value: "clean" },
                                                { label: "Salvage", value: "salvage" },
                                                { label: "Rebuilt", value: "rebuilt" },
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
                                                    value="not_sure"
                                                    checked={formData.accidentHistory === "not_sure"}
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
                                            { label: "2 Doors", value: "2" },
                                            { label: "3 Doors", value: "3" },
                                            { label: "4 Doors", value: "4" },
                                            { label: "5 Doors", value: "5" },
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
                                            { label: "2 Seats", value: "2" },
                                            { label: "3 Seats", value: "3" },
                                            { label: "4 Seats", value: "4" },
                                            { label: "5 Seats", value: "5" },
                                            { label: "6 Seats", value: "6" },
                                            { label: "7 Seats", value: "7" },
                                            { label: "8 Seats", value: "8" },
                                            { label: "9 Seats", value: "9" },
                                        ]}
                                    />

                                    {/* Engine Size */}
                                    <FormInputFields
                                        label="Engine Size"
                                        name="engineSize"
                                        value={formData.engineSize}
                                        onChange={handleChange}
                                        placeholder="Enter Engine Size (e.g. 2.0L)"
                                        required
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

                                    {/* Key Type */}
                                    <FormInputFields
                                        label="Key Type"
                                        type="select"
                                        name="keyType"
                                        value={formData.keyType}
                                        onChange={handleChange}
                                        options={[
                                            { label: "Standard Key", value: "standard" },
                                            { label: "Remote Key", value: "remote" },
                                            { label: "Smart Key", value: "smart_key" },
                                            { label: "Keyless Entry", value: "keyless_entry" },
                                            { label: "Keyless Start", value: "keyless_start" },
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

                            {/* ======== Additional Info ======== */}
                            <div className="mt-8">
                                <h2 className="mt-2 mb-5 flex items-center gap-2 text-md font-bold text-[#0B1E3D]">
                                    <SlidersHorizontal size={18} className="text-[#D97706]" />
                                    Additional Info
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                                    {/* Number of Keys */}
                                    <FormInputFields
                                        label="Number of Keys"
                                        type="number"
                                        name="numberOfKeys"
                                        value={formData.numberOfKeys}
                                        onChange={handleChange}
                                        placeholder="e.g. 2"
                                    />

                                    {/* Repainted */}
                                    <FormInputFields
                                        label="Repainted"
                                        type="select"
                                        name="repainted"
                                        value={formData.repainted}
                                        onChange={handleChange}
                                        options={[
                                            { label: "Select", value: "" },
                                            { label: "Yes", value: "yes" },
                                            { label: "No", value: "no" },
                                        ]}
                                    />

                                    {/* Smoke Odor */}
                                    <FormInputFields
                                        label="Smoke Odor"
                                        type="select"
                                        name="smokeOdor"
                                        value={formData.smokeOdor}
                                        onChange={handleChange}
                                        options={[
                                            { label: "Select", value: "" },
                                            { label: "Yes", value: "yes" },
                                            { label: "No", value: "no" },
                                        ]}
                                    />

                                    {/* Pet Friendly */}
                                    <FormInputFields
                                        label="Pet Friendly"
                                        type="select"
                                        name="petFriendly"
                                        value={formData.petFriendly}
                                        onChange={handleChange}
                                        options={[
                                            { label: "Select", value: "" },
                                            { label: "Yes", value: "yes" },
                                            { label: "No", value: "no" },
                                        ]}
                                    />

                                    {/* Paint Type */}
                                    <FormInputFields
                                        label="Paint Type"
                                        type="select"
                                        name="paintType"
                                        value={formData.paintType}
                                        onChange={handleChange}
                                        options={[
                                            { label: "Select", value: "" },
                                            { label: "Factory Original", value: "factory_original" },
                                            { label: "Repainted", value: "repainted" },
                                        ]}
                                    />

                                    {/* Glass Condition */}
                                    <FormInputFields
                                        label="Glass Condition"
                                        type="select"
                                        name="glassCondition"
                                        value={formData.glassCondition}
                                        onChange={handleChange}
                                        options={[
                                            { label: "No Cracks", value: "no_cracks" },
                                            { label: "Minor Cracks", value: "minor_cracks" },
                                            { label: "Major Cracks", value: "major_cracks" },
                                        ]}
                                    />

                                    {/* Tires Condition */}
                                    <FormInputFields
                                        label="Tires Condition"
                                        type='select'
                                        name="tiresCondition"
                                        value={formData.tiresCondition}
                                        onChange={handleChange}
                                        options={[
                                            { label: "Excellent", value: "excellent" },
                                            { label: "Good", value: "good" },
                                            { label: "Fair", value: "fair" },
                                            { label: "Poor", value: "poor" },
                                            { label: "Needs Replacement", value: "needs_replacement" },
                                        ]}
                                    />

                                    {/* Tire Brand */}
                                    <FormInputFields
                                        label="Tire Brand"
                                        name="tireBrand"
                                        value={formData.tireBrand}
                                        onChange={handleChange}
                                        placeholder="e.g. Michelin"
                                    />

                                    {/* Tire Size */}
                                    <FormInputFields
                                        label="Tire Size"
                                        name="tireSize"
                                        value={formData.tireSize}
                                        onChange={handleChange}
                                        placeholder="e.g. 255/50 R19"
                                    />

                                    {/* Seat Material */}
                                    <FormInputFields
                                        label="Seat Material"
                                        type="select"
                                        name="seatMaterial"
                                        value={formData.seatMaterial}
                                        onChange={handleChange}
                                        options={[
                                            { label: "Fabric", value: "fabric" },
                                            { label: "Leather", value: "leather" },
                                            { label: "Synthetic Leather", value: "synthetic_leather" },
                                            { label: "Suede", value: "suede" },
                                            { label: "Alcantara", value: "alcantara" },
                                            { label: "Vinyl", value: "vinyl" },
                                        ]}
                                    />

                                    {/* Sunroof */}
                                    <FormInputFields
                                        label="Sunroof"
                                        type="select"
                                        name="sunroof"
                                        value={formData.sunroof}
                                        onChange={handleChange}
                                        options={[
                                            { label: "Yes", value: "yes" },
                                            { label: "No", value: "no" },
                                            { label: "Panoramic", value: "panoramic" },
                                        ]}
                                    />

                                    {/* AC/Heater */}
                                    <FormInputFields
                                        label="AC/Heater"
                                        name="acHeater"
                                        value={formData.acHeater}
                                        onChange={handleChange}
                                        placeholder="e.g. AC Dual Zone"
                                    />

                                    {/* Audio System */}
                                    <FormInputFields
                                        label="Audio System"
                                        name="audioSystem"
                                        value={formData.audioSystem}
                                        onChange={handleChange}
                                        placeholder="e.g. Harman Kardon"
                                    />

                                    {/* Navigation */}
                                    <FormInputFields
                                        label="Navigation"
                                        type="select"
                                        name="navigation"
                                        value={formData.navigation}
                                        onChange={handleChange}
                                        options={[
                                            { label: "Yes", value: "yes" },
                                            { label: "No", value: "no" },
                                            { label: "Built In", value: "built_in" },
                                        ]}
                                    />

                                    {/* Power Windows */}
                                    <FormInputFields
                                        label="Power Windows"
                                        type="select"
                                        name="powerWindows"
                                        value={formData.powerWindows}
                                        onChange={handleChange}
                                        options={[
                                            { label: "Yes", value: "yes" },
                                            { label: "No", value: "no" },
                                        ]}
                                    />

                                    {/* Power Locks */}
                                    <FormInputFields
                                        label="Power Locks"
                                        type="select"
                                        name="powerLocks"
                                        value={formData.powerLocks}
                                        onChange={handleChange}
                                        options={[
                                            { label: "Yes", value: "yes" },
                                            { label: "No", value: "no" },
                                        ]}
                                    />

                                </div>

                                {/* Additional Notes */}
                                <div className="mt-5">
                                    <FormInputFields
                                        label="Additional Notes"
                                        type="textarea"
                                        name="additionalNotes"
                                        value={formData.additionalNotes}
                                        onChange={handleChange}
                                        placeholder="Any additional notes about the vehicle's condition"
                                        rows={4}
                                    />
                                    <div className="flex justify-end mt-1">
                                        <span className="text-[10px] text-slate-400">
                                            {formData.additionalNotes?.length || 0}/300
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
                            <h2 className="mt-2 mb-5 flex items-center gap-2 text-md font-bold text-[#0B1E3D]">
                                <FileText size={18} className="text-[#D97706]" />
                                Vehicle Documents
                            </h2>

                            {/* guideline */}
                            <div className="w-full flex items-start gap-3 p-4 bg-blue-50/60 border border-blue-200 rounded-lg">
                                <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center shrink-0">
                                    <Info className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-xs sm:text-sm font-semibold text-blue-700">Document Guidelines</h3>
                                    <p className="mt-1 text-xs sm:text-sm text-slate-600">Upload supporting documents like Title Certificate, Service History, Inspection Report.</p>
                                    <p className="mt-1 text-xs sm:text-sm text-slate-600">Accepted formats: PDF, JPG, PNG. Max size: 10MB per document.</p>
                                </div>
                            </div>

                            {/* Dropzone */}
                            <label
                                onDrop={handleDocDrop}
                                onDragOver={(e) => e.preventDefault()}
                                className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center cursor-pointer hover:border-[#D97706] transition-colors"
                            >
                                <Upload size={28} className="text-slate-400" />
                                <p className="text-sm font-medium text-slate-600">Upload Documents</p>
                                <p className="text-xs text-slate-400">Drag & drop files here or</p>
                                <span className="mt-1 inline-flex items-center rounded-lg bg-[#D97706] px-4 py-2 text-xs font-semibold text-white">
                                    Choose Files
                                </span>
                                <input
                                    type="file"
                                    accept=".pdf,image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleDocFileSelect}
                                />
                            </label>

                            {/* Uploaded docs list */}
                            {documents.length > 0 && (
                                <div className="space-y-3">
                                    {documents.map((doc, index) => (
                                        <div key={doc.previewUrl} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50">
                                                <FileText size={18} className="text-red-500" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <input
                                                    type="text"
                                                    value={doc.name}
                                                    onChange={(e) => handleDocNameChange(index, e.target.value)}
                                                    placeholder="e.g. Title Certificate"
                                                    className="w-full text-sm font-medium text-[#0B1E3D] border-none focus:outline-none focus:ring-1 focus:ring-[#D97706] rounded px-1"
                                                />
                                                <p className="text-xs text-slate-400">
                                                    {doc.file?.type?.includes("pdf") ? "PDF" : "Image"} • {(doc.file?.size / (1024 * 1024)).toFixed(1)} MB
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => removeDocument(index)}
                                                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className='space-y-8'>

                            {/* ======== Pricing info ======== */}
                            <div className=''>
                                <h2 className="mt-2 mb-5 flex items-center gap-2 text-md font-bold text-[#0B1E3D]">
                                    <Tag size={18} className="text-[#D97706]" />
                                    Pricing Information
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                                    {/* Price Type */}
                                    <div>
                                        <label className="block text-[13px] font-medium text-[#0B1E3D] mb-2">
                                            Price Type <span className="text-red-500">*</span>
                                        </label>

                                        <div className="flex flex-wrap items-center gap-2">

                                            {/* Fixed Price */}
                                            <label className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                                <input
                                                    type="radio"
                                                    name="priceType"
                                                    value="fixed_price"
                                                    checked={formData.priceType === "fixed_price"}
                                                    onChange={handleChange}
                                                    className="accent-[#D97706]"
                                                />

                                                <span className="text-[13px] text-slate-600">
                                                    Fixed Price
                                                </span>
                                            </label>

                                            {/* Reserve Price */}
                                            <label className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                                <input
                                                    type="radio"
                                                    name="priceType"
                                                    value="reserve_price"
                                                    checked={formData.priceType === "reserve_price"}
                                                    onChange={handleChange}
                                                    className="accent-[#D97706]"
                                                />

                                                <span className="text-[13px] text-slate-600">
                                                    Reserve Price
                                                </span>
                                            </label>

                                        </div>
                                    </div>

                                    {/* starting bid price — only for reserve_price */}
                                    {formData.priceType === 'reserve_price' && (
                                        <FormInputFields
                                            label="Starting Bid Price"
                                            name="startingBidPrice"
                                            type="text"
                                            prefix="$"
                                            maxLength={9}
                                            value={formData.startingBidPrice}
                                            onChange={handlePriceChange}
                                            placeholder="28500"
                                        />
                                    )}

                                    {/* buy now price — sirf fixed_price (explicit check */}
                                    {formData.priceType === 'fixed_price' && (
                                        <FormInputFields
                                            label="Buy Now Price"
                                            name="buyNowPrice"
                                            type="text"
                                            prefix="$"
                                            maxLength={9}
                                            value={formData.buyNowPrice}
                                            onChange={handlePriceChange}
                                            placeholder="28500"
                                        />
                                    )}

                                    {/* reserve price — sirf reserve_price */}
                                    {formData.priceType === 'reserve_price' && (
                                        <FormInputFields
                                            label="Reserve Price"
                                            name="reservePrice"
                                            type="text"
                                            prefix="$"
                                            maxLength={9}
                                            value={formData.reservePrice}
                                            onChange={handlePriceChange}
                                            placeholder="28500"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* ======== Auction setting ======== */}
                            <div className=''>
                                <h2 className="mt-2 mb-5 flex items-center gap-2 text-md font-bold text-[#0B1E3D]">
                                    <Settings size={18} className="text-[#D97706]" />
                                    Auction Settings
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                                    {/* Auction Type */}
                                    <div>
                                        <FormInputFields
                                            label="Auction Type"
                                            type="select"
                                            name="auctionType"
                                            value={formData.auctionType}
                                            onChange={handleChange}
                                            required
                                            options={[
                                                { label: "Live Auction", value: "live" },
                                                { label: "Timed Auction", value: "timed" },
                                            ]}
                                        />
                                        <p className="mt-1 text-[12px] text-slate-500">Bidders compete in real-time</p>
                                    </div>

                                    {/* auction start */}
                                    <div>
                                        <label className="block text-[13px] font-medium text-[#0B1E3D] mb-2">
                                            Auction Starts <span className="text-red-500">*</span>
                                        </label>

                                        <div className="grid grid-cols-2 gap-2">
                                            <FormInputFields
                                                type="date"
                                                name="auctionStartDate"
                                                value={formData.auctionStartDate}
                                                onChange={handleChange}
                                                min={new Date().toISOString().split('T')[0]}
                                                required
                                            />

                                            <FormInputFields
                                                type="time"
                                                name="auctionStartTime"
                                                value={formData.auctionStartTime}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Auction Duration */}
                                    <div>
                                        <FormInputFields
                                            label="Auction Duration"
                                            type="select"
                                            name="auctionDuration"
                                            value={formData.auctionDuration}
                                            onChange={handleChange}
                                            required
                                            options={[
                                                { label: "1 Day", value: "1_day" },
                                                { label: "3 Days", value: "3_days" },
                                                { label: "5 Days", value: "5_days" },
                                                { label: "7 Days", value: "7_days" },
                                                { label: "14 Days", value: "14_days" },
                                            ]}
                                        />
                                        <p className="mt-1 text-[12px] text-slate-500">Duration of the auction</p>
                                    </div>
                                </div>
                            </div>

                            {/* ======== Additional Setting ======== */}
                            <div className=''>
                                <h2 className="mt-2 mb-5 flex items-center gap-2 text-md font-bold text-[#0B1E3D]">
                                    <SlidersHorizontal size={18} className="text-[#D97706]" />
                                    Additional Settings
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        { name: "allowBiddersToSave", title: "Allow Bidders to Save", desc: "Allow bidders to save this vehicle to their watchlist" },
                                        { name: "shareOnSocialMedia", title: "Share on Social Media", desc: "Automatically share this listing on social platforms" },
                                        { name: "featuredListing", title: "Featured Listing (Recommended)", desc: "Feature your listing for more visibility" },
                                        { name: "autoRelist", title: "Auto Relist", desc: "Automatically relist if the vehicle doesn't sell" },
                                    ].map((item) => (
                                        <label key={item.name} className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name={item.name}
                                                checked={formData[item.name] || false}
                                                onChange={(e) => setFormData({ ...formData, [item.name]: e.target.checked })}
                                                className="mt-1 h-4 w-4 rounded border-slate-300 text-[#D97706] focus:ring-[#D97706]/30 accent-[#D97706]"
                                            />
                                            <div>
                                                <p className="text-[13px] font-medium text-[#0B1E3D]">{item.title}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 6 && (
                        <div className='space-y-8'>
                            <div className=''>
                                <h2 className="mt-2 mb-5 flex items-center gap-2 text-md font-bold text-[#0B1E3D]">
                                    <ClipboardCheck size={18} className="text-[#D97706]" />
                                    Review Your Vehicle Listing
                                </h2>
                            </div>

                            {/* Vehicle Details */}
                            <div className="border border-slate-200 rounded-xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-[#0B1E3D]">Vehicle Details</h3>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep(1)}
                                        className="text-xs font-medium text-[#D97706] hover:underline">
                                        Edit
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-6 text-sm">
                                    <div><span className="text-slate-500">Vehicle Type: </span><span className="text-[#0B1E3D] font-medium">{formData.vehicleType || "---"}</span></div>
                                    <div><span className="text-slate-500">Make / Model: </span><span className="text-[#0B1E3D] font-medium">{formData.make} / {formData.model}</span></div>
                                    <div><span className="text-slate-500">Year: </span><span className="text-[#0B1E3D] font-medium">{formData.year}</span></div>
                                    <div><span className="text-slate-500">Body Type: </span><span className="text-[#0B1E3D] font-medium">{formData.bodyType}</span></div>
                                    <div><span className="text-slate-500">VIN: </span><span className="text-[#0B1E3D] font-medium">{formData.vin}</span></div>
                                    <div><span className="text-slate-500">Trim: </span><span className="text-[#0B1E3D] font-medium">{formData.trim}</span></div>
                                    <div><span className="text-slate-500">Mileage: </span><span className="text-[#0B1E3D] font-medium">{formData.mileage}</span></div>
                                    <div><span className="text-slate-500">Transmission: </span><span className="text-[#0B1E3D] font-medium">{formData.transmission}</span></div>
                                    <div><span className="text-slate-500">Fuel Type: </span><span className="text-[#0B1E3D] font-medium">{formData.fuelType}</span></div>
                                    <div><span className="text-slate-500">Drivetrain: </span><span className="text-[#0B1E3D] font-medium">{formData.drivetrain}</span></div>
                                    <div><span className="text-slate-500">Exterior Color: </span><span className="text-[#0B1E3D] font-medium">{formData.exteriorColor}</span></div>
                                </div>
                            </div>

                            {/* Condition & Details */}
                            <div className="border border-slate-200 rounded-xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-[#0B1E3D]">Condition & Details</h3>
                                    <button type="button" onClick={() => setCurrentStep(2)} className="text-xs font-medium text-[#D97706] hover:underline">
                                        Edit
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-6 text-sm">
                                    <div><span className="text-slate-500">Overall Condition: </span><span className="text-[#0B1E3D] font-medium">{formData.overallCondition}</span></div>
                                    <div><span className="text-slate-500">Mechanical Condition: </span><span className="text-[#0B1E3D] font-medium">{formData.mechanicalCondition}</span></div>
                                    <div><span className="text-slate-500">Interior Condition: </span><span className="text-[#0B1E3D] font-medium">{formData.interiorCondition}</span></div>
                                    <div><span className="text-slate-500">Exterior Condition: </span><span className="text-[#0B1E3D] font-medium">{formData.exteriorCondition}</span></div>
                                    <div><span className="text-slate-500">Title Status: </span><span className="text-[#0B1E3D] font-medium">{formData.titleStatus}</span></div>
                                    <div><span className="text-slate-500">Accident History: </span><span className="text-[#0B1E3D] font-medium">{formData.accidentHistory}</span></div>
                                    <div><span className="text-slate-500">Doors: </span><span className="text-[#0B1E3D] font-medium">{formData.doors}</span></div>
                                    <div><span className="text-slate-500">Seats: </span><span className="text-[#0B1E3D] font-medium">{formData.seats}</span></div>
                                    <div><span className="text-slate-500">Engine Size: </span><span className="text-[#0B1E3D] font-medium">{formData.engineSize}</span></div>
                                    <div><span className="text-slate-500">Cylinders: </span><span className="text-[#0B1E3D] font-medium">{formData.cylinders}</span></div>
                                    <div><span className="text-slate-500">Key Type: </span><span className="text-[#0B1E3D] font-medium">{formData.keyType}</span></div>
                                    <div className="sm:col-span-3"><span className="text-slate-500">Additional Features: </span><span className="text-[#0B1E3D] font-medium">{formData.additionalFeatures}</span></div>
                                    <div className="sm:col-span-3"><span className="text-slate-500">Location: </span><span className="text-[#0B1E3D] font-medium">{formData.city}, {formData.emirate}</span></div>
                                </div>
                            </div>

                            {/* Images */}
                            <div className="border border-slate-200 rounded-xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-[#0B1E3D]">Images ({images?.length || 0})</h3>
                                    <button type="button" onClick={() => setCurrentStep(3)} className="text-xs font-medium text-[#D97706] hover:underline">
                                        Edit
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                    {images?.slice(0, 6).map((img, i) => (
                                        <img
                                            key={i}
                                            src={img.previewUrl}
                                            alt={`vehicle-${i}`}
                                            className="w-full h-20 object-cover rounded-lg"
                                        />
                                    ))}
                                    {images?.length > 6 && (
                                        <div className="w-full h-20 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-500">
                                            +{images.length - 6} More
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pricing & Auction */}
                            <div className="border border-slate-200 rounded-xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-[#0B1E3D]">Pricing & Auction</h3>
                                    <button type="button" onClick={() => setCurrentStep(4)} className="text-xs font-medium text-[#D97706] hover:underline">
                                        Edit
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-6 text-sm">
                                    <div><span className="text-slate-500">Starting Bid Price: </span><span className="text-[#0B1E3D] font-medium">${formData.startingBidPrice}</span></div>
                                    <div><span className="text-slate-500">Buy Now Price: </span><span className="text-[#0B1E3D] font-medium">${formData.buyNowPrice}</span></div>
                                    <div><span className="text-slate-500">Reserve Price: </span><span className="text-[#0B1E3D] font-medium">${formData.reservePrice}</span></div>
                                    <div><span className="text-slate-500">Price Type: </span><span className="text-[#0B1E3D] font-medium">{formData.priceType}</span></div>
                                    <div><span className="text-slate-500">Auction Type: </span><span className="text-[#0B1E3D] font-medium">{formData.auctionType}</span></div>
                                    <div><span className="text-slate-500">Auction Starts: </span><span className="text-[#0B1E3D] font-medium">{formData.auctionStartDate} at {formData.auctionStartTime}</span></div>
                                    <div><span className="text-slate-500">Auction Duration: </span><span className="text-[#0B1E3D] font-medium">{formData.auctionDuration}</span></div>
                                    <div><span className="text-slate-500">Time Extension: </span><span className="text-[#0B1E3D] font-medium">{formData.timeExtension}</span></div>
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

                        {(currentStep >= 1 && currentStep <= 5) && (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="inline-flex h-11 items-center gap-2 rounded-xl bg-linear-to-r from-[#D97706] to-[#B45309] px-8 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-all duration-200 hover:from-[#B45309] hover:to-[#92400E] hover:shadow-lg hover:shadow-orange-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Save & Continue <ArrowRight size={16} />
                            </button>
                        )}

                        {currentStep === 6 && (
                            <button
                                type="button"
                                onClick={() => handleSubmit()}
                                disabled={isContinue}
                                className="inline-flex h-11 items-center gap-2 rounded-xl bg-linear-to-r from-[#D97706] to-[#B45309] px-8 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-all duration-200 hover:from-[#B45309] hover:to-[#92400E] hover:shadow-lg hover:shadow-orange-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isContinue ? "Submitting..." : "Submit for Approval"}
                                <ArrowRight size={16} />

                            </button>
                        )}

                    </div>
                </div>

                {/* ------------------ right ------------------ */}
                <div className='w-[35%]'>
                    {currentStep === 1 && (
                        <>
                            <div className="group relative mb-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-linear-to-br from-white via-white to-amber-50/30 p-5 shadow-sm transition-all duration-300 hover:border-amber-200 hover:shadow-md">
                                <div className="flex items-start gap-4">

                                    {/* Icon with Soft Glow Effect */}
                                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-[#D97706] ring-4 ring-amber-50/50 transition-transform duration-300 group-hover:scale-105">
                                        <ImagePlus size={20} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-[#0B1E3D] tracking-tight">
                                                Vehicle Images
                                            </h3>
                                            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200/60">
                                                Up to 20 Photos
                                            </span>
                                        </div>

                                        <p className="mt-1 text-xs leading-relaxed text-slate-600">
                                            Add your vehicle photos in the next step to showcase it better to buyers.
                                        </p>

                                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-medium">
                                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">JPG</span>
                                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">PNG</span>
                                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">WebP</span>
                                            <span>•</span>
                                            <span className="text-amber-600 font-medium">First image will be cover photo</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border border-slate-200 rounded-xl p-5 bg-white">
                                <h3 className="text-sm font-bold text-[#0B1E3D] mb-4">Quick Tips</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Add clear, high-quality images from all angles",
                                        "Provide accurate details to attract more buyers",
                                        "Vehicles with complete information get more views",
                                        "You can edit details anytime before publishing",
                                    ].map((tip, i) => (
                                        <li key={i} className="flex items-start gap-2 text-[13px] text-slate-600">
                                            <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}

                    {(currentStep === 2 || currentStep === 3 || currentStep === 4 || currentStep === 5) && (
                        <VehicleSummaryCard formData={formData} images={images} onEdit={() => setCurrentStep(1)} />
                    )}

                    {currentStep === 6 && (
                        <>
                            <VehicleSummaryCard formData={formData} images={images} compact={true} />

                            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="flex items-start gap-2.5">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50">
                                        <ShieldCheck
                                            size={19}
                                            className="text-green-600"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-green-700">What's Next?</h3>
                                        <p className="mt-1 text-[12px] leading-4 text-slate-500">
                                            After you submit, our team will review your vehicle listing.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-3">
                                    <div className="flex items-center gap-2.5">
                                        <Mail
                                            size={14}
                                            className="shrink-0 text-green-500"
                                        />
                                        <p className="text-[12px] text-slate-600">
                                            You will receive an email notification.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                        <CheckCircle2
                                            size={14}
                                            className="shrink-0 text-green-500"
                                        />
                                        <p className="text-[12px] text-slate-600">
                                            The vehicle will be visible to buyers once approved.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 shadow-sm rounded-xl border border-amber-200 bg-amber-50/40 p-5">
                                <h3 className="text-sm font-bold text-[#0B1E3D]">
                                    Ready to Submit?
                                </h3>

                                <p className="mt-1.5 text-[12px] leading-4 text-slate-500">
                                    By submitting, you agree to our{" "}
                                    <span className="font-medium text-[#D97706]">
                                        Terms & Conditions
                                    </span>{" "}
                                    and confirm that all information provided is accurate.
                                </p>
                            </div>

                            <div className="mt-6 shadow-sm rounded-xl border border-slate-200 bg-white p-5">
                                <h3 className="mb-4 text-sm font-bold text-[#0B1E3D]">
                                    Submission Checklist
                                </h3>

                                <div className="space-y-3.5">

                                    {/* Vehicle Details */}
                                    <div className="flex items-center gap-2.5">
                                        <CheckCircle2
                                            size={14}
                                            className="shrink-0 text-green-500"
                                        />
                                        <span className="text-[13px] text-slate-600">
                                            Vehicle details added
                                        </span>
                                    </div>

                                    {/* Condition */}
                                    <div className="flex items-center gap-2.5">
                                        <CheckCircle2
                                            size={14}
                                            className="shrink-0 text-green-500"
                                        />
                                        <span className="text-[13px] text-slate-600">
                                            Condition & details completed
                                        </span>
                                    </div>

                                    {/* Images */}
                                    <div className="flex items-center gap-2.5">
                                        <CheckCircle2
                                            size={14}
                                            className="shrink-0 text-green-500"
                                        />
                                        <span className="text-[13px] text-slate-600">
                                            Images uploaded
                                        </span>
                                    </div>

                                    {/* Pricing */}
                                    <div className="flex items-center gap-2.5">
                                        <CheckCircle2
                                            size={14}
                                            className="shrink-0 text-green-500"
                                        />
                                        <span className="text-[13px] text-slate-600">
                                            Pricing & auction settings added
                                        </span>
                                    </div>

                                    {/* Approval */}
                                    <div className="mt-3 border-t border-slate-100 pt-3">
                                        <div className="flex items-center gap-2.5">
                                            <LockKeyhole
                                                size={13}
                                                className="shrink-0 text-amber-500"
                                            />
                                            <span className="text-[13px] text-slate-400">
                                                Submit for admin approval
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* popup modal */}
            {isSubmitModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md transition-all duration-300">
                    <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                        {/* Decorative Top Accent Glow */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-amber-500 via-green-500 to-blue-500" />

                        <button
                            type="button"
                            onClick={() => setCurrentPage('dashboard')}
                            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-all hover:bg-slate-200 hover:text-slate-700"
                        >
                            <X size={18} />
                        </button>

                        <div className="px-5 py-7">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 ring-8 ring-green-50/50 shadow-inner">
                                <Check
                                    size={30}
                                    strokeWidth={2.5}
                                    className="text-green-600"
                                />
                            </div>

                            {/* Heading */}
                            <div className="mt-5 text-center">
                                <h2 className="text-xl font-bold tracking-tight text-[#0B1E3D]">
                                    Vehicle Submitted Successfully!
                                </h2>
                                <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
                                    Your vehicle listing has been submitted for admin approval.
                                </p>
                            </div>

                            {/* Information Box */}
                            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                                <div className="flex items-start gap-3.5">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <Info size={18} />
                                    </div>

                                    <div className="space-y-2.5 flex-1">
                                        <p className="text-xs font-bold text-[#0B1E3D] tracking-wide uppercase">
                                            What happens next?
                                        </p>

                                        <ul className="space-y-1.5 text-xs leading-relaxed text-slate-600">
                                            <li className="flex items-start gap-2">
                                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                                <span>Our team will review your vehicle listing and verify the provided information.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                                <span>You will receive an email notification once your listing has been reviewed.</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                                <span>Once approved, your vehicle will be visible to buyers on BidDrive.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Status Section */}
                            <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-xs">
                                <span className="text-xs font-semibold text-slate-500">
                                    Listing Status :
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-[#D97706] border border-amber-200/60">
                                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                    Pending Approval
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddNewVehicle