
import { useState } from "react";
import { X } from "lucide-react";

function AddNoteModal({ onClose, onSubmit }) {

  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);

  const handleSubmit = () => {
    if (!message.trim()) return;
    onSubmit({
      id: Date.now(),
      author: "Admin User",
      role: "Admin",
      message: message.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      attachment,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-70 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl w-full max-w-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-[#0B1E3D]">Add Note</h4>
          <button
            onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[11px] font-medium text-gray-500 mb-1">
          Your Note *
          </p>
        <textarea
          value={message}
          rows={4}
          onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
          placeholder="Write your note here..."
          className="w-full border border-gray-500 rounded-xl p-3 text-[12px] resize-none outline-none"
        />
        <p className="text-[10px] text-gray-400 text-right">{message.length}/1000</p>
       
        {/* upload file */}
        <div className="mt-3 border-2 border-dashed rounded-xl p-4 text-center text-[11px] text-gray-500">
          <input 
          type="file" 
          id="noteAttach"
          accept=".pdf,.jpg,.png" 
          onChange={(e) => setAttachment(e.target.files[0])} 
          className="hidden" 
           />
          <label htmlFor="noteAttach" className="cursor-pointer">
            Click to upload or drag and drop <br />
            <span className="text-gray-400">PDF, JPG, PNG (Max. 5MB)</span>
          </label>
          {attachment && <p className="text-[11px] text-green-600 mt-1">{attachment.name}</p>}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-[#D97706] text-white py-2.5 rounded-xl font-medium text-[13px]"
        >
          Add Note
        </button>
      </div>
    </div>
  );
}

export default AddNoteModal;