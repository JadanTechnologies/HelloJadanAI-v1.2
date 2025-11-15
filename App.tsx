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

// Admin-facing layout and pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import LoginDetailsPage from './pages/admin/LoginDetailsPage';
import PlatformSettingsPage from './pages/admin/PlatformSettingsPage';
import TaskManagementPage from './pages/admin/TaskManagementPage';


function App() {
  const { state } = useContext(AppContext);
  const user = state.user;

  // Determine the default authenticated path
  const defaultAuthPath = user?.isAdmin ? '/admin' : '/app';

  return (
    <HashRouter>
      <Routes>
        {/* === PUBLIC ROUTES === */}
        <Route path="/" element={<LandingPage />} />
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
        </Route>
        
        {/* === ADMIN ROUTES === */}
        <Route 
          path="/admin" 
          element={user ? (user.isAdmin ? <AdminLayout /> : <Navigate to="/app/dashboard" />) : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="logins" element={<LoginDetailsPage />} />
          <Route path="settings" element={<PlatformSettingsPage />} />
          <Route path="tasks" element={<TaskManagementPage />} />
        </Route>
        
        {/* === GLOBAL CATCH-ALL === */}
        <Route path="*" element={<Navigate to={user ? defaultAuthPath : '/'} />} />
      </Routes>
    </HashRouter>
  );
}

export default App;