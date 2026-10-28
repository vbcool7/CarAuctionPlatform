
import React, { useState, useRef } from 'react';
import { Send, UploadCloud, CheckCircle2, FileText, X } from 'lucide-react';
import BuyerCustomDropdown from '../BuyerSharedComponents/BuyerCustomDropdown';
import { toast } from 'react-toastify';

import { useCreateSupportTicket } from '../../../hook/useSupport';

const CATEGORY_OPTIONS = [
    "Auction",
    "Payment",
    "Vehicle",
    "Account",
    "Technical",
    "Bidding",
    "Order",
    "Refund",
    "Document",
    "Verification",
    "Notification",
    "other",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf",];

const ALLOWED_EXTENSIONS = /\.(jpg|jpeg|png|webp|pdf)$/i;

function BuyerSupportSubmitTicket({ setSupportPage }) {

    const fileInputRef = useRef(null);
    const [priority, setPriority] = useState('Medium');
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('Select Category');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);

    const { mutate: createTicket, isPending: isSubmitting } = useCreateSupportTicket();

    const handleFileChange = (selectedFile) => {
        if (!selectedFile) return;

        if (
            !ALLOWED_FILE_TYPES.includes(selectedFile.type) ||
            !ALLOWED_EXTENSIONS.test(selectedFile.name)
        ) {
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            toast.error("Please upload a JPG, PNG, WEBP, or PDF file.");
            return;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            toast.error("File size must not exceed 10 MB.");
            return;
        }

        setFile(selectedFile);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!subject.trim() || category === 'Select Category' || !description.trim()) {
            toast.error('Please fill all required fields.');
            return;
        }

        if (description.trim().length > 2000) {
            toast.error('Description cannot exceed 2000 characters.');
            return;
        }

        const formData = new FormData();

        formData.append('subject', subject.trim());
        formData.append('category', category.toLowerCase());
        formData.append('priority', priority.toLowerCase());
        formData.append('description', description.trim());

        if (file) {
            formData.append('attachment', file);
        }

        createTicket(formData, {
            onSuccess: (response) => {
                toast.success(
                    response?.message || 'Support ticket submitted successfully!'
                );

                setSubject('');
                setCategory('Select Category');
                setPriority('Medium');
                setDescription('');
                setFile(null);

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
            onError: (error) => {
                toast.error(
                    error?.response?.data?.message ||
                    'Failed to submit support ticket. Please try again.'
                );
            },
        });
    };

    return (
        <div className="w-full mb-6">
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Subject & Category */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-[#0B1E3D] mb-1">
                            Subject <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            maxLength={150}
                            placeholder="Enter ticket subject"
                            required
                            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-[#D97706]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#0B1E3D] mb-1">
                            Category <span className="text-red-600">*</span>
                        </label>
                        <BuyerCustomDropdown
                            options={CATEGORY_OPTIONS}
                            selected={category}
                            onChange={setCategory}
                        />
                    </div>
                </div>

                {/* Priority */}
                <div>
                    <label className="block text-sm font-bold text-[#0B1E3D] mb-2">
                        Priority <span className="text-red-600">*</span>
                    </label>

                    <div className="flex gap-4 flex-wrap">
                        {['Low', 'Medium', 'High'].map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPriority(p)}
                                className={`px-6 py-2 border rounded-lg font-medium flex items-center gap-2
                                    ${priority === p
                                        ? 'border-[#D97706] bg-blue-50 text-blue-700'
                                        : 'border-slate-200'
                                    }`}
                            >
                                <span
                                    className={`w-2 h-2 rounded-full ${p === 'Low'
                                        ? 'bg-green-500'
                                        : p === 'Medium'
                                            ? 'bg-orange-500'
                                            : 'bg-red-500'
                                        }`}
                                />
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-bold text-[#0B1E3D] mb-1">
                        Description <span className="text-red-600">*</span>
                    </label>

                    <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={2000}
                        required
                        className="w-full p-3 border border-slate-200 rounded-lg h-40 outline-none focus:border-[#D97706] resize-none"
                        placeholder="Type your message here..."
                    />

                    <p className="text-right text-xs text-gray-400 mt-1">
                        {description.length} / 2000
                    </p>
                </div>

                {/* Attachments */}
                <div>
                    <label className="block text-sm font-bold text-[#0B1E3D] mb-1">
                        Attachment (Optional)
                    </label>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.pdf"
                        className="hidden"
                        onChange={(e) => handleFileChange(e.target.files?.[0])}
                    />

                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            handleFileChange(e.dataTransfer.files?.[0]);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center text-gray-500 cursor-pointer hover:border-[#D97706] transition-colors"
                    >
                        <UploadCloud
                            size={32}
                            className="text-[#D97706] mb-2"
                        />

                        <p className="text-sm">
                            Drag and drop a file here or{' '}
                            <span className="text-[#D97706] font-bold">
                                browse
                            </span>
                        </p>

                        <p className="text-xs mt-1">
                            JPG, PNG, PDF, DOC, DOCX (Max 10 MB)
                        </p>
                    </div>

                    {file && (
                        <div className="flex items-center justify-between gap-3 mt-3 p-3 border border-slate-200 rounded-lg">
                            <div className="flex items-center gap-2 min-w-0">
                                <FileText size={20} className="text-[#D97706] shrink-0" />
                                <span className="text-sm text-gray-700 truncate">
                                    {file.name}
                                </span>
                                <span className="text-xs text-gray-400 shrink-0">
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setFile(null);
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                    }
                                }}
                                className="text-gray-500 hover:text-red-600"
                                aria-label="Remove attachment"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Note */}
                <div>
                    <div className="border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-8">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                            <div className="w-5 h-5 border-2 border-blue-600 rotate-45" />
                        </div>

                        <h3 className="font-bold text-[#0B1E3D] mb-4">
                            Ticket Summary
                        </h3>

                        <p className="text-sm text-gray-600 mb-6">
                            Once submitted, you'll receive a confirmation email with your ticket details.
                        </p>

                        <div className="space-y-4 text-sm text-gray-700">
                            <div className="flex gap-2">
                                <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                                We typically respond within 24 hours
                            </div>

                            <div className="flex gap-2">
                                <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                                You can track your ticket status in <b>My Support Tickets</b>
                            </div>

                            <div className="flex gap-2">
                                <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                                Our team is available Mon - Fri, 9:00 AM - 6:00 PM GST
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => setSupportPage?.('home')}
                        className="px-8 py-3 border border-slate-200 rounded-lg font-bold hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-8 py-3 bg-[#D97706] text-white rounded-lg font-bold hover:bg-amber-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                        <Send size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default BuyerSupportSubmitTicket;