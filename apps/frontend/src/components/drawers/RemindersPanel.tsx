import React, { useState } from 'react';
import { useNexusStore } from '../../store/nexusStore';
import { X, Calendar, Clock, CheckCircle2, Trash2 } from 'lucide-react';

interface RemindersPanelProps {
  onClose: () => void;
}

export const RemindersPanel: React.FC<RemindersPanelProps> = ({ onClose }) => {
  const { reminders, addReminder, toggleReminder, deleteReminder } = useNexusStore();
  const [showAdd, setShowAdd] = useState(false);
  
  // New reminder form state
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'urgent' | 'medium' | 'low'>('medium');
  const [linkedEntity, setLinkedEntity] = useState('TCK-9481');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addReminder({
      title,
      dueDate: dueDate || 'Tomorrow at 9:00 AM',
      entityType: 'ticket',
      entityId: linkedEntity,
      entityName: linkedEntity,
      priority
    });

    setTitle('');
    setDueDate('');
    setShowAdd(false);
  };

  const priorityColors = {
    urgent: 'bg-accent-danger',
    medium: 'bg-accent-warning',
    low: 'bg-text-muted'
  };

  return (
    <div className="flex flex-col h-full bg-bg-surface border-l border-border w-[320px] animate-slide-in relative">
      {/* Add Reminder Modal Overlay */}
      {showAdd && (
        <div className="absolute inset-0 bg-bg-surface z-10 p-4 flex flex-col space-y-4">
          <div className="flex justify-between items-center border-b border-border/40 pb-2">
            <h3 className="font-heading font-bold text-text-primary text-xs">New Reminder</h3>
            <button onClick={() => setShowAdd(false)} className="text-xs text-text-muted hover:text-text-primary">Cancel</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-text-muted uppercase font-bold">Reminder Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Call client for API log access"
                  className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-text-muted uppercase font-bold">Due Date / Time</label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="e.g. Tomorrow at 3:00 PM"
                  className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-text-muted uppercase font-bold">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-secondary px-3 py-2 focus:outline-none"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-text-muted uppercase font-bold">Link Entity</label>
                  <select
                    value={linkedEntity}
                    onChange={(e) => setLinkedEntity(e.target.value)}
                    className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-secondary px-3 py-2 focus:outline-none"
                  >
                    <option value="TCK-9481">Ticket #TCK-9481</option>
                    <option value="PRJ-101">Project PayTech</option>
                    <option value="INV-2026-002">Invoice #INV-002</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-10 bg-accent-primary hover:bg-accent-primary/80 text-text-primary text-xs font-semibold rounded-lg shadow mt-4"
            >
              Save Reminder
            </button>
          </form>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-bold font-heading text-text-primary">Your Reminders</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdd(true)}
            className="px-2 py-0.5 bg-bg-elevated hover:bg-bg-elevated/70 border border-border rounded-full text-[10px] font-bold text-text-primary"
          >
            New
          </button>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-bg-elevated rounded text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reminders List */}
      <div className="flex-1 overflow-y-auto p-4">
        {reminders.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-2">
            <span className="text-2xl">⏰</span>
            <h3 className="font-heading font-semibold text-text-primary text-xs">All clear, no reminders here</h3>
            <p className="text-[10px] text-text-muted max-w-[200px]">Need to be reminded of something? Click new above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map((rem) => (
              <div 
                key={rem.id}
                className={`border rounded-xl p-3 space-y-2.5 transition-all ${
                  rem.completed 
                    ? 'bg-bg-elevated/20 border-border/40 opacity-60' 
                    : 'bg-bg-elevated/40 border-border/60 hover:border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 overflow-hidden">
                    <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${priorityColors[rem.priority]}`} />
                    <span className={`text-xs font-semibold text-text-primary text-left leading-snug ${
                      rem.completed ? 'line-through text-text-muted' : ''
                    }`}>
                      {rem.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] font-mono text-text-muted pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-text-muted" />
                    {rem.dueDate}
                  </span>
                  {rem.entityId && (
                    <span className="bg-bg-surface border border-border/60 px-1.5 py-0.5 rounded text-[8px] text-text-secondary">
                      {rem.entityName}
                    </span>
                  )}
                </div>

                {/* Actions row */}
                <div className="flex items-center gap-2 border-t border-border/20 pt-2.5">
                  <button
                    onClick={() => toggleReminder(rem.id)}
                    className="text-[9px] font-bold text-accent-success hover:underline flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {rem.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button
                    onClick={() => alert('Reminder snoozed for 1 hour.')}
                    className="text-[9px] font-bold text-text-muted hover:underline flex items-center gap-1"
                  >
                    <Clock className="w-3 h-3" />
                    Snooze
                  </button>
                  <button
                    onClick={() => deleteReminder(rem.id)}
                    className="text-[9px] font-bold text-accent-danger hover:underline ml-auto flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default RemindersPanel;
