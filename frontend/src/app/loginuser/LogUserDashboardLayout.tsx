import {
  Bell,
  Building2,
  ChevronRight,
  Coins,
  CreditCard,
  Gem,
  Heart,
  Home,
  LogOut,
  Menu, // Hamburger Icon
  Sprout,
  User,
  Users,
  X // Close Icon
} from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { logoutUser } from '../features/slices/authSlice'; // Ensure this path is correct
import Cart from './Cart/cart';
import LChitJewelsSavingPlan from './DashboardComponents/ChitJewelsSavingPlan';
import LDigitalGoldSIPPlan from './DashboardComponents/DigitalGoldSIPPlan';
import LGoldPlantScheme from './DashboardComponents/GoldPlantScheme';
import LKYC from './DashboardComponents/KYC';
import BankUPIManager from './DashboardComponents/MyBankAccounts';
import LMyDashboard from './DashboardComponents/MyDashboard';
import LMyProfile from './DashboardComponents/MyProfile';
import LNomineeies from './DashboardComponents/Nominee';
import LNotification from './DashboardComponents/Notification';
import Wishlist from './Wishlist/wishlist';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('My Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const menuItems = [
    { id: 'My Dashboard', label: 'My Dashboard', icon: Home },
    { id: 'My Profile', label: 'My Profile', icon: User },
    { id: 'KYC', label: 'KYC', icon: CreditCard },
    { id: 'Nominee', label: 'Nominee', icon: Users },
    { id: 'Saving Scheme ', label: 'Saving Scheme ', icon: Gem },
    { id: 'CashBackGold Scheme ', label: 'CashBackGold Scheme ', icon: Coins },
    { id: 'Gold Plant Scheme ', label: 'Gold Plant Scheme ', icon: Sprout },
    { id: 'Wishlist', label: 'Wishlist', icon: Heart },
    { id: 'Notification', label: 'Notification', icon: Bell },
    { id: 'My Bank Accounts', label: 'My Bank Accounts', icon: Building2 },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
    setShowLogoutConfirm(false);
  };

  const handleMenuClick = (id: string) => {
    setActiveTab(id);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'My Dashboard': return <LMyDashboard/>;
      case 'My Profile': return <LMyProfile/>;
      case 'KYC': return <LKYC/>;
      case 'Nominee': return <LNomineeies/>;
      case 'Saving Scheme ': return <LChitJewelsSavingPlan/>;
      case 'CashBackGold Scheme ': return <LDigitalGoldSIPPlan/>;
      case 'Gold Plant Scheme ': return <LGoldPlantScheme/>;
      case 'Wishlist': return <Wishlist/>;  
      case 'Cart': return <Cart/>;
      case 'Notification': return <LNotification/>;
      case 'My Bank Accounts': return <BankUPIManager/>;
      default: return <LMyDashboard/>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#f8f6fa] shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out sm:static sm:translate-x-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
        }
      >
        <div className="h-16 flex items-center justify-center bg-[#7a1335]">
          <span className="text-white font-bold text-base tracking-wide">User Dashboard</span>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2 py-4 px-3 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`flex items-center w-full rounded-lg text-left text-sm transition-colors duration-150 group h-[52px] px-2
                  ${isActive
                    ? 'bg-[#f7c873] text-[#7a1335] font-semibold shadow-sm'
                    : 'bg-white text-[#585858] hover:bg-[#f7c873]/20'}
                `}
              >
                <span className={`flex items-center justify-center w-10 h-10 rounded-md ${isActive ? 'text-[#7a1335]' : 'text-[#7a1335]'}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className="flex-1 ml-3">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </button>
            );
          })}
        </nav>
        
        {/* Logout Button */}
        <div className="px-3 py-3 border-t border-gray-200">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center w-full rounded-lg text-left text-sm transition-colors duration-150 group h-[52px] px-2 bg-white text-red-600 hover:bg-red-50"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-md text-red-500">
              <LogOut className="w-5 h-5" />
            </span>
            <span className="flex-1 ml-3 font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header for Mobile */}
        <header className="sm:hidden h-16 bg-white shadow-md flex items-center justify-between px-4">
          <button onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-[#7a1335]">{activeTab}</h1>
          <div className="w-6"></div> {/* Spacer */}
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderContent()}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80 text-center">
            <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold"
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

export default Dashboard;