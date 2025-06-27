import React, { useState } from 'react';
import { 
  Package, 
  Mail, 
  BarChart3, 
  Users,
  Calendar,
  Shield,
  Download,
  ExternalLink,
  Play,
  Clock,
  Sparkles,
  ChevronRight,
  Search,
  Grid3x3,
  List,
  Star,
  Info,
  Settings,
  Loader2
} from 'lucide-react';

// App categories
const categories = [
  { id: 'all', name: 'All Apps' },
  { id: 'installed', name: 'Installed' },
  { id: 'discover', name: 'Discover' }
];

// Forvara Apps catalog
const forvaraApps = [
  {
    id: 'elaris',
    name: 'Elaris ERP',
    tagline: 'Complete business management solution',
    description: 'Manage your entire business operations in one place.',
    icon: Package,
    category: 'business',
    status: 'installed',
    version: '2.4.1',
    size: '124 MB',
    lastUpdated: '2 days ago',
    rating: 4.8,
    reviews: 156,
    screenshots: 5
  },
  {
    id: 'forvara-mail',
    name: 'Forvara Mail',
    tagline: 'Team communication hub',
    description: 'Stay connected with your team.',
    icon: Mail,
    category: 'communication',
    status: 'installed',
    version: '1.8.3',
    size: '89 MB',
    lastUpdated: '1 week ago',
    rating: 4.9,
    reviews: 89,
    screenshots: 4
  },
  {
    id: 'forvara-analytics',
    name: 'Forvara Analytics',
    tagline: 'Business intelligence made simple',
    description: 'Transform data into insights.',
    icon: BarChart3,
    category: 'analytics',
    status: 'available',
    version: '1.0.0',
    size: '156 MB',
    badge: 'Beta',
    rating: 4.7,
    reviews: 32,
    screenshots: 6
  },
  {
    id: 'forvara-crm',
    name: 'Forvara CRM',
    tagline: 'Grow customer relationships',
    description: 'Track leads and close more deals.',
    icon: Users,
    category: 'business',
    status: 'coming_soon',
    releaseDate: 'Q3 2025',
    screenshots: 3
  },
  {
    id: 'forvara-projects',
    name: 'Forvara Projects',
    tagline: 'Project management that works',
    description: 'Plan and deliver projects on time.',
    icon: Calendar,
    category: 'productivity',
    status: 'coming_soon',
    releaseDate: 'Q4 2025',
    screenshots: 4
  },
  {
    id: 'forvara-shield',
    name: 'Forvara Shield',
    tagline: 'Advanced security suite',
    description: 'Protect your business data.',
    icon: Shield,
    category: 'security',
    status: 'available',
    version: '1.2.0',
    size: '45 MB',
    rating: 4.9,
    reviews: 78,
    screenshots: 3
  }
];

const AppsView = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [installingApp, setInstallingApp] = useState<string | null>(null);

  // Filter apps
  const filteredApps = forvaraApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    if (selectedCategory === 'installed') return matchesSearch && app.status === 'installed';
    if (selectedCategory === 'discover') return matchesSearch && app.status !== 'installed';
    
    return matchesSearch;
  });

  const handleInstall = async (appId: string) => {
    setInstallingApp(appId);
    // Simulate installation
    await new Promise(resolve => setTimeout(resolve, 3000));
    // In real app, this would download and install
    setInstallingApp(null);
    // Update app status
    const app = forvaraApps.find(a => a.id === appId);
    if (app) app.status = 'installed';
  };

  const handleLaunch = (appId: string) => {
    // In real app, this would launch the actual application
    console.log('Launching app:', appId);
    // For now, could open in new tab or use Electron IPC
    window.open(`https://${appId}.forvara.com`, '_blank');
  };

  const navigateToAppPage = (appId: string) => {
    // Navigate to individual app page
    window.location.href = `/apps/${appId}`;
  };

  return (
    <div className="flex-1 bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-white/10">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold mb-2">Apps</h1>
          <p className="text-text/70">Manage and discover Forvara applications</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-8 py-4 bg-surface/50 border-b border-white/10">
        <div className="flex items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white'
                    : 'bg-white/5 text-text/70 hover:bg-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search apps..."
                className="pl-10 pr-4 py-2 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none text-sm w-64"
              />
            </div>

            {/* View Mode */}
            <div className="flex gap-1 bg-background rounded-lg p-1 border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-primary text-white' : 'text-text/50 hover:text-text/70'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-primary text-white' : 'text-text/50 hover:text-text/70'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Apps Grid/List */}
      <div className="p-8">
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {filteredApps.map(app => (
            <AppCard 
              key={app.id} 
              app={app} 
              viewMode={viewMode}
              onInstall={handleInstall}
              onLaunch={handleLaunch}
              onViewDetails={navigateToAppPage}
              isInstalling={installingApp === app.id}
            />
          ))}
        </div>

        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text/60">No apps found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// App Card Component
const AppCard = ({ app, viewMode, onInstall, onLaunch, onViewDetails, isInstalling }: any) => {
  const Icon = app.icon;

  if (viewMode === 'list') {
    return (
      <div className="bg-surface rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-all">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/20 rounded-xl">
            <Icon className="w-10 h-10 text-primary" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{app.name}</h3>
              {app.badge && (
                <span className="px-2 py-0.5 bg-accent/20 text-accent rounded-full text-xs">
                  {app.badge}
                </span>
              )}
              {app.status === 'coming_soon' && (
                <span className="px-2 py-0.5 bg-secondary/20 text-secondary rounded-full text-xs">
                  Coming {app.releaseDate}
                </span>
              )}
            </div>
            <p className="text-sm text-text/70 mt-1">{app.tagline}</p>
            
            {app.status === 'installed' && (
              <p className="text-xs text-text/50 mt-2">
                Version {app.version} • Updated {app.lastUpdated}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {app.status === 'installed' ? (
              <>
                <button
                  onClick={() => onLaunch(app.id)}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Launch
                </button>
                <button
                  onClick={() => onViewDetails(app.id)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-text/70" />
                </button>
              </>
            ) : app.status === 'available' ? (
              <>
                <button
                  onClick={() => onInstall(app.id)}
                  disabled={isInstalling}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  {isInstalling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Installing...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Install
                    </>
                  )}
                </button>
                <button
                  onClick={() => onViewDetails(app.id)}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Learn more →
                </button>
              </>
            ) : (
              <button
                onClick={() => onViewDetails(app.id)}
                className="px-4 py-2 bg-white/10 text-text/70 rounded-lg font-medium"
              >
                View Details
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-surface rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-all group cursor-pointer"
         onClick={() => onViewDetails(app.id)}>
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-primary/20 rounded-xl group-hover:scale-110 transition-transform">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          {app.badge && (
            <span className="px-2 py-0.5 bg-accent/20 text-accent rounded-full text-xs">
              {app.badge}
            </span>
          )}
          {app.status === 'coming_soon' && (
            <Clock className="w-5 h-5 text-secondary" />
          )}
        </div>

        <h3 className="text-lg font-semibold mb-1">{app.name}</h3>
        <p className="text-sm text-text/70 mb-3 flex-1">{app.tagline}</p>

        {app.rating && (
          <div className="flex items-center gap-2 mb-3 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>{app.rating}</span>
            </div>
            <span className="text-text/50">({app.reviews} reviews)</span>
          </div>
        )}

        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
          {app.status === 'installed' ? (
            <button
              onClick={() => onLaunch(app.id)}
              className="w-full py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Launch
            </button>
          ) : app.status === 'available' ? (
            <button
              onClick={() => onInstall(app.id)}
              disabled={isInstalling}
              className="w-full py-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isInstalling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Installing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Install
                </>
              )}
            </button>
          ) : (
            <div className="text-center py-2 text-sm text-text/60">
              Coming {app.releaseDate}
            </div>
          )}
        </div>

        {app.status === 'installed' && (
          <p className="text-xs text-text/50 mt-2 text-center">
            v{app.version} • {app.size}
          </p>
        )}
      </div>
    </div>
  );
};

export default AppsView;
