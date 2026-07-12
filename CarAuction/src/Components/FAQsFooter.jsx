
import React from 'react';
import { Headset, MessageSquare } from 'lucide-react';

function FAQsFooter() {
  return (
    <section className="w-full py-8 bg-[#0B1E3D] ">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
        
        <div className="py-4 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          
          {/* Left Content */}
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white">
              <Headset size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Can't find what you're looking for?</h2>
              <p className="text-slate-300 text-sm">
                Our support team is ready to help you with any other questions you may have.
              </p>
            </div>
          </div>

          {/* Action Buttons with #D97706 color */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button className="px-6 py-3 rounded-xl font-semibold border border-white text-white hover:bg-white/10 transition flex items-center justify-center gap-2">
              <Headset size={18} />
              Contact Support
            </button>
            
            <button className="bg-[#D97706] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#b86405] transition flex items-center justify-center gap-2">
              <MessageSquare size={18} />
              Live Chat
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

export default FAQsFooter;