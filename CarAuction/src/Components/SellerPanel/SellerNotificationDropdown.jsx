
import React, { useState, useRef, useEffect } from 'react';
import { Bell, BellRing, CheckCheck, ChevronRight, Clock3, Gavel, Info, Trophy, X } from 'lucide-react';
import { useGetAllNotifications, useMarkAllReadNotification, useReadNotification } from '../../hook/useNotification';

const getIcon = (type) => {
    switch (type) {
        case 'auction_sold': return <Trophy size={17} />;
        case 'auction_unsold': return <Clock3 size={17} />;
        case 'reserve_not_met': return <Gavel size={17} />;
        case 'auction_canceled': return <X size={17} />;
        default: return <Info size={17} />;
    }
};

const getIconStyle = (type) => {
    switch (type) {
        case 'auction_sold': return 'bg-green-50 text-green-600';
        case 'auction_unsold': return 'bg-orange-50 text-orange-600';
        case 'reserve_not_met': return 'bg-amber-50 text-amber-600';
        case 'auction_canceled': return 'bg-red-50 text-red-600';
        default: return 'bg-slate-50 text-slate-600';
    }
};

const NOTIFICATION_REDIRECT_MAP = {
    auction_sold: 'my-auctions',
    auction_unsold: 'my-auctions',
    reserve_not_met: 'my-auctions',
    auction_canceled: 'my-auctions',
    // future: outbid, won → likely a different page (e.g. 'my-bids') once bid-semantics resolved
};

function SellerNotificationDropdown({ setCurrentPage }) {

    const notificationRef = useRef(null);

    const [showNotifications, setShowNotifications] = useState(false);
    const [page, setPage] = useState(1);

    const { data: notificationData, isLoading, isError } = useGetAllNotifications(page);
    const { mutate: markOne } = useReadNotification();
    const { mutate: markAllRead } = useMarkAllReadNotification();

    const notifications = notificationData?.data;
    const unreadCount = notificationData?.unreadCount;
    const totalPages = notificationData?.totalPages;

    // noti time
    const getRelativeTime = (dateString) => {
        const diffMs = Date.now() - new Date(dateString).getTime();
        const diffMin = Math.floor(diffMs / 60000);

        if (diffMin < 1) return 'Just now';
        if (diffMin < 60) return `${diffMin} min ago`;

        const diffHr = Math.floor(diffMin / 60);
        if (diffHr < 24) return `${diffHr} hr ago`;

        const diffDay = Math.floor(diffHr / 24);
        return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    };

    // single noti. clicker
    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markOne(notification._id);
        }
        setShowNotifications(false);

        const targetPath = NOTIFICATION_REDIRECT_MAP[notification.type];
        if (targetPath) {
            setCurrentPage(targetPath);
        }
    };

    // all mark 
    const handleMarkAllRead = () => {
        if (unreadCount === 0) return;
        markAllRead();
    };

    // click outside - drop down close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='relative' ref={notificationRef}>

            {/* Notification Button */}
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-lg transition-all cursor-pointer
                    ${showNotifications
                        ? 'bg-amber-50 text-amber-600'
                        : 'text-slate-700 hover:bg-amber-50 hover:text-amber-600'
                    }`}
            >
                {unreadCount > 0 ? (
                    <BellRing size={20} />
                ) : (
                    <Bell size={20} />
                )}

                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <span className='absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white'>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {showNotifications && (
                <div className='absolute right-0 top-full mt-3 w-80 sm:w-85 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50'>

                    {/* Header */}
                    <div className='flex items-center justify-between px-4 py-3.5 border-b border-slate-100'>
                        <div>
                            <div className='flex items-center gap-2'>
                                <h3 className='text-sm font-bold text-[#0B1E3D]'>
                                    Notifications
                                </h3>

                                {unreadCount > 0 && (
                                    <span className='px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold'>
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>

                            <p className='text-[11px] text-slate-400 mt-0.5'>
                                Stay updated with your auctions
                            </p>
                        </div>

                        <button
                            onClick={() => setShowNotifications(false)}
                            className='p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer'
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Mark all */}
                    {unreadCount > 0 && (
                        <div className='px-4 py-2 border-b border-slate-100 bg-slate-50/60'>
                            <button
                                onClick={handleMarkAllRead}
                                className='flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 hover:text-amber-700 transition cursor-pointer'
                            >
                                <CheckCheck size={14} />
                                Mark all as read
                            </button>
                        </div>
                    )}

                    {/* Notification list */}
                    <div className='max-h-85 overflow-y-auto'>

                        {isLoading ? (
                            <div className='py-12 text-center text-xs text-slate-400'>Loading...</div>
                        ) : isError ? (
                            <div className='py-12 text-center text-xs text-red-500'>Failed to load notifications</div>
                        ) : notifications?.length > 0 ? (
                            notifications.map((notification) => (
                                <button
                                    key={notification._id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`w-full text-left px-4 py-3.5 flex gap-3 border-b border-slate-100 transition-all cursor-pointer
                                        ${notification.isRead
                                            ? 'bg-white hover:bg-slate-50'
                                            : 'bg-amber-50/40 hover:bg-amber-50'
                                        }`}
                                >

                                    <div
                                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 
                                            ${getIconStyle(notification.type)}`}>
                                        {getIcon(notification.type)}
                                    </div>

                                    <div className='min-w-0 flex-1'>

                                        <div className='flex items-start justify-between gap-2'>
                                            <p
                                                className={`text-xs font-semibold leading-5
                                                    ${notification.isRead
                                                        ? 'text-slate-700'
                                                        : 'text-[#0B1E3D]'
                                                    }`}
                                            >
                                                {notification.title}
                                            </p>

                                            {!notification.isRead && (
                                                <span className='w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5' />
                                            )}
                                        </div>

                                        <p className='text-[11px] text-slate-500 leading-4 mt-0.5 line-clamp-2'>
                                            {notification.message}
                                        </p>

                                        <div className='flex items-center gap-1 mt-1.5 text-[10px] text-slate-400'>
                                            <Clock3 size={10} />
                                            {getRelativeTime(notification.createdAt)}
                                        </div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className='py-12 text-center'>
                                <div className='w-12 h-12 mx-auto rounded-full bg-slate-50 flex items-center justify-center mb-3'>
                                    <Bell size={20} className='text-slate-300' />
                                </div>

                                <p className='text-sm font-semibold text-slate-600'>
                                    No notifications
                                </p>

                                <p className='text-xs text-slate-400 mt-1'>
                                    You're all caught up!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className='flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-white'>
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className='px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[#0B1E3D] border border-slate-200 bg-white hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer'
                            >
                                Previous
                            </button>

                            <div className='flex items-center gap-1.5'>
                                <span className='flex items-center justify-center min-w-7 h-7 px-2 rounded-lg bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-100'>
                                    {page}
                                </span>

                                <span className='text-[11px] font-medium text-slate-400'>
                                    of
                                </span>

                                <span className='text-[11px] font-semibold text-[#0B1E3D]'>
                                    {totalPages}
                                </span>
                            </div>

                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className='px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[#0B1E3D] border border-slate-200 bg-white hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer'
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {/* Footer */}
                    <div className='border-t border-slate-100 bg-white'>
                        <button
                            onClick={() => {
                                setShowNotifications(false);
                                setCurrentPage('notifications');
                            }}
                            className='w-full flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-[#0B1E3D] hover:bg-amber-50 hover:text-amber-700 transition cursor-pointer'
                        >
                            View all notifications
                            <ChevronRight size={14} />
                        </button>
                    </div>

                </div >
            )
            }
        </div >
    );
}

export default SellerNotificationDropdown;