
import React, { useState } from 'react';
import { Info, Search as SearchIcon, CheckCircle2 } from 'lucide-react';
import CustomDropdown from '../../SharedComponents/CustomDropDown';

// Mock data 
const MOCK_USERS = [
    {
        userId: "USER-000124",
        name: "Michael Johnson",
        role: "Buyer",
        verified: true,
        email: "michael.j@email.com",
        phone: "+971 50 123 4567",
        memberSince: "Mar 15, 2024",
        totalWonAuctions: 24,
        availableBalance: 45500.00,
        accountStatus: "Active",
        kycStatus: "Verified",
    },
    {
        userId: "USER-000198",
        name: "Sara Ahmed",
        role: "Seller",
        verified: true,
        email: "sara.ahmed@email.com",
        phone: "+971 55 987 6543",
        memberSince: "Jan 02, 2023",
        totalWonAuctions: 0,
        availableBalance: 12750.00,
        accountStatus: "Active",
        kycStatus: "Verified",
    },
];

function PayoutFormStep2({ draft, updateDraft }) {

    const [activeTab, setActiveTab] = useState("search-user");
    const [searchBy, setSearchBy] = useState();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    const [manualRecipient, setManualRecipient] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
    });

    const [manualSubmitted, setManualSubmitted] = useState(false);

    // tabs
    const tabs = [
        { id: 'search-user', label: 'Search User', },
        { id: 'enter-manually', label: 'Enter Manually', },
    ];

    // i/p handler
    const handleManualChange = (e) => {
        const { name, value } = e.target;

        setManualRecipient((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleManualRecipient = () => {
        const { name, email, phone, role } = manualRecipient;

        if (!name.trim() || !email.trim() || !phone.trim() || !role) {
            return;
        }

        const recipient = {
            ...manualRecipient,
            userId: null,
            verified: false,
            accountStatus: "Unverified",
            kycStatus: "Not Verified",
            isManual: true,
        };

        updateDraft({
            recipient,
        });

        setManualSubmitted(true);
    };

    const handleSearch = () => {
        setHasSearched(true);

        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        // mock filter - matches on email substring, case-insensitive
        const results = MOCK_USERS.filter(u =>
            u.email.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );
        setSearchResults(results);
    };

    const handleSelectUser = (user) => {
        updateDraft({ recipient: user });
    };

    const selectedRecipient = draft?.recipient;

    return (
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm">

            {/* Header */}
            <div>
                <h3 className="text-base font-bold text-[#0B1E3D] mb-1">
                    Recipient Details
                </h3>
                <span className='text-[12.5px] text-gray-400'>Select the user or seller who will receive this payout.</span>
            </div>

            {/* tabs */}
            <div className="flex gap-10 border-b border-slate-100 my-6 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-3 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors 
                            ${activeTab === tab.id
                                ? 'border-[#D97706] text-[#D97706]'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* search-user */}
            {activeTab === "search-user" && (
                <>
                    {/* search */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[220px_1fr_auto] items-end gap-4">
                        <div className="w-full">
                            <label className="block text-xs font-medium text-[#0B1E3D] mb-2">
                                Search By <span className="text-red-500">*</span>
                            </label>

                            <CustomDropdown
                                placeholder="Search"
                                options={["Email Address", "Contact", "Other"]}
                                selected={searchBy}
                                onChange={setSearchBy}
                            />
                        </div>

                        <div className="w-full">
                            <label className="block text-xs font-medium text-[#0B1E3D] mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Enter email address"
                                className="w-full h-10 rounded-lg border border-slate-200 px-3 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleSearch}
                            className="w-full sm:w-auto h-10 px-6 rounded-lg bg-[#D97706] text-xs sm:text-sm font-medium text-white transition-all duration-200 hover:bg-[#B45309] active:scale-[0.98]"
                        >
                            Search
                        </button>
                    </div>

                    {/* results */}
                    {hasSearched && (
                        <div className="mt-5">
                            <p className="text-xs font-medium text-slate-500 mb-3">
                                {searchResults.length} user{searchResults.length !== 1 ? 's' : ''} found
                            </p>

                            {searchResults.length === 0 ? (
                                <div className="text-center py-6 text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl">
                                    No user found. Try a different search, or use "Enter Manually".
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {searchResults.map((user) => {
                                        const isSelected = selectedRecipient?.userId === user.userId;
                                        return (
                                            <div
                                                key={user.userId}
                                                onClick={() => handleSelectUser(user)}
                                                className={`cursor-pointer rounded-xl border p-5 transition-all duration-200
                                                    ${isSelected
                                                        ? "border-[#D97706] bg-amber-50/20 shadow-sm"
                                                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                                                    }`}
                                            >
                                                {/* Top Section */}
                                                <div className="flex items-start justify-between gap-4">

                                                    {/* User Info */}
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        {/* Avatar */}
                                                        <div className="w-12 h-12 rounded-full border-slate-300 border bg-slate-100 flex items-center justify-center text-[#0B1E3D] font-semibold text-base shrink-0">
                                                            {user.name.charAt(0)}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <h4 className="text-sm font-semibold text-[#0B1E3D]">
                                                                    {user.name}
                                                                </h4>

                                                                {user.verified && (
                                                                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[11px] font-medium text-emerald-700">
                                                                        Verified
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <p className="text-xs text-slate-500 mt-1">
                                                                {user.role}
                                                            </p>

                                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                                                                <span className="text-xs text-slate-500">
                                                                    {user.email}
                                                                </span>

                                                                <span className="text-xs text-slate-500">
                                                                    {user.phone}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Radio */}
                                                    <div
                                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1
                                                            ${isSelected
                                                                ? "border-[#D97706]"
                                                                : "border-slate-300"
                                                            }`}
                                                    >
                                                        {isSelected && (
                                                            <div className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                                                        )}
                                                    </div>
                                                </div>


                                                {/* Divider */}
                                                <div className="border-t border-slate-100 my-4" />

                                                {/* Bottom Stats */}
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                    <div>
                                                        <p className="text-xs text-slate-400 mb-1">
                                                            User ID
                                                        </p>
                                                        <p className="text-sm font-medium text-slate-700">
                                                            {user.userId}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-400 mb-1">
                                                            Member Since
                                                        </p>
                                                        <p className="text-sm font-medium text-slate-700">
                                                            {user.memberSince}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-400 mb-1">
                                                            Total Won Auctions
                                                        </p>
                                                        <p className="text-sm font-medium text-slate-700">
                                                            {user.totalWonAuctions}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-400 mb-1">
                                                            Available Balance
                                                        </p>
                                                        <p className="text-sm font-semibold text-emerald-600">
                                                            $
                                                            {user.availableBalance.toLocaleString(undefined, {
                                                                minimumFractionDigits: 2,
                                                            })}
                                                        </p>
                                                    </div>

                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* selected user payout info */}
                    {selectedRecipient && (
                        <div className="mt-6">
                            <h4 className="text-sm font-semibold text-[#0B1E3D] mb-3">
                                User Payout Information
                            </h4>

                            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                                <div className="grid grid-cols-1 sm:grid-cols-2">

                                    {/* Full Name */}
                                    <div className="p-4 border-b sm:border-r border-slate-100">
                                        <p className="text-xs text-slate-400 mb-1">
                                            Full Name
                                        </p>
                                        <p className="text-sm font-medium text-slate-700">
                                            {selectedRecipient.name}
                                        </p>
                                    </div>

                                    {/* User ID */}
                                    <div className="p-4 border-b border-slate-100">
                                        <p className="text-xs text-slate-400 mb-1">
                                            User ID
                                        </p>
                                        <p className="text-sm font-medium text-slate-700">
                                            {selectedRecipient.userId}
                                        </p>
                                    </div>

                                    {/* Email */}
                                    <div className="p-4 border-b sm:border-r border-slate-100">
                                        <p className="text-xs text-slate-400 mb-1">
                                            Email Address
                                        </p>
                                        <p className="text-sm font-medium text-slate-700 break-all">
                                            {selectedRecipient.email}
                                        </p>
                                    </div>

                                    {/* Account Status */}
                                    <div className="p-4 border-b border-slate-100">
                                        <p className="text-xs text-slate-400 mb-2">
                                            Account Status
                                        </p>
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700">
                                            {selectedRecipient.accountStatus}
                                        </span>
                                    </div>

                                    {/* Phone */}
                                    <div className="p-4 sm:border-r border-slate-100">
                                        <p className="text-xs text-slate-400 mb-1">
                                            Phone Number
                                        </p>
                                        <p className="text-sm font-medium text-slate-700">
                                            {selectedRecipient.phone}
                                        </p>
                                    </div>

                                    {/* KYC Status */}
                                    <div className="p-4">
                                        <p className="text-xs text-slate-400 mb-2">
                                            KYC Status
                                        </p>
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700">
                                            {selectedRecipient.kycStatus}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* enter-manually */}
            {activeTab === "enter-manually" && (
                <div className="space-y-5">
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                        <h3 className="text-sm font-semibold text-[#0B1E3D] mb-1">
                            Enter Recipient Details
                        </h3>

                        <p className="text-xs text-slate-500 mb-5">
                            Enter the recipient's basic information to continue with the payout.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Full Name */}
                            <div>
                                <label className="block text-[13px] font-medium text-[#0B1E3D] mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={manualRecipient.name}
                                    onChange={handleManualChange}
                                    placeholder="Enter full name"
                                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-[13px] font-medium text-[#0B1E3D] mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={manualRecipient.email}
                                    onChange={handleManualChange}
                                    placeholder="Enter email address"
                                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-[13px] font-medium text-[#0B1E3D] mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={manualRecipient.phone}
                                    onChange={handleManualChange}
                                    placeholder="Enter phone number"
                                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-[13px] font-medium text-[#0B1E3D] mb-2">
                                    Role <span className="text-red-500">*</span>
                                </label>

                                <select
                                    name="role"
                                    value={manualRecipient.role}
                                    onChange={handleManualChange}
                                    className="w-full h-10 rounded-lg border border-slate-200 px-3 text-xs sm:text-sm text-slate-700 bg-white outline-none transition-all focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                >
                                    <option value="">Select role</option>
                                    <option value="Buyer">Buyer</option>
                                    <option value="Seller">Seller</option>
                                </select>
                            </div>
                        </div>

                        {/* Continue */}
                        <div className="flex justify-end mt-5">
                            <button
                                type="button"
                                onClick={handleManualRecipient}
                                className="h-10 px-5 rounded-lg bg-[#D97706] text-xs sm:text-sm font-medium text-white hover:bg-[#B45309] transition-colors active:scale-[0.98]"
                            >
                                Continue
                            </button>
                        </div>
                    </div>

                    {/* card show after filling info */}
                    {manualSubmitted && (
                        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">

                            {/* Header */}
                            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
                                <div>
                                    <h3 className="text-sm font-semibold text-[#0B1E3D]">
                                        Recipient (Manual Entry)
                                    </h3>

                                    <p className="text-xs text-slate-500 mt-1">
                                        Recipient details entered manually
                                    </p>
                                </div>

                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-[11px] font-medium text-amber-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                                    Unverified
                                </span>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 p-5">

                                <div>
                                    <p className="text-xs text-slate-400 mb-1">
                                        Full Name
                                    </p>
                                    <p className="text-sm font-medium text-slate-700">
                                        {manualRecipient.name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400 mb-1">
                                        Email Address
                                    </p>
                                    <p className="text-sm font-medium text-slate-700 break-all">
                                        {manualRecipient.email}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400 mb-1">
                                        Phone Number
                                    </p>
                                    <p className="text-sm font-medium text-slate-700">
                                        {manualRecipient.phone}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400 mb-1">
                                        Role
                                    </p>
                                    <p className="text-sm font-medium text-slate-700">
                                        {manualRecipient.role}
                                    </p>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* note */}
            <div className="w-full flex items-start gap-3 px-4 py-3.5 mt-6 border border-[#D97706]/20 border-l-2 border-l-[#D97706] bg-[#FFFDF8] rounded-lg">
                <div className="pt-0.5 shrink-0"><Info className="w-5 h-5 text-[#D97706]" /></div>
                <div>
                    <h4 className="text-[13px] font-semibold text-[#0B1E3D]">Note</h4>
                    <p className="mt-1 text-xs text-slate-600 leading-5">
                        Payout will be sent to the primary payment method linked with this user account.
                    </p>
                </div>
            </div>

        </div>
    )
}

export default PayoutFormStep2;