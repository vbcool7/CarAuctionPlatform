
import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react';
import BuyerSupportSidebar from './BuyerSupportSidebar';
import BuyerSupportStats from './BuyerSupportStats';
import BuyerSupportSubmitTicket from './BuyerSupportSubmitTicket';
import BuyerSupportFAQs from './BuyerSupportFAQs';
import BuyerSupportLiveChat from './BuyerSupportLiveChat';
import BuyerSupportRequestCall from './BuyerSupportRequestCall';

function BuyerSupport({ setCurrentPage }) {
  const [supportPage, setSupportPage] = useState('home');

  return (
    <>
      {/* heading */}
      {supportPage === 'home' && (
        <div className="mb-6">
          <h1 className="text-slate-800 text-xl md:text-2xl font-bold">Support Center</h1>
          <p className="pt-1 text-gray-600 text-[12px] md:text-sm font-medium">
            We are here to help! Find answers or get in touch with our support team.
          </p>
        </div>
      )}

      {supportPage === 'submit-ticket' && (
        <div className="">
          <button
            onClick={() => setSupportPage("home")}
            className="flex items-center gap-1.5 text-sm text-[#0B1E3D] font-medium hover:opacity-70 transition-opacity mb-4 cursor-pointer"
          >
            <ArrowLeft size={15} />
            Back to Support Center
          </button>

          <div className="mb-6">
            <h1 className="text-slate-800 text-xl md:text-2xl font-bold">Submit a Ticket</h1>
            <p className="pt-1 text-gray-600 text-[12px] md:text-sm font-medium">
              Fill in the details below and our support team will get back to you.
            </p>
          </div>
        </div>
      )}

      {supportPage === 'faqs' && (
        <div className="">
          <button
            onClick={() => setSupportPage("home")}
            className="flex items-center gap-1.5 text-sm text-[#0B1E3D] font-medium hover:opacity-70 transition-opacity mb-4 cursor-pointer"
          >
            <ArrowLeft size={15} />
            Back to Support Center
          </button>

          <div className="mb-6">
            <h1 className="text-slate-800 text-xl md:text-2xl font-bold">FAQs</h1>
            <p className="pt-1 text-gray-600 text-[12px] md:text-sm font-medium">
              Find answers to the most common questions.
            </p>
          </div>
        </div>
      )}

      {supportPage === 'request-call' && (
        <div className="">
          <button
            onClick={() => setSupportPage("home")}
            className="flex items-center gap-1.5 text-sm text-[#0B1E3D] font-medium hover:opacity-70 transition-opacity mb-4 cursor-pointer"
          >
            <ArrowLeft size={15} />
            Back to Support Center
          </button>

          <div className="mb-6">
            <h1 className="text-slate-800 text-xl md:text-2xl font-bold">Request a Call</h1>
            <p className="pt-1 text-gray-600 text-[12px] md:text-sm font-medium">
              We'll call you back at your preferred time.
            </p>
          </div>
        </div>
      )}

      {/* Live Chat — full width, owns its own header */}
      {supportPage === 'live-chat'
        ? <BuyerSupportLiveChat setSupportPage={setSupportPage} />
        : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              {supportPage === 'home' && <BuyerSupportStats setSupportPage={setSupportPage} />}
              {supportPage === 'submit-ticket' && <BuyerSupportSubmitTicket setSupportPage={setSupportPage} />}
              {supportPage === 'faqs' && <BuyerSupportFAQs setSupportPage={setSupportPage} />}
              {supportPage === 'request-call' && <BuyerSupportRequestCall setSupportPage={setSupportPage} />}
            </div>
            <div className="lg:col-span-4 flex flex-col gap-6">
              <BuyerSupportSidebar supportPage={supportPage} setSupportPage={setSupportPage} />
            </div>
          </div>
        )
      }
    </>
  );
}

export default BuyerSupport;