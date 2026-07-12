
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function ContactFAQs() {

  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: "How do I register on AutoBid?", a: "Click on the 'Sign Up' button on the top right, provide your details, and verify your account via email." },
    { q: "How do I place a bid?", a: "Once registered and logged in, go to the car listing page and enter your bid amount in the bidding field." },
    { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, bank transfers, and secure digital wallet payments." },
    { q: "How do I sell my car on AutoBid?", a: "Visit the 'Sell Your Car' page, fill in your vehicle details, and our team will get in touch for an inspection." },
    { q: "How long does delivery take?", a: "Delivery typically takes 3-5 business days depending on your location after the final payment is cleared." },
    { q: "How can I contact support?", a: "You can reach us via live chat, email at support@autobid.ae, or by calling our support helpline." }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#0B1E3D]">Frequently Asked Questions</h2>

          <button
            onClick={() => navigate('/faq')}
            className="text-[#0B1E3D] font-semibold flex items-center gap-1 hover:text-[#D97706] transition">
            View All FAQs →
          </button>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-[#0B1E3D] font-semibold"
              >
                {faq.q}
                {openIndex === index ? <ChevronUp size={20} className="text-[#D97706]" /> : <ChevronDown size={20} />}
              </button>

              {openIndex === index && (
                <p className="mt-3 text-slate-600 text-sm border-t border-slate-100 pt-3">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ContactFAQs;