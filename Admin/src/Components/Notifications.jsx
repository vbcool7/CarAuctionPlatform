
import React, { useState } from 'react';
import { Bell, BellRing, Trophy, X, Check, CheckCheck, Info, Search, ArrowLeft, RefreshCw, ChevronRight } from 'lucide-react';
import { useGetAllNotificationsInfinite, useMarkAllReadNotification, useReadNotification } from '../hooks/useNotification';
import { useEffect } from 'react';

const getIcon = (type) => {
    switch (type) {
        case 'auction_sold': return <Trophy size={18} />;
        case 'auction_canceled': return <X size={18} />;
        default: return <Info size={18} />;
    }
};

const getIconStyle = (type) => {
    switch (type) {
        case 'auction_sold': return 'bg-green-50 text-green-600';
        case 'auction_canceled': return 'bg-red-50 text-red-600';
        default: return 'bg-slate-50 text-slate-600';
    }
};

const NOTIFICATION_REDIRECT_MAP = {
    auction_sold: 'completed-auctions',
    auction_canceled: 'canceled-auctions',
};

function Notifications({ setCurrentPage }) {

    const [activeTab, setActiveTab] = useState('all');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // search debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const isReadParam = activeTab === 'unread' ? 'false' : activeTab === 'read' ? 'true' : undefined;

    const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetAllNotificationsInfinite(10, isReadParam, debouncedSearch);
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
        <div className='space-y-5'>

            {/* Page Header */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div>
                    <h1 className='text-xl md:text-2xl font-bold text-[#0B1E3D]'> Notifications</h1>
                    <p className='text-xs md:text-sm text-slate-500 mt-1'>Stay updated with important auction activities.</p>
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
                            className='flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0B1E3D] text-white rounded-lg text-xs font-semibold hover:bg-[#162d52] transition-colors'
                        >
                            <CheckCheck size={15} />
                            Mark all as read
                        </button>
                    )}
                </div>
            </div>

            {/* Summary */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>

                {/* Total Notifications */}
                <div className='group bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200'>
                    <div className='flex items-center justify-between'>

                        <div>
                            <p className='text-[11px] uppercase tracking-wider text-slate-400 font-semibold'>
                                Total Notifications
                            </p>

                            <p className='text-2xl font-bold text-[#0B1E3D] mt-1'>
                                {totalCount}
                            </p>

                            <p className='text-[10px] text-slate-400 mt-1'>
                                All notifications
                            </p>
                        </div>

                        <div className='w-11 h-11 rounded-xl bg-slate-50 text-[#0B1E3D] flex items-center justify-center group-hover:bg-[#0B1E3D] group-hover:text-white transition-all duration-200'>
                            <Bell size={19} />
                        </div>

                    </div>
                </div>


                {/* Unread */}
                <div className='group bg-white border border-amber-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-200'>
                    <div className='flex items-center justify-between'>

                        <div>
                            <p className='text-[11px] uppercase tracking-wider text-slate-400 font-semibold'>
                                Unread
                            </p>

                            <p className='text-2xl font-bold text-[#D97706] mt-1'>
                                {unreadCount}
                            </p>

                            <p className='text-[10px] text-amber-600/70 mt-1'>
                                Needs your attention
                            </p>
                        </div>

                        <div className='w-11 h-11 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center group-hover:bg-[#D97706] group-hover:text-white transition-all duration-200'>
                            <BellRing size={19} />
                        </div>

                    </div>
                </div>


                {/* Read */}
                <div className='group bg-white border border-green-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-200'>
                    <div className='flex items-center justify-between'>

                        <div>
                            <p className='text-[11px] uppercase tracking-wider text-slate-400 font-semibold'>
                                Read
                            </p>

                            <p className='text-2xl font-bold text-green-600 mt-1'>
                                {totalCount - unreadCount}
                            </p>

                            <p className='text-[10px] text-green-600/70 mt-1'>
                                Already reviewed
                            </p>
                        </div>

                        <div className='w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all duration-200'>
                            <Check size={19} />
                        </div>

                    </div>
                </div>

            </div>

            {/* Notification Container */}
            <div className='bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm'>

                {/* Filters */}
                <div className='p-4 sm:p-5 border-b border-slate-100 bg-slate-50/30'>

                    <div className='flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between'>

                        {/* Search */}
                        <div className='flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 w-full lg:w-80 focus-within:border-[#D97706] focus-within:ring-2 focus-within:ring-amber-50 transition-all'>

                            <Search
                                size={16}
                                className='text-slate-400 shrink-0'
                            />
                            <input
                                type='text'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder='Search notifications...'
                                className='w-full bg-transparent outline-none text-xs text-slate-700 placeholder-slate-400'
                            />
                        </div>

                        {/* Tabs */}
                        <div className='flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-1 rounded-xl w-fit'>

                            {[
                                ['all', 'All'],
                                ['unread', 'Unread'],
                                ['read', 'Read'],
                            ].map(([value, label]) => (

                                <button
                                    key={value}
                                    onClick={() => setActiveTab(value)}
                                    className={`relative px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer
                                        ${activeTab === value
                                            ? 'bg-[#0B1E3D] text-white shadow-sm'
                                            : 'text-slate-500 hover:text-[#0B1E3D] hover:bg-white'
                                        }`}
                                >
                                    {label}

                                    {value === 'unread' && unreadCount > 0 && (
                                        <span
                                            className={`ml-1.5 inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[9px] font-bold
                        ${activeTab === value
                                                    ? 'bg-amber-500 text-white'
                                                    : 'bg-amber-100 text-amber-700'
                                                }`}
                                        >
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                            ))}

                        </div>

                    </div>
                </div>


                {/* Notification List */}
                <div>

                    {isLoading ? (

                        <div className='py-20 text-center'>
                            <RefreshCw
                                size={20}
                                className='mx-auto text-amber-500 animate-spin'
                            />
                            <p className='text-xs text-slate-400 mt-3'>
                                Loading notifications...
                            </p>
                        </div>

                    ) : isError ? (

                        <div className='py-20 text-center'>
                            <div className='w-12 h-12 mx-auto rounded-xl bg-red-50 text-red-500 flex items-center justify-center'>
                                <X size={20} />
                            </div>

                            <p className='text-xs font-semibold text-red-500 mt-3'>
                                Failed to load notifications
                            </p>

                            <p className='text-[11px] text-slate-400 mt-1'>
                                Please try again later.
                            </p>
                        </div>

                    ) : notifications.length > 0 ? (

                        <div>

                            {notifications.map((notification) => (

                                <button
                                    key={notification._id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`group w-full text-left flex gap-4 p-4 sm:p-5 border-b border-slate-100 last:border-b-0 transition-all cursor-pointer
                                        ${notification.isRead
                                            ? 'bg-white hover:bg-slate-50'
                                            : 'bg-amber-50/30 hover:bg-amber-50/70'
                                        }`}
                                >

                                    {/* Icon */}
                                    <div
                                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 transition-all
                                        ${getIconStyle(notification.type)} group-hover:scale-[1.03]`}>
                                        {getIcon(notification.type)}
                                    </div>

                                    {/* Content */}
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-start justify-between gap-3'>
                                            <div className='flex items-center gap-2 min-w-0'>
                                                <h3
                                                    className={`text-sm truncate
                                                        ${notification.isRead
                                                            ? 'font-semibold text-slate-700'
                                                            : 'font-bold text-[#0B1E3D]'
                                                        }`}
                                                >
                                                    {notification.title}
                                                </h3>

                                                {!notification.isRead && (
                                                    <span className='w-2 h-2 rounded-full bg-[#D97706] shrink-0' />
                                                )}

                                            </div>

                                            <span className='text-[10px] text-slate-400 whitespace-nowrap pt-0.5'>
                                                {getRelativeTime(notification.createdAt)}
                                            </span>

                                        </div>

                                        <p className='text-xs sm:text-sm text-slate-500 leading-5 mt-1 max-w-3xl'>
                                            {notification.message}
                                        </p>

                                    </div>

                                    {/* Arrow */}
                                    <ChevronRight
                                        size={17}
                                        className='text-slate-300 shrink-0 mt-2 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all'
                                    />

                                </button>

                            ))}

                        </div>

                    ) : (

                        /* Empty State */
                        <div className='py-20 text-center'>

                            <div className='w-14 h-14 mx-auto rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center'>
                                <Bell
                                    size={23}
                                    className='text-slate-300'
                                />
                            </div>

                            <h3 className='text-sm font-semibold text-slate-600 mt-4'>
                                {activeTab === 'unread'
                                    ? 'No unread notifications'
                                    : activeTab === 'read'
                                        ? 'No read notifications'
                                        : 'No notifications'}
                            </h3>

                            <p className='text-xs text-slate-400 mt-1'>
                                You're all caught up!
                            </p>

                        </div>

                    )}

                </div>


                {/* Load More */}
                {hasNextPage && (
                    <div className='flex justify-center py-5 border-t border-slate-100 bg-slate-50/30'>

                        <button
                            onClick={handleLoadMore}
                            disabled={isFetchingNextPage}
                            className='flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-sm'
                        >

                            {isFetchingNextPage ? (
                                <>
                                    <RefreshCw
                                        size={14}
                                        className='animate-spin'
                                    />
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
};

export default Notifications;