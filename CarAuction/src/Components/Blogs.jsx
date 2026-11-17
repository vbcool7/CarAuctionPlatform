
import React, { useEffect, useState } from 'react';
import ContactMainImg from '../assets/Images/ContactMainImg.png';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Clock, ImageOff } from 'lucide-react';

import { useGetPublicBlogs } from '../hook/useBlog';

const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

function BlogCard({ blog }) {
    return (
        <Link
            to={`/blog/${blog.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
            <div className="relative aspect-video overflow-hidden bg-slate-100">
                {blog.coverImage ? (
                    <img
                        src={blog.coverImage}
                        alt={blog.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <ImageOff className="text-slate-300" size={32} />
                    </div>
                )}

                {blog.category && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#D97706] shadow-sm">
                        {blog.category}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3 className="line-clamp-2 text-lg font-bold leading-snug text-[#0B1E3D] transition-colors group-hover:text-[#D97706]">
                    {blog.title}
                </h3>

                {blog.excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{blog.excerpt}</p>
                )}

                <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs text-slate-500">
                    <span className="truncate">
                        {blog.author} · {fmtDate(blog.publishedAt)}
                    </span>
                    <span className="flex shrink-0 items-center gap-1">
                        <Clock size={13} /> {blog.readingTime} min read
                    </span>
                </div>
            </div>
        </Link>
    );
}

function CardSkeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="aspect-video animate-pulse bg-slate-100" />
            <div className="space-y-3 p-5">
                <div className="h-5 w-4/5 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
            </div>
        </div>
    );
}

function Blogs() {

    const [params, setParams] = useSearchParams();
    const page = Math.max(parseInt(params.get('page')) || 1, 1);
    const category = params.get('category') || '';

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const { data, isLoading, isError, isPlaceholderData } = useGetPublicBlogs({
        page,
        limit: 9,
        category,
        search: debouncedSearch,
    });

    const blogs = data?.blogs ?? [];
    const categories = data?.categories ?? [];
    const totalPages = data?.pagination?.totalPages || 1;

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search.trim()), 400);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (page !== 1) {
            setParams((prev) => {
                const next = new URLSearchParams(prev);
                next.delete('page');
                return next;
            }, { replace: true });
        }
    }, [debouncedSearch]);

    const setCategory = (value) => {
        setParams((prev) => {
            const next = new URLSearchParams(prev);
            if (value) next.set('category', value); else next.delete('category');
            next.delete('page');
            return next;
        });
    };

    const goToPage = (n) => {
        setParams((prev) => {
            const next = new URLSearchParams(prev);
            if (n > 1) next.set('page', String(n)); else next.delete('page');
            return next;
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const pillCls = (active) =>
        `whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${active
            ? 'border-[#D97706] bg-[#D97706] text-white'
            : 'border-slate-200 bg-white text-slate-600 hover:border-[#D97706] hover:text-[#D97706]'}`;

    const breadcrumbItems = [
        { label: 'Home', path: '/' },
        { label: 'Contact Us', path: '/contact-us' }
    ];

    return (
        <div className="bg-slate-50">

            {/* hero */}
            <section className="relative overflow-hidden px-4 py-16 sm:py-24">
                <img
                    src={ContactMainImg}
                    alt="Our Blog Banner"
                    className="absolute inset-0 h-full w-full object-cover object-center scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-linear-to-r from-white/20 via-white/10 to-white/20" />

                <div className="relative z-10 mx-auto max-w-6xl">
                    <div className="max-w-2xl text-left">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D97706]/30 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#D97706] shadow-sm backdrop-blur-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" />
                            Insights & Updates
                        </span>

                        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B1E3D] sm:text-5xl lg:text-6xl">
                            Our Blog
                        </h1>

                        <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-700 sm:text-base font-medium">
                            Tips, guides and news about buying and selling cars at auction in the UAE.
                        </p>
                    </div>
                </div>
            </section>
            
            {/* blog list */}
            <section className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 py-10">

                {/* search + categories */}
                <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
                        <button type="button" onClick={() => setCategory('')} className={pillCls(!category)}>
                            All
                        </button>
                        {categories.map((c) => (
                            <button
                                type="button"
                                key={c.value}
                                onClick={() => setCategory(c.value)}
                                className={pillCls(category === c.value)}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full lg:w-72">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search blogs..."
                            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-[#D97706]"
                        />
                    </div>
                </div>

                {/* grid */}
                {isLoading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
                    </div>
                ) : isError ? (
                    <p className="py-20 text-center text-red-500">Could not load blogs. Please try again later.</p>
                ) : blogs.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-lg font-semibold text-[#0B1E3D]">No blogs found</p>
                        <p className="mt-1 text-sm text-slate-500">
                            {debouncedSearch || category ? 'Try a different search or category.' : 'Check back soon for new posts.'}
                        </p>
                    </div>
                ) : (
                    <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-opacity ${isPlaceholderData ? 'opacity-50' : ''}`}>
                        {blogs.map((b) => <BlogCard key={b.blogId} blog={b} />)}
                    </div>
                )}

                {/* pagination */}
                {totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-3">
                        <button
                            type="button"
                            disabled={page === 1}
                            onClick={() => goToPage(page - 1)}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-[#D97706] hover:text-[#D97706] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <span className="text-sm text-slate-500">
                            Page <span className="font-semibold text-[#0B1E3D]">{page}</span> of{' '}
                            <span className="font-semibold text-[#0B1E3D]">{totalPages}</span>
                        </span>

                        <button
                            type="button"
                            disabled={page >= totalPages}
                            onClick={() => goToPage(page + 1)}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-[#D97706] hover:text-[#D97706] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Blogs;