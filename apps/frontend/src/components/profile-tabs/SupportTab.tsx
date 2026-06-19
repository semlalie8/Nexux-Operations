import React, { useState } from 'react';
import { ClientProfile, useNexusStore } from '../../store/nexusStore';
import { Plus, ChevronRight } from 'lucide-react';

interface SupportTabProps {
  client: ClientProfile;
}

export const SupportTab: React.FC<SupportTabProps> = ({ client }) => {
  const { tickets, createTicket, user } = useNexusStore();
  const [subTab, setSubTab] = useState<'tickets' | 'resolutions' | 'flags' | 'sla' | 'escalations'>('tickets');
  
  // Create ticket states
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newPriority, setNewPriority] = useState<'Urgent' | 'High' | 'Medium' | 'Low'>('Medium');
  const [newDesc, setNewDesc] = useState('');

  // Flag states
  const [flags, setFlags] = useState<Array<{ type: string; severity: string; date: string; addedBy: string; status: string }>>([
    { type: 'Payment Warning', severity: 'Medium', date: 'Jun 05, 2026', addedBy: 'Sophie Martin', status: 'Resolved' },
    { type: 'Deployment Escalation', severity: 'High', date: 'Jun 18, 2026', addedBy: 'Sarah Connor', status: 'Active' }
  ]);
  const [showAddFlagModal, setShowAddFlagModal] = useState(false);
  const [flagType, setFlagType] = useState('Scope Creep');
  const [flagSeverity, setFlagSeverity] = useState('High');

  // Filter state
  const [ticketFilter, setTicketFilter] = useState<'All' | 'Active' | 'Closed'>('All');

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    createTicket({
      subject: newSubject,
      priority: newPriority,
      clientId: client.id,
      clientName: client.name,
      clientCompany: client.company,
      clientAvatar: client.avatar,
      projectId: 'PRJ-101',
      projectName: 'PayTech Portal',
      projectService: 'Fintech',
      projectThumb: '11.png',
      lastMessage: newDesc || 'Inquiry initiated by support agent.',
    });

    setNewSubject('');
    setNewDesc('');
    setShowCreateTicketModal(false);
  };

  const handleAddFlag = (e: React.FormEvent) => {
    e.preventDefault();
    const newFlag = {
      type: flagType,
      severity: flagSeverity,
      date: 'Just now',
      addedBy: user.name,
      status: 'Active'
    };
    setFlags([newFlag, ...flags]);
    setShowAddFlagModal(false);
  };

  // Filter client-specific tickets
  const clientTickets = tickets.filter(t => t.clientId === client.id);
  const activeTickets = clientTickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed');
  const closedTickets = clientTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed');

  const displayedTickets = ticketFilter === 'All' 
    ? clientTickets 
    : ticketFilter === 'Active' 
      ? activeTickets 
      : closedTickets;

  const priorityColors = {
    Urgent: 'bg-accent-danger/10 text-accent-danger border-accent-danger/25',
    High: 'bg-accent-warning/10 text-accent-warning border-accent-warning/25',
    Medium: 'bg-accent-primary/10 text-accent-primary border-accent-primary/25',
    Low: 'bg-gray-800 text-text-muted border-border'
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-4 border-b border-border/30 pb-3">
        {(['tickets', 'resolutions', 'flags', 'sla', 'escalations'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`text-xs font-semibold px-1 py-0.5 relative transition-all capitalize ${
              subTab === tab ? 'text-accent-primary' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab === 'sla' ? 'SLA Settings' : tab === 'tickets' ? 'Tickets & Cases' : tab}
            {subTab === tab && (
              <div className="absolute left-0 right-0 bottom-[-13px] h-0.5 bg-accent-primary" />
            )}
          </button>
        ))}
      </div>

      {subTab === 'tickets' && (
        /* Tickets & Cases sub-tab */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              onClick={() => setShowCreateTicketModal(true)}
              className="px-3 py-1.5 bg-bg-elevated hover:bg-bg-elevated/70 border border-border text-text-primary font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
            >
              Create new issue <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
            </button>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg bg-bg-base/40 p-0.5 border border-border/60">
                {(['All', 'Active', 'Closed'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTicketFilter(filter)}
                    className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
                      ticketFilter === filter
                        ? 'bg-bg-elevated text-text-primary'
                        : 'text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
            <div className="space-y-1">
              <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
                Active tickets and cases
              </h3>
              <p className="text-[10px] text-text-muted">Showing all tickets matching filter: {ticketFilter}</p>
            </div>

            {displayedTickets.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-border rounded-xl bg-bg-base/20 space-y-1">
                <span className="text-xl">🔵</span>
                <p className="text-xs font-semibold text-text-secondary">Nothing to see here!</p>
                <p className="text-[10px] text-text-muted">No matching cases found for this account.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/40 text-text-muted h-8">
                      <th className="font-semibold pb-2">Status</th>
                      <th className="font-semibold pb-2">Ticket ID</th>
                      <th className="font-semibold pb-2">Project</th>
                      <th className="font-semibold pb-2">Contact Reason</th>
                      <th className="font-semibold pb-2">Priority</th>
                      <th className="font-semibold pb-2 text-right">Assigned Agent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {displayedTickets.map((t, i) => (
                      <tr key={i} className="h-12 hover:bg-bg-base/30 transition-colors">
                        <td>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
                            t.status === 'Open' 
                              ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/20'
                              : t.status === 'In Progress'
                                ? 'bg-accent-warning/10 text-accent-warning border-accent-warning/20'
                                : 'bg-accent-success/10 text-accent-success border-accent-success/20'
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="font-mono font-bold text-text-primary">{t.id}</td>
                        <td className="font-semibold text-text-secondary">{t.projectName}</td>
                        <td className="max-w-[200px] truncate pr-4 text-text-primary font-medium">{t.subject}</td>
                        <td>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${priorityColors[t.priority]}`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="text-right text-text-muted font-mono">{t.assignedTo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Past tickets section pagination placeholder */}
          <div className="flex items-center justify-between text-[11px] text-text-muted pt-2">
            <span>Showing {displayedTickets.length} cases</span>
            <div className="flex gap-2">
              <button disabled className="px-2.5 py-1 bg-bg-elevated/40 border border-border rounded opacity-50 cursor-not-allowed">← Previous</button>
              <span className="px-3 py-1 font-mono text-text-secondary">Page 1 of 1</span>
              <button disabled className="px-2.5 py-1 bg-bg-elevated/40 border border-border rounded opacity-50 cursor-not-allowed">Next →</button>
            </div>
          </div>
        </div>
      )}

      {subTab === 'resolutions' && (
        /* Resolutions sub-tab */
        <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
            Resolution History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 text-text-muted h-8">
                  <th className="font-semibold pb-2">Resolution Type</th>
                  <th className="font-semibold pb-2">Date</th>
                  <th className="font-semibold pb-2">Agent</th>
                  <th className="font-semibold pb-2">Outcome</th>
                  <th className="font-semibold pb-2 text-right">CSAT Collected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                <tr className="h-10 hover:bg-bg-base/30 transition-colors">
                  <td className="font-bold text-text-primary">Bug Fix deployed</td>
                  <td>May 10, 2026</td>
                  <td className="font-mono">Sarah Connor</td>
                  <td className="text-accent-success font-semibold">Verified Resolved</td>
                  <td className="text-right font-mono font-bold text-text-primary">⭐ 5.0 / 5</td>
                </tr>
                <tr className="h-10 hover:bg-bg-base/30 transition-colors">
                  <td className="font-bold text-text-primary">Configuration Assist</td>
                  <td>Apr 24, 2026</td>
                  <td className="font-mono">Alex Rivera</td>
                  <td className="text-accent-success font-semibold">User Confirmed</td>
                  <td className="text-right font-mono font-bold text-text-primary">⭐ 4.5 / 5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'flags' && (
        /* Admin Flags sub-tab */
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
              Admin & Account Warnings
            </h3>
            
            <button
              onClick={() => setShowAddFlagModal(true)}
              className="px-2.5 py-1 bg-accent-primary hover:bg-accent-primary/80 text-text-primary font-semibold text-xs rounded-lg flex items-center gap-1 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add Flag
            </button>
          </div>

          <div className="bg-bg-surface/50 border border-border rounded-xl p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/40 text-text-muted h-8">
                    <th className="font-semibold pb-2">Flag Type</th>
                    <th className="font-semibold pb-2">Severity</th>
                    <th className="font-semibold pb-2">Date Added</th>
                    <th className="font-semibold pb-2">Added By</th>
                    <th className="font-semibold pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {flags.map((flag, i) => (
                    <tr key={i} className="h-10 hover:bg-bg-base/30 transition-colors">
                      <td className="font-bold text-text-primary">{flag.type}</td>
                      <td>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          flag.severity === 'High' ? 'bg-accent-danger/10 text-accent-danger' : 'bg-accent-warning/10 text-accent-warning'
                        }`}>
                          {flag.severity}
                        </span>
                      </td>
                      <td className="text-text-secondary">{flag.date}</td>
                      <td className="font-mono">{flag.addedBy}</td>
                      <td className="text-right">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                          flag.status === 'Active' ? 'bg-accent-danger/10 text-accent-danger animate-pulse' : 'bg-gray-800 text-text-muted'
                        }`}>
                          {flag.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {subTab === 'sla' && (
        /* SLA Settings sub-tab */
        <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
              Contracted Response Tiers
            </h3>
            
            {user.role === 'Administrator' || user.role === 'Senior Agent' ? (
              <button className="px-2.5 py-1 bg-bg-elevated hover:bg-bg-elevated/70 border border-border text-text-primary font-semibold text-xs rounded-lg">
                Edit SLA Settings
              </button>
            ) : (
              <span className="text-[10px] text-text-muted font-mono">Edit restricted to PMs/Admins</span>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/20 pb-3">
              <span className="text-xs text-text-muted font-medium">Current SLA Tier</span>
              <span className="bg-accent-warning/15 border border-accent-warning/30 text-accent-warning text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Enterprise Gold
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-text-primary">Response Commitments</h4>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/10 text-text-muted h-6 text-left">
                    <th className="font-medium pb-1">Priority</th>
                    <th className="font-medium pb-1">Response Time Target</th>
                    <th className="font-medium pb-1 text-right">Resolution Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  <tr className="h-8">
                    <td className="text-accent-danger font-bold">Urgent (P0)</td>
                    <td className="text-text-primary">30 Minutes</td>
                    <td className="text-right text-text-primary">4 Hours</td>
                  </tr>
                  <tr className="h-8">
                    <td className="text-accent-warning font-bold">High (P1)</td>
                    <td className="text-text-primary">2 Hours</td>
                    <td className="text-right text-text-primary">12 Hours</td>
                  </tr>
                  <tr className="h-8">
                    <td className="text-accent-primary font-bold">Medium (P2)</td>
                    <td className="text-text-primary">8 Hours</td>
                    <td className="text-right text-text-primary">48 Hours</td>
                  </tr>
                  <tr className="h-8">
                    <td className="text-text-muted font-bold">Low (P3)</td>
                    <td className="text-text-primary">24 Hours</td>
                    <td className="text-right text-text-primary">7 Business Days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {subTab === 'escalations' && (
        /* Escalation History sub-tab */
        <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
            Engineering Escalation Logs
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 text-text-muted h-8">
                  <th className="font-semibold pb-2">Date</th>
                  <th className="font-semibold pb-2">Ticket ID</th>
                  <th className="font-semibold pb-2">Escalated To</th>
                  <th className="font-semibold pb-2">Reason</th>
                  <th className="font-semibold pb-2 text-right">Resolution Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                <tr className="h-10 hover:bg-bg-base/30 transition-colors">
                  <td className="font-mono text-text-secondary">Jun 18, 2026</td>
                  <td className="font-bold text-accent-primary">#TCK-9481</td>
                  <td className="font-semibold text-text-primary">API & Backend Lead</td>
                  <td>504 production gateway spike CPU spike</td>
                  <td className="text-right font-semibold text-accent-warning">Ongoing</td>
                </tr>
                <tr className="h-10 hover:bg-bg-base/30 transition-colors">
                  <td className="font-mono text-text-secondary">May 10, 2026</td>
                  <td className="font-bold text-text-muted">#TCK-1049</td>
                  <td className="font-semibold text-text-primary">Mobile Dev Team</td>
                  <td>App store deployment sandbox rejection</td>
                  <td className="text-right font-mono font-bold text-accent-success">1h 15m</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Flag Modal */}
      {showAddFlagModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <form onSubmit={handleAddFlag} className="bg-bg-surface border border-border rounded-xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-heading font-bold text-text-primary text-base">Add Warning Flag</h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-text-muted uppercase">Flag Type</label>
                <select
                  value={flagType}
                  onChange={(e) => setFlagType(e.target.value)}
                  className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-secondary px-3 py-2 focus:outline-none focus:border-accent-primary"
                >
                  <option>Scope Creep</option>
                  <option>Payment Overdue</option>
                  <option>Direct Contact Breach</option>
                  <option>Critical SLA Warning</option>
                  <option>Other Warning</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-text-muted uppercase">Severity Level</label>
                <div className="flex gap-2">
                  {(['High', 'Medium', 'Low'] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setFlagSeverity(sev)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border ${
                        flagSeverity === sev
                          ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                          : 'border-border bg-bg-elevated text-text-muted'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowAddFlagModal(false)}
                className="flex-1 h-9 bg-transparent hover:bg-bg-elevated border border-border text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-9 bg-accent-primary hover:bg-accent-primary/80 text-text-primary text-xs font-semibold rounded-lg"
              >
                Apply Warning Flag
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateTicketModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <form onSubmit={handleCreateTicketSubmit} className="bg-bg-surface border border-border rounded-xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-heading font-bold text-text-primary text-base">Create New Technical Case</h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-text-muted uppercase">Subject / Contact Reason</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Docker container crash on backend-02"
                  className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-2 focus:outline-none focus:border-accent-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-text-muted uppercase">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-secondary px-3 py-2 focus:outline-none focus:border-accent-primary"
                  >
                    <option>Urgent</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-text-muted uppercase">Linked Project</label>
                  <select className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-secondary px-3 py-2 focus:outline-none focus:border-accent-primary">
                    <option>PayTech Portal</option>
                    <option>EtherDeFi Smart Contract</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-text-muted uppercase">Details / Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Include steps to reproduce or stack trace details..."
                  className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-2 h-24 focus:outline-none focus:border-accent-primary resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateTicketModal(false)}
                className="flex-1 h-9 bg-transparent hover:bg-bg-elevated border border-border text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-9 bg-accent-primary hover:bg-accent-primary/80 text-text-primary text-xs font-semibold rounded-lg"
              >
                Create Issue
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default SupportTab;
