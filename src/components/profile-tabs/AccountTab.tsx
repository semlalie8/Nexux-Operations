import React, { useState } from 'react';
import { ClientProfile } from '../../store/nexusStore';
import { Plus, ShieldCheck, History } from 'lucide-react';

interface AccountTabProps {
  client: ClientProfile;
  isRevealed: boolean;
}

export const AccountTab: React.FC<AccountTabProps> = ({ client, isRevealed }) => {
  const [subTab, setSubTab] = useState<'business' | 'permissions'>('business');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [portalUsers, setPortalUsers] = useState(client.portalUsers);

  // New user state form
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Admin' | 'Member' | 'Billing only' | 'Read-only' | 'Deactivated'>('Member');
  const [newUserPerm, setNewUserPerm] = useState('Read/Write');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    const newUser = {
      name: newUserName,
      role: newUserRole,
      lastLogin: 'Never',
      twoFactor: false,
      permissionLevel: newUserPerm
    };

    setPortalUsers([...portalUsers, newUser]);
    setNewUserName('');
    setShowAddUserModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs selector */}
      <div className="flex gap-4 border-b border-border/30 pb-3">
        <button
          onClick={() => setSubTab('business')}
          className={`text-xs font-semibold px-1 py-0.5 relative transition-all ${
            subTab === 'business' ? 'text-accent-primary' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          Business Structure
          {subTab === 'business' && (
            <div className="absolute left-0 right-0 bottom-[-13px] h-0.5 bg-accent-primary" />
          )}
        </button>
        <button
          onClick={() => setSubTab('permissions')}
          className={`text-xs font-semibold px-1 py-0.5 relative transition-all ${
            subTab === 'permissions' ? 'text-accent-primary' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          Access Permissions
          {subTab === 'permissions' && (
            <div className="absolute left-0 right-0 bottom-[-13px] h-0.5 bg-accent-primary" />
          )}
        </button>
      </div>

      {subTab === 'business' ? (
        /* Business Structure */
        <div className="space-y-6">
          <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
              Structure Details
            </h3>

            <table className="w-full text-xs">
              <tbody className="divide-y divide-border/20">
                <tr className="h-9">
                  <td className="text-text-muted font-medium">Primary Authorized User</td>
                  <td className="text-right text-text-primary font-bold">{client.name}</td>
                </tr>
                <tr className="h-9">
                  <td className="text-text-muted font-medium">IDV Status</td>
                  <td className="text-right text-accent-success font-semibold flex items-center justify-end gap-1 h-9">
                    <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
                  </td>
                </tr>
                <tr className="h-9">
                  <td className="text-text-muted font-medium">Entity Type</td>
                  <td className="text-right text-text-primary font-mono font-medium">SAS / Corporation</td>
                </tr>
                <tr className="h-9">
                  <td className="text-text-muted font-medium">Payment Entity</td>
                  <td className="text-right text-text-primary font-medium">{client.billingPrefs.currency} · Stripe / Bank transfer</td>
                </tr>
                <tr className="h-9">
                  <td className="text-text-muted font-medium">KYB Status</td>
                  <td className="text-right h-9 flex items-center justify-end">
                    <button 
                      onClick={() => setShowHistoryModal(true)}
                      className="text-accent-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      <History className="w-3.5 h-3.5" /> View Status History
                    </button>
                  </td>
                </tr>
                <tr className="h-9">
                  <td className="text-text-muted font-medium">Number of Active Projects</td>
                  <td className="text-right text-text-primary font-bold">{client.childAccounts.length + 2}</td>
                </tr>
                <tr className="h-9">
                  <td className="text-text-muted font-medium">Number of Seats / Portal Users</td>
                  <td className="text-right text-text-primary font-bold">{portalUsers.length}</td>
                </tr>
                <tr className="h-9">
                  <td className="text-text-muted font-medium">Approximate Contract Value</td>
                  <td className="text-right text-text-primary font-bold font-mono">
                    {isRevealed ? '€220,000.00 / Annually' : '•••••••• (masked)'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Child Accounts */}
          {client.childAccounts.length > 0 && (
            <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
              <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
                Subsidiary & Child Accounts
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/40 text-text-muted h-8">
                      <th className="font-semibold pb-2">Name</th>
                      <th className="font-semibold pb-2">KYB Status</th>
                      <th className="font-semibold pb-2">Entity Type</th>
                      <th className="font-semibold pb-2 text-center">Seats</th>
                      <th className="font-semibold pb-2 text-center">Projects</th>
                      <th className="font-semibold pb-2 text-right">Earnings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {client.childAccounts.map((child, i) => (
                      <tr key={i} className="h-10 hover:bg-bg-base/30 transition-colors">
                        <td className="font-bold text-text-primary">{child.name}</td>
                        <td className="text-accent-success font-semibold">{child.status}</td>
                        <td className="font-mono text-text-secondary">{child.type}</td>
                        <td className="text-center">{child.seats}</td>
                        <td className="text-center">{child.projects}</td>
                        <td className="text-right font-mono text-text-primary">{child.earnings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Access Permissions */
        <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
              Portal Users
            </h3>
            
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-2.5 py-1 bg-accent-primary hover:bg-accent-primary/80 transition-colors text-text-primary font-semibold text-xs rounded-lg flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 text-text-muted h-8">
                  <th className="font-semibold pb-2">Name</th>
                  <th className="font-semibold pb-2">Role</th>
                  <th className="font-semibold pb-2">Last Login</th>
                  <th className="font-semibold pb-2 text-center">2FA Status</th>
                  <th className="font-semibold pb-2 text-right">Permissions Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {portalUsers.map((pUser, i) => (
                  <tr key={i} className="h-10 hover:bg-bg-base/30 transition-colors">
                    <td className="font-bold text-text-primary">{pUser.name}</td>
                    <td>
                      <span className="bg-bg-elevated px-2 py-0.5 rounded text-[10px] text-text-secondary border border-border font-medium">
                        {pUser.role}
                      </span>
                    </td>
                    <td className="text-text-secondary">{pUser.lastLogin}</td>
                    <td className="text-center">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                        pUser.twoFactor ? 'bg-accent-success/10 text-accent-success' : 'bg-accent-danger/10 text-accent-danger'
                      }`}>
                        {pUser.twoFactor ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="text-right font-mono text-text-muted font-semibold">{pUser.permissionLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-bg-surface border border-border rounded-xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-heading font-bold text-text-primary text-base">KYB Audit Trail</h3>
            <div className="space-y-3 font-mono text-[11px] text-text-secondary">
              <div className="border-l border-border pl-3 relative space-y-1">
                <div className="absolute left-[-4.5px] top-1 w-2 h-2 rounded-full bg-accent-success" />
                <span className="text-text-muted">Jun 14, 2025</span>
                <p className="text-text-primary font-bold">Annual Re-verification Passed</p>
                <p>Validated by Compliance Bot · Audit Hash: 8b02f</p>
              </div>
              <div className="border-l border-border pl-3 relative space-y-1">
                <div className="absolute left-[-4.5px] top-1 w-2 h-2 rounded-full bg-accent-success" />
                <span className="text-text-muted">Jan 16, 2021</span>
                <p className="text-text-primary font-bold">Initial KYC/KYB Completed</p>
                <p>Validated by agent Alex Rivera · Document validation ok.</p>
              </div>
            </div>
            <button
              onClick={() => setShowHistoryModal(false)}
              className="w-full mt-4 h-9 bg-bg-elevated hover:bg-bg-elevated/70 border border-border font-semibold text-xs rounded-lg"
            >
              Close History
            </button>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <form onSubmit={handleAddUser} className="bg-bg-surface border border-border rounded-xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-heading font-bold text-text-primary text-base">Add Portal User</h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-text-muted uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Jean Dupont"
                  className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-2 focus:outline-none focus:border-accent-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-text-muted uppercase">System Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-secondary px-3 py-2 focus:outline-none focus:border-accent-primary"
                  >
                    <option>Admin</option>
                    <option>Member</option>
                    <option>Billing only</option>
                    <option>Read-only</option>
                    <option>Deactivated</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-text-muted uppercase">Permissions</label>
                  <select
                    value={newUserPerm}
                    onChange={(e) => setNewUserPerm(e.target.value)}
                    className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-secondary px-3 py-2 focus:outline-none focus:border-accent-primary"
                  >
                    <option>Full Access</option>
                    <option>Read/Write</option>
                    <option>Billing</option>
                    <option>Read-only</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="flex-1 h-9 bg-transparent hover:bg-bg-elevated border border-border text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-9 bg-accent-primary hover:bg-accent-primary/80 text-text-primary text-xs font-semibold rounded-lg"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default AccountTab;
