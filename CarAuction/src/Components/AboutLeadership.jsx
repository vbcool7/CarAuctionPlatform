
import React from 'react';
import { FaLinkedinIn } from "react-icons/fa";


function AboutLeadership() {
  const team = [
    { name: "Omar Al Mansoori", role: "CEO & Co-Founder", bio: "Over 15 years of experience in automotive and digital marketplaces.", img: 'https://img.magnific.com/free-photo/cheerful-indian-businessman-smiling-closeup-portrait-jobs-career-campaign_53876-129417.jpg?semt=ais_hybrid&w=740&q=80' },
    { name: "Sara Al Zaabi", role: "COO", bio: "Operations leader with expertise in scaling platforms and customer experience.", img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTivbsbyo8aPjn7FjlLmMFb8otwI7Zg4s1jgA&s' },
    { name: "Michael Johnson", role: "CTO", bio: "Tech enthusiast focused on building secure and scalable digital solutions.", img: 'https://img.magnific.com/free-photo/cheerful-indian-businessman-smiling-closeup-portrait-jobs-career-campaign_53876-129417.jpg?semt=ais_hybrid&w=740&q=80' },
    { name: "Khaled Hassan", role: "Head of Sales", bio: "Automotive industry expert passionate about building strong partnerships.", img: 'https://img.magnific.com/free-photo/cheerful-indian-businessman-smiling-closeup-portrait-jobs-career-campaign_53876-129417.jpg?semt=ais_hybrid&w=740&q=80' },
  ];

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
        
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#0B1E3D] mb-2">Leadership Team</h2>
          <p className="text-slate-600  font-medium max-w-2xl text-[15px]">
            Meet the experienced team behind AutoBid's success.
            </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <div key={index} className="p-4 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
              {/* Image & LinkedIn */}
              <div className="relative mb-4">
                <img src={member.img} alt={member.name} className="w-full h-48 object-cover rounded-xl" />
                <a href="#" className="absolute top-2 right-2 bg-blue-600 p-1.5 rounded text-white hover:bg-blue-700">
                  <FaLinkedinIn size={16} />
                </a>
              </div>

              {/* Info */}
              <h3 className="font-bold text-[#0B1E3D] mb-1">{member.name}</h3>
              <p className="text-sm font-semibold text-blue-600 mb-2">{member.role}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutLeadership;