
import React from 'react';
import { Info } from 'lucide-react';

function NotesSection({ message, children }) {
    return (
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <div className="flex gap-3">
                <Info className="w-4 h-4 md:w-5 md:h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-4 w-full">
                    <p className="text-[11px] md:text-[13px] text-blue-900 font-medium leading-relaxed">
                        {message}
                    </p>

                    {children && (
                        <div className="flex gap-3">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NotesSection;