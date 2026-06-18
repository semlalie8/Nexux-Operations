import React, { useState } from 'react';
import { useNexusStore, Project } from '../store/nexusStore';
import { 
  Clipboard, Lock, Unlock, 
  MoreHorizontal, Link as LinkIcon, Paperclip, Settings as SettingsIcon, X
} from 'lucide-react';

// Profile tabs
import { OverviewTab } from '../components/profile-tabs/OverviewTab';
import { AccountTab } from '../components/profile-tabs/AccountTab';
import { SupportTab } from '../components/profile-tabs/SupportTab';
import { ProjectsTab } from '../components/profile-tabs/ProjectsTab';
import { ActivityTab } from '../components/profile-tabs/ActivityTab';
import { PaymentsTab } from '../components/profile-tabs/PaymentsTab';
import { BillingPrefsTab } from '../components/profile-tabs/BillingPrefsTab';
import { CommunicationsTab } from '../components/profile-tabs/CommunicationsTab';

// Drawer panels
import { CaseNotesPanel } from '../components/drawers/CaseNotesPanel';
import { SolutionsPanel } from '../components/drawers/SolutionsPanel';
import { ActivityLogPanel } from '../components/drawers/ActivityLogPanel';
import { AttachmentsPanel } from '../components/drawers/AttachmentsPanel';
import { BugReportPanel } from '../components/drawers/BugReportPanel';

export const TicketView: React.FC = () => {
  const { 
    tickets, activeTicketId, clients, projects, user, 
    updateTicketStatus, addTicketMessage 
  } = useNexusStore();

  const ticket = tickets.find(t => t.id === activeTicketId) || tickets[0];
  const client = clients.find(c => c.id === ticket?.clientId) || clients[0];
  
  // Local states
  const [activeProfileTab, setActiveProfileTab] = useState<number>(0);
  const [activeRightDrawer, setActiveRightDrawer] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealPassword, setRevealPassword] = useState('');
  const [showRevealModal, setShowRevealModal] = useState(false);
  
  // Message input state
  const [replyText, setReplyText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  // Active project selection
  const clientProjects = projects.filter(p => {
    if (client.id === 'CL-001') return p.id === 'PRJ-101';
    return p.id === 'PRJ-102';
  });
  const [activeProject, setActiveProject] = useState<Project>(clientProjects[0] || projects[0]);

  // Overflow menu toggle
  const [showOverflow, setShowOverflow] = useState(false);

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-4">
        <span className="text-4xl">🎫</span>
        <h2 className="font-heading font-extrabold text-text-primary text-lg">No cases found</h2>
        <p className="text-sm text-text-muted">Create a new issue from the inbox queue or dashboard.</p>
      </div>
    );
  }

  const handleRevealSensitive = (e: React.FormEvent) => {
    e.preventDefault();
    // In demo environment, any password or token (e.g. "admin" or just submitting) approves
    if (revealPassword.trim()) {
      setIsRevealed(true);
      setShowRevealModal(false);
      setRevealPassword('');
    } else {
      alert('Please enter your approval token or password.');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    addTicketMessage(ticket.id, replyText, isInternalNote);
    setReplyText('');
    
    // Add success flash effect
    const btn = document.getElementById('reply-btn');
    if (btn) {
      btn.classList.add('bg-accent-success');
      setTimeout(() => btn.classList.remove('bg-accent-success'), 800);
    }
  };

  const isReadOnlyMode = user.role === 'Trainee';

  const rightSidebarIcons = [
    { id: 'notes', icon: '✏️', tooltip: 'Case Notes' },
    { id: 'solutions', icon: '📋', tooltip: 'Solutions & Guides' },
    { id: 'activity', icon: '🔄', tooltip: 'Activity Log' },
    { id: 'links', icon: '🔗', tooltip: 'Related Links' },
    { id: 'attachments', icon: '📎', tooltip: 'Attachments' },
    { id: 'bug', icon: '🐛', tooltip: 'Bug Report' },
    { id: 'settings', icon: '⚙️', tooltip: 'Case Settings' },
  ];

  return (
    <div className="flex flex-col h-full space-y-6 select-text">
      {/* Top Bar */}
      <div className="sticky top-0 bg-[#0A0A0F]/80 backdrop-blur z-20 border-b border-border pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Status badge row */}
          <div className="flex items-center gap-1.5 mb-2.5">
            {(['Open', 'In Progress', 'Pending Review', 'Resolved', 'Closed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => !isReadOnlyMode && updateTicketStatus(ticket.id, status)}
                disabled={isReadOnlyMode}
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border transition-all ${
                  ticket.status === status
                    ? 'bg-accent-primary text-text-primary border-accent-primary/50'
                    : 'text-text-muted hover:text-text-secondary border-transparent'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <h1 className="text-sm font-mono text-text-secondary flex items-center gap-2">
            Case #<span className="font-bold text-text-primary">{ticket.id}</span>
          </h1>
          <p className="text-[11px] text-text-muted font-mono mt-1">
            Assigned to {ticket.assignedTo} · {ticket.assignedTeam}
          </p>
        </div>

        {/* Right CTAs */}
        <div className="flex items-center gap-2 relative">
          <button 
            onClick={() => setShowOverflow(!showOverflow)}
            className="p-2 bg-bg-surface border border-border rounded-lg text-text-secondary hover:text-text-primary transition-all"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          {/* Overflow Menu Dropdown */}
          {showOverflow && (
            <div className="absolute right-24 top-10 bg-bg-elevated border border-border rounded-xl shadow-xl p-2 w-48 z-50 text-xs text-left animate-fade-in">
              <button onClick={() => { alert('Assignee transfer window.'); setShowOverflow(false); }} className="w-full text-left px-2 py-1.5 rounded hover:bg-bg-surface text-text-secondary">Reassign Case</button>
              <button onClick={() => { alert('Ticket merging dashboard.'); setShowOverflow(false); }} className="w-full text-left px-2 py-1.5 rounded hover:bg-bg-surface text-text-secondary">Merge Tickets</button>
              <button onClick={() => { alert('Exporting complete audit bundle...'); setShowOverflow(false); }} className="w-full text-left px-2 py-1.5 rounded hover:bg-bg-surface text-text-secondary">Export Case Log</button>
              <button onClick={() => { updateTicketStatus(ticket.id, 'Closed'); setShowOverflow(false); }} className="w-full text-left px-2 py-1.5 rounded hover:bg-bg-surface text-accent-danger">Close without resolving</button>
            </div>
          )}

          <button
            onClick={() => {
              if (isReadOnlyMode) return;
              updateTicketStatus(ticket.id, 'Resolved');
              alert(`Case #${ticket.id} marked as Resolved.`);
            }}
            disabled={isReadOnlyMode}
            className={`px-4.5 py-2 text-xs font-semibold rounded-lg shadow transition-all ${
              isReadOnlyMode
                ? 'bg-gray-800 text-text-muted cursor-not-allowed'
                : 'bg-text-primary text-bg-base hover:bg-text-secondary'
            }`}
          >
            Resolve Case
          </button>
        </div>
      </div>

      {/* Three-Column Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Column 1 — Left metadata panel (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-bg-surface border border-border rounded-xl p-5 space-y-5 text-left">
            <div>
              <div className="text-[9px] font-mono text-text-muted uppercase">Case Subject</div>
              <h2 className="text-sm font-bold text-text-primary leading-snug mt-1">
                {ticket.subject}
              </h2>
            </div>

            {/* Who's involved */}
            <div className="space-y-3">
              <div className="text-[9px] font-mono text-text-muted uppercase">Who's involved</div>
              
              {/* Client Card */}
              <div className="flex items-center gap-3 p-2 rounded-lg bg-bg-elevated/40 border border-border/60">
                <img 
                  src={ticket.clientAvatar} 
                  alt={ticket.clientName} 
                  className="w-10 h-10 rounded-full border border-border object-cover"
                />
                <div className="flex flex-col truncate leading-tight">
                  <span className="text-xs font-bold text-text-primary truncate">{ticket.clientCompany}</span>
                  <span className="text-[10px] text-text-secondary truncate mt-0.5">{ticket.clientName}</span>
                </div>
              </div>

              {/* Account Manager Card */}
              <div className="flex items-center gap-3 p-2 rounded-lg bg-bg-elevated/40 border border-border/60">
                <img 
                  src="5.png" 
                  alt="Sarah Connor" 
                  className="w-10 h-10 rounded-full border border-border object-cover"
                />
                <div className="flex flex-col truncate leading-tight">
                  <span className="text-xs font-bold text-text-primary truncate">Sarah Connor</span>
                  <span className="text-[10px] text-text-muted truncate mt-0.5">Account Manager</span>
                </div>
              </div>
            </div>

            {/* Project card */}
            <div className="space-y-3 pt-3 border-t border-border/40">
              <div className="text-[9px] font-mono text-text-muted uppercase">Linked Project Info</div>
              
              <div className="bg-bg-elevated/20 border border-border rounded-xl p-3 space-y-3">
                <div className="flex gap-2.5">
                  <img 
                    src={activeProject.thumbnail} 
                    alt={activeProject.name} 
                    className="w-[80px] h-[60px] rounded object-cover border border-border/60 flex-shrink-0"
                  />
                  <div className="flex flex-col truncate leading-tight mt-1">
                    <span className="text-xs font-bold text-text-primary truncate">{activeProject.name}</span>
                    <span className="text-[9px] font-mono text-text-muted mt-1">{activeProject.code}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-[10px] text-text-secondary">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Type:</span>
                    <span className="font-semibold text-accent-primary">{activeProject.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Status:</span>
                    <span className="font-semibold">{activeProject.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Dates:</span>
                    <span>{activeProject.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Specs:</span>
                    <span>{activeProject.locationType.split(' · ')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Contract:</span>
                    <span>{activeProject.contractType}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Tickets */}
            <div className="space-y-3 pt-3 border-t border-border/40">
              <div className="text-[9px] font-mono text-text-muted uppercase">Related Tickets</div>
              <p className="text-[10px] text-text-muted italic">No related tickets have been created.</p>
            </div>
          </div>
        </div>

        {/* Column 2 — Main content area (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* User profile identifier tabs */}
          <div className="bg-bg-surface border border-border rounded-xl p-5 flex flex-col space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
              <div className="flex items-center gap-3">
                <img 
                  src={client.avatar} 
                  alt={client.name} 
                  className="w-16 h-16 rounded-full border border-border object-cover"
                />
                <div className="flex flex-col text-left">
                  <h2 className="text-lg font-bold text-text-primary flex items-center gap-1.5 font-heading">
                    {client.name}
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(client.id);
                        alert(`Copied ID: ${client.id}`);
                      }}
                      className="p-1 hover:bg-bg-elevated rounded text-text-muted hover:text-text-primary"
                      title="Copy ID"
                    >
                      <Clipboard className="w-3.5 h-3.5" />
                    </button>
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-text-muted">{client.company}</span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                      client.status === 'Full access' ? 'bg-accent-success/10 text-accent-success' : 'bg-accent-danger/10 text-accent-danger'
                    }`}>
                      {client.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    if (isRevealed) {
                      setIsRevealed(false);
                    } else {
                      setShowRevealModal(true);
                    }
                  }}
                  className="px-3 py-1.5 bg-transparent hover:bg-bg-elevated border border-border text-text-secondary hover:text-text-primary text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                >
                  {isRevealed ? (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-accent-success" />
                      Lock Information
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-accent-primary" />
                      Reveal Sensitive Information
                    </>
                  )}
                </button>

                <select className="bg-text-primary text-bg-base hover:bg-text-secondary px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer">
                  <option>More Actions ›</option>
                  <option>Edit Client</option>
                  <option>Suspend Account</option>
                  <option>Export Data (GDPR)</option>
                </select>
              </div>
            </div>

            {/* Eight profile tabs */}
            <div className="border-b border-border/20 overflow-x-auto">
              <div className="flex gap-4 pb-2 text-xs font-semibold whitespace-nowrap">
                {[
                  'Overview', 'Account', 'Support', 'Projects', 
                  'Activity', 'Payments', 'Billing Preferences', 'Communications'
                ].map((tabName, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveProfileTab(index)}
                    className={`py-1.5 px-2.5 rounded-lg transition-all ${
                      activeProfileTab === index
                        ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/25'
                        : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated/40 border border-transparent'
                    }`}
                  >
                    {tabName}
                  </button>
                ))}
              </div>
            </div>

            {/* Render selected profile tab content */}
            <div className="pt-2">
              {activeProfileTab === 0 && <OverviewTab client={client} isRevealed={isRevealed} />}
              {activeProfileTab === 1 && <AccountTab client={client} isRevealed={isRevealed} />}
              {activeProfileTab === 2 && <SupportTab client={client} />}
              {activeProfileTab === 3 && <ProjectsTab client={client} onSelectProject={setActiveProject} />}
              {activeProfileTab === 4 && <ActivityTab project={activeProject} />}
              {activeProfileTab === 5 && <PaymentsTab client={client} />}
              {activeProfileTab === 6 && <BillingPrefsTab client={client} isRevealed={isRevealed} />}
              {activeProfileTab === 7 && <CommunicationsTab client={client} />}
            </div>
          </div>

          {/* Client ticket communication thread (Chat window) */}
          <div className="bg-bg-surface border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
              Client Communication Thread
            </h3>

            {/* Message bubble list */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto border border-border/40 bg-bg-base/20 rounded-xl p-4">
              {ticket.messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border ${
                    msg.isInternal 
                      ? 'bg-accent-warning/5 border-accent-warning/20' 
                      : 'bg-bg-surface border-border/50'
                  }`}
                >
                  <img 
                    src={msg.avatar} 
                    alt={msg.sender}
                    className="w-8 h-8 rounded-full border border-border object-cover flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${msg.sender}`;
                    }}
                  />
                  <div className="flex-1 space-y-1 overflow-hidden">
                    <div className="flex items-center justify-between text-[10px] font-mono text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-text-primary">{msg.sender}</span>
                        <span className="bg-bg-elevated px-1.5 py-0.2 rounded border border-border font-semibold text-[8px] text-text-secondary uppercase">
                          {msg.role}
                        </span>
                        {msg.isInternal && (
                          <span className="bg-accent-warning/20 border border-accent-warning/45 text-accent-warning px-1.5 py-0.2 rounded font-semibold text-[8px] uppercase">
                            INTERNAL NOTE
                          </span>
                        )}
                      </div>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed text-left whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Input Box */}
            <form onSubmit={handleSendMessage} className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex rounded-lg bg-bg-base/40 p-0.5 border border-border/60 text-[10px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setIsInternalNote(false)}
                    className={`px-3 py-1 rounded-md transition-all ${
                      !isInternalNote
                        ? 'bg-bg-elevated text-text-primary'
                        : 'text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    Reply to Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsInternalNote(true)}
                    className={`px-3 py-1 rounded-md transition-all ${
                      isInternalNote
                        ? 'bg-accent-warning/10 text-accent-warning border border-accent-warning/20'
                        : 'text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    Internal Note
                  </button>
                </div>

                <span className="text-[10px] text-text-muted font-mono">
                  Press Command+Enter to send
                </span>
              </div>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={isInternalNote ? "Write a private internal note..." : "Compose client message..."}
                required
                className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-2 h-20 focus:outline-none focus:border-accent-primary resize-none"
              />

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button type="button" className="p-2 bg-bg-elevated hover:bg-bg-surface border border-border rounded-lg text-text-muted hover:text-text-primary transition-all">
                    <Paperclip className="w-4 h-4" />
                  </button>
                </div>
                <button
                  id="reply-btn"
                  type="submit"
                  className="px-4.5 py-2 bg-accent-primary hover:bg-accent-primary/80 transition-colors text-text-primary text-xs font-semibold rounded-lg shadow"
                >
                  {isInternalNote ? 'Post Note' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Column 3 — Right sidebar icon bar (1 col) */}
        <div className="lg:col-span-1 flex justify-center">
          <div className="flex lg:flex-col items-center bg-bg-surface border border-border rounded-xl p-2 gap-2">
            {rightSidebarIcons.map((drawer) => (
              <button
                key={drawer.id}
                onClick={() => {
                  if (activeRightDrawer === drawer.id) {
                    setActiveRightDrawer(null);
                  } else {
                    setActiveRightDrawer(drawer.id);
                  }
                }}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all relative group ${
                  activeRightDrawer === drawer.id
                    ? 'bg-accent-primary text-white'
                    : 'bg-transparent hover:bg-bg-elevated text-text-secondary hover:text-text-primary'
                }`}
                title={drawer.tooltip}
              >
                <span>{drawer.icon}</span>
                {/* Tooltip hover */}
                <div className="opacity-0 group-hover:opacity-100 absolute right-12 bg-bg-elevated border border-border text-[9px] text-text-secondary px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap z-50">
                  {drawer.tooltip}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Drawers Overlays (Sliding from Right over Column 2) */}
      {activeRightDrawer && (
        <div className="fixed inset-y-0 right-0 z-30 flex animate-fade-in shadow-2xl pl-[60px]">
          {/* Backdrop click to close */}
          <div className="flex-1 w-[calc(100vw-380px)]" onClick={() => setActiveRightDrawer(null)} />
          
          <div className="flex-shrink-0 relative">
            {activeRightDrawer === 'notes' && (
              <CaseNotesPanel ticketId={ticket.id} onClose={() => setActiveRightDrawer(null)} />
            )}
            {activeRightDrawer === 'solutions' && (
              <SolutionsPanel onClose={() => setActiveRightDrawer(null)} />
            )}
            {activeRightDrawer === 'activity' && (
              <ActivityLogPanel ticketId={ticket.id} onClose={() => setActiveRightDrawer(null)} />
            )}
            {activeRightDrawer === 'attachments' && (
              <AttachmentsPanel onClose={() => setActiveRightDrawer(null)} />
            )}
            {activeRightDrawer === 'bug' && (
              <BugReportPanel onClose={() => setActiveRightDrawer(null)} />
            )}
            
            {/* Case Settings (⚙️) Inline Drawer Panel */}
            {activeRightDrawer === 'settings' && (
              <div className="flex flex-col h-full bg-bg-surface border-l border-border w-[320px] animate-slide-in">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="text-sm font-bold font-heading text-text-primary flex items-center gap-1.5">
                    <SettingsIcon className="w-4 h-4 text-accent-primary" />
                    Case Settings
                  </h2>
                  <button onClick={() => setActiveRightDrawer(null)} className="p-1 hover:bg-bg-elevated rounded text-text-muted hover:text-text-primary">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-text-muted uppercase font-bold">Case Priority</label>
                    <select 
                      value={ticket.priority} 
                      onChange={() => alert('Changing priority requires Senior Agent authentication.')}
                      className="w-full bg-bg-elevated border border-border rounded-lg p-2 text-text-secondary focus:outline-none"
                    >
                      <option>Urgent</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-text-muted uppercase font-bold">Assigned Tier</label>
                    <select className="w-full bg-bg-elevated border border-border rounded-lg p-2 text-text-secondary focus:outline-none">
                      <option>Escalation Tier 2 (Current)</option>
                      <option>Escalation Tier 1</option>
                      <option>API & Backend Engineering</option>
                      <option>Web3 Smart Contracts Team</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Related Links (🔗) Inline Drawer Panel */}
            {activeRightDrawer === 'links' && (
              <div className="flex flex-col h-full bg-bg-surface border-l border-border w-[320px] animate-slide-in">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="text-sm font-bold font-heading text-text-primary flex items-center gap-1.5">
                    <LinkIcon className="w-4 h-4 text-accent-primary" />
                    Related Links
                  </h2>
                  <button onClick={() => setActiveRightDrawer(null)} className="p-1 hover:bg-bg-elevated rounded text-text-muted hover:text-text-primary">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 space-y-3 text-xs leading-normal">
                  <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider pl-1 border-l-2 border-accent-primary">
                    External Resources
                  </div>
                  <div className="space-y-2">
                    <a href="#jira" className="block p-3 bg-bg-elevated/40 border border-border rounded-xl hover:border-accent-primary/40 transition-colors">
                      <div className="font-bold text-text-primary hover:underline flex items-center gap-1 justify-between">
                        <span>Jira Issue Link</span> ↗
                      </div>
                      <p className="text-[10px] text-text-muted mt-1">Jira issue link for production crash logs: NEX-9428</p>
                    </a>
                    <a href="#kibana" className="block p-3 bg-bg-elevated/40 border border-border rounded-xl hover:border-accent-primary/40 transition-colors">
                      <div className="font-bold text-text-primary hover:underline flex items-center gap-1 justify-between">
                        <span>Kibana Log Dashboard</span> ↗
                      </div>
                      <p className="text-[10px] text-text-muted mt-1">Log searches matching upstream 504 gatewaytimeouts.</p>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reveal Modal */}
      {showRevealModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <form onSubmit={handleRevealSensitive} className="bg-bg-surface border border-border rounded-xl w-full max-w-sm p-6 space-y-4">
            <h3 className="font-heading font-bold text-text-primary text-base flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-accent-danger animate-pulse" />
              Authorization Required
            </h3>
            <p className="text-xs text-text-secondary leading-normal">
              To reveal sensitive client PII, legal VAT registration numbers, and total project contract values, you must enter your user password or manager approval token.
            </p>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-text-muted uppercase">Password / Token</label>
              <input
                type="password"
                required
                value={revealPassword}
                onChange={(e) => setRevealPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-2 focus:outline-none focus:border-accent-primary"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowRevealModal(false)}
                className="flex-1 h-9 bg-transparent hover:bg-bg-elevated border border-border text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-9 bg-accent-primary hover:bg-accent-primary/80 text-text-primary text-xs font-semibold rounded-lg"
              >
                Authorize
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default TicketView;
