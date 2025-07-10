import { FaArrowRight, FaChartLine, FaCoins, FaCreditCard, FaGem, FaHourglassHalf, FaPiggyBank, FaShoppingCart, FaStar, FaTrophy, FaUsers, FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const summary = [
  { label: "Total Gold Purchased", value: "₹0", subValue: "0g", icon: <FaCoins className="w-6 h-6" />, highlight: true },
  { label: "SIP Accounts", value: "0", subValue: "Active", icon: <FaUsers className="w-6 h-6" /> },
  { label: "Monthly Volume", value: "0g", subValue: "This month", icon: <FaChartLine className="w-6 h-6" /> },
  { label: "Pending Orders", value: "0", subValue: "In queue", icon: <FaHourglassHalf className="w-6 h-6" /> },
  { label: "Wallet Balance", value: "₹0", subValue: "Available", icon: <FaWallet className="w-6 h-6" /> },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 lg:p-8">
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-2 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center space-x-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-[#7a1335] to-[#5a0f26] rounded-xl shadow-lg">
              <FaGem className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-semibold text-[#7a1335] tracking-wide mb-1">B2B Dashboard</h1>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {summary.map((item, idx) => (
            <div
              key={item.label}
              className={`relative rounded-xl p-4 border text-center ${
                item.highlight
                  ? "bg-gradient-to-br from-[#7a1335] via-[#8d1a3d] to-[#a01b42] text-white shadow-lg border-[#7a1335]/20"
                  : "bg-white/80 shadow border-gray-200/50 hover:shadow-lg"
              }`}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl mb-2 ${
                item.highlight 
                  ? "bg-white/20 text-white" 
                  : "bg-gradient-to-br from-[#7a1335]/10 to-[#7a1335]/5 text-[#7a1335]"
              }`}>
                {item.icon}
              </div>
              <div className="space-y-1">
                <p className={`text-xs font-medium uppercase ${
                  item.highlight ? "text-white/70" : "text-gray-500"
                }`}>
                  {item.label}
                </p>
                <div className={`text-lg font-bold ${
                  item.highlight ? "text-white" : "text-[#7a1335]"
                }`}>
                  {item.value}
                </div>
                <div className={`text-xs ${
                  item.highlight ? "text-white/60" : "text-gray-400"
                }`}>
                  {item.subValue}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Welcome Section */}
        <div className="relative bg-gradient-to-r from-[#7a1335] via-[#8d1a3d] to-[#a01b42] rounded-2xl p-6 shadow-xl overflow-hidden mb-8">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px'
            }} />
          </div>
          <div className="relative z-10 text-center">
            <div className="flex justify-center items-center space-x-3 mb-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <FaTrophy className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white tracking-wide">Welcome to Premium Gold Trading</h2>
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <FaStar className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-white/90 text-base font-light max-w-xl mx-auto leading-relaxed">
              Experience luxury investment with our gold trading platform.
            </p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { 
              icon: FaShoppingCart, 
              title: "Gold Purchase", 
              desc: "Buy gold at market rates", 
              buttonText: "Trade",
              accent: "from-[#7a1335] to-[#a01b42]",
              onClick: () => navigate("/bgoldpurchase")
            },
            { 
              icon: FaPiggyBank, 
              title: "SIP Portfolio", 
              desc: "Invest regularly in gold", 
              buttonText: "Create SIP",
              accent: "from-purple-700 to-purple-900",
              onClick: () => navigate("/bsipmanagement")
            },
            { 
              icon: FaCreditCard, 
              title: "Wallet Suite", 
              desc: "Manage your funds", 
              buttonText: "Wallet",
              accent: "from-emerald-700 to-emerald-900",
              onClick: () => navigate("/bwallet")
            }
          ].map((action, idx) => (
            <div 
              key={idx}
              className="group relative bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow border border-gray-200/50 hover:shadow-lg"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${action.accent} shadow`}>
                  <action.icon className="w-7 h-7 text-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-[#7a1335]">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.desc}</p>
                </div>
                <button
                  className={`inline-flex items-center space-x-2 bg-gradient-to-r ${action.accent} text-white font-medium px-4 py-2 rounded-lg shadow hover:shadow-lg`}
                  onClick={action.onClick}
                >
                  <span>{action.buttonText}</span>
                  <FaArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-3 right-3 opacity-20">
                <FaGem className="w-5 h-5 text-[#7a1335]" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Status */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-6 bg-white/90 backdrop-blur-sm rounded-xl px-6 py-3 shadow border border-gray-200/50">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full shadow"></div>
              <span className="font-medium text-gray-700 text-sm">Premium Service Active</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <FaShieldAlt className="w-4 h-4 text-[#7a1335]" />
              <span className="font-medium text-gray-700 text-sm">Bank-Grade Security</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <FaClock className="w-4 h-4 text-[#7a1335]" />
              <span className="font-medium text-gray-700 text-sm">Concierge Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

// Additional luxury icons
const FaShieldAlt = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const FaClock = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);