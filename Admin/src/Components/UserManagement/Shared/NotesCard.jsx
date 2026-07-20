
function NotesCard({ notes = [], onAddNote }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-[14px] md:text-base font-bold text-slate-900 mb-4">
        Notes
      </h3>
      <div className="flex items-center justify-between">
        <p className="text-[13px] md:text-sm text-slate-400">
          {notes.length === 0 ? 'No notes added' : `${notes.length} note(s)`}
        </p>
        
        <button 
        onClick={onAddNote} className="flex items-center gap-1 text-[13px] md:text-sm font-medium text-[#D97706] border border-[#D97706] px-3 py-1.5 rounded-lg">
          + Add Note
        </button>
      </div>
    </div>
  );
}

export default NotesCard;