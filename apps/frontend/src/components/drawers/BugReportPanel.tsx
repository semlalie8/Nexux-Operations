import React, { useState } from 'react';
import { useNexusStore } from '../../store/nexusStore';
import { X, HelpCircle, AlertTriangle, Bug } from 'lucide-react';

interface BugReportPanelProps {
  onClose: () => void;
}

export const BugReportPanel: React.FC<BugReportPanelProps> = ({ onClose }) => {
  const { submitBugReport } = useNexusStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [severity, setSeverity] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('Medium');
  const [category, setCategory] = useState('UI / Visual');
  const [desc, setDesc] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim()) return;

    submitBugReport({
      severity,
      category,
      description: desc
    });

    alert('Bug report submitted to engineering queue successfully!');
    setDesc('');
    setIsFormOpen(false);
    onClose();
  };

  return (
    <div className="flex flex-col h-full bg-bg-surface border-l border-border w-[320px] animate-slide-in">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-bold font-heading text-text-primary flex items-center gap-1.5">
          <Bug className="w-4 h-4 text-accent-primary" />
          Bug Report
        </h2>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-bg-elevated rounded text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!isFormOpen ? (
          /* Introduction Area */
          <div className="space-y-4 pt-2">
            <div className="text-xs font-semibold text-text-primary">Bugs</div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Let us know about any issues related to this case or any system glitches observed on this portal screen.
            </p>

            <div className="flex gap-2.5">
              <button
                onClick={() => setShowTooltip(!showTooltip)}
                className="flex-1 py-2 bg-transparent hover:bg-bg-elevated border border-border text-xs text-text-secondary font-semibold rounded-lg flex items-center justify-center gap-1 transition-all"
              >
                <HelpCircle className="w-3.5 h-3.5" /> How this works
              </button>
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex-1 py-2 bg-text-primary text-bg-base hover:bg-text-secondary text-xs font-semibold rounded-lg transition-all"
              >
                Report a bug
              </button>
            </div>

            {showTooltip && (
              <div className="bg-bg-elevated border border-border rounded-xl p-3 text-[11px] text-text-secondary leading-normal space-y-1.5 animate-fade-in select-none">
                <div className="font-bold text-text-primary flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-accent-warning" />
                  Bug Reporting Guidelines
                </div>
                <p>When you submit a bug, it automatically compiles page parameters, active user roles, and your session details before creating a Jira/Linear issue tied to our internal platform queue.</p>
              </div>
            )}
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            {/* Severity */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-text-muted uppercase font-bold">Severity</label>
              <div className="flex rounded-lg bg-bg-base/40 p-0.5 border border-border/60">
                {(['Critical', 'High', 'Medium', 'Low'] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`flex-1 py-1 text-[10px] font-semibold rounded-md transition-all ${
                      severity === sev
                        ? sev === 'Critical' || sev === 'High' 
                          ? 'bg-accent-danger text-text-primary'
                          : 'bg-accent-primary text-text-primary'
                        : 'text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-text-muted uppercase font-bold">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-secondary px-3 py-2 focus:outline-none focus:border-accent-primary"
              >
                <option>UI / Visual</option>
                <option>Logic / Behavior</option>
                <option>Data / Sync</option>
                <option>Integration</option>
                <option>Performance</option>
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-text-muted uppercase font-bold">Description</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Describe the issue in detail. Include steps to reproduce."
                required
                className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-2 h-24 focus:outline-none focus:border-accent-primary resize-none"
              />
            </div>

            {/* Drag & drop upload zone */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-text-muted uppercase font-bold">Screenshot Attachment</label>
              <div className="border border-dashed border-border hover:border-accent-primary/50 transition-colors bg-bg-elevated/20 rounded-xl p-6 text-center cursor-pointer select-none">
                <span className="text-lg">📷</span>
                <p className="text-[10px] text-text-secondary mt-1 font-semibold">Drag & drop files here</p>
                <p className="text-[9px] text-text-muted">or click to browse from folder</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-border/20 pt-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-xs text-text-muted hover:text-text-primary hover:underline font-semibold"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 bg-text-primary text-bg-base hover:bg-text-secondary transition-colors text-xs font-semibold rounded-lg shadow"
              >
                Submit bug report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default BugReportPanel;
