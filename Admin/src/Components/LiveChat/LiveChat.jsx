
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Download, ExternalLink, FileText, Loader2, MessageSquare, Paperclip, Search, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

import { useLiveChatConversations, useLiveChatThread } from '../../hooks/useLiveChat';

const MAX_LEN = 1000;

const TZ = 'Asia/Dubai';
const dayKey = (iso) => new Date(iso).toLocaleDateString('en-CA', { timeZone: TZ });
const formatTime = (iso) => new Date(iso).toLocaleTimeString('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit' });
const formatDay = (iso) => new Date(iso).toLocaleDateString('en-GB', { timeZone: TZ, day: 'numeric', month: 'short', year: 'numeric' });

const formatListTime = (iso) => (dayKey(iso) === dayKey(new Date().toISOString())
    ? formatTime(iso)
    : new Date(iso).toLocaleDateString('en-GB', { timeZone: TZ, day: 'numeric', month: 'short' }));

const ATTACH_PREFIX = '📎 ';
const renderPreview = (t = '') => (t.startsWith(ATTACH_PREFIX)
    ? <><Paperclip size={11} className="inline -mt-0.5 mr-1" />{t.slice(ATTACH_PREFIX.length)}</>
    : t);

// attachment
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_FILE = 10 * 1024 * 1024;

const formatSize = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

// attachement download through blob
async function downloadFile(att) {
    try {
        const res = await fetch(att.url);
        if (!res.ok) throw new Error('bad status');
        const href = URL.createObjectURL(await res.blob());
        const a = document.createElement('a');
        a.href = href;
        a.download = att.name || 'file';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(href), 1000);
    } catch {
        window.open(att.url, '_blank', 'noopener');
    }
}

function Attachment({ att }) {
    if (att.kind === 'image') {
        return (
            <a
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    src={att.url}
                    alt={att.name || 'image'}
                    loading="lazy"
                    className="max-w-60 max-h-60 rounded-xl object-cover border border-slate-200" />
            </a>
        );
    }
    return (
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-3 py-2.5 w-64 max-w-full">
            <FileText size={22} className="text-red-500 shrink-0" />
            <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-700 truncate">{att.name || 'document.pdf'}</p>
                <p className="text-[10px] text-slate-400">{att.size ? formatSize(att.size) : 'PDF'}</p>
            </div>
            <a
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                title="Open"
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <ExternalLink size={15} />
            </a>
            <button
                title="Download"
                onClick={() => downloadFile(att)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <Download size={15} />
            </button>
        </div>
    );
}

function Avatar({ name, size = 'md' }) {
    const sz = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-8.5 h-8.5 text-sm';
    return (
        <div className={`${sz} rounded-full bg-linear-to-r from-[#0B1E3D] to-[#163A63] flex items-center justify-center shrink-0`}>
            <span className="text-white font-bold">{(name || '?').trim().charAt(0).toUpperCase()}</span>
        </div>
    );
}

function RoleTag({ role }) {
    return (
        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded 
        ${role === 'seller' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
            {role}
        </span>
    );
}

function LiveChat() {

    const [selectedId, setSelectedId] = useState(null);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [unreadOnly, setUnreadOnly] = useState(false);
    const [page, setPage] = useState(1);

    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const fileInputRef = useRef(null);
    const bottomRef = useRef(null);
    const lastIdRef = useRef(null);
    const lastTypingSent = useRef(0);
    const typingIdleTimer = useRef(null);

    const { data, isLoading: listLoading, isError: listError } = useLiveChatConversations({
        page, search: debouncedSearch, unreadOnly,
    });
    const conversations = data?.conversations || [];
    const totalPages = data?.pagination?.totalPages || 1;

    const {
        conversation, messages, hasMore, isLoading, isLoadingMore, typingNames, myId, loadMore, send, emitTyping,
    } = useLiveChatThread(selectedId);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(
                search.trim());
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    // scroll below on new msgs
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

    // input / typing reset on thread change
    useEffect(() => {
        setInput('');
        setFile(null);
        lastIdRef.current = null;
        clearTimeout(typingIdleTimer.current);
        return () => clearTimeout(typingIdleTimer.current);
    }, [selectedId]);

    const handleChange = (e) => {
        const value = e.target.value;
        setInput(value);

        const now = Date.now();
        if (value && now - lastTypingSent.current > 2000) {
            lastTypingSent.current = now;
            emitTyping(true);
        }
        clearTimeout(typingIdleTimer.current);
        typingIdleTimer.current = setTimeout(() => {
            lastTypingSent.current = 0;
            emitTyping(false);
        }, 2500);
    };

    const handlePick = (e) => {
        const f = e.target.files?.[0];
        e.target.value = '';
        if (!f) return;
        if (!ALLOWED_TYPES.includes(f.type)) return toast.error('Only JPG, PNG, WEBP or PDF files are allowed');
        if (f.size > MAX_FILE) return toast.error('File must be 10MB or less');
        setFile(f);
    };

    // send msg
    const handleSend = async () => {
        const text = input.trim();
        if ((!text && !file) || sending) return;

        setSending(true);
        clearTimeout(typingIdleTimer.current);
        lastTypingSent.current = 0;
        emitTyping(false);
        try {
            await send(text, file);
            setInput('');
            setFile(null);
        } catch {
            // toast handled by hook
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

    const typingText = typingNames.length === 1
        ? `${typingNames[0]} is typing...`
        : typingNames.length > 1 ? `${typingNames.join(', ')} are typing...` : '';

    return (
        <div className="space-y-4">

            {/* heading */}
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">Live Chat</h1>
                <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                    Reply to buyers and sellers. Every user has one permanent conversation.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[75vh]">

                {/* ------------------- conversation list ------------------- */}
                <div className={`lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex-col overflow-hidden ${selectedId ? 'hidden lg:flex' : 'flex'}`}>

                    <div className="p-3 border-b border-slate-100 space-y-2.5">

                        {/* search */}
                        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                            <Search size={15} className="text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or email..."
                                className="flex-1 bg-transparent text-sm focus:outline-none placeholder-slate-400"
                            />
                        </div>

                        {/* tabs */}
                        <div className="flex gap-2">
                            {[{ label: 'All', value: false }, { label: 'Unread', value: true }].map((tab) => (
                                <button
                                    key={tab.label}
                                    onClick={() => { setUnreadOnly(tab.value); setPage(1); }}
                                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${unreadOnly === tab.value
                                        ? 'bg-[#0B1E3D] text-white border-[#0B1E3D]'
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {listLoading ? (
                            <div className="p-8 flex justify-center text-slate-400"><Loader2 className="animate-spin" size={20} /></div>
                        ) : listError ? (
                            <p className="p-6 text-center text-sm text-red-500">Conversations could not be loaded.</p>
                        ) : conversations.length === 0 ? (
                            <p className="p-6 text-center text-sm text-slate-400">
                                {debouncedSearch || unreadOnly ? 'No conversations match.' : 'No conversations yet.'}
                            </p>
                        ) : (
                            conversations.map((c) => (
                                <button
                                    key={c._id}
                                    onClick={() => setSelectedId(c._id)}
                                    className={`w-full text-left flex items-start gap-3 p-3 border-b border-slate-50 transition cursor-pointer 
                                        ${selectedId === c._id
                                            ? 'bg-amber-50 border-l-2 border-l-amber-500'
                                            : 'hover:bg-slate-50'}`}
                                >
                                    <Avatar name={c.user.name} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="flex items-center gap-1.5 min-w-0">
                                                <span className="text-sm font-semibold text-[#0B1E3D] truncate">{c.user.name}</span>
                                                <RoleTag role={c.user.role} />
                                            </span>
                                            <span className="text-[10px] text-slate-400 shrink-0">{formatListTime(c.lastMessageAt)}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-2 mt-0.5">
                                            <p className="text-xs text-slate-500 truncate">
                                                {c.lastSenderKind === 'staff' ? 'Support: ' : ''}{renderPreview(c.lastMessage)}
                                            </p>
                                            {c.unread > 0 && (
                                                <span className="shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-[#D97706] text-white text-[10px] font-bold flex items-center justify-center">
                                                    {c.unread > 99 ? '99+' : c.unread}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between p-3 border-t border-slate-100 text-xs">
                            <button
                                onClick={() => setPage((p) => p - 1)}
                                disabled={page === 1}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-slate-500">Page {page} of {totalPages}</span>
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={page >= totalPages}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                {/* ------------------- thread ------------------- */}
                <div className={`lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex-col overflow-hidden ${selectedId ? 'flex' : 'hidden lg:flex'}`}>

                    {!selectedId ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 text-slate-400">
                            <MessageSquare size={36} />
                            <p className="text-sm font-semibold text-[#0B1E3D] mt-3">Select a conversation</p>
                            <p className="text-xs mt-1">Pick a buyer or seller from the list to read and reply.</p>
                        </div>
                    ) : (
                        <>
                            {/* header */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                                <button
                                    onClick={() => setSelectedId(null)}
                                    className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                                >
                                    <ArrowLeft size={18} />
                                </button>

                                <Avatar name={conversation?.user?.name} />
                                <div className="min-w-0">
                                    <p className="flex items-center gap-2 text-sm font-bold text-[#0B1E3D]">
                                        <span className="truncate">{conversation?.user?.name || 'Loading...'}</span>
                                        {conversation && <RoleTag role={conversation.user.role} />}
                                    </p>
                                    {conversation?.user?.email && (
                                        <p className="text-xs text-slate-400 truncate">{conversation.user.email}</p>
                                    )}
                                </div>
                            </div>

                            {/* messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {hasMore && (
                                    <div className="text-center">
                                        <button
                                            onClick={loadMore}
                                            disabled={isLoadingMore}
                                            className="text-xs font-medium text-[#D97706] border border-amber-200 rounded-full px-4 py-1.5 hover:bg-amber-50 transition disabled:opacity-50"
                                        >
                                            {isLoadingMore ? 'Loading...' : 'Load older messages'}
                                        </button>
                                    </div>
                                )}

                                {isLoading ? (
                                    <div className="h-full flex items-center justify-center text-slate-400"><Loader2 className="animate-spin" size={22} /></div>
                                ) : (
                                    messages.map((msg, i) => {
                                        const staff = msg.from === 'staff';
                                        const mine = staff && msg.senderId === myId;
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

                                                <div className={`flex ${staff ? 'justify-end' : 'justify-start'}`}>
                                                    {!staff && <Avatar name={conversation?.user?.name} size="sm" />}

                                                    <div className={`${staff ? '' : 'ml-2'} max-w-[75%]`}>
                                                        {staff && (
                                                            <p className="text-[11px] font-semibold text-amber-600 mb-1 text-right">
                                                                {mine ? 'You' : msg.displayName} · Support
                                                            </p>
                                                        )}

                                                        {msg.attachments?.length > 0 && (
                                                            <div className={`space-y-1.5 flex flex-col ${staff ? 'items-end' : 'items-start'}`}>
                                                                {msg.attachments.map((att) => <Attachment key={att.url} att={att} />)}
                                                            </div>
                                                        )}
                                                        {msg.text && (
                                                            <div className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap wrap-break-word ${msg.attachments?.length ? 'mt-1.5' : ''} ${staff
                                                                ? 'bg-[#0B1E3D] text-white rounded-tr-sm'
                                                                : 'bg-slate-100 text-slate-700 rounded-tl-sm'}`}>
                                                                {msg.text}
                                                            </div>
                                                        )}

                                                        <p className={`text-[10px] text-slate-400 mt-1 ${staff ? 'text-right' : ''}`}>
                                                            {formatTime(msg.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        );
                                    })
                                )}

                                <div ref={bottomRef} />
                            </div>

                            {/* typing (sirf doosre staff ka) */}
                            <div className="px-4 h-5 text-[11px] text-slate-400 italic">{typingText}</div>

                            {/* input */}
                            <div className="border-t border-slate-100 p-3">

                                {/* attach preview */}
                                {file && (
                                    <div className="flex items-center gap-3 mb-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
                                        {previewUrl
                                            ? <img src={previewUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
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

                                    {/* attach input */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp,.pdf"
                                        className="hidden"
                                        onChange={handlePick}
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={sending || isLoading}
                                        title="Attach image or PDF"
                                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 disabled:opacity-50"
                                    >
                                        <Paperclip size={16} />
                                    </button>

                                    {/* text input */}
                                    <input
                                        type="text"
                                        value={input}
                                        maxLength={MAX_LEN}
                                        onChange={handleChange}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type your reply..."
                                        className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={(!input.trim() && !file) || sending || isLoading}
                                        className="w-8 h-8 rounded-lg bg-[#D97706] flex items-center justify-center hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {sending ? <Loader2 size={14} className="text-white animate-spin" /> : <Send size={14} className="text-white" />}
                                    </button>
                                </div>

                                <p className="text-[10px] text-slate-400 mt-1.5 ml-1 flex justify-between">
                                    <span>Press Enter to send. Your first name is shown to the user.</span>
                                    {input.length > MAX_LEN * 0.8 && <span>{input.length}/{MAX_LEN}</span>}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LiveChat;