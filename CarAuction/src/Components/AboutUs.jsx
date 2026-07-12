
import React from 'react';
import { IoIosArrowRoundForward } from "react-icons/io";
import Breadcrumbs from '../Components/Breadcrumbs';
import AboutMainImg from '../assets/Images/AboutMainImg.png'; 

function AboutUs() {

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'About Us', path: '/about-us' }
    ];

    return (
        <section className='relative w-full'>

            {/* Background Image */}
            <img
                src={AboutMainImg}
                alt="About AutoBid"
                className='h-full w-full object-cover'
            />

            {/* Overlay Content */}
            <div className='absolute inset-0 z-10 flex items-center bg-white/10'>
                <div className='max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 w-full'>

                    {/* Breadcrumbs */}
                    <div className='mb-4'>
                        <Breadcrumbs items={breadcrumbItems} />
                    </div>

                    {/* Main Text Content */}
                    <div className='max-w-xl'>
                        <h1 className='text-4xl md:text-5xl font-bold text-[#0B1E3D] mb-4'>
                            About BidDrive
                        </h1>

                        {/* Subtitle with Orange accent */}
                        <p className='text-[#D97706] font-semibold text-lg mb-4'>
                            The Middle East's Most Trusted Online Car Auction Platform
                        </p>

                        <p className='text-slate-700 text-base md:text-md mb-8 leading-relaxed'>
                            At BidDrive, we make buying and selling cars simple, transparent, and rewarding.
                            Our platform connects thousands of verified buyers and sellers across the UAE
                            and beyond through secure auctions and innovative technology.
                        </p>

                        {/* Button */}
                        <div className='flex'>
                            <button className='bg-[#D97706] text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 
                                transition-all duration-300 ease-out 
                                hover:scale-105 hover:bg-[#b46205] 
                                active:scale-95 shadow-lg'>
                                Explore Auctions <IoIosArrowRoundForward size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutUs;