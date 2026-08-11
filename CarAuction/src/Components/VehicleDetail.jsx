
import { useParams } from "react-router-dom";
import { vehicles } from "./Data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import VehicleGallery from "./VehicleGallery";
import VehicleAuctionPanel from "./VehicleAuctionPanel";
import LiveBidsPanel from "./SharedComponents/LiveBidsPanel";
import SellerInfo from "./SellerInfo";
import DetailTabs from "./DetailTabs";
import VehicleInfoTab from "./VehicleInfoTab";
import ConditionTab from "./ConditionTab";
import InspectionTab from "./InspectionTab";
import DamageReportTab from "./DamageReportTab";
import MaintenanceTab from "./MaintenanceTab";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from "swiper/modules";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "swiper/css/navigation";

const marketData = [
    {
        name: "Market Value",
        value: 310000,
    },
    {
        name: "Avg. Listing",
        value: 295000,
    },
    {
        name: "Current Bid",
        value: 245000,
    },
];

function VehicleDetail() {

    const { id } = useParams();

    const vehicle = vehicles.find((v) => v.id === parseInt(id));

    if (!vehicle) {
        return <div className="p-10 text-center">Vehicle not found!</div>;
    }

    const vehicleTabs = [
        {
            key: "rows",
            label: "Vehicle Info",
            content: <VehicleInfoTab vehicle={vehicle} />,
        },
        {
            key: "condition",
            label: "Condition",
            content: <ConditionTab vehicle={vehicle} />,
        },
        {
            key: "inspection",
            label: "Inspection",
            content: <InspectionTab vehicle={vehicle} />,
        },
        {
            key: "damage",
            label: "Damage Report",
            content: <DamageReportTab vehicle={vehicle} />,
        },
        {
            key: "maintenance",
            label: "Maintenance",
            content: <MaintenanceTab vehicle={vehicle} />,
        },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 py-8 space-y-8">

            {/* SECTION 1: Top Grid */}
            <div className="flex flex-col md:flex-row gap-6">

                <div className="w-full md:w-2/3">
                    <VehicleGallery images={vehicle.images} video={vehicle.video} />
                </div>

                <div className="w-full md:w-1/3">
                    <VehicleAuctionPanel vehicle={vehicle} endTime={vehicle.endTime} />
                </div>
            </div>

            {/* SECTION 2: Details + live bid table */}
            <div className="flex flex-col md:flex-row gap-6">

                <div className="w-full md:w-2/3">
                    <DetailTabs
                        tabs={vehicleTabs}
                        defaultTab="rows" />
                </div>

                <div className="w-full md:w-1/3">
                    <LiveBidsPanel />
                </div>
            </div>

            {/* SECTION 3: market insights / Seller Info */}
            <div className="flex flex-col md:flex-row gap-6">

                <div className="w-full md:w-2/3">
                    <div className="h-full bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
                        <h3 className="text-slate-900 font-bold text-base">
                            Market Value Insights
                        </h3>

                        {/* Values */}
                        <div className="mt-5 flex flex-col gap-3">

                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm">
                                    Market Value
                                </span>

                                <span className="text-slate-900 font-bold text-sm">
                                    AED 310,000
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm">
                                    Average Listing Price
                                </span>

                                <span className="text-slate-900 font-bold text-sm">
                                    AED 295,000
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm">
                                    Current Bid
                                </span>

                                <span className="text-slate-900 font-bold text-sm">
                                    AED 245,000
                                </span>
                            </div>

                        </div>

                        <div className="mt-5 h-38">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={marketData}
                                    layout="vertical"
                                    margin={{
                                        top: 0,
                                        right: 10,
                                        left: 5,
                                        bottom: 0,
                                    }}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        horizontal={false}
                                        stroke="#e2e8f0"
                                    />

                                    <XAxis
                                        type="number"
                                        domain={[0, 350000]}
                                        tickFormatter={(value) =>
                                            `${value / 1000}K`
                                        }
                                        tick={{
                                            fontSize: 10,
                                            fill: "#64748b",
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        width={75}
                                        tick={{
                                            fontSize: 10,
                                            fill: "#64748b",
                                        }}
                                        axisLine={false}
                                        tickLine={false}
                                    />

                                    <Tooltip
                                        formatter={(value) => [
                                            `AED ${value.toLocaleString()}`,
                                            "Value",
                                        ]}
                                        contentStyle={{
                                            borderRadius: "10px",
                                            border: "1px solid #e2e8f0",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                            fontSize: "12px",
                                        }}
                                    />

                                    <Bar
                                        dataKey="value"
                                        fill="#D97706"
                                        radius={[0, 6, 6, 0]}
                                        barSize={14}
                                    />

                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Potential Saving */}
                        <div className="mt-auto pt-5">
                            <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex justify-between items-center">
                                <span className="text-green-800 font-semibold text-sm">
                                    Potential Saving
                                </span>

                                <span className="text-green-700 font-bold text-base">
                                    AED 65,000 (21%)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/3">
                    <SellerInfo />
                </div>
            </div>

            {/* SECTION 4: Similar vehicles */}
            <div className="w-full pt-10">
                <div className="w-full bg-white">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex justify-between items-center pb-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                                Similar Vehicles You May Like
                            </h1>
                            <button
                                onClick={() => handleStatusClick('live')}
                                className="text-[#D97706] font-semibold hover:text-[#b46405] transition-colors"
                            >
                                <span className="sm:hidden">View All</span>
                                <span className="hidden sm:inline">View All Similar</span>
                            </button>
                        </div>

                        <div className="relative group">
                            {/* Navigation Arrows */}
                            <button className="auction-prev absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center hover:scale-110 transition-transform">
                                <ChevronLeft size={20} className="text-slate-700" />
                            </button>
                            <button className="auction-next absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center hover:scale-110 transition-transform">
                                <ChevronRight size={20} className="text-slate-700" />
                            </button>

                            <Swiper
                                modules={[Autoplay, Navigation]}
                                navigation={{ prevEl: ".auction-prev", nextEl: ".auction-next" }}
                                slidesPerView={1}
                                spaceBetween={24}
                                loop={true}
                                autoplay={{ delay: 3000, disableOnInteraction: false }}
                                breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }}
                            >
                                {vehicles.slice(0, 8).map((live, index) => (
                                    <SwiperSlide key={index}>
                                        {/* CARD CONTAINER */}
                                        <div className="bg-[#0B1E3D] rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-700/50">

                                            {/* Image */}
                                            <div className="relative w-full h-48 overflow-hidden">
                                                <img
                                                    src={live.image}
                                                    alt={live.name}
                                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>

                                            {/* Body */}
                                            <div className="p-5">
                                                <h4 className="font-bold text-white/90 truncate">{live.name}</h4>
                                                <p className="text-xs text-slate-400 mb-4">{live.model}</p>

                                                {/* Footer Info */}
                                                <div className="flex justify-between items-center border-t border-slate-700 pt-4">
                                                    <div className="text-white/90 font-bold text-lg">{live.bid}</div>
                                                    <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-md">
                                                        <span className="text-[10px] uppercase text-slate-400 font-bold">Bids</span>
                                                        <span className="text-white font-bold text-sm">{live.totalBids}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
}

export default VehicleDetail;