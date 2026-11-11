
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Send, Loader2, Clock, Paperclip, FileText, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Attachment, ALLOWED_TYPES, MAX_FILE, formatSize } from './ChatAttachment';

const MAX_LEN = 1000;

const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString('en-GB', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit' });

const formatDay = (iso) =>
    new Date(iso).toLocaleDateString('en-GB', { timeZone: 'Asia/Dubai', day: 'numeric', month: 'short', year: 'numeric' });

const dayKey = (iso) =>
    new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Asia/Dubai' });

function Avatar({ name }) {
    const initials = (name || 'S').trim().charAt(0).toUpperCase();
    return (
        <div className="w-7 h-7 rounded-full bg-[#0B1E3D] flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xs">{initials}</span>
        </div>
    );
}

/**
 * Buyer + Seller dono ke liye shared Live Chat window (presentational, API yahan nahi hai).
 * Data aur actions useSupportChat hook se aate hain.
 *
 * Props:
 *  onBack        : "Back to Support Center" click
 *  messages      : [{ _id, from: 'user'|'staff', text, createdAt, displayName, pending?, failed? }]
 *  status        : { online: boolean, workingHours: boolean } | null
 *  isLoading     : pehli baar load ho raha hai
 *  hasMore       : purane messages baaki hain
 *  isLoadingMore : purane messages aa rahe hain
 *  onLoadMore    : purane messages mangao
 *  onSend        : (text) => Promise   (fail hone par reject kare)
 */
function SupportLiveChat({
    onBack,
    messages = [],
    status = null,
    isLoading = false,
    hasMore = false,
    isLoadingMore = false,
    onLoadMore,
    onSend,
}) {

    const bottomRef = useRef(null);
    const lastIdRef = useRef(null);
    const fileInputRef = useRef(null);

    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // scroll below when new msgs come
    useEffect(() => {
        const lastId = messages[messages.length - 1]?._id || null;
        if (lastId !== lastIdRef.current) {
            lastIdRef.current = lastId;
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (!file || !file.type.startsWith('image/')) { setPreviewUrl(null); return; }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const handlePick = (e) => {
        const f = e.target.files?.[0];
        e.target.value = '';
        if (!f) return;
        if (!ALLOWED_TYPES.includes(f.type)) return toast.error('Only JPG, PNG, WEBP or PDF files are allowed');
        if (f.size > MAX_FILE) return toast.error('File must be 10MB or less');
        setFile(f);
    };

    // send 
    const handleSend = async () => {
        const text = input.trim();
        if ((!text && !file) || sending) return;

        setSending(true);
        try {
            await onSend(text, file);
            setInput('');
            setFile(null);
        } catch {
            // input waisa hi rehta hai taaki user dobara bhej sake; error toast hook se aata hai
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const online = !!status?.online;

    return (
        <div className="flex flex-col gap-4 mb-6">

            {/* heading */}
            <div className="space-y-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1.5 text-sm text-[#0B1E3D] font-medium hover:opacity-70 transition-opacity mb-3 cursor-pointer"
                >
                    <ArrowLeft size={15} />
                    Back to Support Center
                </button>

                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-slate-800 text-xl md:text-2xl font-bold">Live Chat</h1>
                        {status && (
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border ${online
                                ? 'bg-green-50 text-green-600 border-green-200'
                                : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                {online ? 'Online' : 'Offline'}
                            </span>
                        )}
                    </div>
                    <p className="pt-1 text-gray-600 text-[12px] md:text-sm font-medium">
                        Chat with our support team. Your conversation history stays here.
                    </p>
                </div>
            </div>

            {/* offline notice */}
            {status && !online && (
                <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3">
                    <Clock size={16} className="text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs md:text-sm text-slate-700">
                        Our team is offline right now. You can still send a message, we will reply during
                        working hours (Mon - Fri, 9AM - 6PM GST).
                    </p>
                </div>
            )}

            {/* chat window */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden h-[28rem] md:h-[32rem]">

                {/* messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">

                    {hasMore && (
                        <div className="text-center">
                            <button
                                onClick={onLoadMore}
                                disabled={isLoadingMore}
                                className="text-xs font-medium text-[#D97706] border border-amber-200 rounded-full px-4 py-1.5 hover:bg-amber-50 transition disabled:opacity-50"
                            >
                                {isLoadingMore ? 'Loading...' : 'Load older messages'}
                            </button>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="h-full flex items-center justify-center text-slate-400">
                            <Loader2 className="animate-spin" size={22} />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center px-6">
                            <p className="text-sm font-semibold text-[#0B1E3D]">No messages yet</p>
                            <p className="text-xs text-slate-400 mt-1">Say hello and tell us how we can help.</p>
                        </div>
                    ) : (
                        messages.map((msg, i) => {
                            const mine = msg.from === 'user';
                            const showDay = i === 0 || dayKey(messages[i - 1].createdAt) !== dayKey(msg.createdAt);

                            return (
                                <React.Fragment key={msg._id}>
                                    {showDay && (
                                        <div className="text-center">
                                            <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                                                {formatDay(msg.createdAt)}
                                            </span>
                                        </div>
                                    )}

                                    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                                        {!mine && <Avatar name={msg.displayName} />}

                                        <div className={`${mine ? '' : 'ml-2'} max-w-[75%]`}>
                                            {!mine && (
                                                <p className="text-[11px] font-semibold text-amber-600 mb-1">
                                                    {msg.displayName || 'Support'} · Support
                                                </p>
                                            )}

                                            {msg.attachments?.length > 0 && (
                                                <div className={`space-y-1.5 flex flex-col ${mine ? 'items-end' : 'items-start'} ${msg.pending ? 'opacity-60' : ''}`}>
                                                    {msg.attachments.map((att) => <Attachment key={att.url} att={att} />)}
                                                </div>
                                            )}
                                            {msg.text && (
                                                <div className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap wrap-break-word ${msg.attachments?.length ? 'mt-1.5' : ''} 
                                                ${mine
                                                        ? 'bg-[#0B1E3D] text-white rounded-tr-sm'
                                                        : 'bg-slate-100 text-slate-700 rounded-tl-sm'
                                                    } ${msg.pending ? 'opacity-60' : ''}`}>
                                                    {msg.text}
                                                </div>
                                            )}

                                            <p className={`text-[10px] mt-1 ${mine ? 'text-right' : ''} ${msg.failed ? 'text-red-500' : 'text-slate-400'}`}>
                                                {msg.failed ? 'Not sent' : msg.pending ? 'Sending...' : formatTime(msg.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* input */}
                <div className="border-t border-slate-100 p-3">

                    {/* attach preview */}
                    {file && (
                        <div className="flex items-center gap-3 mb-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
                            {previewUrl
                                ? <img
                                    src={previewUrl}
                                    alt=""
                                    className="w-12 h-12 rounded-lg object-cover"
                                />
                                : <FileText size={28} className="text-red-500 mx-2" />}
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-slate-700 truncate">{file.name}</p>
                                <p className="text-[10px] text-slate-400">{formatSize(file.size)}</p>
                            </div>
                            <button
                                onClick={() => setFile(null)}
                                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500">
                                <X size={15} />
                            </button>
                        </div>
                    )}

                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">

                        {/* file attach */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                            className="hidden"
                            onChange={handlePick}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={sending}
                            title="Attach image or PDF"
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 disabled:opacity-50"
                        >
                            <Paperclip size={16} />
                        </button>

                        {/* input */}
                        <input
                            type="text"
                            value={input}
                            maxLength={MAX_LEN}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message here..."
                            className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
                        />
                        <button
                            onClick={handleSend}
                            disabled={(!input.trim() && !file) || sending}
                            className="w-8 h-8 rounded-lg bg-[#D97706] flex items-center justify-center hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sending ? <Loader2 size={14} className="text-white animate-spin" /> : <Send size={14} className="text-white" />}
                        </button>
                    </div>

                    <p className="text-[10px] text-slate-400 mt-1.5 ml-1 flex justify-between">
                        <span>Enter to send. JPG, PNG, WEBP or PDF up to 10MB. Please do not share ID or bank documents here.</span>
                        {input.length > MAX_LEN * 0.8 && <span>{input.length}/{MAX_LEN}</span>}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SupportLiveChat;