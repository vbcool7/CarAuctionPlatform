
import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, FileText, Pencil, Plus, Trash2 } from 'lucide-react';

import { useGetAllPages, useDeletePage } from '../../../hooks/usePage';

const FOOTER_LABEL = { support: 'Support', buyers: 'For Buyers', sellers: 'For Sellers' };

const STATUS_META = {
    published: { label: 'Published', style: 'border-green-200 bg-green-50 text-green-700' },
    draft: { label: 'Draft', style: 'border-amber-200 bg-amber-50 text-amber-600' },
};

const tabs = [
    { id: 'all', label: 'All Pages', status: '' },
    { id: 'published', label: 'Published', status: 'published' },
    { id: 'draft', label: 'Drafts', status: 'draft' },
];

const fmt = (d) =>
    d
        ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Dubai' })
        : '—';

const FORM_PAGE_ID = 'create-custom-page';

function PageList({ setCurrentPage, setEditingPage }) {

    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [toDelete, setToDelete] = useState(null);

    const params = { page, limit: 10 };
    if (status) params.status = status;
    if (debouncedSearch) params.search = debouncedSearch;

    const { data, isLoading, isError, isPlaceholderData } = useGetAllPages(params);
    const { mutate: deletePage, isPending: isDeleting } = useDeletePage();

    const pages = data?.pages ?? [];
    const stats = data?.stats ?? {};
    const totalPages = data?.pagination?.totalPages || 1;

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [status, debouncedSearch]);

    // delete ke baad last page khaali ho jaye to ek page peeche
    useEffect(() => {
        if (data && !isPlaceholderData && pages.length === 0 && page > 1) setPage((p) => p - 1);
    }, [data, isPlaceholderData, pages.length, page]);

    const openForm = (p) => {
        setEditingPage(p || null);
        setCurrentPage(FORM_PAGE_ID);
    };

    const confirmDelete = () => {
        if (!toDelete) return;
        deletePage(toDelete._id, { onSuccess: () => setToDelete(null) });
    };

    if (isLoading) return <p className="p-10 text-center">Loading pages....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load pages</p>;

    const statsData = [
        { title: 'Total Pages', value: stats.total || 0, icon: FileText, theme: 'bg-purple-50', iconColor: 'text-purple-600' },
        { title: 'Published', value: stats.published || 0, icon: CheckCircle, theme: 'bg-green-50', iconColor: 'text-green-600' },
        { title: 'Drafts', value: stats.draft || 0, icon: Clock, theme: 'bg-amber-50', iconColor: 'text-amber-500' },
    ];

    return (
        <div className="pb-6">

            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">All Pages</h1>

                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage('dashboard')}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Dashboard
                        </span>
                        <span className="mx-2 text-slate-300">/</span>
                        <span className="text-slate-500">CMS Management</span>
                        <span className="mx-2 text-slate-300">/</span>
                        <span className="font-medium text-[#D97706]">All Pages</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => openForm(null)}
                    className="flex py-2.5 items-center justify-center gap-2 rounded-lg bg-[#D97706] px-4 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-amber-700 active:scale-[0.98]">
                    <Plus size={16} />
                    <span>Create Page</span>
                </button>
            </div>

            {/* stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statsData.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div
                            key={s.title}
                            className="bg-white rounded-2xl border border-slate-100 px-4 py-5 shadow-sm flex items-center justify-between">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">{s.title}</span>
                                <h4 className="text-xl font-bold text-slate-900">{Number(s.value).toLocaleString()}</h4>
                            </div>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.theme} ${s.iconColor}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* search */}
            <div className="my-6 bg-white border border-slate-200 rounded-xl p-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by page title..."
                    className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none focus:border-[#D97706]"
                />
            </div>

            {/* tabs */}
            <div className="flex gap-10 border-b border-slate-100 mb-6 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setStatus(tab.status)}
                        className={`pb-3 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors
                            ${status === tab.status
                                ? 'border-[#D97706] text-[#D97706]'
                                : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
                <table className="w-full text-left table-fixed min-w-225">
                    <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4 w-56">Title</th>
                            <th className="px-6 py-4 w-56">Slug</th>
                            <th className="px-6 py-4 w-32">Status</th>
                            <th className="px-6 py-4 w-40">Footer</th>
                            <th className="px-6 py-4 w-36">Last Updated</th>
                            <th className="px-6 py-4 w-28">Actions</th>
                        </tr>
                    </thead>

                    <tbody className={`divide-y divide-amber-50 transition-opacity ${isPlaceholderData ? 'opacity-50 pointer-events-none' : ''}`}>
                        {pages.length > 0 ? (
                            pages.map((p) => {
                                const meta = STATUS_META[p.status] || STATUS_META.draft;
                                const isPublished = p.status === 'published';
                                return (
                                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-[13px] font-semibold text-slate-800 truncate" title={p.title}>
                                                {p.title}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="text-[12px] text-slate-500 truncate" title={`/page/${p.slug}`}>
                                                /{p.slug}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[11px] font-medium border ${meta.style}`}>{meta.label}</span>
                                        </td>

                                        <td className="px-6 py-4 text-[13px] text-slate-700">
                                            {p.footerColumn ? (
                                                <>
                                                    <div className="font-medium">{FOOTER_LABEL[p.footerColumn] || p.footerColumn}</div>
                                                    <div className="text-[11px] text-slate-400">Order {p.footerOrder}</div>
                                                </>
                                            ) : (
                                                <span className="text-slate-400">—</span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-[13px] text-slate-700">{fmt(p.lastUpdatedAt)}</td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => openForm(p)}
                                                    title="Edit page"
                                                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setToDelete(p)}
                                                    disabled={isPublished}
                                                    title={isPublished ? 'Unpublish this page before deleting' : 'Delete page'}
                                                    className="p-1 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-slate-400">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                    <p className="text-sm font-medium text-gray-500">No Data Found</p>
                                    <p className="text-xs text-gray-400 mt-1">There are no pages to display.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* pagination */}
            {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between gap-4">
                    <p className="text-xs text-slate-500">
                        Page <span className="font-semibold text-[#0B1E3D]">{page}</span> of{' '}
                        <span className="font-semibold text-[#0B1E3D]">{totalPages}</span>
                    </p>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setPage((p) => p - 1)}
                            disabled={page === 1}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
                            Previous
                        </button>
                        <button
                            type="button"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page >= totalPages}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* delete modal */}
            {toDelete && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                        <h3 className="text-base font-semibold text-[#0B1E3D]">Delete this page?</h3>
                        <p className="mt-2 text-sm text-slate-500 wrap-break-word">
                            "{toDelete.title}" will be permanently deleted. This cannot be undone.
                        </p>

                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setToDelete(null)}
                                disabled={isDeleting}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PageList;