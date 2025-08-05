import { FaGift, FaLink, FaQuestionCircle, FaRupeeSign, FaSignOutAlt, FaTachometerAlt, FaTrophy, FaUserCircle, FaWallet } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { to: "/pdashboard", label: "Dashboard", icon: <FaTachometerAlt className="w-5 h-5 mr-2" /> },
  { to: "/preferral", label: "Referral Link", icon: <FaLink className="w-5 h-5 mr-2" /> },
  { to: "/pcommission", label: "Commission", icon: <FaRupeeSign className="w-5 h-5 mr-2" /> },
  { to: "/ppayout", label: "Payout", icon: <FaWallet className="w-5 h-5 mr-2" /> },
  { to: "/pcampaigns", label: "Campaigns", icon: <FaGift className="w-5 h-5 mr-2" /> },
  { to: "/psupport", label: "Support", icon: <FaQuestionCircle className="w-5 h-5 mr-2" /> },
  { to: "/pprofile", label: "Profile & KYC", icon: <FaUserCircle className="w-5 h-5 mr-2" /> },
  { to: "/pnotifications", label: "Notification", icon: <FaUserCircle className="w-5 h-5 mr-2" /> },
];

const logoutItem = { to: "/", label: "Back to User", icon: <FaSignOutAlt className="w-5 h-5 mr-2" /> };

const PartnerSideNav = () => {
  const location = useLocation();
  const current = location.pathname;

  return (
    <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col h-screen fixed top-0 left-0 z-30">
      <div className="h-16 flex items-center justify-center font-bold text-xl text-[#7a1335]">
        Partner Panel
      </div>
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = current === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center px-4 py-2 rounded transition font-medium ${
                isActive
                  ? "bg-[#7a1335] text-white font-bold shadow scale-105"
                  : "hover:bg-[#7a1335]/10 text-[#7a1335]"
              }`}
              style={isActive ? { fontWeight: 700 } : {}}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 mt-auto">
        <Link
          to={logoutItem.to}
          className="flex items-center px-4 py-2 rounded transition font-medium text-[#7a1335] hover:bg-[#7a1335]/10 hover:text-white"
        >
          {logoutItem.icon}
          {logoutItem.label}
        </Link>
      </div>
      <div className="mb-4 text-[10px] text-[#7a1335] text-center opacity-60">
        &copy; {new Date().getFullYear()} Partner Panel
      </div>
    </aside>
  );
}

export default PartnerSideNav;
