import { useState } from "react";
import {
    X,
    Gauge,
    Fuel,
    MapPin,
    Zap,
    Clock,
    Heart,
} from "lucide-react";

function VehicleModal({ vehicle, onClose }) {
    const [activeImg, setActiveImg] = useState(0);

    if (!vehicle) return null;

    const images = vehicle.images?.length
        ? vehicle.images
        : [vehicle.image];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md">
            <div className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 shadow-md hover:bg-gray-100 transition"
                >
                    <X size={16} />
                </button>

                <div className="flex flex-col lg:grid lg:grid-cols-[1.1fr_0.9fr] overflow-hidden h-full">

                    {/* LEFT SIDE: Images */}
                    <div className="bg-gray-50 flex flex-col">
                        <div className="relative h-50 sm:h-62.5 lg:h-full">
                            <img
                                src={images[activeImg]}
                                alt={vehicle.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${vehicle.status === "live" ? "bg-[#D97706]" : "bg-gray-500"}`}>
                                    {vehicle.status === "live" ? "Live Auction" : "Sold"}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-1 p-2 bg-white">
                            {images.slice(0, 4).map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImg(i)}
                                    className={`overflow-hidden rounded-lg border-2 transition-all ${activeImg === i ? "border-[#D97706]" : "border-transparent"}`}
                                >
                                    <img src={img} alt="" className="w-full h-12 sm:h-14 object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT SIDE: Content */}
                    <div className="p-4 sm:p-6 flex flex-col overflow-y-auto">
                        <div className="mb-4">
                            <p className="text-[#D97706] text-[10px] font-bold uppercase tracking-[2px] mb-1">Premium Auction</p>
                            <h2 className="text-lg sm:text-xl font-bold text-[#0B1E3D] leading-tight">{vehicle.name}</h2>
                            <p className="text-sm text-gray-500">{vehicle.year} • {vehicle.location}</p>
                        </div>

                        {vehicle.status === "live" && (
                            <div className="bg-[#0B1E3D] text-white rounded-xl p-3 mb-4 flex items-center justify-between">
                                <p className="text-[10px] uppercase tracking-widest opacity-70">Time Remaining</p>
                                <div className="flex items-center gap-2 font-bold text-lg">
                                    <Clock size={16} /> {vehicle.timer}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {[
                                { icon: Gauge, label: "Mileage", val: vehicle.mileage || '---' },
                                { icon: Zap, label: "Engine", val: vehicle.engine || '---' },
                                { icon: Fuel, label: "Fuel", val: vehicle.fuelType || '---' },
                                { icon: MapPin, label: "Location", val: vehicle.location || '---' }
                            ].map((spec, i) => (
                                <div key={i} className="p-3 rounded-xl border border-gray-100">
                                    <spec.icon size={16} className="text-[#D97706] mb-1" />
                                    <p className="text-[10px] text-gray-400">{spec.label}</p>
                                    <p className="text-sm font-semibold">{spec.val}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-900 rounded-xl p-4 text-white mb-4">
                            <p className="text-[10px] uppercase opacity-70">Current Bid</p>
                            <p className="text-xl font-bold">{vehicle.bid}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-auto">
                            <button className="py-2.5 rounded-lg border border-gray-200 text-sm font-semibold hover:bg-gray-50 transition">
                                Watchlist
                            </button>
                            <button className="py-2.5 rounded-lg bg-[#D97706] text-white text-sm font-bold hover:brightness-110 transition">
                                Place Bid
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VehicleModal;