
import React from 'react'
import UserManagementHeader from './UserManagementHeader';
import { dummyBuyers } from '../Data';
import BuyerStats from './BuyerStats';
import BuyerList from './BuyerList';

function Buyer({ setCurrentPage, onViewBuyer }) {
  return (
    <div>
      {/* heading */}
      <UserManagementHeader
        onAddNew={() => setCurrentPage('add-new-buyer')}
        activeTab="buyers"
        setCurrentPage={setCurrentPage} />

      <BuyerStats />

      <BuyerList
        buyers={dummyBuyers}
        onViewBuyer={onViewBuyer}
        setCurrentPage={setCurrentPage}
      />
    </div>
  )
}

export default Buyer