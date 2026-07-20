
import React from 'react';

function RoleInformation({ roleName, roleDescription, roleLevel, createdOn }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
      <h2 className="font-bold text-slate-900 mb-4">Role Information</h2>
      
      <div className="space-y-5">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-0.5">Role Name</p>
          <p className="text-gray-900 font-medium">{roleName}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500 mb-0.5">Role Description</p>
          <p className="text-gray-900">{roleDescription}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500 mb-0.5">Role Level</p>
          <span className="inline-block bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-md font-medium">
            {roleLevel}
          </span>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500 mb-0.5">Created On</p>
          <p className="text-gray-900">{createdOn}</p>
        </div>
      </div>
    </div>
  );
}

export default RoleInformation;