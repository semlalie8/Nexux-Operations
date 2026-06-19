import { useEffect } from 'react';
import { useNexusStore } from '../store/nexusStore';
import { systemApi } from '../services/api';

/**
 * Fetches the system mode from the backend on mount and stores it in Zustand.
 * Should be called once at the App root level.
 * Polls every 30 seconds so all active sessions see mode changes quickly.
 */
export function useSystemMode() {
  const setSystemMode = useNexusStore((state) => state.setSystemMode);

  const fetchMode = async () => {
    try {
      const data = await systemApi.getStatus();
      setSystemMode(
        data.mode,
        data.writesAllowed,
        data.message,
        data.updatedBy ?? 'system',
        data.updatedAt ?? null,
      );
    } catch {
      // API not reachable — keep current store values
    }
  };

  useEffect(() => {
    fetchMode();
    const interval = setInterval(fetchMode, 30_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Convenience selector — returns the system mode fields from the store.
 */
export function useSystemModeState() {
  return useNexusStore((state) => ({
    systemMode:    state.systemMode,
    writesAllowed: state.writesAllowed,
    modeMessage:   state.modeMessage,
    modeUpdatedBy: state.modeUpdatedBy,
    modeUpdatedAt: state.modeUpdatedAt,
  }));
}
