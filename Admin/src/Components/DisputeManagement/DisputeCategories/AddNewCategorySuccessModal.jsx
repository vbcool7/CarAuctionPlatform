
import React, { useEffect } from 'react';
import { Check, Info, ListFilter, Plus, Settings, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

function AddNewCategorySuccessModal({ setCurrentPage, setStep }) {
    useEffect(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.8 },
        });
    }, []);

    return (
        <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

            {/* Success Header */}
            <div className="px-5 sm:px-8 pt-8 pb-7 text-center border-b border-slate-100">

                {/* Success Icon */}
                <div className="relative w-20 h-20 mx-auto mb-5 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-emerald-50 border border-emerald-100" />

                    <div className="relative w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                        <Check className="w-7 h-7 stroke-3" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-bold text-[#0B1E3D]">
                    Payment Not Received
                </h2>

                {/* Success Badge */}
                <div className="mt-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <Check className="w-3.5 h-3.5" />
                        Created Successfully
                    </span>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                    The dispute category has been created and is now active in your system.
                </p>
            </div>


            {/* Main Content */}
            <div className="p-5 sm:p-8">

                {/* Info Notice */}
                <div className="flex items-start gap-3 rounded-xl border border-violet-200 bg-violet-50/60 px-4 py-3.5">
                    <div className="w-8 h-8 shrink-0 rounded-lg bg-violet-100 flex items-center justify-center">
                        <Info className="w-4 h-4 text-violet-600" />
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-[#0B1E3D]">
                            Category is ready to use
                        </p>

                        <p className="mt-0.5 text-[11px] leading-4 text-slate-600">
                            You can now use this category while creating or managing disputes.
                        </p>
                    </div>
                </div>


                {/* What's Next */}
                <div className="mt-8">

                    <div className="mb-4">
                        <h3 className="text-sm sm:text-base font-bold text-[#0B1E3D]">
                            What's Next?
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                            Choose what you'd like to do next.
                        </p>
                    </div>


                    {/* Action Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        {/* View Categories */}
                        <div className="group border border-slate-200 rounded-xl p-4 flex flex-col justify-between bg-white hover:border-[#D97706]/40 hover:shadow-sm transition-all">

                            <div>
                                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-[#D97706] flex items-center justify-center mb-4">
                                    <ListFilter className="w-5 h-5" />
                                </div>

                                <h4 className="text-sm font-bold text-[#0B1E3D]">
                                    View All Categories
                                </h4>

                                <p className="mt-1.5 text-[11px] text-slate-500 leading-4">
                                    See all dispute categories in the system.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setCurrentPage('dispute-categories')}
                                className="mt-5 w-full h-9 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0B1E3D] hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706] flex items-center justify-center gap-1.5 transition-all"
                            >
                                View Categories
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>


                        {/* Create Another */}
                        <div className="group border border-slate-200 rounded-xl p-4 flex flex-col justify-between bg-white hover:border-[#D97706]/40 hover:shadow-sm transition-all">

                            <div>
                                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-[#D97706] flex items-center justify-center mb-4">
                                    <Plus className="w-5 h-5" />
                                </div>

                                <h4 className="text-sm font-bold text-[#0B1E3D]">
                                    Create Another Category
                                </h4>

                                <p className="mt-1.5 text-[11px] text-slate-500 leading-4">
                                    Add another dispute category to your system.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="mt-5 w-full h-9 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-[#0B1E3D] hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706] flex items-center justify-center gap-1.5 transition-all"
                            >
                                Create New
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Footer */}
            <div className="px-5 sm:px-8 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                <button
                    type="button"
                    onClick={() => setCurrentPage("dispute-categories")}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#D97706] text-white text-xs sm:text-sm font-semibold shadow-sm hover:bg-amber-700 transition-colors"
                >
                    Done
                    <Check className="w-4 h-4" />
                </button>
            </div>

        </div>
    );
}

export default AddNewCategorySuccessModal;