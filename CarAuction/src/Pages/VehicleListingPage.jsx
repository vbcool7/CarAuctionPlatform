
import React, { useState } from 'react'
import VehicleList from '../Components/VehicleList';
import VehicleListFilter from '../Components/VehicleListFilter';
import { useSearchParams } from 'react-router-dom';

function VehicleListingPage() {

    const [searchParams] = useSearchParams();
    
    // Read from URL: ?category=Sedan&status=live
    const categoryFilter = searchParams.get('category');
    const statusFilter = searchParams.get('status');
    
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6 flex flex-col lg:flex-row gap-6 my-6">
      <VehicleListFilter />
      <VehicleList category={categoryFilter} status={statusFilter}/>
    </div>
  );
}

export default VehicleListingPage;