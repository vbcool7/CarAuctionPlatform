
import React from 'react';
import toast from 'react-hot-toast';
import { ChevronRight } from 'lucide-react';

import CategoryForm from './CategoryForm';
import { useCreateDisputeCategory } from '../../../hooks/useDispute';

function AddNewCategory({ setCurrentPage }) {

    const create = useCreateDisputeCategory();

    const handleSubmit = (body) => {
        create.mutate(body, {
            onSuccess: (r) => {
                toast.success(r?.message || 'Category created');
                setCurrentPage('dispute-categories');
            },
            onError: (err) => toast.error(err?.response?.data?.message || 'Something went wrong'),
        });
    };

    return (
        <div className="pb-6">

            {/* header */}
            <div className="pb-6">
                <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Add New Category</h1>

                <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                    <span onClick={() => setCurrentPage('dashboard')} className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">Dashboard</span>
                    <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                    <span className="text-slate-500">Dispute Management</span>
                    <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                    <span onClick={() => setCurrentPage('dispute-categories')} className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">Dispute Categories</span>
                    <span className="mx-1 text-slate-300"><ChevronRight size={16} /></span>
                    <span className="font-medium text-[#D97706]">Add New</span>
                </div>
            </div>

            <CategoryForm
                submitLabel="Create Category"
                submitting={create.isPending}
                onSubmit={handleSubmit}
                onCancel={() => setCurrentPage('dispute-categories')}
            />
        </div>
    );
}

export default AddNewCategory;