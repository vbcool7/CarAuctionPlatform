
import React, { useState } from 'react';
import { permissionsData } from '../Data';
import { Maximize } from 'lucide-react';

const NotificationsRow = ({ item, settings, onToggle }) => {

  const channels = settings[item.id];
  if (!channels) return null;

  return (
    <div className="grid grid-cols-12 items-center py-3 border-b border-slate-200 last:border-0">

      {/* Module */}
      <div className="col-span-6 flex items-center gap-3">

        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
          {item.icon}
        </div>

        <p className="text-sm font-semibold text-[#0B1E3D]">
          {item.label}
        </p>

      </div>

      {/* View */}
      <div className="col-span-1 flex items-center justify-center">
        {channels.view !== null ? (
          <input
            type="checkbox"
            checked={channels.view}
            onChange={() => onToggle(item.id, "view")}
            className="w-3.5 h-3.5 accent-[#D97706] cursor-pointer"
          />
        ) : (
          <span className="text-slate-300">—</span>
        )}
      </div>

      {/* Add */}
      <div className="col-span-1 flex items-center justify-center">
        {channels.add !== null ? (
          <input
            type="checkbox"
            checked={channels.add}
            onChange={() => onToggle(item.id, "add")}
            className="w-3.5 h-3.5 accent-[#D97706] cursor-pointer"
          />
        ) : (
          <span className="text-slate-300">—</span>
        )}
      </div>

      {/* Edit */}
      <div className="col-span-1 flex items-center justify-center">
        {channels.edit !== null ? (
          <input
            type="checkbox"
            checked={channels.edit}
            onChange={() => onToggle(item.id, "edit")}
            className="w-3.5 h-3.5 accent-[#D97706] cursor-pointer"
          />
        ) : (
          <span className="text-slate-300">—</span>
        )}
      </div>

      {/* Delete */}
      <div className="col-span-1 flex items-center justify-center">
        {channels.delete !== null ? (
          <input
            type="checkbox"
            checked={channels.delete}
            onChange={() => onToggle(item.id, "delete")}
            className="w-3.5 h-3.5 accent-[#D97706] cursor-pointer"
          />
        ) : (
          <span className="text-slate-300">—</span>
        )}
      </div>

      {/* Approve */}
      <div className="col-span-2 flex items-center justify-center">
        {channels.approve !== null ? (
          <input
            type="checkbox"
            checked={channels.approve}
            onChange={() => onToggle(item.id, "approve")}
            className="w-3.5 h-3.5 accent-[#D97706] cursor-pointer"
          />
        ) : (
          <span className="text-slate-300">—</span>
        )}
      </div>

    </div>
  );
};

function StaffPermissionTab() {

  // covert arr data in obj
  const buildInitialState = () => {
    const state = {};

    const addItems = (items) => {
      items.forEach((item) => {
        state[item.id] = { ...item.channels };

        if (item.children?.length) {
          addItems(item.children);
        }
      });
    };

    addItems(permissionsData);

    return state;
  };

  const [settings, setSettings] = useState(() => buildInitialState());

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

  return (
    <div>
      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-bold text-slate-900">Module Permissions</h2>
          <p className="text-[13px] text-slate-500 mt-1">Manage what this staff member can access and do.</p>
        </div>

        <div className="flex justify-between">
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#D97706] border border-slate-200 rounded-lg hover:bg-slate-50 transition-all active:scale-95"
          >
            <Maximize className="w-4 h-4" />
            <span>Expand All</span>
          </button>
        </div>
      </div>

      {/* bottom section */}
      <div className="bg-white mt-8">

        {/* table header */}
        <div className="grid grid-cols-12 items-center py-3 border-b border-slate-200 bg-slate-50">

          <div className="col-span-6 px-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              Module
            </span>
          </div>

          <div className="col-span-1 flex justify-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              View
            </span>
          </div>

          <div className="col-span-1 flex justify-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              Add
            </span>
          </div>

          <div className="col-span-1 flex justify-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              Edit
            </span>
          </div>

          <div className="col-span-1 flex justify-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              Delete
            </span>
          </div>

          <div className="col-span-2 flex justify-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase">
              Approve
            </span>
          </div>

        </div>

        {/* content */}
        {permissionsData.map((item) => (
          <React.Fragment key={item.id}>
            {/* Parent Row */}
            <NotificationsRow
              item={item}
              settings={settings}
              onToggle={handleToggle}
            />

            {item.children && (
              <div className="pl-10">
                {item.children.map((child) => (
                  <NotificationsRow
                    key={child.id}
                    item={child}
                    settings={settings}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            )}
          </React.Fragment>
        ))}

      </div>
    </div>
  )
}

export default StaffPermissionTab;