
import { Check, ChevronRight } from "lucide-react";

const STATE_STYLES = {
    completed: {
        circle: "bg-[#16A34A] border-[#16A34A] text-white",
        line: "bg-[#16A34A]",
        label: "text-[#0B1E3D] font-semibold",
    },
    active: {
        circle: "bg-[#D97706] border-[#D97706] text-white",
        line: "bg-slate-200",
        label: "text-[#D97706] font-semibold",
    },
    future: {
        circle: "bg-white border-slate-300 text-slate-400",
        line: "bg-slate-200",
        label: "text-slate-500 font-medium",
    },
};

function AuctionsDetailTimeline({ steps = [] }) {
    return (
        <div className="bg-white rounded-xl border border-slate-100 p-5">
            <h3 className="text-[15px] font-semibold text-[#0B1E3D] mb-5">
                Auction Timeline
            </h3>

            <div className="flex items-start">
                {steps.map((step, index) => {

                    const style = STATE_STYLES[step.state] || STATE_STYLES.future;
                    const isLast = index === steps.length - 1;

                    return (
                        <div
                            key={`${step.label}-${index}`}
                            className="flex items-center flex-1 last:flex-none">
                            <div className="flex flex-col items-center text-center min-w-27.5">
                                <div
                                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center relative ${style.circle}`}
                                >
                                    {step.state === "completed" && <Check size={16} />}
                                    {step.state === "active" && (
                                        <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                                    )}
                                    {step.state === "future" && (
                                        <span className="text-xs font-semibold">{index + 1}</span>
                                    )}
                                </div>

                                <div className={`mt-2 text-[13px] ${style.label}`}>
                                    {step.label}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-0.5">
                                    {step.date}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                    {step.time}
                                </div>
                            </div>

                            {!isLast && (
                                <div> <ChevronRight size={20} className={`flex-1 mx-4 text-gray-300`} /> </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default AuctionsDetailTimeline;