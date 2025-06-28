import { create } from 'zustand';
import { BillingSummary, Subscription } from '../lib/api/billing';

interface BillingState {
  summary: BillingSummary | null;
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  
  setSummary: (summary: BillingSummary) => void;
  setSubscriptions: (subscriptions: Subscription[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed values
  getTotalMonthly: () => number;
  getActiveSubscriptionsCount: () => number;
}

export const useBillingStore = create<BillingState>((set, get) => ({
  summary: null,
  subscriptions: [],
  loading: false,
  error: null,
  
  setSummary: (summary) => set({ summary }),
  setSubscriptions: (subscriptions) => set({ subscriptions }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  getTotalMonthly: () => {
    const state = get();
    return state.subscriptions
      .filter(sub => sub.status === 'active')
      .reduce((total, sub) => total + sub.price_monthly, 0);
  },
  
  getActiveSubscriptionsCount: () => {
    const state = get();
    return state.subscriptions.filter(sub => sub.status === 'active').length;
  }
}));
