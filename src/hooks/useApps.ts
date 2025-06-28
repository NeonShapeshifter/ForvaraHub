import { useMemo } from 'react';
import { useApi } from './useApi';
import { appsService, ForvaraApp, InstalledApp } from '../lib/api/apps';
import { useAuth } from '../contexts/AuthContext';

export function useAvailableApps() {
  const apiCall = useMemo(
    () => () => appsService.getAvailableApps(),
    []
  );

  return useApi<ForvaraApp[]>(apiCall, { immediate: true });
}

export function useInstalledApps() {
  const { currentTenant } = useAuth();
  
  const apiCall = useMemo(
    () => () => appsService.getInstalledApps(currentTenant?.id || ''),
    [currentTenant?.id]
  );

  return useApi<InstalledApp[]>(apiCall, { immediate: true });
}

export function useAppInstallation() {
  const { currentTenant } = useAuth();

  const installApp = useCallback(async (appId: string, planName: string) => {
    if (!currentTenant) throw new Error('No tenant selected');
    
    return billingService.upgradeSubscription({
      tenantId: currentTenant.id,
      app: appId,
      planName,
      addons: []
    });
  }, [currentTenant]);

  return useApi(installApp);
}
