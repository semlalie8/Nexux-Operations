import React, { useState } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';

interface ActivityLogPanelProps {
  ticketId: string;
  onClose: () => void;
}

export const ActivityLogPanel: React.FC<ActivityLogPanelProps> = ({ onClose }) => {
  const [onlyNotes, setOnlyNotes] = useState(false);

  // Initial mock events timeline
  const allEvents = [
    { type: 'SLA', icon: '⏱', text: 'SLA response deadline approaching', agent: 'Compliance Bot', time: '10 mins ago' },
    { type: 'Escalation', icon: '⬆️', text: 'Escalated to Technical Lead — 504 Gateway error investigation request', agent: 'Sarah Connor', time: '45 mins ago' },
    { type: 'Note', icon: '📝', text: 'Nginx upstream backend node spikes at 95% CPU, checked database connections.', agent: 'Sarah Connor', time: '45 mins ago' },
    { type: 'Assignment', icon: '👤', text: 'Reassigned to Sarah Connor by PM Supervisor', agent: 'System', time: '1 hour ago' },
    { type: 'Annotation', icon: '📌', text: 'Case notes annotation added — Accessed for training purposes.', agent: 'Sarah Connor', time: '1 hour ago' },
    { type: 'Status', icon: '🟢', text: 'Case status changed to In Progress', agent: 'Sarah Connor', time: '1 hour ago' },
    { type: 'Deployment', icon: '🚀', text: 'v1.2.0-rc3 deployed to Staging environment', agent: 'Emma Watson', time: '4 hours ago' },
    { type: 'Invoice', icon: '💰', text: 'Invoice #INV-2026-004 sent to client billing contact', agent: 'Sophie Martin', time: '1 day ago' },
    { type: 'Reply', icon: '💬', text: 'Client replied via portal widget: Checkout endpoints failing', agent: 'Marie Dubois', time: '2 hours ago' },
    { type: 'Created', icon: '🎫', text: 'Converted from ticket #TCK-9481 · Entry point: Client Portal Bot', agent: 'Portal Bot', time: '2 hours ago' },
  ];

  const displayedEvents = onlyNotes 
    ? allEvents.filter(e => e.type === 'Note' || e.type === 'Annotation') 
    : allEvents;

  return (
    <div className="flex flex-col h-full bg-bg-surface border-l border-border w-[320px] animate-slide-in">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-bold font-heading text-text-primary flex items-center gap-2">
          Activity Log
        </h2>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-bg-elevated rounded text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-3 border-b border-border flex items-center justify-between bg-bg-base/30 gap-2">
        <button
          onClick={() => setOnlyNotes(!onlyNotes)}
          className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg border transition-all ${
            onlyNotes 
              ? 'border-accent-primary bg-accent-primary/10 text-accent-primary' 
              : 'border-border bg-bg-elevated/40 text-text-muted hover:text-text-secondary'
          }`}
        >
          Notes Only
        </button>

        <div className="flex gap-1.5">
          <select className="bg-bg-elevated border border-border rounded text-[10px] text-text-secondary px-1.5 py-1 focus:outline-none">
            <option>Today</option>
            <option>This week</option>
            <option>All time</option>
          </select>
          <button className="p-1 border border-border bg-bg-elevated rounded text-text-muted hover:text-text-primary">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Timeline List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-[11px]">
        {displayedEvents.map((evt, idx) => (
          <div key={idx} className="relative pl-6 border-l border-border pb-4 last:pb-0">
            {/* Timeline icon */}
            <div className="absolute left-[-11px] top-0 w-5 h-5 bg-bg-surface border border-border rounded-full flex items-center justify-center text-xs select-none">
              {evt.icon}
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center text-text-muted text-[9px]">
                <span>{evt.agent}</span>
                <span>{evt.time}</span>
              </div>
              <p className="text-text-secondary font-medium leading-relaxed">
                {evt.text}
              </p>
            </div>
          </div>
        ))}

        {displayedEvents.length === 0 && (
          <div className="text-center py-8 text-text-muted">
            No events match selected filters.
          </div>
        )}
      </div>
    </div>
  );
};
export default ActivityLogPanel;
