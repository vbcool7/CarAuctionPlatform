
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

import { useDisputeChat } from '../../../hook/useDisputeChat';
import { formatDateTime } from '../../../utils/formatters';

const MAX_TEXT = 1000;

function DisputeChat({ disputeId, status }) {

    const { messages, canChat, hasMore, isLoading, isLoadingMore, loadMore, send } = useDisputeChat(disputeId, status);

    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);

    const listRef = useRef(null);
    const lastIdRef = useRef(null);

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
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-[#0B1E3D]">Dispute Chat</h3>
                <p className="mt-0.5 text-[11px] text-gray-400">
                    Our support team can read this chat. Please do not share phone numbers or personal contact details.
                </p>
            </div>

            <div
                ref={listRef}
                className="h-80 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50/50 scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200/80 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 transition-colors"
                >
                {isLoading ? (
                    <p className="text-[13px] text-gray-400">Loading chat...</p>
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
                            <div className="flex flex-col items-center justify-center h-full text-center py-10">
                                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-[#D97706] mb-2 font-bold text-sm">💬</div>
                                <p className="text-[13px] font-medium text-gray-600">No messages yet</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">Start the conversation below.</p>
                            </div>
                        )}

                        {messages.map((m) => {
                            const isStaff = m.from === 'staff';
                            const bubble = m.mine
                                ? 'bg-[#D97706] text-white rounded-br-xs shadow-xs'
                                : isStaff
                                    ? 'bg-[#0B1E3D] text-white rounded-bl-xs shadow-xs'
                                    : 'bg-white border border-gray-200/80 text-gray-800 shadow-2xs rounded-bl-xs';

                            return (
                                <div
                                    key={m._id}
                                    className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] rounded-xl px-3 py-2 ${bubble}`}>
                                        {!m.mine && (
                                            <p className="mb-0.5 text-[10px] font-semibold opacity-80">{m.displayName}</p>
                                        )}
                                        <p className="whitespace-pre-wrap wrap-break-word text-[13px]">{m.text}</p>
                                        <p className="mt-1 text-right text-[10px] opacity-70">{formatDateTime(m.createdAt)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>

            {/* Footer Input */}
            <div className="border-t border-gray-100 bg-white px-4 py-3">
                {canChat ? (
                    <div className="flex items-center gap-2 bg-gray-50/80 border border-gray-200/80 rounded-xl px-3 py-2 focus-within:border-[#D97706] focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/10 transition-all">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={onKeyDown}
                            maxLength={MAX_TEXT}
                            rows={1}
                            disabled={sending}
                            placeholder="Type a message..."
                            className="flex-1 resize-none bg-transparent border-none py-1 text-[13px] text-gray-800 outline-none placeholder:text-gray-400 disabled:opacity-60 max-h-24"
                        />
                        <button
                            type="button"
                            onClick={submit}
                            disabled={sending || !text.trim()}
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#D97706] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#B45309] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs shrink-0">
                            <Send size={13} />
                            <span>{sending ? 'Sending...' : 'Send'}</span>
                        </button>
                    </div>
                ) : (
                    !isLoading && (
                        <div className="text-center py-1">
                            <p className="text-[12px] font-medium text-gray-400 bg-gray-50 py-2 rounded-lg border border-dashed border-gray-200">
                                This dispute is closed. Chat is read-only.
                            </p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default DisputeChat;