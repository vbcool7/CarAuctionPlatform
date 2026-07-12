
import { User, Mail, IdCard, ShieldCheck, CreditCard, ClipboardCheck, Check, ChevronRight} from 'lucide-react';
import { useEffect, useRef } from 'react';

const steps = [
    { icon: User, label: "Create Account", sub: "Basic Information" },
    { icon: Mail, label: "Verify Contact", sub: "Email & Mobile" },
    { icon: IdCard, label: "Personal Info", sub: "Your Details" },
    { icon: ShieldCheck, label: "KYC Verification", sub: "Verify Identity" },
    { icon: CreditCard, label: "Payment Deposit", sub: "Secure Your Bidding" },
    { icon: ClipboardCheck, label: "Review & Submit", sub: "Confirm Details" },
];

function RegistrationStepper({ currentStep, onStepChange }) {

    const stepRefs = useRef([]);

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

    return (
        <div className="w-full overflow-x-auto no-scrollbar">
            <div className="min-w-max bg-white border border-slate-200 rounded-2xl px-4 py-4 shadow-sm">

                <div className="flex items-center">

                    {steps.map((step, index) => {

                        const stepNumber = index + 1;
                        const isActive = stepNumber === currentStep;
                        const isCompleted = stepNumber < currentStep;

                        const Icon = step.icon;

                        return (
                            <div
                                key={stepNumber}
                                ref={(el) => (stepRefs.current[index] = el)}
                                onClick={() => isCompleted && onStepChange(stepNumber)}
                                className={`flex items-center ${isCompleted ? "cursor-pointer" : "cursor-default"}`}
                            >
                                {/* Step */}
                                <div
                                    className={`
                                        relative
                                        flex items-center
                                        gap-3
                                        px-4
                                        py-3
                                        rounded-xl
                                        transition-all
                                        min-w-45
                                    `}
                                >
                                    {/* Icon Circle */}
                                    <div className="relative shrink-0">

                                        <div
                                            className={`
                                                w-12 h-12 rounded-full
                                                flex items-center justify-center
                                                border-2 transition-all

                                                ${isActive
                                                    ? 'bg-[#D97706] border-[#D97706] text-white'
                                                    : isCompleted
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-white border-slate-300 text-slate-500'
                                                }
                                            `}
                                        >
                                            {isCompleted ? (
                                                <Check size={18} strokeWidth={3} />
                                            ) : (
                                                <Icon size={20} />
                                            )}
                                        </div>

                                        {/* Step Number Badge */}
                                        {isActive && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#0B1E3D] text-white text-[10px] font-bold flex items-center justify-center">
                                                {stepNumber}
                                            </div>
                                        )}
                                    </div>

                                    {/* Text */}
                                    <div className="min-w-0">
                                        <h4
                                            className={`
                                                text-sm font-semibold whitespace-nowrap

                                                ${isActive
                                                    ? 'text-[#D97706]'
                                                    : isCompleted
                                                        ? 'text-[#0B1E3D]'
                                                        : 'text-slate-700'
                                                }
                                            `}
                                        >
                                            {step.label}
                                        </h4>

                                        <p className="text-xs text-slate-500 whitespace-nowrap mt-0.5">
                                            {step.sub}
                                        </p>
                                    </div>
                                </div>

                                {/* Arrow */}
                                {index !== steps.length - 1 && (
                                    <div className="mx-2 shrink-0">
                                        <ChevronRight
                                            size={18}
                                            className="text-slate-300"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}

                </div>
            </div>
        </div>
    );
}

export default RegistrationStepper;