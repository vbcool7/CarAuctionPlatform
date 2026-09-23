
import React, { useState } from 'react';
import { Plus, Ticket, Clock, CheckCircle, Star, Headphones, MessageSquare, Phone, Mail, ChevronRight, ShieldAlert, Edit } from 'lucide-react';
import FilterDropdown from '../SellerSharedComponents/FilterDropdown';
import SearchBar from '../SellerSharedComponents/SearchBar';

const statsData = [
    {
        id: "total-tickets",
        title: "Total Tickets",
        value: "8",
        subtitle: "All time",
        subtitleColor: "text-gray-500",
        icon: Ticket,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
    },
    {
        id: "open-tickets",
        title: "Open Tickets",
        value: "3",
        subtitle: "Need attention",
        subtitleColor: "text-amber-600",
        icon: Clock,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
    },
    {
        id: "resolved-tickets",
        title: "Resolved Tickets",
        value: "5",
        subtitle: "Successfully closed",
        subtitleColor: "text-gray-500",
        icon: CheckCircle,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
    },
    {
        id: "avg-response-time",
        title: "Avg. Response Time",
        value: "2h 16m",
        subtitle: "Last 7 days",
        subtitleColor: "text-gray-500",
        icon: Star,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
    },
];

const statusOptions = [
    { value: "", label: "All Status" },
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
];

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

// static data
const ticketsData = [
    {
        id: "SUP-1008",
        subject: "Payment not received",
        description: "I have made the payment but it is...",
        category: "Payments",
        status: "Open",
        lastUpdatedDate: "May 15, 2025",
        lastUpdatedTime: "02:34 PM",
    },
    {
        id: "SUP-1007",
        subject: "Auction extension request",
        description: "Can you please extend the auction...",
        category: "Auctions",
        status: "In Progress",
        lastUpdatedDate: "May 14, 2025",
        lastUpdatedTime: "11:20 AM",
    },
    {
        id: "SUP-1006",
        subject: "Vehicle listing issue",
        description: "The vehicle is not showing in my...",
        category: "Vehicles",
        status: "Resolved",
        lastUpdatedDate: "May 12, 2025",
        lastUpdatedTime: "04:45 PM",
    },
];

function Support({ setCurrentPage, setSelectedTicketId }) {

    const [search, setSearch] = useState();
    const [status, setStatus] = useState();

    return (
        <div className='pb-6 space-y-6'>

            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>
                <div className='flex flex-col'>
                    <h1 className='text-xl md:text-2xl font-bold'>Support</h1>
                    <p className='text-xs md:text-sm text-gray-600 p-px'>
                        Get help, track your requests and find answers to common questions.
                    </p>
                </div>

                {/* Actions */}
                <button
                    onClick={() => setCurrentPage('create-ticket')}
                    className="group inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-amber-600/20 hover:bg-amber-700 active:scale-[0.98] transition-all duration-200">
                    <Plus className="h-4 w-4 text-white/90 transition-transform duration-300 group-hover:-translate-y-0.5" />
                    New Support Ticket
                </button>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 my-6">
                {statsData.map((stat) => {
                    const IconComponent = stat.icon;

                    return (
                        <div
                            key={stat.id}
                            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-md flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-amber-200 cursor-pointer"
                        >
                            <div
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${stat.iconBg} flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105`}
                            >
                                <IconComponent
                                    className={`w-5 h-5 md:w-6 md:h-6 ${stat.iconColor}`}
                                />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-slate-400">
                                    {stat.title}
                                </p>

                                <h3 className="text-lg md:text-xl font-bold text-[#0B1E3D] my-1">
                                    {stat.value}
                                </h3>

                                <p className={`text-[11px] font-semibold ${stat.subtitleColor}`}>
                                    {stat.subtitle}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 px-4 border border-gray-300 bg-white/80 rounded-xl">

                <div className="flex items-center">
                    <h1 className="text-lg font-semibold text-gray-800">
                        My Support Tickets
                    </h1>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                    <div className="w-full sm:w-72">
                        <SearchBar
                            placeholder="Search by ticket ID, subject..."
                            value={search}
                            onChange={setSearch}
                        />
                    </div>

                    <div className="w-full sm:w-auto">
                        <FilterDropdown
                            label="All Status"
                            options={statusOptions}
                            value={status}
                            onChange={setStatus}
                        />
                    </div>

                </div>
            </div>

            {/* main section */}
            <div className='grid grid-cols-1 xl:grid-cols-3 gap-6 items-start'>

                {/* left */}
                <div className='xl:col-span-2 space-y-6'>

                    {/* list */}
                    <div className="overflow-x-auto border border-slate-200/80 rounded-xl shadow-xs bg-white">
                        <table className="w-full text-left table-fixed">
                            <thead className="bg-white border-b border-slate-200 text-[#0B1E3D] uppercase text-[11px] font-extrabold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4.5 w-30">Ticket ID</th>
                                    <th className="px-6 py-4.5 w-65">Subject</th>
                                    <th className="px-6 py-4.5 w-35">Category</th>
                                    <th className="px-6 py-4.5 w-40">Status</th>
                                    <th className="px-6 py-4.5 w-40">Last Updated</th>
                                    <th className="px-6 py-4.5 w-35 ">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 transition-opacity">
                                {ticketsData.map((ticket, index) => {

                                    const categoryStyle = badgeColors[index % badgeColors.length];
                                    const statusStyle = statusColorMap[ticket.status] || { bg: "bg-slate-100", text: "text-slate-600" };

                                    return (
                                        <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">

                                            {/* Ticket ID */}
                                            <td className="px-6 py-4 font-semibold text-slate-800 text-sm">
                                                #{ticket.id}
                                            </td>

                                            {/* Subject & Description */}
                                            <td className="px-6 py-4 truncate">
                                                <div className="font-medium text-slate-900 text-sm truncate">
                                                    {ticket.subject}
                                                </div>
                                                <div className="text-xs text-slate-400 truncate mt-0.5">
                                                    {ticket.description}
                                                </div>
                                            </td>

                                            {/* Category Badge */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}>
                                                    {ticket.category}
                                                </span>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                                    {ticket.status}
                                                </span>
                                            </td>

                                            {/* Last Updated */}
                                            <td className="px-6 py-4 text-xs text-slate-500">
                                                <div>{ticket.lastUpdatedDate}</div>
                                                <div className="text-slate-400 mt-0.5">{ticket.lastUpdatedTime}</div>
                                            </td>

                                            {/* Action Button */}
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => {
                                                        setCurrentPage(`support-detail`);
                                                        setSelectedTicketId(ticket)
                                                    }}
                                                    className="px-4 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 shadow-2xs transition-all cursor-pointer">
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* right */}
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6'>

                    {/* 1. Need Immediate Help Box */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
                        <div className="flex items-start space-x-4 mb-5">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">
                                <Headphones className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-base">Need immediate help?</h3>
                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                    Our support team is here to assist you with any issue.
                                </p>
                            </div>
                        </div>
                        <button className="w-full bg-[#D97706] hover:bg-amber-500 text-white font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-sm cursor-pointer">
                            <Headphones className="w-4 h-4" />
                            <span>Contact Support</span>
                        </button>
                    </div>

                    {/* 2. Quick Actions Box */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                        <h3 className="font-bold text-slate-900 text-base mb-4">Quick Actions</h3>
                        <div className="space-y-1">
                            {/* Create New Ticket */}
                            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <Edit className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">Create New Ticket</div>
                                        <div className="text-xs text-slate-400 mt-0.5">Get help with your issue</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            </div>

                            {/* Live Chat */}
                            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">Live Chat</div>
                                        <div className="text-xs text-slate-400 mt-0.5">Chat with our support team</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            </div>

                            {/* Call Us */}
                            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">Call Us</div>
                                        <div className="text-xs text-slate-400 mt-0.5">+971 4 123 4567 (Mon - Fri, 9AM - 6PM)</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            </div>

                            {/* Email Us */}
                            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">Email Us</div>
                                        <div className="text-xs text-slate-400 mt-0.5">support@biddrive.ae</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            </div>
                        </div>
                    </div>

                    {/* 3. We're here to help Box */}
                    <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-6 shadow-sm flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-600">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm">We're here to help!</h4>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                If you can't find what you're looking for, feel free to reach out to our support team.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Support