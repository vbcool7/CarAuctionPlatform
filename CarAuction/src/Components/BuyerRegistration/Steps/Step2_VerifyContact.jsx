
import { useState, useEffect, useRef } from 'react';
import { Mail, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';

import { useSendOtp, useVerifyOtp } from '../../../hook/useOtp';
import useBuyerRegFormStore from '../../../store/useBuyerRegFormStore';

import toast from 'react-hot-toast';

function Step2_VerifyContact({ onBack, onNext }) {

  const { formData, setField } = useBuyerRegFormStore();
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);

  const isVerified = formData.isEmailVerified;

  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();

  // run timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // send otp
  const handleSendOtp = () => {
    console.log('handleSendOtp called', formData.email);
    if (resendTimer > 0) return;
    sendOtpMutation.mutate(
      { email: formData.email, role: 'buyer' },
      {
        onSuccess: () => {
          toast.success('OTP sent to your email');
          setResendTimer(45);
        },
        onError: (err) => {
          toast.error(err.response?.data?.message || 'Failed to send OTP');
        },
      }
    );
  };

  const handleDigitChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // only single digit or empty
    const next = [...otpDigits];
    next[index] = value;
    setOtpDigits(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // verify otp
  const handleVerify = () => {
    const otp = otpDigits.join('');
    if (otp.length !== 6) {
      toast.error('Enter the full 6-digit code');
      return;
    }
    verifyOtpMutation.mutate(
      { email: formData.email, otp, role: 'buyer' },
      {
        onSuccess: () => {
          toast.success('Email verified');
          setField('isEmailVerified', true);
        },
        onError: (err) => {
          toast.error(err.response?.data?.message || 'Invalid or expired OTP');
        },
      }
    );
  };

  // call next step form
  const handleContinue = () => {
    if (!isVerified) {
      toast.error('Please verify your email before continuing');
      return;
    }
    onNext();
  };

  return (
    <section className='w-full py-10'>
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} />
          </div>
          <h3 className="font-bold text-[#0B1E3D] text-lg">Verify Email Address</h3>
          <p className="text-sm text-gray-500 mt-2">
            We'll send a 6-digit verification code to <br />
            <span className="font-semibold text-[#D97706]">{formData.email}</span>
          </p>

          {isVerified ? (
            <>
              <div className="flex gap-2 justify-center my-6">
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={digit}
                    disabled
                    className="w-12 h-12 text-center text-xl font-bold border border-gray-200 rounded-lg outline-none disabled:bg-gray-100"
                  />
                ))}
              </div>
              <p className="text-emerald-600 font-semibold flex items-center gap-2">
                <ShieldCheck size={20} /> Email Verified
              </p>
            </>
          ) : resendTimer === 0 && sendOtpMutation.data === undefined ? (
            <button
              onClick={handleSendOtp}
              disabled={sendOtpMutation.isPending}
              className="mt-4 bg-[#0B1E3D] text-white py-3 px-8 rounded-lg font-bold hover:bg-[#1e3a8a] transition disabled:opacity-50"
            >
              {sendOtpMutation.isPending ? 'Sending...' : 'Send Code'}
            </button>
          ) : (
            <>
              <div className="flex gap-2 justify-center my-6">
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-12 h-12 text-center text-xl font-bold border border-gray-200 rounded-lg focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] outline-none transition"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Didn't receive the code?{' '}
                <button
                  onClick={handleSendOtp}
                  disabled={resendTimer > 0}
                  className="text-[#D97706] font-semibold underline disabled:text-gray-400 disabled:no-underline"
                >
                  Resend Code {resendTimer > 0 ? `(00:${String(resendTimer).padStart(2, '0')})` : ''}
                </button>
              </p>
              <button
                onClick={handleVerify}
                disabled={verifyOtpMutation.isPending}
                className="bg-[#0B1E3D] text-white py-3 px-8 rounded-lg font-bold hover:bg-[#1e3a8a] transition disabled:opacity-50"
              >
                {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify Email →'}
              </button>
            </>
          )}
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4">
          <ShieldCheck className="text-[#D97706]" size={28} />
          <div>
            <p className="text-sm font-bold text-[#0B1E3D]">Your security is our priority</p>
            <p className="text-xs text-gray-500">
              We use industry-standard encryption to protect your personal information.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 hover:text-[#D97706] font-semibold py-2.5 rounded-lg text-gray-500 active:scale-95 transition-all duration-200 ease-in-out"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <button
          onClick={handleContinue}
          className="flex items-center gap-2 text-[#D97706] font-semibold border border-[#D97706] py-2.5 px-8 rounded-lg hover:bg-[#D97706] hover:text-white active:scale-95 transition-all duration-200 ease-in-out cursor-pointer"
        >
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

export default Step2_VerifyContact;