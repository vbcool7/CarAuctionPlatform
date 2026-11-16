
import React, { useState } from 'react';
import { Star, CarFront, MapPin, ArrowRight, } from 'lucide-react';

import SellerReviews from './SellerReviews';
import { useGetSellerPublicReviews } from '../../../hook/useReview';
import { useGetPublicSellerAuctions } from '../../../hook/useAuction';
import { formatLabel } from '../../../utils/formatters';

const initialsOf = (name) =>
    String(name || 'S')
        .split(/\s+/)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

function SellerProfilePage({ sellerId, setCurrentPage, previousPage }) {
    const [page, setPage] = useState(1);

    const {
        data,
        isLoading,
        isError,
        isFetching,
    } = useGetSellerPublicReviews(sellerId, page, 10);

    const {
        data: vehiclesData,
    } = useGetPublicSellerAuctions(sellerId, 1, 4);

    const vehicleCount = vehiclesData?.pagination?.total;

    const back = (
        <button
            onClick={() => setCurrentPage(previousPage || 'browse-auctions')}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#0B1E3D] mb-3 transition-colors"
        >
            <ArrowRight size={15} className="rotate-180" />
            Back
        </button>
    );

    if (isLoading) {
        return (
            <p className="p-10 text-center text-slate-500">
                Loading seller...
            </p>
        );
    }

    if (isError || !data) {
        return (
            <div>
                {back}
                <p className="p-10 text-center text-red-500">
                    Seller not found
                </p>
            </div>
        );
    }

    const { seller, summary, reviews, pagination } = data;

    const sellerName = seller?.name || 'Seller';

    const location = [
        seller?.area,
        formatLabel(seller?.city),
        formatLabel(seller?.emirate),
        formatLabel(seller?.country),
    ].filter(Boolean).join(', ');

    return (
        <div className="space-y-7">

            {/* Page Heading */}
            <div>
                {back}

                <h1 className="text-2xl font-bold text-[#0B1E3D]">
                    Seller Profile
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                    View seller details and customer reviews.
                </p>
            </div>

            {/* Seller Header */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                
                <div className="h-20 bg-linear-to-r from-[#0B1E3D] via-[#132d59] to-[#0B1E3D] relative">
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px]" />
                </div>

                <div className="px-5 sm:px-6 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                            
                            <div className="w-20 h-20 rounded-2xl bg-[#0B1E3D] text-white flex items-center justify-center font-bold text-2xl shrink-0 overflow-hidden ring-4 ring-white shadow-md">
                                {seller?.profileImage ? (
                                    <img
                                        src={seller.profileImage}
                                        alt={sellerName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    initialsOf(sellerName)
                                )}
                            </div>

                            <div className="pt-1 sm:pb-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-xl sm:text-2xl font-bold text-[#0B1E3D] tracking-tight">
                                        {sellerName}
                                    </h2>

                                    {seller?.status === 'approved' && (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            Verified Seller
                                        </span>
                                    )}
                                </div>

                                {seller?.businessName && (
                                    <p className="text-sm font-medium text-slate-500 mt-0.5">
                                        {seller.businessName}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Right-aligned Pill Metadata */}
                        <div className="flex flex-wrap items-center gap-2 sm:pb-1">
                            {location && (
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100/80 border border-slate-200/70 px-3 py-1.5 rounded-lg">
                                    <MapPin size={13} className="text-slate-400" />
                                    {location}
                                </span>
                            )}

                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-amber-50/80 border border-amber-200/80 px-3 py-1.5 rounded-lg">
                                <Star size={13} className="text-[#D97706] fill-[#D97706]" />
                                <strong className="text-[#0B1E3D]">
                                    {summary?.ratingCount
                                        ? Number(summary.ratingAverage).toFixed(1)
                                        : '—'}
                                </strong>
                                <span className="text-slate-500">
                                    ({summary?.ratingCount || 0} reviews)
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seller Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                    {
                        label: 'Listed Vehicles',
                        value: vehicleCount ?? '—',
                        description: 'Live and upcoming vehicles',
                        icon: CarFront,
                    },
                    {
                        label: 'Customer Rating',
                        value: summary?.ratingCount
                            ? `${Number(summary.ratingAverage).toFixed(1)}/5`
                            : '—',
                        description: `${summary?.ratingCount || 0} customer reviews`,
                        icon: Star,
                    },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="group relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300/80 hover:shadow-xl hover:shadow-slate-200/40"
                    >
                        {/* Left Accent Line */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D97706] scale-y-0 transition-transform duration-300 origin-bottom group-hover:scale-y-100" />

                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    {item.label}
                                </p>
                                <h3 className="text-3xl font-extrabold text-[#0B1E3D] mt-2 tracking-tight">
                                    {item.value}
                                </h3>
                            </div>

                            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 text-slate-600 flex items-center justify-center transition-colors duration-300 group-hover:bg-amber-50 group-hover:border-amber-200 group-hover:text-[#D97706]">
                                <item.icon size={19} strokeWidth={2} />
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                            <p className="text-xs font-medium text-slate-500">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Customer Reviews */}
            <section className='pt-6'>
                <div className="mb-4">
                    <h2 className="text-lg font-bold text-[#0B1E3D]">
                        Customer Reviews
                    </h2>

                    <p className="text-sm text-slate-500 mt-0.5">
                        Feedback from buyers who have interacted with this seller.
                    </p>
                </div>

                <SellerReviews
                    summary={summary}
                    reviews={reviews}
                    pagination={pagination}
                    page={page}
                    setPage={setPage}
                    isFetching={isFetching}
                />
            </section>

        </div>
    );
}

export default SellerProfilePage;