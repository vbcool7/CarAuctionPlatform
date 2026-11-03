
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { CheckCircle } from 'lucide-react';

import { useGetMyDispute, useRespondToDispute, useWithdrawDispute } from '../../hook/useDispute';
import { formatDateTime, formatPrice } from '../../utils/formatters';
import { STATUS_META, OUTCOME_LABEL, checkEvidenceFiles } from '../../utils/disputeIcons';
import EvidencePicker from '../SharedComponents/EvidencePicker';
import EvidenceList from '../SharedComponents/EvidenceList';

const MIN_RESPONSE = 10;
const MAX_DESC = 2000;

const TIMELINE_LABEL = {
    open: 'Dispute raised',
    response: 'Other party responded',
    under_review: 'Review started by our team',
    resolved: 'Resolved',
    rejected: 'Rejected',
    closed: 'Closed',
    withdrawn: 'Withdrawn by the person who raised it',
};

function Card({ title, children }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-[#0B1E3D]">{title}</h3>
            </div>
            <div className="px-4 py-3 text-[13px]">{children}</div>
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex justify-between gap-4 py-1">
            <span className="text-gray-500 shrink-0">{label}</span>
            <span className="font-medium text-gray-800 text-right break-all">{value || '—'}</span>
        </div>
    );
}

function DisputeDetail({ disputeId, setCurrentPage, backPage = 'disputes' }) {

    const { data, isLoading, isError } = useGetMyDispute(disputeId);
    const respond = useRespondToDispute();
    const withdraw = useWithdrawDispute();

    const [text, setText] = useState('');
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');

    const d = data?.dispute;

    const back = (
        <button onClick={() => setCurrentPage(backPage)} className="flex items-center gap-1 text-xs md:text-sm text-gray-500 hover:text-[#0B1E3D]">
            ← Back to Disputes
        </button>
    );

    if (isLoading) return <div className="pb-6 space-y-6">{back}<p className="text-sm text-slate-500">Loading dispute...</p></div>;
    if (isError || !d) return <div className="pb-6 space-y-6">{back}<p className="text-sm text-red-600">Could not load this dispute.</p></div>;

    const meta = STATUS_META[d.status] || STATUS_META.closed;
    const busy = respond.isPending || withdraw.isPending;
    const counterLabel = d.counterparty?.role === 'seller' ? 'Seller' : 'Buyer';

    const submitResponse = (e) => {
        e.preventDefault();
        const desc = text.trim();
        if (desc.length < MIN_RESPONSE) return setError(`Please write at least ${MIN_RESPONSE} characters`);
        const fileErr = checkEvidenceFiles(files);
        if (fileErr) return setError(fileErr);
        setError('');

        respond.mutate({ id: d._id, description: desc, files }, {
            onSuccess: (res) => { toast.success(res?.message || 'Response submitted'); setText(''); setFiles([]); },
            onError: (err) => setError(err?.response?.data?.message || 'Could not submit your response'),
        });
    };

    const doWithdraw = () => {
        if (!window.confirm('Withdraw this dispute? You will not be able to raise another dispute on this order.')) return;
        withdraw.mutate(d._id, {
            onSuccess: (res) => toast.success(res?.message || 'Dispute withdrawn'),
            onError: (err) => toast.error(err?.response?.data?.message || 'Could not withdraw the dispute'),
        });
    };

    return (
        <div className="pb-6 space-y-6">

            {back}

            <div className="flex flex-col gap-1">
                <h1 className="text-xl md:text-2xl font-bold">Dispute {d.disputeId}</h1>
                <p className="text-xs md:text-sm text-gray-600">
                    Order {d.orderNumber} · {d.iRaised ? 'Raised by you' : 'Raised against you'}
                </p>
            </div>

            {d.resolution && (
                <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
                    <CheckCircle size={18} className="mt-0.5 text-gray-500 shrink-0" />
                    <div className="text-sm text-gray-700">
                        <p className="font-semibold">
                            {meta.label}
                            {d.resolution.outcome ? ` · ${OUTCOME_LABEL[d.resolution.outcome]}` : ''}
                        </p>
                        {d.resolution.note && <p className="mt-1 text-[13px] break-words">{d.resolution.note}</p>}
                        {d.resolution.at && <p className="mt-1 text-[11px] text-gray-400">{formatDateTime(d.resolution.at)}</p>}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 space-y-6">

                    <Card title="Complaint">
                        <p className="whitespace-pre-wrap break-words text-gray-800">{d.description}</p>
                        <p className="mt-4 mb-2 text-[11px] font-semibold uppercase text-gray-400">Attachments</p>
                        <EvidenceList files={d.evidence} />
                    </Card>

                    <Card title={d.iRaised ? `Response from ${counterLabel}` : 'Your Response'}>
                        {d.response ? (
                            <>
                                <p className="whitespace-pre-wrap break-words text-gray-800">{d.response.description}</p>
                                <p className="mt-1 text-[11px] text-gray-400">{formatDateTime(d.response.at)}</p>
                                <p className="mt-4 mb-2 text-[11px] font-semibold uppercase text-gray-400">Attachments</p>
                                <EvidenceList files={d.response.evidence} />
                            </>
                        ) : d.canRespond ? (
                            <form onSubmit={submitResponse} className="space-y-3">
                                <p className="text-xs text-gray-500">You can respond once. Share your side of the story and any proof.</p>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    maxLength={MAX_DESC}
                                    rows={4}
                                    disabled={busy}
                                    className="w-full rounded-lg border border-gray-200 p-2 text-[13px] outline-none focus:border-[#D97706]"
                                    placeholder="Your response..."
                                />
                                <EvidencePicker files={files} onChange={setFiles} disabled={busy} />
                                {error && <p className="text-[13px] text-red-600">{error}</p>}
                                <button type="submit" disabled={busy}
                                    className="rounded-lg bg-[#D97706] px-5 py-2 text-sm font-medium text-white hover:bg-[#B45309] disabled:opacity-50">
                                    {respond.isPending ? 'Submitting...' : 'Submit Response'}
                                </button>
                            </form>
                        ) : (
                            <p className="text-gray-400">{d.iRaised ? 'No response yet.' : 'No response was submitted.'}</p>
                        )}
                    </Card>

                    <Card title="Timeline">
                        <div>
                            {d.timeline.map((t, i) => (
                                <div key={`${t.status}-${i}`} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="w-2.5 h-2.5 mt-1.5 rounded-full bg-[#D97706] shrink-0" />
                                        {i < d.timeline.length - 1 && <div className="w-px flex-1 my-1 bg-gray-200" />}
                                    </div>
                                    <div className={i < d.timeline.length - 1 ? 'pb-4' : ''}>
                                        <p className="text-[13px] font-medium text-gray-900">{TIMELINE_LABEL[t.status] || t.status}</p>
                                        <p className="text-xs text-gray-400">{formatDateTime(t.at)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="Summary">
                        <div className="flex items-center justify-between pb-2">
                            <span className="text-gray-500">Status</span>
                            <span className={`px-2 py-0.5 rounded border text-[11px] font-medium ${meta.cls}`}>{meta.label}</span>
                        </div>
                        <Row label="Category" value={d.category?.name} />
                        <Row label="Order" value={d.orderNumber} />
                        <Row label="Amount" value={formatPrice(d.amount)} />
                        <Row label={counterLabel} value={d.counterparty?.name} />
                        <Row label="Raised On" value={formatDateTime(d.createdAt)} />
                    </Card>

                    {d.vehicleTitle && (
                        <Card title="Vehicle">
                            <div className="flex items-center gap-3">
                                <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                                    {d.vehicleImage && <img src={d.vehicleImage} alt="" className="w-full h-full object-cover" />}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#0B1E3D] truncate">{d.vehicleTitle}</p>
                                    <p className="text-[11px] text-gray-500">{d.listingId}</p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {d.canWithdraw && (
                        <Card title="Actions">
                            <button type="button" disabled={busy} onClick={doWithdraw}
                                className="w-full rounded-lg border border-red-200 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">
                                {withdraw.isPending ? 'Withdrawing...' : 'Withdraw Dispute'}
                            </button>
                            <p className="mt-2 text-[11px] text-gray-400">Withdrawing closes the dispute. You cannot raise another one on this order.</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DisputeDetail;