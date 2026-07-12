
import React, { useState } from 'react';
import { HelpCircle, FileText, MessageCircle, Phone, ArrowRight, Search, Eye, MoreVertical, ChevronDown } from 'lucide-react';

const mockTickets = [
    { id: '#AB-24567', subject: 'Payment not reflected in my account', category: 'Payments', status: 'Open', lastUpdate: 'May 20, 2024\n10:30 AM' },
    { id: '#AB-24566', subject: 'Unable to place bid on auction', category: 'Bidding', status: 'In Progress', lastUpdate: 'May 19, 2024\n04:15 PM' },
    { id: '#AB-24565', subject: 'Vehicle pickup information', category: 'Shipping', status: 'Closed', lastUpdate: 'May 18, 2024\n11:20 AM' },
    { id: '#AB-24564', subject: 'Need help with invoice download', category: 'Invoices', status: 'Open', lastUpdate: 'May 18, 2024\n09:45 AM' },
];

const tabs = ['All Tickets', 'Open', 'In Progress', 'Closed'];
const tabKeys = ['All', 'Open', 'In Progress', 'Closed'];

const statusStyle = {
    'Open': 'bg-green-100 text-green-700',
    'In Progress': 'bg-amber-100 text-amber-700',
    'Closed': 'bg-slate-100 text-slate-500',
};

function BuyerSupportStats({ setCurrentPage, setSupportPage }) {

    const [activeTab, setActiveTab] = useState(0);

    const supportOptions = [
        {
            title: 'FAQs',
            desc: 'Find answers to common questions',
            icon: <HelpCircle size={26} className="text-amber-600" />,
            bgColor: 'bg-amber-50',
            page: 'faqs',
        },
        {
            title: 'Submit a Ticket',
            desc: 'Contact our support team',
            icon: <FileText size={26} className="text-[#0B1E3D]" />,
            bgColor: 'bg-slate-100',
            page: 'submit-ticket',
        },
        {
            title: 'Live Chat',
            desc: 'Chat with our support team',
            icon: <MessageCircle size={26} className="text-amber-600" />,
            bgColor: 'bg-amber-50',
            page: 'live-chat',
        },
        {
            title: 'Request a Call',
            desc: 'Request a callback from us',
            icon: <Phone size={26} className="text-[#0B1E3D]" />,
            bgColor: 'bg-slate-100',
            page: 'request-call',
        },
    ];

    const popularSearches = ['Payment Issues', 'Bidding Help', 'Shipping', 'Account Verification', 'Refunds'];

    const filteredTickets = activeTab === 0
        ? mockTickets
        : mockTickets.filter(t => t.status === tabKeys[activeTab]);

    return (
        <div className="w-full space-y-8">

            {/* search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search for help articles, guides and more..."
                        className="w-full py-2.5 pl-4 pr-12 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200"
                    />
                    <Search className="absolute right-4 top-2.5 text-slate-400" size={20} />
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    <span className="font-bold text-slate-500">Popular Searches:</span>
                    {popularSearches.map((item, i) => (
                        <button key={i} className="text-[#D97706] font-medium hover:underline">
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {/* cards */}
            <div>
                <h2 className="text-lg font-bold text-[#0B1E3D] mb-4">
                    How can we help you today?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {supportOptions.map((opt, i) => (
                        <div
                            key={i}
                            onClick={() => setSupportPage(opt.page)}
                            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all group cursor-pointer"
                        >
                            <div className={`w-11 h-11 ${opt.bgColor} rounded-full flex items-center justify-center mb-4`}>
                                {opt.icon}
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <h3 className="font-bold text-[#0B1E3D] text-sm mb-0.5">{opt.title}</h3>
                                    <p className="text-slate-500 text-xs">{opt.desc}</p>
                                </div>
                                <ArrowRight size={18} className="text-slate-300 group-hover:text-[#D97706] transition-colors shrink-0" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ticket list */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-5 pb-0">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-[#0B1E3D]">My Support Tickets</h2>
                        <div className="flex items-center gap-2 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 cursor-pointer hover:border-amber-300 transition">
                            <span>Sort by: Recent</span>
                            <ChevronDown size={18} />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-slate-100">
                        {tabs.map((tab, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(i)}
                                className={`pb-2.5 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === i
                                    ? 'text-[#D97706] border-b-2 border-[#D97706]'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto mt-4">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-slate-700 bg-gray-50 text-xs font-medium border-b border-slate-100">
                                <th className="text-left px-5 py-3">Ticket ID</th>
                                <th className="text-left px-4 py-3 min-w-60">Subject</th>
                                <th className="text-left px-4 py-3 min-w-35">Category</th>
                                <th className="text-left px-4 py-3 min-w-30">Status</th>
                                <th className="text-left px-4 py-3 min-w-35">Last Update</th>
                                <th className="text-left px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.map((ticket, i) => (
                                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition">
                                    <td className="px-5 py-4 font-semibold text-[#0B1E3D] whitespace-nowrap">{ticket.id}</td>
                                    <td className="px-4 py-4 text-slate-700">{ticket.subject}</td>
                                    <td className="px-4 py-4 text-slate-500">{ticket.category}</td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle[ticket.status]}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-slate-500 whitespace-pre-line text-xs">{ticket.lastUpdate}</td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="flex items-center gap-1.5 text-[#D97706] text-xs font-medium border border-amber-200 rounded-lg px-2.5 py-1.5 hover:bg-amber-50 transition">
                                                <Eye size={13} /> View
                                            </button>
                                            <button className="text-slate-400 hover:text-slate-600 transition p-1">
                                                <MoreVertical size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-5 flex justify-center border-t border-slate-50">
                    <button className="text-sm font-medium text-[#D97706] border border-amber-200 rounded-xl px-6 py-2 hover:bg-amber-50 transition flex items-center gap-2">
                        View All Tickets <ArrowRight size={15} />
                    </button>
                </div>
            </div>

        </div>
    );
}

export default BuyerSupportStats;