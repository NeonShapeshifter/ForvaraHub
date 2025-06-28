import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Loader2 } from 'lucide-react';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import Dashboard from './pages/Dashboard';
import BillingView from './pages/Billing';
import AppsView from './pages/Apps';
import AppDetailPage from './pages/AppDetail';
import MailView from './pages/Mail';
import ActivityPage from './pages/Activity';
import SettingsPage from './pages/Settings';
import LoginPage from './pages/Login';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Loading Screen Component
const LoadingScreen = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
        <Shield className="w-10 h-10 text-white" />
      </div>
      <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
      <p className="text-text/60">Loading Forvara...</p>
    </div>
  </div>
);

// Updated Sidebar component to use React Router
const ConnectedSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const currentPath = location.pathname.split('/')[1] || 'dashboard';

  const handleNavigate = (path: string) => {
    navigate(`/${path}`);
  };

  return (
    <Sidebar 
      onNavigate={handleNavigate} 
      currentView={currentPath}
      user={user}
      onSignOut={signOut}
    />
  );
};

// Main Layout with Sidebar
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, currentTenant } = useAuth();

  return (
    <div className="flex h-screen bg-background">
      <ConnectedSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          currentUser={{
            nombre: user?.fullName?.split(' ')[0] || '',
            apellido: user?.fullName?.split(' ')[1] || ''
          }} 
          currentTenant={{ nombre: currentTenant?.name || 'No Company' }} 
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// App Routes Component
const AppRoutes = () => {
  const { user, signIn, signUp } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        user ? <Navigate to="/" /> : <LoginPage onLogin={signIn} onSignUp={signUp} />
      } />
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/billing" element={
        <ProtectedRoute>
          <MainLayout>
            <BillingView />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/apps" element={
        <ProtectedRoute>
          <MainLayout>
            <AppsView />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/apps/:appId" element={
        <ProtectedRoute>
          <MainLayout>
            <AppDetailPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/mail" element={
        <ProtectedRoute>
          <MainLayout>
            <MailView />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/activity" element={
        <ProtectedRoute>
          <MainLayout>
            <ActivityPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <MainLayout>
            <SettingsPage />
          </MainLayout>
        </ProtectedRoute>
      } />

      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

// Main App Component
function App() {
  // Set theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
