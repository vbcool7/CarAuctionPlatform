
import React, { useState } from 'react';
import FormPageHeader from '../Shared/FormPageHeader';
import InputField from '../Shared/InputField';

import toast from 'react-hot-toast';
import { useAddNewManager } from '../../../hooks/useManager';

function AddNewManagerForm({ setCurrentPage }) {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        profilePhoto: null,
        permissions: {
            manageAuctions: false,
            manageBids: false,
            manageVehicles: false,
        },
    });

    const { mutate: addManager, isPending: isAdding } = useAddNewManager();

    // field update
    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleCreate = () => {

        const { name, email, password, permissions } = formData;

        if (!name || !email || !password) {
            return toast.error("All fields are required");
        }

        const hasPermission = Object.values(permissions).some(
            (permission) => permission === true
        );

        if (!hasPermission) {
            return toast.error("Please select at least one permission");
        }

        const payload = new FormData();

        payload.append("name", formData.name);
        payload.append("email", formData.email);
        payload.append("password", formData.password);

        if (formData.profilePhoto) {
            payload.append("profilePhoto", formData.profilePhoto);
        }

        payload.append(
            "permissions",
            JSON.stringify(formData.permissions)
        );

        addManager(payload, {
            onSuccess: (res) => {
                toast.success("Manager added successfully");

                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    profilePhoto: null,
                    permissions: {
                        manageAuctions: false,
                        manageBids: false,
                        manageVehicles: false,
                    },
                });

                setCurrentPage("manager");
            },

            onError: (err) => {
                console.error(err);

                toast.error(
                    err?.response?.data?.message ||
                    "Failed to add Manager"
                );
            },
        });
    };

    return (
        <div className='pb-6'>
            <FormPageHeader
                title="Add New Manager"
                breadcrumbItems={[
                    {
                        label: 'Dashboard',
                        onClick: () => setCurrentPage('dashboard')
                    },
                    {
                        label: 'Manager',
                        onClick: () => setCurrentPage('manager')
                    },
                    {
                        label: 'Add New Manager'
                    },
                ]}
                onBack={() => setCurrentPage('manager')}
                backLabel="Back to Manager"
            />

            {/* form container */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">

                {/* ================= LEFT SIDE ================= */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Manager Information */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">

                        <h2 className="text-base font-bold text-[#0B1E3D] mb-6">
                            Manager Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <InputField
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={updateField}
                                placeholder="Enter manager name"
                                required
                            />

                            <InputField
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={updateField}
                                placeholder="Enter manager email"
                                required
                            />

                            <InputField
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={updateField}
                                placeholder="Set manager password"
                                required
                            />

                        </div>
                    </div>


                    {/* Permissions */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm">

                        <h2 className="text-base font-bold text-[#0B1E3D] mb-6">
                            Permissions
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            {/* Manage Auctions */}
                            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                                <span className="text-sm text-slate-600">
                                    Manage Auctions
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            permissions: {
                                                ...prev.permissions,
                                                manageAuctions: !prev.permissions.manageAuctions,
                                            },
                                        }))
                                    }
                                    className={`relative w-11 h-6 rounded-full transition-colors ${formData.permissions.manageAuctions
                                        ? "bg-[#D97706]"
                                        : "bg-slate-200"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.permissions.manageAuctions
                                            ? "translate-x-5"
                                            : "translate-x-0"
                                            }`}
                                    />
                                </button>
                            </div>


                            {/* Manage Bids */}
                            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                                <span className="text-sm text-slate-600">
                                    Manage Bids
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            permissions: {
                                                ...prev.permissions,
                                                manageBids: !prev.permissions.manageBids,
                                            },
                                        }))
                                    }
                                    className={`relative w-11 h-6 rounded-full transition-colors ${formData.permissions.manageBids
                                        ? "bg-[#D97706]"
                                        : "bg-slate-200"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.permissions.manageBids
                                            ? "translate-x-5"
                                            : "translate-x-0"
                                            }`}
                                    />
                                </button>
                            </div>


                            {/* Manage Vehicles */}
                            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                                <span className="text-sm text-slate-600">
                                    Manage Vehicles
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            permissions: {
                                                ...prev.permissions,
                                                manageVehicles: !prev.permissions.manageVehicles,
                                            },
                                        }))
                                    }
                                    className={`relative w-11 h-6 rounded-full transition-colors ${formData.permissions.manageVehicles
                                        ? "bg-[#D97706]"
                                        : "bg-slate-200"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.permissions.manageVehicles
                                            ? "translate-x-5"
                                            : "translate-x-0"
                                            }`}
                                    />
                                </button>
                            </div>

                        </div>
                    </div>

                </div>

                {/* ================= RIGHT SIDE ================= */}
                <div className="space-y-6">

                    {/* Profile Photo */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-md">

                        <h2 className="text-base font-bold text-[#0B1E3D] mb-5">
                            Profile Photo
                        </h2>

                        <InputField
                            label="Upload Photo"
                            name="profilePhoto"
                            type="file"
                            value={formData.profilePhoto}
                            onChange={updateField}
                            placeholder="JPG, JPEG or PNG. Max size 5MB."
                        />

                        <p className="text-xs text-slate-400 mt-2">
                            Use a clear professional photo for the manager profile.
                        </p>

                    </div>


                    {/* Guidelines */}
                    <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-md">

                        <h2 className="text-base font-bold text-[#0B1E3D] mb-4">
                            Guidelines
                        </h2>

                        <ul className="space-y-3 text-sm text-slate-500">

                            <li className="flex gap-2">
                                <span className="text-[#D97706]">•</span>
                                <span>
                                    Enter the manager's correct name and active email address.
                                </span>
                            </li>

                            <li className="flex gap-2">
                                <span className="text-[#D97706]">•</span>
                                <span>
                                    Set a secure password that will be shared with the manager by email.
                                </span>
                            </li>

                            <li className="flex gap-2">
                                <span className="text-[#D97706]">•</span>
                                <span>
                                    Assign only the permissions required for the manager's responsibilities.
                                </span>
                            </li>

                            <li className="flex gap-2">
                                <span className="text-[#D97706]">•</span>
                                <span>
                                    Make sure the profile photo is clear and within the allowed file size.
                                </span>
                            </li>

                        </ul>

                    </div>

                </div>

            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">

                <button
                    type="button"
                    onClick={() => setCurrentPage('manager')}
                    className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    onClick={handleCreate}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-[#D97706] rounded-lg hover:bg-[#B45309] transition-colors"
                >
                    Create Manager
                </button>

            </div>
        </div>
    );
}

export default AddNewManagerForm;