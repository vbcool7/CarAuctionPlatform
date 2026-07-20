
import React from 'react';
import { Headphones } from 'lucide-react';

function ContactSupport() {
    return (
        <div className="bg-gray-50 border border-[#E3EBFF] rounded-xl p-5">
            <h3 className="text-[15px] font-semibold text-[#D97706]">
                Need Help?
            </h3>

            <p className="mt-2 text-[12px] leading-5 text-slate-600">
                If you have any issues with uploading documents,
                <br />
                please contact our support team.
            </p>

            <div className="border-t border-[#DCE6FF] my-4"></div>

            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#C9D7FF] bg-white rounded-lg text-[13px] font-medium text-slate-700 hover:bg-blue-50 transition">
                <Headphones size={15} className="text-[#D97706]" />
                Contact Support
            </button>
        </div>
    )
}

export default ContactSupport