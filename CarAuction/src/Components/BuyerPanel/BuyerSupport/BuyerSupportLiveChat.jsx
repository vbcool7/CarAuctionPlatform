
import React from 'react';
import SupportLiveChat from '../../SharedComponents/LiveChat/SupportLiveChat';
import { useSupportChat } from '../../../hook/useSupportChat';

function BuyerSupportLiveChat({ setSupportPage }) {
    const chat = useSupportChat();

    return <SupportLiveChat onBack={() => setSupportPage('home')} {...chat} />;
}

export default BuyerSupportLiveChat;