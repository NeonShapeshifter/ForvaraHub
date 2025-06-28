// src/pages/Settings.tsx
import React, { useState, useEffect } from 'react';
import { 
  User,
  Building2,
  Shield,
  Bell,
  Palette,
  Globe,
  Smartphone,
  Key,
  Mail,
  Phone,
  Camera,
  Save,
  Check,
  AlertCircle,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  Loader2,
  LogOut,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff,
  Plus,
  X,
  Edit2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { forvaraService } from '../services/forvara';
import { useThemeStore } from '../stores/themeStore';
import { useGlobalStore } from '../stores/useGlobalStore';

const SettingsPage = () => {
  const { user, currentTenant, refreshUser } = useAuth();
  const { theme, setTheme } = useThemeStore();
  const { addNotification } = useGlobalStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form states initialized with real user data
  const [profileData, setProfileData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    bio: ''
  });

  const [companyData, setCompanyData] = useState({
    nombre: '',
    ruc: '',
    direccion: '',
    telefono: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    loginAlerts: true,
    billingAlerts: true,
    updateAlerts: true,
    marketingEmails: false
  });

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        telefono: user.telefono || '',
        bio: '' // This would come from extended profile
      });
    }
  }, [user]);

  // Load tenant data when currentTenant changes
  useEffect(() => {
    if (currentTenant) {
      setCompanyData({
        nombre: currentTenant.nombre || '',
        ruc: currentTenant.ruc || '',
        direccion: '', // Would need to fetch full tenant details
        telefono: '',
        email: ''
      });
    }
  }, [currentTenant]);

  // API calls
  const { execute: updateProfile } = useApi(
    async () => {
      return forvaraService.updateProfile({
        nombre: profileData.nombre,
        apellido: profileData.apellido,
        email: profileData.email,
        telefono: profileData.telefono
      });
    }
  );

  const { execute: updatePassword } = useApi(
    async () => {
      // This would be a real API call
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${forvaraService.client.token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (!response.ok) throw new Error('Failed to update password');
      return response.json();
    }
  );

  const { execute: updateTenant } = useApi(
    async () => {
      // This would update tenant information
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tenants/${currentTenant?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${forvaraService.client.token}`
        },
        body: JSON.stringify(companyData)
      });

      if (!response.ok) throw new Error('Failed to update company');
      return response.json();
    }
  );

  // Handlers
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const success = await updateProfile();
      if (success) {
        await refreshUser();
        setShowSuccess(true);
        addNotification({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your profile has been updated successfully'
        });
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addNotification({
        type: 'error',
        title: 'Password Mismatch',
        message: 'New passwords do not match'
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      addNotification({
        type: 'error',
        title: 'Weak Password',
        message: 'Password must be at least 6 characters long'
      });
      return;
    }

    setIsSaving(true);
    try {
      await updatePassword();
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      addNotification({
        type: 'success',
        title: 'Password Changed',
        message: 'Your password has been changed successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Password Change Failed',
        message: 'Failed to change password. Please check your current password.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCompany = async () => {
    if (!currentTenant) return;

    setIsSaving(true);
    try {
      await updateTenant();
      addNotification({
        type: 'success',
        title: 'Company Updated',
        message: 'Company information has been updated successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update company information'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = () => {
    addNotification({
      type: 'info',
      title: 'Export Started',
      message: 'We\'re preparing your data export. You\'ll receive an email when it\'s ready.'
    });
    // In real app, this would trigger a backend job
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'devices', label: 'Devices', icon: Smartphone }
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <p className="text-text/60">Please login to access settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-white/10">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-text/70">Manage your account and preferences</p>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-surface border-r border-white/10 p-4">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary/20 text-primary'
                    : 'hover:bg-white/5 text-text/70'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-green-400">Settings saved successfully!</span>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
              
              <div className="bg-surface rounded-xl p-6 border border-white/10">
                {/* Avatar */}
                <div className="flex items-center gap-6 mb-6 pb-6 border-b border-white/10">
                  <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-primary" />
                    )}
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mb-2">
                      <Camera className="w-4 h-4" />
                      Change Photo
                    </button>
                    <p className="text-sm text-text/60">JPG, PNG or GIF. Max 5MB</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <input
                        type="text"
                        value={profileData.nombre}
                        onChange={(e) => setProfileData({...profileData, nombre: e.target.value})}
                        className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <input
                        type="text"
                        value={profileData.apellido}
                        onChange={(e) => setProfileData({...profileData, apellido: e.target.value})}
                        className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      value={profileData.telefono}
                      onChange={(e) => setProfileData({...profileData, telefono: e.target.value})}
                      className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      rows={3}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => {
                      if (user) {
                        setProfileData({
                          nombre: user.nombre || '',
                          apellido: user.apellido || '',
                          email: user.email || '',
                          telefono: user.telefono || '',
                          bio: ''
                        });
                      }
                    }}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                {/* Password */}
                <div className="bg-surface rounded-xl p-6 border border-white/10">
                  <h3 className="font-medium mb-4">Change Password</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text/50 hover:text-text/70"
                        >
                          {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text/50 hover:text-text/70"
                        >
                          {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text/50 hover:text-text/70"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword}
                    className="mt-6 px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white rounded-lg font-medium transition-colors"
                  >
                    Update Password
                  </button>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-surface rounded-xl p-6 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-text/60">Add an extra layer of security to your account</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                      Coming Soon
                    </span>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="bg-surface rounded-xl p-6 border border-white/10">
                  <h3 className="font-medium mb-4">Session Management</h3>
                  <p className="text-sm text-text/60 mb-4">
                    View and manage your active sessions across all devices
                  </p>
                  <button 
                    onClick={() => window.location.href = '/activity'}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    View active sessions →
                  </button>
                </div>

                {/* Data Export */}
                <div className="bg-surface rounded-xl p-6 border border-white/10">
                  <h3 className="font-medium mb-4">Your Data</h3>
                  <p className="text-sm text-text/60 mb-4">Download a copy of all your data</p>
                  <button 
                    onClick={handleExportData}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Company Tab */}
          {activeTab === 'company' && currentTenant && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold mb-6">Company Settings</h2>
              
              <div className="bg-surface rounded-xl p-6 border border-white/10">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <input
                      type="text"
                      value={companyData.nombre}
                      onChange={(e) => setCompanyData({...companyData, nombre: e.target.value})}
                      className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">RUC / Tax ID</label>
                    <input
                      type="text"
                      value={companyData.ruc}
                      onChange={(e) => setCompanyData({...companyData, ruc: e.target.value})}
                      className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <input
                      type="text"
                      value={companyData.direccion}
                      onChange={(e) => setCompanyData({...companyData, direccion: e.target.value})}
                      placeholder="Company address"
                      className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        value={companyData.telefono}
                        onChange={(e) => setCompanyData({...companyData, telefono: e.target.value})}
                        placeholder="Company phone"
                        className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={companyData.email}
                        onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
                        placeholder="Company email"
                        className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleSaveCompany}
                    disabled={isSaving}
                    className="px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <h3 className="font-medium mb-4 text-red-400">Danger Zone</h3>
                  <p className="text-sm text-text/60 mb-4">
                    Once you delete a company, there is no going back. Please be certain.
                  </p>
                  <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete Company
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold mb-6">Notification Preferences</h2>
              
              <div className="bg-surface rounded-xl p-6 border border-white/10">
                <div className="space-y-6">
                  {Object.entries({
                    emailAlerts: {
                      label: 'Email Alerts',
                      description: 'Receive important notifications via email'
                    },
                    smsAlerts: {
                      label: 'SMS Alerts',
                      description: 'Get SMS for critical alerts (additional charges may apply)'
                    },
                    loginAlerts: {
                      label: 'Login Alerts',
                      description: 'Be notified of new login attempts from unrecognized devices'
                    },
                    billingAlerts: {
                      label: 'Billing & Payment Alerts',
                      description: 'Payment reminders, subscription changes, and billing updates'
                    },
                    updateAlerts: {
                      label: 'Product Updates',
                      description: 'New features, improvements, and system updates'
                    },
                    marketingEmails: {
                      label: 'Marketing Emails',
                      description: 'Tips, best practices, and Forvara news'
                    }
                  }).map(([key, config]) => (
                    <div key={key} className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{config.label}</p>
                        <p className="text-sm text-text/60 mt-1">{config.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer ml-4">
                        <input
                          type="checkbox"
                          checked={notifications[key as keyof typeof notifications]}
                          onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors">
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold mb-6">Appearance</h2>
              
              <div className="bg-surface rounded-xl p-6 border border-white/10">
                <h3 className="font-medium mb-4">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === 'light' ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Sun className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Light</p>
                  </button>
                  
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === 'dark' ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Moon className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Dark</p>
                  </button>
                  
                  <button
                    disabled
                    className="p-4 rounded-lg border-2 border-white/10 opacity-50 cursor-not-allowed"
                  >
                    <Monitor className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">System</p>
                    <p className="text-xs text-text/60">Coming soon</p>
                  </button>
                </div>

                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-primary">
                    Theme changes are applied immediately across all Forvara apps
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Devices Tab */}
          {activeTab === 'devices' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold mb-6">Connected Devices</h2>
              
              <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-400">
                  These are devices that have accessed your account. For security, review this list regularly.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-surface rounded-xl p-6 border border-white/10">
                  <p className="text-text/60 mb-4">
                    To view and manage your connected devices, please visit the Activity page.
                  </p>
                  <button 
                    onClick={() => window.location.href = '/activity'}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
                  >
                    View Active Sessions →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
