import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './contexts/AppContext';

// User-facing layout and pages
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import GenerateImage from './pages/GenerateImage';
import GenerateVideo from './pages/GenerateVideo';
import GenerateAd from './pages/GenerateAd';
import Tasks from './pages/Tasks';
import Gallery from './pages/Gallery';
import CreditHistory from './pages/CreditHistory';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ReferralsPage from './pages/ReferralsPage';
import AdvertisePage from './pages/AdvertisePage';
import MaintenancePage from './pages/MaintenancePage';
import PaymentPage from './pages/PaymentPage';
import RedemptionPage from './pages/RedemptionPage';
import SupportPage from './pages/SupportPage';

// Admin-facing layout and pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import LoginDetailsPage from './pages/admin/LoginDetailsPage';
import PlatformSettingsPage from './pages/admin/PlatformSettingsPage';
import TaskManagementPage from './pages/admin/TaskManagementPage';
import TaskMonitoringPage from './pages/admin/TaskMonitoringPage';
import TemplateManagementPage from './pages/admin/TemplateManagementPage';
import AnnouncementPage from './pages/admin/AnnouncementPage';
import CronJobPage from './pages/admin/CronJobPage';
import ReferralManagementPage from './pages/admin/ReferralManagementPage';
import FraudDetectionPage from './pages/admin/FraudDetectionPage';
import AccessControlPage from './pages/admin/AccessControlPage';
import StaffManagementPage from './pages/admin/StaffManagementPage';
import CampaignManagementPage from './pages/admin/CampaignManagementPage';
import PaymentManagementPage from './pages/admin/PaymentManagementPage';
import RedemptionManagementPage from './pages/admin/RedemptionManagementPage';
import SupportManagementPage from './pages/admin/SupportManagementPage';
import RoleManagementPage from './pages/admin/RoleManagementPage';


function App() {
  const { state } = useContext(AppContext);
  const { user, systemSettings } = state;

  // If in maintenance mode and user is not an admin, show maintenance page
  if (systemSettings.maintenanceMode && !user?.isAdmin) {
    return (
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<MaintenancePage />} />
        </Routes>
      </HashRouter>
    );
  }
  
  // Determine the default authenticated path
  const defaultAuthPath = user?.isAdmin ? '/admin' : '/app';

  return (
    <HashRouter>
      <Routes>
        {/* === PUBLIC ROUTES === */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/advertise" element={<AdvertisePage />} />
        <Route path="/advertise/:campaignId/pay" element={<PaymentPage />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={defaultAuthPath} />} />
        <Route path="/forgot-password" element={!user ? <ForgotPasswordPage /> : <Navigate to={defaultAuthPath} />} />
        <Route path="/reset-password" element={!user ? <ResetPasswordPage /> : <Navigate to={defaultAuthPath} />} />

        {/* === AUTHENTICATED USER ROUTES === */}
        <Route path="/app" element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="generate-image" element={<GenerateImage />} />
          <Route path="generate-video" element={<GenerateVideo />} />
          <Route path="generate-ad" element={<GenerateAd />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="credits" element={<CreditHistory />} />
          <Route path="referrals" element={<ReferralsPage />} />
          <Route path="redeem" element={<RedemptionPage />} />
          <Route path="support" element={<SupportPage />} />
        </Route>
        
        {/* === ADMIN ROUTES === */}
        <Route 
          path="/admin" 
          element={user ? (user.isAdmin ? <AdminLayout /> : <Navigate to="/app/dashboard" />) : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="staff" element={<StaffManagementPage />} />
          <Route path="logins" element={<LoginDetailsPage />} />
          <Route path="settings" element={<PlatformSettingsPage />} />
          <Route path="tasks" element={<TaskManagementPage />} />
          <Route path="task-monitoring" element={<TaskMonitoringPage />} />
          <Route path="campaigns" element={<CampaignManagementPage />} />
          <Route path="payments" element={<PaymentManagementPage />} />
          <Route path="redemptions" element={<RedemptionManagementPage />} />
          <Route path="templates" element={<TemplateManagementPage />} />
          <Route path="announcements" element={<AnnouncementPage />} />
          <Route path="cron-jobs" element={<CronJobPage />} />
          <Route path="referrals" element={<ReferralManagementPage />} />
          <Route path="fraud-detection" element={<FraudDetectionPage />} />
          <Route path="access-control" element={<AccessControlPage />} />
          <Route path="roles" element={<RoleManagementPage />} />
          <Route path="support" element={<SupportManagementPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;