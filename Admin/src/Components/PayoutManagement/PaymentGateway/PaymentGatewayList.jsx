
import React, { useState } from 'react';
import { Edit2, Eye, MoreVertical, X, EyeOff, Copy, Info } from 'lucide-react';
import { FaStripe, FaPaypal, FaMoneyBillWave } from "react-icons/fa";
import { SiRazorpay, SiSquare, SiWise } from "react-icons/si";
import { allPaymentGateways } from '../../Data';

function PaymentGatewayList({ setCurrentPage, setSelectedGatewayId }) {

    // edit
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedGateway, setSelectedGateway] = useState(null);
    const [editForm, setEditForm] = useState(null);

    const [showApiKey, setShowApiKey] = useState(false);
    const [showPublishableKey, setShowPublishableKey] = useState(false);
    const [showWebhookSecret, setShowWebhookSecret] = useState(false);

    const handleEditClick = (gateway) => {
        setSelectedGateway(gateway);
        setEditForm({
            name: gateway.name,
            description: gateway.description,
            websiteUrl: gateway.websiteUrl,
            status: gateway.status,
            environment: gateway.environment,
            apiKey: gateway.apiKey,
            publishableKey: gateway.publishableKey,
            webhookUrl: gateway.webhookUrl,
            webhookSecret: gateway.webhookSecret,
            testMode: gateway.testMode,
            retryFailedWebhooks: gateway.retryFailedWebhooks,
        });
        setIsEditModalOpen(true);
    };

    const handleCancel = () => {
        setIsEditModalOpen(false);
        setSelectedGateway(null);
        setEditForm(null);
        setShowApiKey(false);
        setShowPublishableKey(false);
        setShowWebhookSecret(false);
    };

    const handleSave = () => {
        handleCancel();
    };

    const handleFieldChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div>
            {/* table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left table-fixed">
                    <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4 w-60">Gateway</th>
                            <th className="px-6 py-4 w-40">Provider</th>
                            <th className="px-6 py-4 w-40">Status</th>
                            <th className="px-6 py-4 w-40">Environment</th>
                            <th className="px-6 py-4 w-40">Supported Currency</th>
                            <th className="px-6 py-4 w-40">Transactions (This Month)</th>
                            <th className="px-6 py-4 w-40">Success Rate</th>
                            <th className="px-6 py-4 w-40">Last Updated</th>
                            <th className="px-6 py-4 w-30">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-amber-50">
                        {allPaymentGateways.map((payment, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50/50 transition-colors"
                            >
                                {/* Gateway Name & ID */}
                                <td className="px-6 py-4 w-45">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 
                                        ${payment.name === "Stripe" ? "bg-indigo-50 text-indigo-600" :
                                                payment.name === "PayPal" ? "bg-blue-50 text-blue-600" :
                                                    payment.name === "Razorpay" ? "bg-cyan-50 text-cyan-600" :
                                                        payment.name === "Paystack" ? "bg-sky-50 text-sky-500" :
                                                            payment.name === "Square" ? "bg-slate-100 text-slate-900" :
                                                                "bg-emerald-50 text-emerald-600"
                                            }`}>
                                            {payment.name === "Stripe" && <FaStripe />}
                                            {payment.name === "PayPal" && <FaPaypal />}
                                            {payment.name === "Razorpay" && <SiRazorpay />}
                                            {payment.name === "Paystack" && <FaMoneyBillWave />}
                                            {payment.name === "Square" && <SiSquare />}
                                            {payment.name === "Wise" && <SiWise />}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900 text-sm">{payment.name}</div>
                                            <div className="text-xs text-slate-500 font-mono">ID: {payment.id}</div>
                                        </div>
                                    </div>
                                </td>

                                {/* Provider */}
                                <td className="px-6 py-4 w-60 text-sm text-slate-700">
                                    {payment.company}
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4 w-40">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${payment.status === "Active" ? "bg-green-50 text-green-700" :
                                        payment.status === "Inactive" ? "bg-amber-50 text-amber-700" :
                                            "bg-red-50 text-red-700"
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${payment.status === "Active" ? "bg-green-600" :
                                            payment.status === "Inactive" ? "bg-amber-500" :
                                                "bg-red-500"
                                            }`}></span>
                                        {payment.status}
                                    </span>
                                </td>

                                {/* Environment */}
                                <td className="px-6 py-4 w-40">
                                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium ${payment.environment === "Live" ? "bg-emerald-50 text-emerald-700" : "bg-sky-50 text-sky-700"
                                        }`}>
                                        {payment.environment}
                                    </span>
                                </td>

                                {/* Supported Currencies */}
                                <td className="px-6 py-4 w-45 text-xs text-slate-700">
                                    <div className="font-medium">{payment.currencies}</div>
                                    {/* <div className="text-slate-400 mt-0.5">+{payment.additionalCurrenciesCount} more</div> */}
                                </td>

                                {/* Transactions */}
                                <td className="px-6 py-4 w-40 text-sm font-medium text-slate-900">
                                    {payment.transactions}
                                </td>

                                {/* Success Rate */}
                                <td className="px-6 py-4 w-35 text-xs">
                                    <div className="flex justify-between mb-1">
                                        <span className={`font-semibold ${payment.successRate === "45.6%" ? "text-red-600" : "text-slate-700"}`}>
                                            {payment.successRate}
                                        </span>
                                    </div>
                                    <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${payment.successRate === "—" ? "w-0" :
                                                payment.successRate === "45.6%" ? "bg-red-500 w-[45.6%]" : "bg-green-600"
                                                }`}
                                            style={{ width: payment.successRate !== "—" && payment.successRate !== "45.6%" ? payment.successRate : undefined }}
                                        ></div>
                                    </div>
                                </td>

                                {/* Last Updated */}
                                <td className="px-6 py-4 w-35 text-xs text-slate-600">
                                    <div>{payment.date}</div>
                                    <div className="text-slate-400">{payment.time}</div>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4 w-30">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <button
                                            onClick={() => {
                                                setSelectedGatewayId(payment.id)
                                                setCurrentPage('payment-gateways-detail')
                                            }}
                                            className="p-1 hover:text-slate-800 transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => handleEditClick(payment)}
                                            className="p-1 hover:text-slate-800 transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>

                                        <button className="p-1 hover:text-slate-800 transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>


                </table>
            </div>

            {/* ============== edit modal =============== */}
            {isEditModalOpen && editForm && (
                <div className="fixed inset-0 z-70 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <div>
                                <h2 className="text-lg font-bold text-[#0B1E3D]">Edit Payment Gateway</h2>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    {selectedGateway.name} <span className="mx-1 text-slate-300">•</span> {selectedGateway.id}
                                </p>
                            </div>

                            <button
                                onClick={handleCancel}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="max-h-[calc(90vh-140px)] overflow-y-auto px-6 py-5">

                            {/* Basic Information */}
                            <div>
                                <div className="mb-4">
                                    <h3 className="text-sm font-bold text-[#0B1E3D]">Basic Information</h3>
                                    <p className="mt-1 text-xs text-slate-500">Update the basic details of your payment gateway.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    {/* Gateway Name */}
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600">Gateway Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => handleFieldChange('name', e.target.value)}
                                            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#D97706] focus:ring-2 focus:ring-amber-100" />
                                    </div>

                                    {/* Gateway Code */}
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600">Gateway Code</label>
                                        <input
                                            type="text"
                                            value={selectedGateway.code}
                                            disabled
                                            className="mt-1.5 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-400" />
                                        <p className="mt-1 text-[10px] text-slate-400">Cannot be changed after creation</p>
                                    </div>

                                    {/* Description */}
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-semibold text-slate-600">Description</label>
                                        <textarea
                                            value={editForm.description}
                                            onChange={(e) => handleFieldChange('description', e.target.value)}
                                            rows={2}
                                            className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                        />
                                    </div>

                                    {/* Website */}
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-semibold text-slate-600">Website URL</label>
                                        <input
                                            type="text"
                                            value={editForm.websiteUrl}
                                            onChange={(e) => handleFieldChange('websiteUrl', e.target.value)}
                                            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                        />
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600">Status</label>
                                        <select
                                            value={editForm.status}
                                            onChange={(e) => handleFieldChange('status', e.target.value)}
                                            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#D97706] focus:ring-2 focus:ring-amber-100">
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>

                                    {/* Environment */}
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600">Environment</label>
                                        <select
                                            value={editForm.environment}
                                            onChange={(e) => handleFieldChange('environment', e.target.value)}
                                            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                        >
                                            <option value="Live">Live</option>
                                            <option value="Test">Test</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Configuration */}
                            <div className="mt-6 border-t border-slate-100 pt-6">
                                <div className="mb-4">
                                    <h3 className="text-sm font-bold text-[#0B1E3D]">Configuration</h3>
                                    <p className="mt-1 text-xs text-slate-500">Manage API credentials and webhook configuration.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    {/* API Key */}
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600">API Key <span className="text-red-500">*</span></label>
                                        <div className="relative mt-1.5">
                                            <input
                                                type={showApiKey ? 'text' : 'password'}
                                                value={editForm.apiKey}
                                                onChange={(e) => handleFieldChange('apiKey', e.target.value)}
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowApiKey(!showApiKey)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Publishable Key */}
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600">Publishable Key <span className="text-red-500">*</span></label>
                                        <div className="relative mt-1.5">
                                            <input
                                                type={showPublishableKey ? 'text' : 'password'}
                                                value={editForm.publishableKey}
                                                onChange={(e) => handleFieldChange('publishableKey', e.target.value)}
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPublishableKey(!showPublishableKey)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showPublishableKey ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Webhook URL */}
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-semibold text-slate-600">Webhook URL <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={editForm.webhookUrl}
                                            onChange={(e) => handleFieldChange('webhookUrl', e.target.value)}
                                            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                        />
                                    </div>

                                    {/* Webhook Secret */}
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-semibold text-slate-600">Webhook Secret</label>
                                        <div className="relative mt-1.5">
                                            <input
                                                type={showWebhookSecret ? 'text' : 'password'}
                                                value={editForm.webhookSecret}
                                                onChange={(e) => handleFieldChange('webhookSecret', e.target.value)}
                                                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 pr-10 text-sm text-slate-700 outline-none transition focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showWebhookSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Advanced Settings */}
                            <div className="mt-6 border-t border-slate-100 pt-6">
                                <div className="mb-4">
                                    <h3 className="text-sm font-bold text-[#0B1E3D]">Advanced Settings</h3>
                                    <p className="mt-1 text-xs text-slate-500">Configure additional gateway and webhook behavior.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    {/* Test Mode */}
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600">
                                            Test Mode
                                        </label>
                                        <select
                                            value={editForm.testMode}
                                            onChange={(e) => handleFieldChange('testMode', e.target.value)}
                                            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                        >
                                            <option value="Enabled">Enabled</option>
                                            <option value="Disabled">Disabled</option>
                                        </select>
                                    </div>

                                    {/* Retry Failed Webhooks */}
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600">
                                            Retry Failed Webhooks
                                        </label>
                                        <select
                                            value={editForm.retryFailedWebhooks}
                                            onChange={(e) => handleFieldChange('retryFailedWebhooks', e.target.value)}
                                            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#D97706] focus:ring-2 focus:ring-amber-100"
                                        >
                                            <option value="Enabled">Enabled</option>
                                            <option value="Disabled">Disabled</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Warning Note */}
                            <div className="mt-6 flex gap-3 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3">
                                <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-amber-100 text-center text-[10px] font-bold leading-4 text-amber-700">
                                    <Info className='w-4 h-4' />
                                </div>
                                <p className="text-xs leading-5 text-amber-700">
                                    Changes to API keys or webhook settings may affect payment processing.
                                    Please ensure all details are correct before saving.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                            <button
                                onClick={handleCancel}
                                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-800">
                                Cancel
                            </button>

                            <button
                                onClick={handleSave}
                                className="rounded-lg bg-[#D97706] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#B45309]">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PaymentGatewayList;