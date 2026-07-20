
import React from 'react'

function NotesField() {
    return (
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-1">
                Notes (Optional)
            </h3>
            <p className="text-xs text-gray-400 mb-3">
                Add any notes about this user
            </p>
            <textarea
                rows={4}
                maxLength={500}
                placeholder="Enter notes here..."
                className="w-full p-3 border border-gray-200 rounded-xl text-sm 
                           focus:ring-2 focus:ring-amber-100 focus:border-[#D97706] 
                           outline-none resize-none transition-all"
            />
            <p className="text-xs text-gray-400 text-right mt-2">0 / 500</p>
        </div>
    )
}

export default NotesField