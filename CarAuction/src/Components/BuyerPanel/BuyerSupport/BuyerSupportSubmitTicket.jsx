
import React, { useState } from 'react';
import { ArrowLeft, Send, UploadCloud, CheckCircle2 } from 'lucide-react';
import BuyerCustomDropdown from '../BuyerSharedComponents/BuyerCustomDropdown';

function BuyerSupportSubmitTicket({ setSupportPage }) {

    const [priority, setPriority] = useState('Medium');
    const [subject, setSubject] = useState("Select Subject");
    const [category, setCategory] = useState("Select Category");
    const [file, setFile] = useState(null);

    return (
        <div className="w-full mb-6">

                <div className="space-y-6">

                    {/* Subject & Category */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-[#0B1E3D] mb-1">
                                Subject <span className='text-red-600'>*</span>
                            </label>
                            <BuyerCustomDropdown
                                options={["Subject 1", "Subject 2", "Subject 3", "Subject 4"]}
                                selected={subject}
                                onChange={setSubject}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#0B1E3D] mb-1">
                                Category <span className='text-red-600'>*</span>
                            </label>
                            <BuyerCustomDropdown
                                options={["Category 1", "Category 2", "Category 3", "Category 4"]}
                                selected={category}
                                onChange={setCategory}
                            />
                        </div>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-bold text-[#0B1E3D] mb-2">
                            Priority <span className='text-red-600'>*</span>
                        </label>
                        <div className="flex gap-4">
                            {['Low', 'Medium', 'High'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPriority(p)}
                                    className={`px-6 py-2 border rounded-lg font-medium flex items-center gap-2 
                                        ${priority === p ? 'border-[#D97706] bg-blue-50 text-blue-700' : 'border-slate-200'}`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${p === 'Low' ? 'bg-green-500' : p === 'Medium' ? 'bg-orange-500' : 'bg-red-500'}`} />
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-[#0B1E3D] mb-1">
                            Description <span className='text-red-600'>*</span>
                        </label>
                        <textarea
                            rows={3}
                            className="w-full p-3 border border-slate-200 rounded-lg h-40 outline-none focus:border-[#D97706] resize-none"
                            placeholder="Type your message here..." />
                        <p className="text-right text-xs text-gray-400 mt-1">
                            0 / 2000
                        </p>
                    </div>

                    {/* Attachments */}
                    <div>
                        <label className="block text-sm font-bold text-[#0B1E3D] mb-1">
                            Attachments (Optional)
                        </label>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center text-gray-500">
                            <UploadCloud
                                size={32}
                                className="text-[#D97706] mb-2"
                            />
                            <p className="text-sm">Drag and drop files here or <span className="text-[#D97706] font-bold cursor-pointer">browse</span></p>
                            <p className="text-xs mt-1">Supported formats: JPG, PNG, PDF, DOC, DOCX (Max 10MB each)</p>
                        </div>
                    </div>
                     
                    {/* note */}
                    <div className="">
                        <div className="border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-8">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                                <div className="w-5 h-5 border-2 border-blue-600 rotate-45" />
                            </div>
                            <h3 className="font-bold text-[#0B1E3D] mb-4">Ticket Summary</h3>
                            <p className="text-sm text-gray-600 mb-6">Once submitted, you'll receive a confirmation email with your ticket details.</p>
                            <div className="space-y-4 text-sm text-gray-700">
                                <div className="flex gap-2"><CheckCircle2 size={18} className="text-green-500 shrink-0" /> We typically respond within 24 hours</div>
                                <div className="flex gap-2"><CheckCircle2 size={18} className="text-green-500 shrink-0" /> You can track your ticket status in <b>My Support Tickets</b></div>
                                <div className="flex gap-2"><CheckCircle2 size={18} className="text-green-500 shrink-0" /> Our team is available Mon - Fri, 9:00 AM - 6:00 PM GST</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button className="px-8 py-3 border border-slate-200 rounded-lg font-bold hover:bg-slate-50">Cancel</button>
                        <button className="flex items-center gap-2 px-8 py-3 bg-[#D97706] text-white rounded-lg font-bold hover:bg-amber-500 transition-colors">
                            Submit Ticket <Send size={16} />
                        </button>
                    </div>
                </div>
        </div>
    );
}

export default BuyerSupportSubmitTicket;