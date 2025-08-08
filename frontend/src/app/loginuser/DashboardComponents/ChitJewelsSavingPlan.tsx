import { Calendar, CheckCircle, Gem, ShieldX, Star, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance'; // Make sure this path is correct
import Portal from '../../user/Portal'; // Make sure this path is correct
// Razorpay script loader
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    document.body.appendChild(script);
  });
};

// --- INTERFACES to match /api/orders/my response ---
interface OrderFromApi {
  id: number;
  orderId: string;
  planName: string;
  amount: number;
  duration: string;
  status: string;
  address: string;
  createdAt: string;
  paymentMethod: string;
  customerName: string;
  customerType: 'user' | 'b2b' | 'partner' | 'admin';
  planType: 'CHIT' | 'SIP' | 'SCHEME' | 'ORNAMENT';
}

// Match chitjewels.tsx ProcessedPlan type
interface ProcessedPlan {
  id: string;
  name: string;
  startDate: string;
  status: string;
  totalAmountPaid: string;
  totalGoldAccumulated: string;
  totalBonus: string;
  payments: any[];
}

// --- HELPER FUNCTIONS ---
const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
const parseDurationMonths = (durationStr: string): number => parseInt(durationStr, 10) || 1;

const LChitJewelsSavingPlan = () => {
  // --- MODAL STATES ---
  // Separate modals for Buy and Sell
  const [buyModalPlan, setBuyModalPlan] = useState<ProcessedPlan | null>(null);
  const [sellModalPlan, setSellModalPlan] = useState<ProcessedPlan | null>(null);
  const [successPopup, setSuccessPopup] = useState<{ message: string; amount?: number, sellResult?: any } | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  // Helper to get next unpaid month and amount
  const getNextPaymentInfo = (plan: ProcessedPlan) => {
    // Always use the first month's amount for all subsequent payments
    if (!plan.payments || plan.payments.length === 0) return { month: 2, amount: null };
    // Get the first month's amountPaid (the actual paid value, not monthlyPay)
    let amount = null;
    if (plan.payments[0]) {
      amount = plan.payments[0].amountPaid || plan.payments[0].monthlyPay || plan.payments[0].amountDue || null;
    }
    // Find the next unpaid month after the first month
    const next = plan.payments.find((p: any) => p.month > 1 && (!p.amountPaid || p.amountPaid === 0));
    if (next) {
      return { month: next.month, amount };
    }
    // If all months paid, fallback to the last month
    const last = plan.payments[plan.payments.length - 1];
    return { month: last.month, amount };
  };

  const handleNextPay = (plan: ProcessedPlan) => {
    setBuyModalPlan(plan);
    setApiMessage(null);
  };
  const handleSell = (plan: ProcessedPlan) => {
    setSellModalPlan(plan);
    setApiMessage(null);
  };
  // --- STATE MANAGEMENT ---
  const [userChitPlans, setUserChitPlans] = useState<ProcessedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('active');
  const [viewedPlan, setViewedPlan] = useState<ProcessedPlan | null>(null);
  const navigate = useNavigate();

  // --- DATA FETCHING from /api/orders/my ---
  const fetchUserPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch enrolled chit plans for the user
      const response = await axiosInstance.get('/api/user-savings/my-enrollments');
      const enrolledPlans = response.data || [];
      // Map the API response to new format
      const processed = enrolledPlans.map((plan: any) => {
        // Force selled status if selled, sold, or terminated
        let status = (plan.status || '').toLowerCase();
        if (plan.selled === true || plan.sold === true || status === 'terminated') {
          status = 'selled';
        } else if (status === 'enrolled') {
          status = 'successful';
        } else if (status === 'rejected' || status === 'failed' || status === 'selled') {
          status = 'selled';
        }
        return {
          id: plan.enrollmentId?.toString() || '',
          name: plan.planName || '',
          startDate: plan.startDate || '',
          status,
          totalAmountPaid: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(plan.totalAmountPaid || 0),
          totalGoldAccumulated: (plan.totalGoldAccumulated || 0).toFixed(4) + 'g',
          totalBonus: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(plan.totalBonus || 0),
          payments: plan.payments || [],
        };
      });
      setUserChitPlans(processed);
    } catch (err) {
      console.error("Failed to fetch enrolled Chit plans:", err);
      setError("Could not load your enrolled saving plans at this time.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserPlans();
  }, []);

  // --- DYNAMIC STATS BASED ON USER ORDERS ---
  const stats = useMemo(() => {
    // Only show Active and Selled tabs
    const active = userChitPlans.filter(p => p.status === 'successful').length;
    const selled = userChitPlans.filter(p => p.status === 'selled').length;
    return [
      { label: 'Active', count: active, color: 'from-[#7a1335] to-pink-600', icon: CheckCircle },
      { label: 'Selled', count: selled, color: 'from-rose-400 to-pink-500', icon: ShieldX }
    ];
  }, [userChitPlans]);

  // This will now correctly find and display plans for each tab
  const plansToShow = useMemo(() => {
  if (selectedTab === 'active') return userChitPlans.filter(p => p.status === 'successful');
  if (selectedTab === 'selled') return userChitPlans.filter(p => p.status === 'selled');
  return [];
  }, [selectedTab, userChitPlans]);

  console.log(plansToShow, 'plansToShow');
  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6a0822] rounded flex items-center justify-center">
              <Gem className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-[#6a0822]">Chit Jewels</h1>
            <span className="text-xs text-gray-500 ml-2">My Saving Plans</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-white rounded-lg p-2 flex flex-col items-center justify-center border border-[#6a0822] cursor-pointer transition-all duration-200 ${selectedTab === stat.label.toLowerCase() ? 'ring-2 ring-[#6a0822]' : ''}`}
              onClick={() => setSelectedTab(stat.label.toLowerCase())}
            >
              <stat.icon className="w-4 h-4 mb-1 text-[#6a0822]" />
              <div className="text-base font-bold text-[#6a0822]">{stat.count}</div>
              <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500 text-sm">Loading your plans...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-600 bg-red-50 rounded-xl p-4 text-sm">{error}</div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#6a0822] capitalize">{selectedTab} Saving Plans</h2>
              <div className="flex items-center space-x-1 text-xs text-gray-500"><Calendar className="w-3 h-3" /><span>Updated today</span></div>
            </div>
            {plansToShow.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plansToShow?.map((plan) => (
                  <div key={plan.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 flex flex-col justify-between h-full min-h-[210px]">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-sm font-bold text-gray-800">{plan.name}</h3>
                      </div>
                      <div className="w-7 h-7 bg-gray-100 rounded flex-shrink-0"></div>
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-center text-xs"><span className="text-gray-500">Start Date</span><span className="font-semibold text-gray-800">{plan.startDate ? new Date(plan.startDate).toLocaleDateString() : '-'}</span></div>
                      <div className="flex justify-between items-center text-xs"><span className="text-gray-500">Total Paid</span><span className="font-semibold text-gray-800">{plan.totalAmountPaid}</span></div>
                      <div className="flex justify-between items-center text-xs"><span className="text-gray-500">Gold Accumulated</span><span className="font-semibold text-gray-800">{plan.totalGoldAccumulated}</span></div>
                      <div className="flex justify-between items-center text-xs"><span className="text-gray-500">Bonus</span><span className="font-semibold text-gray-800">{plan.totalBonus}</span></div>
                    </div>
                    {selectedTab === 'selled' ? (
                      <div className="flex items-center space-x-2 mt-3 pt-2 border-t">
                        <button className="flex-1 bg-gray-100 text-gray-700 py-1.5 px-2 rounded hover:bg-gray-200 transition-colors text-xs font-semibold" onClick={() => setViewedPlan(plan)}>View Details</button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 mt-3 pt-2 border-t">
                        <button className="flex-1 bg-yellow-600 text-white py-1.5 px-2 rounded hover:bg-yellow-700 transition-colors text-xs font-semibold" onClick={() => handleSell(plan)}>Sell Gold</button>
                        <button className="flex-1 bg-green-700 text-white py-1.5 px-2 rounded hover:bg-green-800 transition-colors text-xs font-semibold" onClick={() => handleNextPay(plan)}>Buy Jewel</button>
                      </div>
                    )}
                  </div>
                ))}


              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2"><Star className="w-5 h-5 text-gray-400" /></div>
                <h3 className="text-base font-medium text-[#6a0822]">No {selectedTab} Plans</h3>
                <p className="text-gray-600 text-xs">You do not have any {selectedTab} saving plans.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- VIEW DETAILS POPUP --- */}
      {viewedPlan && (
        <Portal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded-xl p-4 max-w-xs w-full mx-auto relative shadow-xl">
              <button
                onClick={() => setViewedPlan(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
              <div className="text-center">
                <h3 className="text-lg font-bold text-[#6a0822] mb-2">{viewedPlan.name}</h3>
                <div className="space-y-2 bg-gray-50 p-2 rounded text-xs text-gray-600">
                  <div className="flex justify-between items-center"><span>Status:</span><span className={`font-bold px-2 py-0.5 rounded capitalize ${viewedPlan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : viewedPlan.status === 'successful' ? 'bg-green-100 text-green-800' : viewedPlan.status === 'selled' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>{viewedPlan.status === 'selled' ? 'Selled' : viewedPlan.status}</span></div>
                  <div className="flex justify-between items-center"><span>Start Date:</span><span className="font-semibold">{viewedPlan.startDate ? new Date(viewedPlan.startDate).toLocaleDateString() : '-'}</span></div>
                  <div className="flex justify-between items-center"><span>Total Amount Paid:</span><span className="font-semibold">{viewedPlan.totalAmountPaid}</span></div>
                  <div className="flex justify-between items-center"><span>Total Gold Accumulated:</span><span className="font-semibold">{viewedPlan.totalGoldAccumulated}</span></div>
                  <div className="flex justify-between items-center"><span>Total Bonus:</span><span className="font-semibold">{viewedPlan.totalBonus}</span></div>
                </div>
                {viewedPlan.payments && viewedPlan.payments.length > 0 && (
                  <div className="mt-4 text-left">
                    <h4 className="font-bold text-[#6a0822] mb-2">Payments</h4>
                    <div className="space-y-2">
                      {viewedPlan.payments.map((p, idx) => (
                        <div key={idx} className="bg-yellow-50 rounded p-2 text-xs">
                          <div>Month: {p.month}</div>
                          <div>Date: {p.paymentDate}</div>
                          <div>Amount Paid: {formatCurrency(p.amountPaid)}</div>
                          <div>Gold Grams: {p.goldGrams?.toFixed(4)}</div>
                          <div>Bonus Applied: {formatCurrency(p.bonusApplied)}</div>
                          <div>On Time: {p.onTime ? 'Yes' : 'No'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* --- BUY MODAL --- */}
      {buyModalPlan && (
        <Portal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded-xl p-4 max-w-xs w-full mx-auto relative shadow-xl flex flex-col items-center">
              <button
                onClick={() => setBuyModalPlan(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
              <h3 className="text-lg font-bold text-[#6a0822] mb-2">Buy Jewel</h3>
              <div className="space-y-2 bg-gray-50 p-2 rounded text-xs text-gray-600 w-full">
                <div className="flex justify-between items-center"><span>Plan:</span><span className="font-semibold">{buyModalPlan.name}</span></div>
                <div className="flex justify-between items-center"><span>Start Date:</span><span className="font-semibold">{buyModalPlan.startDate ? new Date(buyModalPlan.startDate).toLocaleDateString() : '-'}</span></div>
                <div className="flex justify-between items-center"><span>Total Paid:</span><span className="font-semibold">{buyModalPlan.totalAmountPaid}</span></div>
                <div className="flex justify-between items-center"><span>Gold Accumulated:</span><span className="font-semibold">{buyModalPlan.totalGoldAccumulated}</span></div>
                <div className="flex justify-between items-center"><span>Bonus:</span><span className="font-semibold">{buyModalPlan.totalBonus}</span></div>
              </div>
              <button
                className="mt-4 bg-[#6a0822] text-white py-1.5 px-4 rounded hover:bg-[#7a1335] transition-colors text-xs font-semibold w-full"
                disabled={apiLoading}
                onClick={async () => {
                  setApiLoading(true);
                  setApiMessage(null);
                  try {
                    const { amount } = getNextPaymentInfo(buyModalPlan);
                    if (!amount || amount === 0) {
                      setApiMessage('Payment amount is not available for this plan. Please contact support.');
                      setApiLoading(false);
                      return;
                    }
                    // Only initiate payment and open Razorpay, no callback
                    const initiateRes = await axiosInstance.post('/api/user-savings/pay-monthly/initiate', {
                      enrollmentId: Number(buyModalPlan.id),
                      amountPaid: amount
                    });
                    const razorpayOrderId = initiateRes.data.razorpayOrderId;
                    const options = {
                      key: window.RAZORPAY_KEY_ID,
                      amount: amount * 100,
                      currency: 'INR',
                      name: 'Chit Jewels',
                      description: buyModalPlan.name,
                      order_id: razorpayOrderId,
                      handler: function (response: any) {
                        setApiMessage('Payment successful!');
                        fetchUserPlans();
                        setApiLoading(false);
                      },
                      prefill: { name: '', email: '', contact: '' },
                      theme: { color: '#6a0822' },
                      modal: { ondismiss: function () { setApiLoading(false); } }
                    };
                    if (!window.Razorpay) {
                      const script = document.createElement('script');
                      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                      script.async = true;
                      script.onload = () => { const rzp = new window.Razorpay(options); rzp.open(); };
                      document.body.appendChild(script);
                    } else {
                      const rzp = new window.Razorpay(options);
                      rzp.open();
                    }
                  } catch (err: any) {
                    let apiError = 'Payment failed. Please try again.';
                    if (err?.response) {
                      if (typeof err.response.data === 'string' && err.response.data) {
                        apiError = err.response.data;
                      } else if (err.response.data?.message) {
                        apiError = err.response.data.message;
                      }
                    }
                    setApiMessage(apiError);
                    setApiLoading(false);
                  }
                }}
              >
                {apiLoading ? 'Processing...' : 'Pay Now'}
              </button>
              {apiMessage && <div className="mt-2 text-xs text-center text-green-600">{apiMessage}</div>}
            </div>
          </div>
        </Portal>
      )}

      {/* --- SELL MODAL --- */}
      {sellModalPlan && (
        <Portal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded-xl p-4 max-w-xs w-full mx-auto relative shadow-xl flex flex-col items-center">
              <button
                onClick={() => setSellModalPlan(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
              <h3 className="text-lg font-bold text-[#6a0822] mb-2">Sell Gold</h3>
              <div className="space-y-2 bg-gray-50 p-2 rounded text-xs text-gray-600 w-full">
                <div className="flex justify-between items-center"><span>Plan:</span><span className="font-semibold">{sellModalPlan.name}</span></div>
                <div className="flex justify-between items-center"><span>Start Date:</span><span className="font-semibold">{sellModalPlan.startDate ? new Date(sellModalPlan.startDate).toLocaleDateString() : '-'}</span></div>
                <div className="flex justify-between items-center"><span>Total Paid:</span><span className="font-semibold">{sellModalPlan.totalAmountPaid}</span></div>
                <div className="flex justify-between items-center"><span>Gold Accumulated:</span><span className="font-semibold">{sellModalPlan.totalGoldAccumulated}</span></div>
                <div className="flex justify-between items-center"><span>Bonus:</span><span className="font-semibold">{sellModalPlan.totalBonus}</span></div>
              </div>
              <button
                className="mt-4 bg-yellow-600 text-white py-1.5 px-4 rounded hover:bg-yellow-700 transition-colors text-xs font-semibold w-full"
                disabled={apiLoading}
                onClick={async () => {
                  setApiLoading(true);
                  setApiMessage(null);
                  try {
                    const res = await axiosInstance.post('/api/user-savings/recall', {
                      enrollmentId: Number(sellModalPlan.id),
                      action: 'SELL_GOLD'
                    });
                    setSuccessPopup({
                      message: 'Gold sold successfully!',
                      sellResult: res.data
                    });
                    setSelectedTab('selled');
                    fetchUserPlans();
                  } catch (err: any) {
                    setApiMessage('Sell failed. Please try again.');
                  } finally {
                    setApiLoading(false);
                  }
                }}
              >{apiLoading ? 'Processing...' : 'Sell Gold'}</button>
              {apiMessage && <div className="mt-2 text-xs text-center text-green-600">{apiMessage}</div>}
            </div>
          </div>
        </Portal>
      )}
      {/* --- SUCCESS POPUP --- */}
      {successPopup && (
        <Portal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-2">
            <div className="bg-white rounded-xl shadow-2xl max-w-xs w-full mx-auto p-8 flex flex-col items-center justify-center">
              <h3 className="text-xl font-bold text-green-700 mb-4 text-center">{successPopup.message}</h3>
              {successPopup.sellResult ? (
                <div className="space-y-2 bg-gray-50 p-3 rounded text-xs text-gray-600 w-full mb-4">
                  <div className="flex justify-between items-center"><span>Action:</span><span className="font-semibold">{successPopup.sellResult.action}</span></div>
                  <div className="flex justify-between items-center"><span>Accumulated Gold:</span><span className="font-semibold">{successPopup.sellResult.accumulatedGoldGrams}g</span></div>
                  <div className="flex justify-between items-center"><span>Accumulated Amount:</span><span className="font-semibold">₹{successPopup.sellResult.accumulatedAmount}</span></div>
                  <div className="flex justify-between items-center"><span>Service Charge:</span><span className="font-semibold">₹{successPopup.sellResult.serviceCharge}</span></div>
                  <div className="flex justify-between items-center"><span>Final Return Amount:</span><span className="font-semibold">₹{successPopup.sellResult.finalReturnAmount}</span></div>
                </div>
              ) : null}
              {successPopup.amount ? (
                <button
                  className="mt-4 bg-[#6a0822] text-white py-2 px-6 rounded hover:bg-[#7a1335] font-semibold"
                  onClick={() => {
                    setSuccessPopup(null);
                    navigate(`/buyornaments?amount=${successPopup.amount}`);
                  }}
                >Go to Ornaments</button>
              ) : (
                <button
                  className="mt-4 bg-[#6a0822] text-white py-2 px-6 rounded hover:bg-[#7a1335] font-semibold"
                  onClick={() => setSuccessPopup(null)}
                >Close</button>
              )}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default LChitJewelsSavingPlan;