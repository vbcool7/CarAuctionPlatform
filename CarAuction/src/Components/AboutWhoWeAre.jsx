import React from 'react';
import AboutImg from '../assets/Images/AboutImg.png';
import { ArrowRight } from 'lucide-react';

function AboutWhoWeAre() {
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left: Text Content */}
          <div className="w-full lg:w-1/2 space-y-4">
            <h2 className="text-3xl font-bold text-[#0B1E3D]">Who We Are</h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                <span className='text-[#D97706] font-semibold'>BidDrive</span> is a leading online car auction platform in the Middle East, 
                dedicated to delivering a secure, reliable, and user-friendly 
                experience for car buyers and sellers.
              </p>
              <p>
                We leverage advanced technology and industry expertise to offer a 
                wide selection of quality vehicles, competitive prices, and 
                complete transparency at every step.
              </p>
            </div>
            
            <a href="#" className="inline-flex items-center gap-2 text-[#D97706] font-semibold hover:gap-3 transition-all">
              Learn More About Our Platform <ArrowRight size={18} />
            </a>
          </div>

          {/* Right: Image */}
          <div className="w-full lg:w-1/2">
            <img 
              src={AboutImg} 
              alt="AutoBid Office" 
              className="w-full h-auto rounded-xl shadow-lg object-cover" 
            />
          </div>

        </div>
      </div>
    </section>
  )
}

export default AboutWhoWeAre;