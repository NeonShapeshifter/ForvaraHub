import React, { useState } from 'react';
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
  X
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    fullName: 'Demo User',
    email: 'demo@forvara.com',
    phone: '+507 6000-0000',
    forvaraEmail: 'demo@forvara.mail',
    bio: 'Business owner passionate about fair software pricing.'
  });

  const [companyData, setCompanyData] = useState({
    name: 'TechVentures Inc.',
    identifier: 'techventures',
    website: 'https://techventures.com',
    industry: 'Technology',
    size: '10-50',
    country: 'Panama'
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    loginAlerts: true,
    billingAlerts: true,
    updateAlerts: true,
    marketingEmails: false
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: '30',
    ipWhitelist: false,
    allowedIPs: []
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'language', label: 'Language & Region', icon: Globe },
    { id: 'devices', label: 'Devices', icon: Smartphone }
  ];

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
                    <User className="w-12 h-12 text-primary" />
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
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                      className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                    />
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
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Forvara Email</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={profileData.forvaraEmail.split('@')[0]}
                        onChange={(e) => setProfileData({...profileData, forvaraEmail: `${e.target.value}@forvara.mail`})}
                        className="flex-1 px-4 py-3 bg-background rounded-l-lg border border-white/10 focus:border-primary focus:outline-none"
                      />
                      <span className="px-4 py-3 bg-white/5 border border-l-0 border-white/10 rounded-r-lg text-text/60">
                        @forvara.mail
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleSave}
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
                  <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Company Tab */}
          {activeTab === 'company' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold mb-6">Company Settings</h2>
              
              <div className="bg-surface rounded-xl p-6 border border-white/10">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <input
                      type="text"
                      value={companyData.name}
                      onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Company Identifier</label>
                    <input
                      type="text"
                      value={companyData.identifier}
                      onChange={(e) => setCompanyData({...companyData, identifier: e.target.value})}
                      className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                    />
                    <p className="text-xs text-text/60 mt-1">Used in URLs and API calls</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Website</label>
                    <input
                      type="url"
                      value={companyData.website}
                      onChange={(e) => setCompanyData({...companyData, website: e.target.value})}
                      className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Industry</label>
                    <select
                      value={companyData.industry}
                      onChange={(e) => setCompanyData({...companyData, industry: e.target.value})}
                      className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Retail">Retail</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Services">Services</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Company Size</label>
                    <select
                      value={companyData.size}
                      onChange={(e) => setCompanyData({...companyData, size: e.target.value})}
                      className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                    >
                      <option value="1-10">1-10 employees</option>
                      <option value="10-50">10-50 employees</option>
                      <option value="50-200">50-200 employees</option>
                      <option value="200+">200+ employees</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <h3 className="font-medium mb-4">Danger Zone</h3>
                  <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete Company
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
                  <h3 className="font-medium mb-4">Password</h3>
                  <p className="text-sm text-text/60 mb-4">Last changed 30 days ago</p>
                  <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors">
                    Change Password
                  </button>
                </div>

                {/* Two-Factor */}
                <div className="bg-surface rounded-xl p-6 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-text/60">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={security.twoFactor}
                        onChange={(e) => setSecurity({...security, twoFactor: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                {/* Session Management */}
                <div className="bg-surface rounded-xl p-6 border border-white/10">
                  <h3 className="font-medium mb-4">Session Management</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Session Timeout</label>
                      <select
                        value={security.sessionTimeout}
                        onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
                        className="w-full px-4 py-3 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="240">4 hours</option>
                        <option value="never">Never</option>
                      </select>
                    </div>
                    
                    <button className="text-sm text-primary hover:text-primary/80">
                      View active sessions →
                    </button>
                  </div>
                </div>

                {/* Data Export */}
                <div className="bg-surface rounded-xl p-6 border border-white/10">
                  <h3 className="font-medium mb-4">Your Data</h3>
                  <p className="text-sm text-text/60 mb-4">Download a copy of all your data</p>
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Data
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
                    emailAlerts: 'Email Alerts',
                    smsAlerts: 'SMS Alerts',
                    loginAlerts: 'Login Alerts',
                    billingAlerts: 'Billing & Payment Alerts',
                    updateAlerts: 'Product Updates',
                    marketingEmails: 'Marketing Emails'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-text/60 mt-1">
                          {key === 'emailAlerts' && 'Receive important notifications via email'}
                          {key === 'smsAlerts' && 'Get SMS for critical alerts'}
                          {key === 'loginAlerts' && 'Be notified of new login attempts'}
                          {key === 'billingAlerts' && 'Payment reminders and billing updates'}
                          {key === 'updateAlerts' && 'New features and improvements'}
                          {key === 'marketingEmails' && 'Tips, offers, and Forvara news'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[key]}
                          onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
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
                    onClick={() => setIsDarkTheme(false)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      !isDarkTheme ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Sun className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Light</p>
                  </button>
                  
                  <button
                    onClick={() => setIsDarkTheme(true)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isDarkTheme ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-white/20'
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
              </div>
            </div>
          )}

          {/* Devices Tab */}
          {activeTab === 'devices' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold mb-6">Connected Devices</h2>
              
              <div className="space-y-4">
                {[
                  { name: 'Lenovo Legion 5', type: 'Windows PC', location: 'Panama City, PA', current: true },
                  { name: 'iPhone 13 Pro', type: 'iOS', location: 'David, PA', current: false },
                  { name: 'MacBook Pro', type: 'macOS', location: 'San Jose, CR', current: false }
                ].map((device, idx) => (
                  <div key={idx} className="bg-surface rounded-xl p-6 border border-white/10">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/5 rounded-lg">
                          {device.type.includes('Windows') ? <Monitor className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            {device.name}
                            {device.current && (
                              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs">
                                Current
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-text/60 mt-1">{device.type}</p>
                          <p className="text-sm text-text/60">{device.location}</p>
                        </div>
                      </div>
                      
                      {!device.current && (
                        <button className="text-sm text-red-400 hover:text-red-300">
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
