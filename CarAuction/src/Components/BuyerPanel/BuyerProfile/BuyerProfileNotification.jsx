
import React, { useState } from 'react';
import { notificationSettings } from '../../Data';
import { Bell } from 'lucide-react';

const NotificationRow = ({ item, settings, onToggle }) => {

    const channels = settings[item.id];

    return (
        <div className="grid grid-cols-12 items-center py-4 border-b border-slate-100 last:border-0">

            {/* Icon + Label + Description — takes 6 cols */}
            <div className="col-span-7 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    {item.icon}
                </div>
                <div>
                    <p className="text-sm font-semibold text-[#0B1E3D]">{item.label}</p>
                    <p className="text-[12px] text-slate-400 mt-0.5">{item.description}</p>
                </div>
            </div>

            {/* Email */}
            <div className="col-span-1 flex justify-center">
                <input
                    type="checkbox"
                    checked={channels.email}
                    onChange={() => onToggle(item.id, 'email')}
                    className="w-4 h-4 accent-[#D97706] cursor-pointer"
                />
            </div>

            {/* Push */}
            <div className="col-span-1 flex justify-center">
                <input
                    type="checkbox"
                    checked={channels.push}
                    onChange={() => onToggle(item.id, 'push')}
                    className="w-4 h-4 accent-[#D97706] cursor-pointer"
                />
            </div>

            {/* SMS */}
            <div className="col-span-1 flex justify-center">
                <input
                    type="checkbox"
                    checked={channels.sms}
                    onChange={() => onToggle(item.id, 'sms')}
                    className="w-4 h-4 accent-[#D97706] cursor-pointer"
                />
            </div>

            {/* In-App toggle switch */}
            <div className="col-span-2 flex justify-center">
                <button
                    onClick={() => onToggle(item.id, 'inApp')}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none
                        ${channels.inApp ? 'bg-[#D97706]' : 'bg-slate-200'}`}
                >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                        ${channels.inApp ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                </button>
            </div>

        </div>
    );
};

function BuyerProfileNotification() {

    // covert arr data in obj
    const buildInitialState = () => {
        const state = {};
        notificationSettings.forEach(item => {
            state[item.id] = { ...item.channels };
        });
        return state;
    };

    const [settings, setSettings] = useState(buildInitialState);

    // channels on/off
    const handleToggle = (id, channel) => {
        setSettings(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [channel]: !prev[id][channel]
            }
        }));
    };

    // all channel nottification off
    const handleTurnAllOff = () => {
        setSettings(prev => {
            const updated = {};
            Object.keys(prev).forEach(id => {
                updated[id] = {
                    email: false,
                    push: false,
                    sms: false,
                    inApp: false,
                };
            });
            return updated;
        });
    };

    // Data ko category ke hisaab se group karne ke liye.
    const groups = notificationSettings.reduce((acc, item) => {
        if (!acc[item.group]) acc[item.group] = [];
        acc[item.group].push(item);
        return acc;
    }, {});

    return (
        <div>

            {/* Top bar */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-lg font-bold text-[#0B1E3D]">Notification Preferences</h2>
                    <p className="text-[13px] text-slate-500 mt-1">Choose how and when you want to receive notifications.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleTurnAllOff}
                        className="px-4 py-2 text-sm font-semibold text-[#D97706] border border-slate-200 rounded-lg hover:bg-slate-50 transition-all active:scale-95"
                    >
                        Turn All Off
                    </button>

                    <button className="px-4 py-2 text-sm font-semibold text-white bg-[#D97706] rounded-lg transition-colors 
                   hover:bg-amber-600 
                   active:bg-amber-700 active:scale-95">
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Main card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">

                {/* Column headers */}
                <div className="grid grid-cols-12 items-center pb-3 border-b-2 border-slate-100 mb-2">
                    <div className="col-span-7" />
                    <div className="col-span-1 flex justify-center">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Email</span>
                    </div>
                    <div className="col-span-1 flex justify-center">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Push</span>
                    </div>
                    <div className="col-span-1 flex justify-center">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">SMS</span>
                    </div>
                    <div className="col-span-2 flex justify-center">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">In-App</span>
                    </div>
                </div>

                {/* Groups + Rows */}
                {Object.entries(groups).map(([groupName, items]) => (
                    <div key={groupName}>
                        <p className="text-sm font-bold text-[#0B1E3D] mt-6 mb-2">{groupName}</p>
                        {items.map(item => (
                            <NotificationRow
                                key={item.id}
                                item={item}
                                settings={settings}
                                onToggle={handleToggle}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Footer banner */}
            <div className="mt-4 flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-5 py-4">
                <div className="shrink-0 text-[#D97706]">
                    <Bell size={24} strokeWidth={2} />
                </div>

                <p className="text-sm text-slate-600">
                    <span className="font-bold text-[#0B1E3D]">Stay in the loop! </span>
                    You can control how you receive notifications. Your preferences are saved automatically.
                </p>
            </div>

        </div>
    );
}

export default BuyerProfileNotification;