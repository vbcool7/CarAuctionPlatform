
import React, { useEffect } from 'react';
import Loader from './Loader';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { useGetPublicPage } from '../hook/usePage';

const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Dubai' }) : '';

function PageDetail() {

    const { slug } = useParams();
    const { data: page, isLoading, isError, error } = useGetPublicPage(slug);

    // title of browser tab
    useEffect(() => {
        if (!page?.title) return;
        const prev = document.title;
        document.title = page.title;
        return () => { document.title = prev; };
    }, [page?.title]);

    if (isLoading) return <Loader />;

    if (isError || !page) {
        const notFound = error?.response?.status === 404;
        return (
            <div className="mx-auto max-w-xl px-4 py-24 text-center">
                <h1 className="text-2xl font-bold text-[#0B1E3D]">
                    {notFound ? 'Page not found' : 'Something went wrong'}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    {notFound
                        ? 'This page may have been removed or is not available yet.'
                        : 'Could not load this page. Please try again later.'}
                </p>
                <Link
                    to="/"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D97706] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-amber-700"
                >
                    <ArrowLeft size={16} /> Back to Home
                </Link>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-slate-50/70 pb-20">
            {/* Light Contrasting Hero Banner */}
            <div className="border-b border-slate-200/80 bg-linear-to-b from-slate-100 to-slate-50 pt-10 pb-24 sm:pt-14 sm:pb-28">
                <div className="mx-auto max-w-4xl px-4 sm:px-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        <span>BidDrive Official</span>
                    </div>

                    <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0B1E3D] sm:text-4xl lg:text-[42px] leading-[1.15]">
                        {page.title}
                    </h1>

                    <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                        <CalendarDays size={15} className="text-amber-600" />
                        <span>Last updated: {fmtDate(page.lastUpdatedAt)}</span>
                    </div>
                </div>
            </div>

            {/* Overlapping White Content Card */}
            <div className="relative z-10 mx-auto -mt-14 max-w-4xl px-4 sm:px-6">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-10">
                    <div
                        className="ck-content text-[15px] sm:text-base leading-relaxed text-slate-600 wrap-break-word space-y-4
                [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:border-l-4 [&>h2]:border-amber-500 [&>h2]:pl-3.5 [&>h2]:text-xl [&>h2]:sm:text-2xl [&>h2]:font-bold [&>h2]:text-[#0B1E3D] [&>h2:first-child]:mt-0
                [&>h3]:mt-6 [&>h3]:mb-2 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-[#0B1E3D]
                [&>p]:leading-7
                [&>ul]:my-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ul>li::marker]:text-amber-600
                [&>ol]:my-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2 [&>ol>li::marker]:font-semibold [&>ol>li::marker]:text-slate-700
                [&_strong]:font-semibold [&_strong]:text-slate-800
                [&_a]:font-medium [&_a]:text-amber-600 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-amber-700"
                        dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                </div>
            </div>
        </article>
    );
}

export default PageDetail;