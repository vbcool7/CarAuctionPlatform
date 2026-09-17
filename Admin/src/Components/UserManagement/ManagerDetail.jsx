
import React, { useState, useEffect } from 'react';
import { Mail, ShieldCheck, User, CalendarDays, Loader2 } from 'lucide-react';
import FormPageHeader from './Shared/FormPageHeader';

import { useEditManagerPermissions, useGetManagerById, useGetAllManagers } from '../../hooks/useManager';
import toast from 'react-hot-toast';

function ManagerDetail({ setCurrentPage, managerId }) {

    const { data: managerData, isLoading, isError } = useGetManagerById(managerId);
    const { mutate: editPermissions, isPending: isUpdating } = useEditManagerPermissions();

    const manager = managerData?.data;

    const activePermissions = Object.entries(manager?.permissions || {})
        .filter(([, value]) => value === true);

    // fetch all active managers to detect permission conflicts
    const { data: allManagersData } = useGetAllManagers({ status: 'active', limit: 100 });

    const permissionKeys = [
        'manageAuctions',
        'manageBids',
        'manageVehicles',
        'manageUsers',
        'managePayments',
        'managePayouts',
        'manageReports'
    ];

    const [editedPermissions, setEditedPermissions] = useState(null);

    // sync local state once manager data arrives
    useEffect(() => {
        if (manager?.permissions) {
            setEditedPermissions(manager.permissions);
        }
    }, [manager]);

    // build map: permission -> name of OTHER active manager holding it
    const conflictMap = {};
    (allManagersData?.data || []).forEach((mgr) => {
        if (mgr._id === managerId) return; // skip self
        permissionKeys.forEach((key) => {
            if (mgr.permissions?.[key] === true) {
                conflictMap[key] = mgr.name;
            }
        });
    });

    const hasChanges = editedPermissions &&
        JSON.stringify(editedPermissions) !== JSON.stringify(manager?.permissions || {});

    const handleToggle = (key) => {
        if (conflictMap[key]) return; // can't toggle a taken permission
        setEditedPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        editPermissions(
            { id: managerId, permissions: editedPermissions },
            {
                onSuccess: (res) => {
                    toast.success(res.message || "Permissions updated successfully");
                },
                onError: (err) => {
                    const conflicts = err?.response?.data?.conflicts;
                    if (conflicts?.length) {
                        toast.error(
                            conflicts.map(c => `${c.permission} is already assigned to ${c.heldBy}`).join('\n')
                        );
                    } else {
                        toast.error(err?.response?.data?.message || "Failed to update permissions");
                    }
                }
            }
        );
    };

    if (isLoading) return <p className="p-10 text-center">Loading manager detail....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load manager detail</p>;

    return (
        <div>

            {/* Header */}
            <FormPageHeader
                title="Manager Details"
                breadcrumbItems={[
                    {
                        label: 'Dashboard',
                        onClick: () => setCurrentPage('dashboard')
                    },
                    {
                        label: 'Managers',
                        onClick: () => setCurrentPage('manager')
                    },
                    {
                        label: 'Manager Details'
                    },
                ]}
                onBack={() => setCurrentPage('manager')}
                backLabel="Back to Managers"
                backLabelOnMob="Back"
            />

            <div className="mt-6 space-y-5">

                {/* Manager Profile */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-4">

                            {/* Profile Image */}
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                                {manager?.profilePhoto ? (
                                    <img
                                        src={manager.profilePhoto}
                                        alt={manager.name || "Manager"}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-xl font-semibold text-gray-500">
                                        {manager?.name?.charAt(0).toUpperCase() || "M"}
                                    </span>
                                )}
                            </div>

                            {/* Name */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {manager?.name || "N/A"}
                                </h2>

                                <div className="flex items-center gap-1.5 mt-1">
                                    <Mail size={14} className="text-gray-400" />
                                    <p className="text-sm text-gray-500">
                                        {manager?.email || "N/A"}
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Status */}
                        <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${manager?.isActive
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-500"
                                }`}
                        >
                            {manager?.isActive ? "Active" : "Inactive"}
                        </span>

                    </div>
                </div>

                {/* Basic Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">

                    <div className="flex items-center gap-2 mb-5">
                        <User size={18} className="text-amber-600" />
                        <h3 className="text-sm font-semibold text-gray-800">
                            Basic Information
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                        <div>
                            <p className="text-xs text-gray-400 mb-1">
                                Full Name
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                                {manager?.name || "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-400 mb-1">
                                Email
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                                {manager?.email || "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-400 mb-1">
                                Role
                            </p>
                            <span className="inline-flex px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-semibold">
                                Auction Manager
                            </span>
                        </div>

                        <div>
                            <p className="text-xs text-gray-400 mb-1">
                                Joined On
                            </p>

                            {manager?.createdAt ? (
                                <div className="flex items-center gap-2">
                                    <CalendarDays
                                        size={14}
                                        className="text-gray-400"
                                    />

                                    <div>
                                        <p className="text-sm font-medium text-gray-700">
                                            {new Date(manager.createdAt).toLocaleDateString(
                                                "en-GB",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    timeZone: "Asia/Dubai"
                                                }
                                            )}
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            {new Date(manager.createdAt).toLocaleTimeString(
                                                "en-GB",
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                    timeZone: "Asia/Dubai"
                                                }
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">
                                    N/A
                                </p>
                            )}
                        </div>

                    </div>
                </div>

                {/* Permissions */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">

                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={18} className="text-amber-600" />
                            <h3 className="text-sm font-semibold text-gray-800">
                                Assigned Permissions
                            </h3>
                        </div>

                        {!manager?.isActive && (
                            <span className="text-xs text-red-500 font-medium">
                                Manager is deactivated — activate to edit permissions
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {permissionKeys.map((key) => {
                            const isChecked = !!editedPermissions?.[key];
                            const conflictName = conflictMap[key];
                            const isDisabled = !manager?.isActive || (!!conflictName && !isChecked);

                            const label = key.replace(/^manage/, "").replace(/([A-Z])/g, " $1").trim();

                            return (
                                <label
                                    key={key}
                                    className={`flex items-center gap-3 p-4 border rounded-lg ${isDisabled ? "bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed" : "border-gray-200 cursor-pointer hover:border-amber-300"
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        disabled={isDisabled}
                                        onChange={() => handleToggle(key)}
                                        className="w-4 h-4 accent-amber-600"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">{label}</p>
                                        {conflictName && !isChecked ? (
                                            <p className="text-xs text-red-500 mt-0.5">Assigned to: {conflictName}</p>
                                        ) : (
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {isChecked ? "Access granted" : "No access"}
                                            </p>
                                        )}
                                    </div>
                                </label>
                            );
                        })}
                    </div>

                    {manager?.isActive && (
                        <div className="flex justify-end mt-5">
                            <button
                                onClick={handleSave}
                                disabled={!hasChanges || isUpdating}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-amber-600 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUpdating && <Loader2 size={14} className="animate-spin" />}
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default ManagerDetail;