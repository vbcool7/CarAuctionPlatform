
import React, { useState } from 'react';
import BuyerCustomDropdown from '../BuyerSharedComponents/BuyerCustomDropdown';
import { toast } from 'react-toastify';

import { useCreateRequestedCall } from '../../../hook/useSupport';

function BuyerSupportRequestCall({ setSupportPage }) {

    const [timeSlot, setTimeSlot] = useState("Select Time Slot");
    const [formData, setFormData] = useState({
        fullName: '',
        contactNumber: '',
        preferredDate: '',
        topic: '',
        description: '',
    });

    const { mutate: createRequestCall, isPending: isSubmitting } = useCreateRequestedCall();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const contactNumber = formData.contactNumber.trim();

        if (!/^(05\d{8}|\+9715\d{8})$/.test(contactNumber)) {
            toast.error('Enter a valid UAE mobile number (05XXXXXXXX or +9715XXXXXXXX).');
            return;
        }

        if (timeSlot === 'Select Time Slot') {
            toast.error('Please select a preferred time slot.');
            return;
        }

        createRequestCall(
            {
                ...formData,
                fullName: formData.fullName.trim(),
                contactNumber,
                topic: formData.topic.trim(),
                description: formData.description.trim(),
                preferredTimeSlot: timeSlot,
            },
            {
                onSuccess: (res) => {
                    toast.success(res?.message || 'Call request submitted successfully.');
                    setFormData({
                        fullName: '',
                        contactNumber: '',
                        preferredDate: '',
                        topic: '',
                        description: '',
                    });

                    setTimeSlot('Select Time Slot');
                },
                onError: (err) => {
                    toast.error(err?.response?.data?.message || 'Unable to submit your request. Please try again.');
                },
            }
        );
    };

    return (
        <div className="w-full mb-6">
            <form onSubmit={handleSubmit}>

                <div className="space-y-6 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

                        {/* name */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="name" className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                                Full Name <span className='text-red-600'>*</span>
                            </label>
                            <input
                                id="name"
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter Full Name"
                                maxLength={100}
                                required
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
                                name="contactNumber"
                                type="tel"
                                inputMode="tel"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                placeholder="0501234567 or +971501234567"
                                required
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
                                id="date"
                                name="preferredDate"
                                type="date"
                                value={formData.preferredDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-50 focus:border-[#D97706] transition-all text-[#0B1E3D] bg-white"
                            />
                        </div>

                        {/* time slot */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="time slot" className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
                                Preferred Time Slot <span className='text-red-600'>*</span>
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
                                id="topic"
                                name="topic"
                                type="text"
                                value={formData.topic}
                                onChange={handleChange}
                                placeholder="Enter reason for your call"
                                maxLength={150}
                                required
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
                            id="description"
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            maxLength={2000}
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
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 text-sm font-medium text-white bg-[#D97706] rounded-lg hover:bg-[#B45309] transition-all shadow-sm"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </div>

            </form>
        </div>
    )
}

export default BuyerSupportRequestCall;