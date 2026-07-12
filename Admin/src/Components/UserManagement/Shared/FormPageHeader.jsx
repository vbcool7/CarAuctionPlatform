
import React from 'react';
import Breadcrumbs from '../../SharedComponents/Breadcrumbs';

function FormPageHeader({ title, breadcrumbItems, onBack, backLabel = 'Back' }) {
    return (
        <div className="flex items-center justify-between pb-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                <Breadcrumbs items={breadcrumbItems} />
            </div>

            <button
                onClick={onBack}
                className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-gray-50 text-slate-600 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
                ← {backLabel}
            </button>
        </div>
    );
}

export default FormPageHeader;