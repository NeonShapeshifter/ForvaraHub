import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
}

interface GlobalState {
  // Theme
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Recent activity
  recentItems: Array<{
    id: string;
    type: 'app' | 'document' | 'setting';
    name: string;
    timestamp: number;
  }>;
  addRecentItem: (item: { type: 'app' | 'document' | 'setting'; name: string }) => void;
  
  // Command palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
      },
      
      // Notifications
      notifications: [],
      addNotification: (notification) => {
        const id = Date.now().toString();
        const newNotification = { ...notification, id };
        
        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }));
        
        // Auto-remove after duration
        if (notification.duration !== 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration || 5000);
        }
      },
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },
      clearNotifications: () => {
        set({ notifications: [] });
      },
      
      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },
      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },
      
      // Search
      searchQuery: '',
      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },
      
      // Recent activity
      recentItems: [],
      addRecentItem: (item) => {
        const id = Date.now().toString();
        const timestamp = Date.now();
        
        set((state) => {
          // Remove duplicates and keep only last 10
          const filtered = state.recentItems.filter(i => i.name !== item.name);
          const newItems = [{ id, ...item, timestamp }, ...filtered].slice(0, 10);
          return { recentItems: newItems };
        });
      },
      
      // Command palette
      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => {
        set({ commandPaletteOpen: open });
      }
    }),
    {
      name: 'forvara-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        recentItems: state.recentItems
      })
    }
  )
);
