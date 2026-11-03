
import React from 'react';
import { Paperclip, X } from 'lucide-react';
import { EVIDENCE_ACCEPT, MAX_EVIDENCE, MAX_EVIDENCE_MB } from '../../utils/disputeIcons';

function EvidencePicker({ files, onChange, disabled }) {
    const add = (e) => {
        const picked = Array.from(e.target.files || []);
        e.target.value = '';
        if (picked.length) onChange([...files, ...picked]);
    };

    return (
        <div>
            <label className={`inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 ${disabled ? 'opacity-50' : 'cursor-pointer hover:border-[#D97706] hover:text-[#D97706]'}`}>
                <Paperclip size={14} />
                Attach files (optional)
                <input type="file" multiple accept={EVIDENCE_ACCEPT} onChange={add} disabled={disabled} className="hidden" />
            </label>
            <p className="mt-1 text-[11px] text-gray-400">Up to {MAX_EVIDENCE} files. JPG, PNG, WEBP or PDF, {MAX_EVIDENCE_MB} MB each.</p>

            {files.length > 0 && (
                <ul className="mt-2 space-y-1">
                    {files.map((f, i) => (
                        <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-700">
                            <span className="truncate">{f.name}</span>
                            <button type="button" disabled={disabled} onClick={() => onChange(files.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500">
                                <X size={14} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default EvidencePicker;