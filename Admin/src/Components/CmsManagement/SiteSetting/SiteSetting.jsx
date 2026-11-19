
import React, { useEffect, useMemo, useState } from 'react';
import { Save } from 'lucide-react';

import { useGetAdminSettings, useUpdateSettings } from '../../../hooks/useSiteSetting';

const SOCIALS = [
    { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/yourpage' },
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourhandle' },
    { key: 'twitter', label: 'Twitter / X', placeholder: 'https://x.com/yourhandle' },
    { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@yourchannel' },
];

const toForm = (s) => ({
    tagline: s?.tagline || '',
    phone: s?.phone || '',
    email: s?.email || '',
    address: s?.address || '',
    supportHours: s?.supportHours || '',
    social: {
        facebook: s?.social?.facebook || '',
        instagram: s?.social?.instagram || '',
        twitter: s?.social?.twitter || '',
        youtube: s?.social?.youtube || '',
    },
});

const inputCls = (hasError) =>
    `w-full rounded-lg border px-4 text-sm outline-none transition-colors focus:border-[#D97706] ${hasError ? 'border-red-400' : 'border-slate-300'}`;

function Field({ label, hint, error, children }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-2 md:gap-4">
            <div>
                <h4 className="text-sm font-medium text-[#0B1E3D]">{label}</h4>
                {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
            </div>
            <div>
                {children}
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        </div>
    );
}

function SiteSetting({ setCurrentPage }) {

    const { data, isLoading, isError } = useGetAdminSettings();
    const { mutate, isPending } = useUpdateSettings();

    const [form, setForm] = useState(toForm(null));
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (data) {
            setForm(toForm(data));
            setErrors({});
        }
    }, [data?.updatedAt]);

    const saved = useMemo(() => JSON.stringify(toForm(data)), [data]);
    const isDirty = data ? JSON.stringify(form) !== saved : false;

    const setField = (key, value) => {
        setForm((p) => ({ ...p, [key]: value }));
        setErrors((p) => ({ ...p, [key]: undefined }));
    };

    const setSocial = (key, value) => {
        setForm((p) => ({ ...p, social: { ...p.social, [key]: value } }));
        setErrors((p) => ({ ...p, [`social.${key}`]: undefined }));
    };

    const validate = () => {
        const e = {};
        if (!form.phone.trim()) e.phone = 'Phone is required';
        if (!form.email.trim()) e.email = 'Email is required';
        if (!form.address.trim()) e.address = 'Address is required';
        return e;
    };

    // handle save
    const handleSave = () => {
        const clientErrors = validate();
        if (Object.keys(clientErrors).length) {
            setErrors(clientErrors);
            return;
        }
        mutate(form, {
            onError: (err) => setErrors(err.response?.data?.errors || {}),
        });
    };

    if (isLoading) return <p className="p-10 text-center">Loading settings....</p>;
    if (isError) return <p className="p-10 text-center text-red-500">Failed to load settings</p>;

    return (
        <div className="pb-6">

            {/* Header */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between pb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3D]">Site Settings</h1>

                    <div className="mt-2 flex items-center text-[11px] md:text-[13px]">
                        <span
                            onClick={() => setCurrentPage('dashboard')}
                            className="cursor-pointer text-slate-500 hover:text-[#D97706] transition-colors">
                            Dashboard
                        </span>
                        <span className="mx-2 text-slate-300">/</span>
                        <span className="text-slate-500">CMS Management</span>
                        <span className="mx-2 text-slate-300">/</span>
                        <span className="font-medium text-[#D97706]">Site Settings</span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSave}
                    disabled={!isDirty || isPending}
                    className="flex py-2.5 items-center justify-center gap-2 rounded-lg bg-[#D97706] px-4 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-amber-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed">
                    <Save size={16} />
                    <span>{isPending ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">

                {/* ----------------------- Contact ----------------------- */}
                <div className="bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                    <div className="mb-5 border-b border-slate-100 pb-4">
                        <h2 className="text-base font-semibold text-[#0B1E3D]">Contact Details</h2>
                        <p className="mt-1 text-sm text-slate-500">Shown in the website footer.</p>
                    </div>

                    <div className="space-y-6">
                        <Field label="Tagline" hint="Short line under the brand name." error={errors.tagline}>
                            <textarea
                                rows={2}
                                maxLength={200}
                                value={form.tagline}
                                onChange={(e) => setField('tagline', e.target.value)}
                                className={`${inputCls(errors.tagline)} resize-none py-3`}
                            />
                            <p className="mt-1 text-right text-[11px] text-slate-400">{form.tagline.length}/200</p>
                        </Field>

                        <Field label="Phone" hint="Used for support and WhatsApp." error={errors.phone}>
                            <input
                                type="text"
                                value={form.phone}
                                onChange={(e) => setField('phone', e.target.value)}
                                placeholder="+971 4 123 4567"
                                className={`${inputCls(errors.phone)} h-11`}
                            />
                        </Field>

                        <Field label="Email" error={errors.email}>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setField('email', e.target.value)}
                                placeholder="support@biddrive.ae"
                                className={`${inputCls(errors.email)} h-11`}
                            />
                        </Field>

                        <Field label="Address" error={errors.address}>
                            <textarea
                                rows={2}
                                maxLength={300}
                                value={form.address}
                                onChange={(e) => setField('address', e.target.value)}
                                className={`${inputCls(errors.address)} resize-none py-3`}
                            />
                        </Field>

                        <Field label="Support Hours" hint="Dubai time." error={errors.supportHours}>
                            <input
                                type="text"
                                maxLength={100}
                                value={form.supportHours}
                                onChange={(e) => setField('supportHours', e.target.value)}
                                placeholder="Mon - Fri, 9:00 AM - 6:00 PM (Dubai time)"
                                className={`${inputCls(errors.supportHours)} h-11`}
                            />
                        </Field>
                    </div>
                </div>

                {/* ----------------------- Social ----------------------- */}
                <div className="bg-white rounded-xl border border-slate-100 p-4 md:p-5 shadow-sm">
                    <div className="mb-5 border-b border-slate-100 pb-4">
                        <h2 className="text-base font-semibold text-[#0B1E3D]">Social Links</h2>
                        <p className="mt-1 text-sm text-slate-500">Leave a link empty to hide that icon in the footer.</p>
                    </div>

                    <div className="space-y-6">
                        {SOCIALS.map((s) => (
                            <Field key={s.key} label={s.label} error={errors[`social.${s.key}`]}>
                                <input
                                    type="url"
                                    value={form.social[s.key]}
                                    onChange={(e) => setSocial(s.key, e.target.value)}
                                    placeholder={s.placeholder}
                                    className={`${inputCls(errors[`social.${s.key}`])} h-11`}
                                />
                            </Field>
                        ))}
                    </div>
                </div>

                <p className="text-[11px] text-slate-400">
                    Website visitors may see the old details for up to 1 minute after saving.
                </p>
            </div>
        </div>
    );
}

export default SiteSetting;