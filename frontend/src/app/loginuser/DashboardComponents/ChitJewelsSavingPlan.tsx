import React, { useEffect, useMemo, useState } from 'react';
import { Gem, TrendingUp, Calendar, Target, Eye, X, ShieldX, CheckCircle, ChevronRight, Star } from 'lucide-react';
import axiosInstance from '../../../utils/axiosInstance'; // Make sure this path is correct
import Portal from '../../user/Portal'; // Make sure this path is correct
import { useNavigate } from 'react-router-dom';

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
        const response = await axiosInstance.get<OrderFromApi[]>('/api/orders/my');
        const chitOrders = (response.data || []).filter(order => order.planType === 'CHIT');

        // --- FIX: Process ALL fetched chit orders, don't pre-filter by status ---
        const processed = chitOrders.map((order): ProcessedPlan => {
          const totalAmount = order.amount;
          const durationMonths = parseDurationMonths(order.duration);
          const monthlyPayment = durationMonths > 0 ? totalAmount / durationMonths : 0;
          return {
            id: order.orderId,
            name: order.planName,
            target: formatCurrency(totalAmount),
            orderId: order.orderId,
            planType: order.planType,
            duration: order.duration,
            amount: formatCurrency(totalAmount),
            paymentMethod: order.paymentMethod,
            customerName: order.customerName,
            customerType: order.customerType,
            createdAt: order.createdAt,
            address: order.address,
            monthly: formatCurrency(monthlyPayment),
            status: order.status.toLowerCase(), // Status will be 'pending', 'successful', etc.
          };
        });

        setUserChitPlans(processed); // Set the full list of chit plans

      } catch (err) {
        console.error("Failed to fetch user Chit plans:", err);
        setError("Could not load your saving plans at this time.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserPlans();
  }, []);

  // --- DYNAMIC STATS BASED ON USER ORDERS ---
  const stats = useMemo(() => {
    // These filters now work correctly on the full list of plans
    const active = userChitPlans.filter(p => p.status === 'pending').length;
    const completed = userChitPlans.filter(p => p.status === 'successful').length;
    const rejected = userChitPlans.filter(p => p.status === 'rejected').length;
    return [
      { label: 'Active', count: active, color: 'from-[#7a1335] to-pink-600', icon: TrendingUp },
      { label: 'Successful', count: completed, color: 'from-green-400 to-emerald-500', icon: CheckCircle },
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8"><div className="flex items-center justify-between"><div className="flex items-center space-x-4"><div className="w-12 h-12 bg-gradient-to-tr from-[#7a1335] to-rose-500 rounded-xl flex items-center justify-center shadow-lg"><Gem className="w-6 h-6 text-white" /></div><div><h1 className="text-2xl font-bold text-gray-800">Chit Jewels</h1><p className="text-sm text-gray-500">My Saving Plans</p></div></div></div></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className={`relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group ${selectedTab === stat.label.toLowerCase() ? 'ring-2 ring-[#7a1335]' : ''}`} onClick={() => setSelectedTab(stat.label.toLowerCase())}>
              <div className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r ${stat.color} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-300`}></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between"><div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-md`}><stat.icon className="w-6 h-6 text-white" /></div><ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" /></div>
                <div className="mt-4"><p className="text-3xl font-bold text-gray-800">{stat.count}</p><p className="text-sm font-medium text-gray-500">{stat.label}</p></div>
              </div>
            </div>
          ))}
        </div>

        {loading ? (<div className="text-center py-20 text-gray-500">Loading your plans...</div>) :
          error ? (<div className="text-center py-20 text-red-600 bg-red-50 rounded-2xl p-6">{error}</div>) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#7a1335] capitalize">{selectedTab} Saving Plans</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500"><Calendar className="w-4 h-4" /><span>Updated today</span></div>
              </div>
              {plansToShow.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {plansToShow?.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div><h3 className="text-lg font-bold text-gray-800">{plan.name}</h3><p className="text-sm text-gray-500">{plan.duration}</p></div><div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm"><span className="text-gray-500">Target Amount</span><span className="font-semibold text-gray-800">{plan.target}</span></div>
                        <div className="pt-3 border-t"><div className="flex justify-between items-center text-sm"><span className="text-gray-500">Monthly Payment</span><span className="font-bold text-[#7a1335] text-base">{plan.monthly}</span></div></div>
                      </div>
                      <div className="flex items-center space-x-3 mt-auto pt-4 border-t">
                        <button className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold" onClick={() => setViewedPlan(plan)}>View Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center"><div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Star className="w-8 h-8 text-gray-400" /></div><h3 className="text-lg font-medium text-[#7a1335]">No {selectedTab} Plans</h3><p className="text-gray-600">You do not have any {selectedTab} saving plans.</p></div>
              )}
            </div>
          )}
      </div>

      {/* --- VIEW DETAILS POPUP --- */}
      {viewedPlan && (
        <Portal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-auto relative shadow-xl">
              <button
                onClick={() => setViewedPlan(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-[#7a1335] mb-4">{viewedPlan.name}</h3>

                <div className="space-y-3 bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                  <div className="flex justify-between items-center"><span>Status:</span><span className={`font-bold text-sm px-2 py-1 rounded capitalize ${viewedPlan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : viewedPlan.status === 'successful' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{viewedPlan.status}</span></div>
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