
import React, { useState } from "react";
import AddNoteModal from "./AddNoteModal";

function VehicleNotesTab({ notes }) {

  const [showAddNote, setShowAddNote] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[13px] font-semibold text-[#0B1E3D]">
          Notes & Comments
        </h3>
        <button
          onClick={() => setShowAddNote(true)}
          className="text-[11px] font-medium bg-[#D97706] text-white px-3 py-1.5 rounded-lg"
        >
          + Add Note
        </button>
      </div>

      <div className="space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <img
                src={note.avatarUrl}
                className="w-6 h-6 rounded-full" />
              <span className="text-[12px] font-semibold">{note.author}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full 
                ${note.role === "Admin" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"}`}>
                {note.role}
              </span>
              <span className="text-[10px] text-gray-400 ml-auto">
                {note.date}, {note.time}
              </span>
            </div>
            <p className="text-[11px] text-gray-600 mt-1">
              {note.message}
            </p>
          </div>
        ))}
      </div>

      {showAddNote && (
        <AddNoteModal
          onClose={() => setShowAddNote(false)}
        // onSubmit={onAddNote}
        />
      )}
    </div>
  );
}

export default VehicleNotesTab;