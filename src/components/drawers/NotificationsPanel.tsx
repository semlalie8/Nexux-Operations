import React from 'react';
import { useNexusStore } from '../../store/nexusStore';
import { X, Bell, CheckSquare } from 'lucide-react';

interface NotificationsPanelProps {
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useNexusStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  const typeColors = {
    Update: 'bg-indigo-950 text-indigo-300 border-indigo-800/40',
    Alert: 'bg-red-950 text-accent-danger border-red-800/40',
    Reminder: 'bg-amber-950 text-accent-warning border-amber-800/40',
    Announcement: 'bg-emerald-950 text-accent-success border-emerald-800/40'
  };

  return (
    <div className="flex flex-col h-full bg-bg-surface border-l border-border w-[320px] animate-slide-in">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-accent-primary" />
          <h2 className="text-sm font-bold font-heading text-text-primary">
            {unreadCount} Unread notifications
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button 
              onClick={markAllNotificationsRead}
              className="text-[10px] text-text-muted hover:text-accent-primary font-semibold hover:underline"
            >
              Mark all as read
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-1 hover:bg-bg-elevated rounded text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {notifications.map((notif) => (
          <div 
            key={notif.id}
            className={`border rounded-xl p-3 space-y-2.5 transition-all text-left ${
              notif.read 
                ? 'bg-bg-elevated/20 border-border/40 opacity-60' 
                : 'bg-bg-elevated/40 border-border/60 hover:border-border'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded border ${typeColors[notif.type]}`}>
                {notif.type}
              </span>
              
              <span className="text-[8px] font-mono text-text-muted">{notif.time}</span>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-text-primary leading-snug">
                {notif.title}
              </h4>
              <p className="text-[10px] text-text-secondary leading-relaxed line-clamp-3">
                {notif.content}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-border/10 pt-2 text-[9px] font-mono">
              <button 
                onClick={() => alert(`Redirecting to case detail path...`)}
                className="text-accent-primary hover:underline font-semibold"
              >
                Read more
              </button>
              
              {!notif.read && (
                <button
                  onClick={() => markNotificationRead(notif.id)}
                  className="text-text-muted hover:text-text-primary flex items-center gap-1"
                >
                  <CheckSquare className="w-3 h-3" /> Mark read
                </button>
              )}
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-1 py-12">
            <span className="text-2xl">🎉</span>
            <h3 className="font-heading font-semibold text-text-primary text-xs">All caught up</h3>
            <p className="text-[10px] text-text-muted">No new alerts or system incidents reported.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default NotificationsPanel;
