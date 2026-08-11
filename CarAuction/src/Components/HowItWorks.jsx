
import React from 'react';
import Breadcrumbs from './Breadcrumbs';
import WorkMainImg from '../assets/Images/WorkMainImg.png';
import WorkImg1 from '../assets/Images/WorkImg1.jpg'
import WorkImg2 from '../assets/Images/WorkImg2.png'
import WorkImg3 from '../assets/Images/WorkImg3.png'
import { IoIosArrowRoundForward } from "react-icons/io";
import { Search, Gavel, ClipboardCheck, FileText, Truck, CheckCircle } from 'lucide-react';
import { Lock, Car, Tag, Headset, Trophy, ArrowRight } from 'lucide-react';

const steps = [
    { id: 1, icon: Search, title: "Browse & Find", desc: "Explore thousands of vehicles and find the perfect one.", bg: "bg-blue-50", color: "text-blue-600" },
    { id: 2, icon: Gavel, title: "Bid & Win", desc: "Place your bids and win the auction at the best price.", bg: "bg-green-50", color: "text-green-600" },
    { id: 3, icon: ClipboardCheck, title: "Complete Payment", desc: "Securely complete your payment through our trusted systems.", bg: "bg-purple-50", color: "text-purple-600" },
    { id: 4, icon: FileText, title: "Vehicle Processing", desc: "We verify your payment and prepare your vehicle for delivery.", bg: "bg-orange-50", color: "text-orange-600" },
    { id: 5, icon: Truck, title: "Delivery or Pickup", desc: "Choose home delivery or pick up your vehicle from our location.", bg: "bg-sky-50", color: "text-sky-600" },
    { id: 6, icon: CheckCircle, title: "Enjoy Your Car", desc: "Take ownership and enjoy your new vehicle with confidence.", bg: "bg-emerald-50", color: "text-emerald-600" },
];

const stepsData = [
    {
        step: "Step 01",
        title: "Browse & Find",
        desc: "Search from a wide range of vehicles using filters like make, model, price, year and more. View detailed information, photos, and condition reports to make an informed decision.",
        image: WorkImg1
    },
    {
        step: "Step 02",
        title: "Bid & Win",
        desc: "Join live auctions or place pre-bids. Compete with other buyers and win the vehicle at the best possible price. You'll be notified instantly when you win.",
        image: WorkImg2
    },
    {
        step: "Step 03",
        title: "Complete Payment",
        desc: "Make a secure payment using our trusted payment methods. Your payment information is encrypted and protected with 256-bit SSL security.",
        image: WorkImg3
    },
    {
        step: "Step 04",
        title: "Vehicle Processing",
        desc: "Search from a wide range of vehicles using filters like make, model, price, year and more. View detailed information, photos, and condition reports to make an informed decision.",
        image: WorkImg1
    },
    {
        step: "Step 05",
        title: "Delivery or Pickup",
        desc: "Join live auctions or place pre-bids. Compete with other buyers and win the vehicle at the best possible price. You'll be notified instantly when you win.",
        image: WorkImg2
    },
    {
        step: "Step 06",
        title: "Enjoy Your Car",
        desc: "Make a secure payment using our trusted payment methods. Your payment information is encrypted and protected with 256-bit SSL security.",
        image: WorkImg3
    }
];

const features = [
    { icon: Gavel, title: "Trusted Platform", desc: "Transparent auctions and verified vehicles." },
    { icon: Lock, title: "Secure Payments", desc: "100% safe and secure payment processing." },
    { icon: Car, title: "Wide Selection", desc: "Thousands of vehicles across all categories." },
    { icon: Tag, title: "Best Deals", desc: "Competitive prices and great savings." },
    { icon: Headset, title: "Customer Support", desc: "24/7 support to assist you at every step." },
];

function HowItWorks() {

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'How It Works', path: '/how-it-work' }
    ];

    return (
        <section>
            {/* top section */}
            <div className='relative w-full'>

                <img
                    src={WorkMainImg}
                    alt="How it works"
                    className='h-full w-full object-cover'
                />

                <div className='absolute inset-0 z-10 flex items-center'>
                    <div className='max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 w-full'>

                        <div className='mb-2'>
                            <Breadcrumbs items={breadcrumbItems} />
                        </div>

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
                                <button className='bg-[#D97706] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2  transition-all duration-300 ease-out hover:scale-102 hover:bg-[#b46205] active:scale-95'>
                                    Browse Auctions <IoIosArrowRoundForward />
                                </button>

                                <button className='border border-[#D97706] text-[#D97706] px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 ease-out  hover:scale-102 hover:bg-[#D97706] hover:text-white  active:scale-95'>
                                    Sell Your Car <IoIosArrowRoundForward />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">

                    {/* 6-Step Process */}
                    <div className='py-16'>
                        <h2 className="text-3xl font-bold text-center text-[#0B1E3D] mb-16">
                            The Simple <span className="text-[#D97706]">6-Step</span> Process
                        </h2>

                        {/* Steps Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
                            {steps.map((step) => (
                                <div key={step.id} className="flex flex-col items-center text-center group">
                                    <div className="relative mb-10">

                                        {/* Colorful Circle Background */}
                                        <div className={`w-20 h-20 rounded-full ${step.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                                            <step.icon size={32} className={`${step.color}`} />
                                        </div>

                                        {/* Step Number Badge */}
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#D97706] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                            {step.id}
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-[#0B1E3D] mb-2">{step.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed px-2">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detailed Process */}
                    <div className='py-16'>
                        <h2 className="text-3xl font-bold text-center text-[#0B1E3D] mb-16">
                            Detailed Process
                        </h2>

                        <div className="space-y-12">
                            {stepsData.map((item, index) => (
                                <div
                                    key={index}
                                    className={`flex flex-col md:flex-row items-center gap-8 bg-white  
                ${index % 2 !== 0 ? "md:flex-row-reverse" : ""
                                        }`}
                                >
                                    {/* Image Section */}
                                    <div className="w-full md:w-1/2 h-50 overflow-hidden rounded-xl shadow-lg">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Text Section */}
                                    <div className="w-full md:w-1/2 space-y-3 p-2 border border-gray-100 rounded-xl shadow-md hover:shadow-lg">
                                        <span className="text-[#D97706] font-semibold tracking-wide text-sm">{item.step}</span>
                                        <h3 className="text-2xl font-bold text-[#0B1E3D]">{item.title}</h3>
                                        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* why choose */}
                    <div className='py-16'>
                        <h2 className="text-3xl font-bold text-center text-[#0B1E3D] mb-16">
                            Why Choose BidDrive?
                        </h2>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                            {features.map((item, index) => (
                                <div key={index} className="flex flex-col items-center text-center group">

                                    <div className="w-20 h-20 rounded-full bg-[#D97706]/10 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#D97706]">
                                        <item.icon size={32} className="text-[#D97706] group-hover:text-white transition-colors duration-300" />
                                    </div>

                                    {/* Text Content */}
                                    <h3 className="font-bold text-[#0B1E3D] mb-1">{item.title}</h3>
                                    <p className="text-sm text-slate-500 leading-tight">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* footer */}
            <div className="w-full py-6 bg-[#0B1E3D]">
                <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 border border-[#0B1E3D]/10">

                        {/* Left: Icon and Text */}
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-gray-600 rounded-2xl flex items-center justify-center shadow-sm">
                                <Trophy size={40} className="text-[#D97706]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Ready to get started?
                                </h2>
                                <p className="text-gray-400 text-base ">
                                    Join thousands of happy customers buying and selling cars on AutoBid.
                                </p>
                            </div>
                        </div>

                        {/* Right: Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">

                            <button className="bg-[#D97706] text-white px-8 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#b46205] transition-all">
                                Browse Auctions <ArrowRight size={20} />
                            </button>

                            <button className="bg-transparent border-2 border-[#D97706] text-[#D97706] px-8 py-2 rounded-xl font-semibold hover:bg-[#D97706] hover:text-white transition-all">
                                Sell Your Car
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorks;