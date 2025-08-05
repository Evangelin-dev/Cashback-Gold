import { Calendar, CheckCircle, Gem, ShieldX, Star, TrendingUp, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance'; // Make sure this path is correct
import Portal from '../../user/Portal'; // Make sure this path is correct

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

interface ProcessedPlan {
  id: string;
  name: string;
  target: string;
  duration: string;
  monthly: string;
  status: string;
  orderId: string;
  amount: string;
  customerName: string;
  paymentMethod: string;
  address: string;
  createdAt: string;
  customerType: 'user' | 'b2b' | 'partner' | 'admin';
  planType: 'CHIT' | 'SIP' | 'SCHEME' | 'ORNAMENT';
}

// --- HELPER FUNCTIONS ---
const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
const parseDurationMonths = (durationStr: string): number => parseInt(durationStr, 10) || 1;

const LChitJewelsSavingPlan = () => {
  // --- STATE MANAGEMENT ---
  const [userChitPlans, setUserChitPlans] = useState<ProcessedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('active');
  const [viewedPlan, setViewedPlan] = useState<ProcessedPlan | null>(null);
  const navigate = useNavigate();

  // --- DATA FETCHING from /api/orders/my ---
useEffect(() => {
    const fetchUserPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch enrolled chit plans for the user
        const response = await axiosInstance.get('/api/user-savings/my-enrollments');
        const enrolledPlans = response.data || [];
        // Map the API response to ProcessedPlan[]
        const processed = enrolledPlans.map((plan: any) => {
          const totalAmount = plan.amount || 0;
          const durationMonths = parseDurationMonths(plan.duration || '1');
          const monthlyPayment = durationMonths > 0 ? totalAmount / durationMonths : 0;
          return {
            id: plan.id?.toString() || '',
            name: plan.planName || plan.name || '',
            target: formatCurrency(totalAmount),
            orderId: plan.orderId || plan.id?.toString() || '',
            planType: plan.planType || 'CHIT',
            duration: plan.duration || '',
            amount: formatCurrency(totalAmount),
            paymentMethod: plan.paymentMethod || '',
            customerName: plan.customerName || '',
            customerType: plan.customerType || '',
            createdAt: plan.createdAt || '',
            address: plan.address || '',
            monthly: formatCurrency(monthlyPayment),
            status: (plan.status || '').toLowerCase(),
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
    fetchUserPlans();
  }, []);

  // --- DYNAMIC STATS BASED ON USER ORDERS ---
  const stats = useMemo(() => {
    // These filters now work correctly on the full list of plans
    const active = userChitPlans.filter(p => p.status === 'successful').length;
    const pending = userChitPlans.filter(p => p.status === 'pending').length;
    const rejected = userChitPlans.filter(p => p.status === 'rejected').length;
    return [
      { label: 'Active', count: active, color: 'from-[#7a1335] to-pink-600', icon: CheckCircle },
      { label: 'Pending', count: pending, color: 'from-green-400 to-emerald-500', icon: TrendingUp },
      { label: 'Rejected', count: rejected, color: 'from-rose-400 to-pink-500', icon: ShieldX }
    ];
  }, [userChitPlans]);

  // This will now correctly find and display plans for each tab
  const plansToShow = useMemo(() => {
    if (selectedTab === 'active') return userChitPlans.filter(p => p.status === 'successful');
    if (selectedTab === 'pending') return userChitPlans.filter(p => p.status === 'pending');
    if (selectedTab === 'rejected') return userChitPlans.filter(p => p.status === 'rejected');
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
                        <p className="text-xs text-gray-500">{plan.duration}</p>
                      </div>
                      <div className="w-7 h-7 bg-gray-100 rounded flex-shrink-0"></div>
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-center text-xs"><span className="text-gray-500">Target Amount</span><span className="font-semibold text-gray-800">{plan.target}</span></div>
                      <div className="pt-2 border-t"><div className="flex justify-between items-center text-xs"><span className="text-gray-500">Monthly Payment</span><span className="font-bold text-[#6a0822]">{plan.monthly}</span></div></div>
                    </div>
                    <div className="flex items-center space-x-2 mt-3 pt-2 border-t">
                      <button className="flex-1 bg-gray-100 text-gray-700 py-1.5 px-2 rounded hover:bg-gray-200 transition-colors text-xs font-semibold" onClick={() => setViewedPlan(plan)}>View Details</button>
                    </div>
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
                  <div className="flex justify-between items-center"><span>Status:</span><span className={`font-bold px-2 py-0.5 rounded capitalize ${viewedPlan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : viewedPlan.status === 'successful' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{viewedPlan.status}</span></div>
                  <div className="flex justify-between items-center">
                    <span>Plan Type:</span>
                    <span className="font-semibold">{viewedPlan.planType}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Order ID:</span>
                    <span className="font-semibold">{viewedPlan.orderId}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Total Amount:</span>
                    <span className="font-semibold">₹{viewedPlan.amount}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Monthly Payment:</span>
                    <span className="font-semibold">{viewedPlan.monthly || '-'}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Duration:</span>
                    <span className="font-semibold">{viewedPlan.duration}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Payment Method:</span>
                    <span className="font-semibold">{viewedPlan.paymentMethod}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Customer:</span>
                    <span className="font-semibold">{viewedPlan.customerName}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Customer Type:</span>
                    <span className="font-semibold capitalize">{viewedPlan.customerType}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Start Date:</span>
                    <span className="font-semibold">
                      {new Date(viewedPlan.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-start">
                    <span>Address:</span>
                    <span className="font-semibold text-right max-w-[50%]">{viewedPlan.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default LChitJewelsSavingPlan;