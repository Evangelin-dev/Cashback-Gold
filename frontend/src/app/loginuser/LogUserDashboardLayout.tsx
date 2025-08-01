import {
  Bell,
  Building2,
  ChevronRight,
  Coins,
  CreditCard,
  Gem,
  Heart,
  Home,
  Sprout,
  User,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('My Dashboard');
  const navigate = useNavigate();
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

  const renderDashboard = () => (
    <LMyDashboard/>
  );

  const renderProfile = () => (
    <LMyProfile/>
  );

  const renderKYC = () => (
    <LKYC/>
  );

  const renderNominee = () => (
    <LNomineeies/>
  );

  const renderSavingPlan = () => (
    <LChitJewelsSavingPlan/>
  );

  const renderDigitalGold = () => (
    <LDigitalGoldSIPPlan/>
  );

  const renderGoldPlant = () => (
    <LGoldPlantScheme/>
  );

  const renderNotification = () => (
    <LNotification/>
  );

  const renderBankAccounts = () => (
    <BankUPIManager/>
  );

  const renderWishlist = () => (
    <Wishlist/>  
  );
  const renderCart = () => (
    <Cart/>  
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'My Dashboard':
        return renderDashboard();
      case 'My Profile':
        return renderProfile();
      case 'KYC':
        return renderKYC();
      case 'Nominee':
        return renderNominee();
      case 'Saving Scheme ':
        return renderSavingPlan();
      case 'CashBackGold Scheme ':
        return renderDigitalGold();
      case 'Gold Plant Scheme ':
        return renderGoldPlant();
      case 'Wishlist':
        return renderWishlist();  
      case 'Cart':
        return renderCart();
      case 'Notification':
        return renderNotification();
      case 'My Bank Accounts':
        return renderBankAccounts();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 pt-0.5">
      <div className="w-16 sm:w-64 bg-[#f8f6fa] shadow-lg h-screen flex flex-col justify-between rounded-none p-0 m-0">
        {/* Top label - hidden on mobile */}
        <div className="h-16 flex items-center justify-center bg-[#7a1335]">
          <span className="text-white font-bold text-base tracking-wide hidden sm:inline">User Dashboard</span>
        </div>
        {/* Sidebar menu */}
        <nav className="flex-1 flex flex-col gap-3 py-6 px-1 sm:px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-center sm:justify-start px-0 sm:px-0 py-0 sm:py-0 rounded-lg text-left text-sm transition-colors duration-150
                  group
                `}
                style={{ background: 'none', boxShadow: 'none', border: 'none' }}
              >
                <div
                  className={`flex items-center w-full rounded-xl
                    ${isActive
                      ? 'bg-[#f7c873] text-[#7a1335] shadow-md'
                      : 'bg-white text-[#7a1335] hover:bg-[#f7c873]/30'}
                  `}
                  style={{ minHeight: '56px', padding: '0 0.5rem', boxShadow: isActive ? '0 2px 8px 0 rgba(0,0,0,0.04)' : undefined, border: isActive ? '1.5px solid #f7c873' : '1.5px solid transparent' }}
                >
                  <span className="flex items-center justify-center w-12 h-12">
                    <Icon className="w-5 h-5 mx-auto" />
                  </span>
                  {/* Label: hidden on mobile, shown on sm+ */}
                  <span className="hidden sm:block flex-1 text-base font-medium" style={{ minWidth: '120px' }}>{item.label}</span>
                  {/* Chevron: hidden on mobile, shown on sm+ */}
                  {isActive && <ChevronRight className="hidden sm:inline w-3 h-3 ml-2" />}
                </div>
              </button>
            );
          })}
        </nav>
        <div className="py-2 text-center text-[10px] text-gray-400 border-t border-gray-100 select-none m-0 hidden sm:block">
          &copy; {new Date().getFullYear()} Greenheap
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-3 text-sm">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;