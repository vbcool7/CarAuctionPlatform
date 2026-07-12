import React from 'react';
import { Flag, Users, Car, Globe, TrendingUp, Trophy } from 'lucide-react';

function AboutOurStory() {
  const storyEvents = [
    { year: "2019", desc: "AutoBid was founded in Dubai, UAE.", icon: Flag, bg: "bg-blue-50", color: "text-blue-600" },
    { year: "2020", desc: "Launched our platform with the first online auctions.", icon: Users, bg: "bg-green-50", color: "text-green-600" },
    { year: "2021", desc: "Expanded to more categories and partnered with trusted inspection centers.", icon: Car, bg: "bg-purple-50", color: "text-purple-600" },
    { year: "2022", desc: "Grew internationally and served customers across the GCC.", icon: Globe, bg: "bg-orange-50", color: "text-orange-600" },
    { year: "2023", desc: "Reached 10,000+ auctions and 20,000+ happy customers.", icon: TrendingUp, bg: "bg-sky-50", color: "text-sky-600" },
    { year: "2024 & Beyond", desc: "Continuing to innovate and deliver the best auction experience.", icon: Trophy, bg: "bg-emerald-50", color: "text-emerald-600" },
  ];

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
        
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#0B1E3D] mb-4">Our Story</h2>
          <p className="text-slate-600  font-medium max-w-2xl text-[15px]">
            AutoBid was founded with a simple idea - to create a better way to buy and sell cars online. 
            From a small team with a big vision to the region's leading car auction platform.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 relative">
          {storyEvents.map((event, index) => (
            <div key={index} className="flex flex-col items-center text-center relative">
              
              {/* Icon Circle */}
              <div className={`w-16 h-16 rounded-full ${event.bg} flex items-center justify-center mb-6 z-10`}>
                <event.icon size={28} className={event.color} />
              </div>

              {/* Text */}
              <h3 className="font-bold text-[#0B1E3D] mb-2">{event.year}</h3>
              <p className="text-sm text-slate-600 leading-relaxed px-1">{event.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutOurStory;