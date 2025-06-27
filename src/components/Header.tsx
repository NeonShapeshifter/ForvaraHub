import React from 'react';
import { Bell, Search } from 'lucide-react';

interface HeaderProps {
  user: any;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="h-16 bg-surface border-b border-white/10 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/50" />
          <input
            type="text"
            placeholder="Search apps, billing, settings..."
            className="w-full pl-10 pr-4 py-2 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 ml-8">
        <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-text/70" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">{user.fullName}</p>
            <p className="text-xs text-text/60">{user.email}</p>
          </div>
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {user.fullName?.charAt(0) || 'U'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
