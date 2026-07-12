
import React, { useState } from 'react';
import { vehicles } from '../../../Components/Data';
import { Filter, ChevronDown, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

const tabs = ['All Auctions', 'Live Now', 'Upcoming', 'Ended'];

function BuyerDashRecommended({ setCurrentPage, openBidModal, setSelectedVehicleId, setPreviousPage }) {

    const [activeTab, setActiveTab] = useState('All Auctions');

    return (
        <div className="w-full space-y-6">

            <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm w-full">

                {/* tabs */}
                <div className="flex items-center justify-between border-b border-slate-100 mb-6 overflow-x-auto no-scrollbar">
                    <div className="flex gap-6 md:gap-8 whitespace-nowrap">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 text-[13px] md:text-sm font-semibold transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-[#0B1E3D]' : 'text-slate-400 hover:text-[#0B1E3D]'}`}
                            >
                                {tab}
                                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D97706] rounded-t-full" />}
                            </button>
                        ))}
                    </div>

                    {/* Saved Searches hidden on very small screens or styled smaller */}
                    <button className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#0B1E3D] transition-colors mb-4 ml-4">
                        <Bookmark size={18} /> Saved Searches
                    </button>
                </div>

                {/* drop down */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {['All Makes', 'All Models', 'Year', 'Price Range', 'Body Type'].map((filter) => (
                        <button
                            key={filter}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-[13px] md:text-sm font-medium text-slate-600 hover:border-[#D97706] transition-colors whitespace-nowrap">
                            {filter} <ChevronDown size={14} />
                        </button>
                    ))}

                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:border-[#D97706] transition-colors whitespace-nowrap">
                        <Filter size={14} /> More
                    </button>

                    {/* Sort: Pushing to the end or keeping it visible */}
                    <div className="flex items-center gap-2 text-sm ml-auto whitespace-nowrap pl-4">
                        <span className="text-slate-500 hidden sm:inline">Sort by:</span>
                        <button className="font-semibold text-[#0B1E3D] flex items-center gap-1">
                            Newest <ChevronDown size={14} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="relative">
                <h2 className="text-lg md:text-xl font-bold text-[#0B1E3D] mb-4 ml-2">
                    Recommended For You
                </h2>

                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        nextEl: '.custom-next',
                        prevEl: '.custom-prev',
                    }}
                    spaceBetween={10}
                    slidesPerView={1}
                    breakpoints={{ 640: { slidesPerView: 2 }, 1280: { slidesPerView: 3 } }}
                >
                    {vehicles.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group">

                                {/* Image */}
                                <div className="relative h-45 w-full overflow-hidden rounded-t-2xl">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" />

                                    <span className={`absolute top-3 left-3 text-white text-[8px] md:text-[10px] px-2 py-1 rounded-full font-bold uppercase flex items-center gap-1 md:gap-1.5
                                        ${item.status.toLowerCase() === 'upcoming' ? 'bg-blue-600' :
                                            item.status.toLowerCase() === 'live' ? 'bg-red-600' :
                                                'bg-slate-400'
                                        }`}>

                                        {item.status.toLowerCase() === 'live' && (
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                                            </span>
                                        )}

                                        {item.status}
                                    </span>
                                </div>

                                {/* Details */}
                                <div className='p-4'>
                                    <h3 className="font-bold text-[#0B1E3D] text-md truncate">{item.name}</h3>
                                    <span className="text-sm text-slate-500 mb-4 font-medium">
                                        {`Lot # ${item.id}`}
                                    </span>
                                    <p className="text-[13px] text-slate-500 mb-2">{item.mileage || "NA"} • {item.transmission} • {item.fuelType}</p>

                                    {/* Price & Bid */}
                                    <div className="flex items-center justify-between my-3">
                                        {/* Left: Price */}
                                        <div>
                                            <p className="text-[11px] text-slate-400">
                                                {item.status === 'live' ? 'Current Bid' :
                                                    item.status === 'upcoming' ? 'Starting Bid' : 'Winning Bid'}
                                            </p>
                                            <p className="font-bold text-[#0B1E3D] text-lg">
                                                {item.soldPrice || item.bid || "AED 0"}
                                            </p>
                                        </div>

                                        {/*  (Time/Date) */}
                                        <div className="text-right">
                                            {item.status === 'live' && (
                                                <>
                                                    <p className="text-[11px] text-slate-400">Time Left</p>
                                                    <p className="font-bold text-red-500 text-sm">{item.timeRemaining || "0m 0s"}</p>
                                                </>
                                            )}

                                            {item.status === 'upcoming' && (
                                                <>
                                                    <p className="text-[11px] text-slate-400">Starts in</p>
                                                    <p className="font-bold text-[#0B1E3D] text-sm">{item.startsIn || "0h 0m"}</p>
                                                </>
                                            )}

                                            {(item.status === 'sold' || item.status === 'ended') && (
                                                <>
                                                    <p className="text-[11px] text-slate-400">Ended on</p>
                                                    <p className="font-bold text-[#0B1E3D] text-xs mt-1">{item.endedDate || "N/A"}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* btn */}
                                    {/* <button className={`w-full px-5 py-1.5 rounded-lg font-semibold transition-colors 
                                        ${item.status === 'live'
                                            ? 'bg-[#0B1E3D] hover:bg-[#D97706] text-white'
                                            : 'bg-white border border-[#0B1E3D] text-[#0B1E3D] hover:bg-[#0B1E3D] hover:text-white'
                                        }`}>

                                        {item.status === 'live' ? "Bid Now" :
                                            item.status === 'upcoming' ? "View Details" :
                                                item.status === 'sold' ? "View Results" :
                                                    "View Details"}
                                    </button> */}

                                    {/* btn */}
                                    <button
                                        onClick={() => {
                                            if (item.status === 'live') {
                                                openBidModal(item.id, 'dashboard');
                                            } else if (item.status === 'upcoming') {
                                                setSelectedVehicleId(item.id);
                                                setPreviousPage('dashboard');
                                                setCurrentPage('upcoming-auctions-detail');
                                            } else if (item.status === 'sold' || item.status === 'unsold') {
                                                setSelectedVehicleId(item.id);
                                                setPreviousPage('dashboard'); 
                                                setCurrentPage('auction-result-detail');
                                            }
                                        }}
                                        className={`w-full px-5 py-1.5 rounded-lg font-semibold transition-colors 
                                            ${item.status === 'live'
                                                ? 'bg-[#0B1E3D] hover:bg-[#D97706] text-white'
                                                : 'bg-white border border-[#0B1E3D] text-[#0B1E3D] hover:bg-[#0B1E3D] hover:text-white'
                                            }`}>
                                        {item.status === 'live' ? "Bid Now" :
                                            item.status === 'upcoming' ? "View Details" :
                                                item.status === 'sold' ? "View Results" : 'View Details'}
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* slidet arrow */}
                <button className="custom-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg border border-slate-100 text-[#0B1E3D] hover:bg-[#D97706] hover:text-white transition-all hidden group-hover:flex">
                    <ChevronLeft size={24} />
                </button>

                <button className="custom-next absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg border border-slate-100 text-[#0B1E3D] hover:bg-[#D97706] hover:text-white transition-all">
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
}

export default BuyerDashRecommended;