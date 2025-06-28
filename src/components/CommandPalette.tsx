import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Command, 
  ArrowUp, 
  ArrowDown, 
  Enter,
  Package,
  Mail,
  CreditCard,
  Settings,
  Activity,
  Users,
  FileText,
  BarChart3,
  HelpCircle,
  LogOut,
  Building2,
  Moon,
  Sun,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGlobalStore } from '../stores/useGlobalStore';

interface CommandItem {
  id: string;
  name: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
  category: string;
  keywords?: string[];
}

const CommandPalette = () => {
  const navigate = useNavigate();
  const { commandPaletteOpen, setCommandPaletteOpen, addRecentItem } = useGlobalStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      name: 'Go to Dashboard',
      icon: LayoutDashboard,
      action: () => {
        navigate('/dashboard');
        addRecentItem({ type: 'app', name: 'Dashboard' });
      },
      category: 'Navigation',
      keywords: ['home', 'main']
    },
    {
      id: 'nav-billing',
      name: 'Go to Billing',
      description: 'Manage subscriptions and payments',
      icon: CreditCard,
      action: () => {
        navigate('/billing');
        addRecentItem({ type: 'app', name: 'Billing' });
      },
      category: 'Navigation'
    },
    {
      id: 'nav-apps',
      name: 'Go to Apps',
      description: 'Browse and manage applications',
      icon: Grid3x3,
      action: () => {
        navigate('/apps');
        addRecentItem({ type: 'app', name: 'Apps' });
      },
      category: 'Navigation'
    },
    {
      id: 'nav-mail',
      name: 'Go to Mail',
      description: 'Check your messages',
      icon: Mail,
      action: () => {
        navigate('/mail');
        addRecentItem({ type: 'app', name: 'Mail' });
      },
      category: 'Navigation'
    },
    {
      id: 'nav-activity',
      name: 'Go to Activity',
      description: 'View security and activity logs',
      icon: Activity,
      action: () => {
        navigate('/activity');
        addRecentItem({ type: 'app', name: 'Activity' });
      },
      category: 'Navigation'
    },
    {
      id: 'nav-settings',
      name: 'Go to Settings',
      icon: Settings,
      action: () => {
        navigate('/settings');
        addRecentItem({ type: 'setting', name: 'Settings' });
      },
      category: 'Navigation'
    },
    
    // Quick Actions
    {
      id: 'action-new-invoice',
      name: 'Create New Invoice',
      icon: FileText,
      action: () => {
        window.open('https://elaris.forvara.com/invoices/new', '_blank');
      },
      category: 'Quick Actions'
    },
    {
      id: 'action-add-user',
      name: 'Add Team Member',
      icon: Users,
      action: () => {
        navigate('/settings?tab=team');
      },
      category: 'Quick Actions'
    },
    {
      id: 'action-install-app',
      name: 'Install New App',
      icon: Package,
      action: () => {
        navigate('/apps?filter=available');
      },
      category: 'Quick Actions'
    }
  ];

  // Filter commands based on search
  const filteredCommands = commands.filter(cmd => {
    const searchLower = searchQuery.toLowerCase();
    return (
      cmd.name.toLowerCase().includes(searchLower) ||
      cmd.description?.toLowerCase().includes(searchLower) ||
      cmd.keywords?.some(k => k.toLowerCase().includes(searchLower))
    );
  });

  // Group by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  // Flatten for keyboard navigation
  const flatCommands = filteredCommands;

  useEffect(() => {
    if (commandPaletteOpen) {
      inputRef.current?.focus();
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }

      // Close with Escape
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }

      // Navigate with arrow keys
      if (commandPaletteOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(i => Math.min(i + 1, flatCommands.length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && flatCommands[selectedIndex]) {
          e.preventDefault();
          flatCommands[selectedIndex].action();
          setCommandPaletteOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, selectedIndex, flatCommands]);

  if (!commandPaletteOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={() => setCommandPaletteOpen(false)}
      />
      
      {/* Command Palette */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-surface rounded-xl shadow-2xl border border-white/10 z-50">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <Search className="w-5 h-5 text-text/50" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent outline-none text-lg"
          />
          <kbd className="px-2 py-1 bg-white/10 rounded text-xs text-text/50">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2">
          {Object.entries(groupedCommands).map(([category, items]) => (
            <div key={category}>
              <div className="px-3 py-2 text-xs font-medium text-text/50 uppercase tracking-wider">
                {category}
              </div>
              {items.map((cmd, idx) => {
                const Icon = cmd.icon;
                const isSelected = flatCommands.indexOf(cmd) === selectedIndex;
                
                return (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      setCommandPaletteOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(flatCommands.indexOf(cmd))}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-lg
                      transition-colors text-left group
                      ${isSelected 
                        ? 'bg-primary/20 text-primary' 
                        : 'hover:bg-white/5 text-text/80'
                      }
                    `}
                  >
                    <div className={`
                      p-2 rounded-lg
                      ${isSelected ? 'bg-primary/20' : 'bg-white/5'}
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium">{cmd.name}</p>
                      {cmd.description && (
                        <p className="text-sm text-text/60">{cmd.description}</p>
                      )}
                    </div>
                    
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          ))}
          
          {filteredCommands.length === 0 && (
            <div className="text-center py-8 text-text/50">
              <p>No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 flex items-center justify-between text-xs text-text/50">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↵</kbd>
              Select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Command className="w-3 h-3" />
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded">K</kbd>
            to open
          </span>
        </div>
      </div>
    </>
  );
};

export default CommandPalette;
