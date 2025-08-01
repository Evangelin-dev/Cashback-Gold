import { FaBell, FaIdCard, FaLeaf, FaPiggyBank, FaSignOutAlt, FaTachometerAlt, FaUniversity, FaUser, FaUsers, FaWallet, FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const menuItems = [
  { to: "/user", label: "My Dashboard", icon: <FaTachometerAlt className="w-5 h-5" /> },
  { to: "/userprofile", label: "My Profile", icon: <FaUser className="w-5 h-5" /> },
  { to: "/userkyc", label: "KYC", icon: <FaIdCard className="w-5 h-5" /> },
  { to: "/userbeneficiaries", label: "Beneficiaries", icon: <FaUsers className="w-5 h-5" /> },
  { to: "/usersavingplan", label: "Saving Scheme", icon: <FaPiggyBank className="w-5 h-5" /> },
  { to: "/userspiplan", label: "CashBack Gold Scheme", icon: <FaWallet className="w-5 h-5" /> },
  { to: "/userplantscheme", label: "Gold Plant Scheme", icon: <FaLeaf className="w-5 h-5" /> },
  { to: "/usernotification", label: "Notification", icon: <FaBell className="w-5 h-5" /> },
  { to: "/usermybankaccounts", label: "My Bank Accounts", icon: <FaUniversity className="w-5 h-5" /> },
];

const logoutItem = { to: "/", label: "Logout", icon: <FaSignOutAlt className="w-5 h-5" /> };

export default function LogUserSideNav() {
  const location = useLocation();
  const current = location.pathname;
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-3 bg-[#7a1335] text-white rounded-xl shadow-lg hover:bg-[#5d0f28] transition-all duration-300 hover:scale-105"
      >
        {isOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen bg-gradient-to-b from-white via-gray-50 to-white shadow-2xl transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 w-72 md:w-64
      `}>
        {/* Header */}
        <div className="h-20 flex items-center justify-center bg-gradient-to-r from-[#7a1335] to-[#9d1a42] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#7a1335]/20 to-[#9d1a42]/20 animate-pulse"></div>
          <div className="relative z-10">
            <h2 className="text-white font-bold text-lg tracking-wide">User Dashboard</h2>
            <div className="w-16 h-1 bg-white/30 mx-auto mt-1 rounded-full"></div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive = current === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={`
                    group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105
                    ${isActive 
                      ? "bg-gradient-to-r from-[#7a1335] to-[#9d1a42] text-white shadow-lg shadow-[#7a1335]/25" 
                      : "hover:bg-gradient-to-r hover:from-[#7a1335]/10 hover:to-[#9d1a42]/10 text-[#7a1335] hover:shadow-md"
                    }
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`
                    p-2 rounded-lg transition-all duration-300
                    ${isActive 
                      ? "bg-white/20 shadow-inner" 
                      : "group-hover:bg-[#7a1335]/20"
                    }
                  `}>
                    {item.icon}
                  </div>
                  <span className={`font-medium transition-all duration-300 ${isActive ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-200">
          <Link
            to={logoutItem.to}
            onClick={() => setIsOpen(false)}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-[#7a1335] hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-600 transform hover:scale-105"
          >
            <div className="p-2 rounded-lg transition-all duration-300 group-hover:bg-red-100">
              {logoutItem.icon}
            </div>
            <span className="font-medium">{logoutItem.label}</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="p-4 text-center">
          <div className="text-xs text-[#7a1335]/60 font-medium">
            &copy; {new Date().getFullYear()} Admin Panel
          </div>
          <div className="w-12 h-1 bg-gradient-to-r from-[#7a1335]/20 to-[#9d1a42]/20 mx-auto mt-2 rounded-full"></div>
        </div>
      </aside>

      {/* Main Content Spacer */}
      <div className="md:ml-64"></div>
    </>
  );
}