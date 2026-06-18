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

  const sidebarWidth = (isExpanded || isPinned) ? 'w-60' : 'w-[60px]';

  return (
    <aside 
      className={`fixed top-0 bottom-0 left-0 bg-bg-surface border-r border-border flex flex-col justify-between select-none transition-all duration-200 ease-out z-40 ${sidebarWidth}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false);
        setShowStatusPicker(false);
      }}
    >
      {/* Top Navigation */}
      <div className="flex flex-col py-4">
        {/* Brand / Logo & Pin */}
        <div className="flex items-center justify-between px-3.5 mb-6 h-8">
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
        <nav className="space-y-1 px-2">
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
                className={`w-full h-10 rounded-lg flex items-center gap-3 transition-all group relative px-2.5 ${
                  isRouteActive 
                    ? 'bg-accent-primary text-text-primary font-medium' 
                    : 'text-text-muted hover:bg-bg-elevated hover:text-text-secondary'
                }`}
                title={!isExpanded && !isPinned ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform ${isRouteActive ? '' : 'group-hover:scale-105'}`} />
                {(isExpanded || isPinned) && (
                  <span className="text-sm truncate font-heading tracking-wide animate-fade-in">
                    {item.label}
                  </span>
                )}
                
                {/* Active indicator bar */}
                {isRouteActive && !isExpanded && !isPinned && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 rounded bg-text-primary" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col py-4 border-t border-border/50">
        {/* Utilities */}
        <div className="space-y-1 px-2 mb-4">
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

        {/* User profile / status chip */}
        <div className="px-2 relative">
          <div 
            onClick={() => (isExpanded || isPinned) && setShowStatusPicker(!showStatusPicker)}
            className={`w-full rounded-xl bg-bg-elevated/40 border border-border/40 hover:bg-bg-elevated/80 transition-all p-2 flex items-center justify-between cursor-pointer ${
              (isExpanded || isPinned) ? 'gap-3' : 'justify-center'
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative flex-shrink-0">
                <img 
                  src={`/${user.avatar}`}
                  alt={user.name} 
                  className="w-8 h-8 rounded-full border border-border object-cover" 
                  onError={(e) => {
                    // Fallback to initials
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;
                  }}
                />
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-bg-surface ${statusColors[user.status]}`} />
              </div>
              
              {(isExpanded || isPinned) && (
                <div className="flex flex-col text-left truncate animate-fade-in">
                  <span className="text-xs font-semibold text-text-primary truncate">{user.name}</span>
                  <span className="text-[10px] text-text-muted font-mono">{user.role}</span>
                </div>
              )}
            </div>

            {(isExpanded || isPinned) && (
              <ChevronUp className={`w-4 h-4 text-text-muted transition-transform ${showStatusPicker ? 'rotate-180' : ''}`} />
            )}
          </div>

          {/* Expanded user actions / picker */}
          {(isExpanded || isPinned) && showStatusPicker && (
            <div className="absolute bottom-14 left-2 right-2 bg-bg-elevated border border-border rounded-xl shadow-xl p-2 z-50 animate-fade-in">
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
