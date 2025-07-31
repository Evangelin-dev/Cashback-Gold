import {
  AtSign,
  Building,
  Calendar,
  Check,
  Copy,
  CreditCard,
  Hash,
  Plus,
  Smartphone,
  Trash2,
  User
} from 'lucide-react';
import React, { useState } from 'react';

interface BankCard {
  id: number;
  accountNumber: string;
  ifscCode: string;
  holderName: string;
  bankName: string;
  validThru: string;
  cardType: 'visa' | 'mastercard' | 'rupay';
}

interface UPIAccount {
  id: number;
  upiId: string;
  holderName: string;
  bankName: string;
}

const BankUPIManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bank' | 'upi'>('bank');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Bank Card States
  const [bankCards, setBankCards] = useState<BankCard[]>([]);
  const [bankForm, setBankForm] = useState({
    accountNumber: '',
    ifscCode: '',
    holderName: '',
    bankName: '',
    validThru: '',
    cardType: 'visa' as 'visa' | 'mastercard' | 'rupay'
  });

  // UPI States
  const [upiAccounts, setUpiAccounts] = useState<UPIAccount[]>([]);
  const [upiForm, setUpiForm] = useState({
    upiId: '',
    holderName: '',
    bankName: ''
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const addBankCard = () => {
    if (bankForm.accountNumber && bankForm.ifscCode && bankForm.holderName && bankForm.bankName && bankForm.validThru) {
      const newCard: BankCard = {
        id: Date.now(),
        ...bankForm
      };
      setBankCards([...bankCards, newCard]);
      setBankForm({
        accountNumber: '',
        ifscCode: '',
        holderName: '',
        bankName: '',
        validThru: '',
        cardType: 'visa'
      });
    }
  };

  const addUPIAccount = () => {
    if (upiForm.upiId && upiForm.holderName && upiForm.bankName) {
      const newUPI: UPIAccount = {
        id: Date.now(),
        ...upiForm
      };
      setUpiAccounts([...upiAccounts, newUPI]);
      setUpiForm({
        upiId: '',
        holderName: '',
        bankName: ''
      });
    }
  };

  const deleteBankCard = (id: number) => {
    setBankCards(bankCards.filter(card => card.id !== id));
  };

  const deleteUPIAccount = (id: number) => {
    setUpiAccounts(upiAccounts.filter(upi => upi.id !== id));
  };

  const getCardGradient = (type: string, index: number) => {
    const gradients = {
      visa: ['from-blue-600 to-blue-800', 'from-purple-600 to-purple-800', 'from-indigo-600 to-indigo-800'],
      mastercard: ['from-red-600 to-orange-600', 'from-pink-600 to-red-600', 'from-orange-600 to-red-600'],
      rupay: ['from-green-600 to-teal-600', 'from-emerald-600 to-green-600', 'from-teal-600 to-cyan-600']
    };
    return gradients[type as keyof typeof gradients][index % 3];
  };

  return (
    <div className="min-h-screen bg-white p-2">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-[#6a0822] rounded-full mb-2">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#6a0822] mb-1">Payment Manager</h1>
          <p className="text-xs text-gray-600">Manage your bank cards and UPI accounts</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-4">
          <div className="bg-white p-1 rounded-xl shadow border border-gray-200 flex gap-1">
            <button
              onClick={() => setActiveTab('bank')}
              className={`px-4 py-2 rounded font-medium text-xs transition-all duration-200 ${
                activeTab === 'bank'
                  ? 'bg-[#6a0822] text-white shadow'
                  : 'text-gray-600 hover:text-[#6a0822]'
              }`}
            >
              <CreditCard className="w-4 h-4 inline mr-1" />
              Bank Cards
            </button>
            <button
              onClick={() => setActiveTab('upi')}
              className={`px-4 py-2 rounded font-medium text-xs transition-all duration-200 ${
                activeTab === 'upi'
                  ? 'bg-[#6a0822] text-white shadow'
                  : 'text-gray-600 hover:text-[#6a0822]'
              }`}
            >
              <Smartphone className="w-4 h-4 inline mr-1" />
              UPI Accounts
            </button>
          </div>
        </div>

        {activeTab === 'bank' ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Bank Card Entry Section */}
            <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#6a0822]" />
                Add Bank Card
              </h2>

              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Hash className="w-4 h-4 inline mr-1" />
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={bankForm.accountNumber}
                      onChange={(e) => setBankForm({...bankForm, accountNumber: e.target.value})}
                      className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#6a0822] focus:border-transparent text-sm"
                      placeholder="Enter account number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Building className="w-4 h-4 inline mr-1" />
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={bankForm.ifscCode}
                      onChange={(e) => setBankForm({...bankForm, ifscCode: e.target.value.toUpperCase()})}
                      className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#6a0822] focus:border-transparent text-sm"
                      placeholder="Enter IFSC code"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    value={bankForm.holderName}
                    onChange={(e) => setBankForm({...bankForm, holderName: e.target.value})}
                  className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#6a0822] focus:border-transparent text-sm"
                    placeholder="Enter card holder name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Building className="w-4 h-4 inline mr-1" />
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={bankForm.bankName}
                      onChange={(e) => setBankForm({...bankForm, bankName: e.target.value})}
                      className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#6a0822] focus:border-transparent text-sm"
                      placeholder="Enter bank name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Valid Thru
                    </label>
                    <input
                      type="text"
                      value={bankForm.validThru}
                      onChange={(e) => setBankForm({...bankForm, validThru: e.target.value})}
                      className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#6a0822] focus:border-transparent text-sm"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Card Type</label>
                  <div className="flex gap-2">
                    {['visa', 'mastercard', 'rupay'].map((type) => (
                      <label key={type} className="flex items-center text-xs">
                        <input
                          type="radio"
                          name="cardType"
                          value={type}
                          checked={bankForm.cardType === type}
                          onChange={(e) => setBankForm({...bankForm, cardType: e.target.value as 'visa' | 'mastercard' | 'rupay'})}
                          className="mr-1"
                        />
                        <span className="capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={addBankCard}
                  className="w-full bg-[#6a0822] text-white py-2 rounded font-medium hover:bg-[#4a0617] text-sm"
                >
                  Add Bank Card
                </button>
              </div>
            </div>

            {/* Bank Cards Display Section */}
            <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Your Bank Cards</h2>
              
              {bankCards.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-xs">No bank cards added yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bankCards.map((card, index) => (
                    <div key={card.id} className="relative">
                      {/* ATM Card Design */}
                      <div className={`relative bg-[#6a0822] rounded-xl p-4 text-white shadow overflow-hidden`}>
                        {/* Card Content */}
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-4">
                            <div className="text-base font-bold uppercase tracking-wider">
                              {card.bankName}
                            </div>
                            <div className="text-right">
                              <div className="text-xs opacity-80">VALID THRU</div>
                              <div className="font-mono text-xs">{card.validThru}</div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="text-xs opacity-80 mb-0.5">ACCOUNT NUMBER</div>
                            <div className="font-mono text-base tracking-widest">
                              {card.accountNumber.replace(/(.{4})/g, '$1 ')}
                            </div>
                          </div>

                          <div className="flex justify-between items-end">
                            <div>
                              <div className="text-xs opacity-80 mb-0.5">CARD HOLDER</div>
                              <div className="font-semibold uppercase text-xs">{card.holderName}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs opacity-80 mb-0.5">IFSC</div>
                              <div className="font-mono text-xs">{card.ifscCode}</div>
                            </div>
                          </div>

                          <div className="absolute top-3 right-3 text-xs font-bold uppercase opacity-80">
                            {card.cardType}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-3 left-3 flex gap-1">
                          <button
                            onClick={() => handleCopy(card.accountNumber)}
                            className="p-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
                          >
                            {copiedText === card.accountNumber ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => deleteBankCard(card.id)}
                            className="p-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* UPI Entry Section */}
            <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#6a0822]" />
                Add UPI Account
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <AtSign className="w-4 h-4 inline mr-1" />
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value={upiForm.upiId}
                    onChange={(e) => setUpiForm({...upiForm, upiId: e.target.value})}
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#6a0822] focus:border-transparent text-sm"
                    placeholder="Enter UPI ID (e.g., user@paytm)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={upiForm.holderName}
                    onChange={(e) => setUpiForm({...upiForm, holderName: e.target.value})}
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#6a0822] focus:border-transparent text-sm"
                    placeholder="Enter account holder name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="w-4 h-4 inline mr-1" />
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={upiForm.bankName}
                    onChange={(e) => setUpiForm({...upiForm, bankName: e.target.value})}
                    className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#6a0822] focus:border-transparent text-sm"
                    placeholder="Enter bank name"
                  />
                </div>

                <button
                  onClick={addUPIAccount}
                  className="w-full bg-[#6a0822] text-white py-2 rounded font-medium hover:bg-[#4a0617] text-sm"
                >
                  Add UPI Account
                </button>
              </div>
            </div>

            {/* UPI Display Section */}
            <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Your UPI Accounts</h2>
              
              {upiAccounts.length === 0 ? (
                <div className="text-center py-8">
                  <Smartphone className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-xs">No UPI accounts added yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upiAccounts.map((upi, index) => (
                    <div key={upi.id} className="relative">
                      {/* Mobile Phone UI */}
                      <div className="bg-[#6a0822] rounded-xl p-3 shadow">
                        <div className="bg-white rounded p-3 min-h-[120px]">
                          <div className="text-center mb-2">
                            <div className="w-8 h-8 bg-[#6a0822] rounded-full flex items-center justify-center mx-auto mb-1">
                              <AtSign className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-base font-bold text-gray-800">UPI Payment</h3>
                          </div>

                          <div className="space-y-2">
                            <div className="bg-gray-50 rounded p-2">
                              <div className="text-xs text-gray-500 mb-0.5">UPI ID</div>
                              <div className="font-mono text-xs text-gray-800 flex items-center justify-between">
                                <span>{upi.upiId}</span>
                                <button
                                  onClick={() => handleCopy(upi.upiId)}
                                  className="p-1 hover:bg-gray-200 rounded"
                                >
                                  {copiedText === upi.upiId ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-gray-500" />}
                                </button>
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded p-2">
                              <div className="text-xs text-gray-500 mb-0.5">Account Holder</div>
                              <div className="font-semibold text-gray-800 text-xs">{upi.holderName}</div>
                            </div>

                            <div className="bg-gray-50 rounded p-2">
                              <div className="text-xs text-gray-500 mb-0.5">Bank</div>
                              <div className="text-medium text-gray-800 text-xs">{upi.bankName}</div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={() => deleteUPIAccount(upi.id)}
                            className="mt-2 w-full bg-red-500 text-white py-1.5 rounded text-xs font-medium hover:bg-red-600 transition-colors"
                          >
                            Remove Account
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankUPIManager;