import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './contexts/AppContext';

// User-facing layout and pages
import Layout from './components/Layout';
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
import UserManagementPage from './pages/admin/UserManagementPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import LoginDetailsPage from './pages/admin/LoginDetailsPage';


function App() {
  const { state } = useContext(AppContext);
  const user = state.user;

  // Determine the default authenticated path
  const defaultAuthPath = user?.isAdmin ? '/admin' : '/app';

  return (
    <HashRouter>
      <Routes>
        {/* === UNAUTHENTICATED ROUTES === */}
        <Route path="/" element={!user ? <LoginPage /> : <Navigate to={defaultAuthPath} />} />
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
          <Route index element={<Navigate to="users" />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="logins" element={<LoginDetailsPage />} />
        </Route>
        
        {/* === GLOBAL CATCH-ALL === */}
        <Route path="*" element={<Navigate to={user ? defaultAuthPath : '/login'} />} />
      </Routes>
    </HashRouter>
  );
}

export default App;