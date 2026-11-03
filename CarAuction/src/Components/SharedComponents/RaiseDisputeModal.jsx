
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';

import { useGetDisputeCategories, useRaiseDispute } from '../../hook/useDispute';
import { getDisputeIcon, checkEvidenceFiles } from '../../utils/disputeIcons';
import EvidencePicker from './EvidencePicker';

const MIN_DESC = 20;
const MAX_DESC = 2000;

// order = { _id, orderId } (jis order pe dispute uthana hai), role = order.dispute.role ('buyer' | 'seller')
// onRaised(dispute) success ke baad, onClose
function RaiseDisputeModal({ order, role, deadline, onClose, onRaised }) {

    const { data, isLoading, isError } = useGetDisputeCategories(role);
    const raise = useRaiseDispute();

    const [categoryId, setCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');

    const categories = data?.categories || [];
    const busy = raise.isPending;

    const close = () => { if (!busy) onClose(); };

    const submit = (e) => {
        e.preventDefault();
        const desc = description.trim();

        if (!categoryId) return setError('Please select a category');
        if (desc.length < MIN_DESC) return setError(`Please describe the problem (at least ${MIN_DESC} characters)`);
        const fileErr = checkEvidenceFiles(files);
        if (fileErr) return setError(fileErr);

        setError('');
        raise.mutate({ orderId: order._id, categoryId, description: desc, files }, {
            onSuccess: (res) => {
                toast.success(res?.message || 'Dispute raised');
                onRaised?.(res?.dispute);
                onClose();
            },
            onError: (err) => setError(err?.response?.data?.message || 'Could not raise the dispute'),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <form onSubmit={submit} className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl">

                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-base font-semibold text-[#0B1E3D]">Raise a Dispute</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Order {order?.orderId}</p>
                    </div>
                    <button type="button" onClick={close} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                </div>

                <p className="mt-3 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 text-[12px] text-amber-800">
                    Use this for problems with the payment or the order. For any other question, please contact Support.
                    {role === 'buyer'
                        ? ' While a dispute is open, the seller’s payout is on hold.'
                        : ' While a dispute is open, your payout for this order is on hold.'}
                    {deadline && <> You can raise a dispute until {new Date(deadline).toLocaleDateString('en-GB')}.</>}
                </p>

                <div className="mt-4">
                    <label className="block text-[13px] font-medium text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
                    {isLoading && <p className="text-xs text-gray-400">Loading categories...</p>}
                    {isError && <p className="text-xs text-red-500">Could not load categories</p>}
                    {!isLoading && !isError && categories.length === 0 && (
                        <p className="text-xs text-gray-500">No dispute categories are available right now. Please contact Support.</p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {categories.map((c) => {
                            const Icon = getDisputeIcon(c.icon);
                            const active = categoryId === c._id;
                            return (
                                <button
                                    key={c._id}
                                    type="button"
                                    disabled={busy}
                                    onClick={() => setCategoryId(c._id)}
                                    className={`flex items-start gap-2 rounded-lg border p-3 text-left transition-colors ${active ? 'border-[#D97706] bg-amber-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <Icon size={16} className={`mt-0.5 shrink-0 ${active ? 'text-[#D97706]' : 'text-gray-400'}`} />
                                    <span className="min-w-0">
                                        <span className="block text-[13px] font-medium text-gray-800">{c.name}</span>
                                        {c.description && <span className="block text-[11px] text-gray-500 line-clamp-2">{c.description}</span>}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">What happened? <span className="text-red-500">*</span></label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={MAX_DESC}
                        rows={5}
                        disabled={busy}
                        placeholder="Describe the problem clearly, with dates and amounts if relevant."
                        className="w-full rounded-lg border border-gray-200 p-2 text-[13px] outline-none focus:border-[#D97706]"
                    />
                    <p className="text-[11px] text-gray-400 text-right">{description.trim().length}/{MAX_DESC} (min {MIN_DESC})</p>
                </div>

                <div className="mt-3">
                    <EvidencePicker files={files} onChange={setFiles} disabled={busy} />
                </div>

                <p className="mt-4 text-[11px] text-gray-400">You can raise only one dispute per order. Once submitted, it cannot be edited, but you can withdraw it while it is open.</p>

                {error && <p className="mt-3 text-[13px] text-red-600">{error}</p>}

                <div className="mt-5 flex justify-end gap-2">
                    <button type="button" onClick={close} disabled={busy}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                        Cancel
                    </button>
                    <button type="submit" disabled={busy || categories.length === 0}
                        className="rounded-lg bg-[#D97706] px-5 py-2 text-sm font-medium text-white hover:bg-[#B45309] disabled:opacity-50">
                        {busy ? 'Submitting...' : 'Submit Dispute'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RaiseDisputeModal;