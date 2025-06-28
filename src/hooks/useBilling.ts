import { useMemo } from 'react';
import { useApi } from './useApi';
import { billingService, BillingSummary, Subscription, UsageStats } from '../lib/api/billing';
import { useAuth } from '../contexts/AuthContext';

export function useBillingSummary() {
  const { currentTenant } = useAuth();
  
  const apiCall = useMemo(
    () => () => billingService.getBillingSummary(currentTenant?.id || ''),
    [currentTenant?.id]
  );

  return useApi<BillingSummary>(apiCall, { immediate: true });
}

export function useSubscription(appName: string) {
  const { currentTenant } = useAuth();
  
  const apiCall = useMemo(
    () => () => billingService.getSubscription(currentTenant?.id || '', appName),
    [currentTenant?.id, appName]
  );

  return useApi<Subscription>(apiCall, { immediate: true });
}

export function useUsageStats() {
  const { currentTenant } = useAuth();
  
  const apiCall = useMemo(
    () => () => billingService.getUsageStats(currentTenant?.id || ''),
    [currentTenant?.id]
  );

  return useApi<UsageStats>(apiCall, { immediate: true });
}
