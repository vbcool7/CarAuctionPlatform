
import React from 'react';
import { Upload, User } from 'lucide-react';

function ProfileImageUpload() {
    return (
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">
                Profile Image
            </h3>

            <div className="border border-dashed md:border-2 border-gray-200 rounded-xl py-6 md:py-8 flex flex-col items-center text-center">
                <div className="bg-gray-50 p-3 rounded-full mb-3">
                    <User className="text-gray-400 w-6 h-6 md:w-8 md:h-8" />
                </div>

                <Upload size={20} className="text-[#D97706] mb-2" />

                <p className="text-xs md:text-sm font-bold text-gray-700">
                    Upload Profile Image
                </p>
                <p className="text-[11px] md:text-xs text-gray-400 mt-1 mb-4 px-4">
                    JPG, PNG or WEBP. Max size 2MB.
                </p>

                <button className="px-6 py-2 border border-[#D97706] text-[#D97706] rounded-lg text-sm font-medium hover:bg-amber-50 transition-all">
                    Choose File
                </button>
            </div>
        </div>
    )
}

export default ProfileImageUpload