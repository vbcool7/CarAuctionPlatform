
import React from 'react';
import { IoIosArrowRoundForward } from "react-icons/io";
import Breadcrumbs from '../Components/Breadcrumbs';
import WorkMainImg from '../assets/Images/WorkMainImg.png';

function HowWorks() {

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'How It Works', path: '/how-it-work' }
    ];

    return (
        <section className='relative w-full'>

            <img
                src={WorkMainImg}
                alt="How it works"
                className='h-full w-full object-cover'
            />

            <div className='absolute inset-0 z-10 flex items-center'>
                <div className='max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 w-full'>

                    {/* Breadcrumbs */}
                    <div className='mb-2'>
                        <Breadcrumbs items={breadcrumbItems} />
                    </div>

                    {/* Main Text Content */}
                    <div className='max-w-xl'>
                        <h1 className='text-5xl font-bold text-[#0B1E3D] mb-3'>
                            How It Works
                        </h1>
                        <p className='text-slate-600 text-md mb-6'>
                            Buying or selling a car on BidDrive is simple, transparent and secure.<br />
                            Follow these steps to get started.
                        </p>

                        {/* Buttons */}
                        <div className='flex gap-4'>
                            {/* Browse Auctions Button */}
                            <button className='bg-[#D97706] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 
        transition-all duration-300 ease-out 
        hover:scale-102 hover:bg-[#b46205] 
        active:scale-95'>
                                Browse Auctions <IoIosArrowRoundForward />
                            </button>

                            {/* Sell Your Car Button */}
                            <button className='border border-[#D97706] text-[#D97706] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 
        transition-all duration-300 ease-out 
        hover:scale-102 hover:bg-[#D97706] hover:text-white 
        active:scale-95'>
                                Sell Your Car <IoIosArrowRoundForward />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowWorks;