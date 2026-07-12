
import React from 'react';
import { Upload, User } from 'lucide-react';

function ProfileImageUpload() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Profile Image</h3>
                <div className="border-2 border-dashed border-gray-200 rounded-xl py-5 flex flex-col items-center text-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-3">
                        <User size={32} className="text-gray-400" />
                    </div>
                    <Upload size={20} className="text-[#D97706] mb-2" />
                    <p className="text-sm font-bold text-gray-700">Upload Profile Image</p>
                    <p className="text-xs text-gray-400 mt-1 mb-4">JPG, PNG or WEBP. Max size 2MB.</p>
                    <button className="px-6 py-1.5 border border-[#D97706] text-[#D97706] rounded-lg font-medium hover:bg-blue-50 transition-all">
                        Choose File
                    </button>
                </div>
            </div>
  )
}

export default ProfileImageUpload