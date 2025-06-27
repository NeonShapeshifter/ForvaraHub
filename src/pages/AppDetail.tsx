import React, { useState } from 'react';
import { 
  ArrowLeft,
  Download,
  Play,
  Star,
  Users,
  Calendar,
  Shield,
  Check,
  ChevronRight,
  ChevronLeft,
  Package,
  Globe,
  Smartphone,
  Monitor,
  Server,
  CreditCard,
  Info,
  MessageSquare,
  ThumbsUp,
  Flag,
  Loader2
} from 'lucide-react';

// Mock app data (in real app, would fetch based on ID)
const appData = {
  id: 'elaris',
  name: 'Elaris ERP',
  tagline: 'Complete business management solution',
  description: 'Elaris ERP is a comprehensive business management platform designed for modern companies. Manage inventory, sales, purchases, accounting, and more - all in one integrated solution built with fairness in mind.',
  icon: Package,
  category: 'Business Management',
  version: '2.4.1',
  size: '124 MB',
  lastUpdated: '2024-12-20',
  developer: 'Forvara Labs',
  rating: 4.8,
  totalRatings: 156,
  downloads: '2.5K+',
  status: 'installed', // or 'available' or 'coming_soon'
  
  features: [
    'Inventory Management with multi-warehouse support',
    'Sales & Invoicing with unlimited transactions',
    'Purchase Orders and supplier management',
    'Financial reports and analytics',
    'Customer portal for self-service',
    'RESTful API for integrations',
    'Mobile-responsive design',
    'Real-time collaboration features'
  ],
  
  screenshots: [
    { id: 1, url: '/screenshots/elaris-dashboard.png', caption: 'Modern dashboard with key metrics' },
    { id: 2, url: '/screenshots/elaris-inventory.png', caption: 'Powerful inventory management' },
    { id: 3, url: '/screenshots/elaris-invoicing.png', caption: 'Professional invoicing' },
    { id: 4, url: '/screenshots/elaris-reports.png', caption: 'Detailed analytics and reports' },
    { id: 5, url: '/screenshots/elaris-mobile.png', caption: 'Works on all devices' }
  ],
  
  systemRequirements: {
    os: 'Windows 10+, macOS 10.15+, Ubuntu 20.04+',
    processor: '2 GHz dual-core',
    memory: '4 GB RAM',
    storage: '500 MB available space',
    internet: 'Required for cloud sync'
  },
  
  platforms: ['windows', 'mac', 'linux', 'web', 'ios', 'android'],
  
  changelog: [
    { version: '2.4.1', date: '2024-12-20', changes: ['Fixed invoice PDF export', 'Improved performance'] },
    { version: '2.4.0', date: '2024-12-15', changes: ['New dashboard widgets', 'Bulk import feature'] },
    { version: '2.3.0', date: '2024-11-28', changes: ['Multi-currency support', 'API v2'] }
  ],
  
  reviews: [
    { id: 1, user: 'Maria G.', rating: 5, date: '2024-12-18', comment: 'Finally, ERP software with fair pricing! No more per-user limitations.' },
    { id: 2, user: 'Carlos R.', rating: 4, date: '2024-12-10', comment: 'Great features and the unlimited invoices is a game changer.' },
    { id: 3, user: 'Ana P.', rating: 5, date: '2024-12-05', comment: 'Easy to use and powerful. Customer support is excellent.' }
  ]
};

const AppDetailPage = () => {
  const [selectedScreenshot, setSelectedScreenshot] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'changelog'>('overview');
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    // Simulate installation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsInstalling(false);
    // Update status
    appData.status = 'installed';
  };

  const handleLaunch = () => {
    window.open(`https://${appData.id}.forvara.com`, '_blank');
  };

  const navigateToBilling = () => {
    window.location.href = '/billing';
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-text/20'}`} 
      />
    ));
  };

  return (
    <div className="flex-1 bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-white/10">
        <div className="px-8 py-4">
          <button className="flex items-center gap-2 text-text/70 hover:text-text mb-4">
            <ArrowLeft className="w-5 h-5" />
            Back to Apps
          </button>
          
          <div className="flex items-start gap-6">
            <div className="p-6 bg-primary/20 rounded-2xl">
              <appData.icon className="w-16 h-16 text-primary" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{appData.name}</h1>
                  <p className="text-text/70 mb-4">{appData.tagline}</p>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(appData.rating)}</div>
                      <span>{appData.rating}</span>
                      <span className="text-text/50">({appData.totalRatings})</span>
                    </div>
                    <span className="text-text/50">•</span>
                    <span>{appData.downloads} downloads</span>
                    <span className="text-text/50">•</span>
                    <span>{appData.category}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  {appData.status === 'installed' ? (
                    <>
                      <button
                        onClick={handleLaunch}
                        className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        Launch App
                      </button>
                      <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors">
                        Uninstall
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleInstall}
                        disabled={isInstalling}
                        className="px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        {isInstalling ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Installing...
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5" />
                            Install App
                          </>
                        )}
                      </button>
                      <button
                        onClick={navigateToBilling}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <CreditCard className="w-5 h-5" />
                        View Plans
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshots */}
      <div className="px-8 py-6 bg-surface/50">
        <div className="relative">
          <div className="overflow-hidden rounded-xl bg-black">
            <img 
              src={appData.screenshots[selectedScreenshot].url} 
              alt={appData.screenshots[selectedScreenshot].caption}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            <p className="absolute bottom-4 left-4 text-white text-sm">
              {appData.screenshots[selectedScreenshot].caption}
            </p>
          </div>
          
          {/* Navigation */}
          <button
            onClick={() => setSelectedScreenshot(prev => prev > 0 ? prev - 1 : appData.screenshots.length - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setSelectedScreenshot(prev => prev < appData.screenshots.length - 1 ? prev + 1 : 0)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        
        {/* Thumbnails */}
        <div className="flex gap-2 mt-4 justify-center">
          {appData.screenshots.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedScreenshot(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === selectedScreenshot ? 'bg-primary' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 border-b border-white/10 bg-surface">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-2 border-b-2 transition-colors ${
              activeTab === 'overview' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text/70 hover:text-text'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 px-2 border-b-2 transition-colors ${
              activeTab === 'reviews' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text/70 hover:text-text'
            }`}
          >
            Reviews ({appData.totalRatings})
          </button>
          <button
            onClick={() => setActiveTab('changelog')}
            className={`py-4 px-2 border-b-2 transition-colors ${
              activeTab === 'changelog' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text/70 hover:text-text'
            }`}
          >
            What's New
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold mb-4">About this app</h2>
                <p className="text-text/80 leading-relaxed">{appData.description}</p>
              </div>

              {/* Features */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Key Features</h2>
                <div className="space-y-3">
                  {appData.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5" />
                      <span className="text-text/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Platforms */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Available on</h2>
                <div className="flex gap-4">
                  {appData.platforms.includes('windows') && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg">
                      <Monitor className="w-5 h-5 text-text/60" />
                      <span className="text-sm">Windows</span>
                    </div>
                  )}
                  {appData.platforms.includes('mac') && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg">
                      <Monitor className="w-5 h-5 text-text/60" />
                      <span className="text-sm">macOS</span>
                    </div>
                  )}
                  {appData.platforms.includes('web') && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg">
                      <Globe className="w-5 h-5 text-text/60" />
                      <span className="text-sm">Web</span>
                    </div>
                  )}
                  {appData.platforms.includes('ios') && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg">
                      <Smartphone className="w-5 h-5 text-text/60" />
                      <span className="text-sm">iOS</span>
                    </div>
                  )}
                  {appData.platforms.includes('android') && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-surface rounded-lg">
                      <Smartphone className="w-5 h-5 text-text/60" />
                      <span className="text-sm">Android</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* App Info */}
              <div className="bg-surface rounded-xl p-6 border border-white/10">
                <h3 className="font-semibold mb-4">Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text/60">Version</span>
                    <span>{appData.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/60">Size</span>
                    <span>{appData.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/60">Updated</span>
                    <span>{new Date(appData.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text/60">Developer</span>
                    <span>{appData.developer}</span>
                  </div>
                </div>
              </div>

              {/* System Requirements */}
              <div className="bg-surface rounded-xl p-6 border border-white/10">
                <h3 className="font-semibold mb-4">System Requirements</h3>
                <div className="space-y-2 text-sm text-text/80">
                  <p><span className="text-text/60">OS:</span> {appData.systemRequirements.os}</p>
                  <p><span className="text-text/60">Processor:</span> {appData.systemRequirements.processor}</p>
                  <p><span className="text-text/60">Memory:</span> {appData.systemRequirements.memory}</p>
                  <p><span className="text-text/60">Storage:</span> {appData.systemRequirements.storage}</p>
                  <p><span className="text-text/60">Internet:</span> {appData.systemRequirements.internet}</p>
                </div>
              </div>

              {/* Support */}
              <div className="bg-surface rounded-xl p-6 border border-white/10">
                <h3 className="font-semibold mb-4">Support</h3>
                <div className="space-y-3">
                  <button className="w-full py-2 text-sm text-left flex items-center gap-2 hover:text-primary transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    Contact Support
                  </button>
                  <button className="w-full py-2 text-sm text-left flex items-center gap-2 hover:text-primary transition-colors">
                    <Info className="w-4 h-4" />
                    Documentation
                  </button>
                  <button className="w-full py-2 text-sm text-left flex items-center gap-2 hover:text-primary transition-colors">
                    <Flag className="w-4 h-4" />
                    Report an Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-4xl">
            {/* Rating Summary */}
            <div className="bg-surface rounded-xl p-6 border border-white/10 mb-6">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-4xl font-bold">{appData.rating}</p>
                  <div className="flex mt-2">{renderStars(appData.rating)}</div>
                  <p className="text-sm text-text/60 mt-1">{appData.totalRatings} ratings</p>
                </div>
                
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map(stars => (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-sm w-4">{stars}</span>
                      <Star className="w-4 h-4 text-text/40" />
                      <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ width: stars === 5 ? '70%' : stars === 4 ? '20%' : '10%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-4">
              {appData.reviews.map(review => (
                <div key={review.id} className="bg-surface rounded-xl p-6 border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium">{review.user}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-text/60">{review.date}</span>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                      <ThumbsUp className="w-4 h-4 text-text/60" />
                    </button>
                  </div>
                  <p className="text-text/80">{review.comment}</p>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-colors">
              Load More Reviews
            </button>
          </div>
        )}

        {activeTab === 'changelog' && (
          <div className="max-w-4xl">
            <div className="space-y-6">
              {appData.changelog.map((release, idx) => (
                <div key={idx} className="bg-surface rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">Version {release.version}</h3>
                    <span className="text-sm text-text/60">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {new Date(release.date).toLocaleDateString()}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {release.changes.map((change, changeIdx) => (
                      <li key={changeIdx} className="flex items-start gap-2 text-text/80">
                        <span className="text-primary mt-1">•</span>
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppDetailPage;
