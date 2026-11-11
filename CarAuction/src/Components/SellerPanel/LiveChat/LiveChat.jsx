
import React from 'react';
import SupportLiveChat from '../../SharedComponents/LiveChat/SupportLiveChat';
import { useSupportChat } from '../../../hook/useSupportChat';

function LiveChat({ setCurrentPage }) {
  
    const chat = useSupportChat();

    return <SupportLiveChat onBack={() => setCurrentPage('support')} {...chat} />;
}

export default LiveChat;