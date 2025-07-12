import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance"; 


interface BankAccount {
  id: number;
  bank: string;
  account: string;
  ifsc: string;
  status: "ACTIVE" | "INACTIVE";
  description: string;
}

const emptyAccount: Omit<BankAccount, 'id'> = {
  bank: "",
  account: "",
  ifsc: "",
  status: "ACTIVE",
  description: "",
};

const MyBankAccounts = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(emptyAccount);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [showValidationError, setShowValidationError] = useState(false);

  
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/bank-accounts');
      setAccounts(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch bank accounts.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleModalInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentAccount((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAccount = async () => {
    if (!currentAccount.bank || !currentAccount.account || !currentAccount.ifsc) {
      setShowValidationError(true);
      return;
    }

    try {
      if (editingAccount) {
        
        
        await axiosInstance.put(`/api/bank-accounts/${editingAccount.id}`, currentAccount);
      } else {
        await axiosInstance.post('/api/bank-accounts', currentAccount);
      }
      await fetchAccounts();
      closeModal();
    } catch (err) {
      setError(editingAccount ? "Failed to update account." : "Failed to add account.");
      console.error(err);
    }
  };

  const handleEditClick = (account: BankAccount) => {
    setEditingAccount(account);
    setCurrentAccount(account);
    setShowAddModal(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this bank account?")) {
      try {
        await axiosInstance.delete(`/api/bank-accounts/${id}`);
        await fetchAccounts();
      } catch (err) {
        setError("Failed to delete account.");
        console.error(err);
      }
    }
  };

  const handleStatusToggle = async (id: number) => {
    try {
      await axiosInstance.put(`/api/bank-accounts/${id}/toggle`);
      await fetchAccounts();
    } catch (err) {
      setError("Failed to update status.");
      console.error(err);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setCurrentAccount(emptyAccount);
    setEditingAccount(null);
    setShowValidationError(false);
  };
  
  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#7a1335]">My Bank Accounts</h1>
          <button
            className="bg-[#7a1335] hover:bg-[#a31d4b] text-white font-semibold py-2 px-5 rounded-lg transition-colors shadow"
            onClick={() => {
              setEditingAccount(null);
              setCurrentAccount(emptyAccount);
              setShowAddModal(true);
            }}
          >
            Add Bank Account
          </button>
        </div>

        {loading ? (
            <div className="text-center py-10 text-gray-500">Loading accounts...</div>
        ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
        ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IFSC</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {accounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{acc.bank}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{acc.account}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{acc.ifsc}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={acc.description}>{acc.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleStatusToggle(acc.id)}
                          className={`px-4 py-1.5 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                            acc.status === "ACTIVE"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {acc.status === "ACTIVE" ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <button onClick={() => handleDeleteClick(acc.id)} className="text-red-600 hover:underline ml-4">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed top-0 inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in-fast">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl m-4">
            <h2 className="text-xl font-bold mb-6 text-[#7a1335]">{ "Add Bank Account"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                <input
                  type="text"
                  name="bank"
                  value={currentAccount.bank}
                  onChange={handleModalInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#a31d4b] focus:border-[#a31d4b] sm:text-sm"
                  placeholder="e.g., HDFC Bank"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Number</label>
                <input
                  type="text"
                  name="account"
                  value={currentAccount.account}
                  onChange={handleModalInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#a31d4b] focus:border-[#a31d4b] sm:text-sm"
                  placeholder="e.g., 1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
                <input
                  type="text"
                  name="ifsc"
                  value={currentAccount.ifsc}
                  onChange={handleModalInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#a31d4b] focus:border-[#a31d4b] sm:text-sm"
                  placeholder="e.g., HDFC0001234"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={currentAccount.description}
                  onChange={handleModalInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#a31d4b] focus:border-[#a31d4b] sm:text-sm"
                  placeholder="e.g., Primary salary account"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-sm transition-colors"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-[#7a1335] hover:bg-[#a31d4b] text-white font-semibold text-sm transition-colors shadow"
                onClick={handleSaveAccount}
              >
                { "Add Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showValidationError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-fade-in">
            <span className="text-5xl text-yellow-500 mb-4">⚠️</span>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Missing Fields</h2>
            <p className="mb-6 text-gray-600">Please fill all required fields.</p>
            <button
              className="px-6 py-2 rounded-lg bg-[#7a1335] hover:bg-[#a31d4b] text-white font-semibold shadow-md transition-colors"
              onClick={() => setShowValidationError(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBankAccounts;