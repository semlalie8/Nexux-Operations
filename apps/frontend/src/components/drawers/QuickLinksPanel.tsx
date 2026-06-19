import React from 'react';
import { useNexusStore } from '../../store/nexusStore';
import { X, ExternalLink, ShieldCheck } from 'lucide-react';

interface QuickLinksPanelProps {
  onClose: () => void;
}

export const QuickLinksPanel: React.FC<QuickLinksPanelProps> = ({ onClose }) => {
  const { user } = useNexusStore();

  const primaryLinks = [
    { name: 'Open Nexus Tickets', url: 'https://linear.app/nexus', desc: 'Internal ticketing & bug tracker' },
    { name: 'Nexus Knowledge Base', url: '#/knowledge', desc: 'SOPs, runbooks, and client documentation' },
    { name: 'Your Schedule', url: 'https://calendar.google.com', desc: 'Shift schedules and coverage rosters' },
    { name: 'Company Handbook', url: 'https://notion.so/nexus-handbook', desc: 'HR policies, benefits, and company values' }
  ];

  const devLinks = [
    { name: 'GitHub Organization', url: 'https://github.com/nexus-software-co', desc: 'Source repositories and active pull requests' },
    { name: 'CI/CD Jenkins Dashboard', url: 'https://jenkins.nexus.io', desc: 'Build statuses and deployment pipelines' },
    { name: 'AWS Console', url: 'https://aws.amazon.com', desc: 'Cloud infrastructure resources' },
    { name: 'Figma Design System', url: 'https://figma.com', desc: 'UX prototypes and style sheets' }
  ];

  const clientPortalLinks = [
    { name: 'Client Portal Dashboard', url: 'https://portal.nexus.io', desc: 'Customer-facing ticketing console' },
    { name: 'Help Center Docs', url: '#', desc: 'Public knowledge bases and FAQs' }
  ];

  const showDevResources = user.role === 'Technical Lead' || user.role === 'Administrator' || user.role === 'Senior Agent';

  return (
    <div className="flex flex-col h-full bg-bg-surface border-l border-border w-[320px] animate-slide-in">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-bold font-heading text-text-primary">← Quick Links</h2>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-bg-elevated rounded text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
        {/* Primary Resources */}
        <div className="space-y-3">
          <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider pl-1 border-l-2 border-accent-primary">
            General Resources
          </div>
          <div className="space-y-2">
            {primaryLinks.map((link, i) => (
              <a 
                key={i}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="block p-3 bg-bg-elevated/40 border border-border/60 hover:border-accent-primary/40 rounded-xl transition-all group"
              >
                <div className="flex items-center justify-between font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                  <span className="underline underline-offset-2">{link.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-accent-primary" />
                </div>
                <p className="text-[10px] text-text-muted mt-1 leading-normal">{link.desc}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Technical Resources */}
        {showDevResources ? (
          <div className="space-y-3">
            <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider pl-1 border-l-2 border-accent-primary">
              Developer Resources
            </div>
            <div className="space-y-2">
              {devLinks.map((link, i) => (
                <a 
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-3 bg-bg-elevated/40 border border-border/60 hover:border-accent-primary/40 rounded-xl transition-all group"
                >
                  <div className="flex items-center justify-between font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                    <span className="underline underline-offset-2">{link.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-accent-primary" />
                  </div>
                  <p className="text-[10px] text-text-muted mt-1 leading-normal">{link.desc}</p>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-bg-elevated/20 border border-border/40 rounded-xl text-[10px] text-text-muted flex items-start gap-2 select-none">
            <ShieldCheck className="w-4 h-4 text-text-muted flex-shrink-0" />
            <span>Developer consoles and staging environments hidden for role: {user.role}</span>
          </div>
        )}

        {/* Public Resources */}
        <div className="space-y-3">
          <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider pl-1 border-l-2 border-accent-primary">
            Customer Facing Systems
          </div>
          <div className="space-y-2">
            {clientPortalLinks.map((link, i) => (
              <a 
                key={i}
                href={link.url}
                className="block p-3 bg-bg-elevated/40 border border-border/60 hover:border-accent-primary/40 rounded-xl transition-all group"
              >
                <div className="flex items-center justify-between font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                  <span className="underline underline-offset-2">{link.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-accent-primary" />
                </div>
                <p className="text-[10px] text-text-muted mt-1 leading-normal">{link.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuickLinksPanel;
