
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Tags, CheckCircle, XCircle } from 'lucide-react';

import SearchBar from '../../SharedComponents/SearchBar';
import FilterDropdown from '../../SharedComponents/FilterDropdown';
import { getPaginationRange } from '../../utils/getPaginationRange';
import { useGetDisputeCategories, useUpdateDisputeCategory } from '../../../hooks/useDispute';
import { getDisputeIcon } from '../../utils/disputeIcons';

const APPLIES_LABEL = { buyer: 'Buyer', seller: 'Seller', both: 'Buyer & Seller' };

const tabs = [
  { id: 'all', label: 'All', status: '' },
  { id: 'active', label: 'Active', status: 'active' },
  { id: 'inactive', label: 'Inactive', status: 'inactive' },
];

const appliesOptions = [
  { label: 'Applies To (All)', value: '' },
  { label: 'Buyer', value: 'buyer' },
  { label: 'Seller', value: 'seller' },
  { label: 'Buyer & Seller', value: 'both' },
];

function DisputeCategories({ setCurrentPage, setSelectedCategoryId }) {

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [appliesTo, setAppliesTo] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data, isLoading, isError, isPlaceholderData } = useGetDisputeCategories({
    page, limit: 10, search: debouncedSearch, status, appliesTo,
  });
  const update = useUpdateDisputeCategory();

  const categories = data?.categories ?? [];
  const stats = data?.stats ?? {};
  const totalPages = data?.pagination?.totalPages || 1;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [status, appliesTo, debouncedSearch]);

  // toggle status
  const toggleActive = (c) => {
    const next = !c.isActive;
    const ok = window.confirm(
      next
        ? `Activate "${c.name}"?`
        : `Deactivate "${c.name}"? This category will not be visible in new disputes. Existing disputes will remain unaffected.`
    );
    if (!ok) return;

    update.mutate({ id: c._id, isActive: next }, {
      onSuccess: () => toast.success(next ? 'Category activated' : 'Category deactivated'),
      onError: (err) => toast.error(err?.response?.data?.message || 'Something went wrong'),
    });
  };

  if (isLoading) return <p className="p-10 text-center">Loading categories....</p>;
  if (isError) return <p className="p-10 text-center text-red-500">Failed to load categories</p>;

  const statsData = [
    { title: 'Total Categories', value: stats.total || 0, icon: Tags, theme: 'bg-purple-50', iconColor: 'text-purple-600' },
    { title: 'Active', value: stats.active || 0, icon: CheckCircle, theme: 'bg-green-50', iconColor: 'text-green-600' },
    { title: 'Inactive', value: stats.inactive || 0, icon: XCircle, theme: 'bg-slate-100', iconColor: 'text-slate-500' },
  ];

  return (
    <div className='pb-6'>

      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Dispute Categories</h1>

          <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
            <span onClick={() => setCurrentPage('dashboard')} className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">Dashboard</span>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-500">Dispute Management</span>
            <span className="mx-2 text-slate-300">/</span>
            <span className="font-medium text-[#D97706]">Dispute Categories</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCurrentPage('add-new-category')}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-[#D97706] px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statsData.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-xl border border-slate-100 p-4 shadow-md flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-0.5">{s.title}</span>
                <h4 className="py-1 text-base font-bold text-slate-900 tracking-tight">{Number(s.value).toLocaleString()}</h4>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.theme} ${s.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* search / filter */}
      <div className="my-6 bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex flex-wrap xl:flex-nowrap items-center gap-3">
          <div className="flex-1 sm:w-75">
            <SearchBar
              placeholder="Search category name..."
              value={search}
              onChange={(v) => setSearch(v)}
            />
          </div>

          <div className="w-full sm:w-45">
            <FilterDropdown
              label="Applies To (All)"
              options={appliesOptions}
              value={appliesTo}
              onChange={(v) => setAppliesTo(v)}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setSearch('');
              setDebouncedSearch('');
              setStatus('');
              setAppliesTo('');
              setPage(1);
            }}
            className="h-9 px-1.5 text-xs font-semibold text-amber-600 underline underline-offset-4 decoration-amber-300 hover:text-amber-700">
            Clear Filters
          </button>
        </div>
      </div>

      {/* tabs */}
      <div className="flex gap-8 border-b border-slate-100 mb-6 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatus(tab.status)}
            className={`pb-3 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors ${status === tab.status
              ? 'border-[#D97706] text-[#D97706]'
              : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            {tab.label}
            <span className="ml-1.5 text-[11px] text-slate-400">
              ({tab.status ? (stats[tab.status] ?? 0) : (stats.total ?? 0)})
            </span>
          </button>
        ))}
      </div>

      {/* table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-left table-fixed">
          <thead className="bg-gray-100 border-b border-gray-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4 w-32">Category ID</th>
              <th className="px-6 py-4 w-64">Category</th>
              <th className="px-6 py-4 w-64">Description</th>
              <th className="px-6 py-4 w-36">Applies To</th>
              <th className="px-6 py-4 w-36">Disputes</th>
              <th className="px-6 py-4 w-28">Status</th>
              <th className="px-6 py-4 w-40 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className={`divide-y divide-slate-100 transition-opacity ${isPlaceholderData ? 'opacity-50 pointer-events-none' : ''}`}>
            {categories.length > 0 ? categories.map((c) => {
              const Icon = getDisputeIcon(c.icon);

              return (
                <tr 
                key={c._id} 
                className="hover:bg-slate-50/50 transition-colors text-[13px]">
                  
                  {/* dis cat id */}
                  <td className="px-6 py-4 text-[13px] font-mono text-slate-600">
                    {c.disputeCategoryId}
                  </td>
                  
                  {/* cat name + icon */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 shrink-0 rounded-lg bg-amber-50 text-[#D97706] flex items-center justify-center">
                        <Icon size={16} />
                      </span>
                      <span className="font-semibold text-slate-800 truncate" title={c.name}>{c.name}</span>
                    </div>
                  </td>

                  {/* description */}
                  <td className="px-6 py-4 text-slate-600">
                    <div className="line-clamp-2" title={c.description || ''}>{c.description || '—'}</div>
                  </td>

                  {/* applies to */}
                  <td className="px-6 py-4 text-slate-700">{APPLIES_LABEL[c.appliesTo] || c.appliesTo}</td>

                  {/* total, open */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{c.disputes || 0} total</div>
                    <div className="text-[11px] text-slate-400">{c.openDisputes || 0} open</div>
                  </td>

                  {/* active/inactive badge */}
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium inline-block ${c.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* action */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        title="Edit category"
                        onClick={() => { setSelectedCategoryId(c._id); setCurrentPage('edit-dispute-category'); }}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded">
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        disabled={update.isPending}
                        onClick={() => toggleActive(c)}
                        className="rounded-md border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                        {c.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <p className="text-sm font-medium text-gray-500">No Data Found</p>
                  <p className="text-xs text-gray-400 mt-1">There are no categories to display.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[11px] text-slate-400">Categories cannot be deleted; they can only be deactivated to preserve records of existing disputes.</p>

      {/* pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-white">
          <p className="hidden sm:block text-xs text-slate-500">
            Page <span className="font-semibold text-[#0B1E3D]">{page}</span> of <span className="font-semibold text-[#0B1E3D]">{totalPages}</span>
          </p>
          <div className="flex items-center gap-1.5 mx-auto sm:mx-0 sm:ml-auto">
            <button type="button" onClick={() => setPage((p) => p - 1)} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
              Previous
            </button>
            {getPaginationRange(page, totalPages).map((num, idx) =>
              num === '...' ? (
                <span key={`dot-${idx}`} className="px-2 py-1.5 text-xs font-medium text-slate-400">...</span>
              ) : (
                <button type="button" key={num} onClick={() => setPage(num)}
                  className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold border transition-all ${page === num
                    ? 'bg-[#D97706] text-white border-[#D97706]'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-[#D97706] hover:border-amber-200'}`}>
                  {num}
                </button>
              )
            )}
            <button type="button" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisputeCategories;