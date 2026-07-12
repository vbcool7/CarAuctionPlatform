
import React from 'react'
import { dummySeller } from '../Data';
import UserManagementHeader from './UserManagementHeader';
import SellerStats from './SellerStats';
import SellerList from './SellerList';

function Seller({onViewSeller, setCurrentPage}) {
  return (
    <div>
      <UserManagementHeader 
      onAddNew={() => setCurrentPage('add-new-seller')}
      activeTab="sellers" 
      setCurrentPage={setCurrentPage} />

      <SellerStats />

      <SellerList 
      sellers={dummySeller}
      onViewSeller={onViewSeller}
      setCurrentPage={setCurrentPage} 
      />
    </div>
  )
}

export default Seller;