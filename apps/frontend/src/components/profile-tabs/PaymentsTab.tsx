import React, { useState } from 'react';
import { ClientProfile, useNexusStore, Invoice } from '../../store/nexusStore';
import { Plus, CreditCard, Download, Send, Edit, Eye, Wallet, Landmark } from 'lucide-react';

interface PaymentsTabProps {
  client: ClientProfile;
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({ client }) => {
  const { invoices, user } = useNexusStore();
  const [subTab, setSubTab] = useState<'invoices' | 'methods' | 'credits'>('invoices');
  
  // Custom invoices local state for adding
  const [clientInvoices, setClientInvoices] = useState<Invoice[]>(
    invoices.filter(inv => inv.clientCompany === client.company)
  );

  // Credit balance logs
  const [credits, setCredits] = useState([
    { date: 'Jun 10, 2026', reason: 'SLA Breach Credit (#TCK-1049)', amount: '€500.00', issuedBy: 'Sophie Martin', expiry: 'Dec 10, 2026' }
  ]);

  // Modal state
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [invAmount, setInvAmount] = useState('');
  const [invProject, setInvProject] = useState('PayTech Portal');
  const [invDueDate, setInvDueDate] = useState('');

  const [showIssueCreditModal, setShowIssueCreditModal] = useState(false);
  const [creditAmount, setCreditAmount] = useState('');
  const [creditReason, setCreditReason] = useState('');

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invAmount.trim()) return;

    const newInv: Invoice = {
      id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      projectId: 'PRJ-101',
      projectName: invProject,
      clientCompany: client.company,
      amount: `€${parseFloat(invAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      dueDate: invDueDate || '2026-07-30',
      status: 'Pending'
    };

    setClientInvoices([newInv, ...clientInvoices]);
    setInvAmount('');
    setInvDueDate('');
    setShowCreateInvoiceModal(false);
  };

  const handleIssueCredit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditAmount.trim()) return;

    const newCredit = {
      date: 'Just now',
      reason: creditReason || 'Manual adjustment',
      amount: `€${parseFloat(creditAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      issuedBy: user.name,
      expiry: '2026-12-31'
    };

    setCredits([newCredit, ...credits]);
    setCreditAmount('');
    setCreditReason('');
    setShowIssueCreditModal(false);
  };

  const invoiceStatusChips = {
    Paid: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Overdue: 'bg-red-500/10 text-red-500 border-red-500/20 font-bold',
    Draft: 'bg-gray-800 text-text-muted border-border'
  };

  const isFinanceOfficer = user.role === 'Finance Officer' || user.role === 'Administrator' || user.role === 'Senior Agent';

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-4 border-b border-border/30 pb-3">
        <button
          onClick={() => setSubTab('invoices')}
          className={`text-xs font-semibold px-1 py-0.5 relative transition-all ${
            subTab === 'invoices' ? 'text-accent-primary' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          Invoices
          {subTab === 'invoices' && (
            <div className="absolute left-0 right-0 bottom-[-13px] h-0.5 bg-accent-primary" />
          )}
        </button>
        <button
          onClick={() => setSubTab('methods')}
          className={`text-xs font-semibold px-1 py-0.5 relative transition-all ${
            subTab === 'methods' ? 'text-accent-primary' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          Payment Methods
          {subTab === 'methods' && (
            <div className="absolute left-0 right-0 bottom-[-13px] h-0.5 bg-accent-primary" />
          )}
        </button>
        <button
          onClick={() => setSubTab('credits')}
          className={`text-xs font-semibold px-1 py-0.5 relative transition-all ${
            subTab === 'credits' ? 'text-accent-primary' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          Service Credits
          {subTab === 'credits' && (
            <div className="absolute left-0 right-0 bottom-[-13px] h-0.5 bg-accent-primary" />
          )}
        </button>
      </div>

      {subTab === 'invoices' && (
        /* Invoices sub-tab */
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-xs font-mono text-text-muted uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
              Invoice History
            </div>
            
            {isFinanceOfficer && (
              <button
                onClick={() => setShowCreateInvoiceModal(true)}
                className="px-2.5 py-1 bg-accent-primary hover:bg-accent-primary/80 text-text-primary font-semibold text-xs rounded-lg flex items-center gap-1 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Create Invoice
              </button>
            )}
          </div>

          <div className="bg-bg-surface/50 border border-border rounded-xl p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/40 text-text-muted h-8">
                    <th className="font-semibold pb-2 pl-2">Invoice ID</th>
                    <th className="font-semibold pb-2">Project</th>
                    <th className="font-semibold pb-2">Amount</th>
                    <th className="font-semibold pb-2">Due Date</th>
                    <th className="font-semibold pb-2">Status</th>
                    <th className="font-semibold pb-2 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {clientInvoices.map((inv) => (
                    <tr key={inv.id} className="h-12 hover:bg-bg-base/30 transition-colors">
                      <td className="font-mono font-bold text-text-primary pl-2">{inv.id}</td>
                      <td className="font-medium text-text-secondary">{inv.projectName}</td>
                      <td className="font-mono font-bold text-text-primary">{inv.amount}</td>
                      <td className="font-mono text-text-secondary">{inv.dueDate}</td>
                      <td>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${invoiceStatusChips[inv.status]} ${
                          inv.status === 'Overdue' ? 'animate-pulse' : ''
                        }`}>
                          {inv.status === 'Overdue' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-danger mr-1" />}
                          {inv.status}
                        </span>
                      </td>
                      <td className="text-right pr-2">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => alert(`Previewing invoice ${inv.id}`)}
                            className="p-1 hover:bg-bg-elevated rounded text-text-secondary hover:text-text-primary transition-colors"
                            title="View invoice"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => alert(`Downloading PDF metadata for ${inv.id}...`)}
                            className="p-1 hover:bg-bg-elevated rounded text-text-secondary hover:text-text-primary transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          {isFinanceOfficer && (
                            <>
                              <button 
                                onClick={() => alert(`Sent overdue email trigger to billing contact.`)}
                                className="p-1 hover:bg-bg-elevated rounded text-text-secondary hover:text-accent-primary transition-colors"
                                title="Send reminder"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => alert(`Editing fields for invoice ${inv.id}`)}
                                className="p-1 hover:bg-bg-elevated rounded text-text-secondary hover:text-text-primary transition-colors"
                                title="Edit invoice"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick links block */}
          <div className="bg-bg-surface/30 border border-border/40 rounded-xl p-4 space-y-3">
            <div className="text-[10px] font-mono text-text-muted uppercase">Payment Quick Links</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <a href="#pref" className="bg-bg-elevated/40 border border-border/60 hover:border-accent-primary/40 transition-colors p-3 rounded-lg text-xs font-semibold text-center hover:text-text-primary">
                Payment Preferences
              </a>
              <a href="#wallet" className="bg-bg-elevated/40 border border-border/60 hover:border-accent-primary/40 transition-colors p-3 rounded-lg text-xs font-semibold text-center hover:text-text-primary">
                Client Wallet View
              </a>
              <a href="#admin" className="bg-bg-elevated/40 border border-border/60 hover:border-accent-primary/40 transition-colors p-3 rounded-lg text-xs font-semibold text-center hover:text-text-primary">
                Admin Preferences
              </a>
              <a href="#zip" className="bg-bg-elevated/40 border border-border/60 hover:border-accent-primary/40 transition-colors p-3 rounded-lg text-xs font-semibold text-center hover:text-text-primary">
                Download Invoices (ZIP)
              </a>
            </div>
          </div>
        </div>
      )}

      {subTab === 'methods' && (
        /* Payment Methods sub-tab */
        <div className="space-y-4">
          <div className="text-xs font-mono text-text-muted uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
            Saved Payment Methods
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-bg-surface border border-border rounded-xl p-4 flex items-center justify-between hover:border-border/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-bg-elevated border border-border rounded-lg text-accent-primary">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-text-primary text-xs">Visa ending in 4242</div>
                  <div className="text-[10px] text-text-muted font-mono">Expires 09/2028 · Primary Corporate Card</div>
                </div>
              </div>
              <span className="bg-accent-success/15 border border-accent-success/30 text-accent-success text-[9px] font-semibold px-2 py-0.5 rounded-full font-mono">
                DEFAULT
              </span>
            </div>

            <div className="bg-bg-surface border border-border rounded-xl p-4 flex items-center justify-between hover:border-border/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-bg-elevated border border-border rounded-lg text-text-secondary">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-text-primary text-xs">Société Générale SEPA</div>
                  <div className="text-[10px] text-text-muted font-mono">IBAN FR76 •••• 9812 · Backup Billing</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {subTab === 'credits' && (
        /* Service Credits sub-tab */
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="p-4 bg-bg-surface border border-border rounded-xl flex items-center gap-3.5 flex-1 max-w-sm">
              <div className="p-3 bg-accent-primary/15 text-accent-primary rounded-xl">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-text-muted uppercase">Credit Balance</div>
                <div className="text-2xl font-bold text-text-primary tracking-tight font-mono">€1,500.00</div>
              </div>
            </div>

            {isFinanceOfficer && (
              <button
                onClick={() => setShowIssueCreditModal(true)}
                className="px-2.5 py-1 bg-accent-primary hover:bg-accent-primary/80 text-text-primary font-semibold text-xs rounded-lg flex items-center gap-1 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Issue Service Credit
              </button>
            )}
          </div>

          <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
              Credit Adjustments History
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/40 text-text-muted h-8">
                    <th className="font-semibold pb-2">Issue Date</th>
                    <th className="font-semibold pb-2">Adjustment Reason</th>
                    <th className="font-semibold pb-2 font-mono">Credit Amount</th>
                    <th className="font-semibold pb-2">Issued By</th>
                    <th className="font-semibold pb-2 text-right">Expiration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {credits.map((cr, i) => (
                    <tr key={i} className="h-10 hover:bg-bg-base/30 transition-colors">
                      <td className="text-text-secondary">{cr.date}</td>
                      <td className="font-bold text-text-primary">{cr.reason}</td>
                      <td className="font-mono text-accent-success font-bold">{cr.amount}</td>
                      <td className="font-mono text-text-secondary">{cr.issuedBy}</td>
                      <td className="text-right font-mono text-text-muted">{cr.expiry}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {showCreateInvoiceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <form onSubmit={handleCreateInvoice} className="bg-bg-surface border border-border rounded-xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-heading font-bold text-text-primary text-base">Generate Invoice</h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-text-muted uppercase">Linked Project</label>
                <select
                  value={invProject}
                  onChange={(e) => setInvProject(e.target.value)}
                  className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-secondary px-3 py-2 focus:outline-none focus:border-accent-primary"
                >
                  <option>PayTech Portal</option>
                  <option>EtherDeFi Smart Contract</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-text-muted uppercase">Invoice Amount (EUR)</label>
                  <input
                    type="number"
                    required
                    value={invAmount}
                    onChange={(e) => setInvAmount(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-2 focus:outline-none focus:border-accent-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-text-muted uppercase">Due Date</label>
                  <input
                    type="date"
                    required
                    value={invDueDate}
                    onChange={(e) => setInvDueDate(e.target.value)}
                    className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-secondary px-3 py-2 focus:outline-none focus:border-accent-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateInvoiceModal(false)}
                className="flex-1 h-9 bg-transparent hover:bg-bg-elevated border border-border text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-9 bg-accent-primary hover:bg-accent-primary/80 text-text-primary text-xs font-semibold rounded-lg"
              >
                Create Invoice
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Issue Credit Modal */}
      {showIssueCreditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <form onSubmit={handleIssueCredit} className="bg-bg-surface border border-border rounded-xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-heading font-bold text-text-primary text-base">Issue Service Credit</h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-text-muted uppercase">Adjustment Reason</label>
                <input
                  type="text"
                  required
                  value={creditReason}
                  onChange={(e) => setCreditReason(e.target.value)}
                  placeholder="e.g. Compensate for deployment outage"
                  className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-2 focus:outline-none focus:border-accent-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-text-muted uppercase">Amount (EUR)</label>
                <input
                  type="number"
                  required
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-2 focus:outline-none focus:border-accent-primary"
                />
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowIssueCreditModal(false)}
                className="flex-1 h-9 bg-transparent hover:bg-bg-elevated border border-border text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-9 bg-accent-primary hover:bg-accent-primary/80 text-text-primary text-xs font-semibold rounded-lg"
              >
                Issue Credit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default PaymentsTab;
