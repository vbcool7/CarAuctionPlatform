
import React from 'react';
import toast from 'react-hot-toast';
import { ChevronRight, ArrowLeft } from 'lucide-react';

import CategoryForm from './CategoryForm';
import { useGetDisputeCategory, useUpdateDisputeCategory } from '../../../hooks/useDispute';

function EditDisputeCategory({ categoryId, setCurrentPage }) {

    const { data, isLoading, isError } = useGetDisputeCategory(categoryId);
    const update = useUpdateDisputeCategory();
    const category = data?.category;

    const back = () => setCurrentPage('dispute-categories');

    if (isLoading) return <p className="p-10 text-center">Loading category....</p>;

    if (isError || !category) {
        return (
            <div className="p-6">
                <p className="text-sm text-slate-500">Category not found.</p>
                <button
                    onClick={back}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-[#D97706] hover:bg-amber-50 hover:text-[#D97706]">
                    <ArrowLeft size={16} /> Back to Categories
                </button>
            </div>
        );
    }

    const handleSubmit = (body) => {
        update.mutate({ id: category._id, ...body }, {
            onSuccess: (r) => {
                toast.success(r?.message || 'Category updated');
                back();
            },
            onError: (err) => toast.error(err?.response?.data?.message || 'Something went wrong'),
        });
    };

    return (
        <div className="pb-6">
            <div className="pb-6">
                <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Edit Category</h1>

                <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                    <span onClick={() => setCurrentPage('dashboard')} className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">Dashboard</span>
                    <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                    <span className="text-slate-500">Dispute Management</span>
                    <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                    <span onClick={back} className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">Dispute Categories</span>
                    <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                    <span className="font-medium text-[#D97706]">{category.name}</span>
                </div>
            </div>

            {/* key: naya category khule to form ka state reset ho */}
            <CategoryForm
                key={category._id}
                initial={category}
                showActive
                submitLabel="Save Changes"
                submitting={update.isPending}
                onSubmit={handleSubmit}
                onCancel={back}
            />
        </div>
    );
}

export default EditDisputeCategory;