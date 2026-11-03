
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ChevronRight, ArrowLeft, CheckCircle, XCircle, Clock, AlertTriangle, ExternalLink, FileText, X } from 'lucide-react';

import { formatLabel, formatPrice, fmtDate, fmtTime } from '../../utils/formatter';
import { useGetDisputeDetail, useStartDisputeReview, useAddDisputeNote, useResolveDispute, } from '../../../hooks/useDispute';

const STATUS_META = {
    open: { label: 'Open', cls: 'bg-blue-100 text-blue-700' },
    under_review: { label: 'Under Review', cls: 'bg-amber-100 text-amber-700' },
    resolved: { label: 'Resolved', cls: 'bg-green-100 text-green-700' },
    rejected: { label: 'Rejected', cls: 'bg-rose-100 text-rose-700' },
    closed: { label: 'Closed', cls: 'bg-slate-100 text-slate-600' },
    withdrawn: { label: 'Withdrawn', cls: 'bg-slate-100 text-slate-500' },
};

const OUTCOME_LABEL = {
    refund_buyer: 'Buyer refunded (order canceled)',
    release_seller: 'Released to seller',
};

// confirm modal
const ACTION_META = {
    refund_buyer: {
        label: 'Refund Buyer',
        title: 'Refund the buyer',
        desc: 'Full amount Stripe se buyer ko refund hoga, order cancel hoga aur gaadi unsold ho jayegi. Ye wapas nahi hota.',
        btn: 'bg-red-600 hover:bg-red-700 text-white',
    },
    release_seller: {
        label: 'Release to Seller',
        title: 'Release to seller',
        desc: 'Dispute seller ke favour me close hoga. Payout ka hold hat jayega.',
        btn: 'bg-green-600 hover:bg-green-700 text-white',
    },
    reject: {
        label: 'Reject Dispute',
        title: 'Reject dispute',
        desc: 'Complaint reject hogi. Payout ka hold hat jayega.',
        btn: 'bg-rose-600 hover:bg-rose-700 text-white',
    },
    close: {
        label: 'Close Without Decision',
        title: 'Close without decision',
        desc: 'Bina kisi faisle ke dispute close hoga. Payout ka hold hat jayega.',
        btn: 'bg-slate-700 hover:bg-slate-800 text-white',
    },
};

const humanize = (s) => String(s || '').replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
const roleLabel = (r) => (r === 'seller' ? 'Seller' : 'Buyer');
const errMsg = (err) => err?.response?.data?.message || 'Something went wrong';

function Row({ label, value }) {
    return (
        <div className="flex justify-between gap-4">
            <span className="text-slate-500 shrink-0">{label}</span>
            <span className="font-medium text-slate-700 text-right break-all">{value || '—'}</span>
        </div>
    );
}

function Card({ title, children }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-[#0B1E3D]">{title}</h3>
            {children}
        </div>
    );
}

function Evidence({ files }) {
    if (!files?.length) return <p className="text-[12px] text-slate-400">No evidence attached.</p>;
    return (
        <div className="flex flex-wrap gap-2">
            {files.map((f, i) => (
                <a
                    key={`${f.url}-${i}`}
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    title={f.name || 'Evidence'}
                    className="block w-20 h-20 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden hover:border-[#D97706]"
                >
                    {f.kind === 'pdf' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-slate-500 p-1">
                            <FileText size={22} />
                            <span className="text-[9px] leading-tight text-center break-all line-clamp-2">{f.name || 'PDF'}</span>
                        </div>
                    ) : (
                        <img src={f.url} alt={f.name || ''} className="w-full h-full object-cover" />
                    )}
                </a>
            ))}
        </div>
    );
}

function AllDisputesDetail({ disputeId, setCurrentPage, setSelectedPaymentId }) {

    const { data, isLoading, isError } = useGetDisputeDetail(disputeId);
    const dispute = data?.dispute;

    const startReview = useStartDisputeReview();
    const addNote = useAddDisputeNote();
    const resolve = useResolveDispute();

    const [noteText, setNoteText] = useState('');
    const [modalAction, setModalAction] = useState(null);   // refund_buyer | release_seller | reject | close
    const [resolveNote, setResolveNote] = useState('');

    const backBtn = (
        <button
            onClick={() => setCurrentPage('all-disputes')}
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706]">
            <ArrowLeft size={16} />
            <span>Back to Disputes</span>
        </button>
    );

    if (isLoading) return <p className="p-10 text-center">Loading dispute....</p>;

    if (isError || !dispute) {
        return (
            <div className="p-6">
                <p className="text-sm text-slate-500">Dispute not found.</p>
                {backBtn}
            </div>
        );
    }

    const status = STATUS_META[dispute.status] || STATUS_META.closed;
    const { actions, order, payout } = dispute;
    const busy = startReview.isPending || addNote.isPending || resolve.isPending;

    const openPayment = () => {
        if (!order?._id) return;
        setSelectedPaymentId(order._id);
        setCurrentPage('all-payments-detail');
    };

    // review start
    const onStartReview = () => {
        startReview.mutate(dispute._id, {
            onSuccess: (r) => toast.success(r?.message || 'Review started'),
            onError: (err) => toast.error(errMsg(err)),
        });
    };

    // add note
    const onAddNote = () => {
        const note = noteText.trim();
        if (note.length < 3) return toast.error('Note is too short');
        addNote.mutate({ id: dispute._id, note }, {
            onSuccess: () => { setNoteText(''); toast.success('Note added'); },
            onError: (err) => toast.error(errMsg(err)),
        });
    };

    const closeModal = () => {
        if (resolve.isPending) return;
        setModalAction(null);
        setResolveNote('');
    };

    // resolve 
    const onConfirmResolve = () => {
        const note = resolveNote.trim();
        if (note.length < 3) return toast.error('Resolution note is required (both parties will see it)');
        resolve.mutate({ id: dispute._id, action: modalAction, note }, {
            onSuccess: (r) => {
                toast.success(r?.message || 'Dispute updated');
                setModalAction(null);
                setResolveNote('');
            },
            onError: (err) => toast.error(errMsg(err)),
        });
    };

    // jo buttons dikhane hain (backend `actions` ke hisaab se)
    const resolveButtons = [];
    if (actions?.canResolve) {
        if (actions.canRefund) resolveButtons.push('refund_buyer');
        resolveButtons.push('release_seller', 'reject');
    }
    if (actions?.canClose) resolveButtons.push('close');

    const modalMeta = modalAction ? ACTION_META[modalAction] : null;

    return (
        <div className="pb-6">

            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Dispute Details</h1>
                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage('dashboard')}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Dashboard
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className="text-slate-500">Dispute Management</span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span
                            onClick={() => setCurrentPage('all-disputes')}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            All Disputes
                        </span>

                        <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                        <span className="font-medium text-[#D97706]">{dispute.disputeId}</span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => setCurrentPage('all-disputes')}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-transparent p-2 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50">
                        <ArrowLeft size={16} />
                        <span className="text-[13px]">Back</span>
                    </button>
                    {order?._id && (
                        <button
                            onClick={openPayment}
                            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-transparent p-2 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-[#D97706] hover:text-[#D97706] hover:bg-amber-50">
                            <ExternalLink size={16} />
                            <span className="text-[13px]">View Payment</span>
                        </button>
                    )}
                </div>
            </div>

            {/* alerts */}
            {dispute.isStale && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <AlertTriangle size={18} className="mt-0.5 text-red-500 shrink-0" />
                    <p className="text-sm text-red-700">
                        <span className="font-semibold">Overdue.</span> Ye dispute {dispute.daysOpen} din se open hai. Payout abhi bhi hold par hai.
                    </p>
                </div>
            )}

            {dispute.resolution && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <CheckCircle size={18} className="mt-0.5 text-slate-500 shrink-0" />
                    <div className="text-sm text-slate-700">
                        <p className="font-semibold">
                            {STATUS_META[dispute.status]?.label || humanize(dispute.status)}
                            {dispute.resolution.outcome ? ` · ${OUTCOME_LABEL[dispute.resolution.outcome] || humanize(dispute.resolution.outcome)}` : ''}
                        </p>
                        <p className="mt-1 text-[13px] break-words">{dispute.resolution.note}</p>
                        <p className="mt-1 text-[11px] text-slate-500">
                            {dispute.resolution.by?.name ? `${dispute.resolution.by.name} · ` : ''}
                            {fmtDate(dispute.resolution.at)}, {fmtTime(dispute.resolution.at)}
                        </p>
                    </div>
                </div>
            )}

            {/* Summary strip */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div>
                    <p className="text-[11px] text-slate-500">Dispute ID</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{dispute.disputeId}</p>
                    <span className={`mt-1 inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${status.cls}`}>{status.label}</span>
                </div>
                <div>
                    <p className="text-[11px] text-slate-500">Category</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{dispute.category?.name || '—'}</p>
                    <p className="mt-2 text-[11px] text-slate-500">Order Amount</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{formatPrice(dispute.amount)}</p>
                </div>
                <div>
                    <p className="text-[11px] text-slate-500">Raised On</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{fmtDate(dispute.createdAt)}, {fmtTime(dispute.createdAt)}</p>
                    <p className="mt-2 text-[11px] text-slate-500">Open For</p>
                    <p className={`text-sm font-semibold ${dispute.isStale ? 'text-red-600' : 'text-[#0B1E3D]'}`}>
                        {dispute.daysOpen != null ? `${dispute.daysOpen} day(s)` : '—'}
                    </p>
                </div>
                <div>
                    <p className="text-[11px] text-slate-500">Reviewed By</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{dispute.reviewedBy?.name || '—'}</p>
                    <p className="mt-2 text-[11px] text-slate-500">Review Started</p>
                    <p className="text-sm font-semibold text-[#0B1E3D]">
                        {dispute.reviewStartedAt ? `${fmtDate(dispute.reviewStartedAt)}, ${fmtTime(dispute.reviewStartedAt)}` : '—'}
                    </p>
                </div>
            </div>

            {/* 3-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ============================ LEFT ============================ */}
                <div className="space-y-6">
                    <Card title={`Raised By (${roleLabel(dispute.raisedBy?.role)})`}>
                        <div className="space-y-2 text-[12px]">
                            <Row label="Name" value={dispute.raisedBy?.name} />
                            <Row label="Email" value={dispute.raisedBy?.email} />
                            <Row label="User Type" value={formatLabel(dispute.raisedBy?.type)} />
                        </div>
                    </Card>

                    <Card title={`Against (${roleLabel(dispute.against?.role)})`}>
                        <div className="space-y-2 text-[12px]">
                            <Row label="Name" value={dispute.against?.name} />
                            <Row label="Email" value={dispute.against?.email} />
                            <Row label="User Type" value={formatLabel(dispute.against?.type)} />
                        </div>
                    </Card>

                    <Card title="Order & Payout">
                        {order ? (
                            <div className="space-y-2 text-sm">
                                <Row label="Order ID" value={order.orderId} />
                                <Row label="Listing ID" value={dispute.listingId} />
                                <Row label="Sale Type" value={order.source === 'auction' ? 'Auction' : 'Buy Now'} />
                                <Row label="Order Status" value={formatLabel(order.status)} />
                                <Row label="Handover" value={formatLabel(order.handoverStatus)} />
                                <Row label="Paid On" value={order.paidAt ? `${fmtDate(order.paidAt)}, ${fmtTime(order.paidAt)}` : null} />
                                <Row label="Payout" value={payout ? `${payout.payoutId} (${formatLabel(payout.status)})` : null} />
                                <Row label="Payout Hold" value={payout ? (payout.disputeHold ? 'On hold' : 'No hold') : null} />
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400">Order record not found.</p>
                        )}
                    </Card>

                    {dispute.vehicleTitle && (
                        <Card title="Vehicle">
                            <div className="flex items-center gap-3">
                                <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                                    {dispute.vehicleImage && (
                                        <img src={dispute.vehicleImage} alt="" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#0B1E3D] truncate">{dispute.vehicleTitle}</p>
                                    <p className="text-[11px] text-slate-500">{dispute.listingId}</p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {/* ============================ MIDDLE ============================ */}
                <div className="space-y-6">
                    <Card title="Complaint">
                        <p className="text-[13px] text-[#0B1E3D] whitespace-pre-wrap break-words">{dispute.description || '—'}</p>
                        <p className="mt-4 mb-2 text-[11px] font-semibold uppercase text-slate-400">Evidence</p>
                        <Evidence files={dispute.evidence} />
                    </Card>

                    <Card title={`Response from ${roleLabel(dispute.against?.role)}`}>
                        {dispute.response ? (
                            <>
                                <p className="text-[13px] text-[#0B1E3D] whitespace-pre-wrap break-words">{dispute.response.description}</p>
                                <p className="mt-1 text-[11px] text-slate-500">{fmtDate(dispute.response.at)}, {fmtTime(dispute.response.at)}</p>
                                <p className="mt-4 mb-2 text-[11px] font-semibold uppercase text-slate-400">Evidence</p>
                                <Evidence files={dispute.response.evidence} />
                            </>
                        ) : (
                            <p className="text-[13px] text-slate-400">The other party has not responded yet.</p>
                        )}
                    </Card>

                    <Card title="Timeline">
                        {dispute.timeline?.length > 0 ? (
                            <div className="space-y-4">
                                {dispute.timeline.map((t, i) => {
                                    const bad = ['rejected', 'withdrawn'].includes(t.status);
                                    const good = ['resolved', 'closed'].includes(t.status);
                                    return (
                                        <div key={`${t.status}-${i}`} className="flex items-start gap-3">
                                            {bad ? <XCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
                                                : good ? <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                                                    : <Clock size={18} className="text-slate-400 mt-0.5 shrink-0" />}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[14px] font-medium text-[#0B1E3D]">
                                                    {humanize(t.status)}
                                                    <span className="ml-2 text-[10px] font-semibold uppercase text-slate-400">{humanize(t.by)}</span>
                                                </p>
                                                <p className="text-[11px] text-slate-500">{fmtDate(t.at)}, {fmtTime(t.at)}</p>
                                                {t.note && <p className="text-[12px] text-slate-500 mt-0.5 break-words">{t.note}</p>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400">No timeline available.</p>
                        )}
                    </Card>
                </div>

                {/* ============================ RIGHT ============================ */}
                <div className="space-y-6">
                    <Card title="Actions">
                        {(actions?.canStartReview || resolveButtons.length > 0) ? (
                            <div className="space-y-2">
                                {actions.canStartReview && (
                                    <button
                                        type="button"
                                        disabled={busy}
                                        onClick={onStartReview}
                                        className="w-full rounded-lg bg-[#D97706] py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50">
                                        {startReview.isPending ? 'Starting...' : 'Start Review'}
                                    </button>
                                )}

                                {resolveButtons.map((a) => (
                                    <button
                                        key={a}
                                        type="button"
                                        disabled={busy}
                                        onClick={() => { setModalAction(a); setResolveNote(''); }}
                                        className={`w-full rounded-lg py-2 text-sm font-medium disabled:opacity-50 ${a === 'close'
                                            ? 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                                            : ACTION_META[a].btn}`}>
                                        {ACTION_META[a].label}
                                    </button>
                                ))}

                                {dispute.status === 'open' && (
                                    <p className="text-[11px] text-slate-400"> You must click "Start Review" before resolving or rejecting a dispute.</p>
                                )}
                                {actions.canResolve && !actions.canRefund && dispute.viewerRole !== 'admin' && (
                                    <p className="text-[11px] text-slate-400">Only an admin can issue a refund to the buyer.</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-[13px] text-slate-400">No further actions are available for this dispute.</p>
                        )}
                    </Card>

                    <Card title="Internal Notes">
                        <p className="mb-3 text-[11px] text-slate-400"> Visible only to admins and managers, not to buyers or sellers.</p>

                        {dispute.adminNotes?.length > 0 ? (
                            <div className="mb-4 space-y-3">
                                {dispute.adminNotes.map((n, i) => (
                                    <div key={i} className="rounded-lg bg-slate-50 border border-slate-100 p-3">
                                        <p className="text-[13px] text-[#0B1E3D] whitespace-pre-wrap break-words">{n.note}</p>
                                        <p className="mt-1 text-[11px] text-slate-500">
                                            {n.by?.name || humanize(n.by?.role) || 'Staff'} · {fmtDate(n.at)}, {fmtTime(n.at)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="mb-4 text-[13px] text-slate-400">No notes yet.</p>
                        )}

                        <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            maxLength={1000}
                            rows={3}
                            placeholder="Add an internal note..."
                            className="w-full rounded-lg border border-slate-200 p-2 text-[13px] outline-none focus:border-[#D97706]"
                        />
                        <button
                            type="button"
                            disabled={busy || noteText.trim().length < 3}
                            onClick={onAddNote}
                            className="mt-2 w-full rounded-lg border border-[#D97706] py-2 text-sm font-medium text-[#D97706] hover:bg-amber-50 disabled:opacity-40">
                            {addNote.isPending ? 'Adding...' : 'Add Note'}
                        </button>
                    </Card>
                </div>
            </div>

            {/* resolve confirm modal */}
            {modalMeta && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                        <div className="flex items-start justify-between gap-4">
                            <h3 className="text-base font-semibold text-[#0B1E3D]">{modalMeta.title}</h3>
                            <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                                <X size={18} />
                            </button>
                        </div>

                        <p className="mt-2 text-[13px] text-slate-600">{modalMeta.desc}</p>

                        <label className="mt-4 block text-[12px] font-medium text-slate-700">
                            Resolution note <span className="text-red-500">*</span>
                            <span className="ml-1 font-normal text-slate-400">(Visible to both buyer and seller)</span>
                        </label>
                        <textarea
                            value={resolveNote}
                            onChange={(e) => setResolveNote(e.target.value)}
                            maxLength={1000}
                            rows={4}
                            className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-[13px] outline-none focus:border-[#D97706]"
                        />

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={resolve.isPending}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={onConfirmResolve}
                                disabled={resolve.isPending || resolveNote.trim().length < 3}
                                className={`rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 ${modalMeta.btn}`}>
                                {resolve.isPending ? 'Please wait...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AllDisputesDetail;