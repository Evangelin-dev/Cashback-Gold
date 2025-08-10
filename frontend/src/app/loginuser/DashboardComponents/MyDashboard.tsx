import {
  Calendar,
  Coins,
  DollarSign,
  EyeOff,
  Shield,
  Star,
  TrendingUp
} from 'lucide-react';
import { JSX, useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';

type InvestmentPlan = {
  id: number;
  name: string;
  icon: JSX.Element;
  description: string;
  currentValue: string;
  monthlyContribution: string;
  duration: string;
  returns: string;
  gradient: string;
  bgPattern: string;
};

const LMyDashboard = () => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [showAddPlanForm, setShowAddPlanForm] = useState(false);
  const [hideAmounts, setHideAmounts] = useState(false);
  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>([
    {
      id: 1,
      name: 'Chit Jewels Saving Plan',
      icon: <Star className="w-8 h-8" />,
      description: 'Traditional jewelry savings with guaranteed returns',
      currentValue: '₹45,280',
      monthlyContribution: '₹2,500',
      duration: '24 months',
      returns: '12.5% p.a.',
      gradient: 'from-yellow-400 to-yellow-600',
      bgPattern: 'bg-gradient-to-br from-yellow-50 to-amber-50',
    },
    {
      id: 2,
      name: 'Cashback Gold',
      icon: <Coins className="w-8 h-8" />,
      description: 'Systematic investment in pure digital gold',
      currentValue: '₹28,750',
      monthlyContribution: '₹1,500',
      duration: '36 months',
      returns: 'Market linked',
      gradient: 'from-orange-400 to-yellow-500',
      bgPattern: 'bg-gradient-to-br from-orange-50 to-yellow-50',
    },
    {
      id: 3,
      name: 'Gold Plant Scheme',
      icon: <TrendingUp className="w-8 h-8" />,
      description: 'Long-term gold accumulation strategy',
      currentValue: '₹67,890',
      monthlyContribution: '₹3,000',
      duration: '60 months',
      returns: '15.2% p.a.',
      gradient: 'from-amber-400 to-orange-500',
      bgPattern: 'bg-gradient-to-br from-amber-50 to-orange-50',
    },
  ]);

  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    currentValue: '',
    monthlyContribution: '',
    duration: '',
    returns: '',
    planType: 'gold'
  });

  const [totalPortfolioValue, setTotalPortfolioValue] = useState('₹0');
  const [totalMonthlyInvestment, setTotalMonthlyInvestment] = useState('₹0');

  useEffect(() => {
    // Fetch total portfolio value
    axiosInstance.get<{ totalInvestment: number }>('/user/my-investment/total')
      .then((res: { data: { totalInvestment: number } }) => {
        if (res.data && typeof res.data.totalInvestment === 'number') {
          setTotalPortfolioValue(`₹${res.data.totalInvestment}`);
        }
      })
      .catch(() => {
        setTotalPortfolioValue('₹0');
      });

    // Fetch current month investment value
    axiosInstance.get<{ currentMonthInvestment: number }>('/user/my-investment/current-month')
      .then((res: { data: { currentMonthInvestment: number } }) => {
        if (res.data && typeof res.data.currentMonthInvestment === 'number') {
          setTotalMonthlyInvestment(`₹${res.data.currentMonthInvestment}`);
        }
      })
      .catch(() => {
        setTotalMonthlyInvestment('₹0');
      });
  }, []);

  const formatAmount = (amount: string) => {
    return hideAmounts ? '₹****' : amount;
  };

  const handleAddPlan = () => {
    if (!newPlan.name || !newPlan.description || !newPlan.currentValue || !newPlan.monthlyContribution || !newPlan.duration || !newPlan.returns) {
      alert('Please fill in all fields');
      return;
    }
    
    const planTypeConfigs = {
      gold: {
        icon: <Coins className="w-8 h-8" />,
        gradient: 'from-amber-400 to-orange-500',
        bgPattern: 'bg-gradient-to-br from-amber-50 to-orange-50',
      },
      jewelry: {
        icon: <Star className="w-8 h-8" />,
        gradient: 'from-yellow-400 to-yellow-600',
        bgPattern: 'bg-gradient-to-br from-yellow-50 to-amber-50',
      },
      sip: {
        icon: <TrendingUp className="w-8 h-8" />,
        gradient: 'from-green-400 to-emerald-500',
        bgPattern: 'bg-gradient-to-br from-green-50 to-emerald-50',
      }
    };

    const config = planTypeConfigs[newPlan.planType as keyof typeof planTypeConfigs];
    
    const newInvestmentPlan: InvestmentPlan = {
      id: Date.now(),
      name: newPlan.name,
      icon: config.icon,
      description: newPlan.description,
      currentValue: `₹${newPlan.currentValue}`,
      monthlyContribution: `₹${newPlan.monthlyContribution}`,
      duration: `${newPlan.duration} months`,
      returns: `${newPlan.returns}% p.a.`,
      gradient: config.gradient,
      bgPattern: config.bgPattern,
    };

    setInvestmentPlans([...investmentPlans, newInvestmentPlan]);
    setNewPlan({
      name: '',
      description: '',
      currentValue: '',
      monthlyContribution: '',
      duration: '',
      returns: '',
      planType: 'gold'
    });
    setShowAddPlanForm(false);
  };

  return (
    <div className="min-h-screen bg-white p-2">
      <div className="max-w-3xl mx-auto">

        {/* Header Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-bold text-[#6a0822] tracking-tight">My Dashboard</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHideAmounts(!hideAmounts)}
                className={`rounded-full p-2 shadow border border-gray-100 transition-all duration-200 ${
                  hideAmounts 
                    ? 'bg-[#6a0822] text-white' 
                    : 'bg-white text-[#6a0822] hover:bg-gray-50'
                }`}
              >
                {hideAmounts ? <EyeOff className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
              </button>
              <div className="bg-[#6a0822] text-white px-3 py-1 rounded-full text-xs font-medium">
                Premium Member
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-xs">
            Track and manage your gold investment portfolio
          </p>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="grid md:grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl p-4 shadow border border-gray-100 min-h-[140px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-gray-800">Total Portfolio Value</h3>
              <DollarSign className="w-5 h-5 text-[#6a0822]" />
            </div>
            <div className="text-xl font-bold text-[#6a0822] mb-1">{formatAmount(totalPortfolioValue)}</div>
            
          </div>

          <div className="bg-white rounded-xl p-4 shadow border border-gray-100 min-h-[140px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold text-gray-800">Monthly Investment</h3>
              <Calendar className="w-5 h-5 text-[#6a0822]" />
            </div>
            <div className="text-xl font-bold text-[#6a0822] mb-1">{formatAmount(totalMonthlyInvestment)}</div>
            {/* <div className="text-xs text-gray-600">Across {investmentPlans.length} active plans</div> */}
          </div>
        </div>

        {/* Investment Plans */}
        {/* <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800">Your Investment Plans</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {investmentPlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-xl p-4 shadow border border-gray-100 relative cursor-pointer hover:shadow-lg transition-all duration-200`}
                onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
              >
                <div className="relative z-10"> */}
                  {/* Plan Header */}
                  {/* <div className="flex items-center justify-between mb-2">
                    <div className="bg-[#6a0822] p-2 rounded text-white shadow">
                      {plan.icon}
                    </div>
                    <button className="bg-white p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </div> */}

                  {/* Plan Info */}
                  {/* <h3 className="text-base font-bold text-gray-800 mb-1">{plan.name}</h3>
                  <p className="text-gray-600 text-xs mb-2 leading-relaxed">{plan.description}</p> */}

                  {/* Current Value */}
                  {/* <div className="bg-gray-50 rounded p-2 mb-2">
                    <div className="text-lg font-bold text-[#6a0822] mb-0.5">{formatAmount(plan.currentValue)}</div>
                    <div className="text-xs text-gray-600">Current Value</div>
                  </div> */}

                  {/* Plan Stats */}
                  {/* <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white rounded p-2 border border-gray-100">
                      <div className="font-semibold text-gray-800">{formatAmount(plan.monthlyContribution)}</div>
                      <div className="text-gray-600">Monthly SIP</div>
                    </div>
                    <div className="bg-white rounded p-2 border border-gray-100">
                      <div className="font-semibold text-gray-800">{plan.returns}</div>
                      <div className="text-gray-600">Returns</div>
                    </div>
                  </div> */}

                  {/* Duration Badge */}
                  {/* <div className="mt-2 inline-flex items-center bg-[#6a0822] text-white px-2 py-0.5 rounded-full text-xs font-medium">
                    {plan.duration} plan
                  </div> */}

                  {/* Expanded View */}
                  {/* {selectedPlan === plan.id && (
                    <div className="mt-2 bg-gray-50 rounded p-2 border border-gray-100">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-gray-600">Total Invested</div>
                          <div className="font-semibold">{formatAmount('₹35,000')}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Profit/Loss</div>
                          <div className="font-semibold text-green-600">{formatAmount('+₹8,280')}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Next SIP</div>
                          <div className="font-semibold">July 15, 2025</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Gold Weight</div>
                          <div className="font-semibold">12.5g</div>
                        </div>
                      </div>
                      <button className="w-full mt-2 bg-[#6a0822] text-white py-1.5 rounded hover:bg-[#4a0617] text-xs">
                        View Detailed Report
                      </button>
                    </div>
                  )} */}
                </div>
              </div>
        //     ))}
        //   </div>
        // </div>

        
    //   </div>


    // </div>
  );
};

export default LMyDashboard;