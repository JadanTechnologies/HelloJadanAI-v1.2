import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './contexts/AppContext';

import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import Dashboard from './pages/Dashboard';
import GenerateImage from './pages/GenerateImage';
import GenerateVideo from './pages/GenerateVideo';
import GenerateAd from './pages/GenerateAd';
import Tasks from './pages/Tasks';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import CreditHistory from './pages/CreditHistory';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  const { state } = useContext(AppContext);
  const user = state.user;

  return (
    <HashRouter>
      <Routes>
        {/* === UNAUTHENTICATED ROUTES === */}
        {/* These routes are only accessible when the user is logged out. */}
        {/* If a logged-in user tries to access them, they are redirected to their dashboard. */}
        {/* Admin login is now the default entry point for the app. */}
        <Route path="/" element={!user ? <Navigate to="/admin/login" /> : <Navigate to="/app" />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/app" />} />
        <Route path="/admin/login" element={!user ? <AdminLoginPage /> : <Navigate to="/app" />} />
        <Route path="/forgot-password" element={!user ? <ForgotPasswordPage /> : <Navigate to="/app" />} />
        <Route path="/reset-password" element={!user ? <ResetPasswordPage /> : <Navigate to="/app" />} />

        {/* === AUTHENTICATED ROUTES === */}
        {/* All routes under "/app" are protected. The Layout is rendered here for all child routes. */}
        <Route path="/app" element={user ? <Layout /> : <Navigate to="/login" />}>
          {/* Default authenticated route: directs to admin panel or user dashboard */}
          <Route index element={<Navigate to={user?.isAdmin ? 'admin' : 'dashboard'} />} />
          
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="generate-image" element={<GenerateImage />} />
          <Route path="generate-video" element={<GenerateVideo />} />
          <Route path="generate-ad" element={<GenerateAd />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="credits" element={<CreditHistory />} />

          {/* Admin-only route: only renders Admin page if user is an admin, otherwise redirects */}
          <Route path="admin" element={user?.isAdmin ? <Admin /> : <Navigate to="dashboard" />} />
        </Route>
        
        {/* === GLOBAL CATCH-ALL === */}
        {/* Any other path redirects to the appropriate home page. */}
        <Route path="*" element={<Navigate to={user ? '/app' : '/'} />} />
      </Routes>
    </HashRouter>
  );
}

export default App;