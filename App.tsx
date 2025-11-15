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
import LandingPage from './pages/LandingPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// PrivateRoute protects routes that require any authenticated user.
const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { state } = useContext(AppContext);
  return state.user ? children : <Navigate to="/login" />;
};

// AdminRoute protects routes that require an admin user.
const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { state } = useContext(AppContext);
    // Redirect to user dashboard if logged in but not an admin
    if (!state.user) return <Navigate to="/admin/login" />;
    return state.user.isAdmin ? children : <Navigate to="/app/dashboard" />;
}

// This component handles all routes for any authenticated user.
// It's now role-aware to handle default redirects correctly.
const AuthenticatedApp = () => {
    const { state } = useContext(AppContext);
    const defaultPath = state.user?.isAdmin ? 'admin' : 'dashboard';

    return (
        <Layout>
            <Routes>
                {/* Default route for /app */}
                <Route index element={<Navigate to={defaultPath} />} />

                {/* User Routes */}
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="generate-image" element={<GenerateImage />} />
                <Route path="generate-video" element={<GenerateVideo />} />
                <Route path="generate-ad" element={<GenerateAd />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="credits" element={<CreditHistory />} />
                
                {/* Admin Route - wrapped in AdminRoute to protect it */}
                <Route path="admin" element={<AdminRoute><Admin /></AdminRoute>} />

                {/* Catch-all for any other /app/* route */}
                <Route path="*" element={<Navigate to={defaultPath} />} />
            </Routes>
        </Layout>
    );
};


function App() {
  const { state } = useContext(AppContext);

  // This is the main router. It separates unauthenticated routes
  // from the authenticated section (/app/*).
  return (
    <HashRouter>
      <Routes>
        {/* If user is logged in, redirect them away from login pages to the authenticated app */}
        <Route path="/login" element={state.user ? <Navigate to="/app" /> : <LoginPage />} />
        <Route path="/admin/login" element={state.user ? <Navigate to="/app" /> : <AdminLoginPage />} />

        {/* Unauthenticated routes that should be accessible when logged out */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        {/* Root path logic: landing page or redirect to authenticated app */}
        <Route path="/" element={!state.user ? <LandingPage /> : <Navigate to="/app" />} />

        {/* All authenticated routes live under /app/* */}
        <Route path="/app/*" element={
            <PrivateRoute>
              <AuthenticatedApp />
            </PrivateRoute>
          } 
        />
        
        {/* Global catch-all redirects to the root */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
}

export default App;