
import React, { useState } from 'react';
import { Heart, Eye, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { vehicles } from './Data';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import VehicleModal from './VehicleModal';
import { useNavigate, useParams } from 'react-router-dom';

function VehicleList({ category, status }) {

  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedVehicle, setSelectedVehicle] = useState(null);

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
      <VehicleModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />
    </div>
  );
};

export default VehicleList;