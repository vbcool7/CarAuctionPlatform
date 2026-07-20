
import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';

const DocumentRow = ({ title, required, file, onFileChange }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 gap-3">

      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        <div className={`p-2 rounded-lg shrink-0 ${file ? "bg-green-50 text-green-600" : "bg-amber-50 text-[#D97706]"}`}>
          {file ? <CheckCircle2 size={18} /> : <FileText size={18} />}
        </div>

        <div className="min-w-0">
          <p className="text-[13px] md:text-sm font-semibold text-slate-800 truncate">
            {title} {required && <span className="text-red-500">*</span>}
          </p>

          <p className={`text-[11px] truncate ${file ? "text-green-600 font-medium" : "text-slate-400"}`}>
            {file ? file.name : "PDF, JPG or PNG. Max size 5MB."}
          </p>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => onFileChange(e.target.files[0])}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-2 hover:bg-slate-50 rounded-full transition-colors text-[#D97706] cursor-pointer shrink-0"
      >
        <Upload size={20} />
      </button>
    </div>
  );
};

function DocumentsUpload() {
  const [files, setFiles] = useState({
    tradeLicense: null,
    idProof: null,
    vatCertificate: null,
    otherDocument: null,
  });

  const handleFileChange = (key, file) => {
    if (file && file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit");
      return;
    }
    setFiles(prev => ({ ...prev, [key]: file }));
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="p-5 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-800">Documents</h2>
        <p className="text-xs text-slate-500">Upload seller verification documents</p>
      </div>

      <DocumentRow title="Trade License" required file={files.tradeLicense} onFileChange={(f) => handleFileChange('tradeLicense', f)} />
      <DocumentRow title="ID Proof (Passport / Emirates ID)" required file={files.idProof} onFileChange={(f) => handleFileChange('idProof', f)} />
      <DocumentRow title="VAT Certificate (Optional)" file={files.vatCertificate} onFileChange={(f) => handleFileChange('vatCertificate', f)} />
      <DocumentRow title="Other Document (Optional)" file={files.otherDocument} onFileChange={(f) => handleFileChange('otherDocument', f)} />
    </div>
  );
}

export default DocumentsUpload;