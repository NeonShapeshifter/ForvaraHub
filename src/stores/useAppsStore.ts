import { create } from 'zustand';
import { ForvaraApp, InstalledApp } from '../lib/api/apps';

interface AppsState {
  availableApps: ForvaraApp[];
  installedApps: InstalledApp[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  
  setAvailableApps: (apps: ForvaraApp[]) => void;
  setInstalledApps: (apps: InstalledApp[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  
  // Actions
  installApp: (appId: string) => void;
  uninstallApp: (appId: string) => void;
  
  // Computed
  getFilteredApps: () => ForvaraApp[];
}

export const useAppsStore = create<AppsState>((set, get) => ({
  availableApps: [],
  installedApps: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: 'all',
  
  setAvailableApps: (apps) => set({ availableApps: apps }),
  setInstalledApps: (apps) => set({ installedApps: apps }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  installApp: (appId) => {
    // This would call the API
    console.log('Installing app:', appId);
  },
  
  uninstallApp: (appId) => {
    // This would call the API
    console.log('Uninstalling app:', appId);
  },
  
  getFilteredApps: () => {
    const state = get();
    return state.availableApps.filter(app => {
      const matchesSearch = 
        app.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(state.searchQuery.toLowerCase());
      
      const matchesCategory = 
        state.selectedCategory === 'all' || 
        app.category === state.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }
}));
