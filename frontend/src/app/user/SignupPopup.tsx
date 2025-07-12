import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "../../store";
import {
  sendRegistrationOtp,
  verifyOtpAndRegister,
  resendOtp,
  sendLoginOtp,
  verifyLoginOtp
} from "../features/thunks/authThunks";
import { clearAuthError } from "../features/slices/authSlice";


import PhoneInput, { isValidPhoneNumber, isPossiblePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import parsePhoneNumber from 'libphonenumber-js';

interface SignupPopupProps {
  open: boolean;
  onClose: () => void;
}

const SignupPopup: React.FC<SignupPopupProps> = ({ open, onClose }) => {
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
    if (currentUser && status === 'succeeded') {

      if (mode === 'login') {
        if (currentUser.role === 'ADMIN') {
          navigate("/admin");
        } else {
          navigate("/user");
        }
        onClose();
      }
    }
  }, [currentUser, status, navigate, onClose, mode]);

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
    if (value && idx < 5) {
      otpRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
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
    setSignupCity("");
    setSignupTown("");
    setSignupState("");
    setSignupCountry("");
    setSignupEmail("");
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

    if (!fullPhoneNumber || !isValidPhoneNumber(fullPhoneNumber)) {
      setValidationError("Please enter a valid phone number.");
      return;
    }
    if (!name.trim() || !signupGender || !signupDOB || !signupEmail.trim() || !signupCity.trim() || !signupTown.trim() || !signupState.trim() || !signupCountry.trim() || !signupPassword || !signupConfirmPassword) {
      setValidationError("Please fill all required fields.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(signupEmail)) {
      setValidationError("Please enter a valid email address.");
      return;
    }
    if (signupPassword.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    setValidationError(null);
    dispatch(clearAuthError());

    const phoneNumber = parsePhoneNumber(fullPhoneNumber);
    if (!phoneNumber) {
      setValidationError("Invalid phone number format.");
      return;
    }

    dispatch(sendRegistrationOtp({
      fullName: name,
      gender: signupGender,
      dob: signupDOB,
      email: signupEmail,
      mobile: phoneNumber.nationalNumber,
      countryCode: `+${phoneNumber.countryCallingCode}`,
      city: signupCity,
      town: signupTown,
      state: signupState,
      country: signupCountry,
      password: signupPassword,
    })).then(result => {
      if (sendRegistrationOtp.fulfilled.match(result)) {
        setStep("otp");
      }
    });
  };

  const handleVerifyOtp = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setValidationError("Please enter the complete 6-digit OTP.");
      return;
    }
    setValidationError(null);
    dispatch(clearAuthError());

    if (mode === 'login') {
      dispatch(verifyLoginOtp({ identifier: loginIdentifier, otp: fullOtp }));
    } else {
      const phoneNumber = parsePhoneNumber(fullPhoneNumber || '');
      if (!phoneNumber) {
        setValidationError("Invalid phone number format.");
        return;
      }
      try {
        await dispatch(verifyOtpAndRegister({
          email: signupEmail,
          otp: fullOtp,
          fullName: name,
          gender: signupGender,
          dob: signupDOB,
          mobile: phoneNumber.nationalNumber,
          countryCode: `+${phoneNumber.countryCallingCode}`,
          city: signupCity,
          town: signupTown,
          state: signupState,
          country: signupCountry,
          password: signupPassword,
        })).unwrap();


        alert("Registration successful! Please log in.");
        switchMode("login");

      } catch (rejectedValue) {
        setValidationError(rejectedValue as string);
      }
    }
  };

  const handleResendOtp = () => {
    const identifier = mode === 'login' ? loginIdentifier : signupEmail;
    if (identifier) {
      dispatch(resendOtp({ email: identifier }));
    }
  };

  const handleClose = () => {
    onClose();
    navigate("/");
  };

  if (!open) return null;

  const isLoading = status === 'loading';
  const otpTargetIdentifier = mode === 'login' ? loginIdentifier : signupEmail;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.38)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 32, maxWidth: 800, width: "98vw", padding: "32px 24px 24px 24px", boxShadow: "0 8px 32px #00000022", position: "relative", textAlign: "center", animation: "popup-fade-in 0.25s cubic-bezier(.4,0,.2,1)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
          <img src="/logo.png" alt="Logo" style={{ height: 44, marginBottom: 8 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, gap: 6 }}>
          <button style={{ background: mode === "login" ? "#991313" : "#fff", color: mode === "login" ? "#fff" : "#991313", border: "1.5px solid #991313", borderRadius: 8, fontWeight: 700, fontSize: 16, padding: "7px 20px", cursor: "pointer", transition: "all 0.18s" }} onClick={() => switchMode("login")} disabled={isLoading}>Login</button>
          <button style={{ background: mode === "signup" ? "#991313" : "#fff", color: mode === "signup" ? "#fff" : "#991313", border: "1.5px solid #991313", borderRadius: 8, fontWeight: 700, fontSize: 16, padding: "7px 20px", cursor: "pointer", transition: "all 0.18s" }} onClick={() => switchMode("signup")} disabled={isLoading}>Sign Up</button>
        </div>
        <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 8, color: "#991313", textAlign: "center" }}>
          {mode === "login" ? (step === "form" ? "Login with OTP" : "Verify your OTP") : (step === "form" ? "Create your account" : "Verify your Email")}
        </h2>
        <div style={{ borderBottom: "2px solid #991313", width: 60, margin: "0 auto 18px auto", opacity: 0.7 }} />

        {(authError || validationError) && (<div style={{ color: "#991313", fontWeight: 600, marginBottom: 10, padding: "8px", background: "#f9e9c7", borderRadius: "8px" }}>{authError || validationError}</div>)}

        {mode === "login" && step === "form" && (
          <form style={{ marginTop: 0 }} onSubmit={handleSendLoginOtp} autoComplete="off">
            <div style={{ textAlign: "left", marginBottom: 12 }}>
              <label style={{ fontWeight: 700, color: "#222", fontSize: 15, marginBottom: 4, display: "block" }}>
                Email / Phone Number <span style={{ color: "#991313" }}>*</span>
              </label>
              <div style={{ display: "flex", alignItems: "center" }}>
                {!isLoginInputEmail && (
                  <select value={loginCountryCode} onChange={e => setLoginCountryCode(e.target.value)} style={{ border: "1.5px solid #f0e3d1", borderRight: 'none', borderRadius: '10px 0 0 10px', background: "#f9f7f6", padding: "10px 12px", fontSize: 15, color: "#991313", outline: "none", boxShadow: "0 1px 4px #f9e9c7" }}>
                    <option value="+91">+91 (India)</option>
                    <option value="+1">+1 (USA/Canada)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+61">+61 (Australia)</option>
                    <option value="+81">+81 (Japan)</option>
                    <option value="+49">+49 (Germany)</option>
                    <option value="+33">+33 (France)</option>
                    <option value="+39">+39 (Italy)</option>
                    <option value="+86">+86 (China)</option>
                    <option value="+971">+971 (UAE)</option>
                    <option value="+880">+880 (Bangladesh)</option>
                    <option value="+92">+92 (Pakistan)</option>
                    <option value="+7">+7 (Russia)</option>
                    <option value="+82">+82 (South Korea)</option>
                    <option value="+966">+966 (Saudi Arabia)</option>
                    <option value="+94">+94 (Sri Lanka)</option>
                    <option value="+27">+27 (South Africa)</option>
                    <option value="+34">+34 (Spain)</option>
                    <option value="+62">+62 (Indonesia)</option>
                    <option value="+63">+63 (Philippines)</option>
                  </select>
                )}
                <input
                  type="text"
                  placeholder="Enter email or phone"
                  value={loginIdentifier}
                  onChange={e => setLoginIdentifier(e.target.value)}
                  style={{
                    border: "1.5px solid #f0e3d1",
                    borderRadius: isLoginInputEmail ? '10px' : '0 10px 10px 0',
                    background: "#f9f7f6",
                    padding: "10px 14px",
                    width: "100%",
                    fontSize: 15,
                    fontWeight: 500,
                    color: "#991313",
                    outline: "none",
                    boxShadow: "0 1px 4px #f9e9c7"
                  }}
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={isLoading} style={{ width: "100%", background: "linear-gradient(90deg, #991313 70%, #bf7e1a 100%)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 0", fontWeight: 700, fontSize: 17, marginTop: 6, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}>{isLoading ? "Sending OTP..." : "Get OTP"}</button>
          </form>
        )}

        {mode === "signup" && step === "form" && (
          <form style={{ marginTop: 0, width: "100%" }} onSubmit={handleSignupSubmit} autoComplete="off" noValidate>
            <div className="signup-fields-row" style={{ display: "flex", flexWrap: "wrap", gap: 16, width: "100%" }}>
              <div style={{ flex: "1 1 45%", minWidth: 180, textAlign: "left" }}>
                <label style={{ fontWeight: 700, color: "#222", fontSize: 15, marginBottom: 4, display: "block" }}>Name <span style={{ color: "#991313" }}>*</span></label>
                <input type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} style={{ border: "1.5px solid #f0e3d1", borderRadius: 10, background: "#f9f7f6", padding: "10px 14px", width: "100%", fontSize: 15, fontWeight: 500, color: "#991313", outline: "none" }} required />
              </div>
              <div style={{ flex: "1 1 45%", minWidth: 180, textAlign: "left" }}>
                <label style={{ fontWeight: 700, color: "#222", fontSize: 15, marginBottom: 4, display: "block" }}>Gender <span style={{ color: "#991313" }}>*</span></label>
                <select value={signupGender} onChange={e => setSignupGender(e.target.value)} style={{ border: "1.5px solid #f0e3d1", borderRadius: 10, background: "#f9f7f6", padding: "10px 14px", width: "100%", fontSize: 15, fontWeight: 500, color: "#991313", outline: "none" }} required><option value="">Select Gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select>
              </div>
              <div style={{ flex: "1 1 45%", minWidth: 180, textAlign: "left" }}>
                <label style={{ fontWeight: 700, color: "#222", fontSize: 15, marginBottom: 4, display: "block" }}>D.O.B <span style={{ color: "#991313" }}>*</span></label>
                <input type="date" value={signupDOB} onChange={e => setSignupDOB(e.target.value)} style={{ border: "1.5px solid #f0e3d1", borderRadius: 10, background: "#f9f7f6", padding: "10px 14px", width: "100%", fontSize: 15, fontWeight: 500, color: "#991313", outline: "none" }} required />
              </div>
              <div style={{ flex: "1 1 45%", minWidth: 180, textAlign: "left" }}>
                <label style={{ fontWeight: 700, color: "#222", fontSize: 15, marginBottom: 4, display: "block" }}>Email ID <span style={{ color: "#991313" }}>*</span></label>
                <input type="email" placeholder="Enter your email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} style={{ border: "1.5px solid #f0e3d1", borderRadius: 10, background: "#f9f7f6", padding: "10px 14px", width: "100%", fontSize: 15, fontWeight: 500, color: "#991313", outline: "none" }} required />
              </div>
              <div style={{ flex: "1 1 45%", minWidth: 180, textAlign: "left" }}>
                <label style={{ fontWeight: 700, color: "#222", fontSize: 15, marginBottom: 4, display: "block" }}>Phone Number <span style={{ color: "#991313" }}>*</span></label>
                <PhoneInput className="phone-input-container" placeholder="Enter phone number" value={fullPhoneNumber} onChange={setFullPhoneNumber} defaultCountry="IN" required />
              </div>
              <div style={{ flex: "1 1 45%", minWidth: 180, textAlign: "left" }}>
                <label style={{ fontWeight: 700, color: "#222", fontSize: 15, marginBottom: 4, display: "block" }}>City <span style={{ color: "#991313" }}>*</span></label>
                <input type="text" placeholder="Enter your city" value={signupCity} onChange={e => setSignupCity(e.target.value)} style={{ border: "1.5px solid #f0e3d1", borderRadius: 10, background: "#f9f7f6", padding: "10px 14px", width: "100%", fontSize: 15, fontWeight: 500, color: "#991313", outline: "none" }} required />
              </div>
              <div style={{ flex: "1 1 45%", minWidth: 180, textAlign: "left" }}>
                <label style={{ fontWeight: 700, color: "#222", fontSize: 15, marginBottom: 4, display: "block" }}>Town <span style={{ color: "#991313" }}>*</span></label>
                <input type="text" placeholder="Enter your town" value={signupTown} onChange={e => setSignupTown(e.target.value)} style={{ border: "1.5px solid #f0e3d1", borderRadius: 10, background: "#f9f7f6", padding: "10px 14px", width: "100%", fontSize: 15, fontWeight: 500, color: "#991313", outline: "none" }} required />
              </div>
              <div style={{ flex: "1 1 45%", minWidth: 180, textAlign: "left" }}>
                <label style={{ fontWeight: 700, color: "#222", fontSize: 15, marginBottom: 4, display: "block" }}>State <span style={{ color: "#991313" }}>*</span></label>
                <input type="text" placeholder="Enter your state" value={signupState} onChange={e => setSignupState(e.target.value)} style={{ border: "1.5px solid #f0e3d1", borderRadius: 10, background: "#f9f7f6", padding: "10px 14px", width: "100%", fontSize: 15, fontWeight: 500, color: "#991313", outline: "none" }} required />
              </div>
              <div style={{ flex: "1 1 45%", minWidth: 180, textAlign: "left" }}>
                <label style={{ fontWeight: 700, color: "#222", fontSize: 15, marginBottom: 4, display: "block" }}>Country <span style={{ color: "#991313" }}>*</span></label>
                <input type="text" placeholder="Enter your country" value={signupCountry} onChange={e => setSignupCountry(e.target.value)} style={{ border: "1.5px solid #f0e3d1", borderRadius: 10, background: "#f9f7f6", padding: "10px 14px", width: "100%", fontSize: 15, fontWeight: 500, color: "#991313", outline: "none" }} required />
              </div>
              <div style={{ flex: "1 1 45%", minWidth: 180, textAlign: "left" }}>
                <label style={{ fontWeight: 700, color: "#222", fontSize: 15, marginBottom: 4, display: "block" }}>Password <span style={{ color: "#991313" }}>*</span></label>
                <input type="password" placeholder="Enter password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} style={{ border: "1.5px solid #f0e3d1", borderRadius: 10, background: "#f9f7f6", padding: "10px 14px", width: "100%", fontSize: 15, fontWeight: 500, color: "#991313", outline: "none" }} required />
              </div>
              <div style={{ flex: "1 1 45%", minWidth: 180, textAlign: "left" }}>
                <label style={{ fontWeight: 700, color: "#222", fontSize: 15, marginBottom: 4, display: "block" }}>Confirm Password <span style={{ color: "#991313" }}>*</span></label>
                <input type="password" placeholder="Confirm password" value={signupConfirmPassword} onChange={e => setSignupConfirmPassword(e.target.value)} style={{ border: "1.5px solid #f0e3d1", borderRadius: 10, background: "#f9f7f6", padding: "10px 14px", width: "100%", fontSize: 15, fontWeight: 500, color: "#991313", outline: "none" }} required />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", margin: "12px 0 12px 0" }}>
              <input type="checkbox" id="agree_signup" style={{ marginRight: 8, width: 16, height: 16, accentColor: "#991313" }} required />
              <label htmlFor="agree_signup" style={{ fontSize: 14, color: "#222", fontWeight: 500 }}>I agree to <span style={{ color: "#991313", textDecoration: "underline", cursor: "pointer" }}>Terms and Condition</span> and <span style={{ color: "#991313", textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span></label>
            </div>
            <button type="submit" disabled={isLoading} style={{ width: "100%", background: "linear-gradient(90deg, #991313 70%, #bf7e1a 100%)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 0", fontWeight: 700, fontSize: 17, marginTop: 6, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}>{isLoading ? "Sending OTP..." : "Get OTP"}</button>
          </form>
        )}

        {step === "otp" && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 20, color: "#991313", marginBottom: 10 }}>OTP sent to <span style={{ color: "#222" }}>{otpTargetIdentifier}</span></div>
            <div style={{ color: "#444", fontSize: 15, marginBottom: 18 }}>Please enter the <b>6-digit OTP</b> sent to your email or phone.</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 18, marginBottom: 18 }}>
              {[0, 1, 2, 3, 4, 5].map(idx => (<input key={idx} ref={el => { otpRefs.current[idx] = el as HTMLInputElement | null; }} type="text" inputMode="numeric" maxLength={1} value={otp[idx]} onChange={e => handleOtpChange(idx, e.target.value)} onKeyDown={e => handleOtpKeyDown(idx, e)} style={{ width: 48, height: 48, fontSize: 28, textAlign: "center", border: "2px solid #991313", borderRadius: 10, outline: "none", background: "#f9f7f6", fontWeight: 700, color: "#991313" }} autoFocus={idx === 0} disabled={isLoading} />))}
            </div>
            <button onClick={handleVerifyOtp} disabled={isLoading} style={{ width: "100%", background: "linear-gradient(90deg, #991313 70%, #bf7e1a 100%)", color: "#fff", border: "none", borderRadius: 14, padding: "14px 0", fontWeight: 700, fontSize: 20, marginTop: 8, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1 }}>{isLoading ? "Verifying..." : "Verify OTP"}</button>
            <div style={{ marginTop: 18 }}><span onClick={isLoading ? undefined : handleResendOtp} style={{ color: "#991313", fontWeight: 500, cursor: isLoading ? "not-allowed" : "pointer", fontSize: 15, textDecoration: "underline", opacity: isLoading ? 0.7 : 1 }}>Resend OTP</span></div>
          </div>
        )}

        <button onClick={handleClose} style={{ position: "absolute", top: 14, right: 18, background: "none", border: "none", fontSize: 28, color: "#991313", cursor: "pointer", fontWeight: 700 }} aria-label="Close" disabled={isLoading}>×</button>
        <style>{`
            @keyframes popup-fade-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
            .phone-input-container .PhoneInputInput, .phone-input-container .PhoneInputCountrySelect {
                border: 1.5px solid #f0e3d1;
                background: #f9f7f6;
                color: #991313;
                outline: none;
                box-shadow: 0 1px 4px #f9e9c7;
                transition: border 0.2s, background 0.2s;
            }
            .phone-input-container .PhoneInputInput {
                padding: 10px 14px;
                font-size: 15px;
                font-weight: 500;
                border-radius: 10px;
            }
            .phone-input-container .PhoneInputCountry {
                margin: 0 5px;
            }
            .phone-input-container--focus .PhoneInputInput, .phone-input-container--focus .PhoneInputCountrySelect,
            .phone-input-container:focus-within .PhoneInputInput, .phone-input-container:focus-within .PhoneInputCountrySelect {
                border-color: #bf7e1a !important;
                background: #fffbe8 !important;
            }
            .signup-fields-row { flex-wrap: wrap; }
            @media (max-width: 900px) { .signup-fields-row { flex-direction: column !important; gap: 8px !important; } }
            @media (max-width: 600px) { .signup-fields-row > div { min-width: 100% !important; } }
        `}</style>
      </div>
    </div>
  );
};

export default SignupPopup;