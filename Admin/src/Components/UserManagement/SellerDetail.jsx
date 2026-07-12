
import React, { useState } from 'react';
import { Star, Eye, FileText, MessageSquare } from 'lucide-react';

import FormPageHeader from './Shared/FormPageHeader';
import SellerOverviewTab from './SellerOverviewTab';
import SellerBusinessInfoTab from './SellerBusinessInfoTab';
import SellerDocumentsTab from './SellerDocumentsTab';
import SellerListingsTab from './SellerListingTab';
import SellerTransactionsTab from './SellerTransactionsTab';
import SellerReviewsTab from './SellerReviewsTab';
import SellerActivityLogTab from './SellerActivityLogTab';
import AccountStatusCard from './Shared/AccountStatusCard';
import BusinessOverviewCard from './Shared/BusinessOverviewCard';
import QuickActionsCard from './Shared/QuickActionsCard';

function SellerDetail({ seller, setCurrentPage }) {

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(seller);

    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'business', label: 'Business Information' },
        { id: 'documents', label: 'Documents' },
        { id: 'listings', label: 'Listings' },
        { id: 'transactions', label: 'Transactions' },
        { id: 'reviews', label: 'Reviews' },
        { id: 'activity', label: 'Activity Log' },
    ];

    if (!seller) return null;

    // const updateField = (name, value) => {
    //     setEditData((prev) => ({ ...prev, [name]: value }));
    // };

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
            />

            {/* seller detail */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">

                {/* left side - section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">

                        {/* Header Section */}
                        <div className="flex items-center gap-4 mb-10">
                            <img
                                src={seller.avatar || null}
                                alt={seller.name}
                                className="w-16 h-16 rounded-full" />

                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-[18px] font-bold text-slate-900">{seller.name}</h2>
                                    {seller.kycStatus === 'verified' && (
                                        <span className="bg-green-50 text-green-700 text-[12px] font-semibold px-2 py-0.5 rounded">Verified</span>
                                    )}
                                </div>
                                <p className="text-slate-500 text-[13px]">
                                    Seller ID: <span className="font-semibold text-slate-900">{seller.sellerId || '--'}</span>
                                </p>
                                <p className="text-slate-500 text-[13px]">
                                    Member Since: {seller.joinedOn ? new Date(seller.joinedOn).toLocaleDateString() : '--'}
                                </p>
                                <p className="flex items-center gap-1.5 text-slate-500 text-[13px]">
                                    Rating:
                                    <Star className="text-yellow-400 w-3 h-3" fill="#FACC15" />
                                    <span className="font-semibold text-slate-900">{seller.rating}</span>
                                    <span>({seller.reviewCount} Reviews)</span>
                                </p>
                            </div>

                            {/* Edit Button - ml-auto se ye right side mein shift ho jayega */}
                            <div className="ml-auto flex gap-2">
                                {!isEditing ? (
                                    <button
                                        onClick={handleEditClick}
                                        className="text-sm font-medium text-[#D97706] border border-amber-200 px-4 py-2 rounded-xl hover:bg-amber-50">
                                        Edit Seller
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="text-sm font-medium text-white bg-[#D97706] px-4 py-2 rounded-xl hover:bg-amber-700">
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="text-sm font-medium text-slate-600 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50">
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
                        {activeTab === 'activity' && (
                            <SellerActivityLogTab data={data} />
                        )}
                    </div>
                </div>

                {/* right side - section */}
                <div className="space-y-6">

                    {/* acc status */}
                    <AccountStatusCard fields={[
                        { label: 'KYC Status', value: seller.kycStatus, type: 'badge' },
                        { label: 'Account Status', value: seller.status, type: 'badge' },
                        { label: 'Verification Date', value: seller.emailVerified, type: 'text' },
                        { label: 'Last Verified On', value: seller.phoneVerified, type: 'text' },
                        { label: 'Next KYC Due', value: seller.kycDue, type: 'text' },
                    ]} />

                    {/* business card */}
                    <BusinessOverviewCard fields={[
                        { label: "Total Listings", value: seller.totalListings },
                        { label: "Active Listings", value: seller.activeListings },
                        { label: "Sold Vehicles", value: seller.soldVehicles },
                        { label: "Total Sales", value: seller.totalSales },
                        { label: "Total Bids Received", value: seller.totalBidsReceived },
                        { label: "Response Rate", value: seller.responseRate },
                        { label: "Average Rating", value: seller.rating, count: seller.reviewCount, isRating: true },
                    ]} />

                    {/* quick action */}
                    <QuickActionsCard actions={[
                        { label: "View Listings", icon: Eye, onClick: () => setCurrentPage('sellers') },
                        { label: "View Transactions", icon: FileText, onClick: () => { } },
                        { label: "View Reviews", icon: Star, onClick: () => { } },
                        { label: "Send Message", icon: MessageSquare, onClick: () => { } },
                    ]} />
                </div>
            </div>
        </div>
    )
}

export default SellerDetail;