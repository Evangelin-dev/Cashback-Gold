import {
  AtSign,
  Building,
  Check,
  Copy,
  CreditCard,
  Hash,
  Info,
  Loader2,
  Plus,
  Trash2,
  User,
  X as CloseIcon
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance'; // Adjust path if needed

// --- Combined Interface for Bank and UPI Details ---
interface AccountDetail {
  id: number;
  bank: string;
  account: string;
  ifsc: string;
  upiId: string;
  holderName: string;
}

// --- Notification Type ---
type NotificationType = 'success' | 'error';
interface NotificationState {
  show: boolean;
  message: string;
  type: NotificationType;
}

const BankUPIManager: React.FC = () => {
  const [savedAccounts, setSavedAccounts] = useState<AccountDetail[]>([]);
  const [formState, setFormState] = useState({
    account: '',
    ifsc: '',
    holderName: '',
    bank: '',
    upiId: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<{ add: boolean; deleteId: number | null }>({ add: false, deleteId: null });
  const [notification, setNotification] = useState<NotificationState>({ show: false, message: '', type: 'success' });
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<AccountDetail[]>('/api/bank-accounts');
      setSavedAccounts(response.data || []);
    } catch (err) {
      showNotification("Could not load your saved accounts.", 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleAddAccount = async () => {
    if (!formState.account || !formState.ifsc || !formState.holderName || !formState.bank) {
      showNotification("Please fill all required bank fields.", 'error');
      return;
    }
    setSubmitting(prev => ({ ...prev, add: true }));
    try {
      await axiosInstance.post('/api/bank-accounts', formState);
      showNotification("Account added successfully!", 'success');
      setFormState({ account: '', ifsc: '', holderName: '', bank: '', upiId: '' });
      fetchData();
    } catch (err) {
      showNotification("Failed to add account. Please try again.", 'error');
    } finally {
      setSubmitting(prev => ({ ...prev, add: false }));
    }
  };

  const handleDeleteAccount = async (id: number) => {
    setSubmitting(prev => ({ ...prev, deleteId: id }));
    try {
      await axiosInstance.delete(`/api/bank-accounts/${id}`);
      showNotification("Account deleted successfully.", 'success');
      fetchData();
    } catch (err) {
      showNotification("Failed to delete account.", 'error');
    } finally {
      setSubmitting(prev => ({ ...prev, deleteId: null }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-4xl text-[#6a0822]" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#6a0822] rounded-full mb-2 shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#6a0822] mb-1">Payment Manager</h1>
            <p className="text-sm text-gray-600">Manage your saved bank and UPI accounts</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* --- MODIFIED ENTRY SECTION --- */}
            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100 sticky top-20">
              {savedAccounts.length > 0 ? (
                // --- THIS BLOCK IS SHOWN WHEN AN ACCOUNT EXISTS ---
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Building className="w-5 h-5 text-[#6a0822]" />
                    Account Limit Reached
                  </h2>
                  <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg">
                    <div className="flex items-center">
                      <Info className="w-5 h-5 mr-3" />
                      <div>
                        <p className="font-semibold">You can only save one account.</p>
                        <p className="text-sm mt-1">Please delete your existing account if you wish to add a new one.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // --- THIS BLOCK (THE FORM) IS SHOWN WHEN NO ACCOUNT EXISTS ---
                <>
                  <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#6a0822]" />
                    Add New Account
                  </h2>
                  <div className="space-y-4">
                    <InputField icon={<User />} label="Account Holder Name" name="holderName" value={formState.holderName} onChange={handleFormChange} placeholder="e.g., John Doe" />
                    <InputField icon={<Building />} label="Bank Name" name="bank" value={formState.bank} onChange={handleFormChange} placeholder="e.g., State Bank of India" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField icon={<Hash />} label="Account Number" name="account" value={formState.account} onChange={handleFormChange} placeholder="Enter account number" />
                      <InputField icon={<Hash />} label="IFSC Code" name="ifsc" value={formState.ifsc} onChange={handleFormChange} placeholder="Enter IFSC code" />
                    </div>
                    <InputField icon={<AtSign />} label="UPI ID (Optional)" name="upiId" value={formState.upiId} onChange={handleFormChange} placeholder="e.g., user@bank" />
                    <button
                      onClick={handleAddAccount}
                      disabled={submitting.add}
                      className="w-full bg-[#6a0822] text-white py-2.5 rounded-lg font-semibold hover:bg-[#4a0617] text-sm transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
                    >
                      {submitting.add ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                      Add Account
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Your Saved Accounts</h2>
              {savedAccounts.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No accounts added yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedAccounts.map(account => (
                    <div key={account.id} className="relative bg-[#6a0822] rounded-xl p-4 text-white shadow-lg overflow-hidden">
                      <div className="relative z-10 space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="text-lg font-bold uppercase tracking-wider">{account.bank}</span>
                          <button
                            onClick={() => handleDeleteAccount(account.id)}
                            disabled={submitting.deleteId === account.id}
                            className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                          >
                            {submitting.deleteId === account.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                        <div>
                          <div className="text-xs opacity-80 mb-1">ACCOUNT HOLDER</div>
                          <div className="font-semibold uppercase text-sm">{account.holderName}</div>
                        </div>
                        <div className="flex items-end justify-between font-mono text-sm">
                           <div>
                              <div className="text-xs opacity-80 mb-1">A/C NUMBER</div>
                              <div className="flex items-center gap-2">
                                <span>{account.account}</span>
                                <button onClick={() => handleCopy(account.account)} className="p-1 text-white/70 hover:text-white">
                                    {copiedText === account.account ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="text-xs opacity-80 mb-1">IFSC</div>
                              <span>{account.ifsc}</span>
                           </div>
                        </div>
                        {account.upiId && (
                           <div>
                              <div className="text-xs opacity-80 mb-1">UPI ID</div>
                              <div className="flex items-center gap-2 font-mono text-sm">
                                 <span>{account.upiId}</span>
                                  <button onClick={() => handleCopy(account.upiId)} className="p-1 text-white/70 hover:text-white">
                                    {copiedText === account.upiId ? <Check size={14} /> : <Copy size={14} />}
                                  </button>
                              </div>
                           </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Notification {...notification} onClose={() => setNotification(n => ({...n, show: false}))} />
    </>
  );
};

const InputField: React.FC<{ icon: React.ReactNode; label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string; }> = ({ icon, label, name, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
      {icon}
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#6a0822] focus:border-transparent text-sm transition-shadow"
      placeholder={placeholder}
    />
  </div>
);

const Notification: React.FC<NotificationState & { onClose: () => void }> = ({ show, message, type, onClose }) => {
    if (!show) return null;
    const isSuccess = type === 'success';
    return (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-4 p-4 rounded-lg shadow-2xl animate-fade-in-up ${isSuccess ? 'bg-green-600' : 'bg-red-600'} text-white`}>
            {isSuccess ? <Check /> : <CloseIcon />}
            <span className="font-semibold">{message}</span>
            <button onClick={onClose} className="ml-4"><CloseIcon size={18} /></button>
        </div>
    );
};

export default BankUPIManager;