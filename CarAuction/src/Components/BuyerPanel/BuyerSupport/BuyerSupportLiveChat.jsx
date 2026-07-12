
import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Power, ThumbsUp, ThumbsDown, Mic, Smile, Send, Star } from 'lucide-react';

const conversations = [
    {
        id: 1,
        name: 'Sarah Ahmed',
        role: 'Support Agent',
        time: '10:30 AM',
        preview: '',
        avatar: 'SA',
        active: true,
    },
    {
        id: 2,
        name: 'BidDrive Support',
        role: '',
        time: 'Yesterday',
        preview: "We'll be right back",
        avatar: null,
        active: false,
    },
    {
        id: 3,
        name: 'Rashid Khan',
        role: '',
        time: 'May 18',
        preview: 'Thanks for your help!',
        avatar: 'RK',
        active: false,
    },
    {
        id: 4,
        name: 'BidDrive Support',
        role: '',
        time: 'May 15',
        preview: 'Your ticket has been closed',
        avatar: null,
        active: false,
    },
    {
        id: 5,
        name: 'Michael Brown',
        role: '',
        time: 'May 14',
        preview: 'Can you help me?',
        avatar: 'MB',
        active: false,
    },
];

const initialMessages = [
    { id: 1, from: 'agent', text: "Hello John! 👋\nThanks for contacting BidDrive support.\nHow can I assist you today?", time: '10:30 AM' },
    { id: 2, from: 'user', text: 'Hi Sarah, I have a question about payment not reflected in my account.', time: '10:31 AM' },
    { id: 3, from: 'agent', text: "I'd be happy to help you with that.\nCould you please share your transaction ID or the payment reference?", time: '10:31 AM' },
    { id: 4, from: 'user', text: 'Sure, my transaction ID is TXN123456789.', time: '10:32 AM' },
    { id: 5, from: 'agent', text: 'Thank you! Let me check this for you.\nIt will only take a moment.', time: '10:32 AM' },
];

// show avatar or name letter
function Avatar({ initials, size = 'md' }) {
    const sz = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm';
    if (!initials) {
        return (
            <div className={`${sz} rounded-full bg-amber-100 flex items-center justify-center shrink-0`}>
                <span className="text-amber-700 font-bold text-xs">BD</span>
            </div>
        );
    }
    return (
        <div className={`${sz} rounded-full bg-[#0B1E3D] flex items-center justify-center shrink-0`}>
            <span className="text-white font-bold">{initials}</span>
        </div>
    );
}

function BuyerSupportLiveChat({ setSupportPage }) {

    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');
    const [activeConv, setActiveConv] = useState(1);
    const [rating, setRating] = useState(0);
    const bottomRef = useRef(null);

    // for specific chat scroll (automatic) - latest msg visible
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // msg send 
    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages(prev => [...prev, {
            id: prev.length + 1,
            from: 'user',
            text: input.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }]);
        setInput('');
    };

    // to press enter - msg sent
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col gap-4 mb-6">

            {/* heading */}
            <div className="space-y-4">
                <button
                    onClick={() => setSupportPage("home")}
                    className="flex items-center gap-1.5 text-sm text-[#0B1E3D] font-medium hover:opacity-70 transition-opacity mb-3"
                >
                    <ArrowLeft size={15} />
                    Back to Support Center
                </button>

                <div className='flex justify-between items-start'>
                    <div>
                        <div className='flex items-center gap-3'>
                            <h1 className='text-slate-800 text-xl md:text-2xl font-bold'>
                                Live Chat
                            </h1>
                            {/* Badge ko yahan fix kiya */}
                            <span className='px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[11px] font-bold uppercase tracking-wide border border-green-200'>
                                Connected
                            </span>
                        </div>
                        <p className="className='pt-1 text-gray-600 text-[12px] md:text-sm font-medium">
                            You are chatting with our support agent. How can we help you today?
                        </p>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 border border-red-600 rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300">
                        <Power size={18} strokeWidth={2.5} />
                        <span className="text-base font-semibold">End Chat</span>
                    </button>
                </div>
            </div>

            {/* chat section */}
            <div className="grid grid-cols-12 gap-4 h-110">

                {/* chat list */}
                <div className="col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100">
                        <h3 className="font-bold text-[#0B1E3D] text-sm">
                            Conversations
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {conversations.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => setActiveConv(conv.id)}
                                className={`flex items-start gap-3 p-3 cursor-pointer transition border-b border-slate-50 ${activeConv === conv.id ? 'bg-amber-50 border-l-2 border-l-amber-500' : 'hover:bg-slate-50'
                                    }`}
                            >
                                <Avatar initials={conv.avatar} size="" />

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-semibold text-[#0B1E3D] truncate">{conv.name}</span>
                                        <span className="text-[10px] text-slate-400 shrink-0 ml-1">{conv.time}</span>
                                    </div>
                                    {conv.role
                                        ? <span className="text-[10px] text-amber-600 font-medium">{conv.role}</span>
                                        : <p className="text-[10px] text-slate-400 truncate">{conv.preview}</p>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 border-t border-slate-100">
                        <button className="w-full text-xs font-medium text-[#D97706] border border-amber-200 rounded-xl py-2 hover:bg-amber-50 transition">
                            View All Conversations
                        </button>
                    </div>
                </div>


                {/* chat window */}
                <div className="col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">

                    {/* heading */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Avatar initials="SA" />
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#0B1E3D]">Sarah Ahmed</p>
                                <p className="text-xs text-amber-600 font-medium">Support Agent</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition">
                                <ThumbsUp size={16} />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition">
                                <ThumbsDown size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>

                                {msg.from === 'agent' && <Avatar initials="SA" size="sm" />}

                                <div className={`ml-2 max-w-[70%] ${msg.from === 'user' ? 'mr-0' : ''}`}>
                                    <div className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-line 
                                    ${msg.from === 'user'
                                            ? 'bg-[#0B1E3D] text-white rounded-tr-sm'
                                            : 'bg-slate-100 text-slate-700 rounded-tl-sm'
                                        }`}>
                                        {msg.text}
                                    </div>

                                    <p className={`text-[10px] text-slate-400 mt-1 
                                        ${msg.from === 'user' ? 'text-right' : ''}`}>
                                        {msg.time}
                                        {msg.from === 'user' && <span className="ml-1 text-amber-500">✓✓</span>}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* typing indicator */}
                        <div className="flex items-center gap-2">
                            <Avatar initials="SA" size="sm" />
                            <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>

                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-slate-100 p-3">
                        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
                            <button className="text-slate-400 hover:text-slate-600 transition">
                                <Mic size={18} />
                            </button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message here..."
                                className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
                            />
                            <button className="text-slate-400 hover:text-slate-600 transition">
                                <Smile size={18} />
                            </button>
                            <button
                                onClick={sendMessage}
                                className="w-8 h-8 rounded-lg bg-[#D97706] flex items-center justify-center hover:bg-amber-600 transition"
                            >
                                <Send size={14} className="text-white" />
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1.5 ml-1">
                            Press Enter to send 
                        </p>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default BuyerSupportLiveChat;