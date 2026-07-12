import React from 'react';
import { User, Mail, Phone, BookOpen, MessageSquare, MapPin, ParkingCircle, Lock } from 'lucide-react';

function ContactForm() {
    return (
        <section className="w-full py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 flex flex-col md:flex-row gap-8">

                {/* Form Section */}
                <div className='w-full md:w-1/2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm'>
                    <h2 className="text-2xl font-bold text-[#0B1E3D] mb-6">
                        Send Us a Message
                    </h2>

                    <form className="space-y-4">

                        <div className="relative">
                            <User className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input type="text" placeholder="Full Name" className="w-full pl-10 p-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#D97706] outline-none" />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input type="email" placeholder="Email Address" className="w-full pl-10 p-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#D97706] outline-none" />
                        </div>

                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input type="tel" placeholder="Phone Number" className="w-full pl-10 p-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#D97706] outline-none" />
                        </div>

                        <div className="relative">
                            <BookOpen className="absolute left-3 top-3 text-slate-400" size={18} />
                            <select className="w-full pl-10 p-2.5 border border-gray-400 rounded-lg text-slate-500 focus:ring-2 focus:ring-[#D97706] outline-none">
                                <option>Subject</option>
                            </select>
                        </div>

                        <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 text-slate-400" size={18} />
                            <textarea placeholder="Your Message" rows="4" className="w-full pl-10 p-2.5 border border-gray-400 rounded-lg focus:ring-2 focus:ring-[#D97706] outline-none resize-none"></textarea>
                        </div>

                        <label className="flex items-center gap-2 text-sm text-slate-600">
                            <input type="checkbox" className="accent-[#D97706]" /> I agree to the <span className="text-[#D97706] font-semibold">Privacy Policy</span>
                        </label>

                        <button className="w-full bg-[#0B1E3D] text-white py-3 rounded-lg font-semibold hover:bg-[#0B1E3D]/90 transition flex items-center justify-center gap-2">
                            Send Message →
                        </button>
                    </form>

                    <p className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-4">
                        <Lock size={12} /> Your information is safe with us and will never be shared.
                    </p>
                </div>

                {/* Map & Office Info Section */}
                <div className='w-full md:w-1/2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col'>
                    <h2 className="text-2xl font-bold text-[#0B1E3D] p-8 pb-4">Our Headquarters</h2>
                    <div className="h-64 bg-slate-200 w-full relative">
                        {/* Replace this div with your actual Map component */}
                        <div className="absolute inset-0 flex items-center justify-center text-slate-500">Google Maps Placeholder</div>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="flex gap-4">
                            <MapPin className="text-[#D97706] shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-[#0B1E3D]">AutoBid Car Auctions FZ-LLC</h4>
                                <p className="text-slate-600 text-sm">Business Bay, Dubai, United Arab Emirates</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <ParkingCircle className="text-[#D97706] shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-[#0B1E3D]">Free Parking Available</h4>
                                <p className="text-slate-600 text-sm">Visitor parking is available at our office.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ContactForm;