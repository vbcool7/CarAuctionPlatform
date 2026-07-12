
import React from 'react'
import { dummyStaff } from '../Data';
import UserManagementHeader from './UserManagementHeader';
import StaffStats from './StaffStats';
import StaffList from './StaffList';

function Staff({ onViewStaff, setCurrentPage }) {
  return (
    <div>
      <UserManagementHeader
        onAddNew={() => setCurrentPage('add-new-staff')}
        activeTab="staffs"
        setCurrentPage={setCurrentPage} />

      <StaffStats />

      <StaffList
        staffs={dummyStaff}
        onViewStaff={onViewStaff}
        setCurrentPage={setCurrentPage}
      />
    </div>
  )
}

export default Staff;