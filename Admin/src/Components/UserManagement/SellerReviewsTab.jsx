
import React from "react";
import {
  Star,
  Car,
  Headset,
  MessageCircle,
  Truck,
  BadgeDollarSign,
  MoreVertical,
} from "lucide-react";

const ratingBreakdown = [
  { star: 5, count: 101, percent: 79 },
  { star: 4, count: 18, percent: 14 },
  { star: 3, count: 6, percent: 5 },
  { star: 2, count: 2, percent: 2 },
  { star: 1, count: 1, percent: 1 },
];

const categoryRatings = [
  {
    title: "Vehicle Quality",
    rating: 4.7,
    icon: Car,
  },
  {
    title: "Customer Service",
    rating: 4.8,
    icon: Headset,
  },
  {
    title: "Communication",
    rating: 4.8,
    icon: MessageCircle,
  },
  {
    title: "Shipping & Delivery",
    rating: 4.6,
    icon: Truck,
  },
  {
    title: "Value for Money",
    rating: 4.6,
    icon: BadgeDollarSign,
  },
];

const reviews = [
  {
    id: 1,
    initials: "AB",
    bg: "bg-green-100",
    color: "text-green-700",
    name: "Ali Bin Rashid",
    verified: true,
    date: "May 13, 2024",
    rating: 5,
    review:
      "Excellent experience! The car was exactly as described. Smooth transaction and great communication. Highly recommended.",
    vehicle:
      "Toyota Land Cruiser 2021 (LST-12579)",
    listing: "LST-12579",
  },
  {
    id: 2,
    initials: "MS",
    bg: "bg-indigo-100",
    color: "text-indigo-700",
    name: "Mohammed Saleh",
    verified: true,
    date: "May 12, 2024",
    rating: 4,
    review:
      "Good condition vehicle and fast response from the seller. Very professional.",
    vehicle: "BMW 530i 2022 (LST-12578)",
    listing: "LST-12578",
  },
  {
    id: 3,
    initials: "SR",
    bg: "bg-amber-100",
    color: "text-amber-700",
    name: "Sara Rahman",
    verified: true,
    date: "May 11, 2024",
    rating: 5,
    review:
      "Amazing service and very helpful staff. The car was delivered on time and in perfect condition.",
    vehicle: "Audi A7 Sportback 2021 (LST-12577)",
    listing: "LST-12577",
  },
];

function SellerReviewsTab() {
  return (
    <div className="space-y-6">

      {/* Reviews Summary */}
      <div className="bg-white ">

        {/* Header */}
        <div className="flex items-center justify-between py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-[#0B1E3D]">
            Reviews & Ratings
          </h2>


          <div>
            <select className="h-8 px-3 rounded-xl border border-slate-200 text-[12px] font-semibold bg-white text-slate-700 outline-none focus:border-gray-300 transition-colors cursor-pointer appearance-none">
              <option value="this-month">Most Recent</option>
              <option value="last-month">Older</option>
            </select>
          </div>
        </div>

        {/* rating section */}
        <div className="flex flex-col gap-8 p-6">

          {/* 1st sec */}
          <div className="flex flex-col items-center justify-center border-b border-slate-200 pb-6">
            <h1 className="text-4xl font-bold text-[#0B1E3D]">4.8</h1>
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="mt-2 text-sm text-slate-500 font-medium">Based on 128 reviews</p>
          </div>

          {/* 2nd sec */}
          <div className="space-y-3">
            {ratingBreakdown.map((item) => (
              <div key={item.star} className="grid grid-cols-[60px_1fr_60px] items-center gap-3">
                <span className="text-sm font-medium text-slate-700">{item.star} Stars</span>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-green-600" style={{ width: `${item.percent}%` }} />
                </div>
                <span className="text-xs text-slate-500 text-right">{item.count}</span>
              </div>
            ))}
          </div>

          {/* 3rd sec */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            {categoryRatings.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Icon size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-600">{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#0B1E3D]">{item.rating}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Reviews List */}
      <div className="bg-white overflow-hidden">
        {reviews.map((review, index) => (
          <div
            key={review.id}
            className={`py-5 ${index !== reviews.length - 1
              ? "border-b border-slate-100"
              : ""
              }`}
          >
            <div className="flex items-start justify-between gap-4">

              {/* Left */}
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 
                  ${review.bg} ${review.color}`}
                >
                  {review.initials}
                </div>

                {/* Content */}
                <div className="flex-1">

                  {/* Name */}
                  <div className="flex flex-wrap items-center gap-3">

                    <h3 className="font-semibold text-[#0B1E3D]">
                      {review.name}
                    </h3>

                    {review.verified && (
                      <span className="px-2 py-0.5 rounded-md bg-green-100 text-green-700 text-xs">
                        Verified Buyer
                      </span>
                    )}

                  </div>

                  {/* Rating + Date */}
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <div className="flex">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className="fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>

                    <span className="text-xs text-slate-500">
                      {review.date}
                    </span>

                  </div>

                  {/* Review */}
                  <p className="mt-3 text-[13px] leading-5 text-slate-600">
                    {review.review}
                  </p>

                  {/* Vehicle */}
                  <p className="mt-3 text-sm">
                    <span className="font-semibold text-[#0B1E3D]">
                      Vehicle:
                    </span>{" "}
                    <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                      {review.vehicle}
                    </span>
                  </p>

                </div>

              </div>

              {/* Right */}
              <div className="flex items-start gap-3 shrink-0">

                <span className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-[11px] font-semibold whitespace-nowrap">
                  Listing: {review.listing}
                </span>

                <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-600 transition ">
                  <MoreVertical size={16} />
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default SellerReviewsTab;