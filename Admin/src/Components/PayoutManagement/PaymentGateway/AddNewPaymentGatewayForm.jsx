
import { ArrowLeft, ArrowRight, ChartNoAxesCombinedIcon, ChevronRight, Globe2, Info, Lightbulb, ShieldCheck, Zap, Headphones, ExternalLink, SquareTerminal, KeyRound, LockKeyhole, Webhook, TestTube2, Settings2, CircleDollarSign, Building2, CheckSquare, CheckCircle2, Landmark, Check, } from 'lucide-react';
import React, { useState } from 'react';
import PaymentGatewayFormStep1 from './PaymentGatewayFormStep1';
import PaymentGatewayFormStep2 from './PaymentGatewayFormStep2';
import PaymentGatewayFormStep3 from './PaymentGatewayFormStep3';
import PaymentGatewayFormStep4 from './PaymentGatewayFormStep4';
import PaymentGatewaySuccessModal from './PaymentGatewaySuccessModal';

const stripeConfigItems = [
    {
        title: "Get API Keys",
        description: "Log in to your Stripe account and go to Developers > API keys to get your API credentials.",
        icon: SquareTerminal,
    },
    {
        title: "Publishable Key",
        description: "This key is safe to use in frontend applications.",
        icon: KeyRound,
    },
    {
        title: "Secret Key",
        description: "This key should only be used in your server-side code.",
        icon: LockKeyhole,
    },
    {
        title: "Webhooks",
        description: "Webhooks allow Stripe to send real-time event notifications.",
        icon: Webhook,
    },
    {
        title: "Test Mode",
        description: "Always test your integration in test mode first.",
        icon: TestTube2,
    },
];

const supportedCurrenciesItems = [
    {
        title: "Global Reach",
        description:
            "Support multiple currencies to reach customers worldwide.",
        icon: Globe2,
    },
    {
        title: "Easy Management",
        description:
            "Add or remove currencies anytime from gateway settings.",
        icon: Settings2,
    },
    {
        title: "Better Conversions",
        description:
            "Let customers pay in their preferred currency.",
        icon: CircleDollarSign,
    },
    {
        title: "Regional Compliance",
        description:
            "Ensure compliance with regional regulations.",
        icon: ShieldCheck,
    },
];

const gatewaySummaryItems = [
    {
        label: "Provider",
        value: "Stripe, Inc.",
    },
    {
        label: "Environment",
        value: "Live",
        badge: true,
        badgeClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
        label: "Status",
        value: "Active",
        badge: true,
        badgeClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
        label: "Supported Currencies",
        value: "4",
    },
    {
        label: "Test Mode",
        value: "Disabled",
    },
];

const steps = [
    { icon: 1, label: "Basic Information", sub: "Gateway name and details" },
    { icon: 2, label: "Configuration", sub: "API keys and endpoints" },
    { icon: 3, label: "Supported Currencies", sub: "Select supported currencies" },
    { icon: 4, label: "Review & Confirm", sub: "Review and activate gateway" },
];

const reviewItems = [
    "Please verify all information is correct.",
    "You can edit any section using the edit buttons.",
    "Once activated, you can start processing payments.",
    "You can manage this gateway anytime from the gateway list.",
];

function AddNewPaymentGatewayForm({ setCurrentPage }) {

    const [step, setStep] = useState(1);
    const [isGatewayActivated, setIsGatewayActivated] = useState(false);

    const handleNext = () => setStep(prev => Math.min(prev + 1, 5));
    const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

    const nextLabel =
        step === 1 ? "Next: Configuration" :
            step === 2 ? "Next: Supported Currencies" :
                step === 3 ? "Next: Review & Confirm" : null;

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">

                <div className="min-w-0 w-full">
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                        Add New Payment Gateway
                    </h1>

                    <div className="mt-2 w-full min-w-0 overflow-x-auto no-scrollbar">
                        <div className="flex items-center flex-nowrap whitespace-nowrap w-max text-[11px] md:text-[13px]">

                            <span
                                onClick={() => setCurrentPage("dashboard")}
                                className="shrink-0 cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors"
                            >
                                Dashboard
                            </span>

                            <ChevronRight className="mx-1 w-3 h-3 text-slate-300 shrink-0" />

                            <span className="shrink-0 text-slate-500">
                                Payment Management
                            </span>

                            <ChevronRight className="mx-1 w-3 h-3 text-slate-300 shrink-0" />

                            <span
                                onClick={() => setCurrentPage("payment-gateways")}
                                className="shrink-0 cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors"
                            >
                                Payment Gateway
                            </span>

                            <ChevronRight className="mx-1 w-3 h-3 text-slate-300 shrink-0" />

                            <span className="shrink-0 font-medium text-[#D97706]">
                                Add New Gateway
                            </span>
                        </div>
                    </div>
                </div>

                {/* Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                    <button
                        onClick={() => setCurrentPage("payment-gateways")}
                        className="w-full sm:w-auto h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg border border-[#D97706] bg-white text-xs sm:text-sm font-medium text-[#D97706] transition-colors duration-200 hover:bg-amber-50 active:scale-[0.98]"
                    >
                        <ArrowLeft className="w-4 h-4 shrink-0" />
                        <span>Back to Gateway</span>
                    </button>
                </div>

            </div>

            {isGatewayActivated ? (
                <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6">

                    {/* left side */}
                    <div className="lg:col-span-2 space-y-6">
                        <PaymentGatewaySuccessModal setCurrentPage={setCurrentPage} />
                    </div>

                    {/* right side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">

                        <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3.5 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-amber-100/50 flex items-center justify-center shrink-0">
                                    <Landmark className="w-5 h-5 text-[#D97706]" />
                                </div>
                                <h3 className="text-base font-bold text-[#0B1E3D]">
                                    Gateway Summary
                                </h3>
                            </div>

                            <div className="space-y-3 text-xs sm:text-[13px]">
                                {/* Gateway Name */}
                                <div className="flex items-center justify-between py-1">
                                    <span className="text-slate-500 font-medium">Gateway Name</span>
                                    <span className="font-semibold text-[#0B1E3D]">Stripe</span>
                                </div>

                                {/* Provider */}
                                <div className="flex items-center justify-between py-1">
                                    <span className="text-slate-500 font-medium">Provider</span>
                                    <span className="font-semibold text-[#0B1E3D]">Stripe, Inc.</span>
                                </div>

                                {/* Environment */}
                                <div className="flex items-center justify-between py-1">
                                    <span className="text-slate-500 font-medium">Environment</span>
                                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-200/50">
                                        Live
                                    </span>
                                </div>

                                {/* Status */}
                                <div className="flex items-center justify-between py-1">
                                    <span className="text-slate-500 font-medium">Status</span>
                                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-200/50">
                                        Active
                                    </span>
                                </div>

                                {/* Activated On */}
                                <div className="flex items-center justify-between py-1">
                                    <span className="text-slate-500 font-medium">Activated On</span>
                                    <span className="font-semibold text-[#0B1E3D]">May 20, 2024 11:45 AM</span>
                                </div>

                                {/* Activated By */}
                                <div className="flex items-center justify-between py-1">
                                    <span className="text-slate-500 font-medium">Activated By</span>
                                    <span className="font-semibold text-[#0B1E3D]">Admin User</span>
                                </div>

                                {/* Supported Currencies */}
                                <div className="flex items-center justify-between py-1">
                                    <span className="text-slate-500 font-medium">Supported Currencies</span>
                                    <span className="font-semibold text-[#0B1E3D]">4</span>
                                </div>

                                {/* Test Mode */}
                                <div className="flex items-center justify-between py-1">
                                    <span className="text-slate-500 font-medium">Test Mode</span>
                                    <span className="font-semibold text-[#0B1E3D]">Disabled</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                                    <Headphones className="w-5 h-5 text-[#0B1E3D]" />
                                </div>

                                <h3 className="text-sm font-bold text-[#0B1E3D]">
                                    Need Help?
                                </h3>
                            </div>

                            <p className="text-[10px] sm:text-[11px] leading-5 text-slate-500 mb-4">
                                Check our documentation or contact support for assistance.
                            </p>

                            <button
                                type="button"
                                className="w-full h-9 px-4 rounded-lg border border-[#D97706] text-[#D97706] text-[11px] sm:text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-amber-50 transition-colors"
                            >
                                <span>
                                    View Documentation
                                </span>

                                <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* stepper */}
                    <div className="w-full overflow-x-auto no-scrollbar my-4">
                        <div className="min-w-max bg-white px-4 py-2.5 shadow-sm">
                            <div className="flex items-center justify-between">
                                {steps.map((stepData, index) => {

                                    const stepNumber = index + 1;

                                    const isCompleted = stepNumber < step;
                                    const isCurrent = stepNumber === step;
                                    const isUpcoming = stepNumber > step;

                                    return (
                                        <div
                                            key={stepNumber}
                                            className="flex items-center">

                                            <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl min-w-45">
                                                {/* Icon Circle */}
                                                <div className="shrink-0">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border bg-white
                                                        ${isCompleted
                                                            ? "bg-emerald-500 border-emerald-500 text-emerald-500"
                                                            : isCurrent
                                                                ? "bg-[#D97706] border-[#D97706] text-[#D97706]"
                                                                : "bg-white border-slate-300 text-slate-500"
                                                        }
                                                        `}>
                                                        {isCompleted ? (
                                                            <Check className="w-4 h-4" />
                                                        ) : (
                                                            <span className="text-sm font-bold">
                                                                {stepNumber}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Text */}
                                                <div className="min-w-0">
                                                    <h4
                                                        className={`text-[13px] font-semibold whitespace-nowrap transition-colors
                                                            ${isCompleted
                                                                ? "text-emerald-600"
                                                                : isCurrent
                                                                    ? "text-[#D97706]"
                                                                    : "text-slate-700"
                                                            }
                                                            `}>
                                                        {stepData.label}
                                                    </h4>

                                                    <p
                                                        className={`text-xs whitespace-nowrap mt-0.5
                                                            ${isCompleted
                                                                ? "text-emerald-500"
                                                                : isCurrent
                                                                    ? "text-[#D97706]/70"
                                                                    : "text-slate-500"
                                                            }
                                                            `}>
                                                        {stepData.sub}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Arrow */}
                                            {index !== steps.length - 1 && (
                                                <div className="mx-2 shrink-0">
                                                    <ChevronRight
                                                        size={18}
                                                        className={`
                                        transition-colors duration-200
                                        ${isCompleted
                                                                ? "text-emerald-500"
                                                                : "text-slate-300"
                                                            }
                                    `}
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
                    <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6 items-start">

                        {/* left side - form */}
                        <div className="lg:col-span-2 space-y-6">
                            {step === 1 && <PaymentGatewayFormStep1 setStep={setStep} />}
                            {step === 2 && <PaymentGatewayFormStep2 setStep={setStep} />}
                            {step === 3 && <PaymentGatewayFormStep3 setStep={setStep} />}
                            {step === 4 && <PaymentGatewayFormStep4 setStep={setStep} />}

                            {/* button */}
                            <div className='flex justify-between'>
                                {step === 1 && (
                                    <button
                                        onClick={() => setCurrentPage('payment-gateways')}
                                        className="w-full sm:w-auto h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg border border-[#D97706] bg-white text-xs sm:text-sm font-medium text-[#D97706] transition-colors duration-200 hover:bg-amber-50 active:scale-[0.98]"
                                    >
                                        <span>Cancel</span>
                                    </button>
                                )}

                                {(step === 2 || step === 3 || step === 4) && (
                                    <button
                                        onClick={handleBack}
                                        className="w-full sm:w-auto h-10 px-4 inline-flex items-center justify-center gap-2 rounded-lg border border-[#D97706] bg-white text-xs sm:text-sm font-medium text-[#D97706] transition-colors duration-200 hover:bg-amber-50 active:scale-[0.98]"
                                    >
                                        <span>Previous</span>
                                    </button>
                                )}

                                {(step === 1 || step === 2 || step === 3) && (
                                    <button
                                        onClick={handleNext}
                                        className="w-full sm:w-auto h-10 px-5 flex items-center justify-center gap-3 rounded-lg bg-[#D97706] text-[12px] sm:text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#B45F04] active:scale-[0.98]" >
                                        <span>{nextLabel}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                )}

                                {step === 4 && (
                                    <button
                                        onClick={() => setIsGatewayActivated(true)}
                                        className="w-full sm:w-auto h-10 px-5 flex items-center justify-center gap-3 rounded-lg bg-[#D97706] text-[12px] sm:text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#B45F04] active:scale-[0.98]" >
                                        <span>Activate Gateway</span>
                                        <Zap className="w-4 h-4" />
                                    </button>
                                )}

                            </div>
                        </div>

                        {/* right side - cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">

                            {step === 1 && (
                                <div className="w-full bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                            <Info className="w-4 h-4 text-indigo-500" />
                                        </div>
                                        <h3 className="text-sm font-bold text-[#0B1E3D]"> About Payment Gateways</h3>
                                    </div>

                                    <p className="text-[10px] sm:text-[11px] leading-5 text-slate-500 mb-5">
                                        Payment gateways act as a bridge between your platform and financial
                                        institutions to securely process payments.
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">

                                            <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                                                <ShieldCheck className="w-3.5 h-3.5 text-[#D97706]" />
                                            </div>

                                            <div>
                                                <h4 className="text-[10px] sm:text-[11px] font-bold text-[#0B1E3D]">Secure Transactions</h4>
                                                <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5">All transactions are encrypted and secure.</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                                                <Lightbulb className="w-3.5 h-3.5 text-[#D97706]" />
                                            </div>

                                            <div>
                                                <h4 className="text-[10px] sm:text-[11px] font-bold text-[#0B1E3D]"> Multiple Providers</h4>
                                                <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5">Integrate with multiple payment providers. </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                                                <Globe2 className="w-3.5 h-3.5 text-[#D97706]" />
                                            </div>

                                            <div>
                                                <h4 className="text-[10px] sm:text-[11px] font-bold text-[#0B1E3D]">Global Support</h4>
                                                <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5">Accept payments in multiple currencies.</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                                                <ChartNoAxesCombinedIcon className="w-3.5 h-3.5 text-[#D97706]" />
                                            </div>

                                            <div>
                                                <h4 className="text-[10px] sm:text-[11px] font-bold text-[#0B1E3D]">Real-time Monitoring </h4>
                                                <p className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5">Monitor gateway performance in real-time.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="w-full bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">
                                    <div className="flex items-center gap-3 mb-5">

                                        <div className="w-7 h-7 rounded-md bg-[#D97706] flex items-center justify-center shrink-0">
                                            <span className="text-white font-bold text-lg">
                                                S
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-bold text-[#0B1E3D]">About Stripe Configuration</h3>
                                    </div>

                                    <div className="space-y-4">
                                        {stripeConfigItems.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <div
                                                    key={item.title}
                                                    className="flex items-start gap-3">

                                                    {/* Icon */}
                                                    <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                                        <Icon className="w-4 h-4 text-[#0B1E3D]" />
                                                    </div>

                                                    {/* Content */}
                                                    <div>
                                                        <h4 className="text-[10px] sm:text-[11px] font-bold text-[#0B1E3D]">
                                                            {item.title}
                                                        </h4>

                                                        <p className="text-[9px] sm:text-[10px] leading-4 text-slate-500 mt-0.5">
                                                            {item.description}
                                                        </p>
                                                    </div>

                                                </div>
                                            );
                                        })}

                                    </div>

                                </div>
                            )}

                            {step === 3 && (
                                <div className="w-full bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">

                                    {/* Header */}
                                    <div className="flex items-center gap-3 mb-5">

                                        {/* Globe Icon */}
                                        <div className="w-7 h-7 rounded-md bg-amber-50 flex items-center justify-center shrink-0">
                                            <Globe2 className="w-5.5 h-5.5 text-[#D97706]" />
                                        </div>

                                        <h3 className="text-sm font-bold text-[#0B1E3D]">
                                            About Supported Currencies
                                        </h3>
                                    </div>

                                    <div className="space-y-4">
                                        {supportedCurrenciesItems.map((item) => {
                                            const Icon = item.icon;

                                            return (
                                                <div
                                                    key={item.title}
                                                    className="flex items-start gap-3"
                                                >

                                                    {/* Icon */}
                                                    <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                                        <Icon className="w-4 h-4 text-[#0B1E3D]" />
                                                    </div>

                                                    {/* Content */}
                                                    <div>
                                                        <h4 className="text-[10px] sm:text-[11px] font-bold text-[#0B1E3D]">
                                                            {item.title}
                                                        </h4>

                                                        <p className="text-[9px] sm:text-[10px] leading-4 text-slate-500 mt-0.5">
                                                            {item.description}
                                                        </p>
                                                    </div>

                                                </div>
                                            );
                                        })}

                                    </div>

                                </div>
                            )}

                            {step === 4 && (
                                <>
                                    <div className="w-full bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">
                                        <div className="flex items-center gap-3 mb-5">

                                            <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
                                                <Building2 className="w-5.5 h-5.5 text-[#D97706]" />
                                            </div>

                                            <h3 className="text-sm font-bold text-[#0B1E3D]">
                                                Gateway Summary
                                            </h3>
                                        </div>

                                        <div className="space-y-3">

                                            {gatewaySummaryItems.map((item) => (
                                                <div
                                                    key={item.label}
                                                    className="flex items-center justify-between gap-4">
                                                    <span className="text-[9px] sm:text-[13px] font-semibold text-[#0B1E3D]">
                                                        {item.label}
                                                    </span>

                                                    {item.badge ? (
                                                        <span
                                                            className={`px-2 py-0.5 rounded-md border text-[8px] sm:text-[13px] font-semibold ${item.badgeClass}`}
                                                        >
                                                            {item.value}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[9px] sm:text-[13px] text-slate-500 text-right">
                                                            {item.value}
                                                        </span>
                                                    )}

                                                </div>
                                            ))}

                                        </div>

                                    </div>

                                    <div className="w-full bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">

                                        {/* Header */}
                                        <div className="flex items-center gap-3 mb-5">

                                            <div className="w-8 h-8 rounded-md bg-emerald-50 flex items-center justify-center shrink-0">
                                                <CheckSquare className="w-5.5 h-5.5 text-emerald-500" />
                                            </div>

                                            <h3 className="text-sm font-bold text-[#0B1E3D]">
                                                About Review
                                            </h3>

                                        </div>

                                        {/* Review Points */}
                                        <div className="space-y-3">
                                            {reviewItems.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start gap-2.5"
                                                >

                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />

                                                    <p className="text-[9px] sm:text-[13px] leading-4 text-slate-500">
                                                        {item}
                                                    </p>

                                                </div>
                                            ))}

                                        </div>

                                    </div>
                                </>
                            )}

                            {(step === 1 || step === 2 || step === 3 || step === 4) && (
                                <div className="w-full bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm">

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                                            <Headphones className="w-5 h-5 text-[#0B1E3D]" />
                                        </div>

                                        <h3 className="text-sm font-bold text-[#0B1E3D]">
                                            Need Help?
                                        </h3>
                                    </div>

                                    <p className="text-[10px] sm:text-[11px] leading-5 text-slate-500 mb-4">
                                        Check our documentation or contact support for assistance.
                                    </p>

                                    <button
                                        type="button"
                                        className="w-full h-9 px-4 rounded-lg border border-[#D97706] text-[#D97706] text-[11px] sm:text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-amber-50 transition-colors"
                                    >
                                        <span>
                                            View Documentation
                                        </span>

                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </>
            )
            }
        </div >
    )
}

export default AddNewPaymentGatewayForm;