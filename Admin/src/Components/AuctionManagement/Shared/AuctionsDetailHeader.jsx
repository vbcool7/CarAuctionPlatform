
import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';

function AuctionsDetailHeader({
    setCurrentPage,
    pageTitle,
    parentLabel,
    parentPage,
    currentLabel,
    backButtonTarget,
}) {
    return (
        <>
            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">

                {/* Left */}
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">
                        {pageTitle}
                    </h1>

                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage("dashboard")}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors"
                        >
                            Dashboard
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>

                        <span className=" text-slate-500">
                            Auction Management
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span
                            onClick={() => setCurrentPage(parentPage)}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            {parentLabel}
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className="font-medium text-[#D97706]">
                            {currentLabel}
                        </span>
                    </div>
                </div>

                {/* btns */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                    <button
                        onClick={() => setCurrentPage(backButtonTarget)}
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-[#D97706] px-4 py-2 font-medium text-white shadow-md shadow-amber-500/20 transition-all duration-200 hover:bg-[#B45F04] hover:scale-[1.02]">
                        <ArrowLeft size={16} />
                        <span className="text-sm">Back to Auctions</span>
                    </button>

                    <button className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50">
                        <span className="text-sm">More Auctions</span>
                    </button>
                </div>
            </div>
        </>
    );
}

export default AuctionsDetailHeader;