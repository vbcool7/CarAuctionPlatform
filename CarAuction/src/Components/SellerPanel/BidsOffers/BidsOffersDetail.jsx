
import { Share2 } from 'lucide-react';
import React from 'react'

function BidsOffersDetail() {
    return (
        <div className='pb-6 space-y-6'>

            {/* back link */}
            <button
                onClick={() => setCurrentPage('my-auctions')}
                className='flex items-center gap-1 text-xs md:text-sm text-gray-500 hover:text-[#0B1E3D]'
            >
                ← Back to My Auctions
            </button>

            {/* header */}
            <div className='w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0'>
                <div className='flex flex-col'>
                    <h1 className='text-xl md:text-2xl font-bold'>Bids Details</h1>
                     <p className='text-xs md:text-sm text-gray-600 p-px wrap-break-word'>
                        Listing ID: 10202020 • VIN: XXXXXXXX000000
                    </p>
                </div>
            </div>

        </div>
    )
}

export default BidsOffersDetail;