
import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import API from '../api/axiosInstance';

import { useAdminSocket } from '../socket/AdminSocketProvider';
import useAdminAuthStore from '../store/useAdminAuthStore';

const PAGE_SIZE = 30;
const TYPING_EXPIRE_MS = 4000;

const mergeMessages = (prev, incoming) => {
    const map = new Map(prev.map((m) => [m._id, m]));
    incoming.forEach((m) => map.set(m._id, m));
    return [...map.values()].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

// count num of unread msgs
export const useLiveChatUnreadCount = (enabled = true) => {
    const socket = useAdminSocket();
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ['liveChatUnread'],
        queryFn: async () => (await API.get('/support-chat/unread-count')).data,
        enabled,
        staleTime: 30_000,
    });

    useEffect(() => {
        if (!socket || !enabled) return;

        const refresh = () => {
            queryClient.invalidateQueries({ queryKey: ['liveChatUnread'] });
            queryClient.invalidateQueries({ queryKey: ['liveChatConversations'] });
        };

        socket.on('chat:message', refresh);
        socket.on('chat:read', refresh);
        socket.on('connect', refresh);

        return () => {
            socket.off('chat:message', refresh);
            socket.off('chat:read', refresh);
            socket.off('connect', refresh);
        };
    }, [socket, enabled, queryClient]);

    return data?.messages ?? 0;
}

// live chat conversation
export const useLiveChatConversations = ({ page = 1, limit = 20, search = '', unreadOnly = false } = {}) => {
    return useQuery({
        queryKey: ['liveChatConversations', { page, limit, search, unreadOnly }],
        queryFn: async () => {
            const res = await API.get('/support-chat/conversations', {
                params: { page, limit, search, unreadOnly: unreadOnly ? 'true' : undefined },
            });
            return res.data;
        },
        placeholderData: (previousData) => previousData,
    });
}

// Ek khuli hui thread (messages + realtime + typing + send)
export const useLiveChatThread = (conversationId) => {
    const socket = useAdminSocket();
    const queryClient = useQueryClient();
    const admin = useAdminAuthStore((state) => state.admin);
    const myId = String(admin?._id || admin?.id || '');

    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [typing, setTyping] = useState({});   // { staffId: firstName }

    const activeRef = useRef(null);
    const messagesRef = useRef([]);
    const typingTimers = useRef({});
    messagesRef.current = messages;

    const markRead = useCallback((id) => {
        API.post(`/support-chat/conversations/${id}/read`)
            .then(() => {
                queryClient.invalidateQueries({ queryKey: ['liveChatUnread'] });
                queryClient.invalidateQueries({ queryKey: ['liveChatConversations'] });
            })
            .catch(() => { });
    }, [queryClient]);

    // thread badalne par reset + load
    useEffect(() => {
        activeRef.current = conversationId;
        setConversation(null);
        setMessages([]);
        setHasMore(false);
        setTyping({});

        if (!conversationId) return;

        let cancelled = false;
        setIsLoading(true);
        (async () => {
            try {
                const res = await API.get(`/support-chat/conversations/${conversationId}/messages`, { params: { limit: PAGE_SIZE }, });

                if (cancelled) return;
                setConversation(res.data.conversation);
                setMessages(res.data.messages || []);
                setHasMore(!!res.data.hasMore);
                markRead(conversationId);
            } catch (err) {
                if (!cancelled) toast.error(err.response?.data?.message || 'Could not load conversation');
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [conversationId, markRead]);

    // real-time chat messages receive & update
    useEffect(() => {
        if (!socket || !conversationId) return;

        const onMessage = ({ conversationId: cid, message }) => {
            if (String(cid) !== String(activeRef.current) || !message) return;
            setMessages((prev) => mergeMessages(prev, [message]));
            if (message.from === 'user') markRead(cid);   // thread khula hai, to padha hua
            if (message.from === 'staff') {
                setTyping((prev) => {
                    const next = { ...prev };
                    delete next[message.senderId];
                    return next;
                });
            }
        };

        // real-time typing indicator
        const onTyping = ({ conversationId: cid, typing: isTyping, staffId, name }) => {
            if (String(cid) !== String(activeRef.current)) return;
            if (String(staffId) === myId) return;   // apna doosra tab

            clearTimeout(typingTimers.current[staffId]);

            if (!isTyping) {
                setTyping((prev) => {
                    const next = { ...prev };
                    delete next[staffId];
                    return next;
                });
                return;
            }

            setTyping((prev) => ({ ...prev, [staffId]: name }));
            typingTimers.current[staffId] = setTimeout(() => {
                setTyping((prev) => {
                    const next = { ...prev };
                    delete next[staffId];
                    return next;
                });
            }, TYPING_EXPIRE_MS);
        };

        socket.on('chat:message', onMessage);
        socket.on('chat:typing', onTyping);
        return () => {
            socket.off('chat:message', onMessage);
            socket.off('chat:typing', onTyping);
            Object.values(typingTimers.current).forEach(clearTimeout);
            typingTimers.current = {};
        };
    }, [socket, conversationId, myId, markRead]);

    // load old msgs
    const loadMore = useCallback(async () => {
        const id = activeRef.current;
        const oldest = messagesRef.current[0];
        if (!id || !oldest || isLoadingMore) return;

        setIsLoadingMore(true);
        try {
            const res = await API.get(`/support-chat/conversations/${id}/messages`, {
                params: { limit: PAGE_SIZE, before: oldest.createdAt },
            });

            if (activeRef.current !== id) return;
            setMessages((prev) => mergeMessages(prev, res.data.messages || []));
            setHasMore(!!res.data.hasMore);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not load older messages');
        } finally {
            setIsLoadingMore(false);
        }
    }, [isLoadingMore]);

    // msg send
        // msg send (text ya file ya dono)
    const send = useCallback(async (text, file) => {
        const id = activeRef.current;
        try {
            let body = { text };
            if (file) {
                body = new FormData();
                if (text) body.append('text', text);
                body.append('attachment', file);
            }
            const res = await API.post(`/support-chat/conversations/${id}/reply`, body);

            setMessages((prev) => mergeMessages(prev, [res.data.message]));
            queryClient.invalidateQueries({ queryKey: ['liveChatConversations'] });
            queryClient.invalidateQueries({ queryKey: ['liveChatUnread'] });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Message could not be sent');
            throw err;
        }
    }, [queryClient]);

    // show typing...
    const emitTyping = useCallback((isTyping) => {
        if (socket && activeRef.current) {
            socket.emit('chat:typing', { conversationId: activeRef.current, typing: isTyping });
        }
    }, [socket]);

    return {
        conversation,
        messages,
        hasMore,
        isLoading,
        isLoadingMore,
        typingNames: Object.values(typing),
        myId,
        loadMore,
        send,
        emitTyping,
    };
}