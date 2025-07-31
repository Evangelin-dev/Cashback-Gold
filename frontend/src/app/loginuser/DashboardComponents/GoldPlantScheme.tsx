import { Calendar, CheckCircle, ShieldX, Sparkles, Star, TrendingUp, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance'; // Make sure this path is correct
import Portal from '../../user/Portal';

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
  amount: string;
  duration: string;
  status: string;
  orderId: string;
  planType: 'CHIT' | 'SIP' | 'SCHEME' | 'ORNAMENT';
  paymentMethod: string;
  customerName: string;
  customerType: 'user' | 'b2b' | 'partner' | 'admin';
  createdAt: string;
  address: string;
}

// --- HELPER FUNCTION ---
const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

const LGoldPlantScheme = () => {
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [userSchemePlans, setUserSchemePlans] = useState<ProcessedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('active');
  const [viewedPlan, setViewedPlan] = useState<ProcessedPlan | null>(null);

  // --- DATA FETCHING from /api/orders/my ---
  useEffect(() => {
    const fetchUserSchemes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get<OrderFromApi[]>('/api/orders/my');
        // Filter for SCHEME plans only
        const schemeOrders = (response.data || []).filter(order => order.planType === 'SCHEME');

        const processed = schemeOrders.map((order): ProcessedPlan => ({
          id: order.orderId,
          name: order.planName,
          amount: formatCurrency(order.amount),
          duration: order.duration,
          status: order.status.toLowerCase(),
          orderId: order.orderId,
          planType: order.planType,
          paymentMethod: order.paymentMethod,
          customerName: order.customerName,
          customerType: order.customerType,
          createdAt: order.createdAt,
          address: order.address,
        }));
        setUserSchemePlans(processed);
      } catch (err) {
        console.error("Failed to fetch user schemes:", err);
        setError("Could not load your Gold Plant Schemes at this time.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserSchemes();
  }, []);

  // --- DYNAMIC STATS BASED ON USER ORDERS ---
  const stats = useMemo(() => {
    const active = userSchemePlans.filter(p => p.status === 'successful').length;
    const pending = userSchemePlans.filter(p => p.status === 'pending').length;
    const rejected = userSchemePlans.filter(p => p.status === 'rejected').length;
    return [
      { label: 'Active', count: active, color: 'from-emerald-400 to-emerald-600', icon:  CheckCircle },
      { label: 'Pending', count: pending, color: 'from-blue-400 to-blue-600', icon: TrendingUp },
      { label: 'Rejected', count: rejected, color: 'from-red-400 to-red-600', icon: ShieldX },
    ];
  }, [userSchemePlans]);

  const plansToShow = useMemo(() => {
    if (selectedTab === 'active') return userSchemePlans.filter(p => p.status === 'successful');
    if (selectedTab === 'pending') return userSchemePlans.filter(p => p.status === 'pending');
    if (selectedTab === 'rejected') return userSchemePlans.filter(p => p.status === 'rejected');
    return [];
  }, [selectedTab, userSchemePlans]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-[#6a0822] rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-[#6a0822]">Gold Plant Scheme</h1>
        </div>
        <p className="text-gray-600 text-xs max-w-xl mx-auto">Review your purchased Gold Plant Scheme investments.</p>
      </div>

      {/* Stats Cards */}
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

      {/* Main Content */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#6a0822] capitalize">{selectedTab} Plans</h2>
          <div className="flex items-center space-x-1 text-xs text-gray-500"><Calendar className="w-3 h-3" /><span>Updated today</span></div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500 text-sm">Loading your schemes...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-600 bg-red-50 rounded-xl p-4 text-sm">{error}</div>
        ) : plansToShow.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {plansToShow.map((plan) => (
              <div key={plan.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">{plan.name}</h3>
                    <p className="text-xs text-gray-500">{plan.duration}</p>
                  </div>
                  <div className="w-7 h-7 bg-gray-100 rounded flex-shrink-0"></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Investment Amount</span>
                    <span className="font-semibold text-gray-800">{plan.amount}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-auto pt-2 border-t">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-1.5 px-2 rounded hover:bg-gray-200 transition-colors text-xs font-semibold" onClick={() => setViewedPlan(plan)}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2"><Star className="w-5 h-5 text-gray-400" /></div>
            <h3 className="text-base font-medium text-[#6a0822]">No {selectedTab} Plans</h3>
            <p className="text-gray-600 text-xs">You do not have any {selectedTab} gold plant schemes.</p>
          </div>
        )}
      </div>

      {/* --- VIEW DETAILS POPUP --- */}
      {viewedPlan && (
        <Portal>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2">
            <div className="bg-white rounded-xl p-4 max-w-xs w-full mx-auto relative shadow-xl">
              <button onClick={() => setViewedPlan(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><X size={18} /></button>
              <div className="text-center"><h3 className="text-lg font-bold text-[#6a0822] mb-2">{viewedPlan.name}</h3></div>
              <div className="space-y-2 bg-gray-50 p-2 rounded text-xs text-gray-600">
                <div className="flex justify-between items-center"><span>Status:</span><span className={`font-bold px-2 py-0.5 rounded capitalize ${viewedPlan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : viewedPlan.status === 'successful' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{viewedPlan.status}</span></div>
                <div className="flex justify-between items-center"><span>Plan Type:</span><span className="font-semibold">{viewedPlan.planType}</span></div>
                <div className="flex justify-between items-center"><span>Order ID:</span><span className="font-semibold">{viewedPlan.orderId}</span></div>
                <div className="flex justify-between items-center"><span>Total Amount:</span><span className="font-semibold">{viewedPlan.amount}</span></div>
                <div className="flex justify-between items-center"><span>Duration:</span><span className="font-semibold">{viewedPlan.duration}</span></div>
                <div className="flex justify-between items-center"><span>Payment Method:</span><span className="font-semibold">{viewedPlan.paymentMethod}</span></div>
                <div className="flex justify-between items-center"><span>Customer:</span><span className="font-semibold">{viewedPlan.customerName}</span></div>
                <div className="flex justify-between items-center"><span>Start Date:</span><span className="font-semibold">{new Date(viewedPlan.createdAt).toLocaleDateString()}</span></div>
                <div className="flex justify-between items-start text-left"><span className="flex-shrink-0 mr-2">Address:</span><span className="font-semibold text-right">{viewedPlan.address}</span></div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default LGoldPlantScheme;