
import React, { useEffect, useRef, useState } from 'react';
import SellerRegCarImg from '../../assets/Images/SellerRegCarImg.png'
import { Link, useNavigate } from 'react-router-dom';
import { CarFront, ChartNoAxesColumnIncreasing, Headset, LockKeyhole, ShieldCheck, UserRound, Eye, EyeOff, ArrowRight, ArrowLeft, Check, Building, Building2, MapPinned, Landmark, Info, FileCheck2, FileImage, Upload, Phone, Mail, ClipboardCheck, MailCheck, X, Clock3 } from 'lucide-react';
import confetti from "canvas-confetti";
import FormInputFields from './FormInputFields';
import { useSellerRegistrationStep1, useSellerRegistrationStep2, useSellerRegistrationStep3, useSellerRegistrationStep4, useSellerRegistrationStep5, useSellerRegistrationStep7, useSendSellerOTP, useVerifySellerOTP } from '../../hook/useSeller';
import { toast } from "react-toastify";

const steps = [
    { label: "Basic Information", },
    { label: "Business Information", },
    { label: "Address Information", },
    { label: "Bank Details", },
    { label: "Documents Upload", },
    { label: "Verification", },
    { label: "Review & Submit", },
];

const documentList = [
    {
        key: "tradeLicense",
        title: "Trade License",
        description: "Upload your valid trade license.",
        required: true,
    },
    {
        key: "emiratesId",
        title: "Emirates ID / Passport",
        description: "Upload owner's Emirates ID or Passport.",
        required: true,
    },
    {
        key: "bankStatement",
        title: "Bank Statement",
        description: "Upload recent bank statement (within 3 months).",
        required: true,
    },
    {
        key: "vatCertificate",
        title: "VAT Certificate",
        description: "Upload your VAT certificate.",
        required: false,
    },
];

const displayLabel = (value) => {
    if (!value) return "-";

    return value
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

function SellerRegistration() {

    const stepRefs = useRef([]);
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [sellerId, setSellerId] = useState(null);
    const [otpRequested, setOtpRequested] = useState(false);

    const { mutate: submitStep1, isPending: step1Pending } = useSellerRegistrationStep1();
    const { mutate: submitStep2, isPending: step2Pending } = useSellerRegistrationStep2();
    const { mutate: submitStep3, isPending: step3Pending } = useSellerRegistrationStep3();
    const { mutate: submitStep4, isPending: step4Pending } = useSellerRegistrationStep4();
    const { mutate: submitStep5, isPending: step5Pending } = useSellerRegistrationStep5();
    const { mutate: sendOTP, isPending: sendOtpPending } = useSendSellerOTP();
    const { mutate: verifyOTP, isPending: otpPending } = useVerifySellerOTP();
    const { mutate: submitStep7, isPending: step7Pending } = useSellerRegistrationStep7();

    const [otpData, setOtpData] = useState({
        otp: ["", "", "", "", "", ""],
    });

    const [savedDocuments, setSavedDocuments] = useState({
        tradeLicense: "",
        emiratesId: "",
        bankStatement: "",
        vatCertificate: ""
    });

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        countryCode: "+971",
        phone: "",
        password: "",
        confirmPassword: "",
        profileImage: null,
        businessName: "",
        businessType: "",
        licenseNumber: "",
        vatNumber: "",
        website: "",
        businessDescription: "",
        businessYear: "",
        employees: "",
        country: "",
        emirate: "",
        streetAddress: "",
        building: "",
        city: "",
        area: "",
        poBox: "",
        zipCode: "",
        accountHolderName: "",
        bankName: "",
        ibanNumber: "",
        accountNumber: "",
        swiftCode: "",
        currency: "",
        tradeLicense: null,
        emiratesId: null,
        bankStatement: null,
        vatCertificate: null,
        isEmailVerified: false,
        isPhoneVerified: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const verificationList = [
        {
            key: "otp",
            title: "Email Verification",
            description: "Enter the OTP sent to your email address",
            value: formData.email,
            icon: Mail,
        },
    ];

    const alreadyVerified =
        formData.isEmailVerified &&
        formData.isPhoneVerified;

    const handleSendOtp = () => {
        sendOTP({ email: formData.email }, {
            onSuccess: () => {
                setOtpRequested(true);
                toast.success("OTP sent to your email");
            },
            onError: (err) => {
                toast.error(err?.response?.data?.message || "Failed to send OTP");
            }
        });
    };

    // btns control
    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        } else {
            navigate('/');
        }
    };

    const handleNext = () => {
        if (currentStep === 1) {

            if (formData.password !== formData.confirmPassword) {
                return toast.error("Passwords do not match");
            }

            const payload = new FormData();
            payload.append('fullName', formData.fullName);
            payload.append('email', formData.email);
            payload.append('phone', '+971' + formData.phone);
            payload.append('password', formData.password);
            payload.append('confirmPassword', formData.confirmPassword);

            if (formData.profileImage) {
                payload.append('profileImage', formData.profileImage);
            }

            submitStep1(payload, {
                // onSuccess: (data) => {
                //     setSellerId(data.sellerId);
                //     // setCurrentStep((prev) => prev + 1);
                //     setCurrentStep(data.registrationStep + 1);
                // },
                onSuccess: (data) => {
                    setSellerId(data.sellerId);

                    if (data.draft) {
                        const draft = data.draft;

                        setFormData((prev) => ({
                            ...prev,

                            fullName: draft.fullName || "",
                            email: draft.email || "",

                            // Backend mein phone "+971..." format mein saved hai.
                            countryCode: "+971",
                            phone: (draft.phone || "").replace(/^\+971/, ""),

                            businessName: draft.businessName || "",
                            businessType: draft.businessType || "",
                            licenseNumber: draft.licenseNumber || "",
                            vatNumber: draft.vatNumber || "",
                            businessYear: draft.businessYear || "",
                            employees: draft.employees || "",
                            website: draft.website || "",
                            businessDescription: draft.businessDescription || "",

                            country: draft.country || "",
                            emirate: draft.emirate || "",
                            city: draft.city || "",
                            area: draft.area || "",
                            streetAddress: draft.streetAddress || "",
                            building: draft.building || "",
                            poBox: draft.poBox || "",
                            zipCode: draft.zipCode || "",

                            accountHolderName: draft.accountHolderName || "",
                            bankName: draft.bankName || "",
                            ibanNumber: draft.ibanNumber || "",
                            accountNumber: draft.accountNumber || "",
                            swiftCode: draft.swiftCode || "",
                            currency: draft.currency || "",
                        }));

                        setSavedDocuments(draft.documents);
                    }

                    setCurrentStep(data.registrationStep + 1);
                },
                onError: (err) => {
                    console.error(err);
                    toast.error(err?.response?.data?.message || "Step 1 failed");
                }
            });
            return;
        }

        if (currentStep === 2) {
            if (!formData.businessName || !formData.businessType || !formData.licenseNumber || !formData.businessYear || !formData.employees) {
                return toast.error("Please fill all required fields");
            }

            submitStep2({
                sellerId,
                sellerData: {
                    businessName: formData.businessName,
                    businessType: formData.businessType,
                    licenseNumber: formData.licenseNumber,
                    vatNumber: formData.vatNumber,
                    businessYear: formData.businessYear,
                    employees: formData.employees,
                    website: formData.website,
                    businessDescription: formData.businessDescription,
                }
            }, {
                onSuccess: (data) => {
                    setCurrentStep(data.registrationStep + 1);
                },
                onError: (err) => {
                    console.error(err);
                    toast.error(err?.response?.data?.message || "Step 2 failed");
                }
            });
            return;
        }

        if (currentStep === 3) {
            if (!formData.country || !formData.emirate || !formData.city || !formData.area || !formData.streetAddress) {
                return toast.error("Please fill all required fields");
            }

            submitStep3({
                sellerId,
                sellerData: {
                    country: formData.country,
                    emirate: formData.emirate,
                    city: formData.city,
                    area: formData.area,
                    streetAddress: formData.streetAddress,
                    building: formData.building,
                    poBox: formData.poBox,
                    zipCode: formData.zipCode,
                }
            }, {
                onSuccess: (data) => {
                    setCurrentStep(data.registrationStep + 1);
                },
                onError: (err) => {
                    console.error(err);
                    toast.error(err?.response?.data?.message || "Step 3 failed");
                }
            });
            return;
        }

        if (currentStep === 4) {
            if (!formData.accountHolderName || !formData.bankName || !formData.ibanNumber || !formData.accountNumber || !formData.swiftCode || !formData.currency) {
                return toast.error("Please fill all required fields");
            }

            submitStep4({
                sellerId,
                sellerData: {
                    accountHolderName: formData.accountHolderName,
                    bankName: formData.bankName,
                    ibanNumber: formData.ibanNumber,
                    accountNumber: formData.accountNumber,
                    swiftCode: formData.swiftCode,
                    currency: formData.currency,
                }
            }, {
                onSuccess: (data) => {
                    setCurrentStep(data.registrationStep + 1);
                },
                onError: (err) => {
                    console.error(err);
                    toast.error(err?.response?.data?.message || "Step 4 failed");
                }
            });
            return;
        }

        if (currentStep === 5) {
            const hasTradeLicense =
                formData.tradeLicense || savedDocuments.tradeLicense;

            const hasEmiratesId =
                formData.emiratesId || savedDocuments.emiratesId;

            const hasBankStatement =
                formData.bankStatement || savedDocuments.bankStatement;

            if (!hasTradeLicense || !hasEmiratesId || !hasBankStatement) {
                return toast.error("Please upload all required documents");
            }

            const payload = new FormData();

            if (formData.tradeLicense) {
                payload.append('tradeLicense', formData.tradeLicense);
            }

            if (formData.emiratesId) {
                payload.append('emiratesId', formData.emiratesId);
            }

            if (formData.bankStatement) {
                payload.append('bankStatement', formData.bankStatement);
            }

            if (formData.vatCertificate) {
                payload.append('vatCertificate', formData.vatCertificate);
            }

            submitStep5({
                sellerId,
                sellerData: payload
            }, {
                onSuccess: (data) => {
                    setSavedDocuments(data.documents);
                    setCurrentStep(data.registrationStep + 1);
                },
                onError: (err) => {
                    console.error(err);
                    toast.error(err?.response?.data?.message || "Step 5 failed");
                }
            });
            return;
        }

        if (currentStep === 6) {
            if (alreadyVerified) {
                setCurrentStep(7);
                return;
            }

            const enteredOtp = otpData.otp.join('');

            if (enteredOtp.length !== 6) {
                return toast.error("Please enter the complete OTP");
            }

            verifyOTP({ sellerId, otp: enteredOtp }, {
                onSuccess: (data) => {
                    setFormData((prev) => ({
                        ...prev,
                        isEmailVerified: true,
                        isPhoneVerified: true,
                    }));

                    setCurrentStep(data.registrationStep + 1);
                },
                onError: (err) => {
                    console.error(err);
                    toast.error(err?.response?.data?.message || "Invalid OTP");
                }
            });

            return;
        }

        if (currentStep < steps.length) {
            setCurrentStep((prev) => prev + 1);
        }
    };

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

    // profile image
    const handleProfileImage = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please upload a valid image.");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("Maximum image size is 2MB.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            profileImage: file,
        }));
    };

    // i/p handler
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // file upload handler
    const handleFileUpload = (field, file) => {
        if (!file) return;

        setFormData((prev) => ({
            ...prev,
            [field]: file,
        }));
    };

    // otp handler
    const handleOtpChange = (type, index, value) => {
        if (!/^\d?$/.test(value)) return;

        const updatedOtp = [...otpData[type]];
        updatedOtp[index] = value;

        setOtpData((prev) => ({
            ...prev,
            [type]: updatedOtp,
        }));

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`${type}-${index + 1}`);
            nextInput?.focus();
        }
    };

    // review step
    const SummaryCard = ({ title, icon, iconBg, children, step, }) => (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${iconBg} flex items-center justify-center`}>
                        {icon}
                    </div>

                    <h3 className="text-[15px] font-semibold text-[#0B1E3D]">{title}</h3>
                </div>

                <button
                    type="button"
                    onClick={() => setCurrentStep(step)}
                    className="text-sm font-medium text-[#D97706] hover:underline">
                    Edit
                </button>
            </div>
            <div className="space-y-3">{children}</div>
        </div>
    );

    const SummaryRow = ({ label, value, success = false, }) => (
        <div className="flex justify-between gap-3 text-sm">
            <p className="text-slate-500">{label}</p>
            <p className={`font-medium wrap-break-word ${success ? "text-green-600" : "text-[#0B1E3D]"}`}>
                {value || "-"}
            </p>
        </div>
    );

    // confetti
    useEffect(() => {
        if (!showSuccessModal) return;

        confetti({
            particleCount: 140,
            spread: 80,
            origin: {
                x: 0.5,
                y: 0.3,
            },
        });
    }, [showSuccessModal]);

    // empty state
    const resetRegistrationForm = () => {
        setCurrentStep(1);
        setSellerId(null);
        setOtpRequested(false);

        setOtpData({
            otp: ["", "", "", "", "", ""],
        });

        setSavedDocuments({
            tradeLicense: "",
            emiratesId: "",
            bankStatement: "",
            vatCertificate: ""
        });

        setFormData({
            fullName: "",
            email: "",
            countryCode: "+971",
            phone: "",
            password: "",
            confirmPassword: "",
            profileImage: null,

            businessName: "",
            businessType: "",
            licenseNumber: "",
            vatNumber: "",
            website: "",
            businessDescription: "",
            businessYear: "",
            employees: "",

            country: "",
            emirate: "",
            streetAddress: "",
            building: "",
            city: "",
            area: "",
            poBox: "",
            zipCode: "",

            accountHolderName: "",
            bankName: "",
            ibanNumber: "",
            accountNumber: "",
            swiftCode: "",
            currency: "",

            tradeLicense: null,
            emiratesId: null,
            bankStatement: null,
            vatCertificate: null,

            isEmailVerified: false,
            isPhoneVerified: false,
        });
    };

    // submit
    const handleSubmit = () => {

        submitStep7({ sellerId }, {
            onSuccess: () => {
                resetRegistrationForm();
                setShowSuccessModal(true);
            },
            onError: (err) => {
                console.log(err);
                toast.error(err?.response?.data?.message || "Failed to submit");
            }
        });
    };

    const isContinuePending =
        (currentStep === 1 && step1Pending) ||
        (currentStep === 2 && step2Pending) ||
        (currentStep === 3 && step3Pending) ||
        (currentStep === 4 && step4Pending) ||
        (currentStep === 5 && step5Pending) ||
        (currentStep === 6 && otpPending);

    return (
        <div className='max-w-6xl mx-auto px-4 sm:px-5 lg:px-6'>

            {/* main container */}
            <div className='flex justify-between gap-6'>

                {/* ================== left section ============== */}
                <div className="hidden lg:flex w-[35%] flex-col justify-between shadow-lg bg-linear-to-b from-white via-[#FCFCFD] to-[#F8FAFC]">
                    <div>
                        <div className="px-12 pt-10 pb-8">
                            <Link to="/" className="flex items-start gap-3 cursor-pointer">
                                <div className="bg-[#D97706] p-1 rounded-lg mt-1">
                                    🚗
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-[#0B1E3D] leading-none">
                                        Bid<span className="text-[#D97706]">Drive</span>
                                    </h1>
                                    <p className="mt-1.5 text-[13px] font-medium uppercase tracking-[0.18em] text-slate-500">
                                        Seller Registration
                                    </p>
                                </div>
                            </Link>
                            <div className="mt-8 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="px-12">
                            <h2 className="text-[35px] font-bold leading-11.5 tracking-[-1px] text-[#0B1E3D]">
                                Welcome to <br />
                                <span>Bid<span className="text-[#D97706]">Drive!</span></span>
                            </h2>
                            <p className="mt-5 max-w-85 text-[13px] leading-7 text-slate-500">
                                Create your seller account and start listing vehicles in our premium auction platform.
                            </p>

                            {/* Features */}
                            <div className="mt-10 space-y-5">
                                <div className="group flex items-center gap-4 rounded-2xl py-1.5 transition-all duration-300 hover:bg-white hover:shadow-md">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:border-[#D97706]/30 group-hover:shadow-lg">
                                        <CarFront
                                            size={18}
                                            className="text-[#0B1E3D] group-hover:text-[#D97706]" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#0B1E3D]"> Unlimited Listings </p>
                                        <p className="text-sm text-slate-500">Add and manage vehicles without limits.</p>
                                    </div>
                                </div>

                                <div className="group flex items-center gap-4 rounded-2xl py-1.5 transition-all duration-300 hover:bg-white hover:shadow-md">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:border-[#D97706]/30 group-hover:shadow-lg">
                                        <ShieldCheck
                                            size={18}
                                            className="text-[#0B1E3D] group-hover:text-[#D97706]" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#0B1E3D]">Verified Buyers</p>
                                        <p className="text-sm text-slate-500">Reach genuine buyers across the marketplace.</p>
                                    </div>
                                </div>

                                <div className="group flex items-center gap-4 rounded-2xl py-1.5 transition-all duration-300 hover:bg-white hover:shadow-md">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:border-[#D97706]/30 group-hover:shadow-lg">
                                        <LockKeyhole
                                            size={18}
                                            className="text-[#0B1E3D] group-hover:text-[#D97706]" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#0B1E3D]">Secure Transactions</p>
                                        <p className="text-sm text-slate-500">Protected payments with complete transparency.</p>
                                    </div>
                                </div>

                                <div className="group flex items-center gap-4 rounded-2xl py-1.5 transition-all duration-300 hover:bg-white hover:shadow-md">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:border-[#D97706]/30 group-hover:shadow-lg">
                                        <ChartNoAxesColumnIncreasing
                                            size={18}
                                            className="text-[#0B1E3D] group-hover:text-[#D97706]" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#0B1E3D]">Better Returns</p>
                                        <p className="text-sm text-slate-500">Maximize your vehicle's selling value.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="px-10 pb-8">
                        <div className="relative mt-10 flex justify-center overflow-hidden">

                            {/* Background Circle */}
                            <div className="absolute bottom-0 h-70 w-65 rounded-full bg-linear-to-b from-[#EEF2F8] to-[#F8FAFC]" />
                            <img
                                src={SellerRegCarImg}
                                alt="Car"
                                className="relative z-10 w-90 object-contain"
                            />
                        </div>

                        <p className="mt-8 text-center text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-[#D97706] transition-colors duration-300 hover:text-[#B45309]"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* ================== right section ============== */}
                <div className='w-[65%]'>

                    <div className="py-8 flex items-center justify-end gap-6 md:gap-8">
                        <div className="flex items-center gap-2 text-[#D97706] cursor-pointer">
                            <Headset size={20} />
                            <div className="hidden md:block">
                                <p className="text-[10px] text-gray-400 font-medium uppercase">Need Help?</p>
                                <p className="text-xs font-bold">Contact Support</p>
                            </div>
                        </div>

                        <div className="h-8 w-px bg-gray-200" />

                        <div className="flex items-center gap-2 text-emerald-600">
                            <ShieldCheck size={20} />
                            <div className="hidden md:block">
                                <p className="text-xs font-bold text-gray-900">Secure & Safe</p>
                                <p className="text-[10px] text-gray-400">Your data is encrypted</p>
                            </div>
                        </div>
                    </div>

                    {/* stepper / form */}
                    <div className='bg-white border border-slate-200 rounded-2xl px-4 py-4 shadow-sm'>
                        <div className='py-4'>
                            <h1 className='text-xl font-medium'>Seller Registraion</h1>
                        </div>

                        {/* stepper */}
                        <div className="w-full overflow-x-auto no-scrollbar">
                            <div className="min-w-248 px-2 py-4">
                                <div className="flex items-start">

                                    {steps.map((step, index) => {
                                        const stepNumber = index + 1;
                                        const isActive = stepNumber === currentStep;
                                        const isCompleted = stepNumber < currentStep;

                                        return (
                                            <div
                                                key={stepNumber}
                                                ref={(el) => (stepRefs.current[index] = el)}
                                                onClick={() => isCompleted && onStepChange(stepNumber)}
                                                className={`flex flex-1 items-start ${isCompleted ? "cursor-pointer" : "cursor-default"
                                                    }`}>

                                                {/* Step */}
                                                <div className="flex flex-col items-center min-w-27.5">

                                                    {/* Circle */}
                                                    <div
                                                        className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-sm
                                                            ${isCompleted
                                                                ? "bg-green-600 text-white"
                                                                : isActive
                                                                    ? "bg-[#D97706] text-white shadow-md shadow-orange-200"
                                                                    : "bg-slate-100 text-slate-600 border border-slate-200"
                                                            } `}>
                                                        {isCompleted ? (
                                                            <Check size={16} strokeWidth={3} />
                                                        ) : (
                                                            stepNumber
                                                        )}
                                                    </div>

                                                    {/* Label */}
                                                    <p className={`mt-3 text-center text-xs font-medium leading-5 
                                                            ${isActive
                                                            ? "text-[#F97316]"
                                                            : "text-slate-600"
                                                        }`}>
                                                        {step.label}
                                                    </p>
                                                </div>

                                                {/* Line */}
                                                {index !== steps.length - 1 && (
                                                    <div className="flex-1 pt-4 px-2">
                                                        <div className={`h-0.5 w-full 
                                                        ${isCompleted
                                                                ? "bg-[#F97316]"
                                                                : "bg-slate-300"
                                                            }`}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* form */}
                        {currentStep === 1 && (
                            <div className=''>
                                <div className="my-8 ">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
                                            <UserRound className="h-5 w-5 text-violet-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-[#0B1E3D]">Basic Information</h2>
                                            <p className="text-sm leading-6 text-slate-500"> Provide your personal details to create your seller account.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 px-4">

                                    {/* Profile Photo */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-[#0B1E3D]">
                                            Profile Photo
                                            <span className="ml-1 text-slate-400 font-normal">(Optional)</span>
                                        </label>

                                        <div className="mt-2 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5 gap-4">

                                            {/* Left: Image & Info */}
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                                    {formData.profileImage ? (
                                                        <img
                                                            src={URL.createObjectURL(formData.profileImage)}
                                                            alt="Profile"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center">
                                                            <UserRound
                                                                size={30}
                                                                className="text-slate-400"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-semibold text-[#0B1E3D]">
                                                        Seller Profile Photo
                                                    </h4>
                                                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                                                        Upload a clear profile picture.
                                                        <br />
                                                        JPG, PNG • Max 2 MB
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right: Actions */}
                                            <div className="flex items-center gap-3 shrink-0">
                                                <label className="cursor-pointer text-xs font-semibold text-[#D97706] transition hover:text-[#B45309] hover:underline">
                                                    Upload Photo
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        hidden
                                                        onChange={handleProfileImage}
                                                    />
                                                </label>

                                                {formData.profileImage && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                profileImage: null,
                                                            }))
                                                        }
                                                        className="text-xs font-medium text-red-500 transition hover:text-red-700 hover:underline"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>

                                        </div>
                                    </div>

                                    {/* Full Name */}
                                    <FormInputFields
                                        label="Full Name"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />

                                    {/* Email */}
                                    <FormInputFields
                                        label="Email Address"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className="block text-[13px] font-medium text-[#0B1E3D]">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>

                                        <div className="flex">
                                            <div className="flex py-2.5 w-20 items-center justify-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-sm font-medium text-[#0B1E3D]">
                                                +971
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="50 123 4567"
                                                maxLength={9}
                                                className="py-2.5 flex-1 rounded-r-lg border border-slate-300 px-4 text-sm text-[#0B1E3D] outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/15"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <FormInputFields
                                        label="Password"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />

                                    {/* Confirm Password */}
                                    <FormInputFields
                                        label="Confirm Password"
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className=''>
                                <div className="my-8 ">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                                            <Building2 className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-[#0B1E3D]">Business Information</h2>
                                            <p className="text-sm leading-6 text-slate-500">Tell us about your business.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 px-4">

                                    {/* business Name */}
                                    <FormInputFields
                                        label="Business Name"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        required
                                    />

                                    {/* business type */}
                                    <FormInputFields
                                        label="Business Type"
                                        type="select"
                                        name="businessType"
                                        value={formData.businessType}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "Select Business Type", value: "" },
                                            { label: "Car Dealership", value: "car_dealership" },
                                            { label: "Individual Seller", value: "individual_seller" },
                                            { label: "Vehicle Importer", value: "vehicle_importer" },
                                            { label: "Fleet Company", value: "fleet_company" },
                                            { label: "Rental Company", value: "rental_company" },
                                            { label: "Auction House", value: "auction_house" },
                                            { label: "Other", value: "other" },
                                        ]}
                                    />

                                    {/* trade licence num */}
                                    <FormInputFields
                                        label="Trade License Number"
                                        name="licenseNumber"
                                        value={formData.licenseNumber}
                                        onChange={handleChange}
                                        required
                                    />

                                    {/* vat */}
                                    <FormInputFields
                                        label="VAT Number (Optional))"
                                        name="vatNumber"
                                        value={formData.vatNumber}
                                        onChange={handleChange}
                                    />

                                    {/* yr of business */}
                                    <FormInputFields
                                        label="Years in Business"
                                        type="select"
                                        name="businessYear"
                                        value={formData.businessYear}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "Select Business Experience", value: "" },
                                            { label: "Less than 1 Year", value: "less_than_1" },
                                            { label: "1+ Year", value: "1_plus" },
                                            { label: "2+ Years", value: "2_plus" },
                                            { label: "3+ Years", value: "3_plus" },
                                            { label: "5+ Years", value: "5_plus" },
                                            { label: "10+ Years", value: "10_plus" },
                                            { label: "15+ Years", value: "15_plus" },
                                            { label: "20+ Years", value: "20_plus" },
                                        ]}
                                    />

                                    {/* num of employes */}
                                    <FormInputFields
                                        label="Number of Employees"
                                        type="select"
                                        name="employees"
                                        value={formData.employees}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "Select Number of Employees", value: "" },
                                            { label: "1 - 10", value: "1-10" },
                                            { label: "11 - 20", value: "11-20" },
                                            { label: "21 - 50", value: "21-50" },
                                            { label: "51 - 100", value: "51-100" },
                                            { label: "101 - 250", value: "101-250" },
                                            { label: "250+", value: "250_plus" },
                                        ]}
                                    />

                                    {/* website */}
                                    <FormInputFields
                                        label="Website (Optional)"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                    />

                                    {/* business des */}
                                    <FormInputFields
                                        label="Short Business Description (Optional)"
                                        type='textarea'
                                        name="businessDescription"
                                        rows={3}
                                        value={formData.businessDescription}
                                        onChange={handleChange}
                                    />

                                </div>

                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className=''>
                                <div className="my-8 ">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                                            <MapPinned className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-[#0B1E3D]">Address Information</h2>
                                            <p className="text-sm leading-6 text-slate-500">Provide your business address details.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 px-4">

                                    {/* country */}
                                    <FormInputFields
                                        label="Country"
                                        type="select"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "Select Country", value: "" },
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
                                            { label: "Select Emirate", value: "" },
                                            { label: "Abu Dhabi", value: "abu_dhabi" },
                                            { label: "Dubai", value: "dubai" },
                                            { label: "Sharjah", value: "sharjah" },
                                            { label: "Ajman", value: "ajman" },
                                            { label: "Umm Al Quwain", value: "umm_al_quwain" },
                                            { label: "Ras Al Khaimah", value: "ras_al_khaimah" },
                                            { label: "Fujairah", value: "fujairah" },
                                        ]}
                                    />

                                    {/* city */}
                                    <FormInputFields
                                        label="City"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />

                                    {/* area */}
                                    <FormInputFields
                                        label="Area / District"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleChange}
                                        required
                                    />

                                    {/* street add */}
                                    <FormInputFields
                                        label="Street Address"
                                        name="streetAddress"
                                        value={formData.streetAddress}
                                        onChange={handleChange}
                                        required
                                    />

                                    {/* building */}
                                    <FormInputFields
                                        label="Building / Office (Optional)"
                                        name="building"
                                        value={formData.building}
                                        onChange={handleChange}
                                    />

                                    {/* p.o box */}
                                    <FormInputFields
                                        label="P.O. Box (Optional)"
                                        name="poBox"
                                        value={formData.poBox}
                                        onChange={handleChange}
                                    />

                                    {/* zip */}
                                    <FormInputFields
                                        label="Zip / Postal Code"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className=''>
                                <div className="my-8 ">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100">
                                            <Landmark className="h-5 w-5 text-sky-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-[#0B1E3D]">Bank Details</h2>
                                            <p className="text-sm leading-6 text-slate-500">Provide your bank account details for payouts.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 px-4">

                                    {/* acc holder name */}
                                    <FormInputFields
                                        label="Account Holder Name"
                                        name="accountHolderName"
                                        value={formData.accountHolderName}
                                        onChange={handleChange}
                                        required
                                    />

                                    {/* bank name */}
                                    <FormInputFields
                                        label="Bank Name"
                                        name="bankName"
                                        value={formData.bankName}
                                        onChange={handleChange}
                                        required
                                    />

                                    {/* Iban num */}
                                    <FormInputFields
                                        label="IBAN Number"
                                        name="ibanNumber"
                                        value={formData.ibanNumber}
                                        onChange={handleChange}
                                        required
                                    />

                                    {/* acc num */}
                                    <FormInputFields
                                        label="Account Number"
                                        name="accountNumber"
                                        value={formData.accountNumber}
                                        onChange={handleChange}
                                        required
                                    />

                                    {/* swift code */}
                                    <FormInputFields
                                        label="Swift Code"
                                        name="swiftCode"
                                        value={formData.swiftCode}
                                        onChange={handleChange}
                                        required
                                    />

                                    {/* currency */}
                                    <FormInputFields
                                        label="Currency"
                                        type="select"
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        required
                                        options={[
                                            { label: "Select Currency", value: "" },
                                            { label: "AED - UAE Dirham", value: "aed_uae_dirham" },
                                        ]}
                                    />
                                </div>
                            </div>
                        )}

                        {currentStep === 5 && (
                            <div className=''>
                                <div className="my-8 ">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                                            <FileCheck2 className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-[#0B1E3D]">Documents Upload</h2>
                                            <p className="text-sm leading-6 text-slate-500">Upload required documents to verify your business.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    {documentList.map((doc) => {

                                        const selectedFile = formData[doc.key];
                                        const savedFileUrl = savedDocuments?.[doc.key];
                                        const isUploaded = Boolean(selectedFile || savedFileUrl);

                                        return (
                                            <div
                                                key={doc.key}
                                                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white py-2.5 px-5">

                                                <div className="flex items-start gap-4">
                                                    <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-slate-100">
                                                        <FileImage className="h-4.5 w-4.5 text-[#0B1E3D]" />
                                                    </div>
                                                    <div>

                                                        <h4 className="text-sm font-semibold text-[#0B1E3D]">
                                                            {doc.title}
                                                            {doc.required && (
                                                                <span className="ml-1 text-red-500">*</span>
                                                            )}
                                                        </h4>

                                                        <p className="mt-1 text-[13px] text-slate-500">
                                                            {doc.description}
                                                        </p>

                                                        {isUploaded && (
                                                            <p className="mt-2 text-[13px] font-medium text-green-600">
                                                                ✓ {selectedFile?.name || "Already uploaded"}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <label className="cursor-pointer">
                                                        <input
                                                            type="file"
                                                            accept=".jpg,.jpeg,.png,.pdf"
                                                            hidden
                                                            onChange={(e) => handleFileUpload(doc.key, e.target.files[0])}
                                                        />

                                                        <div className="flex py-2 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 text-[13px] font-medium text-gray-600 transition hover:border-[#D97706] hover:text-[#D97706]">

                                                            <Upload size={15} />

                                                            {isUploaded ? "Replace File" : "Upload File"}
                                                        </div>
                                                    </label>

                                                    <span className="text-xs text-slate-400 whitespace-nowrap">JPG, PNG, PDF (Max 5MB)</span>

                                                </div>

                                            </div>
                                        )

                                    })}

                                </div>
                            </div>
                        )}

                        {currentStep === 6 && (
                            <div className=''>
                                <div className="my-8 ">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                                            <ShieldCheck className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-[#0B1E3D]">Verification</h2>
                                            <p className="text-sm leading-6 text-slate-500">Verification your phone number and email address to continue.</p>
                                        </div>
                                    </div>
                                </div>

                                {alreadyVerified ? (
                                    <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
                                        <p className="text-sm font-semibold text-green-700">
                                            ✓ Email and phone already verified
                                        </p>

                                        <p className="mt-1 text-sm text-green-600">
                                            You can continue to review and submit your registration.
                                        </p>
                                    </div>
                                ) : !otpRequested ? (
                                    <div className="text-center py-10">
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={sendOtpPending}
                                            className="rounded-lg bg-[#D97706] px-6 py-2.5 text-sm font-semibold text-white"
                                        >
                                            {sendOtpPending ? "Sending..." : "Send OTP"}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {verificationList.map((item) => {
                                            const Icon = item.icon;

                                            return (
                                                <div
                                                    key={item.key}
                                                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D97706]/10">
                                                            <Icon size={18} className="text-[#D97706]" />
                                                        </div>

                                                        <div>
                                                            <h4 className="text-[15px] font-semibold text-[#0B1E3D]">
                                                                {item.title}
                                                            </h4>

                                                            <p className="mt-1 text-sm text-slate-500">
                                                                {item.description}
                                                            </p>

                                                            <div className="mt-2 flex items-center gap-3">
                                                                <span className="text-sm font-medium text-[#0B1E3D]">
                                                                    {item.value}
                                                                </span>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => setCurrentStep(1)}
                                                                    className="text-sm font-medium text-[#D97706] hover:underline"
                                                                >
                                                                    Edit
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-end">
                                                        <span className="mb-2 text-sm font-medium text-[#0B1E3D]">
                                                            Enter OTP <span className="text-red-500">*</span>
                                                        </span>

                                                        <div className="flex gap-2">
                                                            {otpData[item.key].map((digit, index) => (
                                                                <input
                                                                    key={index}
                                                                    id={`${item.key}-${index}`}
                                                                    type="text"
                                                                    inputMode="numeric"
                                                                    maxLength={1}
                                                                    value={digit}
                                                                    onChange={(e) =>
                                                                        handleOtpChange(
                                                                            item.key,
                                                                            index,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    className="h-11 w-11 rounded-lg border border-slate-300 text-center text-base font-semibold outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/15"
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {currentStep === 7 && (
                            <div className=''>
                                <div className="my-8 ">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D97706]/10">
                                            <ClipboardCheck className="h-5 w-5 text-[#D97706]" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-[#0B1E3D]">Review & Submit</h2>
                                            <p className="text-sm leading-6 text-slate-500">Please review your details before submitting your registration</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary Cards */}
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                                    {/* Basic Information */}
                                    <SummaryCard
                                        step={1}
                                        icon={<UserRound size={18} className="text-[#8B5CF6]" />}
                                        iconBg="bg-violet-50"
                                        title="Basic Information"
                                    >
                                        <SummaryRow label="Full Name" value={formData.fullName} />
                                        <SummaryRow label="Email" value={formData.email} />
                                        <SummaryRow
                                            label="Phone"
                                            value={`${formData.countryCode} ${formData.phone}`}
                                        />
                                    </SummaryCard>

                                    {/* Business */}
                                    <SummaryCard
                                        step={2}
                                        icon={<Building2 size={18} className="text-[#F97316]" />}
                                        iconBg="bg-orange-50"
                                        title="Business Information"
                                    >
                                        <SummaryRow label="Business Name" value={formData.businessName} />
                                        <SummaryRow label="Business Type" value={displayLabel(formData.businessType)} />
                                        <SummaryRow label="Trade License No." value={formData.licenseNumber} />
                                        <SummaryRow label="Years in Business" value={displayLabel(formData.businessYear)} />

                                    </SummaryCard>

                                    {/* Address */}
                                    <SummaryCard
                                        step={3}
                                        icon={<MapPinned size={18} className="text-green-600" />}
                                        iconBg="bg-green-50"
                                        title="Address Information"
                                    >
                                        <SummaryRow label="Country" value={displayLabel(formData.country)} />
                                        <SummaryRow label="Emirate" value={displayLabel(formData.emirate)} />
                                        <SummaryRow label="City" value={formData.city} />
                                        <SummaryRow label="Address" value={formData.streetAddress} />

                                    </SummaryCard>

                                    {/* Bank */}
                                    <SummaryCard
                                        step={4}
                                        icon={<Landmark size={18} className="text-sky-600" />}
                                        iconBg="bg-sky-50"
                                        title="Bank Details"
                                    >
                                        <SummaryRow label="Bank Name" value={formData.bankName} />
                                        <SummaryRow label="Account Number" value={formData.accountNumber} />
                                        <SummaryRow label="IBAN" value={formData.ibanNumber} />
                                        <SummaryRow label="Currency" value={displayLabel(formData.currency)} />
                                    </SummaryCard>

                                    {/* Documents */}
                                    <SummaryCard
                                        step={5}
                                        icon={<FileCheck2 size={18} className="text-amber-600" />}
                                        iconBg="bg-amber-50"
                                        title="Documents Upload"
                                    >
                                        <SummaryRow
                                            label="Trade License"
                                            value={
                                                formData.tradeLicense || savedDocuments.tradeLicense
                                                    ? "Uploaded"
                                                    : "Pending"
                                            }
                                            success={!!formData.tradeLicense}
                                        />

                                        <SummaryRow
                                            label="Emirates ID / Passport"
                                            value={
                                                formData.emiratesId || savedDocuments.emiratesId
                                                    ? "Uploaded"
                                                    : "Pending"
                                            }
                                            success={!!formData.emiratesId}
                                        />

                                        <SummaryRow
                                            label="Bank Statement"
                                            value={
                                                formData.bankStatement || savedDocuments.bankStatement
                                                    ? "Uploaded"
                                                    : "Pending"
                                            }
                                            success={!!formData.bankStatement}
                                        />

                                        <SummaryRow
                                            label="VAT Certificate"
                                            value={
                                                formData.vatCertificate || savedDocuments.vatCertificate
                                                    ? "Uploaded"
                                                    : "Pending"
                                            }
                                            success={!!formData.vatCertificate}
                                        />
                                    </SummaryCard>

                                    {/* Verification */}
                                    <SummaryCard
                                        step={6}
                                        icon={<ShieldCheck size={18} className="text-indigo-600" />}
                                        iconBg="bg-indigo-50"
                                        title="Verification"
                                    >
                                        <SummaryRow
                                            label="Phone"
                                            value={`Verified (${formData.countryCode} ${formData.phone})`}
                                            success
                                        />

                                        <SummaryRow
                                            label="Email"
                                            value={`Verified (${formData.email})`}
                                            success
                                        />
                                    </SummaryCard>
                                </div>
                            </div>
                        )}

                        {/* extra alerts */}
                        <div className='px-4 mt-8'>
                            {currentStep === 4 && (
                                <div className="flex items-center gap-3 px-4 py-2 bg-[#F4F4FD] border border-[#E2E2F5] rounded-xl text-[#3B3A60] text-[12px]">
                                    <Info className="w-4 h-4 text-[#5C59D6] shrink-0" />
                                    <p>Ensure your bank details are correct. Incorrect details may cause delays in payouts.</p>
                                </div>
                            )}

                            {currentStep === 5 && (
                                <div className="flex items-center gap-3 px-4 py-2 bg-[#F4F4FD] border border-[#E2E2F5] rounded-xl text-[#3B3A60] text-[12px]">
                                    <Info className="w-4 h-4 text-[#5C59D6] shrink-0" />
                                    <p>Accepted formats: JPG, PNG, PDF (Max file size: 5MB per document), Ensure all documents are clear and valid.</p>
                                </div>
                            )}

                            {currentStep === 6 && (
                                <div className="flex items-center gap-3 px-4 py-2 bg-[#F4F4FD] border border-[#E2E2F5] rounded-xl text-[#3B3A60] text-[12px]">
                                    <Info className="w-4 h-4 text-[#5C59D6] shrink-0" />
                                    <p>Once verified, you can review your details and submit your registration.</p>
                                </div>
                            )}

                            {currentStep === 7 && (
                                <div className="flex items-center gap-3 px-4 py-2 bg-[#F4F4FD] border border-[#E2E2F5] rounded-xl text-[#3B3A60] text-[12px]">
                                    <Info className="w-4 h-4 text-[#5C59D6] shrink-0" />
                                    <p>By submitting, you agree to our
                                        <span className='text-[#D97706]'> Terms & Conditions</span> and
                                        <span className='text-[#D97706]'> Privacy Policy</span>.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* footer btns */}
                        <div className="mt-10 flex items-center justify-between pt-6">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 text-sm font-medium text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50">
                                <ArrowLeft size={16} />Back
                            </button>

                            {(currentStep === 1 || currentStep === 2 || currentStep === 3 || currentStep === 4 || currentStep === 5 || currentStep === 6) && (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={isContinuePending}
                                    className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#D97706] px-8 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#B45309] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isContinuePending ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Continue <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            )}

                            {currentStep === 7 && (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={step7Pending}
                                    className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#D97706] px-8 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#B45309] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {step7Pending ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Registration <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            )}

                        </div>
                    </div>

                </div>
            </div>

            {/* success modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4">

                    <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">

                        {/* Close */}
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="absolute right-4 top-4 text-slate-400 transition hover:text-slate-700 z-10"
                        >
                            <X size={18} />
                        </button>

                        <div className="px-6 py-5 text-center">

                            {/* Success Icon */}
                            <div className="relative mx-auto mb-3 flex h-16 w-16 items-center justify-center">

                                <div className="absolute inset-0 rounded-full bg-green-100" />

                                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-green-600 shadow-md">
                                    <Check
                                        size={24}
                                        strokeWidth={3}
                                        className="text-white"
                                    />
                                </div>

                            </div>

                            {/* Heading */}
                            <h2 className="text-lg font-bold text-[#0B1E3D]">
                                Application Submitted Successfully
                            </h2>

                            <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500">
                                Thank you for registering with{" "}
                                <span className="font-semibold text-[#0B1E3D]">
                                    BidDrive
                                </span>.
                                Your seller application has been submitted successfully.
                            </p>

                            {/* Approval Card */}
                            <div className="mt-3.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-left">

                                <div className="flex items-start gap-3">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                                        <Clock3
                                            size={16}
                                            className="text-amber-600"
                                        />
                                    </div>

                                    <div className="flex-1">

                                        <div className="flex items-center gap-2">

                                            <h4 className="text-xs font-semibold text-[#0B1E3D]">
                                                Pending Admin Approval
                                            </h4>

                                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-semibold text-amber-700">
                                                Pending
                                            </span>

                                        </div>

                                        <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                                            Our team will review your business information, uploaded documents and bank details.
                                        </p>

                                        <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                                            Once approved, you'll receive an email notification and can access your Seller Dashboard.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* Timeline */}
                            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5">

                                <div className="flex items-center justify-center gap-2">

                                    <Clock3
                                        size={14}
                                        className="text-[#D97706]" />

                                    <p className="text-[12px] text-slate-600">
                                        Estimated review time:
                                        <span className="ml-1 font-semibold text-[#0B1E3D]">
                                            1–2 Business Days
                                        </span>
                                    </p>

                                </div>

                            </div>

                            {/* Buttons */}
                            <div className="mt-4 space-y-2">
                                <button
                                    onClick={() => navigate("/")}
                                    className="w-full rounded-xl bg-[#D97706] py-2 text-xs font-semibold text-white transition hover:bg-[#B45309]">
                                    Back to Home
                                </button>

                                <button
                                    onClick={() => { setShowSuccessModal(false), setCurrentStep(1) }}
                                    className="w-full rounded-xl border border-slate-300 bg-white py-2 text-xs font-medium text-[#0B1E3D] transition hover:bg-slate-50">
                                    Close
                                </button>
                            </div>

                            {/* Footer */}
                            <p className="mt-4 text-[11px] text-slate-500">
                                Need assistance?
                                <button className="ml-1 font-semibold text-[#D97706] hover:underline">
                                    Contact Support
                                </button>
                            </p>

                        </div>

                    </div>

                </div>
            )}
        </div>
    )
}

export default SellerRegistration;