
import React, { useEffect, useState } from 'react';
import Loader from './Loader';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, CalendarDays, User, Link2, Check } from 'lucide-react';
import { useGetPublicBlogBySlug } from '../hook/useBlog';

const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

function BlogDetail() {

    const { slug } = useParams();
    const { data, isLoading, isError, error } = useGetPublicBlogBySlug(slug);
    const [copied, setCopied] = useState(false);

    const blog = data?.blog;
    const related = data?.related ?? [];

    // browser tab ka title
    useEffect(() => {
        if (!blog?.title) return;
        const prev = document.title;
        document.title = blog.title;
        return () => { document.title = prev; };
    }, [blog?.title]);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // clipboard block ho to chup raho
        }
    };

    if (isLoading) {
        return <Loader />
    }

    if (isError || !blog) {
        const notFound = error?.response?.status === 404;
        return (
            <div className="mx-auto max-w-xl px-4 py-24 text-center">
                <h1 className="text-2xl font-bold text-[#0B1E3D]">
                    {notFound ? 'Blog not found' : 'Something went wrong'}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    {notFound
                        ? 'This post may have been removed or is not published yet.'
                        : 'Could not load this blog. Please try again later.'}
                </p>
                <Link
                    to="/blog"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D97706] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-amber-700"
                >
                    <ArrowLeft size={16} /> Back to Blog
                </Link>
            </div>
        );
    }

    return (
        <article className="bg-white">
            <div className="mx-auto max-w-4xl px-4 pb-16 pt-10 sm:px-6">

                {/* Top Row: All Blogs (Left) & Category (Right) in one line */}
                <div className="flex items-center justify-between gap-4">
                    {/* Back button */}
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-[#D97706] hover:text-white"
                    >
                        <ArrowLeft size={14} /> All Blogs
                    </Link>

                    {/* Category badge */}
                    {blog.category && (
                        <Link
                            to={`/blog?category=${blog.categorySlug}`}
                            className="inline-block rounded-full bg-amber-50 border border-amber-200/60 px-3.5 py-1 text-xs font-semibold text-[#D97706] transition hover:bg-amber-100"
                        >
                            {blog.category}
                        </Link>
                    )}
                </div>

                {/* header */}
                <header className="mt-6">
                    <h1 className="text-3xl font-extrabold tracking-tight text-[#0B1E3D] sm:text-4xl lg:text-5xl leading-[1.15]">
                        {blog.title}
                    </h1>

                    {/* Author & Meta info bar */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-4 text-sm text-slate-500">
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                            <span className="flex items-center gap-1.5 font-medium text-slate-700">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[#0B1E3D]">
                                    <User size={14} />
                                </span>
                                {blog.author}
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-500">
                                <CalendarDays size={15} className="text-slate-400" /> {fmtDate(blog.publishedAt)}
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-500">
                                <Clock size={15} className="text-slate-400" /> {blog.readingTime} min read
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={copyLink}
                            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-[#D97706] hover:text-[#D97706]"
                        >
                            {copied ? <><Check size={13} className="text-emerald-600" /> Copied link</> : <><Link2 size={13} /> Copy link</>}
                        </button>
                    </div>
                </header>

                {/* cover image with soft shadow & rounded corners */}
                {blog.coverImage && (
                    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-100 shadow-md">
                        <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="aspect-video w-full object-cover"
                        />
                    </div>
                )}

                {/* content: server par sanitize hua HTML */}
                <div
                    className="ck-content mt-10 text-base leading-relaxed text-slate-700 wrap-break-word space-y-4"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* tags */}
                {blog.tags?.length > 0 && (
                    <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-6">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Tags:</span>
                        {blog.tags.map((t) => (
                            <span key={t} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-200">
                                #{t}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* related */}
            {related.length > 0 && (
                <section className="border-t border-slate-200/60 bg-linear-to-b from-slate-50/50 to-slate-100/60 px-4 py-16 sm:px-6">
                    <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
                        {/* Section Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">
                                    Related Articles
                                </span>
                                <h2 className="text-2xl font-extrabold tracking-tight text-[#0B1E3D] mt-1">
                                    More in {blog.category}
                                </h2>
                            </div>
                            <Link
                                to={`/blog?category=${blog.categorySlug}`}
                                className="text-xs font-semibold text-slate-600 hover:text-[#D97706] transition-colors self-start sm:self-auto"
                            >
                                View all in {blog.category} &rarr;
                            </Link>
                        </div>

                        {/* Cards Grid */}
                        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((r) => (
                                <Link
                                    key={r.blogId}
                                    to={`/blog/${r.slug}`}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D97706]/40 hover:shadow-xl"
                                >
                                    <div className="aspect-video overflow-hidden bg-slate-100 relative">
                                        {r.coverImage && (
                                            <img
                                                src={typeof r.coverImage === 'string' ? r.coverImage : r.coverImage.url}
                                                alt={r.title}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col p-5">
                                        <h3 className="line-clamp-2 text-base font-bold leading-snug text-[#0B1E3D] transition-colors group-hover:text-[#D97706]">
                                            {r.title}
                                        </h3>
                                        <p className="mt-auto pt-4 text-xs font-medium text-slate-400 flex items-center gap-1.5">
                                            <span>{fmtDate(r.publishedAt)}</span>
                                            <span>·</span>
                                            <span>{r.readingTime} min read</span>
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </article>
    );
}

export default BlogDetail;