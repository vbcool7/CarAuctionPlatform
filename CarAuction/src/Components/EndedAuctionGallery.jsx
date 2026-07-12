
import React from 'react';
import EndedSoldGallery from './EndedSoldGallery';
import EndedUnsoldGallery from './EndedUnSoldGallery';

function EndedAuctionGallery({ vehicle }) {

    const isSold = vehicle.status === 'sold';

    return (
        <div className="relative flex flex-col h-full">

            {isSold ? (
                <EndedSoldGallery images={vehicle.images} video={vehicle.video} status={vehicle.status} />
            ) : (
                <EndedUnsoldGallery images={vehicle.images} status={vehicle.status} />
            )}

        </div>
    );
}

export default EndedAuctionGallery;