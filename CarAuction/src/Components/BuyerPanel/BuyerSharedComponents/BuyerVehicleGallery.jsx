
import React from 'react';
import VehicleGallery from '../../VehicleGallery';

function BuyerVehicleGallery({ vehicle }) {
  return (
      <VehicleGallery
        images={vehicle.images}
        video={vehicle.video}
      />
  )
}

export default BuyerVehicleGallery;