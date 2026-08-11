
import React, { useState } from 'react';
import { FileText, CheckCircle, Pencil, Trash2, Plus, Eye, Edit, MoreVertical } from 'lucide-react';
import SearchBar from '../SharedComponents/SearchBar';
import FilterDropdown from '../SharedComponents/FilterDropdown';
import { cmsPagesList } from '../Data';

const pageStats = [
    {
        id: 'total_pages',
        icon: <FileText className="w-5 h-5 text-blue-600" />,
        iconBg: 'bg-blue-50 border border-blue-100',
        title: 'Total Pages',
        value: 18,
        subtext: 'Aggregate content count',
        badge: '+12% this month',
        badgeColor: 'text-blue-700 bg-blue-50 border-blue-200/60',
    },
    {
        id: 'published_pages',
        icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
        iconBg: 'bg-emerald-50 border border-emerald-100',
        title: 'Published Pages',
        value: 15,
        subtext: 'Live on the platform',
        badge: '83% live rate',
        badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/60',
    },
    {
        id: 'draft_pages',
        icon: <Pencil className="w-5 h-5 text-amber-600" />,
        iconBg: 'bg-amber-50 border border-amber-100',
        title: 'Draft Pages',
        value: 2,
        subtext: 'Work in progress',
        badge: 'Pending review',
        badgeColor: 'text-amber-700 bg-amber-50 border-amber-200/60',
    },
    {
        id: 'archived_pages',
        icon: <Trash2 className="w-5 h-5 text-rose-600" />,
        iconBg: 'bg-rose-50 border border-rose-100',
        title: 'Archived Pages',
        value: 1,
        subtext: 'Removed from live view',
        badge: 'Safe to delete',
        badgeColor: 'text-rose-700 bg-rose-50 border-rose-200/60',
    }
];

function AllPages({setCurrentPage}) {

    const [selectedStatus, setSelectedStatus] = useState();

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between pb-6">
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-[#0B1E3D] sm:text-2xl">
                        All Pages
                    </h1>

                    <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                        Manage all static pages and content shown on the website.
                    </p>
                </div>

                {/* buttons */}
                <div className="">
                    <button 
                    onClick={() => setCurrentPage('create-custom-page')}
                    className="flex py-2.5 items-center justify-center gap-2 rounded-lg bg-[#D97706] px-4 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-amber-700 active:scale-[0.98]">
                        <Plus size={16} />
                        <span>Add New Page</span>
                    </button>
                </div>
            </div>

            {/* stats  */}
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {pageStats.map((stat) => (
                    <div
                        key={stat.id}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-md"
                    >
                        <div>
                            <span className="mb-0.5 block text-xs font-semibold text-slate-500">
                                {stat.title}
                            </span>

                            <h4 className="py-1 text-xl font-bold tracking-tight text-slate-900">
                                {stat.value}
                            </h4>

                            <span className="mt-1 block text-[11px] font-medium text-slate-500">
                                {stat.subtext}
                            </span>
                        </div>

                        <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl shrink-0 ${stat.iconBg}`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Search / Filter */}
            <div className="my-6 bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                    <h2 className="text-lg font-semibold text-slate-800">
                        All Pages
                    </h2>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {/* Search */}
                        <div className="flex-1 sm:w-72">
                            <SearchBar />
                        </div>

                        {/* Status */}
                        <div className="w-40 shrink-0">
                            <FilterDropdown
                                label="All Status"
                                options={[
                                    { label: "Published", value: "Published" },
                                    { label: "Draft", value: "Draft" },
                                ]}
                                value={selectedStatus}
                                onChange={setSelectedStatus}
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left table-fixed">
                    <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4 w-50">Page Title</th>
                            <th className="px-6 py-4 w-45">Slug</th>
                            <th className="px-6 py-4 w-35">Status</th>
                            <th className="px-6 py-4 w-45">Last Updated</th>
                            <th className="px-6 py-4 w-40">Updated By</th>
                            <th className="px-6 py-4 w-35">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                    {cmsPagesList.map((page, index) => (
                        <tr
                            key={index}
                            className="hover:bg-slate-50/50 transition-colors text-[13px]"
                        >
                            {/* Page Title */}
                            <td className="px-6 py-4 font-medium text-slate-800 truncate flex items-center gap-2.5">
                                <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <FileText className="w-4 h-4" />
                                </span>
                                <span className="truncate">{page.title}</span>
                            </td>

                            {/* Slug */}
                            <td className="px-6 py-4 text-slate-500 font-mono text-xs truncate">
                                {page.path}
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    page.status === 'Published' 
                                        ? 'bg-emerald-50 text-emerald-600' 
                                        : 'bg-amber-50 text-amber-600'
                                }`}>
                                    {page.status}
                                </span>
                            </td>

                            {/* Last Updated */}
                            <td className="px-6 py-4 text-slate-600 truncate">
                                {page.date}
                            </td>

                            {/* Updated By */}
                            <td className="px-6 py-4 text-slate-600 truncate">
                                {page.author}
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-2">
                                    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    )
}

export default AllPages;