
import React, { useState } from 'react';
import { Lock, UserCog, UserX, Trash2 } from 'lucide-react';
import FormPageHeader from './Shared/FormPageHeader';
import AccountStatusCard from './Shared/AccountStatusCard';
import QuickActionsCard from './Shared/QuickActionsCard';
import StaffOverviewTab from './StaffOverviewTab';
import StaffPermissionTab from './StaffPermissionTab';
import StaffActivityLogTab from './StaffActivityLogTab';
import StaffAssignedTaskTab from './StaffAssignedTaskTab';
import StaffLoginHistoryTab from './StaffLoginHistoryTab';
import StaffDocumentTab from './StaffDocumentTab';

function StaffDetail({ staff, setCurrentPage }) {

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(staff);

    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'permissions', label: 'Permissions' },
        { id: 'activity_log', label: 'Activity Log' },
        { id: 'assigned_task', label: 'Assigned Task' },
        { id: 'login_history', label: 'Login History' },
        { id: 'documents', label: 'Documents' },
    ];

    if (!staff) return null;

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
        setEditData(staff);
        setIsEditing(true);
    };

    const handleSave = () => {
        console.log('saving staff:', editData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData(staff);
        setIsEditing(false);
    };

    const data = isEditing ? editData : staff;

    // for role - heading
    const roleConfig = {
        Admin: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
        Manager: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
        Coordinator: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
        Support: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
        Reviewer: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
        'Content Editor': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
        'Finance Officer': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    };

    const roleStyle = roleConfig[staff.role] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };

    return (
        <div>
            <FormPageHeader
                title="Staff Details"
                breadcrumbItems={[
                    { label: 'Dashboard', onClick: () => setCurrentPage('dashboard') },
                    { label: 'Staff', onClick: () => setCurrentPage('staffs') },
                    { label: 'Staff Details' },
                ]}
                onBack={() => setCurrentPage('staffs')}
                backLabel="Back to Staffs"
            />

            {/* staff detail */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">

                {/* left side - section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">

                        {/* Header Section */}
                        <div className="flex items-center gap-4 mb-10">
                            <img
                                src={staff.avatar || null}
                                alt={staff.name}
                                className="w-16 h-16 rounded-full" />

                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-[18px] font-bold text-slate-900">{staff.name}</h2>
                                    {staff.status === 'active' && (
                                        <span className="bg-green-50 text-green-700 text-[12px] font-semibold px-2 py-0.5 rounded">Active</span>
                                    )}
                                </div>
                                <p className="text-slate-500 text-[13px]">
                                    Staff ID: <span className="font-semibold text-slate-900">{staff.staffId || '--'}</span>
                                </p>

                                <p className="flex items-center gap-2 text-slate-500 text-[13px]">
                                    Role:
                                    <span className={`${roleStyle.bg} ${roleStyle.text} border ${roleStyle.border} text-[11px] font-semibold px-2 py-0.5 rounded-full`}>
                                        {staff.role}
                                    </span>
                                </p>

                                <p className="text-slate-500 text-[13px]">
                                    Email: {staff.email || '--'}
                                </p>

                                <p className="text-slate-500 text-[13px]">
                                    Contact: {staff.phone || '--'}
                                </p>
                            </div>

                            {/* Edit Button - ml-auto se ye right side mein shift ho jayega */}
                            <div className="ml-auto flex gap-2">
                                {!isEditing ? (
                                    <button
                                        onClick={handleEditClick}
                                        className="text-sm font-medium text-[#D97706] border border-amber-200 px-4 py-2 rounded-xl hover:bg-amber-50">
                                        Edit Staff
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
                            <StaffOverviewTab data={data} isEditing={isEditing} updateField={updateField} />
                        )}
                        {activeTab === 'permissions' && (
                            <StaffPermissionTab data={data} isEditing={isEditing} updateField={updateField} />
                        )}
                        {activeTab === 'activity_log' && (
                            <StaffActivityLogTab data={data} />
                        )}
                        {activeTab === 'assigned_task' && (
                            <StaffAssignedTaskTab data={data} />
                        )}
                        {activeTab === 'login_history' && (
                            <StaffLoginHistoryTab data={data} />
                        )}
                        {activeTab === 'documents' && (
                            <StaffDocumentTab data={data} />
                        )}
                    </div>
                </div>

                {/* right side - section */}
                <div className="space-y-6">

                    {/* acc status */}
                    <AccountStatusCard fields={[
                        { label: 'Status', value: staff.status, type: 'badge' },
                        { label: 'Last Login', value: staff.lastLogin, type: 'text' },
                        { label: 'Login IP Address', value: staff.loginIp, type: 'text' },
                        { label: 'Account Created On', value: staff.accCreatedOn, type: 'text' },
                        { label: 'Email Verified', value: staff.emailVerified, type: 'badge' },
                        { label: 'Phone Verified', value: staff.phoneVerified, type: 'badge' },
                    ]} />

                    {/* quick action */}
                    <QuickActionsCard actions={[
                        { label: "Reset Password", icon: Lock, onClick: () => { } },
                        { label: "Login As Staff", icon: UserCog, onClick: () => { } },
                        { label: "Deactivate Account", icon: UserX, onClick: () => { }, variant: 'danger' },
                        { label: "Delete Account", icon: Trash2, onClick: () => { }, variant: 'danger' },
                    ]} />
                </div>
            </div>
        </div>
    )
}

export default StaffDetail;