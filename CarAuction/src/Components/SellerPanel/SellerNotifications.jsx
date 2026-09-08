
import React, { useState } from 'react';
import { ArrowLeft, Bell, CheckCheck, ChevronRight, Clock3, Gavel, Info, RefreshCw, Trophy } from 'lucide-react';
import { useGetAllNotificationsInfinite, useMarkAllReadNotification, useReadNotification } from '../../hook/useNotification';

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

function SellerNotifications({ setCurrentPage }) {

    const [activeTab, setActiveTab] = useState('all');
    const isReadParam = activeTab === 'unread' ? 'false' : undefined;

    const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetAllNotificationsInfinite(10, isReadParam);
    const { mutate: markOne } = useReadNotification();
    const { mutate: markAllRead } = useMarkAllReadNotification();

    // flatten all loaded pages into one array
    const notifications = data?.pages.flatMap(page => page.data) ?? [];
    const unreadCount = data?.pages[0]?.unreadCount ?? 0;
    const totalCount = data?.pages[0]?.totalCount ?? 0;

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

    // all mark 
    const handleMarkAllRead = () => {
        if (unreadCount === 0) return;
        markAllRead();
    };

    // single noti. clicker
    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markOne(notification._id);
        }
        const targetPath = NOTIFICATION_REDIRECT_MAP[notification.type];
        if (targetPath) {
            setCurrentPage(targetPath);
        }
    };

    const handleLoadMore = () => {
        fetchNextPage();
    };

    return (
        <div className='min-h-full bg-slate-50/60 p-4 sm:p-6 lg:p-8'>

            <div className='max-w-5xl mx-auto'>

                {/* Page Header */}
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
                    <div>
                        <div className='flex items-center gap-2'>
                            <div className='w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center'>
                                <Bell
                                    size={18}
                                    className='text-amber-600'
                                />
                            </div>
                            <h1 className='text-xl sm:text-2xl font-bold text-[#0B1E3D]'>Notifications</h1>
                        </div>

                        <p className='text-xs sm:text-sm text-slate-500 mt-2'> Stay updated with your auctions, bids and vehicles. </p>
                    </div>

                    <div className='flex flex-col sm:flex-row gap-2'>
                        <button
                            onClick={() => setCurrentPage('dashboard')}
                            className='flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-amber-50/30 hover:text-amber-600 hover:border-amber-400 transition cursor-pointer'
                        >
                            <ArrowLeft size={15} />
                            Back to Dashboard
                        </button>

                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className='flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-amber-200 bg-white text-xs font-semibold text-amber-700 hover:bg-amber-50 transition cursor-pointer'
                            >
                                <CheckCheck size={15} />
                                Mark all as read
                            </button>
                        )}
                    </div>

                </div>

                {/* Summary cards */}
                <div className='grid grid-cols-2 gap-4 mb-6'>
                    <div className='relative overflow-hidden bg-white border border-slate-200/90 shadow-sm rounded-2xl p-4 transition-all duration-200 hover:border-slate-300'>
                        <div className='flex items-center justify-between'>
                            <p className='text-[11px] font-semibold text-slate-500 uppercase tracking-wider'>
                                Total notifications
                            </p>
                            <div className='w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600'>
                                <svg className='w-3.5 h-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'>
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' />
                                </svg>
                            </div>
                        </div>
                        <p className='text-2xl font-extrabold text-[#0B1E3D] mt-2 tracking-tight'>
                            {totalCount}
                        </p>
                    </div>

                    <div className='relative overflow-hidden bg-white border border-amber-200/80 shadow-sm rounded-2xl p-4 transition-all duration-200 hover:border-amber-300'>
                        <div className='flex items-center justify-between'>
                            <p className='text-[11px] font-semibold text-amber-700 uppercase tracking-wider'>
                                Unread
                            </p>
                            <div className='w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600'>
                                <span className='relative flex h-2 w-2'>
                                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75'></span>
                                    <span className='relative inline-flex rounded-full h-2 w-2 bg-amber-500'></span>
                                </span>
                            </div>
                        </div>
                        <p className='text-2xl font-extrabold text-amber-600 mt-2 tracking-tight'>
                            {unreadCount}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className='bg-white border border-slate-200 rounded-xl p-1.5 flex items-center gap-1 w-fit mb-4'>
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer
                            ${activeTab === 'all'
                                ? 'bg-[#0B1E3D] text-white'
                                : 'text-slate-500 hover:bg-slate-100'
                            }`}>
                        All
                    </button>

                    <button
                        onClick={() => setActiveTab('unread')}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer
                            ${activeTab === 'unread'
                                ? 'bg-[#0B1E3D] text-white'
                                : 'text-slate-500 hover:bg-slate-100'
                            }`}>
                        Unread
                        {unreadCount > 0 && (
                            <span className='ml-1.5 text-[10px]'>
                                ({unreadCount})
                            </span>
                        )}
                    </button>
                </div>

                {/* Notification List */}
                <div className='bg-white border border-slate-200 rounded-2xl overflow-hidden'>

                    {isLoading ? (
                        <div className='py-20 text-center text-xs text-slate-400'>Loading...</div>
                    ) : isError ? (
                        <div className='py-20 text-center text-xs text-red-500'>Failed to load notifications</div>
                    ) : notifications.length > 0 ? (
                        <div>
                            {notifications.map((notification) => (
                                <button
                                    key={notification._id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`w-full text-left flex gap-4 p-4 sm:p-5 border-b border-slate-100 last:border-b-0 transition cursor-pointer
                                        ${notification.isRead ? 'bg-white hover:bg-slate-50' : 'bg-amber-50/40 hover:bg-amber-50'}`}
                                >
                                    <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${getIconStyle(notification.type)}`}>
                                        {getIcon(notification.type)}
                                    </div>

                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-start justify-between gap-3'>
                                            <div className='flex items-center gap-2 min-w-0'>
                                                <h3 className={`text-sm font-semibold truncate ${notification.isRead ? 'text-slate-700' : 'text-[#0B1E3D]'}`}>
                                                    {notification.title}
                                                </h3>
                                                {!notification.isRead && <span className='w-2 h-2 rounded-full bg-amber-500 shrink-0' />}
                                            </div>
                                            <span className='text-[10px] text-slate-400 whitespace-nowrap'>
                                                {getRelativeTime(notification.createdAt)}
                                            </span>
                                        </div>

                                        <p className='text-xs sm:text-sm text-slate-500 leading-5 mt-1 max-w-3xl'>
                                            {notification.message}
                                        </p>
                                    </div>

                                    <ChevronRight size={17} className='text-slate-300 shrink-0 mt-2' />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className='py-20 text-center'>
                            <div className='w-14 h-14 mx-auto rounded-full bg-slate-50 flex items-center justify-center mb-4'>
                                <Bell size={23} className='text-slate-300' />
                            </div>
                            <h3 className='text-sm font-semibold text-slate-600'>
                                {activeTab === 'unread' ? 'No unread notifications' : 'No notifications'}
                            </h3>
                            <p className='text-xs text-slate-400 mt-1'>You're all caught up!</p>
                        </div>
                    )}
                </div>

                {/* Load More */}
                {hasNextPage && (
                    <div className='flex justify-center mt-5'>
                        <button
                            onClick={handleLoadMore}
                            disabled={isFetchingNextPage}
                            className='flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:border-amber-300 hover:text-amber-600 transition disabled:opacity-60 cursor-pointer'
                        >
                            {isFetchingNextPage ? (
                                <>
                                    <RefreshCw size={14} className='animate-spin' />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    Load more
                                    <ChevronRight size={14} />
                                </>
                            )}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default SellerNotifications;