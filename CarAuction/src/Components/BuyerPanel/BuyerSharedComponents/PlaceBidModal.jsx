
import { useState } from 'react';
import { X, Info, ShieldCheck, Gavel } from 'lucide-react';
import { UseCountDown } from './UseCountDown';
import { toast } from 'react-toastify';

import { usePlaceBid } from '../../../hook/useBid';
import { useGetBuyerAuctionDetail } from '../../../hook/useAuction';

function PlaceBidModal({ vehicleId, onClose, onBidPlaced }) {

    const [bidAmount, setBidAmount] = useState('');

    const { data, isLoading } = useGetBuyerAuctionDetail(vehicleId);
    const { mutate: placeBid, isPending } = usePlaceBid();

    const vehicle = data?.vehicle;

    if (isLoading || !vehicle) return null;

    const { days, hours, mins } = UseCountDown(vehicle.auctionEndDateTime);

    const minimumAllowed = vehicle.currentBid ?? vehicle.startingBidPrice;

    const handleBidNow = () => {
        const amount = Number(bidAmount);

        if (!amount || amount <= minimumAllowed) {
            toast.error(`Bid must be higher than AED ${minimumAllowed.toLocaleString()}`);
            return;
        }

        const previousBid = vehicle.currentBid;

        placeBid(
            { vehicleId: vehicle._id, amount },
            {
                onSuccess: (res) => {
                    onBidPlaced({
                        newBid: res.bid,
                        previousBid,
                        vehicle,
                    });
                    toast.success("Bid Placed Successfully");
                },
                onError: (err) => {
                    toast.error(err.response?.data?.message || 'Failed to place bid');
                }
            }
        );
    };

    return (
        <div className='fixed inset-0 bg-[#0B1E3D]/60 flex items-center justify-center z-60 p-4'>
            <div className='bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto'>

                <div className='flex items-start justify-between p-6 border-b border-gray-100'>
                    <div>
                        <h2 className='text-lg font-semibold text-[#0B1E3D]'>Place Your Bid</h2>
                        <p className='text-sm text-gray-500 mt-1'>
                            You're bidding on: <span className='font-medium text-[#0B1E3D]'>
                                {vehicle.year} {vehicle.make} {vehicle.model}
                            </span>
                        </p>
                    </div>
                    <button onClick={onClose} className='text-gray-400 hover:text-gray-600'>
                        <X size={20} />
                    </button>
                </div>

                <div className='p-6 space-y-5'>

                    <div className='flex items-center justify-between gap-4'>
                        <div className='flex-1 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-[#0B1E3D]'>
                            <Info size={16} className='text-[#D97706] shrink-0' />
                            All bids are binding and cannot be cancelled.
                        </div>
                        <div className='border border-gray-200 rounded-lg px-4 py-2 text-center'>
                            <div className='flex items-center gap-1 text-red-600 font-semibold text-base'>
                                {String(days).padStart(2, '0')}d {String(hours).padStart(2, '0')}h {String(mins).padStart(2, '0')}m
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className='text-xs text-gray-500'>Current Bid</p>
                        <p className='text-xl font-semibold text-[#0B1E3D]'>
                            AED {minimumAllowed?.toLocaleString()}
                        </p>
                    </div>

                    <div>
                        <p className='text-xs font-medium text-gray-600 mb-1'>Your Bid Amount</p>
                        <div className='flex border border-gray-200 rounded-lg overflow-hidden'>
                            <span className='px-3 py-2 bg-gray-50 text-sm text-gray-500 border-r border-gray-200'>AED</span>
                            <input
                                type='number'
                                value={bidAmount}
                                onChange={(e) => { setBidAmount(e.target.value) }}
                                placeholder='Enter your bid'
                                className='flex-1 px-3 py-2 text-sm outline-none'
                            />
                        </div>
                        <p className='text-xs text-gray-400 mt-1'>
                            Must be higher than AED {minimumAllowed?.toLocaleString()}
                        </p>
                    </div>

                    <div className='flex items-start gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2'>
                        <ShieldCheck size={16} className='text-green-600 shrink-0 mt-0.5' />
                        <div>
                            <p className='text-xs font-medium text-green-700'>You won't be charged now.</p>
                            <p className='text-xs text-green-600'>Payment is only required if you win the auction.</p>
                        </div>
                    </div>

                    <button
                        onClick={handleBidNow}
                        disabled={isPending}
                        className='w-full flex items-center justify-center gap-2 bg-[#D97706] hover:bg-[#B45F05] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50'
                    >
                        <Gavel size={16} />
                        {isPending ? 'Placing Bid...' : 'Bid Now'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PlaceBidModal;