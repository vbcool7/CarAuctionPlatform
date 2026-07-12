import React from 'react';
import { Star, Pencil, ShieldCheck, Bell, Shield, Wallet, Car } from 'lucide-react';

const reviews = [
  {
    name: 'Mohammed Al Zaabi',
    initials: 'MA',
    rating: 5,
    date: 'May 18, 2024',
    text: 'Excellent experience! The car was exactly as described and the dealer was very professional and transparent throughout the process.',
    car: '2024 BMW X5 xDrive40i',
    bg: 'bg-[#0B1E3D]',
    color: 'text-white',
  },
  {
    name: 'Sarah Rahman',
    initials: 'SR',
    rating: 4,
    date: 'May 16, 2024',
    text: 'Great service and fast response. Very happy with my purchase. Would definitely buy again.',
    car: 'Mercedes-Benz C300',
    bg: 'bg-amber-100',
    color: 'text-amber-700',
  },
  {
    name: 'Ahmed Khan',
    initials: 'AK',
    rating: 5,
    date: 'May 15, 2024',
    text: 'Smooth transaction and helpful staff. Highly recommended dealer!',
    car: 'Toyota Land Cruiser GXR',
    bg: 'bg-slate-200',
    color: 'text-slate-700',
  },
  {
    name: 'David Lee',
    initials: 'DL',
    rating: 4,
    date: 'May 12, 2024',
    text: 'Good selection of vehicles and honest dealing. Minor delay in paperwork but overall a good experience.',
    car: 'Range Rover Vogue',
    bg: 'bg-amber-600',
    color: 'text-white',
  },
];

const starCounts = { 5: 98, 4: 22, 3: 6, 2: 1, 1: 1 };
const total = Object.values(starCounts).reduce((a, b) => a + b, 0);

const ratingHighlights = [
  { label: 'Vehicle Quality', icon: <ShieldCheck size={16} />, rating: 4.8 },
  { label: 'Customer Service', icon: <Bell size={16} />, rating: 4.8 },
  { label: 'Transparency', icon: <Shield size={16} />, rating: 4.7 },
  { label: 'Value for Money', icon: <Wallet size={16} />, rating: 4.7 },
  { label: 'Delivery Process', icon: <Car size={16} />, rating: 4.8 },
];

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}
        />
      ))}
    </div>
  );
}

function SellerReviews() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 pb-6">

      {/* left side */}
      <div className="lg:col-span-3">
        <h2 className="font-bold text-base text-[#0B1E3D] mb-2">
          Overall Rating
        </h2>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-4xl font-extrabold text-[#0B1E3D]">4.8</span>
          <Star size={28} className="text-amber-400 fill-amber-400" />
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Based on 128 reviews
        </p>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(star => (
            <div
              key={star}
              className="flex items-center gap-2 text-xs">
              <span className="w-10 text-slate-500">{star} Stars</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${(starCounts[star] / total) * 100}%` }}
                />
              </div>
              <span className="w-6 text-slate-400 text-right">{starCounts[star]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* middle side */}
      <div className="lg:col-span-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-base text-[#0B1E3D]">
            Recent Reviews
          </h2>
          <div className="flex gap-2 text-xs">
            <select className="border border-slate-200 px-2 py-1.5 rounded-lg text-slate-600 focus:outline-none">
              <option>All Ratings</option>
              <option>5 Stars</option>
              <option>4 Stars</option>
              <option>3 Stars</option>
            </select>
            <select className="border border-slate-200 px-2 py-1.5 rounded-lg text-slate-600 focus:outline-none">
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>
          </div>
        </div>

        <div className="space-y-0">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className="border-b border-slate-100 py-5">
              <div className="flex items-start gap-3 mb-2">
                <div className={`w-9 h-9 ${rev.bg} ${rev.color} rounded-full flex items-center justify-center font-bold text-xs shrink-0`}>
                  {rev.initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-[#0B1E3D]">
                        {rev.name}
                      </p>
                      <span className="text-[10px] bg-green-50 text-green-600 border border-green-200 px-1.5 py-0.5 rounded-full">
                        Verified Buyer
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{rev.date}</span>
                  </div>
                  <StarRow rating={rev.rating} />
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-1.5 ml-12">{rev.text}</p>
              <p className="text-xs text-slate-400 ml-12">{rev.car}</p>
            </div>
          ))}
        </div>
      </div>

      {/* right */}
      <div className="lg:col-span-3 space-y-4">

        {/* Share Experience */}
        <div className="p-5 border border-slate-100 rounded-2xl shadow-sm bg-white">
          <h3 className="font-bold text-sm text-[#0B1E3D] mb-1">Share Your Experience</h3>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Bought a car from Al Yousuf Motors? Share your experience to help others.
          </p>
          <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-amber-400 text-[#D97706] rounded-xl font-semibold text-sm hover:bg-amber-50 transition-all">
            <Pencil size={14} /> Write a Review
          </button>
        </div>

        {/* Rating Highlights */}
        <div className="px-3 py-4 border border-slate-100 rounded-2xl shadow-sm bg-white">
          <h3 className="font-bold text-sm text-[#0B1E3D] mb-4">Rating Highlights</h3>
          <div className="space-y-3.5">
            {ratingHighlights.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  {item.icon}
                  <span className="text-xs font-medium text-slate-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <StarRow rating={Math.floor(item.rating)} />
                  <span className="font-bold text-xs text-[#0B1E3D]">{item.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How Reviews Work */}
        <div className="p-5 border border-slate-100 rounded-2xl shadow-sm bg-white">
          <h3 className="font-bold text-sm text-[#0B1E3D] mb-1">How Reviews Work</h3>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            Reviews come from verified buyers who have purchased vehicles from this dealer.
          </p>
          <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2.5 rounded-xl border border-green-100 text-xs font-semibold">
            <ShieldCheck size={15} /> Verified reviews only
          </div>
        </div>

      </div>
    </div>
  );
}

export default SellerReviews;