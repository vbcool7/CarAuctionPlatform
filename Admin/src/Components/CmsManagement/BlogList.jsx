
import React, { useState, useEffect } from 'react';
import { Plus, FileText, Globe, FileEdit, Pencil, Trash2, Car, } from 'lucide-react';
import SearchBar from '../SharedComponents/SearchBar';
import FilterDropdown from '../SharedComponents/FilterDropdown';
import toast from 'react-hot-toast';
import { fmtDate } from '../utils/formatter';
import { getPaginationRange } from '../utils/getPaginationRange';

import { useGetAllBlogs, useDeleteBlog } from '../../hooks/useBlog';

const STATUS_OPTIONS = [
    { label: 'All Status', value: '' },
    { label: 'Published', value: 'published' },
    { label: 'Draft', value: 'draft' },
];

const SORT_OPTIONS = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'A to Z', value: 'az' },
];

const errMsg = (e) => e?.response?.data?.message || 'Something went wrong';

function BlogList({ setCurrentPage, setEditingBlog }) {

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filters, setFilters] = useState({ status: '', category: '', sortBy: 'newest' });

    const [selectedBlog, setSelectedBlog] = useState(null); // delete modal

    const { data, isLoading, isError, isPlaceholderData } = useGetAllBlogs({
        page,
        limit: 10,
        search: debouncedSearch,
        status: filters.status,
        category: filters.category,
        sortBy: filters.sortBy,
    });
    const deleteBlog = useDeleteBlog();

    const blogs = data?.blogs ?? [];
    const stats = data?.stats ?? {};
    const categories = data?.categories ?? [];
    const totalPages = data?.pagination?.totalPages || 1;
    const total = data?.pagination?.total || 0;

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        setPage(1);
    }, [filters, debouncedSearch]);

    const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

    // delete blog
    const handleDeleteConfirm = () => {
        if (!selectedBlog) return;

        deleteBlog.mutate(selectedBlog._id, {
            onSuccess: () => {
                toast.success('Blog deleted');
                if (blogs.length === 1 && page > 1) setPage((p) => p - 1);
                setSelectedBlog(null);
            },
            onError: (e) => toast.error(errMsg(e)),
        });
    };

    if (isLoading) return <p className="p-10 text-center">Loading blogs....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load blogs</p>;

    const blogStats = [
        { id: 1, title: 'Total Posts', value: stats.total || 0, subtext: 'All blog posts', icon: FileText, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
        { id: 2, title: 'Published', value: stats.published || 0, subtext: 'Live posts', icon: Globe, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
        { id: 3, title: 'Drafts', value: stats.drafts || 0, subtext: 'Not published yet', icon: FileEdit, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
    ];

    const categoryOptions = [
        { label: 'All Categories', value: '' },
        ...categories.map((c) => ({ label: c.label, value: c.value })),
    ];

    return (
        <div className='pb-6'>
            {/* Header */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between pb-6">
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-[#0B1E3D] sm:text-2xl">
                        All Blogs
                    </h1>

                    <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                        Create, edit, and manage all blog posts published on your website.
                    </p>
                </div>

                {/* buttons */}
                <div className="">
                    <button
                        onClick={() => {
                            setEditingBlog(null);
                            setCurrentPage('create-blog-post');
                        }}
                        className="flex py-2.5 items-center justify-center gap-2 rounded-lg bg-[#D97706] px-4 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-amber-700 active:scale-[0.98]">
                        <Plus size={16} />
                        <span>Create New Blog</span>
                    </button>
                </div>
            </div>

            {/* stats  */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {blogStats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.id}
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                            <div>
                                <span className="mb-1 block text-xs font-medium text-slate-500">
                                    {stat.title}
                                </span>

                                <h4 className="py-1 text-xl font-bold tracking-tight text-slate-900">
                                    {Number(stat.value).toLocaleString()}
                                </h4>

                                <span className="mt-1 block text-xs text-slate-500">
                                    {stat.subtext}
                                </span>
                            </div>
                            <div
                                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}>
                                <Icon size={22} className={stat.iconColor} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search / Filter */}
            <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap xl:flex-nowrap w-full items-center gap-3">

                    <div className="flex-1 sm:w-75">
                        <SearchBar
                            placeholder="Search by title, blog ID or tag..."
                            value={search}
                            onChange={(value) => setSearch(value)}
                        />
                    </div>

                    <div className="w-full sm:w-44 shrink-0">
                        <FilterDropdown
                            label="All Status"
                            options={STATUS_OPTIONS}
                            value={filters.status}
                            onChange={(value) => updateFilter('status', value)}
                        />
                    </div>

                    <div className="w-full sm:w-48 shrink-0">
                        <FilterDropdown
                            label="All Categories"
                            options={categoryOptions}
                            value={filters.category}
                            onChange={(value) => updateFilter('category', value)}
                        />
                    </div>

                    <div className="w-full sm:w-44 shrink-0">
                        <FilterDropdown
                            label="Sort By"
                            options={SORT_OPTIONS}
                            value={filters.sortBy}
                            onChange={(value) => updateFilter('sortBy', value)}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setSearch('');
                            setDebouncedSearch('');
                            setFilters({ status: '', category: '', sortBy: 'newest' });
                            setPage(1);
                        }}
                        className="flex items-center gap-1.5 h-9 px-1.5 text-xs font-semibold text-amber-600 underline underline-offset-4 decoration-amber-300 hover:text-amber-700 hover:decoration-amber-600 transition-all">
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left table-fixed">
                    <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4 w-32">Blog ID</th>
                            <th className="px-6 py-4 w-85">Blog Title</th>
                            <th className="px-6 py-4 w-45">Category</th>
                            <th className="px-6 py-4 w-45">Author</th>
                            <th className="px-6 py-4 w-40">Status</th>
                            <th className="px-6 py-4 w-40">Published Date</th>
                            <th className="px-6 py-4 w-45 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody className={`divide-y divide-slate-100 bg-white transition-opacity ${isPlaceholderData ? 'opacity-50 pointer-events-none' : ''}`}>
                        {blogs.length > 0 ? (
                            blogs.map((post) => (
                                <tr
                                    key={post._id}
                                    className="transition-colors hover:bg-slate-50/80">

                                    {/* Blog ID */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-600">
                                            {post.blogId}
                                        </span>
                                    </td>

                                    {/* Blog Title & Cover Image */}
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="flex items-center gap-3.5">
                                            {post.coverImage ? (
                                                <img
                                                    src={typeof post.coverImage === 'string' ? post.coverImage : post.coverImage?.url}
                                                    alt={post.title}
                                                    className="h-12 w-20 shrink-0 rounded-xl border border-slate-200 object-cover shadow-sm"
                                                />
                                            ) : (
                                                <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                                                    <Car size={18} />
                                                </div>
                                            )}

                                            <div className="min-w-0">
                                                <h4 className="truncate font-semibold text-[#0B1E3D] text-sm hover:text-[#D97706] transition-colors" title={post.title}>
                                                    {post.title}
                                                </h4>
                                                <p className="mt-0.5 text-xs text-slate-400 font-medium">
                                                    {post.readingTime} min read
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {post.category ? (
                                            <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200/50 px-3 py-1 text-xs font-semibold text-blue-600">
                                                {post.category}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-400">—</span>
                                        )}
                                    </td>

                                    {/* Author */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="font-medium text-slate-700 text-sm truncate">
                                            {typeof post.author === 'object' ? post.author?.name : post.author}
                                        </p>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${post.status === 'published'
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                                                : 'bg-amber-50 text-amber-700 border border-amber-200/50'
                                                }`}
                                        >
                                            <span className={`h-1.5 w-1.5 rounded-full ${post.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            {post.status === 'published' ? 'Published' : 'Draft'}
                                        </span>
                                    </td>

                                    {/* Published Date */}
                                    <td className="px-6 py-4 text-slate-600 text-sm whitespace-nowrap font-medium">
                                        {post.publishedAt ? fmtDate(post.publishedAt) : '—'}
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                title="Edit"
                                                onClick={() => {
                                                    setEditingBlog(post);
                                                    setCurrentPage('edit-blog-post');
                                                }}
                                                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706]">
                                                <Pencil size={15} />
                                            </button>

                                            <button
                                                type="button"
                                                disabled={post.status === 'published'}
                                                title={post.status === 'published' ? 'Unpublish this blog before deleting' : 'Delete'}
                                                onClick={() => setSelectedBlog(post)}
                                                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-500">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-16 text-center">
                                    <p className="text-sm font-semibold text-slate-600">No Data Found</p>
                                    <p className="text-xs text-slate-400 mt-1">There are no blogs to display right now.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-white">

                    <p className="hidden sm:block text-xs text-slate-500">
                        Page <span className="font-semibold text-[#0B1E3D]">{page}</span> of{' '}
                        <span className="font-semibold text-[#0B1E3D]">{totalPages}</span>
                        <span className="ml-2 text-slate-400">({total} blogs)</span>
                    </p>

                    <div className="flex items-center gap-1.5 mx-auto sm:mx-0 sm:ml-auto">
                        <button
                            type="button"
                            onClick={() => setPage((p) => p - 1)}
                            disabled={page === 1}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                            Previous
                        </button>

                        {getPaginationRange(page, totalPages).map((num, idx) =>
                            num === '...' ? (
                                <span key={`dot-${idx}`} className="px-2 py-1.5 text-xs font-medium text-slate-400">...</span>
                            ) : (
                                <button
                                    type="button"
                                    key={num}
                                    onClick={() => setPage(num)}
                                    className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold border transition-all ${page === num
                                        ? 'bg-[#D97706] text-white border-[#D97706] shadow-sm'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-[#D97706] hover:border-amber-200'}`}>
                                    {num}
                                </button>
                            )
                        )}

                        <button
                            type="button"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page === totalPages}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* delete modal */}
            {selectedBlog && (
                <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

                        <div className="flex flex-col items-center border-b border-slate-100 px-6 py-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                <Trash2 className="text-red-600" size={28} />
                            </div>

                            <h2 className="mt-4 text-xl font-semibold text-[#0B1E3D]">
                                Delete Blog Post
                            </h2>

                            <p className="mt-2 text-center text-sm leading-6 text-slate-500">
                                This will permanently delete the draft and its cover image.
                            </p>

                            <p className="mt-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                                {selectedBlog.title}
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 p-5">
                            <button
                                type="button"
                                disabled={deleteBlog.isPending}
                                onClick={() => setSelectedBlog(null)}
                                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={deleteBlog.isPending}
                                onClick={handleDeleteConfirm}
                                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                            >
                                {deleteBlog.isPending ? 'Deleting...' : 'Delete Blog'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BlogList;