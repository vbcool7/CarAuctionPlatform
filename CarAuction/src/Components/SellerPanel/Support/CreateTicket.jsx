
import React, { useState } from 'react';
import { ArrowLeft, Headphones, CreditCard, MessageCircleQuestion, ShieldCheck, Car, Settings, ChevronRight, Lightbulb } from 'lucide-react';

import FormInputFields from '../../SellerRegistration/FormInputFields';

function CreateTicket({ setCurrentPage }) {

    const [formData, setFormData] = useState({
        businessName: '',
        category: '',
        priority: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className='pb-6 space-y-6'>

            {/* Header */}
            <div className="w-full flex items-center justify-between gap-4">
                {/* Left */}
                <div className="flex flex-col">
                    <h1 className="text-xl md:text-2xl font-bold">
                        Create Support Ticket
                    </h1>

                    <p className="text-xs md:text-sm text-gray-600 p-px">
                        Fill in the details below and our support team will get back to you
                        soon as possible.
                    </p>
                </div>

                {/* Right */}
                <button
                    type="button"
                    onClick={() => setCurrentPage("support")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors shrink-0"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>
            </div>

            {/* main section */}
            <div className='grid grid-cols-1 xl:grid-cols-3 gap-6 items-start'>

                {/* left */}
                <div className='xl:col-span-2'>
                    <div className="space-y-8 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">

                        {/* Subject */}
                        <FormInputFields
                            label="Subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Enter a brief subject (e.g., Payment issue, Auction question, etc.)"
                            required
                        />

                        {/* Category & Priority */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormInputFields
                                label="Category"
                                name="category"
                                type="select"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="Select a category"
                                options={[
                                    { value: "vehicle", label: "Vehicle" },
                                    { value: "payment", label: "Payment" },
                                    { value: "payout", label: "Payout" },
                                    { value: "auction", label: "Auction" },
                                ]}
                                required
                            />

                            <FormInputFields
                                label="Priority"
                                name="priority"
                                type="select"
                                value={formData.priority}
                                onChange={handleChange}
                                placeholder="Select a priority"
                                options={[
                                    { value: "low", label: "Low" },
                                    { value: "medium", label: "Medium" },
                                    { value: "high", label: "High" },
                                ]}
                                required
                            />
                        </div>

                        {/* Description with character counter */}
                        <div>
                            <FormInputFields
                                label="Description"
                                name="description"
                                type="textarea"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Please describe your issue in detail. Include any relevant information such as ticket ID, vehicle ID, or error messages."
                                required
                            />
                            <div className="text-right text-xs text-slate-400 mt-1">
                                {formData.description ? formData.description.length : 0}/1000
                            </div>
                        </div>

                        {/* Attachments Section */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">
                                Attachments <span className="text-slate-400 font-normal">(Optional)</span>
                            </label>
                            <div className="border-2 border-dashed border-slate-200 hover:border-slate-300 transition-colors rounded-xl p-8 text-center bg-slate-50/50 cursor-pointer flex flex-col items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mb-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-slate-700">
                                    Drag and drop files here, or <span className="text-amber-600 hover:underline">click to upload</span>
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Supports: JPG, PNG, PDF, DOC (Max 5 files, 10MB each)
                                </p>
                            </div>
                        </div>

                        {/* Form Action Buttons */}
                        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                className="px-5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-[#D97706] hover:bg-amber-500 text-white rounded-xl text-sm font-medium transition-colors shadow-sm cursor-pointer"
                            >
                                Submit Ticket
                            </button>
                        </div>

                    </div>
                </div>

                {/* right */}
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6'>

                    {/* 2. Quick Help Box */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                        <h3 className="font-bold text-slate-900 text-base mb-4">Quick Help</h3>
                        <div className="space-y-1">

                            {/* Payment Issues */}
                            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">Payment Issues</div>
                                        <div className="text-xs text-slate-400 mt-0.5">Help with payouts, refunds, or failed transactions</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 ml-2" />
                            </div>

                            {/* Auction Questions */}
                            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <MessageCircleQuestion className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">Auction Questions</div>
                                        <div className="text-xs text-slate-400 mt-0.5">Information about bidding, listings, or results</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 ml-2" />
                            </div>

                            {/* Account & Verification */}
                            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">Account & Verification</div>
                                        <div className="text-xs text-slate-400 mt-0.5">KYC, document uploads, or account status</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 ml-2" />
                            </div>

                            {/* Vehicle Listing */}
                            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <Car className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">Vehicle Listing</div>
                                        <div className="text-xs text-slate-400 mt-0.5">Guidance on listing, edits, or removal</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 ml-2" />
                            </div>

                            {/* Technical Issues */}
                            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <Settings className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">Technical Issues</div>
                                        <div className="text-xs text-slate-400 mt-0.5">Website, app, or login problems</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 ml-2" />
                            </div>

                        </div>
                    </div>

                    {/* 3. Before creating a ticket Box */}
                    <div className="bg-[#FFFBEB]/80 border border-amber-200/80 rounded-2xl p-5 shadow-xs flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-600">
                            <Lightbulb className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm mb-2">Before creating a ticket, please check:</h4>
                            <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside mb-3">
                                <li>Your messages and notifications</li>
                                <li>Our FAQs section</li>
                                <li>The relevant help articles</li>
                            </ul>
                            <p className="text-xs text-slate-500 mb-3">
                                This may help you get a faster resolution.
                            </p>
                            <a href="#faqs" className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer group">
                                <span>View FAQs</span>
                                <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default CreateTicket;