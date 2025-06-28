import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  Grid3x3, 
  Mail, 
  Activity,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  Building2,
  LogOut,
  ChevronDown,
  Package
} from 'lucide-react';

interface SidebarProps {
  onNavigate: (path: string) => void;
  currentView: string;
  user: any;
  onSignOut: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentView, user, onSignOut }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);

  const currentCompany = "TechVentures Inc.";
  const unreadMails = 12;
  const activeApps = 2;

  const navItems = [
    {
      section: 'main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'billing', label: 'Billing & Usage', icon: CreditCard, badge: 'Pro' },
        { id: 'apps', label: 'My Apps', icon: Grid3x3, badge: activeApps }
      ]
    },
    {
      section: 'tools',
      items: [
        { id: 'mail', label: 'Mail', icon: Mail, badge: unreadMails },
        { id: 'activity', label: 'Activity', icon: Activity }
      ]
    },
    {
      section: 'account',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'help', label: 'Help & Support', icon: HelpCircle }
      ]
    }
  ];

  const handleNavClick = (itemId: string) => {
    onNavigate(itemId);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  };

  return (
    <aside className="w-64 bg-surface border-r border-white/10 flex flex-col h-screen">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-primary" />
          <span className="font-bold text-xl">Forvara</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navItems.map((section, sectionIdx) => (
          <div key={section.section} className={sectionIdx > 0 ? 'mt-6' : ''}>
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200 group
                  ${currentView === item.id 
                    ? 'bg-primary/20 text-primary' 
                    : 'hover:bg-white/5 text-text/70 hover:text-text'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1 text-left font-medium">{item.label}</span>
                {item.badge && (
                  <span className={`
                    px-2 py-0.5 text-xs rounded-full
                    ${item.badge === 'Pro' 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-accent/20 text-accent'
                    }
                  `}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}

        {/* Usage Stats */}
        <div className="mt-6 p-4 bg-background/50 rounded-lg">
          <h4 className="text-xs font-medium text-text/60 uppercase tracking-wider mb-3">
            Quick Stats
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text/70">Users</span>
              <span className="font-medium">7/10</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text/70">Storage</span>
              <span className="font-medium">1.2/3 GB</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-white/10 space-y-2">
        {/* Company Selector */}
        <div className="relative">
          <button
            onClick={() => setShowCompanyMenu(!showCompanyMenu)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Building2 className="w-4 h-4 text-text/70" />
            <span className="flex-1 text-left text-sm truncate">{currentCompany}</span>
            <ChevronDown className="w-4 h-4 text-text/70" />
          </button>
          
          {showCompanyMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-surface border border-white/10 rounded-lg shadow-xl py-1">
              <button className="w-full px-3 py-2 text-left text-sm hover:bg-white/5">
                TechVentures Inc.
              </button>
              <button className="w-full px-3 py-2 text-left text-sm hover:bg-white/5">
                Add Company +
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          {isDarkMode ? (
            <>
              <Moon className="w-4 h-4 text-text/70" />
              <span className="text-sm text-text/70">Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-text/70" />
              <span className="text-sm text-text/70">Light Mode</span>
            </>
          )}
        </button>

        {/* Logout */}
        <button 
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-red-400"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
