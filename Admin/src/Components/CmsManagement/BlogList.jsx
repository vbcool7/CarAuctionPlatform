
import React, { useState } from 'react';
import { Plus, FileText, Globe, FileEdit, Eye, MessageSquare, Pencil, Trash2, } from 'lucide-react';
import SearchBar from '../SharedComponents/SearchBar';
import FilterDropdown from '../SharedComponents/FilterDropdown';
import { blogPosts } from '../Data';

const blogStats = [
    {
        id: 1,
        title: "Total Posts",
        value: 248,
        subtext: "All blog posts",
        icon: FileText,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        id: 2,
        title: "Published",
        value: 186,
        subtext: "Live posts",
        icon: Globe,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
    },
    {
        id: 3,
        title: "Drafts",
        value: 62,
        subtext: "Pending publish",
        icon: FileEdit,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
    },
    {
        id: 4,
        title: "Views",
        value: "128K",
        subtext: "Total views",
        icon: Eye,
        iconBg: "bg-violet-50",
        iconColor: "text-violet-600",
    },
];

function BlogList({ setCurrentPage, setEditingBlog }) {

    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedSort, setSelectedSort] = useState("newest");

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState();

    const handleDeleteClick = (blog) => {
        setSelectedBlog(blog);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        console.log("Delete Blog:", selectedBlog);

        // API Call

        setIsDeleteModalOpen(false);
        setSelectedBlog(null);
    };

    return (
        <div>
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
                        onClick={() => setCurrentPage('create-blog-post')}
                        className="flex py-2.5 items-center justify-center gap-2 rounded-lg bg-[#D97706] px-4 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-amber-700 active:scale-[0.98]">
                        <Plus size={16} />
                        <span>Create New Blog</span>
                    </button>
                </div>
            </div>

            {/* stats  */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                                    {stat.value}
                                </h4>

                                <span className="mt-1 block text-xs text-slate-500">
                                    {stat.subtext}
                                </span>
                            </div>

                            <div
                                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}
                            >
                                <Icon
                                    size={22}
                                    className={stat.iconColor}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search / Filter */}
            <div className="my-6 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex w-full items-center gap-3">

                    {/* Search */}
                    <div className="flex-1">
                        <SearchBar />
                    </div>

                    {/* Status */}
                    <div className="w-44 shrink-0">
                        <FilterDropdown
                            label="Status"
                            options={[
                                { label: "All Status", value: "all" },
                                { label: "Published", value: "published" },
                                { label: "Draft", value: "draft" },
                                { label: "Scheduled", value: "scheduled" },
                            ]}
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                        />
                    </div>

                    {/* Category */}
                    <div className="w-48 shrink-0">
                        <FilterDropdown
                            label="Category"
                            options={[
                                { label: "All Categories", value: "all" },
                                { label: "Technology", value: "technology" },
                                { label: "Auction Tips", value: "auction-tips" },
                                { label: "Industry News", value: "industry-news" },
                                { label: "Company Updates", value: "company-updates" },
                            ]}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                        />
                    </div>

                    {/* Sort By */}
                    <div className="w-44 shrink-0">
                        <FilterDropdown
                            label="Sort By"
                            options={[
                                { label: "Newest First", value: "newest" },
                                { label: "Oldest First", value: "oldest" },
                                { label: "Most Viewed", value: "views" },
                                { label: "Most Commented", value: "comments" },
                                { label: "A - Z", value: "az" },
                            ]}
                            value={selectedSort}
                            onChange={setSelectedSort}
                        />
                    </div>

                </div>
            </div>

            {/* table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left table-fixed">
                    <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4 w-80">Blog Title</th>
                            <th className="px-6 py-4 w-45">Category</th>
                            <th className="px-6 py-4 w-45">Author</th>
                            <th className="px-6 py-4 w-40">Status</th>
                            <th className="px-6 py-4 w-40">Published Date</th>
                            <th className="px-6 py-4 w-45 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 bg-white">
                        {blogPosts.map((post) => (
                            <tr
                                key={post.id}
                                className="transition-colors hover:bg-slate-50"
                            >
                                {/* Blog Title */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={post.featureImage}
                                            alt={post.title}
                                            className="h-14 w-14 rounded-lg border border-slate-200 object-cover"
                                        />

                                        <div className="min-w-0">
                                            <h4 className="truncate font-semibold text-[#0B1E3D] text-sm">
                                                {post.title}
                                            </h4>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Blog ID #{post.id}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                {/* Category */}
                                <td className="px-6 py-4">
                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                        {post.category}
                                    </span>
                                </td>

                                {/* Author */}
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-slate-800 text-sm">
                                            {post.author}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Content Writer
                                        </p>
                                    </div>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold
                                            ${post.status === "Published"
                                                ? "bg-green-100 text-green-700"
                                                : post.status === "Draft"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-violet-100 text-violet-700"
                                            }`}
                                    >
                                        {post.status}
                                    </span>
                                </td>

                                {/* Published Date */}
                                <td className="px-6 py-4 text-slate-600 text-sm">
                                    {post.publishedDate}
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">

                                        <button className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                                            <Eye size={16} />
                                        </button>

                                        <button
                                            onClick={() => {
                                                setEditingBlog(post);
                                                setCurrentPage('edit-blog-post');
                                            }}
                                            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600">
                                            <Pencil size={16} />
                                        </button>

                                        <button
                                            onClick={() => handleDeleteClick(post)}
                                            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

                        {/* Header */}
                        <div className="flex flex-col items-center border-b border-slate-100 px-6 py-6">

                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                <Trash2 className="text-red-600" size={28} />
                            </div>

                            <h2 className="mt-4 text-xl font-semibold text-[#0B1E3D]">
                                Delete Blog Post
                            </h2>

                            <p className="mt-2 text-center text-sm leading-6 text-slate-500">
                                Are you sure you want to delete this blog post?
                            </p>

                            <p className="mt-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                                {selectedBlog?.title}
                            </p>

                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-5">

                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDeleteConfirm}
                                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                            >
                                Delete Blog
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}

export default BlogList;