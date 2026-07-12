
import React from 'react'
import BrowseAuctionsFilters from './BrowseAuctionsFilters'
import BrowseAuctionsGrid from './BrowseAuctionsGrid'

function BuyerBrowseAuction({ setCurrentPage, setSelectedVehicleId, setPreviousPage, openBidModal }) {
    return (
        <div className="w-full space-y-6">
            <BrowseAuctionsFilters />
            
            <BrowseAuctionsGrid
                setCurrentPage={setCurrentPage}
                setSelectedVehicleId={setSelectedVehicleId}
                setPreviousPage={setPreviousPage}
                openBidModal={openBidModal}
            />
        </div>
    )
}

export default BuyerBrowseAuction