import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { MainLayout } from '@/components/layout/MainLayout'
import ToastContainer from '@/components/ui/toast'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import Marketplace from '@/pages/Marketplace'
import MyApps from '@/pages/MyApps'
import Users from '@/pages/Users'
import Settings from '@/pages/Settings'
import Billing from '@/pages/Billing'
import Companies from '@/pages/Companies'
import Analytics from '@/pages/Analytics'
import AdminDashboard from '@/pages/AdminDashboard'

// Protected Route component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore()
  
  if (!user || !token) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// Public Route component (redirect if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore()
  
  if (user && token) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="my-apps" element={<MyApps />} />
          <Route path="users" element={<Users />} />
          <Route path="companies" element={<Companies />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="billing" element={<Billing />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App