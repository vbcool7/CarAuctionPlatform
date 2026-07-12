
import React from 'react';
import { 
  CreditCard, Truck, CalendarClock, MessageSquare, 
  RefreshCw, Search, Heart, Info, Headphones 
} from 'lucide-react';
import BuyerAuctionSellerCard from '../BuyerAuctionSellerCard';

function BuyerMyOffersDetailSideInfo({ vehicle }) {

    const status = vehicle.offerStatus;

    const InfoBox = ({ title, children }) => (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-[#0B1E3D] mb-5">{title}</h2>
            <div className="space-y-6">{children}</div>
        </div>
    );

    const StepItem = ({ icon: Icon, title, desc }) => (
        <div className="flex gap-4">
            <div className="shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Icon className="text-[#0B1E3D]" size={20} />
            </div>
            <div>
                <h3 className="text-sm font-bold text-[#0B1E3D]">{title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
        </div>
    );

    return (
        <div className="w-full">
            {/* Conditional "What Happens Next / What Happened" Section */}
            {status === 'accepted' && (
                <InfoBox title="What Happens Next?">
                    <StepItem icon={CreditCard} title="Payment Pending" desc="Complete the payment to confirm your purchase." />
                    <StepItem icon={Truck} title="Vehicle Ready" desc="Once payment is completed, the vehicle will be ready for pickup." />
                    <StepItem icon={CalendarClock} title="Pickup" desc="Schedule a pickup time and collect your vehicle." />
                </InfoBox>
            )}

            {status === 'active' && (
                <InfoBox title="What Happens Next?">
                    <StepItem icon={MessageSquare} title="Seller Review" desc="The seller will review your offer and may accept, reject, or counter." />
                    <StepItem icon={Info} title="You'll Be Notified" desc="We will notify you via email and dashboard." />
                    <StepItem icon={RefreshCw} title="Respond to Counter" desc="If countered, you can accept the counter or make a new offer." />
                </InfoBox>
            )}

            {status === 'expired' && (
                <InfoBox title="What Happened?">
                    <StepItem icon={CalendarClock} title="Your offer has expired." desc="The seller didn't accept your offer before it expired." />
                    <div className="border-t pt-6">
                        <h2 className="text-lg font-bold text-[#0B1E3D] mb-5">What Can You Do Next?</h2>
                        <div className="space-y-6">
                            <StepItem icon={RefreshCw} title="Make a New Offer" desc="The vehicle may still be available. Try making a new offer." />
                            <StepItem icon={Search} title="View Similar Vehicles" desc="Explore similar vehicles that match your preferences." />
                            <StepItem icon={Heart} title="Add to Watchlist" desc="Add this vehicle to your watchlist and get notified of new auctions." />
                        </div>
                    </div>
                </InfoBox>
            )}

            {/* Seller Information Card */}
            {/* <BuyerAuctionSellerCard vehicle={vehicle}/> */}
        </div>
    );
}

export default BuyerMyOffersDetailSideInfo;