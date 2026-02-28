import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import LandingPage from './pages/LandingPage';
import Layout from './pages/Layout';
import Support from './pages/Support';
import NotFound from './pages/NotFound';
import TermsAndConditions from './pages/TermsAndConditions';
import Cart from './pages/marketplace/Cart';
import Checkout from './pages/marketplace/Checkout';
import ProductDetails from './pages/marketplace/ProductDetails';
import Products from './pages/marketplace/Products';
import MyOrders from './pages/orders/MyOrders';
import OrderDetails from './pages/orders/OrderDetails';
import EditProfile from './pages/profile/EditProfile';
import MyProfile from './pages/profile/MyProfile';
import Analytics from './pages/admin/Analytics';
import Approvals from './pages/admin/Approvals';
import DashboardHome from './pages/admin/DashboardHome';
import Reports from './pages/admin/Reports';
import UserManagement from './pages/admin/UserManagement';
import ForgotPassword from './pages/auth/ForgotPassword';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import TraceabilityView from './pages/TraceabilityView';
import PaymentHistory from './pages/PaymentHistory';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/traceability" element={<TraceabilityView />} />
          <Route path="/payments" element={<PaymentHistory />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;