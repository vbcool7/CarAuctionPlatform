
import { useState } from 'react';
import { X, Info, ShieldCheck, Gavel, Lock } from 'lucide-react';

function PlaceBidModal({ vehicleId, onClose, onBidPlaced }) {

    const isQuickBidCustom = false;

    const [selectedQuickBid, setSelectedQuickBid] = useState('127500');
    const [maxBidInput, setMaxBidInput] = useState('');
    const [customBidInput, setCustomBidInput] = useState('');

    const vehicleName = '2021 BMW X5 xDrive40i';
    const currentBid = 'AED 126,000';
    const nextMinimumBid = 'AED 127,500';
    const bidIncrement = 'AED 1,500';
    const timeLeft = { hrs: '00', mins: '12', secs: '45' };

    const quickBidOptions = [
        { id: '127500', amount: 'AED 127,500', label: 'Next Minimum Bid' },
        { id: '129000', amount: 'AED 129,000', label: '+2 Increments' },
        { id: '130500', amount: 'AED 130,500', label: '+3 Increments' },
        { id: '132000', amount: 'AED 132,000', label: '+4 Increments' },
    ];

    const handleBidNow = () => {
        if (onBidPlaced) onBidPlaced();
    };

    return (
        <div className='fixed inset-0 bg-[#0B1E3D]/60 flex items-center justify-center z-60 p-4'>
            <div className='bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>

                <div className='flex items-start justify-between p-6 border-b border-gray-100'>
                    <div>
                        <h2 className='text-lg font-semibold text-[#0B1E3D]'>Place Your Bid</h2>
                        <p className='text-sm text-gray-500 mt-1'>
                            You're bidding on: <span className='font-medium text-[#0B1E3D]'>{vehicleName}</span>
                            <span className='ml-2 inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full'>
                                <span className='w-1.5 h-1.5 rounded-full bg-green-500'></span> Live
                            </span>
                        </p>
                    </div>
                    <button onClick={onClose} className='text-gray-400 hover:text-gray-600'>
                        <X size={20} />
                    </button>
                </div>

                <div className='p-6 space-y-6'>

                    <div className='flex items-center justify-between gap-4'>
                        <div className='flex-1 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-[#0B1E3D]'>
                            <Info size={16} className='text-[#D97706] shrink-0' />
                            All bids are binding and cannot be cancelled.
                        </div>
                        <div className='border border-gray-200 rounded-lg px-4 py-2 text-center'>
                            <div className='flex items-center gap-1 text-red-600 font-semibold text-base'>
                                <span>{timeLeft.hrs}</span>:<span>{timeLeft.mins}</span>:<span>{timeLeft.secs}</span>
                            </div>
                            <div className='flex items-center gap-3 text-[10px] text-gray-400 mt-0.5'>
                                <span>HRS</span><span>MINS</span><span>SECS</span>
                            </div>
                        </div>
                    </div>

                    <div className='grid grid-cols-2 gap-6'>

                        <div className='space-y-4'>
                            <div className='flex justify-between'>
                                <div>
                                    <p className='text-xs text-gray-500'>Current Bid</p>
                                    <p className='text-xl font-semibold text-[#0B1E3D]'>{currentBid}</p>
                                </div>
                                <div className='text-right'>
                                    <p className='text-xs text-gray-500'>Next Minimum Bid</p>
                                    <p className='text-base font-semibold text-[#0B1E3D]'>{nextMinimumBid}</p>
                                </div>
                            </div>

                            <div>
                                <p className='text-xs font-medium text-gray-600 mb-1'>Your Maximum Bid <span className='text-gray-400 font-normal'>(Optional)</span></p>
                                <p className='text-xs text-gray-400 mb-2'>We'll bid on your behalf up to your maximum limit.</p>
                                <div className='flex border border-gray-200 rounded-lg overflow-hidden'>
                                    <span className='px-3 py-2 bg-gray-50 text-sm text-gray-500 border-r border-gray-200'>AED</span>
                                    <input
                                        type='text'
                                        value={maxBidInput}
                                        onChange={(e) => setMaxBidInput(e.target.value)}
                                        placeholder='Enter maximum bid'
                                        className='flex-1 px-3 py-2 text-sm outline-none'
                                    />
                                </div>
                                <p className='text-xs text-gray-400 mt-1'>Must be higher than {nextMinimumBid}</p>
                            </div>

                            <div>
                                <p className='text-xs text-gray-500'>Bid Increment</p>
                                <p className='text-sm font-medium text-[#0B1E3D]'>{bidIncrement}</p>
                            </div>

                            <div className='flex items-start gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2'>
                                <ShieldCheck size={16} className='text-green-600 shrink-0 mt-0.5' />
                                <div>
                                    <p className='text-xs font-medium text-green-700'>You won't be charged now.</p>
                                    <p className='text-xs text-green-600'>Payment is only required if you win the auction.</p>
                                </div>
                            </div>

                            <div className='text-xs text-gray-500 space-y-1'>
                                <p className='font-medium text-gray-600'>Note:</p>
                                <p>If another bidder places a higher bid, we'll automatically bid for you up to your maximum.</p>
                                <p>You will be notified if you are outbid.</p>
                            </div>
                        </div>

                        <div className='space-y-3'>
                            <div>
                                <p className='text-sm font-medium text-[#0B1E3D]'>Quick Bid</p>
                                <p className='text-xs text-gray-400'>Place a bid quickly using the next valid amounts.</p>
                            </div>

                            {quickBidOptions.map((opt) => (
                                <label
                                    key={opt.id}
                                    className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                                        selectedQuickBid === opt.id ? 'border-[#D97706] bg-amber-50' : 'border-gray-200'
                                    }`}
                                >
                                    <div className='flex items-center gap-3'>
                                        <input
                                            type='radio'
                                            name='quickBid'
                                            checked={selectedQuickBid === opt.id}
                                            onChange={() => setSelectedQuickBid(opt.id)}
                                            className='accent-[#D97706] w-4 h-4'
                                        />
                                        <span className={`text-sm font-semibold ${selectedQuickBid === opt.id ? 'text-[#D97706]' : 'text-[#0B1E3D]'}`}>
                                            {opt.amount}
                                        </span>
                                    </div>
                                    <span className='text-xs text-gray-400'>{opt.label}</span>
                                </label>
                            ))}

                            <label
                                className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                                    selectedQuickBid === 'custom' ? 'border-[#D97706] bg-amber-50' : 'border-gray-200'
                                }`}
                            >
                                <div className='flex items-center gap-3'>
                                    <input
                                        type='radio'
                                        name='quickBid'
                                        checked={selectedQuickBid === 'custom'}
                                        onChange={() => setSelectedQuickBid('custom')}
                                        className='accent-[#D97706] w-4 h-4'
                                    />
                                    <span className={`text-sm font-semibold ${selectedQuickBid === 'custom' ? 'text-[#D97706]' : 'text-[#0B1E3D]'}`}>
                                        Custom Amount
                                    </span>
                                </div>
                                <span className='text-xs text-gray-400'>Enter your own amount</span>
                            </label>

                            {selectedQuickBid === 'custom' && (
                                <input
                                    type='text'
                                    value={customBidInput}
                                    onChange={(e) => setCustomBidInput(e.target.value)}
                                    placeholder='Enter custom amount'
                                    className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none'
                                />
                            )}

                            <button
                                onClick={handleBidNow}
                                className='w-full flex items-center justify-center gap-2 bg-[#D97706] hover:bg-[#B45F05] text-white font-semibold py-3 rounded-lg transition-colors'
                            >
                                <Gavel size={16} />
                                Bid Now
                            </button>

                            <p className='flex items-center justify-center gap-1 text-xs text-gray-400'>
                                <Lock size={12} /> Your information is secure and encrypted.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlaceBidModal;