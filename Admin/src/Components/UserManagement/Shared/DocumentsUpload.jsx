import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';

const DocumentRow = ({ title, required, file, onFileChange }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${file ? "bg-green-50 text-green-600" : "bg-amber-50 text-[#D97706]"}`}>
          {file ? <CheckCircle2 size={20} /> : <FileText size={20} />}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">
            {title} {required && <span className="text-red-500">*</span>}
          </p>
          {/* Display file name or helper text */}
          <p className={`text-[11px] truncate max-w-50 ${file ? "text-green-600 font-medium" : "text-slate-400"}`}>
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
        className="p-2 hover:bg-slate-50 rounded-full transition-colors text-[#D97706] cursor-pointer"
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
    <div className="w-full max-w-xl bg-white rounded-xl border border-slate-200 shadow-sm">
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