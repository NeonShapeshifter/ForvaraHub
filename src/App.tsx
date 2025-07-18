import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { MainLayout } from '@/components/layout/MainLayout'
import ToastContainer from '@/components/ui/toast'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import ErrorBoundary from '@/components/common/ErrorBoundary'

// Lazy load all pages for better bundle splitting
const Login = React.lazy(() => import('@/pages/Login'))
const Register = React.lazy(() => import('@/pages/Register'))
const Dashboard = React.lazy(() => import('@/pages/Dashboard'))
const Marketplace = React.lazy(() => import('@/pages/Marketplace'))
const MyApps = React.lazy(() => import('@/pages/MyApps'))
const Users = React.lazy(() => import('@/pages/Users'))
const Settings = React.lazy(() => import('@/pages/Settings'))
const Billing = React.lazy(() => import('@/pages/Billing'))
const Companies = React.lazy(() => import('@/pages/Companies'))
const Analytics = React.lazy(() => import('@/pages/Analytics'))
const AdminDashboard = React.lazy(() => import('@/pages/AdminDashboard'))
const AdminUsers = React.lazy(() => import('@/pages/admin/AdminUsers'))
const AdminCompanies = React.lazy(() => import('@/pages/admin/AdminCompanies'))
const AdminRevenue = React.lazy(() => import('@/pages/admin/AdminRevenue'))
const Profile = React.lazy(() => import('@/pages/Profile'))

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

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <ErrorBoundary>
                <Login />
              </ErrorBoundary>
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <ErrorBoundary>
                <Register />
              </ErrorBoundary>
            </PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>
            } />
            <Route path="marketplace" element={
              <ErrorBoundary>
                <Marketplace />
              </ErrorBoundary>
            } />
            <Route path="my-apps" element={
              <ErrorBoundary>
                <MyApps />
              </ErrorBoundary>
            } />
            <Route path="users" element={
              <ErrorBoundary>
                <Users />
              </ErrorBoundary>
            } />
            <Route path="companies" element={
              <ErrorBoundary>
                <Companies />
              </ErrorBoundary>
            } />
            <Route path="analytics" element={
              <ErrorBoundary>
                <Analytics />
              </ErrorBoundary>
            } />
            <Route path="settings" element={
              <ErrorBoundary>
                <Settings />
              </ErrorBoundary>
            } />
            <Route path="billing" element={
              <ErrorBoundary>
                <Billing />
              </ErrorBoundary>
            } />
            <Route path="admin" element={
              <ErrorBoundary>
                <AdminDashboard />
              </ErrorBoundary>
            } />
            <Route path="admin/users" element={
              <ErrorBoundary>
                <AdminUsers />
              </ErrorBoundary>
            } />
            <Route path="admin/companies" element={
              <ErrorBoundary>
                <AdminCompanies />
              </ErrorBoundary>
            } />
            <Route path="admin/revenue" element={
              <ErrorBoundary>
                <AdminRevenue />
              </ErrorBoundary>
            } />
            <Route path="profile/:userId?" element={
              <ErrorBoundary>
                <Profile />
              </ErrorBoundary>
            } />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </ErrorBoundary>
  )
}

export default App
