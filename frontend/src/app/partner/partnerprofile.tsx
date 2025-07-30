import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance"; // Ensure this path is correct
import { FaUser, FaIdCard, FaUniversity, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaUpload, FaSpinner, FaFilePdf, FaSave, FaTrash } from "react-icons/fa";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

// --- Type Definitions ---
type KycStatus = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
type NotificationType = 'success' | 'error';

interface ProfileData { name: string; email: string; countryCode: string; phone: string; }
// Updated to reflect the array structure from the API
interface BankDetail { id: number; bank: string; account: string; ifsc: string; upiId: string; }
interface KycData { status: KycStatus; aadharOrGstUrl?: string; panUrl?: string; rejectionReason?: string; }
interface NotificationState { show: boolean; message: string; type: NotificationType; }

// --- Initial State ---
const initialProfile: ProfileData = { name: "", email: "", countryCode: "+91", phone: "" };
// Bank details now start as a single object for the form fields
const initialBankDetailsForm = { bank: "", account: "", ifsc: "", upiId: "" };

const PartnerProfile = () => {
  const [profile, setProfile]               = useState<ProfileData>(initialProfile);
  // State to hold the array of bank accounts from the API
  const [savedBankAccounts, setSavedBankAccounts] = useState<BankDetail[]>([]);
  // State for the form input fields
  const [bankDetailsForm, setBankDetailsForm] = useState(initialBankDetailsForm);
  const [kycData, setKycData]               = useState<KycData>({ status: 'NONE' });

  const [aadharFile, setAadhaarFile]         = useState<File | null>(null);
  const [aadhaarPreview, setAadhaarPreview]   = useState<string>("");
  const [panFile, setPanFile]               = useState<File | null>(null);
  const [panPreview, setPanPreview]           = useState<string>("");

  const [loading, setLoading]               = useState(true);
  const [submitting, setSubmitting]           = useState({ kyc: false, bank: false, delete: false });
  const [notification, setNotification]     = useState<NotificationState>({ show: false, message: '', type: 'success' });

  const { currentUser } = useSelector((state: RootState) => state.auth);
  
  // --- Notification Handler ---
  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 4000);
  };

  // --- API Calls ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, kycRes, bankRes] = await Promise.all([
        axiosInstance.get('/api/partner/profile').catch(() => ({ data: null })),
        axiosInstance.get('/api/kyc/partner/kyc').catch(() => ({ data: { status: 'NONE' } })),
        axiosInstance.get<BankDetail[]>('/api/bank-accounts').catch(() => ({ data: [] })),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (kycRes.data) setKycData({ ...kycRes.data, status: kycRes.data.status || 'NONE' });
      
      const accounts = bankRes.data || [];
      setSavedBankAccounts(accounts);
      if (accounts.length > 0) {
        // Populate the form with the first (and likely only) account details
        const primaryAccount = accounts[0];
        setBankDetailsForm({ bank: primaryAccount.bank, account: primaryAccount.account, ifsc: primaryAccount.ifsc, upiId: primaryAccount.upiId || "" });
      } else {
        // If no accounts, reset the form
        setBankDetailsForm(initialBankDetailsForm);
      }

    } catch (err) {
      showNotification("Could not load all profile data.", 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // --- Form Handlers ---
  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement>) => setBankDetailsForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'aadhaar' | 'pan') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const setter = type === 'aadhaar' ? setAadhaarFile : setPanFile;
    const previewSetter = type === 'aadhaar' ? setAadhaarPreview : setPanPreview;
    setter(file);
    previewSetter(URL.createObjectURL(file));
  };

  // --- Save & Delete Handlers ---
  const handleBankSave = async () => {
    setSubmitting(p => ({ ...p, bank: true }));
    const payload = { ...bankDetailsForm, status: "ACTIVE", description: "Primary Partner Account" };
    try {
      await axiosInstance.post('/api/bank-accounts', payload);
      showNotification("Bank details saved successfully!", 'success');
      fetchData(); // Refresh data to get the new account and lock the fields
    } catch (err) {
      showNotification("Failed to save bank details.", 'error');
    } finally {
      setSubmitting(p => ({ ...p, bank: false }));
    }
  };

  const handleBankDelete = async () => {
      const accountToDelete = savedBankAccounts[0];
      if (!accountToDelete) return;

      setSubmitting(p => ({ ...p, delete: true }));
      try {
          await axiosInstance.delete(`/api/bank-accounts/${accountToDelete.id}`);
          showNotification("Bank details deleted successfully.", 'success');
          fetchData(); // Refresh data to clear the form and enable fields
      } catch (err) {
          showNotification("Failed to delete bank details.", 'error');
      } finally {
          setSubmitting(p => ({ ...p, delete: false }));
      }
  };

  const handleKycSubmit = async () => {
    if (!aadharFile || !panFile) {
      showNotification("Please upload both Aadhaar/GST and PAN documents.", 'error');
      return;
    }
    setSubmitting(p => ({ ...p, kyc: true }));
    const formData = new FormData();
    formData.append('aadharOrGst', aadharFile);
    formData.append('pan', panFile);

    try {
      await axiosInstance.post('/api/kyc/partner', formData);
      showNotification("KYC documents submitted for review!", 'success');
      fetchData();
    } catch (err) {
      showNotification("Failed to submit KYC documents.", 'error');
    } finally {
      setSubmitting(p => ({ ...p, kyc: false }));
    }
  };

  // --- Render Logic ---
  const hasSavedBankDetails = savedBankAccounts.length > 0;
  const renderKycContent = () => {
    const { status, aadharOrGstUrl, panUrl, rejectionReason } = kycData;
    const statusInfoMap = {
      APPROVED: { icon: FaCheckCircle, text: "KYC Approved", color: "green" },
      PENDING: { icon: FaHourglassHalf, text: "KYC Under Review", color: "yellow" },
    };

    if (status === 'APPROVED' || status === 'PENDING') {
      const statusInfo = statusInfoMap[status];
      return (
        <div className={`p-4 rounded-lg border-l-4 bg-${statusInfo.color}-50 border-${statusInfo.color}-500`}>
          <div className="flex items-center gap-3">
            <statusInfo.icon className={`text-${statusInfo.color}-500 text-xl`} />
            <span className={`font-bold text-${statusInfo.color}-700`}>{statusInfo.text}</span>
          </div>
          {(aadharOrGstUrl || panUrl) && (
            <div className="mt-3 text-sm text-gray-600 space-y-1 pl-9">
              {aadharOrGstUrl && <a href={aadharOrGstUrl} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline">View Submitted Aadhaar/GST</a>}
              {panUrl && <a href={panUrl} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline">View Submitted PAN</a>}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {status === 'REJECTED' && (
          <div className="p-3 rounded-lg border-l-4 border-red-500 bg-red-50 text-red-700">
            <p className="font-bold">Submission Rejected</p>
            <p className="text-sm mt-1">Reason: {rejectionReason || 'Please re-upload clear documents.'}</p>
          </div>
        )}
        <FileUploadBox file={aadharFile} preview={aadhaarPreview} type="aadhaar" onChange={handleFileChange} />
        <FileUploadBox file={panFile} preview={panPreview} type="pan" onChange={handleFileChange} />
        <div className="pt-2">
          <button onClick={handleKycSubmit} disabled={submitting.kyc} className="w-full bg-[#7a1335] text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-[#5a0e28] transition flex items-center justify-center gap-2 disabled:bg-gray-400">
            {submitting.kyc ? <FaSpinner className="animate-spin" /> : (status === 'REJECTED' ? 'Re-submit Verification' : 'Submit for Verification')}
          </button>
        </div>
      </div>
    );
  };
  
  if (loading) return <div className="min-h-screen flex items-center justify-center"><FaSpinner className="animate-spin text-4xl text-[#7a1335]" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">My Profile & Settings</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <Card title="My Profile" icon={<FaUser />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Name" name="name" value={currentUser?.fullName || ''} disabled />
                <InputField label="Email" name="email" value={currentUser?.email || ''} type="email" disabled />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <div className="flex">
                    <input type="text" name="phone" value={currentUser?.mobile || ''} disabled className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-r-md bg-gray-100 cursor-not-allowed" />
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Bank & UPI Details" icon={<FaUniversity />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Bank Name" name="bank" value={bankDetailsForm.bank} onChange={handleBankChange} disabled={hasSavedBankDetails} />
                <InputField label="Account Number" name="account" value={bankDetailsForm.account} onChange={handleBankChange} disabled={hasSavedBankDetails} />
                <InputField label="IFSC Code" name="ifsc" value={bankDetailsForm.ifsc} onChange={handleBankChange} disabled={hasSavedBankDetails} />
                <InputField label="UPI ID" name="upiId" value={bankDetailsForm.upiId} onChange={handleBankChange} placeholder="your-upi@okhdfc" disabled={hasSavedBankDetails} />
              </div>
              <div className="flex justify-end items-center gap-4 mt-6">
                {hasSavedBankDetails && (
                    <button onClick={handleBankDelete} disabled={submitting.delete} className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400">
                        {submitting.delete ? <FaSpinner className="animate-spin" /> : <FaTrash />} Delete
                    </button>
                )}
                <button onClick={handleBankSave} disabled={submitting.bank || hasSavedBankDetails} className="bg-[#7a1335] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#5a0e28] transition flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {submitting.bank ? <><FaSpinner className="animate-spin" />Saving...</> : <><FaSave /> Save Bank Details</>}
                </button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card title="KYC Status" icon={<FaIdCard />}>{renderKycContent()}</Card>
          </div>
        </div>
      </div>
      <Notification {...notification} onClose={() => setNotification(n => ({...n, show: false}))} />
    </div>
  );
};

// --- Reusable Helper Components ---
const Card: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200/80">
    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3 border-b pb-4"><div className="text-[#7a1335]">{icon}</div> {title}</h2>
    {children}
  </div>
);

const InputField: React.FC<{ label: string; name: string; value: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string; disabled?: boolean }> = ({ label, name, value, onChange, type = 'text', placeholder, disabled = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7a1335] disabled:bg-gray-100 disabled:cursor-not-allowed"
      placeholder={placeholder || label}
    />
  </div>
);

const FileUploadBox: React.FC<{ file: File | null; preview: string; type: 'aadhaar' | 'pan'; onChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'aadhaar' | 'pan') => void; }> = ({ file, preview, type, onChange }) => (
  <div className="space-y-3">
    <label className="block text-sm font-medium text-gray-700">{type === 'aadhaar' ? 'Aadhaar / GST Certificate' : 'PAN Card'}</label>
    {preview && (
      <div className="p-2 border rounded-md">
        {file?.type.startsWith("image") ? (
          <img src={preview} alt={`${type} Preview`} className="w-full max-h-48 object-contain rounded" />
        ) : (
          <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-md w-full">
            <FaFilePdf className="text-red-500 text-3xl flex-shrink-0"/>
            <span className="text-xs text-gray-700 font-medium truncate">{file?.name}</span>
          </div>
        )}
      </div>
    )}
    <label className="flex items-center justify-center w-full cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-100 transition text-sm text-gray-600 font-semibold gap-2">
      <FaUpload /> {file ? 'Change File' : `Upload ${type === 'aadhaar' ? 'Aadhaar/GST' : 'PAN'}`}
      <input type="file" accept="image/*,application/pdf" onChange={(e) => onChange(e, type)} className="hidden" />
    </label>
  </div>
);

const Notification: React.FC<NotificationState & { onClose: () => void }> = ({ show, message, type, onClose }) => {
    if (!show) return null;
    const isSuccess = type === 'success';
    return (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-4 p-4 rounded-lg shadow-2xl animate-fade-in-up ${isSuccess ? 'bg-green-600' : 'bg-red-600'} text-white`}>
            {isSuccess ? <FaCheckCircle /> : <FaTimesCircle />}
            <span className="font-semibold">{message}</span>
            <button onClick={onClose} className="ml-4"><X size={18} /></button>
        </div>
    );
};

export default PartnerProfile;