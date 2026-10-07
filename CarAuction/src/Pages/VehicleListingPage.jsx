
import React from 'react';
import VehicleList from '../Components/VehicleList';
import VehicleListFilter from '../Components/VehicleListFilter';
import Breadcrumbs from '../Components/Breadcrumbs';

const breadcrumbItems = [
  { label: 'Home', path: '/' },
  { label: 'Vehicle List' }
];

function VehicleListingPage() {

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">

      {/* ========= breadcrumb ========= */}
      <div className='pt-3'>
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* ========= filter / list ========= */}
      <div className='w-full flex gap-6 mt-4'>

        <div className='w-full lg:w-[30%]'>
          <VehicleListFilter />
        </div>

        <div className='w-full lg:w-[70%]'>
          <VehicleList />
        </div>
      </div>
    </div>
  );
}

export default VehicleListingPage;