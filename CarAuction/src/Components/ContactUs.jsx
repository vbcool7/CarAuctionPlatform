import React from 'react';
import Breadcrumbs from '../Components/Breadcrumbs';
import ContactMainImg from '../assets/Images/ContactMainImg.png';
import { Headset, Clock } from 'lucide-react';

function ContactUs() {
    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Contact Us', path: '/contact-us' }
    ];

    return (
        <section className='relative w-full flex items-center overflow-hidden'>
           
            <div className='absolute inset-0 z-0'>
                <img 
                    src={ContactMainImg} 
                    alt="Contact Us BidDrive" 
                    className='w-full h-full object-cover' 
                />
                
            </div>

            {/* Content Overlay */}
            <div className='relative z-10 max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 w-full py-3'>
                <div className='flex flex-col lg:flex-row items-center justify-between gap-12'>
                    
                    {/* Content */}
                    <div className='flex-1'>
                        <div className='mb-6'>
                            <Breadcrumbs items={breadcrumbItems} />
                        </div>

                        <h1 className="text-5xl font-bold text-[#0B1E3D] mb-4">Contact Us</h1>
                        <h3 className="text-xl font-semibold text-[#D97706] mb-4">We're here to help!</h3>
                        <p className="text-slate-700 text-md mb-8 max-w-lg">
                            Have a question or need assistance? Our team is ready to help you with anything you need.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[#0B1E3D]/10 rounded-xl text-[#D97706]">
                                    <Headset size={28} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#0B1E3D]">Quick Support</h4>
                                    <p className="text-slate-600 text-sm">Get fast and helpful responses from our team.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[#0B1E3D]/10 rounded-xl text-[#D97706]">
                                    <Clock size={28} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#0B1E3D]">We're Here for You</h4>
                                    <p className="text-slate-600 text-sm">Available 7 days a week to assist you.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ContactUs;