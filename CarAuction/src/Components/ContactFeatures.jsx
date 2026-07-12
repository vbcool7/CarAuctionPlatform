
import React from 'react';
import { Phone, Mail, MessageSquare, MessageCircle } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

function ContactFeatures() {
    const contactMethods = [
        { icon: Phone, title: "Call Us", info: "+971 4 123 4567", sub: "Mon - Sun: 9:00 AM - 8:00 PM (GST)" },
        { icon: Mail, title: "Email Us", info: "support@autobid.ae", sub: "We reply within 24 hours" },
        { icon: MessageSquare, title: "Live Chat", info: "Chat with our support team", sub: "Available 9:00 AM - 8:00 PM (GST)" },
        { icon: SiWhatsapp, title: "WhatsApp", info: "+971 50 123 4567", sub: "Mon - Sun: 9:00 AM - 8:00 PM (GST)" },
    ];

    return (
        <section className="w-full py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-white p-8 rounded-2xl border border-slate-100 shadow-md">
                    {contactMethods.map((method, index) => (
                        <div key={index} className={`flex items-start gap-4 ${index !== contactMethods.length - 1 ? 'lg:border-r border-slate-100' : ''}`}>
                            <div className="w-12 h-12 rounded-full bg-[#0B1E3D]/5 flex items-center justify-center text-[#0B1E3D] shrink-0">
                                <method.icon size={22} />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#0B1E3D] mb-1">{method.title}</h4>
                                <p className="text-[#D97706] font-semibold text-sm mb-1">{method.info}</p>
                                <p className="text-slate-500 text-xs">{method.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ContactFeatures;