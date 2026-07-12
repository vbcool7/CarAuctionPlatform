
import React, { useState } from 'react';
import { Car, ShieldCheck, MapPin } from 'lucide-react';
import SellerShopImage from '../../../assets/Images/SellerShopImage.png';
import SellerAbout from './SellerAbout';
import SellerInventory from './SellerInventory';
import SellerReviews from './SellerReviews';
import SellerPolicies from './SellerPolicies';

function SellerProfilePage({ sellerId, setCurrentPage, previousPage, setSelectedVehicleId }) {

    const [activeTab, setActiveTab] = useState('about');
    const [fullPage, setFullPage] = useState(null);

    const tabs = [
        { key: 'about', label: 'About' },
        { key: 'inventory', label: 'Vehicle Inventory' },
        { key: 'reviews', label: 'Reviews' },
        { key: 'policies', label: 'Policies' },
    ];

    return (
        <div className="">

            {/* heading */}
            <div className='mb-4'>
                <button
                    onClick={() => setCurrentPage(previousPage)}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0B1E3D] mb-2 transition-colors"
                >
                    ← Back
                </button>

                <h1 className="text-2xl font-bold text-[#0B1E3D]">
                    Seller Profile
                </h1>
            </div>

            {/* seller content */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">

                {/* Left Side: Profile Details */}
                <div className="p-6 md:w-1/2 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#0B1E3D] text-white flex items-center justify-center rounded-full font-bold text-2xl">
                            AA
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                Al Yousuf Motors
                                <span className="text-[10px] bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full uppercase">Verified Dealer</span>
                            </h1>
                            <div className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                                <span className="text-amber-500 font-bold">★ 4.8</span> (128 Reviews) | Member Since Jan 2022
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500 leading-relaxed">
                        Trusted automotive dealer with a wide range of quality vehicles.
                        Specializing in premium pre-owned cars with excellent condition and verified history.
                    </p>

                    <div className="flex items-center gap-6 mt-2">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-slate-50 rounded-lg text-[#0B1E3D]">
                                <Car size={18} className='text-[#D97706]' />
                            </div>
                            <div>
                                <p className="font-bold text-sm">245</p>
                                <p className="text-[10px] text-slate-500 uppercase">Total Vehicles</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-slate-50 rounded-lg text-[#0B1E3D]">
                                <ShieldCheck size={18} className='text-[#D97706]' />
                            </div>
                            <div>
                                <p className="font-bold text-sm">92%</p>
                                <p className="text-[10px] text-slate-500 uppercase">Response Rate</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-slate-50 rounded-lg text-[#0B1E3D]">
                                <MapPin size={18} className='text-[#D97706]' />
                            </div>
                            <div>
                                <p className="font-bold text-sm">UAE</p>
                                <p className="text-[10px] text-slate-500 uppercase">Location</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Image */}
                <div className="md:w-1/2 h-64 md:h-auto">
                    <img
                        src={SellerShopImage}
                        alt="Al Yousuf Motors Showroom"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-slate-200 mt-6">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`pb-2.5 text-sm font-medium transition-colors ${activeTab === tab.key
                            ? 'text-[#D97706] border-b-2 border-[#D97706]'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'about' && <SellerAbout />}
            {activeTab === 'inventory' && <SellerInventory setCurrentPage={setCurrentPage} setSelectedVehicleId={setSelectedVehicleId}/>}
            {activeTab === 'reviews' && <SellerReviews />}
            {activeTab === 'policies' && <SellerPolicies />}
        </div>
    );
}

export default SellerProfilePage;