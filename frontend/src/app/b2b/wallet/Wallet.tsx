import { useState, useEffect, useCallback } from "react";
import { FaArrowDown, FaArrowUp, FaCreditCard, FaGooglePay, FaHistory, FaPlus, FaQrcode, FaSpinner, FaTimes, FaWallet } from "react-icons/fa";
import axiosInstance from "../../../utils/axiosInstance";

const rechargeOptions = [
  { value: "UPI", label: "UPI", icon: <FaQrcode className="inline mr-2 text-purple-600" /> },
  { value: "GOOGLE_PAY", label: "Google Pay", icon: <FaGooglePay className="inline mr-2 text-blue-600" /> },
  { value: "PAYTM", label: "Paytm", icon: <FaWallet className="inline mr-2 text-blue-500" /> },
];

interface Transaction {
  id: number;
  date: string;
  type: "TOPUP" | "PURCHASE";
  amount: string;
  status: string;
  color: string;
}

interface WalletData {
  balance: number;
  lastUpdated: string;
}

export default function Wallet() {
  const [showTopup, setShowTopup] = useState(false);
  const [rechargeMethod, setRechargeMethod] = useState("UPI");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState("");

  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [balanceLoading, setBalanceLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [topupLoading, setTopupLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletBalance = useCallback(async () => {
    setBalanceLoading(true);
    try {
      const response = await axiosInstance.get('/wallet/balance');
      setWalletData(response.data);
    } catch (err) {
      setError("Could not fetch wallet balance.");
      console.error("Balance fetch error:", err);
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async (pageNum: number) => {
    if (pageNum === 0) setTransactionsLoading(true);
    try {
      const response = await axiosInstance.get(`/wallet/transactions?page=${pageNum}&size=10`);
      const { content, last } = response.data;
      setTransactions(prev => pageNum === 0 ? content : [...prev, ...content]);
      setHasMore(!last);
    } catch (err) {
      setError("Could not fetch transactions.");
      console.error("Transactions fetch error:", err);
    } finally {
      if (pageNum === 0) setTransactionsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWalletBalance();
    fetchTransactions(0);
  }, [fetchWalletBalance, fetchTransactions]);

  const handleTopup = async () => {
    const amount = parseFloat(topupAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    setTopupLoading(true);
    try {
      await axiosInstance.post('/wallet/topup', {
        amount: amount,
        paymentMethod: rechargeMethod,
      });
      alert("Top-up successful!");
      setShowTopup(false);
      setTopupAmount("");

      fetchWalletBalance();
      fetchTransactions(0);
    } catch (err) {
      alert("Top-up failed. Please try again.");
      console.error("Top-up error:", err);
    } finally {
      setTopupLoading(false);
    }
  };

  const loadMoreTransactions = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTransactions(nextPage);
  };

  const selectedOption = rechargeOptions.find(opt => opt.value === rechargeMethod);
  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">My Wallet</h1>
          <p className="text-gray-600">Manage your payments and transactions</p>
        </div>

        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert"><p>{error}</p></div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-2xl shadow-lg p-6 text-white overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16  rounded-full -ml-6 -mb-6"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><FaWallet className="text-xl" /></div>
                  <div>
                    <h3 className="font-semibold">Wallet Balance</h3>
                    <p className="text-xs opacity-80">Available to spend</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                {balanceLoading ? <FaSpinner className="animate-spin text-3xl" /> :
                  <div className="text-4xl font-bold mb-1">
                    {walletData?.balance.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) || '₹0.00'}
                  </div>
                }
                <div className="text-xs opacity-80">
                  Last updated: {walletData?.lastUpdated ? new Date(walletData.lastUpdated).toLocaleString() : '...'}
                </div>                </div>

              <button
                className="w-full bg-white text-purple-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center text-sm"
                onClick={() => setShowTopup(true)}
              >
                <FaPlus className="mr-2" /> Top-up Wallet
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center"><FaCreditCard className="text-white text-xl" /></div>
                <div>
                  <h3 className="font-semibold text-gray-800">Credit Limit</h3>
                  <p className="text-xs text-gray-600">Available credit</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800">₹0 / ₹0</div>
              <p className="text-xs text-gray-500 mb-3">Used / Total</p>
              <button className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm">Request Increase</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <FaArrowUp className="text-green-500 text-2xl mb-2" />
                <div className="text-xl font-bold text-green-600">₹0</div>
                <div className="text-xs text-gray-600">This Month</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <FaArrowDown className="text-red-500 text-2xl mb-2" />
                <div className="text-xl font-bold text-red-600">₹0</div>
                <div className="text-xs text-gray-600">Spent</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaHistory className="text-gray-500 text-xl" />
                <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
              </div>
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">View All</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {transactionsLoading ? (
                  <tr><td colSpan={4} className="p-8 text-center"><FaSpinner className="animate-spin text-purple-600 mx-auto text-2xl" /></td></tr>
                ) : transactions.length > 0 ? (
                  [...transactions].reverse().map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-gray-800">{new Date(tx.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {tx.type === 'TOPUP' ? <FaArrowUp className="text-green-500" /> : <FaArrowDown className="text-red-500" />}
                          <span className="capitalize">{tx.type.toLowerCase()}</span>
                        </div>
                      </td>
                      <td className={`px-4 py-3 whitespace-nowrap font-semibold ${tx.type === 'TOPUP' ? 'text-green-600' : 'text-red-600'}`}>{tx.amount}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">{tx.status.toLowerCase()}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-500"><FaHistory className="mx-auto text-3xl mb-2 opacity-40" /><p>No transactions yet</p></td></tr>
                )}
              </tbody>
            </table>
          </div>
          {hasMore && (
            <div className="p-4 border-t border-gray-200 text-center">
              <button onClick={loadMoreTransactions} className="text-purple-600 font-semibold hover:underline text-sm">Load More</button>
            </div>
          )}
        </div>

        {showTopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative animate-fade-in-up">
              <button onClick={() => setShowTopup(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FaTimes /></button>
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3"><FaPlus className="text-purple-600 text-xl" /></div>
                <h3 className="text-xl font-bold text-gray-900">Top-up Wallet</h3>
                <p className="text-gray-500 text-sm">Add money to your wallet securely.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter Amount</label>
                  <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input type="number" className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500" placeholder="0.00" value={topupAmount} onChange={(e) => setTopupAmount(e.target.value)} />
                  </div>
                </div>

                <div>
                  <div className="grid grid-cols-4 gap-2">
                    {quickAmounts.map(amount => (
                      <button key={amount} onClick={() => setTopupAmount(amount.toString())} className={`py-2 rounded-lg text-sm font-semibold transition-all ${topupAmount === amount.toString() ? 'bg-purple-600 text-white ring-2 ring-purple-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        ₹{amount}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <div className="p-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
                    {selectedOption?.icon}
                    <span className="font-semibold text-gray-800">{selectedOption?.label}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button onClick={handleTopup} disabled={topupLoading} className="w-full flex justify-center items-center gap-2 bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-all disabled:bg-purple-300">
                    {topupLoading ? <FaSpinner className="animate-spin" /> : `Confirm Top-up of ₹${topupAmount || 0}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}