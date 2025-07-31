import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store"; // Make sure this path is correct
import { clearAuthError } from "../features/slices/authSlice"; // Make sure this path is correct
import {
  resendOtp,
  sendLoginOtp,
  sendRegistrationOtp,
  verifyLoginOtp,
  verifyOtpAndRegister
} from "../features/thunks/authThunks"; // Make sure this path is correct

import parsePhoneNumber from 'libphonenumber-js';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface PartnerPopupProps {
  open: boolean;
  onClose: () => void;
}

const PartnerPopup: React.FC<PartnerPopupProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { status, error: authError, currentUser } = useSelector((state: RootState) => state.auth);

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginCountryCode, setLoginCountryCode] = useState("+91");

  const [name, setName] = useState("");
  const [fullPhoneNumber, setFullPhoneNumber] = useState<string | undefined>();
  const [signupGender, setSignupGender] = useState("");
  const [signupDOB, setSignupDOB] = useState("");
  const [signupCity, setSignupCity] = useState("");
  const [signupTown, setSignupTown] = useState("");
  const [signupState, setSignupState] = useState("");
  const [signupCountry, setSignupCountry] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const isLoginInputEmail = loginIdentifier.includes('@');


  useEffect(() => {
    if (status === 'succeeded' && currentUser) {
      if (currentUser.role === 'PARTNER') {
        navigate("/pdashboard", { replace: true });
      }
      handleClose();
    }
  }, [status, currentUser, navigate, onClose]);




  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
      dispatch(clearAuthError());
    };
  }, [open, dispatch]);

  const handleOtpChange = (idx: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value.slice(-1);
    setOtp(newOtp);
    if (value && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const switchMode = (newMode: "login" | "signup") => {
    setMode(newMode);
    setStep("form");
    setOtp(["", "", "", "", "", ""]);
    setLoginIdentifier("");
    setName("");
    setFullPhoneNumber(undefined);
    setSignupGender("");
    setSignupDOB("");
    setSignupEmail("");
    setSignupCity("");
    setSignupTown("");
    setSignupState("");
    setSignupCountry("");
    setSignupPassword("");
    setSignupConfirmPassword("");
    dispatch(clearAuthError());
    setValidationError(null);
  };

  const handleSendLoginOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedIdentifier = loginIdentifier.trim();
    if (!trimmedIdentifier) {
      setValidationError("Please enter your email or phone number.");
      return;
    }
    const finalIdentifier = isLoginInputEmail ? trimmedIdentifier : `${loginCountryCode}${trimmedIdentifier}`;
    setValidationError(null);
    dispatch(clearAuthError());
    dispatch(sendLoginOtp({ identifier: finalIdentifier }))
      .then(result => {
        if (sendLoginOtp.fulfilled.match(result)) {
          setLoginIdentifier(finalIdentifier);
          setStep("otp");
        }
      });
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullPhoneNumber || !isValidPhoneNumber(fullPhoneNumber)) { setValidationError("Please enter a valid phone number."); return; }
    if (!name.trim() || !signupGender || !signupDOB || !signupEmail.trim() || !signupCity.trim() || !signupTown.trim() || !signupState.trim() || !signupCountry.trim() || !signupPassword || !signupConfirmPassword) { setValidationError("Please fill all required fields."); return; }
    if (!/^\S+@\S+\.\S+$/.test(signupEmail)) { setValidationError("Please enter a valid email address."); return; }
    if (signupPassword.length < 6) { setValidationError("Password must be at least 6 characters."); return; }
    if (signupPassword !== signupConfirmPassword) { setValidationError("Passwords do not match."); return; }

    setValidationError(null);
    dispatch(clearAuthError());

    const phoneNumber = parsePhoneNumber(fullPhoneNumber);
    if (!phoneNumber) { setValidationError("Invalid phone number format."); return; }

    dispatch(sendRegistrationOtp({
      fullName: name, gender: signupGender, dob: signupDOB, email: signupEmail,
      mobile: phoneNumber.nationalNumber, countryCode: `+${phoneNumber.countryCallingCode}`,
      city: signupCity, town: signupTown, state: signupState, country: signupCountry,
      password: signupPassword, role: 'PARTNER'
    })).then(result => {
      if (sendRegistrationOtp.fulfilled.match(result)) {
        setStep("otp");
      }
    });
  };

  const handleVerifyOtp = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) { setValidationError("Please enter the complete 6-digit OTP."); return; }
    setValidationError(null);
    dispatch(clearAuthError());

    if (mode === 'login') {
      dispatch(verifyLoginOtp({ identifier: loginIdentifier, otp: fullOtp }));
    } else {
      const phoneNumber = parsePhoneNumber(fullPhoneNumber || '');
      if (!phoneNumber) { setValidationError("Invalid phone number format."); return; }
      try {
        await dispatch(verifyOtpAndRegister({
          email: signupEmail, otp: fullOtp, fullName: name, gender: signupGender, dob: signupDOB,
          mobile: phoneNumber.nationalNumber, countryCode: `+${phoneNumber.countryCallingCode}`,
          city: signupCity, town: signupTown, state: signupState, country: signupCountry,
          password: signupPassword, role: 'PARTNER'
        })).unwrap();
        alert("Partner registration successful! Please log in.");
        switchMode("login");
      } catch (rejectedValue) {
        setValidationError(rejectedValue as string);
      }
    }
  };

  const handleResendOtp = () => {
    const identifier = mode === 'login' ? loginIdentifier : signupEmail;
    if (identifier) dispatch(resendOtp({ email: identifier }));
  };

  // The 'X' button should just call onClose. The parent component is responsible for its state.
  const handleClose = () => {
    onClose();
    navigate("/");
  };

  if (!open) return null;

  const isLoading = status === 'loading';
  const otpTargetIdentifier = mode === 'login' ? loginIdentifier : signupEmail;


  return (
    <div className="fixed inset-0 bg-opacity-40 z-[9999] flex items-center justify-center">
      <div className="bg-white rounded-2xl max-w-[400px] w-[96vw] p-4 pt-3 shadow-xl relative text-center max-h-[90vh] overflow-y-auto animate-popup-fade-in">
        <div className="flex flex-col items-center justify-center mb-1">
          <img src="/logo.png" alt="Logo" className="h-7 mb-1" />
        </div>
        <div className="flex justify-center mb-2 gap-1">
          <button className={`px-3 py-1 rounded-md font-bold text-xs transition-all border-2 ${mode === 'login' ? 'bg-[#991313] text-white border-[#991313]' : 'bg-white text-[#991313] border-[#991313]'}`} onClick={() => switchMode('login')} disabled={isLoading}>Partner Login</button>
          <button className={`px-3 py-1 rounded-md font-bold text-xs transition-all border-2 ${mode === 'signup' ? 'bg-[#991313] text-white border-[#991313]' : 'bg-white text-[#991313] border-[#991313]'}`} onClick={() => switchMode('signup')} disabled={isLoading}>Partner Sign Up</button>
        </div>
        <h2 className="font-extrabold text-base mb-1 text-[#991313]">{mode === 'login' ? 'Welcome Back, Partner!' : 'Create your Partner Account'}</h2>
        <div className="border-b-2 border-[#991313] w-9 mx-auto mb-2 opacity-70" />
        {(authError || validationError) && (
          <div className="text-[#991313] font-semibold mb-1.5 p-1.5 bg-[#f9e9c7] rounded text-xs">{authError || validationError}</div>
        )}
        {mode === 'login' && step === 'form' && (
          <form onSubmit={handleSendLoginOtp} autoComplete="off">
            <div className="text-left mb-2">
              <label className="font-bold text-[#222] text-xs mb-0.5 block">Email <span className="text-[#991313]">*</span></label>
              {/*
              <div className="flex items-center">
                {!isLoginInputEmail && (<select value={loginCountryCode} onChange={e => setLoginCountryCode(e.target.value)} className="border border-[#f0e3d1] border-r-0 rounded-l-lg bg-[#f9f7f6] px-3 py-2 text-xs text-[#991313] outline-none"><option value="+91">+91 (India)</option></select>)}
              */}
              <input type="email" placeholder="Enter email" value={loginIdentifier} onChange={e => setLoginIdentifier(e.target.value)} className="border border-[#f0e3d1] rounded-lg bg-[#f9f7f6] px-3 py-2 w-full text-xs font-medium text-[#991313] outline-none shadow-sm" required />
              {/*</div>*/}
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-[#991313] text-white rounded-lg py-2 font-bold text-xs mt-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed">{isLoading ? 'Sending OTP...' : 'Get OTP'}</button>
          </form>
        )}

        {mode === 'signup' && step === 'form' && (
          <form onSubmit={handleSignupSubmit} autoComplete="off" noValidate>
            <div className="flex flex-wrap gap-2 w-full">
              {/* Name - single row */}
              <div className="flex-1 min-w-[120px] text-left w-full">
                <label className="font-bold text-[#222] text-xs mb-0.5 block">Name <span className="text-[#991313]">*</span></label>
                <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className="border border-[#f0e3d1] rounded-lg bg-[#f9f7f6] px-3 py-2 w-full text-xs text-[#991313]" required />
              </div>
              {/* Gender & D.O.B - same row */}
              <div className="flex gap-2 w-full">
                <div className="flex-1 min-w-[80px] text-left">
                  <label className="font-bold text-[#222] text-xs mb-0.5 block">Gender <span className="text-[#991313]">*</span></label>
                  <select value={signupGender} onChange={e => setSignupGender(e.target.value)} className="border border-[#f0e3d1] rounded-lg bg-[#f9f7f6] px-3 py-2 w-full text-xs text-[#991313] outline-none" required><option value="">Select</option><option value="male">Male</option><option value="female">Female</option></select>
                </div>
                <div className="flex-1 min-w-[80px] text-left">
                  <label className="font-bold text-[#222] text-xs mb-0.5 block">D.O.B <span className="text-[#991313]">*</span></label>
                  <input type="date" value={signupDOB} onChange={e => setSignupDOB(e.target.value)} className="border border-[#f0e3d1] rounded-lg bg-[#f9f7f6] px-3 py-2 w-full text-xs text-[#991313] outline-none" required />
                </div>
              </div>
              {/* Email - single row */}
              <div className="flex-1 min-w-[120px] text-left w-full">
                <label className="font-bold text-[#222] text-xs mb-0.5 block">Email ID <span className="text-[#991313]">*</span></label>
                <input type="email" placeholder="Email address" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} className="border border-[#f0e3d1] rounded-lg bg-[#f9f7f6] px-3 py-2 w-full text-xs text-[#991313]" required />
              </div>
              {/*
              <div className="flex-1 min-w-[120px] text-left w-full">
                <label className="font-bold text-[#222] text-xs mb-0.5 block">Phone <span className="text-[#991313]">*</span></label>
                <PhoneInput className="phone-input-container" placeholder="Enter phone" value={fullPhoneNumber} onChange={setFullPhoneNumber} defaultCountry="IN" required />
              </div>
              */}
              {/* City & Town - same row */}
              <div className="flex gap-2 w-full">
                <div className="flex-1 min-w-[80px] text-left">
                  <label className="font-bold text-[#222] text-xs mb-0.5 block">City <span className="text-[#991313]">*</span></label>
                  <input type="text" placeholder="City" value={signupCity} onChange={e => setSignupCity(e.target.value)} className="border border-[#f0e3d1] rounded-lg bg-[#f9f7f6] px-3 py-2 w-full text-xs text-[#991313] outline-none" required />
                </div>
                <div className="flex-1 min-w-[80px] text-left">
                  <label className="font-bold text-[#222] text-xs mb-0.5 block">Town <span className="text-[#991313]">*</span></label>
                  <input type="text" placeholder="Town/Area" value={signupTown} onChange={e => setSignupTown(e.target.value)} className="border border-[#f0e3d1] rounded-lg bg-[#f9f7f6] px-3 py-2 w-full text-xs text-[#991313] outline-none" required />
                </div>
              </div>
              {/* State & Country - same row */}
              <div className="flex gap-2 w-full">
                <div className="flex-1 min-w-[80px] text-left">
                  <label className="font-bold text-[#222] text-xs mb-0.5 block">State <span className="text-[#991313]">*</span></label>
                  <input type="text" placeholder="State" value={signupState} onChange={e => setSignupState(e.target.value)} className="border border-[#f0e3d1] rounded-lg bg-[#f9f7f6] px-3 py-2 w-full text-xs text-[#991313] outline-none" required />
                </div>
                <div className="flex-1 min-w-[80px] text-left">
                  <label className="font-bold text-[#222] text-xs mb-0.5 block">Country <span className="text-[#991313]">*</span></label>
                  <input type="text" placeholder="Country" value={signupCountry} onChange={e => setSignupCountry(e.target.value)} className="border border-[#f0e3d1] rounded-lg bg-[#f9f7f6] px-3 py-2 w-full text-xs text-[#991313] outline-none" required />
                </div>
              </div>
              {/* Password & Confirm Password - same row */}
              <div className="flex gap-2 w-full">
                <div className="flex-1 min-w-[80px] text-left">
                  <label className="font-bold text-[#222] text-xs mb-0.5 block">Password <span className="text-[#991313]">*</span></label>
                  <input type="password" placeholder="Password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} className="border border-[#f0e3d1] rounded-lg bg-[#f9f7f6] px-3 py-2 w-full text-xs text-[#991313] outline-none" required />
                </div>
                <div className="flex-1 min-w-[80px] text-left">
                  <label className="font-bold text-[#222] text-xs mb-0.5 block">Confirm Password <span className="text-[#991313]">*</span></label>
                  <input type="password" placeholder="Confirm" value={signupConfirmPassword} onChange={e => setSignupConfirmPassword(e.target.value)} className="border border-[#f0e3d1] rounded-lg bg-[#f9f7f6] px-3 py-2 w-full text-xs text-[#991313] outline-none" required />
                </div>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-[#991313] text-white rounded-lg py-2 font-bold text-xs mt-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed">{isLoading ? 'Sending OTP...' : 'Register'}</button>
          </form>
        )}

        {step === 'otp' && (
          <div>
            <div className="font-bold text-[#991313] text-base mb-2">OTP sent to <span className="text-[#222]">{otpTargetIdentifier}</span></div>
            <div className="text-[#444] text-xs mb-3">Please enter the <b>6-digit OTP</b>.</div>
            <div className="flex justify-center gap-2 mb-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => { otpRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(idx, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(idx, e)}
                  className="w-8 h-8 text-base text-center border-2 border-[#991313] rounded-lg outline-none bg-[#f9f7f6] font-bold text-[#991313]"
                  autoFocus={idx === 0}
                  disabled={isLoading}
                />
              ))}
            </div>
            <button onClick={handleVerifyOtp} disabled={isLoading} className="w-full bg-[#991313] text-white rounded-lg py-2 font-bold text-xs mt-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed">{isLoading ? 'Verifying...' : 'Verify OTP'}</button>
            <div className="mt-2"><span onClick={isLoading ? undefined : handleResendOtp} className={`text-[#991313] font-medium cursor-pointer text-xs underline ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>Resend OTP</span></div>
          </div>
        )}

        <button onClick={handleClose} className="absolute top-2 right-3 bg-none border-none text-2xl text-[#991313] cursor-pointer font-bold" aria-label="Close" disabled={isLoading}>×</button>
        <style>{`
          @keyframes popup-fade-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        `}</style>
      </div>
    </div>
  );
};

export default PartnerPopup;