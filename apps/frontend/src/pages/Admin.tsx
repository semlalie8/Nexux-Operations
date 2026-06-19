import React, { useState } from 'react';
import { useNexusStore } from '../store/nexusStore';
import {
  Shield, Users, Key, Clock, Search, Plus, Edit2, Check, X,
  Activity, Lock, AlertTriangle, UserCheck
} from 'lucide-react';

type AdminTab = 'team' | 'roles' | 'audit';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  team: string;
  status: 'online' | 'away' | 'dnd' | 'offline';
  email: string;
  joined: string;
  lastActive: string;
  ticketsResolved: number;
  twoFactor: boolean;
}

interface AuditEntry {
  id: string;
  time: string;
  actor: string;
  actorRole: string;
  action: string;
  target: string;
  severity: 'info' | 'warn' | 'critical';
  ip: string;
}

const INITIAL_TEAM: TeamMember[] = [
  { id: 'usr_1', name: 'Sarah Connor', avatar: '5.png', role: 'Senior Agent', team: 'Escalation Tier 2', status: 'online', email: 'sarah@nexus.io', joined: 'Jan 14, 2022', lastActive: '2 mins ago', ticketsResolved: 412, twoFactor: true },
  { id: 'usr_2', name: 'Hiroshi Tanaka', avatar: '3.png', role: 'Technical Lead', team: 'API Engineering', status: 'online', email: 'hiroshi@nexus.io', joined: 'Mar 08, 2021', lastActive: '5 mins ago', ticketsResolved: 287, twoFactor: true },
  { id: 'usr_3', name: 'Alex Rivera', avatar: '6.png', role: 'Agent', team: 'Blockchain & Web3 Dev', status: 'away', email: 'alex@nexus.io', joined: 'Nov 21, 2023', lastActive: '1 hour ago', ticketsResolved: 195, twoFactor: false },
  { id: 'usr_4', name: 'Sophie Martin', avatar: '4.png', role: 'Finance Officer', team: 'Finance Department', status: 'online', email: 'sophie@nexus.io', joined: 'Jun 05, 2022', lastActive: '30 mins ago', ticketsResolved: 0, twoFactor: true },
  { id: 'usr_5', name: 'Emma Watson', avatar: '7.png', role: 'Project Manager', team: 'PMO Group', status: 'dnd', email: 'emma@nexus.io', joined: 'Aug 12, 2022', lastActive: '15 mins ago', ticketsResolved: 88, twoFactor: true },
  { id: 'usr_6', name: 'Marcus Aurelius', avatar: '8.png', role: 'Administrator', team: 'IT Ops', status: 'online', email: 'marcus@nexus.io', joined: 'Jan 01, 2021', lastActive: 'Just now', ticketsResolved: 156, twoFactor: true },
  { id: 'usr_7', name: 'Luke Skywalker', avatar: '9.png', role: 'Trainee', team: 'Training Cohort', status: 'offline', email: 'luke@nexus.io', joined: 'May 20, 2026', lastActive: '3 days ago', ticketsResolved: 12, twoFactor: false }
];

const AUDIT_LOG: AuditEntry[] = [
  { id: 'al_1', time: 'Today 14:42', actor: 'Marcus Aurelius', actorRole: 'Administrator', action: 'Role changed', target: 'Luke Skywalker → Trainee to Agent', severity: 'warn', ip: '192.168.1.10' },
  { id: 'al_2', time: 'Today 13:15', actor: 'Sarah Connor', actorRole: 'Senior Agent', action: 'Ticket resolved', target: 'TCK-9481 — PayTech SAS', severity: 'info', ip: '192.168.1.14' },
  { id: 'al_3', time: 'Today 11:58', actor: 'Sophie Martin', actorRole: 'Finance Officer', action: 'Invoice exported', target: 'INV-2026-003 — €35,000', severity: 'info', ip: '192.168.1.20' },
  { id: 'al_4', time: 'Today 10:30', actor: 'System', actorRole: 'SYSTEM', action: 'SLA breach detected', target: 'TCK-9481 — 1h threshold exceeded', severity: 'critical', ip: '0.0.0.0' },
  { id: 'al_5', time: 'Today 09:14', actor: 'Marcus Aurelius', actorRole: 'Administrator', action: 'User account suspended', target: 'Client portal: client@oldcorp.com', severity: 'warn', ip: '192.168.1.10' },
  { id: 'al_6', time: 'Yesterday 17:22', actor: 'Hiroshi Tanaka', actorRole: 'Technical Lead', action: 'Knowledge article created', target: 'Handling production deployment failures', severity: 'info', ip: '192.168.1.5' },
  { id: 'al_7', time: 'Yesterday 15:05', actor: 'Alex Rivera', actorRole: 'Agent', action: 'Failed login attempt', target: 'Email: alex@nexus.io — 3rd attempt', severity: 'critical', ip: '203.0.113.42' },
  { id: 'al_8', time: 'Yesterday 12:40', actor: 'Emma Watson', actorRole: 'Project Manager', action: 'Contract value revealed', target: 'PRJ-101 PayTech Portal — €120,000', severity: 'warn', ip: '192.168.1.30' },
  { id: 'al_9', time: '2 days ago', actor: 'Sophie Martin', actorRole: 'Finance Officer', action: 'Invoice marked overdue', target: 'INV-2026-002 DeFi Labs — $40,000', severity: 'warn', ip: '192.168.1.20' },
  { id: 'al_10', time: '3 days ago', actor: 'System', actorRole: 'SYSTEM', action: 'Scheduled maintenance completed', target: 'Database backup v2026.06.15 — 2.4 GB', severity: 'info', ip: '0.0.0.0' }
];

const ALL_ROLES = ['Agent', 'Senior Agent', 'Project Manager', 'Technical Lead', 'Finance Officer', 'Administrator', 'Trainee'];

const ROLE_PERMISSIONS: Record<string, { label: string; perms: string[] }> = {
  'Agent': {
    label: 'Support Agent',
    perms: ['View tickets', 'Reply to tickets', 'Add case notes', 'View KB articles (public)']
  },
  'Senior Agent': {
    label: 'Senior Support Agent',
    perms: ['All Agent permissions', 'Resolve tickets', 'Access restricted KB articles', 'View client profile', 'Add internal notes', 'Submit bug reports']
  },
  'Project Manager': {
    label: 'Project Manager',
    perms: ['All Senior Agent permissions', 'View & edit projects', 'View reports', 'Manage milestones', 'Approve deployments']
  },
  'Technical Lead': {
    label: 'Technical Lead',
    perms: ['All Project Manager permissions', 'Manage repositories', 'Trigger deployments', 'Create/edit KB articles', 'View SLA details']
  },
  'Finance Officer': {
    label: 'Finance Officer',
    perms: ['View invoices', 'Export financial reports', 'View contract values', 'Manage billing preferences', 'Issue credit notes']
  },
  'Administrator': {
    label: 'System Administrator',
    perms: ['All permissions', 'Manage team members', 'Assign roles', 'View audit log', 'System settings', 'Suspend accounts', 'Access sensitive data']
  },
  'Trainee': {
    label: 'Trainee',
    perms: ['View open tickets (read-only)', 'View public KB articles', 'Limited dashboard access']
  }
};

const STATUS_COLORS: Record<string, string> = {
  online: 'bg-accent-success',
  away: 'bg-accent-warning',
  dnd: 'bg-accent-danger',
  offline: 'bg-text-muted/40'
};

const SEVERITY_STYLES: Record<string, string> = {
  info: 'text-text-muted bg-bg-elevated/60 border-border/40',
  warn: 'text-accent-warning bg-accent-warning/10 border-accent-warning/30',
  critical: 'text-accent-danger bg-accent-danger/10 border-accent-danger/30'
};

export const Admin: React.FC = () => {
  const { user } = useNexusStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('team');
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editRole, setEditRole] = useState('');
  const [auditFilter, setAuditFilter] = useState<'all' | 'info' | 'warn' | 'critical'>('all');

  const isAdmin = user.role === 'Administrator';

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-4">
        <Shield className="w-12 h-12 text-accent-danger animate-pulse" />
        <h2 className="font-heading font-extrabold text-text-primary text-lg">Administrator Access Required</h2>
        <p className="text-xs text-text-muted max-w-sm">
          Admin tools require Administrator credentials. Your current role is <strong>{user.role}</strong>.
          Switch roles via the Profile page to access this section.
        </p>
      </div>
    );
  }

  const filteredTeam = team.filter(m =>
    !searchQuery ||
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAudit = AUDIT_LOG.filter(e => auditFilter === 'all' || e.severity === auditFilter);

  const handleRoleUpdate = () => {
    if (!editingMember || !editRole) return;
    setTeam(prev => prev.map(m => m.id === editingMember.id ? { ...m, role: editRole } : m));
    setEditingMember(null);
    setEditRole('');
  };

  const tabs = [
    { id: 'team', label: 'Team Management', icon: <Users className="w-4 h-4" /> },
    { id: 'roles', label: 'Role & Permissions', icon: <Key className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit Log', icon: <Clock className="w-4 h-4" /> }
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight text-text-primary flex items-center gap-2">
            <Shield className="w-7 h-7 text-accent-primary" />
            Admin Tools
          </h1>
          <p className="text-text-secondary text-sm mt-1">Team management, role assignment, and security audit trail.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-accent-danger/10 border border-accent-danger/30 text-accent-danger px-3 py-1.5 rounded-lg">
          <Lock className="w-3.5 h-3.5" /> Administrator Session
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Team Members', value: team.length, icon: <Users className="w-4 h-4" />, color: 'text-accent-primary' },
          { label: 'Online Now', value: team.filter(m => m.status === 'online').length, icon: <Activity className="w-4 h-4" />, color: 'text-accent-success' },
          { label: '2FA Enabled', value: team.filter(m => m.twoFactor).length, icon: <UserCheck className="w-4 h-4" />, color: 'text-accent-warning' },
          { label: 'Audit Events', value: AUDIT_LOG.length, icon: <Clock className="w-4 h-4" />, color: 'text-text-secondary' }
        ].map(s => (
          <div key={s.label} className="bg-bg-surface border border-border rounded-xl p-4 flex items-center gap-3">
            <div className={`${s.color} bg-bg-elevated p-2 rounded-lg`}>{s.icon}</div>
            <div>
              <div className="text-xl font-bold font-mono text-text-primary">{s.value}</div>
              <div className="text-[10px] text-text-muted font-mono">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
        <div className="flex border-b border-border/50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold relative transition-all ${
                activeTab === tab.id
                  ? 'text-accent-primary bg-accent-primary/5'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated/30'
              }`}
            >
              {tab.icon}{tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">

          {/* ── TEAM MANAGEMENT ── */}
          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search team members…"
                    className="w-full bg-bg-elevated/60 border border-border/60 rounded-lg text-xs text-text-primary pl-8 pr-3 py-2 focus:outline-none focus:border-accent-primary transition-colors"
                  />
                </div>
                <button className="flex items-center gap-1.5 px-3 py-2 bg-accent-primary hover:bg-accent-primary/85 text-white text-xs font-semibold rounded-lg transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Invite Member
                </button>
              </div>

              <div className="border border-border/40 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-bg-elevated/40 text-text-muted h-9 border-b border-border/40">
                      <th className="font-semibold pl-4 pr-3">Member</th>
                      <th className="font-semibold pr-3">Role</th>
                      <th className="font-semibold pr-3">Team</th>
                      <th className="font-semibold pr-3">Status</th>
                      <th className="font-semibold pr-3">2FA</th>
                      <th className="font-semibold pr-3">Last Active</th>
                      <th className="font-semibold text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {filteredTeam.map(member => (
                      <tr key={member.id} className="h-14 hover:bg-bg-elevated/20 transition-colors">
                        <td className="pl-4 pr-3">
                          <div className="flex items-center gap-2.5">
                            <div className="relative">
                              <img src={`/${member.avatar}`} alt={member.name} className="w-7 h-7 rounded-full object-cover" />
                              <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-bg-surface ${STATUS_COLORS[member.status]}`} />
                            </div>
                            <div>
                              <div className="font-bold text-text-primary">{member.name}</div>
                              <div className="text-[9px] text-text-muted font-mono">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="pr-3">
                          <span className="font-mono text-[10px] bg-bg-elevated px-2 py-0.5 rounded border border-border/50 text-text-secondary">
                            {member.role}
                          </span>
                        </td>
                        <td className="pr-3 text-text-secondary">{member.team}</td>
                        <td className="pr-3">
                          <span className={`flex items-center gap-1 text-[10px] font-semibold capitalize ${
                            member.status === 'online' ? 'text-accent-success' :
                            member.status === 'away' ? 'text-accent-warning' :
                            member.status === 'dnd' ? 'text-accent-danger' : 'text-text-muted'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[member.status]}`} />
                            {member.status}
                          </span>
                        </td>
                        <td className="pr-3">
                          {member.twoFactor
                            ? <span className="flex items-center gap-1 text-accent-success text-[10px] font-semibold"><Check className="w-3 h-3" />Enabled</span>
                            : <span className="flex items-center gap-1 text-accent-danger text-[10px] font-semibold"><X className="w-3 h-3" />Disabled</span>
                          }
                        </td>
                        <td className="pr-3 text-text-secondary font-mono text-[10px]">{member.lastActive}</td>
                        <td className="text-right pr-4">
                          <div className="flex items-center gap-1.5 justify-end">
                            <button
                              onClick={() => { setEditingMember(member); setEditRole(member.role); }}
                              className="p-1.5 rounded hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors"
                              title="Change role"
                            >
                              <Key className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 rounded hover:bg-bg-elevated text-text-muted hover:text-text-primary transition-colors" title="Edit member">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 rounded hover:bg-accent-danger/10 text-text-muted hover:text-accent-danger transition-colors" title="Suspend account">
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ROLES & PERMISSIONS ── */}
          {activeTab === 'roles' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ALL_ROLES.map(role => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(selectedRole === role ? null : role)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedRole === role
                        ? 'border-accent-primary/50 bg-accent-primary/10'
                        : 'border-border/50 bg-bg-elevated/30 hover:border-border'
                    }`}
                  >
                    <div className={`text-xs font-bold ${selectedRole === role ? 'text-accent-primary' : 'text-text-primary'}`}>{role}</div>
                    <div className="text-[9px] text-text-muted mt-0.5 font-mono">{ROLE_PERMISSIONS[role]?.perms.length} permissions</div>
                  </button>
                ))}
              </div>

              {selectedRole && ROLE_PERMISSIONS[selectedRole] && (
                <div className="bg-bg-elevated/30 border border-border/40 rounded-xl p-5 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">{selectedRole}</h3>
                      <p className="text-[10px] text-text-muted font-mono">{ROLE_PERMISSIONS[selectedRole].label}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-text-muted">
                      {team.filter(m => m.role === selectedRole).length} member(s) assigned
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {ROLE_PERMISSIONS[selectedRole].perms.map((perm, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-4 rounded-full bg-accent-success/15 border border-accent-success/30 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 text-accent-success" />
                        </div>
                        <span className="text-text-secondary">{perm}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-border/30">
                    <h4 className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2">Members with this role</h4>
                    <div className="flex flex-wrap gap-2">
                      {team.filter(m => m.role === selectedRole).map(m => (
                        <div key={m.id} className="flex items-center gap-1.5 bg-bg-surface border border-border/50 rounded-full pl-1 pr-3 py-1">
                          <img src={`/${m.avatar}`} className="w-5 h-5 rounded-full object-cover" alt="" />
                          <span className="text-[10px] text-text-secondary font-medium">{m.name}</span>
                        </div>
                      ))}
                      {team.filter(m => m.role === selectedRole).length === 0 && (
                        <span className="text-[10px] text-text-muted">No members assigned</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── AUDIT LOG ── */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex border border-border rounded-lg overflow-hidden text-[10px] font-semibold">
                  {(['all', 'info', 'warn', 'critical'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setAuditFilter(f)}
                      className={`px-3 py-1.5 capitalize transition-colors ${
                        auditFilter === f
                          ? f === 'all' ? 'bg-accent-primary text-white' :
                            f === 'critical' ? 'bg-accent-danger text-white' :
                            f === 'warn' ? 'bg-accent-warning text-bg-base' : 'bg-bg-elevated text-text-primary'
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      {f === 'all' ? 'All Events' : f}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-text-muted font-mono ml-auto">
                  {filteredAudit.length} events shown
                </span>
              </div>

              <div className="border border-border/40 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-bg-elevated/40 text-text-muted h-9 border-b border-border/40">
                      <th className="font-semibold pl-4 pr-3 w-28">Time</th>
                      <th className="font-semibold pr-3">Severity</th>
                      <th className="font-semibold pr-3">Actor</th>
                      <th className="font-semibold pr-3">Action</th>
                      <th className="font-semibold pr-3">Target / Detail</th>
                      <th className="font-semibold text-right pr-4">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {filteredAudit.map(entry => (
                      <tr key={entry.id} className="hover:bg-bg-elevated/20 transition-colors">
                        <td className="pl-4 pr-3 py-3 font-mono text-[10px] text-text-muted whitespace-nowrap">{entry.time}</td>
                        <td className="pr-3 py-3">
                          <span className={`text-[9px] font-bold uppercase border px-1.5 py-0.5 rounded font-mono ${SEVERITY_STYLES[entry.severity]}`}>
                            {entry.severity}
                          </span>
                        </td>
                        <td className="pr-3 py-3">
                          <div className="font-semibold text-text-primary">{entry.actor}</div>
                          <div className="text-[9px] text-text-muted font-mono">{entry.actorRole}</div>
                        </td>
                        <td className="pr-3 py-3 font-medium text-text-secondary">{entry.action}</td>
                        <td className="pr-3 py-3 text-text-muted max-w-xs truncate">{entry.target}</td>
                        <td className="text-right pr-4 py-3 font-mono text-[10px] text-text-muted">{entry.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role assignment modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-bg-surface border border-border rounded-2xl p-6 w-full max-w-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-text-primary flex items-center gap-2">
                <Key className="w-4 h-4 text-accent-primary" /> Assign Role
              </h3>
              <button onClick={() => setEditingMember(null)} className="text-text-muted hover:text-text-primary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2.5 bg-bg-elevated/40 border border-border/40 rounded-xl p-3">
              <img src={`/${editingMember.avatar}`} alt="" className="w-8 h-8 rounded-full object-cover" />
              <div>
                <div className="text-sm font-bold text-text-primary">{editingMember.name}</div>
                <div className="text-[10px] text-text-muted font-mono">{editingMember.team}</div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2 block">New Role</label>
              <div className="space-y-1">
                {ALL_ROLES.map(role => (
                  <button
                    key={role}
                    onClick={() => setEditRole(role)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs transition-all ${
                      editRole === role
                        ? 'border-accent-primary/50 bg-accent-primary/10 text-accent-primary'
                        : 'border-border/30 text-text-secondary hover:border-border hover:text-text-primary'
                    }`}
                  >
                    <span className="font-medium">{role}</span>
                    {editRole === role && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {editRole !== editingMember.role && (
              <div className="flex items-center gap-1.5 text-[10px] text-accent-warning bg-accent-warning/10 border border-accent-warning/30 rounded-lg px-3 py-2">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                Role change will be logged in the audit trail.
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button onClick={() => setEditingMember(null)} className="flex-1 px-3 py-2 border border-border rounded-lg text-xs text-text-secondary hover:text-text-primary transition-colors">
                Cancel
              </button>
              <button
                onClick={handleRoleUpdate}
                disabled={editRole === editingMember.role}
                className="flex-1 px-3 py-2 bg-accent-primary text-white rounded-lg text-xs font-semibold hover:bg-accent-primary/85 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Apply Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
