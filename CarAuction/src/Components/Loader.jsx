import React from "react";
import { Gavel, LoaderCircle } from "lucide-react";

function Loader() {
    return (
        <div className="fixed inset-0 z-9999 bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center">

            <div className="flex flex-col items-center">

                {/* Logo */}
                <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#0B1E3D] flex items-center justify-center shadow-lg shadow-slate-200">
                        <Gavel
                            size={30}
                            strokeWidth={2}
                            className="text-[#D97706]"
                        />
                    </div>

                    {/* Loading Ring */}
                    <div className="absolute -inset-1 rounded-2xl border-2 border-[#D97706]/20">
                        <div className="absolute -inset-0.5 rounded-2xl border-2 border-transparent border-t-[#D97706] animate-spin" />
                    </div>
                </div>

                {/* Brand */}
                <h1 className="text-2xl font-black tracking-tight text-[#0B1E3D]">
                    Bid<span className="text-[#D97706]">Drive</span>
                </h1>

                {/* Loading text */}
                <div className="flex items-center gap-2 mt-3">
                    <LoaderCircle
                        size={14}
                        strokeWidth={2.5}
                        className="text-[#D97706] animate-spin"
                    />

                    <p className="text-xs font-semibold text-slate-500 tracking-wide">
                        Loading auction details
                    </p>
                </div>

                {/* Small progress line */}
                <div className="w-32 h-1 bg-slate-200 rounded-full mt-5 overflow-hidden">
                    <div className="h-full w-1/2 bg-[#D97706] rounded-full animate-[loading_1.2s_ease-in-out_infinite]" />
                </div>

            </div>

            <style>
                {`
                    @keyframes loading {
                        0% {
                            transform: translateX(-100%);
                        }
                        50% {
                            transform: translateX(0%);
                        }
                        100% {
                            transform: translateX(200%);
                        }
                    }
                `}
            </style>

        </div>
    );
}

export default Loader;