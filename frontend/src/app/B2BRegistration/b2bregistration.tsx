import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, User, Mail, Phone, MapPin, Lock, Calendar, Shield, Building, Globe, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sendRegistrationOtp, verifyOtpAndRegister, resendOtp } from '../features/thunks/authThunks';
import { clearAuthError } from '../features/slices/authSlice';

import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import parsePhoneNumber from 'libphonenumber-js';
import { AppDispatch, RootState } from '../../store';

const B2BRegistration: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { status, error: authError } = useSelector((state: RootState) => state.auth);

  const [step, setStep] = useState<'form' | 'otp'>("form");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    email: '',
    fullPhoneNumber: undefined as string | undefined,
    city: '',
    town: '',
    state: '',
    country: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isLoading = status === 'loading';

  useEffect(() => {
    // Clear auth errors on component unmount
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAuthError());
    setValidationError(null);

    // --- Client-side Validation ---
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.dob || !formData.gender || !formData.email.trim() || !formData.city.trim() || !formData.town.trim() || !formData.state.trim() || !formData.country.trim() || !formData.password || !formData.confirmPassword) {
      setValidationError("Please fill all required fields.");
      return;
    }
    if (!formData.fullPhoneNumber || !isValidPhoneNumber(formData.fullPhoneNumber)) {
      setValidationError("Please enter a valid phone number.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setValidationError("Please enter a valid email address.");
      return;
    }
    const age = new Date().getFullYear() - new Date(formData.dob).getFullYear();
    if (age < 18) {
        setValidationError('You must be at least 18 years old to register.');
        return;
    }
    if (formData.password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }
    if (!formData.terms) {
      setValidationError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    const phoneNumber = parsePhoneNumber(formData.fullPhoneNumber);
    if (!phoneNumber) {
      setValidationError("Invalid phone number format.");
      return;
    }

    dispatch(sendRegistrationOtp({
      fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      gender: formData.gender,
      dob: formData.dob,
      email: formData.email,
      mobile: phoneNumber.nationalNumber,
      countryCode: `+${phoneNumber.countryCallingCode}`,
      city: formData.city,
      town: formData.town,
      state: formData.state,
      country: formData.country,
      password: formData.password,
      role: 'B2B' // Hardcoded role for B2B registration
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

    const phoneNumber = parsePhoneNumber(formData.fullPhoneNumber || '');
    if (!phoneNumber) {
      setValidationError("Invalid phone number format.");
      return;
    }

    try {
      await dispatch(verifyOtpAndRegister({
        email: formData.email,
        otp: fullOtp,
        fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        gender: formData.gender,
        dob: formData.dob,
        mobile: phoneNumber.nationalNumber,
        countryCode: `+${phoneNumber.countryCallingCode}`,
        city: formData.city,
        town: formData.town,
        state: formData.state,
        country: formData.country,
        password: formData.password,
        role: 'B2B'
      })).unwrap();

      alert("B2B registration successful! Please log in to continue.");
      navigate("/SignupPopup"); // Redirect as requested

    } catch (rejectedValue) {
      setValidationError(rejectedValue as string);
    }
  };

  const handleResendOtp = () => {
    if (formData.email) {
      dispatch(resendOtp({ email: formData.email }));
    }
  };

  const FormView = (
    <form onSubmit={handleSignupSubmit} className="p-8">
      <div className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField icon={User} name="firstName" label="First Name" value={formData.firstName} onChange={handleInputChange} placeholder="Enter first name" />
          <InputField icon={User} name="lastName" label="Last Name" value={formData.lastName} onChange={handleInputChange} placeholder="Enter last name" />
        </div>
        {/* DOB and Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField icon={Calendar} name="dob" label="Date of Birth" type="date" value={formData.dob} onChange={handleInputChange} />
          <SelectField icon={User} name="gender" label="Gender" value={formData.gender} onChange={handleInputChange} options={[{value: '', label: 'Select Gender'}, {value: 'male', label: 'Male'}, {value: 'female', label: 'Female'}, {value: 'other', label: 'Other'}]} />
        </div>
        {/* Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField icon={Mail} name="email" label="Email Address" type="email" value={formData.email} onChange={handleInputChange} placeholder="Enter email address" />
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Phone className="inline w-4 h-4 mr-1" /> Mobile Number <span className="text-red-500">*</span>
              </label>
              <PhoneInput
                  className="phone-input-b2b"
                  placeholder="Enter phone number"
                  value={formData.fullPhoneNumber}
                  onChange={(value) => setFormData(p => ({...p, fullPhoneNumber: value}))}
                  defaultCountry="IN"
              />
            </div>
        </div>
        {/* Location Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField icon={Building} name="city" label="City" value={formData.city} onChange={handleInputChange} placeholder="Enter your city"/>
          <InputField icon={MapPin} name="town" label="Town/Area" value={formData.town} onChange={handleInputChange} placeholder="Enter your town or area"/>
          <InputField icon={Map} name="state" label="State" value={formData.state} onChange={handleInputChange} placeholder="Enter your state"/>
          <InputField icon={Globe} name="country" label="Country" value={formData.country} onChange={handleInputChange} placeholder="Enter your country"/>
        </div>
        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PasswordField label="Password" name="password" value={formData.password} onChange={handleInputChange} show={showPassword} toggleShow={() => setShowPassword(!showPassword)} />
          <PasswordField label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} show={showConfirmPassword} toggleShow={() => setShowConfirmPassword(!showConfirmPassword)} />
        </div>
        {/* Terms and Submit */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <input type="checkbox" name="terms" checked={formData.terms} onChange={handleInputChange} className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500 mt-0.5" />
            <label className="text-sm text-slate-700 cursor-pointer">
              I agree to the <a href="#" className="text-amber-600 font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-amber-600 font-semibold hover:underline">Privacy Policy</a>
            </label>
          </div>
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-800 font-bold py-4 px-6 rounded-xl hover:from-amber-500 hover:to-yellow-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide disabled:opacity-70 disabled:cursor-not-allowed">
          {isLoading ? 'Sending OTP...' : 'Get OTP & Create Account'}
        </button>
      </div>
      <div className="mt-8 pt-6 border-t border-slate-200 text-center">
        <p className="text-slate-600">
          Already have an account?{' '}
          <span onClick={() => navigate('/SignupPopup')} className="text-amber-600 font-semibold hover:underline cursor-pointer">
            Sign In
          </span>
        </p>
      </div>
    </form>
  );

  const OtpView = (
    <div className="p-8 text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Verify Your Account</h3>
        <p className="text-slate-600 mb-2">
            An OTP has been sent to your email <strong className="text-slate-800">{formData.email}</strong>
        </p>
        <p className="text-slate-500 text-sm mb-6">Please enter the 6-digit code to continue.</p>

        <div className="flex justify-center gap-3 md:gap-4 mb-6">
            {[0, 1, 2, 3, 4, 5].map(idx => (
                <input
                    key={idx}
                    ref={el => { otpRefs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[idx]}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                    className="w-12 h-14 md:w-14 md:h-16 text-2xl md:text-3xl text-center font-bold text-slate-800 bg-slate-100 border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all"
                    autoFocus={idx === 0}
                    disabled={isLoading}
                />
            ))}
        </div>

        <button onClick={handleVerifyOtp} disabled={isLoading} className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-800 font-bold py-4 px-6 rounded-xl hover:from-amber-500 hover:to-yellow-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl uppercase tracking-wide disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoading ? "Verifying..." : "Verify & Register"}
        </button>

        <div className="mt-6">
            <span onClick={isLoading ? undefined : handleResendOtp} className={`text-amber-600 font-semibold ${isLoading ? 'opacity-50' : 'cursor-pointer hover:underline'}`}>
                Resend OTP
            </span>
        </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-100 flex items-center justify-center p-4">
       <style>{`
            .phone-input-b2b .PhoneInputInput {
                width: 100%;
                padding: 0.75rem 1rem;
                border: 2px solid #e2e8f0; /* slate-200 */
                border-radius: 0.75rem; /* rounded-xl */
                transition: all 0.3s;
            }
            .phone-input-b2b .PhoneInputInput:hover {
                border-color: #cbd5e1; /* slate-300 */
            }
            .phone-input-b2b .PhoneInputInput:focus {
                border-color: #f59e0b; /* amber-400 */
                outline: 2px solid transparent;
                outline-offset: 2px;
                --tw-ring-color: rgba(245, 158, 11, 0.2);
                box-shadow: 0 0 0 2px var(--tw-ring-color);
            }
            .phone-input-b2b .PhoneInputCountry {
                margin: 0 8px 0 4px;
            }
       `}</style>
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-400 to-yellow-500 px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                    <Shield className="w-8 h-8 text-slate-800" />
                </div>
                <h1 className="text-4xl font-bold text-slate-800 mb-2">B2B Registration</h1>
                <p className="text-slate-700 text-lg">Join our exclusive gold trading network</p>
            </div>
        </div>
        
        {(authError || validationError) && (
            <div className="m-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
                <p className="font-bold">Error</p>
                <p>{authError || validationError}</p>
            </div>
        )}

        {step === 'form' ? FormView : OtpView}
      </div>
    </div>
  );
};


// Helper components with TypeScript props defined
// --- FIX STARTS HERE ---

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ElementType;
  label: string;
};

const InputField: React.FC<InputFieldProps> = ({ icon: Icon, label, ...props }) => (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        <Icon className="inline w-4 h-4 mr-1" /> {label} <span className="text-red-500">*</span>
      </label>
      <input {...props} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all duration-300 hover:border-slate-300" />
    </div>
);

type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    icon: React.ElementType;
    label: string;
    options: { value: string; label: string }[];
};

const SelectField: React.FC<SelectFieldProps> = ({ icon: Icon, label, options, ...props }) => (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        <Icon className="inline w-4 h-4 mr-1" /> {label} <span className="text-red-500">*</span>
      </label>
      <select {...props} className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all duration-300 hover:border-slate-300">
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
);

type PasswordFieldProps = {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    show: boolean;
    toggleShow: () => void;
};

const PasswordField: React.FC<PasswordFieldProps> = ({ label, name, value, onChange, show, toggleShow }) => (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        <Lock className="inline w-4 h-4 mr-1" /> {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input type={show ? 'text' : 'password'} name={name} value={value} onChange={onChange} placeholder={`Enter ${label.toLowerCase()}`} className="w-full px-4 py-3 pr-12 border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all duration-300 hover:border-slate-300" />
        <button type="button" onClick={toggleShow} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-amber-500 transition-colors">
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
);
// --- FIX ENDS HERE ---

export default B2BRegistration;