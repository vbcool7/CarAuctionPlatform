
import React from 'react';
import { Lightbulb, CheckCircle2, Circle, Clock, Headset } from 'lucide-react';
import { FileText, FileCheck, ScanFace } from 'lucide-react';

const tips = [
  "Ensure all document details are clearly visible",
  "Upload color images, not black & white",
  "File size must be less than 5MB",
  "Accepted formats: JPG, PNG, PDF",
  "Selfie should be clear and without filters"
];

const statusItems = [
  {
    title: "Identity Uploaded",
    status: "Not completed",
    color: "text-indigo-500",
    bg: "bg-indigo-100",
    icon: FileText
  },
  {
    title: "Address Uploaded",
    status: "Not completed",
    color: "text-emerald-500",
    bg: "bg-emerald-100",
    icon: FileCheck
  },
  {
    title: "Face Verification",
    status: "Not completed",
    color: "text-orange-500",
    bg: "bg-orange-100",
    icon: ScanFace
  },
];

function Step4_SidePanel() {

  return (
    <section className='w-full py-10'>
      <div className="w-full space-y-6">

        {/* 1st section */}
        <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="text-[#D97706]" size={24} />
            <h2 className="text-lg font-bold text-[#0B1E3D]">Verification Tips</h2>
          </div>
          <ul className="space-y-4">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-slate-600">
                <CheckCircle2 className="text-[#D97706] shrink-0" size={18} />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* 2nd section */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100">
          <h2 className="text-lg font-bold text-[#0B1E3D] mb-6">Verification Status</h2>
          <div className="space-y-6">
            {statusItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={`${item.color} shrink-0`}>
                  <item.icon size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-bold text-[#0B1E3D] text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-400">{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Need Help Section */}
        <div className="p-6 rounded-2xl border border-slate-100 bg-white">
          <h4 className="font-bold text-[#0B1E3D] mb-2">Need Help?</h4>
          <p className="text-sm text-slate-500 mb-4">Our support team is here to help you with any issues during verification.</p>
          <button className="flex items-center gap-2 border border-[#D97706] text-[#D97706] font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 transition">
            <Headset size={18} /> Contact Support
          </button>
        </div>

      </div>
    </section>
  );
}

export default Step4_SidePanel;