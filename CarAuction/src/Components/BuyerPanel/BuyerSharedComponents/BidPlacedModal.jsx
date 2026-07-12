
import { CheckCircle2, Bell, TrendingUp, Gavel, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

function BidPlacedModal({ vehicleId, previousPage, setCurrentPage, onClose }) {

    const yourBid = 'AED 127,500';
    const nextMinimumBid = 'AED 129,000';
    const bidIncrement = 'AED 1,500';
    const auctionEndsIn = { hrs: '00', mins: '12', secs: '45' };
    const vehicleName = '2021 BMW X5 xDrive40i';
    const vin = '5UXCR6C07M9H123456';
    const bidPlacedOn = 'May 21, 2024 02:15 PM';

    const handleViewAuctionDetails = () => {
        if (setCurrentPage && previousPage) setCurrentPage(previousPage);
        if (onClose) onClose();
    };

    const handleViewMyBids = () => {
        if (setCurrentPage) setCurrentPage('bids');
        if (onClose) onClose();
    };

     useEffect(() => {
            const end = Date.now() + 1500; // run for 1.5 seconds
    
            const frame = () => {
                // left side burst
                confetti({
                    particleCount: 3,
                    angle: 60,           // shooting right
                    spread: 55,
                    origin: { x: 0, y: 0.5 },
                    colors: ['#D97706', '#0B1E3D', '#10b981', '#f59e0b', '#6366f1'],
                });
    
                // right side burst
                confetti({
                    particleCount: 3,
                    angle: 120,          // shooting left
                    spread: 55,
                    origin: { x: 1, y: 0.5 },
                    colors: ['#D97706', '#0B1E3D', '#10b981', '#f59e0b', '#6366f1'],
                });
    
                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
    
            frame();
        }, []);

    return (
        <div className='fixed inset-0 bg-[#0B1E3D]/60 flex items-center justify-center z-60 p-4'>
            <div className='bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative'>

                <button 
                onClick={onClose} 
                className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'>
                    ✕
                </button>

                <div className='flex flex-col items-center text-center pt-2'>
                    <div className='w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4'>
                        <CheckCircle2 size={32} className='text-white' />
                    </div>
                    <h2 className='text-lg font-semibold text-[#0B1E3D]'>Bid Placed Successfully!</h2>
                    <p className='text-sm text-gray-500 mt-1'>You're now the highest bidder.</p>
                </div>

                <div className='bg-green-50 border border-green-100 rounded-lg px-4 py-3 mt-5'>
                    <p className='text-sm font-medium text-green-700'>Congratulations!</p>
                    <p className='text-xs text-green-600 mt-0.5'>Your bid of {yourBid} is the current highest bid.</p>
                </div>

                <div className='border border-gray-200 rounded-lg p-4 mt-4 space-y-3'>
                    <p className='text-sm font-semibold text-[#0B1E3D]'>Your Bid Summary</p>

                    <div className='grid grid-cols-2 gap-y-3 text-sm'>
                        <div>
                            <p className='text-xs text-gray-400'>Your Bid</p>
                            <p className='font-semibold text-green-600'>{yourBid}</p>
                        </div>
                        <div>
                            <p className='text-xs text-gray-400'>Next Minimum Bid</p>
                            <p className='font-medium text-[#0B1E3D]'>{nextMinimumBid}</p>
                        </div>
                        <div>
                            <p className='text-xs text-gray-400'>Bid Increment</p>
                            <p className='font-medium text-[#0B1E3D]'>{bidIncrement}</p>
                        </div>
                        <div>
                            <p className='text-xs text-gray-400'>Auction Ends In</p>
                            <p className='font-semibold text-red-600'>
                                {auctionEndsIn.hrs}:{auctionEndsIn.mins}:{auctionEndsIn.secs}
                            </p>
                        </div>
                    </div>

                    <div className='border-t border-gray-100 pt-3'>
                        <p className='text-xs text-gray-400'>Auction</p>
                        <p className='text-sm font-medium text-[#0B1E3D]'>{vehicleName}</p>
                        <p className='flex items-center gap-1 text-xs text-gray-400 mt-0.5'>
                            VIN: {vin} <Copy size={12} className='cursor-pointer' />
                        </p>
                    </div>

                    <div className='border-t border-gray-100 pt-3'>
                        <p className='text-xs text-gray-400'>Bid Placed On</p>
                        <p className='text-sm font-medium text-[#0B1E3D]'>{bidPlacedOn}</p>
                    </div>
                </div>

                <div className='flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-4 text-xs text-[#0B1E3D]'>
                    <Bell size={14} className='text-[#D97706] shrink-0' />
                    You will be notified if you are outbid.
                </div>

                <p className='text-sm font-semibold text-[#0B1E3D] mt-5 mb-3'>What's Next?</p>
                <div className='grid grid-cols-3 gap-3 text-center'>
                    <div>
                        <div className='w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-1'>
                            <Bell size={16} className='text-[#D97706]' />
                        </div>
                        <p className='text-xs font-medium text-[#0B1E3D]'>Stay Alert</p>
                        <p className='text-[11px] text-gray-400'>We'll notify you if someone places a higher bid.</p>
                    </div>
                    <div>
                        <div className='w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-1'>
                            <TrendingUp size={16} className='text-[#D97706]' />
                        </div>
                        <p className='text-xs font-medium text-[#0B1E3D]'>Keep Bidding</p>
                        <p className='text-[11px] text-gray-400'>Increase your bid to stay in the lead.</p>
                    </div>
                    <div>
                        <div className='w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-1'>
                            <Gavel size={16} className='text-[#D97706]' />
                        </div>
                        <p className='text-xs font-medium text-[#0B1E3D]'>Win the Auction</p>
                        <p className='text-[11px] text-gray-400'>If you win, our team will contact you with next steps.</p>
                    </div>
                </div>

                <div className='flex gap-3 mt-6'>
                    <button
                        onClick={handleViewAuctionDetails}
                        className='flex-1 border border-[#0B1E3D] text-[#0B1E3D] font-medium py-2.5 rounded-lg text-sm hover:bg-gray-50'
                    >
                        View Auction Details
                    </button>
                    <button
                        onClick={handleViewMyBids}
                        className='flex-1 bg-[#D97706] hover:bg-[#B45F05] text-white font-medium py-2.5 rounded-lg text-sm'
                    >
                        View My Bids
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BidPlacedModal;