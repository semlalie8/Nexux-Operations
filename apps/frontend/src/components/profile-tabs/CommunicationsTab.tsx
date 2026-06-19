import React, { useState } from 'react';
import { ClientProfile } from '../../store/nexusStore';
import { 
  Mail, Shield, UserX, 
  RotateCw, Plus, Video 
} from 'lucide-react';

interface CommunicationsTabProps {
  client: ClientProfile;
}

export const CommunicationsTab: React.FC<CommunicationsTabProps> = ({ client }) => {
  const [subTab, setSubTab] = useState<'emails' | 'projects' | 'meetings' | 'prefs' | 'troubleshoot'>('emails');
  
  // Meeting notes local state
  const [meetings, setMeetings] = useState([
    { date: 'Jun 15, 2026', type: 'Video', attendees: 'Marie Dubois, Sarah Connor, Hiroshi Tanaka', duration: '45 mins', notes: 'Discussed Nginx timeout issues and Q3 scaling proposal.', recording: '#' },
    { date: 'May 02, 2026', type: 'Phone', attendees: 'Sophie Martin, Sophie Martin', duration: '20 mins', notes: 'Invoice audit and VAT verification details confirmation.', recording: '' }
  ]);

  // Meeting form states
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [meetAttendees, setMeetAttendees] = useState('');
  const [meetDuration, setMeetDuration] = useState('30 mins');
  const [meetNotes, setMeetNotes] = useState('');

  // Troubleshooting action handlers
  const runDiagnostic = (action: string) => {
    alert(`Diagnostics Triggered: [${action}] for ${client.email}. Process completed. Sync code: 200 OK.`);
  };

  const handleAddMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetAttendees.trim()) return;

    setMeetings([
      {
        date: 'Just now',
        type: 'Video',
        attendees: meetAttendees,
        duration: meetDuration,
        notes: meetNotes || 'No notes added.',
        recording: '#'
      },
      ...meetings
    ]);
    setMeetAttendees('');
    setMeetNotes('');
    setShowAddMeeting(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-4 border-b border-border/30 pb-3">
        {(['emails', 'projects', 'meetings', 'prefs', 'troubleshoot'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`text-xs font-semibold px-1 py-0.5 relative transition-all capitalize ${
              subTab === tab ? 'text-accent-primary' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab === 'prefs' ? 'Contact Preferences' : tab === 'projects' ? 'Project Threads' : tab === 'troubleshoot' ? 'Troubleshoot' : tab}
            {subTab === tab && (
              <div className="absolute left-0 right-0 bottom-[-13px] h-0.5 bg-accent-primary" />
            )}
          </button>
        ))}
      </div>

      {subTab === 'emails' && (
        /* Emails sub-tab */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <div className="flex gap-2">
              <select className="bg-bg-elevated border border-border rounded text-[11px] text-text-secondary px-2 py-1">
                <option>June 2026</option>
                <option>May 2026</option>
                <option>All months</option>
              </select>
              <select className="bg-bg-elevated border border-border rounded text-[11px] text-text-secondary px-2 py-1">
                <option>10 per page</option>
                <option>25 per page</option>
              </select>
            </div>
          </div>

          <div className="bg-bg-surface/50 border border-border rounded-xl p-8 text-center space-y-2">
            <span className="text-xl">🔵</span>
            <p className="text-xs font-semibold text-text-secondary">Nothing to see here!</p>
            <p className="text-[10px] text-text-muted">No external email interactions are logged for this client contact.</p>
          </div>
        </div>
      )}

      {subTab === 'projects' && (
        /* Project threads sub-tab */
        <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
            Project Threads & Chat Logs
          </h3>

          <div className="divide-y divide-border/20">
            <div className="py-3 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-9 rounded bg-bg-elevated border border-border flex items-center justify-center font-heading text-xs text-accent-primary font-bold">
                  PT
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary hover:text-accent-primary cursor-pointer transition-colors">
                    #portal-frontend-build
                  </h4>
                  <p className="text-[10px] text-text-muted">Marie Dubois, Hiroshi Tanaka · Last message: "Draft wireframes approved."</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-text-muted">Jun 14, 2026</span>
            </div>
            
            <div className="py-3 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-9 rounded bg-bg-elevated border border-border flex items-center justify-center font-heading text-xs text-accent-primary font-bold">
                  DF
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary hover:text-accent-primary cursor-pointer transition-colors">
                    #solidity-contracts-review
                  </h4>
                  <p className="text-[10px] text-text-muted">Liam O'Connor, Alex Rivera · Last message: "Gas audit complete."</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-text-muted">May 28, 2026</span>
            </div>
          </div>
        </div>
      )}

      {subTab === 'meetings' && (
        /* Meeting notes sub-tab */
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
              Call & Meeting Logs
            </h3>
            
            <button
              onClick={() => setShowAddMeeting(true)}
              className="px-2.5 py-1 bg-accent-primary hover:bg-accent-primary/80 text-text-primary font-semibold text-xs rounded-lg flex items-center gap-1 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add Meeting Note
            </button>
          </div>

          <div className="bg-bg-surface/50 border border-border rounded-xl p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/40 text-text-muted h-8">
                    <th className="font-semibold pb-2">Date</th>
                    <th className="font-semibold pb-2">Type</th>
                    <th className="font-semibold pb-2">Attendees</th>
                    <th className="font-semibold pb-2">Duration</th>
                    <th className="font-semibold pb-2">Notes Summary</th>
                    <th className="font-semibold pb-2 text-right">Recording Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {meetings.map((meet, i) => (
                    <tr key={i} className="h-12 hover:bg-bg-base/30 transition-colors">
                      <td className="font-mono text-text-secondary">{meet.date}</td>
                      <td>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          meet.type === 'Video' ? 'bg-indigo-950 text-indigo-300 border-indigo-800/40' : 'bg-amber-950 text-amber-300 border-amber-800/40'
                        }`}>
                          {meet.type}
                        </span>
                      </td>
                      <td className="text-text-primary font-medium">{meet.attendees}</td>
                      <td className="font-mono">{meet.duration}</td>
                      <td className="max-w-[200px] truncate text-text-secondary">{meet.notes}</td>
                      <td className="text-right">
                        {meet.recording ? (
                          <button
                            onClick={() => alert('Launching MP4 recording player dialog...')}
                            className="text-accent-primary hover:underline font-semibold flex items-center justify-end gap-1 w-full"
                          >
                            <Video className="w-3.5 h-3.5" /> Watch call
                          </button>
                        ) : (
                          <span className="text-[10px] text-text-muted font-mono">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {subTab === 'prefs' && (
        /* Contact Preferences sub-tab */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
              Contact Preferences
            </h3>

            <table className="w-full text-xs">
              <tbody className="divide-y divide-border/20">
                <tr className="h-10">
                  <td className="text-text-muted font-medium">Primary Contact Method</td>
                  <td className="text-right text-text-primary font-bold">Email</td>
                </tr>
                <tr className="h-10">
                  <td className="text-text-muted font-medium">Best Contact Time</td>
                  <td className="text-right text-text-primary">Afternoon (12:00 PM – 5:00 PM)</td>
                </tr>
                <tr className="h-10">
                  <td className="text-text-muted font-medium">Timezone Reference</td>
                  <td className="text-right text-text-primary font-mono">{client.timezone}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
              Emergency Contact
            </h3>

            <table className="w-full text-xs">
              <tbody className="divide-y divide-border/20">
                <tr className="h-10">
                  <td className="text-text-muted font-medium">Contact Name</td>
                  <td className="text-right text-text-primary font-bold">Sophie Martin (Billing Contact)</td>
                </tr>
                <tr className="h-10">
                  <td className="text-text-muted font-medium">Emergency Phone</td>
                  <td className="text-right text-accent-primary underline">{client.phone}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'troubleshoot' && (
        /* Troubleshoot sub-tab */
        <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
            Quick Diagnostic Actions
          </h3>
          <p className="text-[10px] text-text-muted">Run client account management utilities from this terminal panel.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => runDiagnostic('Resend invite')}
              className="h-11 bg-bg-elevated border border-border hover:border-accent-primary/40 text-text-secondary hover:text-text-primary text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Mail className="w-4 h-4" /> Resend invite
            </button>
            
            <button
              onClick={() => runDiagnostic('Reset 2FA')}
              className="h-11 bg-bg-elevated border border-border hover:border-accent-primary/40 text-text-secondary hover:text-text-primary text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Shield className="w-4 h-4" /> Reset 2FA
            </button>
            
            <button
              onClick={() => runDiagnostic('Clear sessions')}
              className="h-11 bg-bg-elevated border border-border hover:border-accent-primary/40 text-text-secondary hover:text-text-primary text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <UserX className="w-4 h-4" /> Clear sessions
            </button>
            
            <button
              onClick={() => runDiagnostic('Sync database')}
              className="h-11 bg-bg-elevated border border-border hover:border-accent-primary/40 text-text-secondary hover:text-text-primary text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <RotateCw className="w-4 h-4" /> Sync database
            </button>
          </div>
        </div>
      )}

      {/* Add Meeting Note Modal */}
      {showAddMeeting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <form onSubmit={handleAddMeetingSubmit} className="bg-bg-surface border border-border rounded-xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-heading font-bold text-text-primary text-base">Add Meeting Note</h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-text-muted uppercase">Attendees</label>
                <input
                  type="text"
                  required
                  value={meetAttendees}
                  onChange={(e) => setMeetAttendees(e.target.value)}
                  placeholder="e.g. Marie Dubois, Sarah Connor"
                  className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-2 focus:outline-none focus:border-accent-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-text-muted uppercase">Call Duration</label>
                <select
                  value={meetDuration}
                  onChange={(e) => setMeetDuration(e.target.value)}
                  className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-secondary px-3 py-2 focus:outline-none focus:border-accent-primary"
                >
                  <option>15 mins</option>
                  <option>30 mins</option>
                  <option>45 mins</option>
                  <option>60 mins</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-text-muted uppercase">Notes Summary</label>
                <textarea
                  value={meetNotes}
                  onChange={(e) => setMeetNotes(e.target.value)}
                  placeholder="Provide a brief summary of what was discussed..."
                  className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-2 h-20 focus:outline-none focus:border-accent-primary resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowAddMeeting(false)}
                className="flex-1 h-9 bg-transparent hover:bg-bg-elevated border border-border text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-9 bg-accent-primary hover:bg-accent-primary/80 text-text-primary text-xs font-semibold rounded-lg"
              >
                Save Notes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default CommunicationsTab;
