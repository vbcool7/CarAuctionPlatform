
import React, { useState } from 'react';
import { ArrowLeft, Phone, CalendarDays, Clock, Lightbulb } from 'lucide-react';
import { toast } from 'react-toastify';

import FormInputFields from '../../SellerRegistration/FormInputFields';
import { useCreateRequestedCall } from '../../../hook/useSupport';

const TIME_SLOT_OPTIONS = [
    { value: '9:00 AM to 12:00 PM', label: '9:00 AM to 12:00 PM' },
    { value: '1:00 PM to 3:00 PM', label: '1:00 PM to 3:00 PM' },
    { value: '4:00 PM to 6:00 PM', label: '4:00 PM to 6:00 PM' },
];

function RequestCall({ setCurrentPage }) {

    const [fullName, setFullName] = useState("");
    const [contactNumber, setContactNumber] = useState('');
    const [preferredDate, setPreferredDate] = useState('');
    const [preferredTimeSlot, setPreferredTimeSlot] = useState('');
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');

    const { mutate: createRequestedCall, isPending: isSubmitting } =
        useCreateRequestedCall();

    const today = new Date();
    const minDate = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0'),
    ].join('-');

    const handleSubmit = (e) => {
        e.preventDefault();

        const cleanedNumber = contactNumber.trim();

        if (
            !fullName.trim() ||
            !cleanedNumber ||
            !preferredDate ||
            !preferredTimeSlot ||
            !topic.trim()
        ) {
            toast.error("Please fill all required fields.");
            return;
        }

        if (!/^(05\d{8}|\+9715\d{8})$/.test(cleanedNumber)) {
            toast.error("Enter a valid UAE mobile number (05XXXXXXXX or +9715XXXXXXXX).");
            return;
        }

        if (preferredDate < minDate) {
            toast.error('Preferred date cannot be in the past.');
            return;
        }

        if (description.trim().length > 1000) {
            toast.error('Description cannot exceed 1000 characters.');
            return;
        }

        const formData = {
            fullName: fullName.trim(),
            contactNumber: cleanedNumber,
            preferredDate,
            preferredTimeSlot,
            topic: topic.trim(),
            description: description.trim(),
        };

        createRequestedCall(formData, {
            onSuccess: (response) => {
                toast.success(
                    response?.message || 'Call request submitted successfully!'
                );

                setFullName('');
                setContactNumber('');
                setPreferredDate('');
                setPreferredTimeSlot('');
                setTopic('');
                setDescription('');

                setCurrentPage('support');
            },
            onError: (error) => {
                toast.error(
                    error?.response?.data?.message ||
                    'Failed to submit call request. Please try again.'
                );
            },
        });
    };

    return (
        <div className="pb-6 space-y-6">
            {/* Header */}
            <div className="w-full flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                        Request a Callback
                    </h1>

                    <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                        Schedule a call with our team at your preferred date and time.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setCurrentPage('support')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shrink-0"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                <div className="xl:col-span-2">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 md:p-6 shadow-xs"
                    >
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center">
                                <Phone size={21} />
                            </div>

                            <div>
                                <h2 className="text-base font-bold text-slate-900">
                                    Call Details
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Enter your contact details and preferred schedule.
                                </p>
                            </div>
                        </div>

                        <FormInputFields
                            label="Full Name"
                            name="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            maxLength={100}
                            required
                        />

                        {/* Contact Number */}
                        <FormInputFields
                            label="Contact Number"
                            name="contactNumber"
                            type="tel"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            placeholder="e.g. +971501234567"
                            required
                        />

                        {/* Date and Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <FormInputFields
                                    label="Preferred Date"
                                    name="preferredDate"
                                    type="date"
                                    value={preferredDate}
                                    onChange={(e) => setPreferredDate(e.target.value)}
                                    required
                                />

                                <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                                    <CalendarDays size={13} />
                                    Select today or a future date.
                                </p>
                            </div>

                            <div>
                                <FormInputFields
                                    label="Preferred Time Slot"
                                    name="preferredTimeSlot"
                                    type="select"
                                    value={preferredTimeSlot}
                                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                                    placeholder="Select a time slot"
                                    options={TIME_SLOT_OPTIONS}
                                    required
                                />

                                <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                                    <Clock size={13} />
                                    UAE local time.
                                </p>
                            </div>
                        </div>

                        {/* Topic - Normal Text Input */}
                        <FormInputFields
                            label="Topic"
                            name="topic"
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Enter your topic"
                            maxLength={150}
                            required
                        />

                        {/* Description */}
                        <div>
                            <FormInputFields
                                label="Description"
                                name="description"
                                type="textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Briefly explain what you need help with (optional)."
                                maxLength={1000}
                            />

                            <div className="text-right text-xs text-slate-400 mt-1">
                                {description.length}/1000
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setCurrentPage('support')}
                                disabled={isSubmitting}
                                className="px-5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2.5 bg-[#D97706] hover:bg-amber-600 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Side */}
                <div className="space-y-5">
                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center mb-3">
                            <Phone size={19} />
                        </div>

                        <h3 className="text-sm font-bold text-slate-900">
                            What happens next?
                        </h3>

                        <ul className="mt-4 space-y-3">
                            {[
                                'Submit your callback request.',
                                'Our support team will review your preferred schedule.',
                                'The team will contact you regarding your request.',
                            ].map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-full bg-amber-50 text-[#D97706] text-xs font-bold flex items-center justify-center shrink-0">
                                        {index + 1}
                                    </span>

                                    <p className="text-xs leading-5 text-slate-600">
                                        {item}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5">
                        <div className="flex items-start gap-3">
                            <Lightbulb size={20} className="text-[#D97706] shrink-0" />

                            <div>
                                <h3 className="text-sm font-bold text-slate-900">
                                    Please note
                                </h3>

                                <p className="text-xs leading-5 text-slate-600 mt-2">
                                    Your preferred date and time are scheduling preferences.
                                    The support team will contact you based on availability.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RequestCall;