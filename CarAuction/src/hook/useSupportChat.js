
import { useState, useRef, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../socket/SocketProvider';
import { toast } from 'react-toastify';
import API from '../api/axiosInstance';

const PAGE_SIZE = 30;
const STATUS_POLL_MS = 60_000;

// _id se dedupe + createdAt se sort
const mergeMessages = (prev, incoming) => {
    const map = new Map(prev.map((m) => [m._id, m]));
    incoming.forEach((m) => map.set(m._id, m));
    return [...map.values()].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

// chat status
export const useSupportChatStatus = () => {
    return useQuery({
        queryKey: ['supportChatStatus'],
        queryFn: async () => {
            const res = (await API.get('/support-chat/get-status'));
            return res.data.status;
        },
        refetchInterval: STATUS_POLL_MS,
        staleTime: 30_000,
    });
};

export const useSupportChat = () => {
    const socket = useSocket();
    const queryClient = useQueryClient();

    const [messages, setMessages] = useState([]);
    const [status, setStatus] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const messagesRef = useRef();
    messagesRef.current = messages;

    const markRead = useCallback(() => {
        API.post('/support-chat/read-messages')
            .then(() => queryClient.invalidateQueries({ queryKey: ['supportUnread'] }))
            .catch(() => { });
    }, [queryClient]);

    const loadLatest = useCallback(async (initial = false) => {
        try {
            const res = await API.get('/support-chat/my-messages', { params: { limit: PAGE_SIZE } });
            const data = res.data;
            setStatus(data.status || null);
            setMessages((prev) => mergeMessages(prev, data.messages || []));

            if (initial) setHasMore(!!data.hasMore);
            if (data.conversation?.userUnread > 0) markRead();
        } catch (err) {
            if (initial) toast.error(err.response?.data?.message || 'Could not load chat');
        } finally {
            if (initial) setIsLoading(false);
        }
    }, [markRead]);

    useEffect(() => {
        loadLatest(true);
    }, [loadLatest]);

    // keep badge fresh
    useEffect(() => {
        const timer = setInterval(async () => {
            try {
                const res = await API.get('/support-chat/get-status');
                setStatus(res.data.status);
            } catch { /* agli baar */ }
        }, STATUS_POLL_MS);
        return () => clearInterval(timer);
    }, []);

    // realtime
    useEffect(() => {
        if (!socket) return;

        const onMessage = ({ message }) => {
            if (!message) return;
            setMessages((prev) => mergeMessages(prev, [message]));

            if (message.from === 'staff') markRead();
        };

        let firstConnect = socket.connected;
        const onConnect = () => {
            if (firstConnect) { firstConnect = false; return; }
            loadLatest(false);
        };

        socket.on('chat:message', onMessage);
        socket.on('connect', onConnect);
        return () => {
            socket.off('chat:message', onMessage);
            socket.off('connect', onConnect);
        };
    }, [socket, markRead, loadLatest]);

    const loadMore = useCallback(async () => {
        const oldest = messagesRef.current.find((m) => !String(m._id).startsWith('tmp-'));
        if (!oldest || isLoadingMore) return;

        setIsLoadingMore(true);
        try {
            const res = await API.get('/support-chat/my-messages', {
                params: { limit: PAGE_SIZE, before: oldest.createdAt },
            });
            setMessages((prev) => mergeMessages(prev, res.data.messages || []));
            setHasMore(!!res.data.hasMore);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not load older messages');
        } finally {
            setIsLoadingMore(false);
        }
    }, [isLoadingMore]);

    // send msg
    const send = useCallback(async (text, file) => {
        const tempId = `tmp-${Date.now()}`;
        const localUrl = file ? URL.createObjectURL(file) : null;

        setMessages((prev) => mergeMessages(prev, [{
            _id: tempId, from: 'user', text, createdAt: new Date().toISOString(), pending: true,
            attachments: file ? [{
                url: localUrl,
                kind: file.type === 'application/pdf' ? 'pdf' : 'image',
                name: file.name,
                size: file.size,
            }] : [],
        }]));

        try {
            let body = { text };
            if (file) {
                body = new FormData();
                if (text) body.append('text', text);
                body.append('attachment', file);
            }
            const res = await API.post('/support-chat/send-messages', body);
            if (res.data.status) setStatus(res.data.status);
            setMessages((prev) => mergeMessages(prev.filter((m) => m._id !== tempId), [res.data.message]));
        } catch (err) {
            setMessages((prev) => prev.filter((m) => m._id !== tempId));
            toast.error(err.response?.data?.message || 'Message could not be sent');
            throw err;
        } finally {
            if (localUrl) URL.revokeObjectURL(localUrl);
        }
    }, []);

    return { messages, status, hasMore, isLoading, isLoadingMore, onLoadMore: loadMore, onSend: send };
};

// unread count
export const useSupportUnreadCount = (enabled = true) => {
    const socket = useSocket();
    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ['supportUnread'],
        queryFn: async () => (await API.get('/support-chat/my-unread')).data,
        enabled,
        refetchInterval: 30_000,
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        if (!socket || !enabled) return;
        const refresh = () => queryClient.invalidateQueries({ queryKey: ['supportUnread'] });
        socket.on('chat:message', refresh);
        socket.on('connect', refresh);
        return () => {
            socket.off('chat:message', refresh);
            socket.off('connect', refresh);
        };
    }, [socket, enabled, queryClient]);

    return data?.count ?? 0;
};