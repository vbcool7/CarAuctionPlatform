
function BuyerAuctionResultDetail({ vehicleId, setCurrentPage, previousPage }) {

    // hardcoded/static for now — same as your other detail pages
    const vehicleName = '2021 BMW X5 xDrive40i';
    const finalBid = 'AED 132,000';
    const status = 'sold'; // 'sold' | 'unsold'
    const isWinningBidder = true; // pulled from vehicle data once Data.jsx has the field

    const resultType = status === 'unsold' ? 'unsold' : (isWinningBidder ? 'won' : 'lost');

    return (
        <div className='p-6'>
            <button onClick={() => setCurrentPage(previousPage)} className='mb-4 text-sm text-slate-500'>
                ← Back
            </button>

            {/* shared layout — gallery, vehicle info — same regardless of outcome */}
            <h2 className='text-xl font-semibold text-[#0B1E3D]'>{vehicleName}</h2>

            {resultType === 'won' && (
                <div className='bg-green-50 p-4 rounded-lg mt-4'>
                    <p className='font-semibold text-green-700'>You won this auction!</p>
                    <p className='text-sm text-green-600'>Final bid: {finalBid}</p>
                </div>
            )}

            {resultType === 'lost' && (
                <div className='bg-red-50 p-4 rounded-lg mt-4'>
                    <p className='font-semibold text-red-700'>You did not win this auction.</p>
                    <p className='text-sm text-red-600'>Winning bid: {finalBid}</p>
                </div>
            )}

            {resultType === 'unsold' && (
                <div className='bg-gray-50 p-4 rounded-lg mt-4'>
                    <p className='font-semibold text-gray-700'>This auction ended without a sale.</p>
                    <p className='text-sm text-gray-500'>Reserve price was not met.</p>
                </div>
            )}
        </div>
    );
}

export default BuyerAuctionResultDetail;