import React, { useState } from 'react';
import { useNexusStore } from '../store/nexusStore';
import { systemApi } from '../services/api';
import type { SystemMode } from '../store/nexusStore';

const BANNER_STYLES: Record<SystemMode, { bar: string; dot: string }> = {
  production:  { bar: 'bg-[#052E16] border-b border-[#166534] text-emerald-400', dot: 'bg-emerald-500' },
  readonly:    { bar: 'bg-[#18181B] border-b border-[#27272A] text-amber-500',   dot: 'bg-amber-500'   },
  maintenance: { bar: 'bg-[#1E1B4B] border-b border-[#312E81] text-indigo-400',  dot: 'bg-indigo-400'  },
  p0:          { bar: 'bg-[#450A0A] border-b border-[#7F1D1D] text-red-400',     dot: 'bg-red-500'     },
  info:        { bar: 'bg-[#0F172A] border-b border-[#1E293B] text-sky-400',     dot: 'bg-sky-400'     },
};

const MODE_LABELS: Record<SystemMode, string> = {
  production:  'Production',
  readonly:    'Read-only',
  maintenance: 'Maintenance',
  p0:          'P0 Incident',
  info:        'Info',
};

const ALL_MODES: SystemMode[] = ['production', 'readonly', 'maintenance', 'p0', 'info'];

export const SystemBanner: React.FC = () => {
  const { systemMode, writesAllowed, modeMessage, modeUpdatedBy, modeUpdatedAt } = useNexusStore((s) => ({
    systemMode:    s.systemMode,
    writesAllowed: s.writesAllowed,
    modeMessage:   s.modeMessage,
    modeUpdatedBy: s.modeUpdatedBy,
    modeUpdatedAt: s.modeUpdatedAt,
  }));
  const setSystemMode = useNexusStore((s) => s.setSystemMode);
  const user = useNexusStore((s) => s.user);
  const isAdmin = user.role === 'Administrator';

  const [dismissed, setDismissed] = useState(false);
  const [switching, setSwitching] = useState(false);

  if (dismissed) return null;

  const style = BANNER_STYLES[systemMode];

  const handleModeChange = async (newMode: SystemMode) => {
    if (newMode === systemMode) return;
    setSwitching(true);
    try {
      const data = await systemApi.setMode(newMode);
      setSystemMode(data.mode, data.writesAllowed, data.message, data.updatedBy, null);
    } catch (err) {
      console.error('Failed to change system mode:', err);
    } finally {
      setSwitching(false);
    }
  };

  const updatedTime = modeUpdatedAt
    ? new Date(modeUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className={`w-full py-1.5 px-4 flex items-center justify-between text-xs font-mono select-none transition-all duration-300 relative z-50 ${style.bar}`}>
      {/* Left: mode indicator dot */}
      <div className="flex items-center gap-2 min-w-[120px]">
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse ${style.dot}`} />
        <span className="font-semibold tracking-wider uppercase text-[10px] opacity-80">
          {MODE_LABELS[systemMode]}
        </span>
        {!writesAllowed && (
          <span className="text-[9px] opacity-60 border border-current rounded px-1">LOCKED</span>
        )}
      </div>

      {/* Centre: message */}
      <div className="flex-1 text-center font-medium text-[11px] px-4">
        {modeMessage}
        {updatedTime && modeUpdatedBy !== 'system' && (
          <span className="opacity-40 ml-2">· changed by {modeUpdatedBy} at {updatedTime}</span>
        )}
      </div>

      {/* Right: admin mode selector + dismiss */}
      <div className="flex items-center gap-2 min-w-[120px] justify-end">
        {isAdmin && (
          <select
            value={systemMode}
            disabled={switching}
            onChange={(e) => handleModeChange(e.target.value as SystemMode)}
            className="bg-transparent border border-current/30 rounded text-[10px] text-current px-1.5 py-0.5 cursor-pointer focus:outline-none opacity-80 hover:opacity-100 transition-opacity disabled:opacity-40"
            title="Change system mode (Administrator only)"
          >
            {ALL_MODES.map((m) => (
              <option key={m} value={m} className="bg-bg-elevated text-text-primary">
                {MODE_LABELS[m]}
              </option>
            ))}
          </select>
        )}
        {!isAdmin && (
          <span className="text-[10px] opacity-40 font-sans">
            {MODE_LABELS[systemMode]}
          </span>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="hover:opacity-80 transition-opacity p-0.5 rounded text-current opacity-50 hover:opacity-100"
          title="Dismiss banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default SystemBanner;
