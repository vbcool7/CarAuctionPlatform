
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

import { fmtDate, fmtTime } from '../../utils/formatter';
import { useDisputeChatAdmin } from '../../../hooks/useDisputeChat';

const MAX_TEXT = 1000;

function DisputeChatAdmin({ disputeId, status }) {

    const { messages, canChat, hasMore, isLoading, isLoadingMore, loadMore, send, myId } = useDisputeChatAdmin(disputeId, status);

    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);

    const listRef = useRef(null);
    const lastIdRef = useRef(null);

    // naya message (last id badla) aaye to neeche scroll. Purane messages load hone par nahi
    const lastId = messages[messages.length - 1]?._id;
    useEffect(() => {
        if (lastId && lastId !== lastIdRef.current && listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
        lastIdRef.current = lastId;
    }, [lastId]);

    const submit = async () => {
        const value = text.trim();
        if (!value || sending) return;

        setSending(true);
        try {
            await send(value);
            setText('');
        } catch {
            /* toast hook me hai, text input me rehne do */
        } finally {
            setSending(false);
        }
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
        }
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-[#0B1E3D]">Dispute Chat</h3>
                <p className="mt-0.5 text-[11px] text-slate-400">
                    Buyer and seller see you as "Support Team". Your first name is shown only to staff.
                </p>
            </div>

            <div
                ref={listRef}
                className="h-80 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50/50 scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200/80 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 transition-colors"
            >
                {isLoading ? (
                    <p className="text-[13px] text-slate-400">Loading chat...</p>
                ) : (
                    <>
                        {hasMore && (
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={loadMore}
                                    disabled={isLoadingMore}
                                    className="text-[11px] font-medium text-[#D97706] hover:underline disabled:opacity-50">
                                    {isLoadingMore ? 'Loading...' : 'Load older messages'}
                                </button>
                            </div>
                        )}

                        {messages.length === 0 && (
                            <p className="text-[13px] text-slate-400 text-center pt-10">No messages yet.</p>
                        )}

                        {messages.map((m) => {
                            
                            const isStaff = m.from === 'staff';
                            const mine = isStaff && String(m.senderId) === myId;
                            const bubble = mine
                                ? 'bg-[#D97706] text-white'
                                : isStaff
                                    ? 'bg-[#0B1E3D] text-white'
                                    : 'bg-white border border-slate-200 text-slate-800';

                            return (
                                <div
                                    key={m._id}
                                    className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-xl px-3 py-2 ${bubble}`}>
                                        {!mine && (
                                            <p className="mb-0.5 text-[10px] font-semibold opacity-80">
                                                {isStaff ? `${m.displayName} · Support` : m.displayName}
                                            </p>
                                        )}
                                        <p className="whitespace-pre-wrap wrap-break-word text-[13px]">{m.text}</p>
                                        <p className="mt-1 text-right text-[10px] opacity-70">
                                            {fmtDate(m.createdAt)}, {fmtTime(m.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>

            <div className="border-t border-slate-100 px-4 py-3">
                {canChat ? (
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:border-[#D97706] focus-within:ring-2 focus-within:ring-amber-500/10 transition-all">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={onKeyDown}
                            maxLength={MAX_TEXT}
                            rows={1}
                            disabled={sending}
                            placeholder="Write to buyer and seller..."
                            className="flex-1 resize-none bg-transparent border-none py-1 text-[13px] text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60 max-h-24"
                        />
                        <button
                            type="button"
                            onClick={submit}
                            disabled={sending || !text.trim()}
                            className="flex items-center gap-1.5 rounded-lg bg-[#D97706] px-3.5 py-2 text-xs font-semibold text-white hover:bg-amber-700 transition-all disabled:opacity-50 shrink-0">
                            <Send size={14} />
                            <span>{sending ? 'Sending...' : 'Send'}</span>
                        </button>
                    </div>
                ) : (
                    !isLoading && (
                        <p className="text-[13px] text-slate-400">This dispute is closed. Chat is read-only.</p>
                    )
                )}
            </div>
        </div>
    );
}

export default DisputeChatAdmin;