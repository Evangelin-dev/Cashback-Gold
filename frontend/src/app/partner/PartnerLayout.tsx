import React, { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/slices/authSlice'; // Ensure this path is correct for your project
import { RootState } from '../../store'; // Ensure this path is correct for your project
import PartnerNotification from "./partnernotification";

const menuItems = [
  { label: "Dashboard", icon: "📊", path: "/pdashboard" },
  { label: "Profile", icon: "👤", path: "/pprofile" },
  { label: "Referral", icon: "🔗", path: "/preferral" },
  { label: "Marketing", icon: "📢", path: "/pmarketing" },
  { label: "Commission", icon: "%", path: "/pcommission" },
  { label: "Payout", icon: "💰", path: "/ppayout" },
  { label: "Campaigns", icon: "🎯", path: "/pcampaigns" },
  { label: "Support", icon: "🛠️", path: "/psupport" },
  { label: "Logout", icon: "🚪", path: "#" }, // Path is '#' for logout to be handled by onClick
];

const SIDEBAR_BG = "#7a1335";
const SIDEBAR_ITEM_ACTIVE = "rgba(255,255,255,0.18)";
const SIDEBAR_ITEM_HOVER = "rgba(255,255,255,0.10)";

const PartnerLayout: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showNotificationPage, setShowNotificationPage] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // State for logout confirmation

  const notificationBtnRef = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get current user from Redux state
  const { currentUser } = useSelector((state: RootState) => state.auth);

  // Redirect to home if user is not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  // Handle mobile sidebar visibility on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarVisible(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Handler for logout action
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
    setShowLogoutConfirm(false);
  };
  
  // Return null if no user, preventing a flicker before redirect
  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex min-h-screen font-sans bg-gray-50">
      {/* Overlay for mobile */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(0,0,0,0.5)",
          display: sidebarVisible ? "block" : "none",
        }}
        onClick={() => setSidebarVisible(false)}
      ></div>

      {/* Sidebar */}
      <nav
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100%",
          zIndex: 50,
          width: '16rem',
          background: SIDEBAR_BG,
          transition: "transform 0.3s ease-in-out",
          transform: sidebarVisible || window.innerWidth >= 768 ? "translateX(0)" : "translateX(-100%)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
        className="md:static md:transform-none"
      >
        {/* Sidebar Header */}
        <div style={{ padding: "1.2rem 1rem 0.8rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.04)" }}>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: 1, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "inline-block", width: 22, height: 22, background: "rgba(255,255,255,0.13)", borderRadius: 8, marginRight: 6, textAlign: "center", lineHeight: "22px", fontSize: 14, fontWeight: 900 }}>P</span>
            Partner
          </span>
          <button onClick={() => setSidebarVisible(false)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 24, height: 24, color: "#fff", cursor: "pointer" }} className="md:hidden">✕</button>
        </div>

        {/* Sidebar Menu */}
        <ul style={{ flex: 1, overflowY: "auto", padding: "0.8rem 0" }}>
          {menuItems.map(({ label, icon, path }, idx) => {
            const isActive = window.location.pathname === path;
            const handleClick = () => {
              setSidebarVisible(false);
              // Check if the item is Logout
              if (label === 'Logout') {
                setShowLogoutConfirm(true);
              } else if (path === "/pnotifications") { // This path can be used for a dedicated notifications page if needed
                setShowNotificationPage(true);
              } else {
                setShowNotificationPage(false);
                navigate(path);
              }
            };
            return (
              <li key={idx}>
                <button
                  type="button"
                  onClick={handleClick}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "90%",
                    margin: "0 auto",
                    padding: "0.5rem 1rem",
                    background: isActive ? SIDEBAR_ITEM_ACTIVE : "none",
                    border: "none",
                    color: "#fff",
                    fontSize: 13,
                    borderRadius: 8,
                    marginBottom: 3,
                    marginTop: 3,
                    cursor: "pointer",
                    transition: "all 0.18s",
                    transform: isActive ? "scale(1.03)" : "scale(1)",
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = isActive ? SIDEBAR_ITEM_ACTIVE : SIDEBAR_ITEM_HOVER)}
                  onMouseOut={e => (e.currentTarget.style.background = isActive ? SIDEBAR_ITEM_ACTIVE : "none")}
                >
                  <span style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, background: isActive ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)", borderRadius: 6, transition: "background 0.18s" }}>{icon}</span>
                  <span style={{ letterSpacing: 0.1, fontWeight: isActive ? 600 : 400, fontSize: 13 }}>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div style={{ padding: "1rem", fontSize: 10, color: "#fff", opacity: 0.5, textAlign: "center" }}>
          © {new Date().getFullYear()} Partner Panel
        </div>
      </nav>

      {/* Main Section */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {/* Header */}
        <header className="fixed top-0 w-full md:w-[calc(100%-16rem)] md:left-64 z-30 bg-gradient-to-r from-[#8B1538] to-[#A91B47] text-white shadow-md h-16 flex justify-between items-center px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              className="text-white text-xl md:hidden hover:bg-white/10 p-2 rounded-lg transition-colors"
              onClick={() => setSidebarVisible(!sidebarVisible)}
            >
              ☰
            </button>
            {/* CORRECTED: Title color is now white */}
            <h1 className="text-xl font-semibold text-white">Partner Panel</h1>
          </div>
          <div className="relative">
            <button
              ref={notificationBtnRef}
              onClick={() => setShowNotificationPage(true)}
              className="relative bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              🔔
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">3</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="mt-16 p-2 sm:p-4 md:p-6 flex-1 min-w-0">
          <div className="w-full max-w-screen-l mx-auto">
            {showNotificationPage ? (
              <div>
                <button
                  className="mb-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                  onClick={() => setShowNotificationPage(false)}
                >
                  ← Back
                </button>
                <PartnerNotification />
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>

      {/* --- LOGOUT CONFIRMATION POPUP --- */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 top-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm m-4 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-6 py-2 rounded-md font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerLayout;