import React, { useState } from 'react';
import { X, Plus, FileText, Image, Download, Trash2, ShieldAlert } from 'lucide-react';

interface AttachmentsPanelProps {
  onClose: () => void;
}

export const AttachmentsPanel: React.FC<AttachmentsPanelProps> = ({ onClose }) => {
  const [refs, setRefs] = useState([
    { id: 'att_1', name: 'transaction-sequence-flow.png', size: '184 KB', type: 'image', path: '18.png', uploader: 'Sarah Connor', date: 'Jun 18, 2026' },
    { id: 'att_2', name: 'payment-gateway-schema.sql', size: '1.2 KB', type: 'sql', path: '20.png', uploader: 'Hiroshi Tanaka', date: 'Jun 18, 2026' },
    { id: 'att_3', name: 'smart-contract-audit-report.pdf', size: '3.2 MB', type: 'pdf', path: '19.png', uploader: 'Alex Rivera', date: 'Jun 15, 2026' },
    { id: 'att_4', name: 'prod-secrets.env', size: '254 B', type: 'env', path: '', uploader: 'Hiroshi Tanaka', date: 'Jun 18, 2026', sensitive: true }
  ]);

  const [threads] = useState([
    { id: 'att_5', name: 'production-error-log.json', size: '4.2 KB', type: 'json', path: '17.png', uploader: 'Marie Dubois', date: 'Jun 18, 2026', thread: 'Client Initial Ticket Message' },
    { id: 'att_6', name: 'load-test-report.pdf', size: '1.4 MB', type: 'pdf', path: '21.png', uploader: 'Sarah Connor', date: 'Jun 17, 2026', thread: 'Internal Team Slack Import' }
  ]);

  const handleAddAttachment = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const newFile = {
          id: `att_${Date.now()}`,
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.name.split('.').pop() || 'file',
          path: '23.png', // Fallback display file
          uploader: 'Sarah Connor',
          date: 'Just now'
        };
        setRefs([newFile, ...refs]);
      }
    };
    fileInput.click();
  };

  const handleDeleteRef = (id: string) => {
    setRefs(refs.filter(r => r.id !== id));
  };

  const getFileIcon = (type: string) => {
    if (type === 'png' || type === 'jpg' || type === 'image') return <Image className="w-4 h-4 text-sky-400" />;
    return <FileText className="w-4 h-4 text-accent-primary" />;
  };

  return (
    <div className="flex flex-col h-full bg-bg-surface border-l border-border w-[320px] animate-slide-in">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-bold font-heading text-text-primary">Attachments</h2>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-bg-elevated rounded text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Added for reference */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-mono font-semibold text-text-muted uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
              Added for reference ({refs.length})
            </h3>
            <button
              onClick={handleAddAttachment}
              className="p-1 hover:bg-bg-elevated rounded text-accent-primary transition-colors"
              title="Add attachment"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {refs.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-border rounded-xl bg-bg-base/20">
              <p className="text-[10px] text-text-muted">No attachments have been added.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {refs.map((file) => (
                <div 
                  key={file.id}
                  className="bg-bg-elevated/40 border border-border/60 rounded-xl p-3 flex items-start justify-between gap-2.5 hover:border-border transition-all group"
                >
                  <div className="flex gap-2.5 overflow-hidden">
                    <div className="mt-0.5 flex-shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex flex-col text-left truncate">
                      {file.sensitive ? (
                        <span className="text-xs font-semibold text-accent-danger font-mono flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
                          •••••••• (masked)
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-text-primary truncate">{file.name}</span>
                      )}
                      <span className="text-[9px] font-mono text-text-muted mt-0.5">
                        {file.size} · {file.uploader}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!file.sensitive && file.path && (
                      <button 
                        onClick={() => alert(`Opening preview for visual asset: ${file.name}`)}
                        className="p-1 hover:bg-bg-elevated rounded text-text-secondary hover:text-text-primary transition-colors"
                        title="View File"
                      >
                        👁
                      </button>
                    )}
                    <button 
                      onClick={() => alert(`Downloading attachment metadata: ${file.name}`)}
                      className="p-1 hover:bg-bg-elevated rounded text-text-secondary hover:text-text-primary transition-colors"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteRef(file.id)}
                      className="p-1 hover:bg-bg-elevated rounded text-text-secondary hover:text-accent-danger transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attached to threads */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono font-semibold text-text-muted uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
            Attached to threads ({threads.length})
          </h3>

          <div className="space-y-2">
            {threads.map((file) => (
              <div 
                key={file.id}
                className="bg-bg-elevated/40 border border-border/60 rounded-xl p-3 flex flex-col gap-2 hover:border-border transition-all"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex gap-2.5 overflow-hidden">
                    <div className="mt-0.5 flex-shrink-0">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex flex-col text-left truncate">
                      <span className="text-xs font-semibold text-text-primary truncate">{file.name}</span>
                      <span className="text-[9px] font-mono text-text-muted mt-0.5">
                        {file.size} · {file.uploader}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {file.path && (
                      <button 
                        onClick={() => alert(`Opening preview for visual asset: ${file.name}`)}
                        className="p-1 hover:bg-bg-elevated rounded text-text-secondary hover:text-text-primary transition-colors"
                        title="View File"
                      >
                        👁
                      </button>
                    )}
                    <button 
                      onClick={() => alert(`Downloading thread attachment: ${file.name}`)}
                      className="p-1 hover:bg-bg-elevated rounded text-text-secondary hover:text-text-primary transition-colors"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-[9px] bg-bg-surface/50 border border-border/50 rounded p-1.5 text-text-muted truncate">
                  Tied to: <strong className="text-text-secondary">{file.thread}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AttachmentsPanel;
