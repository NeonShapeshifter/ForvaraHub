import { useMemo } from 'react';
import { useApi } from './useApi';
import { activityService, ActivityLog, LoginSession } from '../lib/api/activity';
import { useAuth } from '../contexts/AuthContext';

export function useRecentActivity(limit = 20) {
  const { currentTenant } = useAuth();
  
  const apiCall = useMemo(
    () => () => activityService.getRecentActivity(currentTenant?.id || '', limit),
    [currentTenant?.id, limit]
  );

  return useApi<ActivityLog[]>(apiCall, { immediate: true });
}

export function useActiveSessions() {
  const apiCall = useMemo(
    () => () => activityService.getActiveSessions(),
    []
  );

  return useApi<LoginSession[]>(apiCall, { immediate: true });
}

export function useTerminateSession() {
  const terminateSession = useCallback(async (sessionId: string) => {
    return activityService.terminateSession(sessionId);
  }, []);

  return useApi(terminateSession);
}
