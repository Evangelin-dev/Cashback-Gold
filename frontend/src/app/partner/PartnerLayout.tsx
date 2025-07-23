import React, { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import PartnerNotification from "./partnernotification";

const menuItems = [
  { label: "Dashboard", icon: "📊", path: "/pdashboard" },
  { label: "Profile", icon: "👤", path: "/pprofile" },
  { label: "Referral", icon: "🔗", path: "/preferral" },
  { label: "Marketing", icon: "📢", path: "/pmarketing" },
  { label: "Commission", icon: "%", path: "/pcommission" },
  { label: "Payout", icon: "💰", path: "/ppayout" },
  { label: "Campaigns", icon: "🎯", path: "/pcampaigns" },
  { label: "Leaderboard", icon: "🏆", path: "/pleaderboard" },
  { label: "Support", icon: "🛠️", path: "/psupport" },
  { label: "Logout", icon: "🚪", path: "/" },
];

const SIDEBAR_BG = "#7a1335";
const SIDEBAR_ITEM_ACTIVE = "rgba(255,255,255,0.18)";
const SIDEBAR_ITEM_HOVER = "rgba(255,255,255,0.10)";

const PartnerLayout: React.FC = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showNotificationPage, setShowNotificationPage] = useState(false);
  const notificationBtnRef = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarVisible(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          transition: "transform 0.4s cubic-bezier(.4,2,.6,1), box-shadow 0.2s",
          transform:
            sidebarVisible || window.innerWidth >= 768
              ? "translateX(0)"
              : "translateX(-100%)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          overflow: "hidden",
        }}
        className={`fixed top-0 left-0 h-full transform transition-transform duration-300 ease-in-out z-50
          md:static md:transform-none md:translate-x-0 md:shadow-none md:border-r md:border-gray-200
          ${sidebarVisible ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Sidebar Header */}
        <div style={{
          padding: "1.2rem 1rem 0.8rem 1rem",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(255,255,255,0.04)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: 1, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              display: "inline-block",
              width: 22,
              height: 22,
              background: "rgba(255,255,255,0.13)",
              borderRadius: 8,
              marginRight: 6,
              textAlign: "center",
              lineHeight: "22px",
              fontSize: 14,
              fontWeight: 900,
              color: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              transition: "background 0.2s"
            }}>P</span>
            Partner
          </span>
          <button
            onClick={() => setSidebarVisible(false)}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: "50%",
              width: 24,
              height: 24,
              color: "#fff",
              fontSize: 14,
              display: "block",
              cursor: "pointer",
              transition: "background 0.18s"
            }}
            className="md:hidden"
          >
            ✕
          </button>
        </div>
        {/* Sidebar Menu */}
        <ul style={{ flex: 1, overflowY: "auto", padding: "0.8rem 0" }}>
          {menuItems.map(({ label, icon, path }, idx) => {
            const isActive = window.location.pathname === path;
            return (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => {
                    setSidebarVisible(false);
                    if (path === "/pnotifications") {
                      setShowNotificationPage(true);
                    } else {
                      setShowNotificationPage(false);
                      navigate(path);
                    }
                  }}
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
                    fontWeight: isActive ? 600 : 400,
                    fontSize: 13,
                    borderRadius: 8,
                    marginBottom: 3,
                    marginTop: 3,
                    cursor: "pointer",
                    boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                    transition: "background 0.18s, box-shadow 0.18s, transform 0.18s",
                    transform: isActive ? "scale(1.03)" : "scale(1)",
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = SIDEBAR_ITEM_HOVER)}
                  onMouseOut={e => (e.currentTarget.style.background = isActive ? SIDEBAR_ITEM_ACTIVE : "none")}
                >
                  <span style={{
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    background: isActive ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
                    borderRadius: 6,
                    transition: "background 0.18s"
                  }}>{icon}</span>
                  <span style={{
                    letterSpacing: 0.1,
                    fontWeight: isActive ? 600 : 400,
                    fontSize: 13,
                    transition: "font-weight 0.18s"
                  }}>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div style={{ padding: "1rem", fontSize: 10, color: "#fff", opacity: 0.5, textAlign: "center" }}>
          &copy; {new Date().getFullYear()} Partner Panel
        </div>
      </nav>

      {/* Main Section */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {/* Header */}
           <header className="fixed top-0  w-full md:w-[calc(100%-16rem)]  md:left-64 z-50 bg-gradient-to-r from-[#8B1538] to-[#A91B47] text-white shadow-md h-16 flex justify-between items-center px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              className="text-white text-xl md:hidden hover:bg-white/10 p-2 rounded-lg transition-colors"
              onClick={() => setSidebarVisible(!sidebarVisible)}
            >
              ☰
            </button>
            <h1 className="text-xl font-semibold text-[#7a1335]">Partner Panel</h1>
          </div>
          <div className="relative">
            <button
              ref={notificationBtnRef}
              onClick={() => setShowNotificationPage(true)}
              className="relative bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              🔔
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                3
              </span>
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
    </div>
  );
};

export default PartnerLayout;

