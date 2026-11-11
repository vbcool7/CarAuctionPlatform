
import { useState, useRef, useEffect, useCallback } from 'react';
import API from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { useSocket } from '../socket/SocketProvider';

const PAGE_SIZE = 30;

const mergeMessages = (prev, incoming) => {
    const map = new Map(prev.map((m) => [m._id, m]));
    incoming.forEach((m) => map.set(m._id, m));
    return [...map.values()].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

export const useDisputeChat = (disputeId, status) => {
    const socket = useSocket();

    const [messages, setMessages] = useState([]);
    const [canChat, setCanChat] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const messagesRef = useRef([]);
    messagesRef.current = messages;

    // mark read
    const markRead = useCallback(() => {
        API.post(`/dispute-chat/my-dispute-chat/${disputeId}/read`).catch(() => { });
    }, [disputeId]);

    // latest page
    const loadLatest = useCallback(async (initial = false) => {
        try {
            const res = await API.get(`/dispute-chat/my-dispute-chat/${disputeId}`, { params: { limit: PAGE_SIZE } });
            const data = res.data;

            setCanChat(!!data.canChat);
            setMessages((prev) => mergeMessages(prev, data.messages || []));
            if (initial) setHasMore(!!data.hasMore);
            if (data.unread > 0) markRead();
        } catch (err) {
            if (initial) toast.error(err.response?.data?.message || 'Could not load chat');
        } finally {
            if (initial) setIsLoading(false);
        }
    }, [disputeId, markRead]);

    // reset + load on changing dispute
    useEffect(() => {
        setMessages([]);
        setHasMore(false);
        setIsLoading(true);
        loadLatest(true);
    }, [loadLatest]);

    // status badla (jaise resolved) to canChat dobara lao, messages reset nahi
    const firstStatus = useRef(true);
    useEffect(() => {
        if (firstStatus.current) { firstStatus.current = false; return; }
        loadLatest(false);
    }, [status]);

    useEffect(() => {
        if (!socket) return;

        const onMessage = ({ disputeId: did, message }) => {
            if (String(did) !== String(disputeId) || !message) return;
            setMessages((prev) => mergeMessages(prev, [message]));
            if (!message.mine) markRead();
        };

        let firstConnect = socket.connected;
        const onConnect = () => {
            if (firstConnect) { firstConnect = false; return; }
            loadLatest(false);
        };

        socket.on('dispute:message', onMessage);
        socket.on('connect', onConnect);
        return () => {
            socket.off('dispute:message', onMessage);
            socket.off('connect', onConnect);
        };
    }, [socket, disputeId, markRead, loadLatest]);

    const loadMore = useCallback(async () => {
        const oldest = messagesRef.current[0];
        if (!oldest || isLoadingMore) return;

        setIsLoadingMore(true);
        try {
            const res = await API.get(`/dispute-chat/my-dispute-chat/${disputeId}`, {
                params: { limit: PAGE_SIZE, before: oldest.createdAt },
            });
            setMessages((prev) => mergeMessages(prev, res.data.messages || []));
            setHasMore(!!res.data.hasMore);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not load older messages');
        } finally {
            setIsLoadingMore(false);
        }
    }, [disputeId, isLoadingMore]);


    const send = useCallback(async (text) => {
        try {
            const res = await API.post(`/dispute-chat/my-dispute-chat/${disputeId}/send`, { text });
            setMessages((prev) => mergeMessages(prev, [res.data.message]));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Message could not be sent');
            if (err.response?.status === 403) setCanChat(false);
            throw err;
        }
    }, [disputeId]);

    return { messages, canChat, hasMore, isLoading, isLoadingMore, loadMore, send };
};