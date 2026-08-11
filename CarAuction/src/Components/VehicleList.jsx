
import React, { useState } from 'react';
import { Heart, Eye, Clock, ChevronLeft, ChevronRight, X, Gauge, Fuel, MapPin, Zap } from 'lucide-react';
import { vehicles } from './Data';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useNavigate, useParams } from 'react-router-dom';

function VehicleList({ category, status }) {

  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activeImg, setActiveImg] = useState(0);

  const filteredData = vehicles.filter(vehicle => {
    const matchesCategory = category ? vehicle.category === category : true;
    const matchesStatus = status ? vehicle.status === status : true;
    return matchesCategory && matchesStatus;
  });

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'live':
        return 'bg-[#D97706]';
      case 'upcoming':
        return 'bg-blue-600';
      case 'sold':
        return 'bg-slate-600';
      default:
        return 'bg-slate-400';
    }
  };

  const images = selectedVehicle?.images?.length
    ? selectedVehicle.images
    : selectedVehicle?.image
      ? [selectedVehicle.image]
      : [];

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {filteredData.map((vehicle) => {

          const images = vehicle.images || [vehicle.image];

          return (
            <div
              key={vehicle.id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">

              {/* Swiper Slider Section */}
              <div className="relative h-56 bg-gray-100 group">
                <Swiper
                  navigation={{ nextEl: `.next-${vehicle.id}`, prevEl: `.prev-${vehicle.id}` }}
                  loop={true}
                  pagination={{ clickable: true }}
                  modules={[Navigation, Pagination]}
                  className="h-full w-full vehicleList"
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={img}
                        alt={vehicle.name}
                        className="w-full h-full object-cover" />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Navigation Arrows (Visible on Hover) */}
                <button className={`prev-${vehicle.id} absolute top-1/2 left-2 z-10 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-all`}>
                  <ChevronLeft size={20} />
                </button>
                <button className={`next-${vehicle.id} absolute top-1/2 right-2 z-10 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-all`}>
                  <ChevronRight size={20} />
                </button>

                {/* Status Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider text-white ${getStatusStyles(vehicle.status)}`}>
                    {vehicle.status === 'live' ? 'Live' : vehicle.status === 'upcoming' ? 'Upcoming' : 'Sold'}
                  </span>
                </div>

                {/* Watchlist/Eye */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-white rounded-full shadow-md hover:bg-[#D97706] hover:text-white transition-colors">
                    <Heart size={16} />
                  </button>

                  <button
                    onClick={() => setSelectedVehicle(vehicle)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-[#D97706] hover:text-white transition-colors">
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              {/* Middle & Bottom Info (Same as your original code) */}
              <div className="p-5">

                {/* name */}
                <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                  {vehicle.name}
                </h3>

                {/* year */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-lg text-gray-600">
                    {vehicle.year}
                  </span>

                  <span className="text-xs text-gray-400">
                    Auction Vehicle
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">

                    {/* curr bid */}
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Current Bid</p>
                      <p className="text-xl font-bold text-[#D97706]">{vehicle.bid || vehicle.soldPrice}</p>
                    </div>

                    {/* tym left */}
                    {vehicle.status === 'live' && (
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Time Left</p>
                        <div className="flex items-center gap-1 text-[#D97706]"><Clock size={14} /><span className="text-sm font-mono font-bold">{vehicle.timer}</span></div>
                      </div>
                    )}
                  </div>

                  {/* bid now btn */}
                  <button
                    onClick={() => navigate(`/vehicle-detail/${vehicle.id}`)}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-[#D97706] transition-all">
                    Bid Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* eye modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md">
          <div className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">

            {/* Close Button */}
            <button
              onClick={() => setSelectedVehicle(null)}
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
                    alt={selectedVehicle?.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white 
                    ${selectedVehicle.status === "live" ? "bg-[#D97706]" : "bg-gray-500"}`}>
                      {selectedVehicle.status === "live" ? "Live Auction" : "Sold"}
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
                  <h2 className="text-lg sm:text-xl font-bold text-[#0B1E3D] leading-tight">{selectedVehicle.name}</h2>
                  <p className="text-sm text-gray-500">{selectedVehicle.year} • {selectedVehicle.location}</p>
                </div>

                {selectedVehicle.status === "live" && (
                  <div className="bg-[#0B1E3D] text-white rounded-xl p-3 mb-4 flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-widest opacity-70">Time Remaining</p>
                    <div className="flex items-center gap-2 font-bold text-lg">
                      <Clock size={16} /> {selectedVehicle.timer}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { icon: Gauge, label: "Mileage", val: selectedVehicle.mileage || '---' },
                    { icon: Zap, label: "Engine", val: selectedVehicle.engine || '---' },
                    { icon: Fuel, label: "Fuel", val: selectedVehicle.fuelType || '---' },
                    { icon: MapPin, label: "Location", val: selectedVehicle.location || '---' }
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
                  <p className="text-xl font-bold">{selectedVehicle.bid}</p>
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
      )}
    </div>
  );
};

export default VehicleList;