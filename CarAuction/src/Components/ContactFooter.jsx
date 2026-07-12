
import React from 'react';
import { Headset, MessageSquare } from 'lucide-react';

function ContactFooter() {
    return (
        <section className="w-full py-8 bg-[#0B1E3D]">
            <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">

                {/* Main Footer Container */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Left Content */}
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                            <Headset size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Still Need Help?</h2>
                            <p className="text-slate-300 text-sm">
                                Our support team is ready to assist you with any questions.
                            </p>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button className="bg-[#D97706] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#b86405] transition flex items-center justify-center gap-2 w-full md:w-auto">
                        <MessageSquare size={18} />
                        Start Live Chat
                    </button>

                </div>
            </div>
        </section>
    );
}

export default ContactFooter;