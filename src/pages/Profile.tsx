import React from 'react';
import { useNexusStore, User } from '../store/nexusStore';
import { UserCheck, Key } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, login } = useNexusStore();

  const rolesList: Array<User['role']> = [
    'Agent',
    'Senior Agent',
    'Project Manager',
    'Technical Lead',
    'Finance Officer',
    'Administrator',
    'Trainee'
  ];

  const rolePermissions: Record<User['role'], string> = {
    'Agent': 'Own ticket queue, client overview (read), basic actions (reply, note, resolve).',
    'Senior Agent': 'All tickets, client profile edit, escalation rights, rebooking/credit issuance.',
    'Project Manager': 'Full project view, team assignment, milestone management, invoice view.',
    'Technical Lead': 'Code repos, deployments, technical ticket handling, architecture docs.',
    'Finance Officer': 'Billing tab full access, invoice create/edit/send, contract values visible.',
    'Administrator': 'Full platform access, team management, role assignment, system settings.',
    'Trainee': 'View everything, no write actions, read-only banner always shown.'
  };

  const handleRoleChange = (role: User['role']) => {
    login(role);
    alert(`Swapped active session to role: ${role}. Permissions refreshed.`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight text-text-primary flex items-center gap-2.5">
            <UserCheck className="w-7 h-7 text-accent-primary" />
            Agent Profile
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Manage your session roles, team assignments, and security levels.
          </p>
        </div>
      </div>

      {/* Profile Info Card */}
      <div className="bg-bg-surface border border-border rounded-xl p-6 flex flex-col sm:flex-row items-center gap-5">
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-20 h-20 rounded-full border border-border object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;
          }}
        />
        <div className="space-y-2 text-center sm:text-left flex-1">
          <h2 className="text-lg font-bold text-text-primary font-heading">{user.name}</h2>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <span className="bg-accent-primary/10 text-accent-primary border border-accent-primary/20 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full uppercase">
              {user.role}
            </span>
            <span className="bg-bg-elevated border border-border text-[10px] font-mono text-text-secondary px-2 py-0.5 rounded-full">
              {user.team}
            </span>
            <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-mono px-2 py-0.5 rounded-full capitalize">
              Session: {user.status}
            </span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            Role Description: {rolePermissions[user.role]}
          </p>
        </div>
      </div>

      {/* Role Picker / Sandbox Swapping */}
      <div className="bg-bg-surface border border-border rounded-xl p-6 space-y-4">
        <div className="space-y-1">
          <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
            Security Sandbox — Role Cycler
          </h3>
          <p className="text-[10px] text-text-muted">
            Toggle your session identity to test data masking, read-only guards, and tab visibility.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {rolesList.map((role) => (
            <button
              key={role}
              onClick={() => handleRoleChange(role)}
              className={`p-4 rounded-xl border flex flex-col gap-1 text-left transition-all ${
                user.role === role
                  ? 'border-accent-primary bg-accent-primary/5'
                  : 'border-border bg-bg-elevated/20 hover:border-border/80'
              }`}
            >
              <span className={`text-xs font-bold ${user.role === role ? 'text-accent-primary' : 'text-text-primary'}`}>
                {role}
              </span>
              <span className="text-[10px] text-text-muted leading-snug">
                {rolePermissions[role].substring(0, 75)}...
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Security notice */}
      <div className="bg-bg-surface/30 border border-border/60 rounded-xl p-4 flex items-start gap-2.5">
        <Key className="w-4.5 h-4.5 text-accent-primary flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <span className="font-bold text-text-secondary">Audit Trail Compliance</span>
          <p className="text-text-muted leading-normal">
            Every session elevation or credentials adjustment is logged inside the SOC 2 Type II audit logs. Any unauthorized changes in prod environments will trigger immediate access suspension.
          </p>
        </div>
      </div>
    </div>
  );
};
export default Profile;
