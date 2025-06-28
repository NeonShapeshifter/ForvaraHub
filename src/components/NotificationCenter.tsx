import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  AlertCircle, 
  Info, 
  Package,
  CreditCard,
  Shield,
  Users,
  Mail,
  Calendar,
  Download,
  Settings
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  app?: string;
  action?: {
    label: string;
    href: string;
  };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Payment Received',
    message: 'Your monthly subscription payment has been processed successfully.',
    timestamp: '5 minutes ago',
    read: false,
    app: 'billing',
    action: {
      label: 'View Invoice',
      href: '/billing'
    }
  },
  {
    id: '2',
    type: 'info',
    title: 'New Forvara Mail Update',
    message: 'Version 1.8.4 is now available with performance improvements.',
    timestamp: '2 hours ago',
    read: false,
    app: 'mail',
    action: {
      label: 'Update Now',
      href: '/apps/forvara-mail'
    }
  },
  {
    id: '3',
    type: 'warning',
    title: 'Storage Limit Warning',
    message: 'You are using 80% of your storage quota (2.4/3 GB).',
    timestamp: '1 day ago',
    read: true,
    app: 'system',
    action: {
      label: 'Manage Storage',
      href: '/settings'
    }
  },
  {
    id: '4',
    type: 'info',
    title: 'New Team Member',
    message: 'Maria Garcia has joined your organization.',
    timestamp: '2 days ago',
    read: true,
    app: 'users'
  },
  {
    id: '5',
    type: 'system',
    title: 'Security Alert',
    message: 'New login from Chrome on Windows in Panama City.',
    timestamp: '3 days ago',
    read: true,
    app: 'security',
    action: {
      label: 'Review Activity',
      href: '/activity'
    }
  }
];

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string, app?: string) => {
    if (app) {
      switch (app) {
        case 'billing': return CreditCard;
        case 'mail': return Mail;
        case 'users': return Users;
        case 'security': return Shield;
        case 'system': return Settings;
        default: return Bell;
      }
    }
    
    switch (type) {
      case 'success': return Check;
      case 'warning': return AlertCircle;
      case 'error': return X;
      default: return Info;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-400 bg-green-400/20';
      case 'warning': return 'text-yellow-400 bg-yellow-400/20';
      case 'error': return 'text-red-400 bg-red-400/20';
      case 'system': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-primary bg-primary/20';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Notification Panel */}
      <div className="fixed right-4 top-20 w-96 max-h-[80vh] bg-surface rounded-xl shadow-2xl border border-white/10 z-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-accent/20 text-accent rounded-full text-xs">
                  {unreadCount} new
                </span>
              )}
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text/70" />
            </button>
          </div>
          
          {/* Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary/20 text-primary'
                  : 'hover:bg-white/5 text-text/70'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-primary/20 text-primary'
                  : 'hover:bg-white/5 text-text/70'
              }`}
            >
              Unread
            </button>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="ml-auto text-sm text-primary hover:text-primary/80"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-text/60">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredNotifications.map(notification => {
                const Icon = getIcon(notification.type, notification.app);
                const iconStyle = getIconColor(notification.type);
                
                return (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg mb-2 transition-all ${
                      !notification.read 
                        ? 'bg-white/5 hover:bg-white/10' 
                        : 'hover:bg-white/5'
                    }`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-lg ${iconStyle}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm">
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 inline-block w-2 h-2 bg-accent rounded-full"></span>
                            )}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotification(notification.id);
                            }}
                            className="p-1 hover:bg-white/10 rounded transition-colors opacity-0 hover:opacity-100"
                          >
                            <X className="w-3 h-3 text-text/50" />
                          </button>
                        </div>
                        
                        <p className="text-sm text-text/70 mt-1">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-text/50">
                            {notification.timestamp}
                          </span>
                          
                          {notification.action && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = notification.action.href;
                              }}
                              className="text-xs text-primary hover:text-primary/80 font-medium"
                            >
                              {notification.action.label} →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button className="w-full py-2 text-sm text-primary hover:text-primary/80 font-medium">
            View All Notifications →
          </button>
        </div>
      </div>
    </>
  );
};

// Updated Header component with Notification Center
export const HeaderWithNotifications: React.FC<{ currentUser: any; currentTenant: any }> = ({ currentUser, currentTenant }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = 3; // Get from state/API

  return (
    <>
      <header className="h-16 bg-surface border-b border-white/10 px-8 flex items-center justify-between relative z-30">
        <div className="flex-1 max-w-2xl">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search apps, billing, settings..."
              className="w-full pl-10 pr-4 py-2 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4 ml-8">
          {/* Notification Bell */}
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-text/70" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
            )}
          </button>
          
          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{currentUser.nombre} {currentUser.apellido}</p>
              <p className="text-xs text-text/60">{currentTenant.nombre}</p>
            </div>
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {currentUser.nombre?.charAt(0)}{currentUser.apellido?.charAt(0)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};

export default NotificationCenter;
