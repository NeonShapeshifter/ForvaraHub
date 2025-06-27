// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import BillingView from './pages/Billing';
import AppsView from './pages/Apps';
import MailView from './pages/Mail';
import ActivityView from './pages/Activity';
import SettingsView from './pages/Settings';
import LoginPage from './pages/Login';
// import { AuthProvider, useAuth } from './contexts/AuthContext';

// Temporary mock auth
const useMockAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user] = useState({
    id: '1',
    email: 'demo@forvara.com',
    fullName: 'Demo User'
  });

  const signIn = async (credentials: any) => {
    // Mock login
    console.log('Mock login:', credentials);
    setIsAuthenticated(true);
  };

  const signOut = async () => {
    setIsAuthenticated(false);
  };

  return { isAuthenticated, user, signIn, signOut };
};

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useMockAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Main Layout with Sidebar
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const { user, signOut } = useMockAuth();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        onNavigate={setCurrentView} 
        currentView={currentView}
        user={user}
        onSignOut={signOut}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  const { isAuthenticated, signIn } = useMockAuth();

  // Set theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" /> : <LoginPage onLogin={signIn} />
        } />
        
        <Route path="/" element={
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
              <ActivityView />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <MainLayout>
              <SettingsView />
            </MainLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
