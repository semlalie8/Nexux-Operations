import React from 'react';
import { ClientProfile } from '../../store/nexusStore';
import { ShieldAlert, Clock, ShieldCheck, MapPin } from 'lucide-react';

interface OverviewTabProps {
  client: ClientProfile;
  isRevealed: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ client, isRevealed }) => {
  return (
    <div className="space-y-6 text-sm text-text-secondary leading-normal">
      {/* Flags row */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-border/40">
        {client.flags.map((flag, idx) => (
          <span
            key={idx}
            className={`text-xs px-2.5 py-1 rounded-full font-semibold select-none border border-transparent ${
              flag === 'At Risk' || flag === 'Payment Issue'
                ? 'bg-accent-danger/10 text-accent-danger border-accent-danger/25'
                : flag === 'VIP'
                  ? 'bg-accent-warning/10 text-accent-warning border-accent-warning/25'
                  : 'bg-bg-elevated text-text-secondary border-border hover:text-text-primary transition-colors cursor-pointer'
            }`}
          >
            {flag}
          </span>
        ))}
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Summary block */}
        <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
            Client Summary
          </h3>
          
          <table className="w-full text-xs">
            <tbody className="divide-y divide-border/20">
              <tr className="h-9">
                <td className="text-text-muted font-medium">Active projects</td>
                <td className="text-right text-text-primary font-bold">3</td>
              </tr>
              <tr className="h-9">
                <td className="text-text-muted font-medium">Completed projects</td>
                <td className="text-right text-text-primary font-bold">12</td>
              </tr>
              <tr className="h-9">
                <td className="text-text-muted font-medium">Open tickets</td>
                <td className="text-right text-text-primary font-bold">2</td>
              </tr>
              <tr className="h-9">
                <td className="text-text-muted font-medium">Avg. CSAT</td>
                <td className="text-right text-text-primary font-bold">⭐ {client.avgCsat} / 5</td>
              </tr>
              <tr className="h-9">
                <td className="text-text-muted font-medium">NPS Score</td>
                <td className="text-right text-text-primary font-bold">{client.npsScore} / 10</td>
              </tr>
              <tr className="h-9">
                <td className="text-text-muted font-medium">Payment reliability</td>
                <td className="text-right text-accent-success font-semibold">{client.paymentReliability}</td>
              </tr>
              <tr className="h-9">
                <td className="text-text-muted font-medium">Total revenue (lifetime)</td>
                <td className="text-right font-mono font-bold text-text-primary">
                  {isRevealed ? client.totalRevenue : '•••••••• (masked)'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Location details block */}
        <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
            Location Details
          </h3>
          
          <table className="w-full text-xs">
            <tbody className="divide-y divide-border/20">
              <tr className="h-9">
                <td className="text-text-muted font-medium">Current location and time</td>
                <td className="text-right text-text-primary font-medium flex items-center justify-end gap-1.5 h-9">
                  <MapPin className="w-3.5 h-3.5 text-accent-primary" />
                  {client.city}, {client.country} · {client.localTime}
                </td>
              </tr>
              <tr className="h-9">
                <td className="text-text-muted font-medium">Country of registration</td>
                <td className="text-right text-text-primary">{client.country}</td>
              </tr>
              <tr className="h-9">
                <td className="text-text-muted font-medium">Currency & VAT</td>
                <td className="text-right text-text-primary font-medium">{client.billingPrefs.currency} · VAT {client.vatNumber}</td>
              </tr>
              <tr className="h-9">
                <td className="text-text-muted font-medium">Business hours note</td>
                <td className="text-right text-accent-warning flex items-center justify-end gap-1 h-9">
                  <Clock className="w-3.5 h-3.5" />
                  {client.businessHoursNote.includes('Outside') ? '🌙 Outside reasonable hours' : '🟢 Within business hours'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Online activity block */}
        <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
            Online Activity
          </h3>
          
          <table className="w-full text-xs">
            <tbody className="divide-y divide-border/20">
              <tr className="h-9">
                <td className="text-text-muted font-medium">Account creation date</td>
                <td className="text-right text-text-primary">{client.creationDate}</td>
              </tr>
              <tr className="h-9">
                <td className="text-text-muted font-medium">Account creation location</td>
                <td className="text-right text-text-primary">{client.city}, {client.country}</td>
              </tr>
              <tr className="h-9">
                <td className="text-text-muted font-medium">Last login</td>
                <td className="text-right text-text-primary font-mono">
                  {isRevealed ? new Date(client.lastLogin).toLocaleString() : '•••••••• (masked)'}
                </td>
              </tr>
              <tr className="h-9">
                <td className="text-text-muted font-medium">Preferred language</td>
                <td className="text-right text-text-primary">{client.language}</td>
              </tr>
              <tr className="h-9">
                <td className="text-text-muted font-medium">Additional languages</td>
                <td className="text-right text-text-primary">{client.additionalLanguages.join(', ')}</td>
              </tr>
              <tr className="h-9">
                <td className="text-text-muted font-medium">Portal activity</td>
                <td className="text-right text-text-primary">2 active tickets and cases</td>
              </tr>
              <tr className="h-9">
                <td className="text-text-muted font-medium">Suspended connections</td>
                <td className="text-right font-mono">
                  {isRevealed ? 'None' : '•••••••• (masked)'}
                </td>
              </tr>
              <tr className="h-9">
                <td className="text-text-muted font-medium">Social media accounts</td>
                <td className="text-right text-accent-primary underline underline-offset-2">
                  {isRevealed ? 'linkedin.com/in/marie-dubois' : '•••••••• (masked)'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Verification status block */}
        <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary mb-4">
              Verification Status
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border/20 pb-2.5">
                <span className="text-xs text-text-muted font-medium">Identity/KYB verification</span>
                <span className="flex items-center gap-1 bg-accent-success/15 border border-accent-success/30 text-accent-success text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="text-[10px] text-text-muted font-mono uppercase">Verification Level</div>
                <p className="text-xs text-text-primary font-medium">{client.verificationDetails}</p>
              </div>

              <div className="space-y-1 pt-1.5 border-t border-border/25">
                <div className="text-[10px] text-text-muted font-mono uppercase">Contract Status</div>
                <p className="text-xs text-text-primary font-medium">{client.contractStatus}</p>
              </div>

              <div className="space-y-1 pt-1.5 border-t border-border/25">
                <div className="text-[10px] text-text-muted font-mono uppercase">Company Registration Number</div>
                <p className="text-xs text-text-primary font-mono font-medium">
                  {isRevealed ? client.companyRegNo : '•••••••••••••••• (masked)'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-[10px] font-mono text-text-muted bg-bg-elevated/50 p-2.5 rounded-lg border border-border/50 flex items-start gap-2 mt-4">
            <ShieldAlert className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
            <span>Verify documents in the Solutions / Reference tab. All contracts are archived under ISO 27001 requirements.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OverviewTab;
