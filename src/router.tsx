// src/router.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { ScrollToTop } from "./components/RouteExperience";
import LogoLoader from "./components/LogoLoader";

import NotFound from "./pages/NotFound";

// i18n (move to main.tsx in production if needed)
import "./i18n/config";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import PublicLayout from "./layouts/PublicLayout";
import AdminSettings from "./pages/admin/AdminSettings";
import Revenue from "./pages/admin/Revenue";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import NotificationsCenter from "./pages/notifications/NotificationsCenter";
import StatusPage from "./pages/StatusPage";

// ────────────────────────────────────────────────────────────────
// Lazy-loaded pages
// ────────────────────────────────────────────────────────────────

// Public / Auth
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const ForgotPassword = React.lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/auth/ResetPassword"));

// Main App
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const FAQ = React.lazy(() => import("./pages/FAQ"));
const Support = React.lazy(() => import("./pages/Support"));
const HelpCenter = React.lazy(() => import("./pages/help/HelpCenter"));
const TermsAndConditions = React.lazy(() => import("./pages/TermsAndConditions"));
const Disclaimer = React.lazy(() => import("./pages/Disclaimer"));
const Pricing = React.lazy(() => import("./pages/Pricing"));
const Subscription = React.lazy(() => import("./pages/Subscription"));
const Blog = React.lazy(() => import("./pages/Blog"));

// Marketplace
const Products = React.lazy(() => import("./pages/marketplace/Products"));
const ProductDetails = React.lazy(() => import("./pages/marketplace/ProductDetails"));
const Cart = React.lazy(() => import("./pages/marketplace/Cart"));
const Checkout = React.lazy(() => import("./pages/marketplace/Checkout"));
const FarmInputs = React.lazy(() => import("./pages/marketplace/FarmInputs"));
const AdvancedSearch = React.lazy(() => import("./pages/marketplace/AdvancedSearch"));
const SellerStorefront = React.lazy(() => import("./pages/marketplace/SellerStorefront"));

// Orders
const MyOrders = React.lazy(() => import("./pages/orders/MyOrders"));
const OrderDetails = React.lazy(() => import("./pages/orders/OrderDetails"));
const FarmerOrders = React.lazy(() => import("./pages/orders/FarmerOrders"));
const RateOrder = React.lazy(() => import("./pages/orders/RateOrder"));
const FileDispute = React.lazy(() => import("./pages/orders/FileDispute"));

// Profile
const MyProfile = React.lazy(() => import("./pages/profile/MyProfile"));
const EditProfile = React.lazy(() => import("./pages/profile/EditProfile"));
const Settings = React.lazy(() => import("./pages/profile/Settings"));
const NotificationSettings = React.lazy(() => import("./pages/profile/NotificationSettings"));
const AddressBook = React.lazy(() => import("./pages/profile/AddressBook"));
const BecomeBuyer = React.lazy(() => import("./pages/profile/BecomeBuyer"));
const BecomeFarmer = React.lazy(() => import("./pages/profile/BecomeFarmer"));
const BecomeTransporter = React.lazy(() => import("./pages/profile/BecomeTransporter"));
const OrganizationWorkspace = React.lazy(() => import("./pages/profile/OrganizationWorkspace"));
const TransporterDashboard = React.lazy(() => import("./pages/profile/TransporterDashboard"));
const Impact = React.lazy(() => import("./pages/Impact"));

// Listings
const MyListings = React.lazy(() => import("./pages/listings/MyListings"));
const CreateListing = React.lazy(() => import("./pages/listings/CreateListing"));
const EditListing = React.lazy(() => import("./pages/listings/EditListing"));
const DeliveryManagement = React.lazy(() => import("./pages/orders/DeliveryManagement"));
const Comparison = React.lazy(() => import("./pages/marketplace/Comparison"));
const MarketplaceLibrary = React.lazy(() => import("./pages/marketplace/MarketplaceLibrary"));

// Messages
const Inbox = React.lazy(() => import("./pages/messages/Inbox"));
const ChatConversation = React.lazy(() => import("./pages/messages/ChatConversation"));

// Analytics
const AnalyticsDashboard = React.lazy(() => import("./pages/AnalyticsDashboard"));

// Traceability
const TraceabilityOverview = React.lazy(() => import("./pages/traceability/TraceabilityView"));
const TraceabilityDetails = React.lazy(() => import("./pages/traceability/TraceabilityDetails"));
const BatchTraceability = React.lazy(() => import("./pages/traceability/BatchTraceability"));
const VerifyTraceability = React.lazy(() => import("./pages/traceability/VerifyTraceability"));
const BatchCreation = React.lazy(() => import("./pages/traceability/BatchCreation"));

// Advisory
const AdvisoryDashboard = React.lazy(() => import("./pages/advisory/AdvisoryDashboard"));
const CropRecommendation = React.lazy(() => import("./pages/advisory/CropRecommendation"));
const PestDetection = React.lazy(() => import("./pages/advisory/PestDetection"));
const WeatherAdvisory = React.lazy(() => import("./pages/advisory/WeatherAdvisory"));
const MarketFeed = React.lazy(() => import("./pages/advisory/MarketFeed"));
const MarketForecast = React.lazy(() => import("./pages/advisory/MarketForecast"));
const SmartContracts = React.lazy(() => import("./pages/advisory/SmartContracts"));
const SmartContractCreation = React.lazy(() => import("./pages/advisory/SmartContractCreation"));
const ExpertConnect = React.lazy(() => import("./pages/advisory/ExpertConnect"));
const AdvisoryDetail = React.lazy(() => import("./pages/advisory/AdvisoryDetail"));

// Admin
const DashboardHome = React.lazy(() => import("./pages/admin/DashboardHome"));
const Reports = React.lazy(() => import("./pages/admin/Reports"));
const UserManagement = React.lazy(() => import("./pages/admin/UserManagement"));
const Approvals = React.lazy(() => import("./pages/admin/Approvals"));
const Analytics = React.lazy(() => import("./pages/admin/Analytics"));
const Disputes = React.lazy(() => import("./pages/admin/Disputes"));
const VerifyBuyers = React.lazy(() => import("./pages/admin/VerifyBuyers"));
const AuditLogs = React.lazy(() => import("./pages/admin/AuditLogs"));
const Reconciliations = React.lazy(() => import("./pages/admin/Reconciliations"));
const DeliveryAssignments = React.lazy(() => import("./pages/admin/DeliveryAssignments"));
const ProviderReadiness = React.lazy(() => import("./pages/admin/ProviderReadiness"));
const TransporterAdmin = React.lazy(() => import("./pages/admin/TransporterAdmin"));
const ListingApprovals = React.lazy(() => import("./pages/admin/ListingApprovals"));
const OperationsDashboard = React.lazy(() => import("./pages/admin/OperationsDashboard"));
const LivestockOperations = React.lazy(() => import("./pages/admin/LivestockOperations"));

// Support
const USSDGuide = React.lazy(() => import("./pages/support/USSDGuide"));
const HelpGuides = React.lazy(() => import("./pages/support/HelpGuides"));
const VideoTutorials = React.lazy(() => import("./pages/support/VideoTutorials"));
const WalletDashboard = React.lazy(() => import("./pages/wallet/WalletDashboard"));
const WithdrawPage = React.lazy(() => import("./pages/wallet/WithdrawPage"));
const BuyerDashboard = React.lazy(() => import("./pages/buyer/BuyerDashboard"));
const LivestockDashboard = React.lazy(() => import("./pages/livestock/LivestockDashboard"));
const HerdRecord = React.lazy(() => import("./pages/livestock/HerdRecord"));

// Loading fallback
const Loading = () => (
  <LogoLoader fullScreen />
);

export default function AppRoutes() {
  return (
    <React.Suspense fallback={<Loading />}>
      <ScrollToTop />
      <Routes>
        {/* ────────────────────────────────────────────────────────────────
            PUBLIC ROUTES (no layout, no protection)
        ──────────────────────────────────────────────────────────────── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<PublicLayout />}>
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="support"><Route index element={<Support />} /><Route path="ussd" element={<USSDGuide />} /></Route>
          <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/status" element={<StatusPage />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/verify" element={<VerifyTraceability />} />
          <Route path="/verify/:publicCode" element={<VerifyTraceability />} />
        </Route>

        {/* ────────────────────────────────────────────────────────────────
            MAIN APP – protected (any logged-in user: farmer/buyer)
        ──────────────────────────────────────────────────────────────── */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="buyer-dashboard" element={<BuyerDashboard />} />
          <Route path="livestock" element={<LivestockDashboard />} />
          <Route path="livestock/herds/:id" element={<HerdRecord />} />
          <Route path="help" element={<HelpCenter />} />

          {/* Profile + Become flows */}
          <Route path="profile">
            <Route index element={<MyProfile />} />
            <Route path="edit" element={<EditProfile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notifications-management" element={<NotificationSettings />} />
            <Route path="notifications" element={<NotificationsCenter />} />
            <Route path="address-book" element={<AddressBook />} />
            <Route path="become-buyer" element={<BecomeBuyer />} />
            <Route path="become-farmer" element={<BecomeFarmer />} />
            <Route path="become-transporter" element={<BecomeTransporter />} />
            <Route path="organization" element={<OrganizationWorkspace />} />
            <Route path="transporter-dashboard" element={<TransporterDashboard />} />
          </Route>

          {/* Marketplace */}
          <Route path="marketplace">
            <Route index element={<Products />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="seller/:farmerName" element={<SellerStorefront />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="farm-inputs" element={<FarmInputs />} />
            <Route path="search" element={<AdvancedSearch />} />
            <Route path="compare" element={<Comparison />} />
            <Route path="library" element={<MarketplaceLibrary />} />
          </Route>

          {/* Orders */}
          <Route path="orders">
            <Route index element={<MyOrders />} />
            <Route path=":id" element={<OrderDetails />} />
            <Route path=":orderId/delivery" element={<DeliveryManagement />} />
            <Route path=":id/rate" element={<RateOrder />} />
            <Route path=":id/dispute" element={<FileDispute />} />
          </Route>
          <Route path="listings/orders" element={<FarmerOrders />} />

          {/* Listings (Farmer) */}
          <Route path="listings">
            <Route index element={<MyListings />} />
            <Route path="new" element={<CreateListing />} />
            <Route path=":id/edit" element={<EditListing />} />
          </Route>

          {/* Messages */}
          <Route path="messages">
            <Route index element={<Inbox />} />
            <Route path=":chatId" element={<ChatConversation />} />
          </Route>

          {/* Traceability */}
          <Route path="traceability">
            <Route index element={<TraceabilityOverview />} />
            <Route path=":productId" element={<TraceabilityDetails />} />
            <Route path="batch/:batchId" element={<BatchTraceability />} />
            <Route path="verify" element={<VerifyTraceability />} />
            <Route path="batch/new" element={<BatchCreation />} />
          </Route>

          {/* Advisory */}
          <Route path="advisory">
            <Route index element={<AdvisoryDashboard />} />
            <Route path="crop-recommendation" element={<CropRecommendation />} />
            <Route path="pest-detection" element={<PestDetection />} />
            <Route path="weather" element={<WeatherAdvisory />} />
            <Route path="market-feed" element={<MarketFeed />} />
            <Route path="market-forecast" element={<MarketForecast />} />
            <Route path="smart-contracts">
              <Route index element={<SmartContracts />} />
              <Route path="new" element={<SmartContractCreation />} />
            </Route>
            <Route path="expert-connect" element={<ExpertConnect />} />
            <Route path=":type/:id" element={<AdvisoryDetail />} />
          </Route>

          {/* Analytics (shared) */}
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="wallet" element={<WalletDashboard />} />
          <Route path="wallet/withdraw" element={<WithdrawPage />} />

          {/* Support */}
          <Route path="support/ussd" element={<USSDGuide />} />
        </Route>

        {/* ────────────────────────────────────────────────────────────────
            ADMIN – protected (admin role only)
        ──────────────────────────────────────────────────────────────── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="users/pending" element={<UserManagement />} />
          <Route path="users/banned" element={<UserManagement />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="buyers/verify" element={<VerifyBuyers />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="disputes" element={<Disputes />} />
          <Route path="listing-approvals" element={<ListingApprovals />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="reconciliation" element={<Reconciliations />} />
          <Route path="deliveries" element={<DeliveryAssignments />} />
          <Route path="providers" element={<ProviderReadiness />} />
          <Route path="operations" element={<OperationsDashboard />} />
          <Route path="livestock" element={<LivestockOperations />} />
          <Route path="transporters" element={<TransporterAdmin />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="analytics/revenue" element={<Revenue />} />
        </Route>

        <Route path="/marketplace" element={<Navigate to="/app/marketplace" replace />} />
        <Route path="/listings/new" element={<Navigate to="/app/listings/new" replace />} />
        <Route path="/dashboard/orders" element={<Navigate to="/app/orders" replace />} />
        <Route path="/advisory" element={<Navigate to="/app/advisory" replace />} />
        <Route path="/messages" element={<Navigate to="/app/messages" replace />} />
        <Route path="/favorites" element={<Navigate to="/app/marketplace" replace />} />
        <Route path="/activity" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/prices" element={<Navigate to="/app/advisory/market-feed" replace />} />
        <Route path="/support/guides" element={<HelpGuides />} />
        <Route path="/support/videos" element={<VideoTutorials />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  );
}































{/*
  original
  // src/router.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

// Layout Components
import MainLayout from "./layouts/MainLayout"; // Create this instead of pages/Layout
import AdminLayout from "./layouts/AdminLayout"; // For admin pages

// Lazy loading for better performance
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const ForgotPassword = React.lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/auth/ResetPassword"));

// Main App Pages
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const FAQ = React.lazy(() => import("./pages/FAQ"));
const Support = React.lazy(() => import("./pages/Support"));
const TermsAndConditions = React.lazy(() => import("./pages/TermsAndConditions"));

// Marketplace
const Products = React.lazy(() => import("./pages/marketplace/Products"));
const ProductDetails = React.lazy(() => import("./pages/marketplace/ProductDetails"));
const Cart = React.lazy(() => import("./pages/marketplace/Cart"));
const Checkout = React.lazy(() => import("./pages/marketplace/Checkout"));

// Orders
const MyOrders = React.lazy(() => import("./pages/orders/MyOrders"));
const OrderDetails = React.lazy(() => import("./pages/orders/OrderDetails"));

// Profile
const MyProfile = React.lazy(() => import("./pages/profile/MyProfile"));
const EditProfile = React.lazy(() => import("./pages/profile/EditProfile"));

// Admin
const DashboardHome = React.lazy(() => import("./pages/admin/DashboardHome"));
const Analytics = React.lazy(() => import("./pages/admin/Analytics"));
const Reports = React.lazy(() => import("./pages/admin/Reports"));
const UserManagement = React.lazy(() => import("./pages/admin/UserManagement"));
const Approvals = React.lazy(() => import("./pages/admin/Approvals"));

// Loading fallback
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

export default function AppRoutes() {
  return (
    <React.Suspense fallback={<Loading />}>
      <Routes>
        {/* Public Routes (No Layout) {/*
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/support" element={<Support />} />
        <Route path="/terms" element={<TermsAndConditions />} />

        {/* Protected Routes with Main Layout 
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Marketplace Routes 
          <Route path="marketplace">
            <Route index element={<Products />} />
            <Route path="products" element={<Products />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
          </Route>
          
          {/* Orders Routes 
          <Route path="orders">
            <Route index element={<MyOrders />} />
            <Route path="my-orders" element={<MyOrders />} />
            <Route path="order/:id" element={<OrderDetails />} />
          </Route>
          
          {/* Profile Routes 
          <Route path="profile">
            <Route index element={<MyProfile />} />
            <Route path="me" element={<MyProfile />} />
            <Route path="edit" element={<EditProfile />} />
          </Route>
        </Route>

        {/* Admin Routes with Admin Layout 
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="approvals" element={<Approvals />} />
        </Route>

        {/* 404 Route - Keep at bottom 
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Suspense>
  );
}
*/}
