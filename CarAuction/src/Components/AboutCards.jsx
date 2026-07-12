import React from 'react';
import { Target, Eye, Gem, CheckCircle2 } from 'lucide-react';

function AboutCards() {
  const cards = [
    {
      title: "Our Mission",
      desc: "To simplify the car buying and selling process by providing a transparent, secure, and innovative auction platform that delivers maximum value to our customers.",
      icon: Target,
      bg: "bg-blue-50",
      color: "text-blue-600"
    },
    {
      title: "Our Vision",
      desc: "To become the most trusted and preferred online car auction platform in the region, setting new standards for transparency, trust, and customer satisfaction.",
      icon: Eye,
      bg: "bg-green-50",
      color: "text-green-600"
    },
    {
      title: "Our Values",
      list: ["Transparency in Everything We Do", "Customer First Approach", "Integrity and Fairness", "Innovation and Excellence"],
      icon: Gem,
      bg: "bg-purple-50",
      color: "text-purple-600"
    }
  ];

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="p-4 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex gap-5"
            >
              {/* Column 1 - Icon */}
              <div className="shrink-0">
                <div
                  className={`w-14 h-14 rounded-full ${card.bg} flex items-center justify-center`}
                >
                  <card.icon size={28} className={card.color} />
                </div>
              </div>

              {/* Column 2 - Content */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#0B1E3D] mb-4">
                  {card.title}
                </h3>

                {card.list ? (
                  <ul className="space-y-3">
                    {card.list.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-slate-600"
                      >
                        <CheckCircle2
                          size={18}
                          className="text-blue-600 shrink-0"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-600 leading-relaxed">
                    {card.desc}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutCards;