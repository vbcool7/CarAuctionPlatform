
import React from 'react'
import ContactSupport from '../../SharedComponents/ContactSupport';
import SummaryDonutCard from '../../SharedComponents/SummaryDonutCard';

function DocumentSidebar({ auction }) {

    return (
        <div className="space-y-6">

            {/* donut */}
            <SummaryDonutCard
                title="Donut Summary"
                centerValue="8"
                centerLabel="Total"
                showPercentage={true}
                segments={[
                    { name: 'Verified', value: 8, color: '#10B981' },
                    { name: 'Pending Review', value: 0, color: '#F59E0B' },
                    { name: 'Rejected', value: 8, color: '#EF4444 ' },
                    { name: 'Expired', value: 6, color: '#6B7280' },
                ]}
            />

            {/* upload */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Upload New Document</h3>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center text-sm text-slate-400">
                    Click to upload or drag and drop
                </div>
                <ul className="mt-4 space-y-1 text-xs text-slate-500 list-disc list-inside">
                    <li>Upload clear and valid documents</li>
                    <li>PDF, JPG, or PNG format</li>
                    <li>Max file size 10MB</li>
                </ul>
            </div>

            {/* support */}
            <ContactSupport />
        </div>
    );
}

export default DocumentSidebar;