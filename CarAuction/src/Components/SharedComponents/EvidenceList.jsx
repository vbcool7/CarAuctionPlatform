
import React from 'react';
import { FileText } from 'lucide-react';

function EvidenceList({ files }) {
    if (!files?.length) return <p className="text-xs text-gray-400">No files attached.</p>;
    
    return (
        <div className="flex flex-wrap gap-2">
            {files.map((f, i) => (
                <a
                    key={`${f.url}-${i}`}
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    title={f.name || 'Attachment'}
                    className="block w-20 h-20 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden hover:border-[#D97706]"
                >
                    {f.kind === 'pdf' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-500 p-1">
                            <FileText size={22} />
                            <span className="text-[9px] leading-tight text-center break-all line-clamp-2">{f.name || 'PDF'}</span>
                        </div>
                    ) : (
                        <img src={f.url} alt={f.name || ''} className="w-full h-full object-cover" />
                    )}
                </a>
            ))}
        </div>
    );
}

export default EvidenceList;