
import React, { useState } from 'react';
import { MapPin, Pencil, Trash2, Plus, Home, Briefcase, Package, Mail, Plane, Lightbulb, HeadphonesIcon, Lock} from "lucide-react";
import { addressBook } from '../../Data';

const typeConfig = {
    Home: { icon: Home, bg: "bg-amber-50", color: "text-amber-600" },
    Work: { icon: Briefcase, bg: "bg-blue-50", color: "text-blue-600" },
    Shipping: { icon: Package, bg: "bg-green-50", color: "text-green-600" },
    Billing: { icon: Mail, bg: "bg-purple-50", color: "text-purple-600" },
    Other: { icon: Plane, bg: "bg-rose-50", color: "text-rose-600" },
};

function BuyerProfileAddress() {

    const [addresses, setAddresses] = useState(addressBook);

    const defaultAddress = addresses.find((a) => a.isDefault);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-[#0B1E3D]">Address Book</h2>
                    <p className="w-110 text-sm text-gray-500 mt-0.5">
                        Add and manage your saved addresses for shipping documents and communication.
                    </p>
                </div>

                <button
                    className="flex items-center gap-2 bg-[#D97706] text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-amber-600 hover:shadow-md active:scale-[0.97] active:bg-amber-700">
                    <Plus size={16} />
                    Add New Address
                </button>
            </div>

            {/* Address List */}
            <div className="space-y-3">
                {addresses.map((addr) => {
                    const config = typeConfig[addr.type] || typeConfig.Other;
                    const Icon = config.icon;

                    return (
                        <div
                            key={addr.id}
                            className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-4"
                        >
                            {/* Icon */}
                            <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}>
                                <Icon size={20} className={config.color} />
                            </div>

                            {/* Left — label, name, phone */}
                            <div className="w-48 shrink-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-sm font-semibold text-[#0B1E3D]">{addr.label}</span>
                                </div>
                                {addr.isDefault && (
                                    <span className="inline-block text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full mb-1">
                                        Default
                                    </span>
                                )}
                                <p className="text-sm text-gray-500">{addr.name}</p>
                                <p className="text-sm text-gray-500">{addr.phone}</p>
                            </div>

                            {/* Middle — address lines */}
                            <div className="flex-1 flex items-start gap-2">
                                <MapPin size={15} className="text-gray-400 mt-0.5 shrink-0" />
                                <div className="text-sm text-gray-600 leading-relaxed">
                                    <p>{addr.line1}</p>
                                    {addr.line2 && <p>{addr.line2}</p>}
                                    <p>{[addr.city, addr.state].filter(Boolean).join(", ")}, {addr.country} - {addr.zip}</p>
                                </div>
                            </div>

                            {/* Right — actions placeholder */}
                            <div className="flex items-center gap-2 shrink-0">
                                <button className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-amber-600 hover:border-amber-300 transition-colors">
                                    <Pencil size={15} />
                                </button>

                                <button className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                <Lock size={13} strokeWidth={2.5} />
                Your addresses are private and used only for shipping documents and communication.
            </div>
        </div>
    );
}

export default BuyerProfileAddress;