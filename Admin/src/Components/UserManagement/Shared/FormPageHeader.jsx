
import React from 'react';
import Breadcrumbs from '../../SharedComponents/Breadcrumbs';

function FormPageHeader({ title, breadcrumbItems, onBack, backLabel = 'Back', backLabelOnMob }) {
    return (
        // Changed to flex-col on mobile, flex-row on md+
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                <Breadcrumbs items={breadcrumbItems} />
            </div>

            <button
                onClick={onBack}
                className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-gray-50 text-slate-600 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
                <span>←</span>
                <span className="md:hidden">{backLabelOnMob}</span>
                <span className="hidden md:inline">{backLabel}</span>
            </button>
        </div>
    );
}

export default FormPageHeader;