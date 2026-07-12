
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import BuyerCustomDropdown from '../BuyerSharedComponents/BuyerCustomDropdown';

function BuyerSupportRequestCall({ setSupportPage }) {

    const [timeSlot, setTimeSlot] = useState("Select Time Slot");

    return (
        <div className="w-full mb-6">

            <div className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

                    {/* name */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                            Full Name <span className='text-red-600'>*</span>
                        </label>
                        <input
                            type='text'
                            placeholder="Enter Full Name"
                            className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all text-[#0B1E3D] bg-white"
                        />
                    </div>

                    {/* number */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="contact" className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                            Contact Number <span className='text-red-600'>*</span>
                        </label>
                        <input
                            id="contact"
                            type="tel"
                            inputMode="numeric"
                            placeholder="Enter contact number"
                            className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-[#D97706] transition-all text-[#0B1E3D] bg-white"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

                    {/* pref date */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="date" className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                            Preferred Date <span className='text-red-600'>*</span>
                        </label>
                        <input
                            id='date'
                            type='date'
                            placeholder="Enter Full Name"
                            className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all text-[#0B1E3D] bg-white"
                        />
                    </div>

                    {/* time slot */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="time slot" className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                            Preffered Time Slot <span className='text-red-600'>*</span>
                        </label>
                        <BuyerCustomDropdown
                            selected={timeSlot}
                            onChange={setTimeSlot}
                            options={["9:00 AM to 12:00 PM", "1:00 PM to 3:00 PM", "4:00 PM to 6:00 PM"]}
                        />
                    </div>

                    {/* pref time */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="time" className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                            Topic / Reason for Call <span className='text-red-600'>*</span>
                        </label>
                        <input
                            type='text'
                            placeholder="Enter Full Name"
                            className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all text-[#0B1E3D] bg-white"
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                        Description (Optional)
                    </label>
                    <textarea
                        rows={3}
                        className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-[#D97706] transition-all text-[#0B1E3D] bg-white resize-none mt-1"
                        placeholder="Type your message here..." />
                </div>

                {/* Note Section */}
                <div className="flex items-start gap-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="mt-0.5">📞</span>
                    <p>
                        Our team will call you within 2 business hours during support hours.
                        <strong> Monday – Friday, 9:00 AM – 6:00 PM GST.</strong> Calls outside these hours
                        will be scheduled for the next business day.
                    </p>
                </div>
                
                {/* btn */}
                <div className="flex items-center gap-3 mt-4">
                    <button
                        type="button"
                        onClick={() => setSupportPage('home')}
                        className="flex-1 px-4 py-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="flex-1 px-4 py-3 text-sm font-medium text-white bg-[#D97706] rounded-lg hover:bg-[#B45309] transition-all shadow-sm"
                    >
                        Submit Request
                    </button>
                </div>
            </div>


        </div>
    )
}

export default BuyerSupportRequestCall;