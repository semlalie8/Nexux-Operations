import React, { useState, useEffect } from 'react';
import { useNexusStore } from '../store/nexusStore';

export const SystemBanner: React.FC = () => {
  const user = useNexusStore((state) => state.user);
  const [activeBanner, setActiveBanner] = useState<'readonly' | 'maintenance' | 'p0' | 'info' | null>('readonly');

  useEffect(() => {
    // Check if dismissed in session
    const dismissed = sessionStorage.getItem('nexus_banner_dismissed');
    if (dismissed) {
      setActiveBanner(null);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('nexus_banner_dismissed', 'true');
    setActiveBanner(null);
  };

  if (!activeBanner) return null;

  // Let's customize the banner text and style based on user role and state
  // If user role is "Trainee" or "Read-only", we enforce the Read-only banner.
  const isReadOnly = user.role === 'Trainee';

  let bannerClass = '';
  let content = '';

  if (isReadOnly) {
    bannerClass = 'bg-[#18181B] border-b border-[#27272A] text-amber-500';
    content = '⚠ Read-only — You are viewing a training environment. Log in to make changes.';
  } else {
    switch (activeBanner) {
      case 'readonly':
        bannerClass = 'bg-[#18181B] border-b border-[#27272A] text-amber-500';
        content = '⚠ Read-only — You are viewing a training environment. Log in to make changes.';
        break;
      case 'maintenance':
        bannerClass = 'bg-[#1E1B4B] border-b border-[#312E81] text-amber-400';
        content = '🔧 Scheduled maintenance in 2 hours — save your work.';
        break;
      case 'p0':
        bannerClass = 'bg-[#451A03] border-b border-[#78350F] text-red-500';
        content = '🚨 P0 Incident in progress — see #incidents channel.';
        break;
      case 'info':
        bannerClass = 'bg-[#0F172A] border-b border-[#1E293B] text-indigo-400';
        content = 'ℹ New platform update available. Refresh to load.';
        break;
    }
  }

  return (
    <div className={`w-full py-2 px-4 flex items-center justify-between text-xs font-mono select-none transition-all duration-300 relative z-50 ${bannerClass}`}>
      <div className="flex-1 text-center font-medium">
        {content}
      </div>
      
      {/* Banner cycler for demo / dismissal */}
      <div className="flex items-center gap-2">
        {!isReadOnly && (
          <select 
            value={activeBanner} 
            onChange={(e) => setActiveBanner(e.target.value as any)}
            className="bg-transparent border border-gray-700 rounded text-[10px] text-text-secondary px-1 cursor-pointer focus:outline-none"
          >
            <option value="readonly" className="bg-bg-elevated text-text-primary">Read-only</option>
            <option value="maintenance" className="bg-bg-elevated text-text-primary">Maint</option>
            <option value="p0" className="bg-bg-elevated text-text-primary">P0</option>
            <option value="info" className="bg-bg-elevated text-text-primary">Info</option>
          </select>
        )}
        <button 
          onClick={handleDismiss}
          className="hover:opacity-80 transition-opacity p-0.5 rounded ml-2 text-text-secondary hover:text-text-primary"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
export default SystemBanner;
