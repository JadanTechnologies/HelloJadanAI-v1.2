import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './contexts/AppContext';

import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import GenerateImage from './pages/GenerateImage';
import GenerateVideo from './pages/GenerateVideo';
import GenerateAd from './pages/GenerateAd';
import Tasks from './pages/Tasks';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import CreditHistory from './pages/CreditHistory';
import LandingPage from './pages/LandingPage';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { state } = useContext(AppContext);
  return state.user ? children : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { state } = useContext(AppContext);
    return state.user && state.user.isAdmin ? children : <Navigate to="/app/dashboard" />;
}

const AuthenticatedApp = () => (
    <Layout>
        <Routes>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="generate-image" element={<GenerateImage />} />
            <Route path="generate-video" element={<GenerateVideo />} />
            <Route path="generate-ad" element={<GenerateAd />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="credits" element={<CreditHistory />} />
            <Route path="admin/*" element={
                <AdminRoute>
                    <Admin />
                </AdminRoute>
            } />
            <Route path="*" element={<Navigate to="dashboard" />} />
        </Routes>
    </Layout>
);


function App() {
  const { state } = useContext(AppContext);

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={state.user ? <Navigate to="/app/dashboard" /> : <LoginPage />} />
        <Route path="/" element={state.user ? <Navigate to="/app/dashboard" /> : <LandingPage />} />
        <Route path="/app/*" element={
            <PrivateRoute>
              <AuthenticatedApp />
            </PrivateRoute>
          } 
        />
         <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
}

export default App;