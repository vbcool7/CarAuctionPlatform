
import React from 'react';
import { Check, MoreVertical, Paperclip, Send, Headphones, FileText, Ticket, Folder, Clock, Car, ChevronRight, MessageSquare, ShieldAlert } from "lucide-react";

const badgeColors = [
    { bg: "bg-blue-100", text: "text-blue-600" },
    { bg: "bg-purple-100", text: "text-purple-600" },
    { bg: "bg-green-100", text: "text-green-600" },
    { bg: "bg-amber-100", text: "text-amber-600" },
    { bg: "bg-rose-100", text: "text-rose-600" },
];

const statusColorMap = {
    Open: { bg: "bg-red-100", text: "text-red-600" },
    "In Progress": { bg: "bg-amber-100", text: "text-amber-600" },
    Resolved: { bg: "bg-emerald-100", text: "text-emerald-600" },
};

function SupportDetail({ setCurrentPage, ticketId }) {

    const category = ticketId?.category || "Payments";
    const status = ticketId?.status || "Open";

    const categoryColor =
        badgeColors[
        category
            .split("")
            .reduce((sum, char) => sum + char.charCodeAt(0), 0) %
        badgeColors.length
        ];

    const statusColor = statusColorMap[status] || {
        bg: "bg-slate-100",
        text: "text-slate-600",
    };

    return (
        <div className='pb-6 space-y-6'>

            {/* back link */}
            <button
                onClick={() => setCurrentPage('support')}
                className='flex items-center gap-1 text-xs md:text-sm text-gray-500 hover:text-[#0B1E3D]'
            >
                ← Back to Support
            </button>

            {/* main section */}
            <div className='grid grid-cols-1 xl:grid-cols-3 gap-6 items-start'>

                {/* left */}
                <div className='xl:col-span-2 space-y-6'>

                    {/* Ticket Header Card */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                            <div className="flex items-start space-x-3.5">
                                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                                    <Headphones className="w-5 h-5" />
                                </div>

                                <div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                            Ticket #{ticketId?.id || 'SUP-1008'}
                                        </span>
                                    </div>

                                    <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                                        {ticketId?.title || ticketId?.subject || 'Payment not received'}
                                    </h2>
                                </div>
                            </div>

                            {/* Actions / Buttons */}
                            <div className="flex items-center space-x-3">
                                <button className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer">
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Mark as Resolved</span>
                                </button>

                                <button className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Badges & Meta Info */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs">
                            <div className="flex items-center space-x-2">
                                <span
                                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium 
                                        ${categoryColor.bg} ${categoryColor.text}`}>
                                    {category}
                                </span>

                                <span
                                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium 
                                        ${statusColor.bg} ${statusColor.text}`}>
                                    {status}
                                </span>
                            </div>

                            <div className="flex items-center space-x-6 text-slate-400">
                                <div>
                                    <span className="block text-[10px] uppercase font-semibold text-slate-400">
                                        Created On
                                    </span>
                                    <span className="font-medium text-slate-700">
                                        {ticketId?.createdOn || 'May 15, 2025 02:34 PM'}
                                    </span>
                                </div>

                                <div>
                                    <span className="block text-[10px] uppercase font-semibold text-slate-400">
                                        Last Updated
                                    </span>
                                    <span className="font-medium text-slate-700">
                                        {ticketId?.lastUpdated || 'May 15, 2025 02:34 PM'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Conversation Section */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                        <h3 className="font-bold text-slate-900 text-base mb-6">Conversation</h3>

                        <div className="space-y-6">

                            {/* Message 1: User */}
                            <div className="flex items-start space-x-3.5">
                                <img
                                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                                    alt="Michael Johnson"
                                    className="w-10 h-10 rounded-full object-cover shrink-0"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1.5">
                                        <span className="font-semibold text-slate-900 text-sm">Michael Johnson</span>
                                        <span className="text-xs text-slate-400">(You)</span>
                                        <span className="text-xs text-slate-400 ml-auto">May 15, 2025 02:34 PM</span>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm text-slate-700 space-y-3 leading-relaxed">
                                        <p>I haven't received the payment for the vehicle I sold. The auction ended 2 days ago and the amount is still pending in my account. Can you please check on this?</p>
                                        <p>Thanks.</p>

                                        {/* Attachment Box inside message */}
                                        <div className="inline-flex items-center space-x-3 bg-white border border-slate-200 rounded-xl p-2.5 pr-4 shadow-2xs">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-semibold text-slate-800">invoice_12345.pdf</div>
                                                <div className="text-[10px] text-slate-400">245 KB</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Message 2: Support Team */}
                            <div className="flex items-start space-x-3.5">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 font-bold">
                                    <Headphones className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1.5">
                                        <span className="font-semibold text-slate-900 text-sm">Support Team</span>
                                        <span className="text-xs text-slate-400 ml-auto">May 15, 2025 03:12 PM</span>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm text-slate-700 space-y-3 leading-relaxed">
                                        <p>Hello Michael,</p>
                                        <p>Thank you for reaching out. We have checked your account and the payment is currently under review by our finance team. We will update you once the review is completed. This usually takes 1-2 business days.</p>
                                        <p>We appreciate your patience.</p>
                                        <div className="pt-1">
                                            <p>Best regards,</p>
                                            <p className="font-semibold text-slate-900">BidDrive Support Team</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Message 3: User reply */}
                            <div className="flex items-start space-x-3.5">
                                <img
                                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                                    alt="Michael Johnson"
                                    className="w-10 h-10 rounded-full object-cover shrink-0"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1.5">
                                        <span className="font-semibold text-slate-900 text-sm">Michael Johnson</span>
                                        <span className="text-xs text-slate-400">(You)</span>
                                        <span className="text-xs text-slate-400 ml-auto">May 15, 2025 04:01 PM</span>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm text-slate-750 leading-relaxed">
                                        <p>Thank you for the update. Please let me know if you need any additional information from my side.</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Message Input Box */}
                        <div className="mt-8 border border-slate-200 rounded-2xl p-3 bg-white focus-within:border-slate-300 transition-colors">
                            <textarea
                                rows="3"
                                placeholder="Type your message here..."
                                className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none bg-transparent"
                            ></textarea>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                                <button type="button" className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <button type="button" className="inline-flex items-center space-x-2 px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm cursor-pointer">
                                    <span>Send</span>
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                    </div>

                </div>


                {/* right */}
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6'>

                    {/* 1. Ticket Details Card */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                        <h3 className="font-bold text-slate-900 text-base mb-4">
                            Ticket Details
                        </h3>

                        <div className="space-y-4">

                            {/* Ticket ID */}
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-3 text-slate-500">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                        <Ticket className="w-4 h-4" />
                                    </div>
                                    <span>Ticket ID</span>
                                </div>

                                <span className="font-semibold text-slate-900">
                                    #{ticketId?.id || 'SUP-1008'}
                                </span>
                            </div>

                            {/* Subject */}
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-3 text-slate-500">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <span>Subject</span>
                                </div>

                                <span className="font-semibold text-slate-900 truncate max-w-[180px]">
                                    {ticketId?.subject || 'Payment not received'}
                                </span>
                            </div>

                            {/* Category */}
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-3 text-slate-500">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                        <Folder className="w-4 h-4" />
                                    </div>
                                    <span>Category</span>
                                </div>

                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-600">
                                    {ticketId?.category || 'Payments'}
                                </span>
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-3 text-slate-500">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <span>Status</span>
                                </div>

                                <span
                                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium 
                                        ${statusColor.bg} ${statusColor.text}`}>
                                    {status}
                                </span>
                            </div>

                            {/* Created On */}
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-3 text-slate-500">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <span>Created On</span>
                                </div>

                                <span className="text-xs font-medium text-slate-700">
                                    {ticketId?.createdOn || 'May 15, 2025 02:34 PM'}
                                </span>
                            </div>

                            {/* Last Updated */}
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-3 text-slate-500">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <span>Last Updated</span>
                                </div>

                                <span className="text-xs font-medium text-slate-700">
                                    {ticketId?.lastUpdated || 'May 15, 2025 02:34 PM'}
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* 2. Related Information Card */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                        <h3 className="font-bold text-slate-900 text-base mb-4">Related Information</h3>

                        {/* Vehicle Preview Box */}
                        <div className="flex items-center space-x-3 mb-4">
                            <img
                                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=150&auto=format&fit=crop&q=80"
                                alt="BMW X5"
                                className="w-14 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                            />
                            <div>
                                <div className="font-bold text-slate-900 text-sm">2021 BMW X5</div>
                                <div className="text-xs text-slate-400 mt-0.5">Stock ID: BDV12345</div>
                            </div>
                        </div>

                        {/* View Vehicle Details Button */}
                        <button className="w-full flex items-center justify-between p-3 border border-slate-200/80 hover:border-slate-300 rounded-xl text-xs font-medium text-blue-600 bg-white hover:bg-slate-50 transition-all cursor-pointer group">
                            <div className="flex items-center space-x-2">
                                <Car className="w-4 h-4" />
                                <span>View Vehicle Details</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>

                    {/* 3. Quick Actions Card */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                        <h3 className="font-bold text-slate-900 text-base mb-4">Quick Actions</h3>
                        <div className="space-y-1">

                            {/* Reply to Ticket */}
                            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">Reply to Ticket</div>
                                        <div className="text-xs text-slate-400 mt-0.5">Send a message to support team</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            </div>

                            {/* Upload Attachment */}
                            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <Paperclip className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">Upload Attachment</div>
                                        <div className="text-xs text-slate-400 mt-0.5">Share additional files</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            </div>

                            {/* Close Ticket */}
                            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <ShieldAlert className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">Close Ticket</div>
                                        <div className="text-xs text-slate-400 mt-0.5">Mark this issue as resolved</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            </div>

                        </div>
                    </div>

                    {/* 4. Need immediate help Box */}
                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                        <div className="flex items-start space-x-4 mb-5">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                                <Headphones className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-base">Need immediate help?</h3>
                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                    Our support team is here to assist you with any issue.
                                </p>
                            </div>
                        </div>
                        <button className="w-full bg-[#D97706] hover:bg-amber-600 text-white font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm cursor-pointer">
                            <Headphones className="w-4 h-4" />
                            <span>Contact Support</span>
                        </button>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default SupportDetail;