import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { B2B_PRIMARY } from "../theme";
import { Loader, UploadCloud, CheckCircle } from "lucide-react";

// Types
type ProfileForm = {
  companyName: string;
  gstin: string;
  pan: string;
  address: string;
  bankAccount: string;
  upi: string;
  teamEmail: string;
};

type KycFiles = {
  aadharOrGst: File | null;
  pan: File | null;
  addressProof: File | null;
  bankStatement: File | null;
};

// Initial States
const initialForm: ProfileForm = {
  companyName: "", gstin: "", pan: "", address: "",
  bankAccount: "", upi: "", teamEmail: "",
};

const initialKycFiles: KycFiles = {
  aadharOrGst: null, pan: null, addressProof: null, bankStatement: null,
};


export default function Profile() {
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [kycFiles, setKycFiles] = useState<KycFiles>(initialKycFiles);
  
  const [errors, setErrors] = useState<Partial<ProfileForm>>({});
  const [kycErrors, setKycErrors] = useState<Partial<Record<keyof KycFiles, string>>>({});
  
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingKyc, setIsSubmittingKyc] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get('/api/b2b/profile');
        if (response.data) {
          setForm(response.data);
          setHasProfile(true);
        }
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          setHasProfile(false);
        } else {
          console.error("Failed to fetch profile", error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- Profile Form Logic ---
  const validateProfile = (values: ProfileForm) => {
    const errs: Partial<ProfileForm> = {};
    if (!values.companyName) errs.companyName = "Company Name is required";
    if (!values.gstin) errs.gstin = "GSTIN is required";
    else if (!/^[0-9A-Z]{15}$/.test(values.gstin)) errs.gstin = "Invalid GSTIN";
    if (!values.pan) errs.pan = "PAN is required";
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(values.pan)) errs.pan = "Invalid PAN";
    if (!values.address) errs.address = "Business Address is required";
    if (!values.bankAccount) errs.bankAccount = "Bank Account is required";
    if (!values.upi) errs.upi = "UPI ID is required";
    else if (!/^[\w.-]+@[\w.-]+$/.test(values.upi)) errs.upi = "Invalid UPI ID";
    if (!values.teamEmail) errs.teamEmail = "Team Member Email is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(values.teamEmail)) errs.teamEmail = "Invalid Email";
    return errs;
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof ProfileForm]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateProfile(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmittingProfile(true);
    try {
      if (hasProfile) {
        // Update existing profile
        await axiosInstance.put('/api/b2b/profile', form);
      } else {
        // Create new profile
        const response = await axiosInstance.post('/api/b2b/profile', form);
        setForm(response.data);
        setHasProfile(true);
      }
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2500);
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("An error occurred while saving your profile.");
    } finally {
      setIsSubmittingProfile(false);
    }
  };


  // --- KYC Form Logic ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setKycFiles(prev => ({ ...prev, [name]: files[0] }));
      setKycErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const fileErrors: Partial<Record<keyof KycFiles, string>> = {};
    if (!kycFiles.aadharOrGst) fileErrors.aadharOrGst = "File is required";
    if (!kycFiles.pan) fileErrors.pan = "File is required";
    if (!kycFiles.addressProof) fileErrors.addressProof = "File is required";
    if (!kycFiles.bankStatement) fileErrors.bankStatement = "File is required";
    
    setKycErrors(fileErrors);
    if (Object.keys(fileErrors).length > 0) return;

    const formData = new FormData();
    Object.entries(kycFiles).forEach(([key, value]) => {
        if (value) {
            formData.append(key, value);
        }
    });

    setIsSubmittingKyc(true);
    try {
        await axiosInstance.post('/api/kyc/b2b', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        setKycFiles(initialKycFiles);
    } catch(error) {
        console.error("KYC submission failed", error);
        alert("An error occurred during KYC submission.");
    } finally {
        setIsSubmittingKyc(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-12 w-12" color={B2B_PRIMARY} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Basic Company Details Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: B2B_PRIMARY }}>
          🏢 Basic Company Details
        </h3>
        {!hasProfile && (
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 rounded-r-lg">
                <p className="font-bold">Welcome!</p>
                <p>Please create your B2B profile to get started.</p>
            </div>
        )}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleProfileSubmit} autoComplete="off">
          {/* Form fields */}
          <InputField label="Company Name" name="companyName" value={form.companyName} onChange={handleProfileChange} error={errors.companyName} />
          <InputField label="GSTIN" name="gstin" value={form.gstin} onChange={handleProfileChange} error={errors.gstin} maxLength={15} upperCase />
          <InputField label="PAN" name="pan" value={form.pan} onChange={handleProfileChange} error={errors.pan} maxLength={10} upperCase />
          <InputField label="Business Address" name="address" value={form.address} onChange={handleProfileChange} error={errors.address} />
          <InputField label="Bank Account" name="bankAccount" value={form.bankAccount} onChange={handleProfileChange} error={errors.bankAccount} />
          <InputField label="UPI ID" name="upi" value={form.upi} onChange={handleProfileChange} error={errors.upi} />
          <InputField label="Team Member Email" name="teamEmail" value={form.teamEmail} onChange={handleProfileChange} error={errors.teamEmail} />
          
          <div className="flex items-center">
            <button
              type="submit"
              disabled={isSubmittingProfile}
              className="w-full py-2 rounded font-semibold text-white transition-all duration-200 shadow disabled:bg-gray-400 flex items-center justify-center gap-2"
              style={{ background: isSubmittingProfile ? undefined : B2B_PRIMARY }}
            >
              {isSubmittingProfile ? <Loader className="animate-spin" /> : '💾'}
              {hasProfile ? 'Save Profile' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* KYC Documents Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: B2B_PRIMARY }}>
          📄 KYC Documents
        </h3>
        <form className="space-y-4" onSubmit={handleKycSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileUploadField label="Aadhaar / GST Certificate" name="aadharOrGst" file={kycFiles.aadharOrGst} onChange={handleFileChange} error={kycErrors.aadharOrGst} />
            <FileUploadField label="PAN Card" name="pan" file={kycFiles.pan} onChange={handleFileChange} error={kycErrors.pan} />
            <FileUploadField label="Company Address Proof" name="addressProof" file={kycFiles.addressProof} onChange={handleFileChange} error={kycErrors.addressProof} />
            <FileUploadField label="Bank Statement" name="bankStatement" file={kycFiles.bankStatement} onChange={handleFileChange} error={kycErrors.bankStatement} />
          </div>
          <button
            type="submit"
            disabled={isSubmittingKyc}
            className="py-2 px-6 rounded font-semibold text-white transition-all duration-200 shadow disabled:bg-gray-400 flex items-center justify-center gap-2"
            style={{ background: isSubmittingKyc ? undefined : B2B_PRIMARY }}
          >
            {isSubmittingKyc ? <Loader className="animate-spin" /> : <UploadCloud size={20} />}
            Submit KYC Documents
          </button>
        </form>
      </div>
      
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-5 right-5 z-50 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 animate-fade-in-out border-l-4 border-green-500">
            <CheckCircle className="text-green-500" size={24} />
            <span className="text-green-700 font-semibold">Profile saved successfully!</span>
        </div>
      )}
    </div>
  );
}

// Helper Components
const InputField = ({ label, name, value, onChange, error, upperCase = false, ...props }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      className={`border rounded px-3 py-2 w-full transition-colors ${error ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-[${B2B_PRIMARY}] focus:ring-1 focus:ring-[${B2B_PRIMARY}]"}`}
      name={name}
      value={value}
      onChange={(e) => {
        if (upperCase) e.target.value = e.target.value.toUpperCase();
        onChange(e);
      }}
      {...props}
    />
    {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
  </div>
);

const FileUploadField = ({ label, name, file, onChange, error }: any) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className={`relative border-2 ${error ? 'border-red-500' : 'border-gray-300'} border-dashed rounded-lg p-4 text-center`}>
            <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-1 text-sm text-gray-600">
                {file ? (
                    <span className="font-semibold text-green-600">{file.name}</span>
                ) : (
                    "Click to upload or drag & drop"
                )}
            </p>
            <input
                type="file"
                name={name}
                onChange={onChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*,.pdf"
            />
        </div>
        {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
);