
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ROUTES = {
    live: '/live-auction-detail',
    upcoming: '/upcoming-auction-detail',
    sold: '/ended-auction-detail',
    unsold: '/ended-auction-detail',
    'reserve-not-met': '/ended-auction-detail',
};

export const useStatusRedirect = (vehicle, ownBase) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!vehicle) return;
        const target = ROUTES[vehicle.auctionStatus];
        if (!target) return navigate('/live-auctions', { replace: true }); // canceled etc.
        if (target !== ownBase) navigate(`${target}/${vehicle._id}`, { replace: true });
    }, [vehicle, ownBase, navigate]);
};