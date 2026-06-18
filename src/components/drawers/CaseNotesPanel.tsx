import React, { useState } from 'react';
import { useNexusStore } from '../../store/nexusStore';
import { Plus, ShieldAlert, X } from 'lucide-react';

interface CaseNotesPanelProps {
  ticketId: string;
  onClose: () => void;
}

export const CaseNotesPanel: React.FC<CaseNotesPanelProps> = ({ ticketId, onClose }) => {
  const { tickets, addAnnotation } = useNexusStore();
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const ticket = tickets.find(t => t.id === ticketId);

  if (!ticket) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    addAnnotation(ticketId, newNote);
    setNewNote('');
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col h-full bg-bg-surface border-l border-border w-[320px] animate-slide-in">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-bold font-heading text-text-primary">Case Notes</h2>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-bg-elevated rounded text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Internal only warning */}
      <div className="p-3 bg-accent-warning/10 border-b border-border text-[10px] text-accent-warning flex items-start gap-2 select-none">
        <ShieldAlert className="w-4 h-4 flex-shrink-0" />
        <span>INTERNAL USE ONLY — Notes are confidential and never visible to the client portal.</span>
      </div>

      {/* Annotations List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Baseline Training Note */}
        <div className="bg-bg-elevated/40 border border-border/60 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center gap-2">
            <img 
              src="4.png" 
              alt="System" 
              className="w-7 h-7 rounded-full border border-border object-cover"
            />
            <div className="flex flex-col text-[10px] leading-tight">
              <span className="font-bold text-text-primary">System Compliance Bot</span>
              <span className="text-text-muted font-mono">1 year ago</span>
            </div>
          </div>
          <p className="text-[11px] text-text-secondary leading-normal">
            Accessed for training purposes. Checked production dashboard settings. Audit log registered at 2025-06-18.
          </p>
        </div>

        {ticket.annotations.map((ann) => (
          <div 
            key={ann.id}
            className="bg-bg-elevated/40 border border-border/60 rounded-xl p-3.5 space-y-2 animate-fade-in"
          >
            <div className="flex items-center gap-2">
              <img 
                src={ann.avatar} 
                alt={ann.agentName} 
                className="w-7 h-7 rounded-full border border-border object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${ann.agentName}`;
                }}
              />
              <div className="flex flex-col text-[10px] leading-tight">
                <span className="font-bold text-text-primary">{ann.agentName}</span>
                <span className="text-text-muted font-mono">{ann.time}</span>
              </div>
            </div>
            <p className="text-[11px] text-text-secondary leading-normal">
              {ann.text}
            </p>
          </div>
        ))}

        {ticket.annotations.length === 0 && !isAdding && (
          <div className="text-center py-6 text-text-muted text-[11px]">
            No internal annotations added yet.
          </div>
        )}
      </div>

      {/* Footer Add Action */}
      <div className="p-4 bg-bg-elevated border-t border-border">
        {isAdding ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Type internal note here..."
              required
              className="w-full bg-bg-surface border border-border rounded-lg text-xs text-text-primary px-3 py-2 h-20 focus:outline-none focus:border-accent-primary resize-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 py-1.5 bg-transparent hover:bg-bg-surface border border-border text-[10px] font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-1.5 bg-accent-primary hover:bg-accent-primary/80 text-text-primary text-[10px] font-semibold rounded-lg"
              >
                Save Note
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-2 border border-dashed border-border rounded-lg text-xs text-text-secondary hover:text-accent-primary flex items-center justify-center gap-1 hover:border-accent-primary/30 transition-all font-semibold"
          >
            <Plus className="w-3.5 h-3.5" /> Add annotation
          </button>
        )}
      </div>
    </div>
  );
};
export default CaseNotesPanel;
