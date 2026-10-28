
import React, { useState, useRef } from 'react';
import { ArrowLeft, CreditCard, MessageCircleQuestion, ShieldCheck, Car, Settings, ChevronRight, Lightbulb, Upload } from 'lucide-react';
import { toast } from 'react-toastify';

import FormInputFields from '../../SellerRegistration/FormInputFields';
import { useCreateSupportTicket } from '../../../hook/useSupport';

const CATEGORY_OPTIONS = [
    { value: 'auction', label: 'Auction' },
    { value: 'payout', label: 'Payout' },
    { value: 'vehicle', label: 'Vehicle' },
    { value: 'account', label: 'Account' },
    { value: 'technical', label: 'Technical' },
    { value: 'listing', label: 'Listing' },
    { value: 'order', label: 'Order' },
    { value: 'payment', label: 'Payment' },
    { value: 'document', label: 'Document' },
    { value: 'verification', label: 'Verification' },
    { value: 'notification', label: 'Notification' },
    { value: 'other', label: 'Other' },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf",];

const ALLOWED_EXTENSIONS = /\.(jpg|jpeg|png|webp|pdf)$/i;

function CreateTicket({ setCurrentPage }) {

    const fileInputRef = useRef(null);
    const [priority, setPriority] = useState('medium');
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('');
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

        if (!subject.trim() || !category || !description.trim()) {
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
                toast.success(response?.message || 'Support ticket submitted successfully!');

                setSubject('');
                setCategory('');
                setPriority('medium');
                setDescription('');
                setFile(null);

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
            onError: (error) => {
                toast.error(error?.response?.data?.message || 'Failed to submit support ticket. Please try again.');
            },
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'subject') setSubject(value);
        if (name === 'category') setCategory(value);
        if (name === 'priority') setPriority(value);
        if (name === 'description') setDescription(value);
    };

    return (
        <div className='pb-6 space-y-6'>

            {/* Header */}
            <div className="w-full flex items-center justify-between gap-4">

                <div className="flex flex-col">
                    <h1 className="text-xl md:text-2xl font-bold">
                        Create Support Ticket
                    </h1>

                    <p className="text-xs md:text-sm text-gray-600 p-px">
                        Fill in the details below and our support team will get back to you
                        soon as possible.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setCurrentPage("support")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors shrink-0">
                    <ArrowLeft size={16} />
                    Back
                </button>
            </div>

            {/* main section */}
            <div className='grid grid-cols-1 xl:grid-cols-3 gap-6 items-start'>

                {/* -------------- LEFT -------------- */}
                <div className='xl:col-span-2'>
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-8 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">

                        {/* Subject */}
                        <FormInputFields
                            label="Subject"
                            name="subject"
                            value={subject}
                            onChange={handleChange}
                            placeholder="Enter a brief subject (e.g., Payment issue, Auction question, etc.)"
                            required
                        />

                        {/* Category & Priority */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormInputFields
                                label="Category"
                                name="category"
                                type="select"
                                value={category}
                                onChange={handleChange}
                                placeholder="Select a category"
                                options={CATEGORY_OPTIONS}
                                required
                            />

                            <FormInputFields
                                label="Priority"
                                name="priority"
                                type="select"
                                value={priority}
                                onChange={handleChange}
                                placeholder="Select a priority"
                                options={[
                                    { value: "low", label: "Low" },
                                    { value: "medium", label: "Medium" },
                                    { value: "high", label: "High" },
                                ]}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <FormInputFields
                                label="Description"
                                name="description"
                                type="textarea"
                                value={description}
                                onChange={handleChange}
                                placeholder="Please describe your issue in detail."
                                maxLength={2000}
                                required
                            />
                            <div className="text-right text-xs text-slate-400 mt-1">
                                {description.length}/2000
                            </div>
                        </div>

                        {/* Attachments Section */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-800 mb-2">
                                Attachments{" "}
                                <span className="text-slate-400 font-normal">(Optional)</span>
                            </label>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp,.pdf"
                                className="hidden"
                                onChange={(e) => handleFileChange(e.target.files?.[0])}
                            />

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    handleFileChange(e.dataTransfer.files?.[0]);
                                }}
                                className="border-2 border-dashed border-slate-200 hover:border-amber-400 transition-colors rounded-xl p-8 text-center bg-slate-50/50 cursor-pointer flex flex-col items-center justify-center"
                            >
                                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-[#D97706] mb-3">
                                    <Upload size={20} />
                                </div>

                                <p className="text-sm font-medium text-slate-700">
                                    Drag and drop a file here, or{" "}
                                    <span className="text-amber-600 hover:underline">
                                        click to upload
                                    </span>
                                </p>
                            </div>

                            {file && (
                                <div className="flex items-center justify-between gap-3 mt-3 p-3 rounded-lg border border-slate-200 bg-white">
                                    <div className="min-w-0">
                                        <p className="text-sm text-slate-700 truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFile(null);
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
                                            }
                                        }}
                                        className="text-sm text-red-600 hover:text-red-700 shrink-0"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Form Action Buttons */}
                        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setCurrentPage('support')}
                                className="px-5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-2.5 text-white rounded-xl text-sm font-medium transition-colors shadow-sm ${isSubmitting
                                    ? 'bg-amber-400 cursor-not-allowed'
                                    : 'bg-[#D97706] hover:bg-amber-500 cursor-pointer'
                                    }`}                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                            </button>
                        </div>

                    </form>
                </div>

                {/* -------------- rIGHT -------------- */}
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6'>

                    {/* 2. Quick Help Box */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                        <h3 className="font-bold text-slate-900 text-base mb-4">Quick Help</h3>
                        <div className="space-y-1">

                            {/* Payment Issues */}
                            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">Payment Issues</div>
                                        <div className="text-xs text-slate-400 mt-0.5">Help with payouts, refunds, or failed transactions</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 ml-2" />
                            </div>

                            {/* Auction Questions */}
                            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <MessageCircleQuestion className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">Auction Questions</div>
                                        <div className="text-xs text-slate-400 mt-0.5">Information about bidding, listings, or results</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 ml-2" />
                            </div>

                            {/* Account & Verification */}
                            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">Account & Verification</div>
                                        <div className="text-xs text-slate-400 mt-0.5">KYC, document uploads, or account status</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 ml-2" />
                            </div>

                            {/* Vehicle Listing */}
                            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <Car className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">Vehicle Listing</div>
                                        <div className="text-xs text-slate-400 mt-0.5">Guidance on listing, edits, or removal</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 ml-2" />
                            </div>

                            {/* Technical Issues */}
                            <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <Settings className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900 text-sm">Technical Issues</div>
                                        <div className="text-xs text-slate-400 mt-0.5">Website, app, or login problems</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 ml-2" />
                            </div>

                        </div>
                    </div>

                    {/* 3. Before creating a ticket Box */}
                    <div className="bg-[#FFFBEB]/80 border border-amber-200/80 rounded-2xl p-5 shadow-xs flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-600">
                            <Lightbulb className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-sm mb-2">Before creating a ticket, please check:</h4>
                            <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside mb-3">
                                <li>Your messages and notifications</li>
                                <li>Our FAQs section</li>
                                <li>The relevant help articles</li>
                            </ul>
                            <p className="text-xs text-slate-500 mb-3">
                                This may help you get a faster resolution.
                            </p>
                            <a href="#faqs" className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer group">
                                <span>View FAQs</span>
                                <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default CreateTicket;