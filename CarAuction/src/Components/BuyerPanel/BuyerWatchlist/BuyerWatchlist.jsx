
import React from 'react';
import BuyerWatchlistList from './BuyerWatchlistList';

function BuyerWatchlist({ setCurrentPage, setSelectedVehicleId, setPreviousPage, openBidModal }) {
    return (
        <div>
            <div className='pb-7'>
                <h1 className='text-slate-800 text-xl md:text-2xl font-bold'>Watchlist</h1>
                <p className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium'>Vehicles you've saved to watch and bid on.</p>
            </div>

            <BuyerWatchlistList
                setCurrentPage={setCurrentPage}
                setSelectedVehicleId={setSelectedVehicleId}
                setPreviousPage={setPreviousPage}
                openBidModal={openBidModal}
            />
        </div>
    )
}

export default BuyerWatchlist;