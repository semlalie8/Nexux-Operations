import React, { useState } from 'react';
import { useNexusStore } from '../../store/nexusStore';
import { X } from 'lucide-react';

interface FeedbackPanelProps {
  onClose: () => void;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ onClose }) => {
  const { addFeedback } = useNexusStore();
  const [feature, setFeature] = useState('Dashboard');
  const [detail, setDetail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail.trim()) return;

    addFeedback(feature, detail);
    alert('Thanks for your feedback! We are always working to improve the Nexus experience.');
    setDetail('');
    onClose();
  };

  const featuresList = [
    'Dashboard', 'Inbox', 'Ticket View', 'Client Profiles', 'Projects', 
    'Messaging', 'Search', 'Billing', 'Reports', 'Knowledge Base', 
    'Settings', 'Other'
  ];

  return (
    <div className="flex flex-col h-full bg-bg-surface border-l border-border w-[320px] animate-slide-in">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-bold font-heading text-text-primary">How are we doing?</h2>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-bg-elevated rounded text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <p className="text-xs text-text-secondary leading-relaxed">
          We're always working to improve the Nexus experience, so we'd love to hear what's working and how we can do better.
        </p>
        <p className="text-[10px] text-text-muted border-t border-border/20 pt-2.5">
          Note: Please continue to report bugs through the appropriate channels.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-text-muted uppercase font-bold">Which feature is this about?</label>
            <select
              value={feature}
              onChange={(e) => setFeature(e.target.value)}
              className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-secondary px-3 py-2 focus:outline-none focus:border-accent-primary"
            >
              {featuresList.map((f, i) => (
                <option key={i} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Details */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-text-muted uppercase font-bold">Tell us a little bit more</label>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Share your experience with us. What went well? What could have gone better?"
              required
              className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-2 h-28 focus:outline-none focus:border-accent-primary resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-9 bg-transparent hover:bg-bg-elevated border border-border text-xs font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-9 bg-text-primary text-bg-base hover:bg-text-secondary transition-colors text-xs font-semibold rounded-lg shadow"
            >
              Send Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default FeedbackPanel;
