
import React, { useState } from 'react';
import { Send } from 'lucide-react';

function LiveAuctionChat({ initialMessages = [] }) {
    
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-100">
      <h3 className="font-bold text-slate-900 mb-4">Auction Chat</h3>
      
      {/* Chat History Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="text-sm">
            <p className="font-bold text-slate-900">{msg.user}</p>
            <p className="text-slate-600">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input Area */}
     <div className="relative">
  <input 
    className="w-full p-3 pr-14 border border-slate-200 bg-slate-50 rounded-xl text-sm 
               focus:outline-none focus:bg-white focus:border-[#D97706]/50 focus:ring-4 focus:ring-[#D97706]/10 transition-all duration-300" 
    placeholder="Type your message..."
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
  />
  
  <button className="absolute right-2 top-2 p-1.5 text-slate-400 hover:text-[#0F172A] transition-colors duration-300">
    <Send size={18} />
  </button>
</div>
    </div>
  );
}

export default LiveAuctionChat;