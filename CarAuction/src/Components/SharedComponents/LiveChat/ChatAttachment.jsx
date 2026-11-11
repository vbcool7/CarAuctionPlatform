
import React from 'react';
import { Download, ExternalLink, FileText } from 'lucide-react';

export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
export const MAX_FILE = 10 * 1024 * 1024;

export const formatSize = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

// download through blob
async function downloadFile(att) {
    try {
        const res = await fetch(att.url);
        if (!res.ok) throw new Error('bad status');

        const href = URL.createObjectURL(await res.blob());
        const a = document.createElement('a');
        a.href = href;
        a.download = att.name || 'file';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(href), 1000);
    } catch (error) {
        window.open(att.url, '_blank', 'noopener');
    }
}

export function Attachment({ att }) {
    if (att.kind === 'image') {
        return (
            <a href={att.url} target="_blank" rel="noopener noreferrer">
                <img src={att.url} alt={att.name || 'image'} loading="lazy"
                    className="max-w-60 max-h-60 rounded-xl object-cover border border-slate-200" />
            </a>
        );
    }
    return (
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-3 py-2.5 w-64 max-w-full">
            <FileText size={22} className="text-red-500 shrink-0" />
            <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-700 truncate">{att.name || 'document.pdf'}</p>
                <p className="text-[10px] text-slate-400">{att.size ? formatSize(att.size) : 'PDF'}</p>
            </div>
            <a href={att.url} target="_blank" rel="noopener noreferrer" title="Open"
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><ExternalLink size={15} /></a>
            <button onClick={() => downloadFile(att)} title="Download"
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><Download size={15} /></button>
        </div>
    );
}