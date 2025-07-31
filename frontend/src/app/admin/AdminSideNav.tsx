import { FaBell, FaBoxes, FaIdCard, FaLeaf, FaMoneyCheckAlt, FaPercent, FaPiggyBank, FaSignOutAlt, FaTachometerAlt, FaUniversity, FaUser, FaWallet } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { to: "/admin", label: "My Dashboard", icon: <FaTachometerAlt className="w-5 h-5 mr-2" /> },
  { to: "/adminprofile", label: "My Profil", icon: <FaUser className="w-5 h-5 mr-2" /> },
  { to: "/manageornaments", label: "Manage Ornaments", icon: <FaBoxes className="w-5 h-5 mr-2" /> },
  { to: "/manageusers", label: "Manage User's", icon: <FaBoxes className="w-5 h-5 mr-2" /> },
  { to: "/commission", label: "Commission", icon: <FaPercent className="w-5 h-5 mr-2" /> },
  { to: "/payoutrequest", label: "Payout Request", icon: <FaMoneyCheckAlt className="w-5 h-5 mr-2" /> },
  { to: "/kyc", label: "KYC", icon: <FaIdCard className="w-5 h-5 mr-2" /> },
  // { to: "/beneficiaries", label: "Beneficiaries", icon: <FaUsers className="w-5 h-5 mr-2" /> },
  { to: "/savingplan", label: "Chit Jewels Saving Plan", icon: <FaPiggyBank className="w-5 h-5 mr-2" /> },
  { to: "/spiplan", label: "Digital Gold SIP Plan", icon: <FaWallet className="w-5 h-5 mr-2" /> },
  { to: "/plantscheme", label: "Gold Plant Scheme", icon: <FaLeaf className="w-5 h-5 mr-2" /> },
  { to: "/notification", label: "Notification", icon: <FaBell className="w-5 h-5 mr-2" /> },
  { to: "/mybankaccounts", label: "My Bank Accounts", icon: <FaUniversity className="w-5 h-5 mr-2" /> },
];

const logoutItem = { to: "/", label: "Logout", icon: <FaSignOutAlt className="w-5 h-5 mr-2" /> };

export default function AdminSideNav() {
  const location = useLocation();
  const current = location.pathname;

  return (
    <aside className="w-64 bg-white shadow-lg hidden md:flex flex-col h-screen fixed top-0 left-0 z-30">
      <div className="h-16 flex items-center justify-center font-bold text-xl text-[#7a1335]">
        Admin Panel
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
        &copy; {new Date().getFullYear()} Admin Panel
      </div>
    </aside>
  );
}