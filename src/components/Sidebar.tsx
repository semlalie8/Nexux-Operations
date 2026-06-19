import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, Folder, Inbox, MessageSquare, Bell, Search, Book, 
  Clock, Pencil, Settings, LogOut, Shield
} from 'lucide-react';
import { useNexusStore, User } from '../store/nexusStore';
import { authApi } from '../services/api';

interface SidebarProps {
  onOpenDrawer: (drawer: string) => void;
  onOpenSearch: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenDrawer, onOpenSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUserStatus, logout } = useNexusStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const activePath = location.pathname;

  const statusColors = {
    online: 'bg-emerald-500',
    away: 'bg-amber-500',
    dnd: 'bg-red-500',
    offline: 'bg-gray-500'
  };

  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', route: '/dashboard' },
    { icon: Folder, label: 'Projects', route: '/projects' },
    { icon: Inbox, label: 'Inbox', route: '/inbox' },
    { icon: MessageSquare, label: 'Messages', route: '/messages' },
    { icon: Bell, label: 'Notifications', action: () => onOpenDrawer('notifications') },
    { icon: Search, label: 'Search (Cmd+K)', action: onOpenSearch },
    { icon: Book, label: 'Knowledge Base', route: '/knowledge' },
    { icon: Shield, label: 'Admin', route: '/admin', adminOnly: true },
  ];

  const utilityItems = [
    { icon: Clock, label: 'Reminders', action: () => onOpenDrawer('reminders') },
    { icon: Pencil, label: 'Feedback', action: () => onOpenDrawer('feedback') },
    { icon: Settings, label: 'Settings', action: () => onOpenDrawer('settings') },
    { icon: Book, label: 'Quick Links', action: () => onOpenDrawer('quicklinks') }, // Book icon (bottom area variant)
  ];

  const sidebarWidth = (isExpanded || isPinned) ? 'md:w-60' : 'md:w-[60px]';

  return (
    <aside 
      className={`fixed bottom-0 left-0 right-0 h-[64px] md:h-auto md:top-0 md:bottom-0 md:left-0 md:right-auto bg-bg-surface border-t md:border-t-0 md:border-r border-border flex flex-row md:flex-col justify-between md:justify-between items-center md:items-stretch select-none transition-all duration-200 ease-out z-40 px-1 md:px-0 ${sidebarWidth}`}
      onMouseEnter={() => window.innerWidth >= 768 && setIsExpanded(true)}
      onMouseLeave={() => {
        if (window.innerWidth >= 768) {
          setIsExpanded(false);
          setShowStatusPicker(false);
        }
      }}
    >
      {/* Top Navigation */}
      <div className="flex flex-row md:flex-col py-0 md:py-4 flex-1 md:flex-none w-full md:w-auto overflow-x-auto md:overflow-visible overflow-y-hidden">
        {/* Brand / Logo & Pin */}
        <div className="hidden md:flex items-center justify-between px-3.5 mb-6 h-8">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center font-heading font-black text-white text-base flex-shrink-0">
              N
            </div>
            {(isExpanded || isPinned) && (
              <span className="font-heading font-bold text-lg text-text-primary tracking-wider animate-fade-in">
                NEXUS
              </span>
            )}
          </div>
          
          {(isExpanded || isPinned) && (
            <button 
              onClick={() => setIsPinned(!isPinned)}
              className={`p-1 rounded hover:bg-bg-elevated transition-colors ${isPinned ? 'text-accent-primary' : 'text-text-muted hover:text-text-secondary'}`}
              title={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
            >
              📌
            </button>
          )}
        </div>

        {/* Primary nav buttons */}
        <nav className="flex flex-row md:flex-col space-x-1 md:space-x-0 md:space-y-1 px-1 md:px-2 w-full md:w-auto items-center md:items-stretch h-16 md:h-auto py-2 md:py-0">
          {navItems.filter(item => !(item as any).adminOnly || user.role === 'Administrator').map((item, index) => {
            const isRouteActive = item.route && activePath === item.route;
            const Icon = item.icon;
            
            return (
              <button
                key={index}
                onClick={() => {
                  if (item.route) navigate(item.route);
                  if ((item as any).action) (item as any).action();
                }}
                className={`flex-1 min-w-[50px] md:w-full h-12 md:h-10 rounded-lg flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 transition-all group relative px-1 md:px-2.5 ${
                  isRouteActive 
                    ? 'bg-accent-primary/10 md:bg-accent-primary text-accent-primary md:text-text-primary font-medium' 
                    : 'text-text-muted hover:bg-bg-elevated hover:text-text-secondary'
                }`}
                title={!isExpanded && !isPinned ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 md:w-5 md:h-5 flex-shrink-0 transition-transform ${isRouteActive ? '' : 'group-hover:scale-105'}`} />
                {(isExpanded || isPinned) && (
                  <span className="hidden md:block text-sm truncate font-heading tracking-wide animate-fade-in">
                    {item.label}
                  </span>
                )}
                
                {/* Active indicator bar */}
                {isRouteActive && !isExpanded && !isPinned && (
                  <div className="hidden md:block absolute left-0 top-2 bottom-2 w-1 rounded bg-text-primary" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-row md:flex-col py-0 md:py-4 md:border-t md:border-border/50 items-center md:items-stretch h-full md:h-auto pl-1 md:pl-0 border-l md:border-l-0 border-border/50">
        {/* Utilities */}
        <div className="hidden md:block space-y-1 px-2 mb-4">
          {utilityItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.action}
                className="w-full h-10 rounded-lg flex items-center gap-3 text-text-muted hover:bg-bg-elevated hover:text-text-secondary transition-all px-2.5 group relative"
                title={!isExpanded && !isPinned ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0 group-hover:scale-105 transition-transform" />
                {(isExpanded || isPinned) && (
                  <span className="text-sm truncate font-heading tracking-wide animate-fade-in">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Settings Icon (visible only on mobile to access Utilities/Settings) */}
        <div className="md:hidden flex items-center px-1">
          <button 
            onClick={() => onOpenDrawer('settings')}
            className="w-10 h-10 rounded-lg flex flex-col items-center justify-center text-text-muted hover:bg-bg-elevated hover:text-text-secondary transition-all"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* User profile / status chip */}
        <div className="px-1 md:px-2 relative h-full flex items-center">
          <div 
            onClick={() => (isExpanded || isPinned) && setShowStatusPicker(!showStatusPicker)}
            className={`w-10 h-10 md:w-full rounded-xl bg-bg-elevated/40 border border-border/40 hover:bg-bg-elevated/80 transition-all p-1 md:p-2 flex items-center justify-center md:justify-between cursor-pointer ${
              (isExpanded || isPinned) ? 'gap-3' : ''
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative flex-shrink-0">
                <img 
                  src={`/${user.avatar}`}
                  alt={user.name} 
                  className="w-8 h-8 rounded-full border border-border object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;
                  }}
                />
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-bg-surface ${statusColors[user.status]}`} />
              </div>
              
              {(isExpanded || isPinned) && (
                <div className="hidden md:flex flex-col text-left truncate animate-fade-in">
                  <span className="text-xs font-semibold text-text-primary truncate">{user.name}</span>
                  <span className="text-[10px] text-text-muted font-mono">{user.role}</span>
                </div>
              )}
            </div>

            {(isExpanded || isPinned) && (
              <div className="hidden md:block">
                <span className={`text-[10px] opacity-60 ${showStatusPicker ? 'rotate-180' : ''}`}>▲</span>
              </div>
            )}
          </div>

          {/* Expanded user actions / picker */}
          {(isExpanded || isPinned) && showStatusPicker && (
            <div className="hidden md:block absolute bottom-14 left-2 right-2 bg-bg-elevated border border-border rounded-xl shadow-xl p-2 z-50 animate-fade-in">
              <div className="text-[10px] text-text-muted px-2 py-1 font-mono uppercase tracking-wider">
                Select Status
              </div>
              <div className="space-y-1">
                {(['online', 'away', 'dnd', 'offline'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setUserStatus(status);
                      setShowStatusPicker(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-md text-xs hover:bg-bg-surface flex items-center gap-2 ${
                      user.status === status ? 'text-text-primary font-semibold' : 'text-text-secondary'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
                    <span className="capitalize">{status === 'dnd' ? 'Do Not Disturb' : status}</span>
                  </button>
                ))}
              </div>
              <div className="border-t border-border mt-2 pt-2">
                <button
                  onClick={async () => {
                    try { await authApi.logout(); } catch { /* ignore */ }
                    logout();
                    navigate('/');
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-md text-xs hover:bg-accent-danger/10 text-accent-danger flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </div>
          )}
          
          {/* Quick status cycle for collapsed view */}
          {!isExpanded && !isPinned && (
            <div 
              onClick={() => {
                const statuses: Array<User['status']> = ['online', 'away', 'dnd', 'offline'];
                const nextIdx = (statuses.indexOf(user.status) + 1) % statuses.length;
                setUserStatus(statuses[nextIdx]);
              }}
              className="absolute inset-0 cursor-pointer"
              title="Click to toggle status"
            />
          )}
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
