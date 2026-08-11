
import React, { useState } from 'react';
import { Lock, UserCog, UserX, Trash2, Plus, Menu, File, Clock3, Download, Globe } from 'lucide-react';
import { AE, GB } from 'country-flag-icons/react/3x2';
import FormPageHeader from './Shared/FormPageHeader';
import AccountStatusCard from './Shared/AccountStatusCard';
import QuickActionsCard from '../SharedComponents/QuickActionsCard';
import StaffOverviewTab from './StaffOverviewTab';
import StaffPermissionTab from './StaffPermissionTab';
import StaffAssignedTaskTab from './StaffAssignedTaskTab';
import StaffLoginHistoryTab from './StaffLoginHistoryTab';
import StaffDocumentTab from './StaffDocumentTab';
import SummaryDonutCard from '../SharedComponents/SummaryDonutCard';
import RoleInformation from './RoleInformation';
import NotesSection from '../SharedComponents/NotesSection';
import OverdueTasks from './OverdueTasks';
import UpcomingTasks from './upcomingTasks';
import ExpiringSoon from './ExpiringSoon';
import TopLocations from './TopLocations';
import SecurityInsights from './SecurityInsights';

function StaffDetail({ staff, setCurrentPage }) {

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(staff);

    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'permissions', label: 'Permissions' },
        { id: 'assigned_task', label: 'Assigned Task' },
        { id: 'login_history', label: 'Login History' },
        { id: 'documents', label: 'Documents' },
    ];

    // right side cards - rendering
    const staffRightColumnMap = {
        overview: ['accountStatus', 'quickActions'],
        permissions: ['roleInfo', 'roleInfo', 'permissionSummary', 'permissionNotes'],
        assigned_task: ['taskSummary', 'overdueTasks', 'upcomingTasks', 'quickActions'],
        login_history: ['loginSummary', 'topLocations', 'securityInsights', 'loginNotes'],
        documents: ['documentSummary', 'expiringSoon', 'quickActions', 'documentNotes'],
    };

    const quickActionsByTab = {
        overview: [
            { label: "Reset Password", icon: Lock, onClick: () => { } },
            { label: "Login As Staff", icon: UserCog, onClick: () => { } },
            { label: "Deactivate Account", icon: UserX, onClick: () => { }, variant: 'danger' },
            { label: "Delete Account", icon: Trash2, onClick: () => { }, variant: 'danger' },
        ],
        assigned_task: [
            { label: "Assigned New Task", icon: Plus, onClick: () => { } },
            { label: "View All Tasks", icon: Menu, onClick: () => { } },
        ],
        documents: [
            { label: "Upload Document", icon: Download, onClick: () => { } },
            { label: "Request New Document", icon: File, onClick: () => { } },
            { label: "View Document Log", icon: Clock3, onClick: () => { } },
        ],
    };

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
                backLabelOnMob="Back"
            />

            {/* staff detail */}
            <div className="grid grid-cols-1 xl:grid-cols-3 pb-6 gap-6 items-start">

                {/* left side - section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">

                        {/* Header Section */}
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">

                            {/* Left Section */}
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                <img
                                    src={staff.avatar || null}
                                    alt={staff.name}
                                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shrink-0"
                                />

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-sm md:text-lg font-bold text-slate-900 wrap-break-word">
                                            {staff.name}
                                        </h2>

                                        {staff.status === "active" && (
                                            <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-md whitespace-nowrap">
                                                Active
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                                        Staff ID:
                                        <span className="ml-1 font-semibold text-slate-900">
                                            {staff.staffId || "--"}
                                        </span>
                                    </p>

                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        <span className="text-xs sm:text-sm text-slate-500">
                                            Role:
                                        </span>

                                        <span
                                            className={`${roleStyle.bg} ${roleStyle.text} border ${roleStyle.border} text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap`}
                                        >
                                            {staff.role}
                                        </span>
                                    </div>

                                    <p className="mt-1 text-xs sm:text-sm text-slate-500 break-all">
                                        Email:
                                        <span className="ml-1 text-slate-900">
                                            {staff.email || "--"}
                                        </span>
                                    </p>

                                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                                        Contact:
                                        <span className="ml-1 text-slate-900">
                                            {staff.phone || "--"}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Right Section */}
                            <div className="flex flex-wrap gap-3 justify-start lg:justify-end shrink-0">
                                {!isEditing ? (
                                    <button
                                        onClick={handleEditClick}
                                        className="px-4 py-2 text-sm font-medium rounded-xl border border-amber-200 text-[#D97706] hover:bg-amber-50 transition-colors"
                                    >
                                        Edit Staff
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

                        {/* Tabs */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">

                    {/* acc status */}
                    {staffRightColumnMap[activeTab].includes('accountStatus') && (
                        <AccountStatusCard fields={[
                            { label: 'Status', value: staff.status, type: 'badge' },
                            { label: 'Last Login', value: staff.lastLogin, type: 'text' },
                            { label: 'Login IP Address', value: staff.loginIp, type: 'text' },
                            { label: 'Account Created On', value: staff.accCreatedOn, type: 'text' },
                            { label: 'Email Verified', value: staff.emailVerified, type: 'badge' },
                            { label: 'Phone Verified', value: staff.phoneVerified, type: 'badge' },
                        ]}
                        />
                    )}

                    {/* permission - role info */}
                    {staffRightColumnMap[activeTab].includes('roleInfo') && (
                        <RoleInformation
                            roleName="Admin"
                            roleDescription="Full access to all modules and features."
                            roleLevel="Super Admin"
                            createdOn="Apr 20, 2024 11:20 AM"
                        />
                    )}

                    {/* permission - donut */}
                    {staffRightColumnMap[activeTab].includes('permissionSummary') && (
                        <SummaryDonutCard
                            title="Permission Summary"
                            centerValue="46"
                            centerLabel="Total Permissions"
                            showPercentage={false}
                            segments={[
                                { name: 'Granted', value: 67, color: '#10B981' },
                                { name: 'Restricted', value: 8, color: '#3B82F6' },
                                { name: 'Not Set', value: 6, color: '#F59E0B' },
                            ]}
                        />
                    )}

                    {/* assigned task - donut */}
                    {staffRightColumnMap[activeTab].includes('taskSummary') && (
                        <SummaryDonutCard
                            title="Task Summary"
                            centerValue="46"
                            centerLabel="Total Task"
                            showPercentage={false}
                            segments={[
                                { name: 'In Progress', value: 67, color: '#10B981' },
                                { name: 'Pending', value: 8, color: '#3B82F6' },
                                { name: 'Not Started', value: 6, color: '#F59E0B' },
                                { name: 'Completed', value: 6, color: '#F59E0B' }
                            ]}
                        />
                    )}

                    {/* assigned task - over due task */}
                    {staffRightColumnMap[activeTab].includes('overdueTasks') && (
                        <OverdueTasks tasks={[
                            { count: 2, title: 'Approve Vehicle Listings', dueDate: 'May 12, 2024' },
                            { count: 1, title: 'Review New Seller Registrations', dueDate: 'May 10, 2024' }
                        ]} />
                    )}

                    {/* assigned task - upcoming task */}
                    {staffRightColumnMap[activeTab].includes('upcomingTasks') && (
                        <UpcomingTasks tasks={[
                            { title: 'Verify Payments', dueDate: 'May 16, 2024' },
                            { title: 'Generate Reports', dueDate: 'May 17, 2024' }
                        ]} />
                    )}

                    {/* document - donut */}
                    {staffRightColumnMap[activeTab].includes('documentSummary') && (
                        <SummaryDonutCard
                            title="Document Summary"
                            centerValue="46"
                            centerLabel="Total Documents"
                            showPercentage={false}
                            segments={[
                                { name: 'Verified', value: 67, color: '#10B981' },
                                { name: 'Approved', value: 8, color: '#3B82F6' },
                                { name: 'Pending', value: 6, color: '#F59E0B' },
                                { name: 'Rejected', value: 6, color: '#F59E0B' }
                            ]}
                        />
                    )}

                    {/* document - exp soon */}
                    {staffRightColumnMap[activeTab].includes('expiringSoon') && (
                        <ExpiringSoon
                            documents={[
                                { name: 'Emirates ID Front.pdf', expiryMessage: 'Expires in 25 days', date: 'Jun 15, 2024', urgency: 'high' },
                                { name: 'Emirates ID Back.pdf', expiryMessage: 'Expires in 25 days', date: 'Jun 15, 2024', urgency: 'high' },
                                { name: 'Passport Copy.pdf', expiryMessage: 'Expires in 12 months', date: 'May 12, 2025', urgency: 'medium' }
                            ]}
                        />
                    )}

                    {/* login - donut */}
                    {staffRightColumnMap[activeTab].includes('loginSummary') && (
                        <SummaryDonutCard
                            title="Login Summary"
                            centerValue="46"
                            centerLabel="Total Logins"
                            showPercentage={false}
                            segments={[
                                { name: 'Successful', value: 67, color: '#10B981' },
                                { name: 'Failed', value: 8, color: '#3B82F6' },
                                { name: 'Blocked', value: 6, color: '#F59E0B' },
                            ]}
                        />
                    )}

                    {/* login - top location */}
                    {staffRightColumnMap[activeTab].includes('topLocations') && (
                        <TopLocations
                            locations={[
                                { name: 'Dubai, UAE', count: 26, percentage: 54, Flag: AE },
                                { name: 'Sharjah, UAE', count: 12, percentage: 25, Flag: AE },
                                { name: 'Abu Dhabi, UAE', count: 5, percentage: 10, Flag: AE },
                                { name: 'London, UK', count: 3, percentage: 6, Flag: GB },
                                { name: 'Others', count: 2, percentage: 5, Flag: Globe }
                            ]}
                        />
                    )}

                    {/* login - security inn */}
                    {staffRightColumnMap[activeTab].includes('securityInsights') && (
                        <SecurityInsights
                            insights={[
                                { type: 'success', message: 'No suspicious activities found', status: 'Great!' },
                                { type: 'warning', message: '3 failed login attempts', action: 'Review' },
                                { type: 'info', message: '1 account locked attempt', action: 'Review' }
                            ]}
                        />
                    )}

                    {/* quick action */}
                    {staffRightColumnMap[activeTab].includes('quickActions') && (
                        <QuickActionsCard actions={quickActionsByTab[activeTab] || []} />
                    )}

                    {/* notes - permission */}
                    {staffRightColumnMap[activeTab].includes('permissionNotes') && (
                        <NotesSection message="Changes made here will apply immediately to this staff member. Make sure to review permissions carefully to maintain data security.">
                            <button className="bg-blue-600 text-white px-2 py-1.5 rounded-lg text-[13px] font-medium">
                                Save Changes
                            </button>
                            <button className="bg-white border border-gray-300 px-2 py-2 rounded-lg text-[13px] font-medium text-gray-700">
                                Reset to Role Defaults
                            </button>
                        </NotesSection>
                    )}

                    {/* notes - doc */}
                    {staffRightColumnMap[activeTab].includes('documentNotes') && (
                        <NotesSection message="Ensure all documents are up to date. Expired documents may restrict access." />
                    )}

                    {/* notes - login */}
                    {staffRightColumnMap[activeTab].includes('loginNotes') && (
                        <NotesSection message="All times are shown in (UTC +04:00) Gulf Standard Time (GST)" />
                    )}

                </div>
            </div>
        </div>
    )
}

export default StaffDetail;