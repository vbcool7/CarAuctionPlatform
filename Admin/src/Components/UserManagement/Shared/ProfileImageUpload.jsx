
import React, { useRef } from 'react';
import { Upload, User } from 'lucide-react';

function ProfileImageUpload({ image, onChange }) {
    const fileInputRef = useRef(null);

    const previewUrl = image ? URL.createObjectURL(image) : null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onChange(file);
        }
    };

    return (
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">
                Profile Image
            </h3>

            <div className="border border-dashed md:border-2 border-gray-200 rounded-xl py-6 md:py-8 flex flex-col items-center text-center">
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-20 h-20 rounded-full object-cover mb-3"
                    />
                ) : (
                    <div className="bg-gray-50 p-3 rounded-full mb-3">
                        <User className="text-gray-400 w-6 h-6 md:w-8 md:h-8" />
                    </div>
                )}

                <Upload size={20} className="text-[#D97706] mb-2" />

                <p className="text-xs md:text-sm font-bold text-gray-700">
                    Upload Profile Image
                </p>
                <p className="text-[11px] md:text-xs text-gray-400 mt-1 mb-4 px-4">
                    JPG, PNG or WEBP. Max size 2MB.
                </p>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                />

                <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="px-6 py-2 rounded-lg text-sm font-semibold border border-[#D97706] bg-[#D97706] text-white shadow-sm transition-all duration-200 hover:bg-[#B45309] hover:border-[#B45309] hover:shadow-md active:scale-95 cursor-pointer"
                >
                    Choose File
                </button>
            </div>
        </div>
    )
}

export default ProfileImageUpload;