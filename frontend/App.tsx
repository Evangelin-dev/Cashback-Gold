"use client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import B2BRegistration from "./src/app/B2BRegistration/b2bregistration.tsx";
import AdminDashboard from "./src/app/admin/AdminDashboard/admindashboard";
import AdminLayout from "./src/app/admin/AdminLayout";
import MarketingResourcesUpload from "./src/app/admin/AdminMarketPost/adminmarketpost.tsx";
import AdminProfile from "./src/app/admin/AdminProfile/adminprofile";
import AdminCampaigns from "./src/app/admin/Campaigns/campaigns";
import SavingPlan from "./src/app/admin/ChitJewelsSavingPlan/savingplan";
import Commission from "./src/app/admin/Commission/commission";
import SPIPPlan from "./src/app/admin/DigitalGoldSPIPlan/sipplan";
import FAQManagement from "./src/app/admin/FAQ/faq";
import GoldOrders from "./src/app/admin/GoldOrderManage/goldorder";
import PlantScheme from "./src/app/admin/GoldPlantScheme/plantscheme";
import KYC from "./src/app/admin/KYC/kyc";
import ManageOrnaments from "./src/app/admin/ManageOrnaments/manageornaments";
import ManageUsers from "./src/app/admin/ManageUsers/ManageUsers";
import MyBankAccounts from "./src/app/admin/MyBankAccounts/mybankaccounts";
import Notification from "./src/app/admin/Notification/notification";
import AOrderHistory from "./src/app/admin/OrderHistory/orderhistory";
import PayoutRequest from "./src/app/admin/PayoutRequest/payoutrequest";
import SchemesFlyer from "./src/app/admin/Schemes-Flyer/Schemeflyer";
import SupportTicket from "./src/app/admin/Support-Ticket/SupportTicket";
import B2BLayout from "./src/app/b2b/B2BLayout";
import Dashboard from "./src/app/b2b/dashboard/Dashboard";
import GoldPurchase from "./src/app/b2b/goldpurchase/GoldPurchase";
import Login from "./src/app/b2b/login/Login";
import Logout from "./src/app/b2b/logout/Logout";
import B2BManageOrnaments from "./src/app/b2b/manageornaments/manageornaments.tsx";
import MarketingResources from "./src/app/b2b/marketingresources/MarketingResources";
import Notifications from "./src/app/b2b/notifications/Notifications";
import OrderHistory from "./src/app/b2b/orderhistory/OrderHistory";
import Profile from "./src/app/b2b/profile/Profile";
import SipManagement from "./src/app/b2b/sipmanagement/SipManagement";
import Support from "./src/app/b2b/support/Support";
import Wallet from "./src/app/b2b/wallet/Wallet";
import PaymentPopup from "./src/app/components/PopUp/PaymentPopUp/Paymentpopup";
import LAboutUsPage from "./src/app/loginuser/AboutUs/aboutus";
import BuyNow from "./src/app/loginuser/BuyNow/buynow";
import Cart from "./src/app/loginuser/Cart/cart";
import LContactUsPage from "./src/app/loginuser/ContactUs/contactus";
import LChitJewelsSavingPlan from "./src/app/loginuser/DashboardComponents/ChitJewelsSavingPlan.tsx";
import LDigitalGoldSIPPlan from "./src/app/loginuser/DashboardComponents/DigitalGoldSIPPlan.tsx";
import LGoldPlantScheme from "./src/app/loginuser/DashboardComponents/GoldPlantScheme.tsx";
import LKYC from "./src/app/loginuser/DashboardComponents/KYC.tsx";
import LMyDashboard from "./src/app/loginuser/DashboardComponents/MyDashboard.tsx";
import LMyProfile from "./src/app/loginuser/DashboardComponents/MyProfile.tsx";
import LNotification from "./src/app/loginuser/DashboardComponents/Notification.tsx";
import LFooter from "./src/app/loginuser/Footer/Footer";
import LogUserDashboardLayout from "./src/app/loginuser/LogUserDashboardLayout";
import LUserHome from "./src/app/loginuser/LogUserHome";
import LogUserLayout from "./src/app/loginuser/LogUserLayout";
import LNavBar from "./src/app/loginuser/NavBar/NavBar";
import LPrivacyPlicyPage from "./src/app/loginuser/PrivacyPolicy/privacy";
import LRefund from "./src/app/loginuser/Refund/refund.tsx";
import LSIPPlanDisclaimer from "./src/app/loginuser/SIPDisclaimer/sipdisclaimer";
import LShippingPolicy from "./src/app/loginuser/ShippingPolicy/shippingpolicy";
import LTerms from "./src/app/loginuser/TermsAndCondition/termsandcondition";
import Wishlist from "./src/app/loginuser/Wishlist/wishlist";
import PartnerLayout from "./src/app/partner/PartnerLayout";
import PartnerPopup from "./src/app/partner/PartnerPopup";
import PartnerCampaigns from "./src/app/partner/partnercampaigns";
import PartnerCommission from "./src/app/partner/partnercommission";
import PartnerDashboard from "./src/app/partner/partnerdashboard";
import PartnerMarketing from "./src/app/partner/partnermarketing";
import PartnerNotification from "./src/app/partner/partnernotification";
import PartnerPayout from "./src/app/partner/partnerpayout";
import PartnerProfile from "./src/app/partner/partnerprofile";
import PartnerReferral from "./src/app/partner/partnerreferral";
import PartnerSupport from "./src/app/partner/partnersupport";
import AdminProtectedRoute from './src/app/protectedRoutes/AdminProtectedRoute';
import B2BProtectedRoute from './src/app/protectedRoutes/B2BProtectedRoute';
import UserProtectedRoute from './src/app/protectedRoutes/UserProtectedRoute';
import JewelryProductPage from "./src/app/user/BuyOrnaments/ProductDetail/JewelryProductPage .tsx";
import BuyOrnamentsPage from "./src/app/user/BuyOrnaments/buyOrnaments";
import ChitJewelsPlans from "./src/app/user/ChitJewels/chitjewels.tsx";
import GoldSIPPlans from "./src/app/user/GoldSIP/goldSIP.tsx";
import GoldPlantSchemes from "./src/app/user/GoldSchemes/goldschemes.tsx";
import SignupPopup from "./src/app/user/SignupPopup";
import UserLayout from "./src/app/user/UserLayout";
import AdminLogin from "./src/app/admin/AdminLogin";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./src/store.ts";
import { useEffect } from "react";
import { fetchCart } from "./src/app/features/thunks/cartThunks.ts";


const AppRoutes: React.FC = () => {
const dispatch = useDispatch<AppDispatch>();
 const { currentUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchCart());
    }
  }, [currentUser, dispatch]);

  return (
    <Routes>
      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/adminprofile" element={<AdminProfile />} />
          <Route path="/commission" element={<Commission />} />
          <Route path="/payoutrequest" element={<PayoutRequest />} />
          <Route path="/kyc" element={<KYC />} />
          <Route path="/resource" element={<MarketingResourcesUpload />} />
          <Route path="/savingplan" element={<SavingPlan />} />
          <Route path="/spiplan" element={<SPIPPlan />} />
          <Route path="/plantscheme" element={<PlantScheme />} />
          <Route path="/flayerschemes" element={<SchemesFlyer />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/mybankaccounts" element={<MyBankAccounts />} />
          <Route path="/manageornaments" element={<ManageOrnaments />} />
          <Route path="/manageusers" element={<ManageUsers />} />
          <Route path="/campaigns" element={<AdminCampaigns />} />
          <Route path="/goldorders" element={<GoldOrders />} />
          <Route path="/orderhistory" element={<AOrderHistory />} />
          <Route path="/faq" element={<FAQManagement />} />
          <Route path="/support-ticket" element={<SupportTicket />} />
        </Route>
      </Route>

      {/* B2B routes */}

      {/* <Route element={<B2BLayout/>}> */}
      <Route path="/b2b/register" element={<B2BRegistration />} />
      <Route path="/b2b/login" element={<Login />} />
      <Route element={<B2BProtectedRoute />} >
      <Route element={<B2BLayout />}>
        <Route path="bdashboard" element={<Dashboard />} />
        <Route path="bgoldpurchase" element={<GoldPurchase />} />
        <Route path="bsellornament" element={<B2BManageOrnaments />} />
        <Route path="bsipmanagement" element={<SipManagement />} />
        <Route path="bborder-history" element={<OrderHistory />} />
        {/* <Route path="bcommission" element={<BCommission />} /> */}
        <Route path="bwallet" element={<Wallet />} />
        <Route path="bmarketing-resources" element={<MarketingResources />} />
        <Route path="bsupport" element={<Support />} />
        <Route path="bprofile" element={<Profile />} />
        <Route path="bnotifications" element={<Notifications />} />
        <Route path="logout" element={<Logout />} />
      </Route>
      </Route>
      {/* </Route> */}


      {/* Partner routes */}

      <Route element={<PartnerLayout />}>
        <Route path="/pdashboard" element={<PartnerDashboard />} />
        <Route path="/preferral" element={<PartnerReferral />} />
        <Route path="/pmarketing" element={<PartnerMarketing />} />
        <Route path="/pcommission" element={<PartnerCommission />} />
        <Route path="/ppayout" element={<PartnerPayout />} />
        <Route path="/pcampaigns" element={<PartnerCampaigns />} />
        <Route path="/psupport" element={<PartnerSupport />} />
        <Route path="/pprofile" element={<PartnerProfile />} />
        <Route path="/pnotifications" element={<PartnerNotification />} />
      </Route>


      {/*User routes */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<LUserHome />} />
        <Route path="/navbar" element={<LNavBar />} />
        <Route path="/footer" element={<LFooter />} />
        <Route path="/terms" element={<LTerms />} />
        <Route path="/contactus" element={<LContactUsPage />} />
        <Route path="/buyornaments" element={<BuyOrnamentsPage />} />
        <Route path="/buyornaments/:id" element={<JewelryProductPage />} />
        <Route path="/about-us" element={<LAboutUsPage />} />
        <Route path="/privacy" element={<LPrivacyPlicyPage />} />
        <Route path="/refund" element={<LRefund />} />
        <Route path="/shippingpolicy" element={<LShippingPolicy />} />
        <Route path="/SIPplandisclaimer" element={<LSIPPlanDisclaimer />} />
        
      </Route >



      <Route element={<UserProtectedRoute />}>
        <Route element={<LogUserLayout />}>
          <Route path="/user" element={<LogUserDashboardLayout />} />
          <Route path="/lnavbar" element={<LNavBar />} />
          <Route path="/lfooter" element={<LFooter />} />
          <Route path="/lterms" element={<LTerms />} />
          <Route path="/lcontactus" element={<LContactUsPage />} />
          <Route path="/laboutus" element={<LAboutUsPage />} />
          <Route path="/lprivacy" element={<LPrivacyPlicyPage />} />
          <Route path="/lbuyornaments" element={<BuyOrnamentsPage />} />
          <Route path="/buynow" element={<BuyNow />} />
          <Route path="/Wishlist" element={<Wishlist />} />
          <Route path="/lUserHome" element={<LUserHome />} />
          <Route path="paymentpopup" element={<PaymentPopup />} />
          <Route path="/lrefund" element={<LRefund />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/lSIPplandisclaimer" element={<LSIPPlanDisclaimer />} />
          <Route path="/lshippingpolicy" element={<LShippingPolicy />} />


            {/* Scheme Plans */}
          <Route path="/chit" element={<ChitJewelsPlans />} />
          <Route path="/goldsip" element={<GoldSIPPlans />} />
          <Route path="/schemes" element={<GoldPlantSchemes />} />




          <Route path="/userdash" element={<LMyDashboard />} />
          <Route path="/userprofile" element={<LMyProfile />} />
          <Route path="/userkyc" element={<LKYC />} />
          <Route path="/userbeneficiaries" element={<LNavBar />} />
          <Route path="/usersavingplan" element={<LChitJewelsSavingPlan />} />
          <Route path="/userspiplan" element={<LDigitalGoldSIPPlan />} />
          <Route path="/userplantscheme" element={<LGoldPlantScheme />} />
          <Route path="/usernotification" element={<LNotification />} />
          <Route path="/usermybankaccounts" element={<MyBankAccounts />} />
        </Route >
      </Route>
      <Route path="/partnerpopup" element={<PartnerPopup open={true} onClose={() => { }} />} />
        <Route path="/signuppopup" element={<SignupPopup open={true} onClose={() => { }} />} />
    </Routes>

  );
}

const App: React.FC = () => {

  // Set Razorpay key from .env (Vite)
  window.RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;