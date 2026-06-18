import React, { useState } from 'react';
import { ClientProfile, useNexusStore } from '../../store/nexusStore';
import { Trash2 } from 'lucide-react';

interface BillingPrefsTabProps {
  client: ClientProfile;
  isRevealed: boolean;
}

export const BillingPrefsTab: React.FC<BillingPrefsTabProps> = ({ client, isRevealed }) => {
  const { addBillingRoutingRule, removeBillingRoutingRule } = useNexusStore();
  const [contractType, setContractType] = useState(client.billingPrefs.contractType);
  const [billingCycle, setBillingCycle] = useState(client.billingPrefs.billingCycle);
  const [paymentTerms, setPaymentTerms] = useState(client.billingPrefs.paymentTerms);
  const [autoInvoice, setAutoInvoice] = useState(client.billingPrefs.autoInvoice);
  const [currency, setCurrency] = useState(client.billingPrefs.currency);
  const [vatRate, setVatRate] = useState(client.billingPrefs.vatRate);
  const [withholdingTax, setWithholdingTax] = useState(client.billingPrefs.withholdingTax);

  // New routing rule states
  const [showAddRule, setShowAddRule] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [ruleCondition, setRuleCondition] = useState('Project contains PayTech');
  const [ruleDestination, setRuleDestination] = useState('PayTech Germany GmbH');
  const [ruleSplit, setRuleSplit] = useState(40);

  const handleAddRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    addBillingRoutingRule(client.id, ruleName, ruleCondition, ruleDestination, ruleSplit);
    setRuleName('');
    setShowAddRule(false);
  };

  const handleSavePreferences = () => {
    alert('Billing and contract settings updated successfully in customer profile registry.');
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="space-y-1">
        <h2 className="text-sm font-bold text-text-primary">Contract & Billing Preferences</h2>
        <p className="text-xs text-text-muted">
          For more info, review the <a href="#billing-policy" className="text-accent-primary hover:underline">billing preferences policy</a>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contract Settings Block */}
        <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
            Contract Settings
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-text-muted font-medium">Contract Type</span>
              <select 
                value={contractType} 
                onChange={(e) => setContractType(e.target.value)}
                className="bg-bg-elevated border border-border rounded-lg px-2.5 py-1 text-text-primary focus:outline-none focus:border-accent-primary"
              >
                <option>Fixed price</option>
                <option>Time & Materials</option>
                <option>Retainer</option>
                <option>Hybrid</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text-muted font-medium">Billing Cycle</span>
              <select 
                value={billingCycle} 
                onChange={(e) => setBillingCycle(e.target.value)}
                className="bg-bg-elevated border border-border rounded-lg px-2.5 py-1 text-text-primary focus:outline-none focus:border-accent-primary"
              >
                <option>Monthly</option>
                <option>Milestone-based</option>
                <option>On delivery</option>
                <option>Quarterly</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text-muted font-medium">Payment Terms</span>
              <select 
                value={paymentTerms} 
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="bg-bg-elevated border border-border rounded-lg px-2.5 py-1 text-text-primary focus:outline-none focus:border-accent-primary"
              >
                <option>Net 15</option>
                <option>Net 30</option>
                <option>Net 60</option>
                <option>Net 90</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text-muted font-medium">Auto-invoice Invoicing</span>
              {/* Toggle switch visual */}
              <button 
                type="button"
                onClick={() => setAutoInvoice(!autoInvoice)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${
                  autoInvoice ? 'bg-accent-primary' : 'bg-bg-elevated border border-border'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${autoInvoice ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text-muted font-medium">Default Currency</span>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-bg-elevated border border-border rounded-lg px-2.5 py-1 text-text-primary focus:outline-none focus:border-accent-primary"
              >
                <option>EUR</option>
                <option>USD</option>
                <option>GBP</option>
                <option>MAD</option>
                <option>USDC (crypto)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tax Settings Block */}
        <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
            Tax Settings
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-text-muted font-medium">VAT rate (%)</span>
              <input 
                type="number"
                value={vatRate}
                onChange={(e) => setVatRate(parseInt(e.target.value) || 0)}
                className="w-16 bg-bg-elevated border border-border rounded-lg px-2 py-1 text-right text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text-muted font-medium">Tax ID / VAT number</span>
              <span className="font-mono text-text-primary">
                {isRevealed ? client.vatNumber : '•••••••• (masked)'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text-muted font-medium">VAT Exemption Status</span>
              <span className="font-semibold text-text-secondary">No — Standard VAT</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-text-muted font-medium">Withholding tax applicable</span>
              <button 
                type="button"
                onClick={() => setWithholdingTax(!withholdingTax)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${
                  withholdingTax ? 'bg-accent-primary' : 'bg-bg-elevated border border-border'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${withholdingTax ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Routing Rules Block */}
      <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
              Billing routing rules
            </h3>
            <p className="text-[10px] text-text-muted leading-relaxed">
              Routing rules allow invoices to be split between subsidiaries or directed to specific cost centers for certain projects.
            </p>
          </div>

          <button
            onClick={() => setShowAddRule(true)}
            className="px-3 py-1 bg-bg-elevated hover:bg-bg-elevated/70 border border-border text-text-primary font-semibold text-xs rounded-lg shadow-sm transition-all"
          >
            Add new routing rule
          </button>
        </div>

        {client.billingPrefs.routingRules.length === 0 ? (
          <div className="p-6 text-center border border-dashed border-border rounded-xl bg-bg-base/20">
            <p className="text-xs text-text-muted">No routing rules configured.</p>
          </div>
        ) : (
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 text-text-muted h-8">
                  <th className="font-semibold pb-2 pl-2">Rule Name</th>
                  <th className="font-semibold pb-2 font-mono">Condition</th>
                  <th className="font-semibold pb-2">Destination Subsidiary</th>
                  <th className="font-semibold pb-2 text-center">% Split</th>
                  <th className="font-semibold pb-2 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {client.billingPrefs.routingRules.map((rule) => (
                  <tr key={rule.id} className="h-11 hover:bg-bg-base/30 transition-colors">
                    <td className="font-bold text-text-primary pl-2">{rule.name}</td>
                    <td className="font-mono text-text-secondary">{rule.condition}</td>
                    <td>{rule.destination}</td>
                    <td className="text-center font-bold text-text-primary">{rule.split}%</td>
                    <td className="text-right pr-2">
                      <button
                        onClick={() => removeBillingRoutingRule(client.id, rule.id)}
                        className="p-1 hover:bg-bg-elevated text-accent-danger rounded transition-colors"
                        title="Remove rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Save Button & Load More */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/20 pt-5">
        <button
          onClick={() => alert('No additional records found.')}
          className="text-xs text-accent-primary hover:underline font-semibold"
        >
          Load More...
        </button>

        <button
          onClick={handleSavePreferences}
          className="px-4 py-2 bg-accent-primary hover:bg-accent-primary/80 transition-colors text-text-primary font-semibold text-xs rounded-lg shadow-md self-end"
        >
          Save preferences
        </button>
      </div>

      {/* Add Rule Modal */}
      {showAddRule && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <form onSubmit={handleAddRuleSubmit} className="bg-bg-surface border border-border rounded-xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-heading font-bold text-text-primary text-base">Add Subsidiary Billing Rule</h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-text-muted uppercase">Rule Name</label>
                <input
                  type="text"
                  required
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g. German Tax Split"
                  className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-2 focus:outline-none focus:border-accent-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-text-muted uppercase">Routing Condition</label>
                <input
                  type="text"
                  required
                  value={ruleCondition}
                  onChange={(e) => setRuleCondition(e.target.value)}
                  placeholder="e.g. Project contains PayTech DE"
                  className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-2 focus:outline-none focus:border-accent-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-text-muted uppercase">Destination Child</label>
                  <select
                    value={ruleDestination}
                    onChange={(e) => setRuleDestination(e.target.value)}
                    className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-secondary px-3 py-2 focus:outline-none focus:border-accent-primary"
                  >
                    {client.childAccounts.map((child, idx) => (
                      <option key={idx} value={child.name}>{child.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-text-muted uppercase">Split Percentage (%)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={ruleSplit}
                    onChange={(e) => setRuleSplit(parseInt(e.target.value) || 0)}
                    className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-2 focus:outline-none focus:border-accent-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowAddRule(false)}
                className="flex-1 h-9 bg-transparent hover:bg-bg-elevated border border-border text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-9 bg-accent-primary hover:bg-accent-primary/80 text-text-primary text-xs font-semibold rounded-lg"
              >
                Apply Rule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default BillingPrefsTab;
