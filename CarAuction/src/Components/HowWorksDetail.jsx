
import React from 'react';
import WorkImg1 from '../assets/Images/WorkImg1.jpg'
import WorkImg2 from '../assets/Images/WorkImg2.png'
import WorkImg3 from '../assets/Images/WorkImg3.png'

const stepsData = [
  {
    step: "Step 01",
    title: "Browse & Find",
    desc: "Search from a wide range of vehicles using filters like make, model, price, year and more. View detailed information, photos, and condition reports to make an informed decision.",
    image: WorkImg1
  },
  {
    step: "Step 02",
    title: "Bid & Win",
    desc: "Join live auctions or place pre-bids. Compete with other buyers and win the vehicle at the best possible price. You'll be notified instantly when you win.",
    image: WorkImg2
  },
  {
    step: "Step 03",
    title: "Complete Payment",
    desc: "Make a secure payment using our trusted payment methods. Your payment information is encrypted and protected with 256-bit SSL security.",
    image: WorkImg3
  },
  {
    step: "Step 04",
    title: "Vehicle Processing",
    desc: "Search from a wide range of vehicles using filters like make, model, price, year and more. View detailed information, photos, and condition reports to make an informed decision.",
    image: WorkImg1
  },
  {
    step: "Step 05",
    title: "Delivery or Pickup",
    desc: "Join live auctions or place pre-bids. Compete with other buyers and win the vehicle at the best possible price. You'll be notified instantly when you win.",
    image: WorkImg2
  },
  {
    step: "Step 06",
    title: "Enjoy Your Car",
    desc: "Make a secure payment using our trusted payment methods. Your payment information is encrypted and protected with 256-bit SSL security.",
    image: WorkImg3
  }
];

function HowWorksDetail() {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">

        <h2 className="text-3xl font-bold text-center text-[#0B1E3D] mb-16">
          Detailed Process
        </h2>

        <div className="space-y-12">
          {stepsData.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center gap-8 bg-white  
                ${index % 2 !== 0 ? "md:flex-row-reverse" : ""
                }`}
            >
              {/* Image Section */}
              <div className="w-full md:w-1/2 h-50 overflow-hidden rounded-xl shadow-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text Section */}
              <div className="w-full md:w-1/2 space-y-3 p-2 border border-gray-100 rounded-xl shadow-md hover:shadow-lg">
                <span className="text-[#D97706] font-semibold tracking-wide text-sm">{item.step}</span>
                <h3 className="text-2xl font-bold text-[#0B1E3D]">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowWorksDetail;