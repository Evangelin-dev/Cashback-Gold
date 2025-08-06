import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../utils/axiosInstance'; // Adjust path if needed

// --- Type Definitions for API Response ---
interface QuickStat {
  label: string;
  value: string;
  icon: string;
}

interface Kpi {
  label: string;
  value: string;
  trend: string;
  icon: string;
  color: string;
  borderColor: string;
}

interface Achievement {
  key: string;
  title: string;
  desc: string;
  achieved: boolean;
}

interface DashboardData {
  quickStats: QuickStat[];
  kpis: Kpi[];
  availableBalance: string;
  achievements: Achievement[];
}

// --- Loading Skeleton Component ---
const SkeletonLoader = () => (
  <div className="min-h-screen bg-gray-50 p-4 lg:p-8 animate-pulse">
    <div className="mb-8">
      <div className="h-10 bg-gray-200 rounded w-1/3 mb-3"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div className="h-24 bg-gray-200 rounded-2xl"></div>
      <div className="h-24 bg-gray-200 rounded-2xl"></div>
      <div className="h-24 bg-gray-200 rounded-2xl"></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
      <div className="h-40 bg-gray-200 rounded-3xl"></div>
      <div className="h-40 bg-gray-200 rounded-3xl"></div>
      <div className="h-40 bg-gray-200 rounded-3xl"></div>
    </div>
  </div>
);

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get<DashboardData>('/partner/dashboard');
        setDashboardData(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Could not load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }
  
  // Render the component only when data is available
  if (!dashboardData) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">No data available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-light text-gray-900 mb-2">
              Partner Dashboard
            </h1>
            <p className="text-gray-600 text-lg font-light">Performance overview and insights</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {dashboardData.quickStats.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-200/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
                <div className="w-10 h-10 bg-[#7a1335]/10 rounded-xl flex items-center justify-center">
                  <i className={`${stat.icon} text-[#7a1335] text-sm`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {dashboardData.kpis.map((kpi, i) => (
          <div 
            key={i} 
            className="group bg-white rounded-3xl p-6 border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-6">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${kpi.color} ${kpi.borderColor} border flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <i className={`${kpi.icon} text-[#7a1335] text-lg`}></i>
              </div>
              <div className={`text-xs font-medium px-3 py-1 rounded-full ${
                kpi.trend.startsWith('+') 
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {kpi.trend}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900 tracking-tight">
                {kpi.value}
              </div>
              <div className="text-gray-600 font-medium">{kpi.label}</div>
            </div>
            <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${kpi.color.replace('/20', '/50')} w-0 group-hover:w-full transition-all duration-500`}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-8 border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
          onClick={() => navigate("/ppayout")}
        >
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-[#7a1335]/10 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-[#7a1335]/20 transition-colors">
              <i className="fas fa-wallet text-[#7a1335] text-xl"></i>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Request Payout</h3>
              <p className="text-gray-600">Withdraw your available earnings</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">{dashboardData.availableBalance}</div>
              <div className="text-sm text-gray-500">Available balance</div>
            </div>
            <i className="fas fa-arrow-right text-[#7a1335] group-hover:translate-x-1 transition-transform"></i>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
          onClick={() => navigate("/preferral")}
        >
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-blue-500/20 transition-colors">
              <i className="fas fa-share-alt text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Share & Earn</h3>
              <p className="text-gray-600">Generate your referral link</p>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">Generate</div>
              <div className="text-sm text-gray-500">Referral link</div>
            </div>
            <i className="fas fa-arrow-right text-blue-600 group-hover:translate-x-1 transition-transform"></i>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-200/50 shadow-sm">
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 bg-yellow-500/20 rounded-xl flex items-center justify-center mr-3">
            <i className="fas fa-trophy text-yellow-600 text-lg"></i>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Achievements</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {dashboardData.achievements.map((ach) => (
            <div 
              key={ach.key}
              className={`p-6 rounded-2xl ${
                ach.achieved 
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200/50' 
                  : 'bg-gray-50 border border-gray-200/50'
              }`}
            >
              <div className="flex items-center mb-3">
                <i className={`fas ${ach.achieved ? 'fa-trophy text-yellow-600' : 'fa-bullseye text-gray-400'} text-lg mr-2`}></i>
                <span className={`font-semibold ${ach.achieved ? 'text-gray-900' : 'text-gray-500'}`}>{ach.title}</span>
                {ach.achieved ? (
                  <i className="fas fa-check-circle text-green-500 ml-auto"></i>
                ) : (
                  <div className="ml-auto w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                )}
              </div>
              <p className={`text-sm ${ach.achieved ? 'text-gray-600' : 'text-gray-500'}`}>{ach.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;