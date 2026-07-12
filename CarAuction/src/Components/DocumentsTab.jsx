
import { FileText, Download } from "lucide-react";

function DocumentsTab({ vehicle }) {
  const { documents = [] } = vehicle;

  if (documents.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500 text-sm">
          No documents available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {documents.map((doc, index) => (
        <div
          key={index}
          className="border border-slate-200 rounded-2xl p-4 bg-white hover:border-[#D97706]/30 transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#D97706]/10 flex items-center justify-center">
                <FileText size={20} className="text-[#D97706]" />
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-sm">
                  {doc.name}
                </h4>

                <p className="text-slate-500 text-xs mt-1">
                  {doc.type} • {doc.size}
                </p>
              </div>
            </div>

            <button className="flex items-center gap-1 text-[#D97706] text-sm font-medium hover:text-[#b86405] transition-colors">
              <Download size={16} />
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DocumentsTab;