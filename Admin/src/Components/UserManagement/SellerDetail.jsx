
import React, { useState } from 'react';
import { Star, Eye, FileText, MessageSquare, PlusCircle, Car, UploadCloud, Download, WalletCards, RefreshCw, CreditCard, Reply } from 'lucide-react';

import FormPageHeader from './Shared/FormPageHeader';
import SellerOverviewTab from './SellerOverviewTab';
import SellerBusinessInfoTab from './SellerBusinessInfoTab';
import SellerDocumentsTab from './SellerDocumentsTab';
import SellerListingsTab from './SellerListingTab';
import SellerTransactionsTab from './SellerTransactionsTab';
import SellerReviewsTab from './SellerReviewsTab';
import AccountStatusCard from './Shared/AccountStatusCard';
import BusinessOverviewCard from './Shared/BusinessOverviewCard';
import QuickActionsCard from '../SharedComponents/QuickActionsCard';
import DocumentsPreview from './DocumentsPreview';
import NeedHelp from './Shared/NeedHelp';
import ListingPerformanceSummary from './ListingPerformanceSummary';
import SummaryDonutCard from '../SharedComponents/SummaryDonutCard';
import SummaryTransactionCard from './SummaryTransactionCard';
import TransactionPaymentMethods from './TransactionPaymentMethods';
import CheckListCard from './CheckListCard';

function SellerDetail({ seller, setCurrentPage }) {

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(seller);

    const [activeTab, setActiveTab] = useState('overview');

    // tabs
    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'business', label: 'Business Information' },
        { id: 'documents', label: 'Documents' },
        { id: 'listings', label: 'Listings' },
        { id: 'transactions', label: 'Transactions' },
        { id: 'reviews', label: 'Reviews' },
    ];

    // right side cards - rendering
    const sellerRightColumnMap = {
        overview: ['accountStatus', 'businessOverview', 'quickActions'],
        business: ['businessOverview', 'quickActions', 'documentsPreview'],
        documents: ['documentSummary', 'checkListCard', 'needHelp'],
        listings: ['listingSummary', 'listingOverview', 'quickActions', 'needHelp'],
        transactions: ['transactionSummary', 'transactionPaymentMethods', 'quickActions'],
        reviews: ['reviewSummary','reviewFeedback', 'reviewImprove', 'quickActions'],
    };

    const quickActionsByTab = {
        overview: [
            { label: "View Listings", icon: Eye, onClick: () => setCurrentPage('sellers') },
            { label: "View Transactions", icon: FileText, onClick: () => { } },
            { label: "View Reviews", icon: Star, onClick: () => { } },
            { label: "Send Message", icon: MessageSquare, onClick: () => { } },
        ],
        business: [
            { label: "View Listings", icon: Eye, onClick: () => setCurrentPage('sellers') },
            { label: "View Transactions", icon: FileText, onClick: () => { } },
            { label: "View Reviews", icon: Star, onClick: () => { } },
            { label: "Send Message", icon: MessageSquare, onClick: () => { } },
        ],
        listings: [
            { label: "Add New Listing", icon: PlusCircle, onClick: () => { } },
            { label: "Manage Listings", icon: Car, onClick: () => setCurrentPage('sellers') },
            { label: "Bulk Upload", icon: UploadCloud, onClick: () => { } },
            { label: "Download Listing Report", icon: Download, onClick: () => { } },
        ],
        transactions: [
            { label: "Request Payout", icon: Download, onClick: () => { } },
            { label: "View Wallet Details", icon: WalletCards, onClick: () => { } },
            { label: "Download Statement", icon: Download, onClick: () => { } }
        ],
        reviews: [
            { label: "Reply To Review", icon: Reply, onClick: () => { } },
            { label: "View All Reviews", icon: Eye, onClick: () => { } },
            { label: "Export Reviews", icon: Download, onClick: () => { } }
        ],
    };

    if (!seller) return null;

    // support nested obj format
    const updateField = (name, value) => {
        setEditData((prev) => {
            if (!name.includes('.')) {
                return { ...prev, [name]: value };
            }

            const [parentKey, childKey] = name.split('.');
            return {
                ...prev,
                [parentKey]: {
                    ...prev[parentKey],
                    [childKey]: value,
                },
            };
        });
    };

    const handleEditClick = () => {
        setEditData(seller);
        setIsEditing(true);
    };

    const handleSave = () => {
        console.log('saving seller:', editData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData(seller);
        setIsEditing(false);
    };

    const data = isEditing ? editData : seller;

    return (
        <div>
            {/* heading */}
            <FormPageHeader
                title="Seller Details"
                breadcrumbItems={[
                    { label: 'Dashboard', onClick: () => setCurrentPage('dashboard') },
                    { label: 'Sellers', onClick: () => setCurrentPage('sellers') },
                    { label: 'Seller Details' },
                ]}
                onBack={() => setCurrentPage('sellers')}
                backLabel="Back to Sellers"
                backLabelOnMob="Back"
            />

            {/* seller detail */}
            <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6 items-start">

                {/* left side - section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">

                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">

                            {/* Left Section */}
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                <img
                                    src={seller.avatar || null}
                                    alt={seller.name}
                                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shrink-0"
                                />

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-sm md:text-lg font-bold text-slate-900 wrap-break-word">
                                            {seller.name}
                                        </h2>

                                        {seller.kycStatus === "verified" && (
                                            <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-md whitespace-nowrap">
                                                Verified
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                                        Seller ID:
                                        <span className="ml-1 font-semibold text-slate-900">
                                            {seller.sellerId || "--"}
                                        </span>
                                    </p>

                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Member Since:
                                        <span className="ml-1">
                                            {seller.joinedOn
                                                ? new Date(seller.joinedOn).toLocaleDateString()
                                                : "--"}
                                        </span>
                                    </p>

                                    <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-slate-500 mt-1">
                                        <span>Rating:</span>

                                        <Star
                                            className="w-4 h-4 text-yellow-400 shrink-0"
                                            fill="#FACC15"
                                        />

                                        <span className="font-semibold text-slate-900">
                                            {seller.rating}
                                        </span>

                                        <span>({seller.reviewCount} Reviews)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Section */}
                            <div className="flex flex-wrap gap-3 justify-start lg:justify-end shrink-0">
                                {!isEditing ? (
                                    <button
                                        onClick={handleEditClick}
                                        className="px-4 py-2 text-sm font-medium rounded-xl border border-amber-200 text-[#D97706] hover:bg-amber-50 transition-colors"
                                    >
                                        Edit Seller
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 text-sm font-medium rounded-xl bg-[#D97706] text-white hover:bg-amber-700 transition-colors"
                                        >
                                            Save
                                        </button>

                                        <button
                                            onClick={handleCancel}
                                            className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>

                        </div>

                        {/* Tab Bar */}
                        <div className="flex gap-10 border-b border-slate-100 mb-6 overflow-x-auto no-scrollbar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-3 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-[#D97706] text-[#D97706]'
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                        }`}>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* tabs */}
                        {activeTab === 'overview' && (
                            <SellerOverviewTab data={data} isEditing={isEditing} updateField={updateField} />
                        )}
                        {activeTab === 'business' && (
                            <SellerBusinessInfoTab data={data} isEditing={isEditing} updateField={updateField} />
                        )}
                        {activeTab === 'documents' && (
                            <SellerDocumentsTab data={data} />
                        )}
                        {activeTab === 'listings' && (
                            <SellerListingsTab data={data} />
                        )}
                        {activeTab === 'transactions' && (
                            <SellerTransactionsTab data={data} />
                        )}
                        {activeTab === 'reviews' && (
                            <SellerReviewsTab data={data} />
                        )}
                    </div>
                </div>

                {/* right side - section */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">

                    {/* acc status */}
                    {sellerRightColumnMap[activeTab].includes('accountStatus') && (
                        <AccountStatusCard fields={[
                            { label: 'KYC Status', value: seller.kycStatus, type: 'badge' },
                            { label: 'Account Status', value: seller.status, type: 'badge' },
                            { label: 'Verification Date', value: seller.emailVerified, type: 'text' },
                            { label: 'Last Verified On', value: seller.phoneVerified, type: 'text' },
                            { label: 'Next KYC Due', value: seller.kycDue, type: 'text' },
                        ]} />
                    )}

                    {/* business card */}
                    {sellerRightColumnMap[activeTab].includes('businessOverview') && (
                        <BusinessOverviewCard fields={[
                            { label: "Total Listings", value: seller.totalListings },
                            { label: "Active Listings", value: seller.activeListings },
                            { label: "Sold Vehicles", value: seller.soldVehicles },
                            { label: "Total Sales", value: seller.totalSales },
                            { label: "Total Bids Received", value: seller.totalBidsReceived },
                            { label: "Response Rate", value: seller.responseRate },
                            { label: "Average Rating", value: seller.rating, count: seller.reviewCount, isRating: true },
                        ]} />
                    )}

                    {/* doc preview */}
                    {sellerRightColumnMap[activeTab].includes('documentsPreview') && (
                        <DocumentsPreview documents={[
                            { label: "Trade License", status: "verified", onPreview: () => { }, onDownload: () => { } },
                            { label: "VAT Certificate", status: "verified", onPreview: () => { }, onDownload: () => { } },
                            { label: "Company Registration", status: "verified", onPreview: () => { }, onDownload: () => { } },
                            { label: "Bank Statement", status: "verified", onPreview: () => { }, onDownload: () => { } },
                        ]}
                        />
                    )}

                    {/* doc summary */}
                    {sellerRightColumnMap[activeTab].includes('documentSummary') && (
                        <SummaryDonutCard
                            title="Document Summary"
                            centerValue="6/6"
                            centerLabel="VERIFIED"
                            showPercentage={false}
                            segments={[
                                { name: 'Verified', value: 6, color: '#10B981' },
                                { name: 'Pending', value: 0, color: '#3B82F6' },
                                { name: 'Rejected', value: 0, color: '#F59E0B' },
                                { name: 'Not Uploaded', value: 0, color: '#9CA3AF' },
                            ]}
                        />
                    )}

                    {/* doc - guidlines */}
                    {sellerRightColumnMap[activeTab].includes('checkListCard') && (
                        <CheckListCard
                            title="Guidelines"
                            items={[
                                { label: "All documents must be clear and readable" },
                                { label: "File size should not exceed 5MB" },
                                { label: "Accepted formats: PDF, JPG, PNG" },
                                { label: "Ensure documents are valid and not expired" },
                                { label: "Trade License and VAT must be issued in UAE" },
                            ]}
                        />
                    )}

                    {/* listing overview */}
                    {sellerRightColumnMap[activeTab].includes('listingOverview') && (
                        <SummaryDonutCard
                            title="Listing Overview"
                            centerValue="120"
                            centerLabel="Total Listings"
                            showPercentage={false}
                            segments={[
                                { name: 'Active', value: 98, color: '#10B981' },
                                { name: 'Pending', value: 12, color: '#3B82F6' },
                                { name: 'Sold', value: 6, color: '#F59E0B' },
                                { name: 'Inactive', value: 4, color: '#9CA3AF' },
                            ]}
                        />
                    )}

                    {/* listing summ */}
                    {sellerRightColumnMap[activeTab].includes('listingSummary') && (
                        <ListingPerformanceSummary />
                    )}

                    {/* transaction Summary */}
                    {sellerRightColumnMap[activeTab].includes('transactionSummary') && (
                        <SummaryTransactionCard
                            title="Transaction Summary"
                            headerRight={
                                <div className='relative'>
                                    <select className="h-8 px-3 rounded-xl border border-slate-200 text-[12px] font-semibold bg-white text-slate-700 outline-none focus:border-gray-300 transition-colors cursor-pointer appearance-none">
                                        <option value="this-month">This Month</option>
                                        <option value="last-month">Last Month</option>
                                        <option value="na">NA</option>
                                    </select>
                                </div>
                            }
                            rows={[
                                { label: 'Total Sales', value: 'AED 865,000.00' },
                                { label: 'Total Payouts', value: '- AED 43,500.00', color: 'text-red-500' },
                                { label: 'Fees & Deductions', value: '- AED 580.00', color: 'text-red-500' },
                                { label: 'Top Up Amount', value: 'AED 50,000.00' },
                                { label: 'Net Balance Change', value: 'AED 870,920.00', color: 'text-green-600', info: true, highlight: true },
                            ]}
                        />
                    )}

                    {/* transaction pay methods */}
                    {sellerRightColumnMap[activeTab].includes('transactionPaymentMethods') && (
                        <TransactionPaymentMethods
                            title="Payment Methods"
                            rows={[
                                { icon: CreditCard, title: 'Bank Transfer', subtitle: 'Emirates NBD', count: '4 Transactions' },
                                { icon: CreditCard, title: 'Credit Card', subtitle: '**** 4242', count: '3 Transactions' },
                                { icon: RefreshCw, title: 'Auto Deduct', subtitle: 'From Wallet', count: '1 Transaction' },
                            ]}
                        />
                    )}

                    {/* review donut */}
                    {sellerRightColumnMap[activeTab].includes('reviewSummary') && (
                        <SummaryDonutCard
                            title="Review Summary"
                            centerValue="128"
                            centerLabel="Total Reviews"
                            showPercentage={false}
                            segments={[
                                { name: '5 Stars', value: 101, color: '#10B981' },
                                { name: '4 Stars', value: 80, color: '#3B82F6' },
                                { name: '3 Stars', value: 6, color: '#F59E0B' },
                                { name: '2 Stars', value: 2, color: '#ef4444' },
                                { name: '1 Stars', value: 1, color: '#808080' },
                            ]}
                        />
                    )}

                    {/* review feedback */}
                    {sellerRightColumnMap[activeTab].includes('reviewFeedback') && (
                        <CheckListCard
                            title="Top Positive Feedback"
                            items={[
                                { label: "Great communication", value: 86 },
                                { label: "Vehicle as described", value: 79 },
                                { label: "Fast response", value: 74 },
                                { label: "Professional service", value: 68 },
                            ]}
                        />
                    )}

                    {/* review improve */}
                    {sellerRightColumnMap[activeTab].includes('reviewImprove') && (
                        <CheckListCard
                            title="Top Areas to Improve"
                            iconColor="red"
                            items={[
                                { label: "Delivery time", value: 9 },
                                { label: "More vehicle photos", value: 6 },
                                { label: "Documentation process", value: 5 },
                            ]}
                        />
                    )}

                    {/* quick action */}
                    {sellerRightColumnMap[activeTab].includes('quickActions') && (
                        <QuickActionsCard actions={quickActionsByTab[activeTab] || []} />
                    )}

                    {/* need help */}
                    {sellerRightColumnMap[activeTab].includes('needHelp') && (
                        <NeedHelp />
                    )}

                </div>
            </div>
        </div>
    )
}

export default SellerDetail;