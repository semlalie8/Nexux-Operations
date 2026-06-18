import React, { useState } from 'react';
import { useNexusStore } from '../store/nexusStore';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  AreaChart, Area
} from 'recharts';
import {
  FileDown, ShieldCheck, TrendingUp, DollarSign, Users, AlertTriangle,
  Clock, CheckCircle, Activity, ArrowUpRight, ArrowDownRight, Minus, Filter
} from 'lucide-react';

const ACCENT = '#6366F1';
const SUCCESS = '#10B981';
const WARNING = '#F59E0B';
const DANGER = '#EF4444';



// Shared chart tooltip style
const tooltipStyle = { backgroundColor: '#16161F', borderColor: '#1E1E2E', borderRadius: 8, fontSize: 11 };

// ── Data ─────────────────────────────────────────────────────────────────────
const teamData = [
  { name: 'Sarah C.', resolves: 42, csat: 4.8, aht: 14.2, utilization: 88 },
  { name: 'Alex R.', resolves: 35, csat: 4.6, aht: 16.5, utilization: 82 },
  { name: 'Hiroshi T.', resolves: 28, csat: 4.9, aht: 22.1, utilization: 75 },
  { name: 'Sophie M.', resolves: 12, csat: 4.5, aht: 18.3, utilization: 55 },
  { name: 'Emma W.', resolves: 30, csat: 4.7, aht: 15.8, utilization: 79 }
];

const financialData = [
  { month: 'Jan', revenue: 140000, collected: 135000, expenses: 62000 },
  { month: 'Feb', revenue: 155000, collected: 150000, expenses: 68000 },
  { month: 'Mar', revenue: 168000, collected: 162000, expenses: 71000 },
  { month: 'Apr', revenue: 172000, collected: 172000, expenses: 74000 },
  { month: 'May', revenue: 184000, collected: 179000, expenses: 79000 },
  { month: 'Jun', revenue: 195000, collected: 184500, expenses: 84000 }
];

const clientHealthData = [
  { name: 'PayTech SAS', nps: 9, csat: 4.8, tickets: 12, openTickets: 1, reliability: 98, risk: 'Low', revenue: 184500, flag: 'VIP' },
  { name: 'DeFi Labs Ltd', nps: 8, csat: 4.6, tickets: 7, openTickets: 2, reliability: 94, risk: 'Medium', revenue: 240000, flag: 'Enterprise' },
  { name: 'TechCorp GmbH', nps: 7, csat: 4.1, tickets: 22, openTickets: 4, reliability: 81, risk: 'High', revenue: 95000, flag: '' },
  { name: 'Nova Fintech', nps: 6, csat: 3.9, tickets: 31, openTickets: 7, reliability: 72, risk: 'Critical', revenue: 62000, flag: '' }
];

const npsDistribution = [
  { name: 'Promoters (9-10)', value: 62 },
  { name: 'Passives (7-8)', value: 24 },
  { name: 'Detractors (0-6)', value: 14 }
];

const slaData = [
  { week: 'W1 Jun', compliance: 97.2, breaches: 1, avgResponse: 1.8 },
  { week: 'W2 Jun', compliance: 95.8, breaches: 3, avgResponse: 2.1 },
  { week: 'W3 Jun', compliance: 98.4, breaches: 0, avgResponse: 1.5 },
  { week: 'W4 Jun', compliance: 96.8, breaches: 2, avgResponse: 1.9 },
  { week: 'W1 May', compliance: 94.5, breaches: 4, avgResponse: 2.6 },
  { week: 'W2 May', compliance: 96.1, breaches: 2, avgResponse: 2.2 }
];

const slaByPriority = [
  { priority: 'Urgent (P1)', target: '1h', compliance: 92.3, avgActual: '1.2h', breaches: 3 },
  { priority: 'High (P2)', target: '4h', compliance: 96.5, avgActual: '3.4h', breaches: 2 },
  { priority: 'Medium (P3)', target: '24h', compliance: 98.8, avgActual: '14.2h', breaches: 1 },
  { priority: 'Low (P4)', target: '72h', compliance: 99.4, avgActual: '28.6h', breaches: 0 }
];

const slaRadarData = [
  { subject: 'Urgent', A: 92.3, fullMark: 100 },
  { subject: 'High', A: 96.5, fullMark: 100 },
  { subject: 'Medium', A: 98.8, fullMark: 100 },
  { subject: 'Low', A: 99.4, fullMark: 100 },
  { subject: 'Enterprise', A: 97.5, fullMark: 100 },
  { subject: 'Standard', A: 96.1, fullMark: 100 }
];

// ── Metric Card ───────────────────────────────────────────────────────────────
function MetricCard({ title, value, sub, trend }: { title: string; value: string; sub: string; trend: 'up' | 'down' | 'warn' | 'neutral' }) {
  const icon = trend === 'up' ? <ArrowUpRight className="w-3 h-3 text-accent-success" /> :
    trend === 'down' ? <ArrowDownRight className="w-3 h-3 text-accent-danger" /> :
    trend === 'warn' ? <AlertTriangle className="w-3 h-3 text-accent-warning" /> :
    <Minus className="w-3 h-3 text-text-muted" />;
  return (
    <div className="bg-bg-surface border border-border rounded-xl p-4 space-y-2 text-left hover:border-border/80 transition-colors">
      <div className="text-[10px] font-mono text-text-muted uppercase leading-tight">{title}</div>
      <div className="text-xl font-bold text-text-primary tracking-tight font-mono">{value}</div>
      <div className="flex items-center gap-1">{icon}<p className="text-[9px] text-text-secondary">{sub}</p></div>
    </div>
  );
}

// ── Risk Badge ────────────────────────────────────────────────────────────────
function RiskBadge({ risk }: { risk: string }) {
  const colors: Record<string, string> = {
    Low: 'text-accent-success bg-accent-success/10 border-accent-success/30',
    Medium: 'text-accent-warning bg-accent-warning/10 border-accent-warning/30',
    High: 'text-accent-danger bg-accent-danger/10 border-accent-danger/30',
    Critical: 'text-accent-danger bg-accent-danger/20 border-accent-danger/50 animate-pulse'
  };
  return (
    <span className={`text-[9px] font-bold border px-1.5 py-0.5 rounded font-mono ${colors[risk] || ''}`}>{risk}</span>
  );
}

// ── SLA Compliance Bar ────────────────────────────────────────────────────────
function SlaBar({ value, target = 95 }: { value: number; target?: number }) {
  const color = value >= 98 ? SUCCESS : value >= target ? ACCENT : value >= 90 ? WARNING : DANGER;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-[10px] font-mono font-bold" style={{ color }}>{value.toFixed(1)}%</span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export const Reports: React.FC = () => {
  const { user } = useNexusStore();
  const [activeTab, setActiveTab] = useState<'team' | 'financial' | 'client' | 'sla'>('team');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter'>('month');

  const handleExport = (type: string) => {
    alert(`📊 Compiling Nexus_Report_${activeTab.toUpperCase()}.${type.toLowerCase()}…`);
  };

  const hasAccess = ['Project Manager', 'Finance Officer', 'Administrator', 'Senior Agent'].includes(user.role);

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-accent-danger animate-pulse" />
        <h2 className="font-heading font-extrabold text-text-primary text-lg">Access Restriction</h2>
        <p className="text-xs text-text-muted max-w-sm">
          Reporting &amp; Analytics requires manager-level credentials. Your role: <strong>{user.role}</strong>
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'team', label: 'Team Performance', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'financial', label: 'Financial', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { id: 'client', label: 'Client Health', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'sla', label: 'SLA Compliance', icon: <Clock className="w-3.5 h-3.5" /> }
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight text-text-primary flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-accent-primary" />
            Reporting &amp; Analytics
          </h1>
          <p className="text-text-secondary text-sm mt-1">Corporate performance grids and financial metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Date range selector */}
          <div className="flex border border-border rounded-lg overflow-hidden text-[10px] font-semibold">
            {(['week', 'month', 'quarter'] as const).map(r => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-2.5 py-1.5 capitalize transition-colors ${dateRange === r ? 'bg-accent-primary text-white' : 'text-text-muted hover:text-text-primary'}`}
              >
                {r}
              </button>
            ))}
          </div>
          <button onClick={() => handleExport('CSV')} className="px-3 py-1.5 bg-bg-surface border border-border rounded-lg text-text-secondary hover:text-text-primary text-xs font-semibold flex items-center gap-1.5 transition-colors">
            <FileDown className="w-4 h-4 text-text-muted" /> CSV
          </button>
          <button onClick={() => handleExport('PDF')} className="px-3 py-1.5 bg-text-primary text-bg-base hover:bg-text-secondary text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors">
            <FileDown className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <MetricCard title="Active Tickets" value="38" sub="+12% from last week" trend="up" />
        <MetricCard title="Active Projects" value="14" sub="2 marked at-risk" trend="warn" />
        <MetricCard title="Monthly Revenue" value="€195K" sub="+8.4% vs last month" trend="up" />
        <MetricCard title="Avg. CSAT" value="4.82 / 5" sub="Target threshold: 4.5" trend="up" />
        <MetricCard title="SLA Compliance" value="96.8%" sub="Target threshold: 95.0%" trend="up" />
        <MetricCard title="Team Utilization" value="82.4%" sub="Optimal load bounds" trend="neutral" />
      </div>

      {/* Tab Navigation */}
      <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
        <div className="flex gap-0 border-b border-border/50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-5 py-3.5 text-xs font-semibold relative transition-all ${
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

          {/* ── TEAM PERFORMANCE ── */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-semibold text-text-secondary mb-3">Resolves per Agent</h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={teamData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
                        <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                        <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="resolves" fill={ACCENT} radius={[4, 4, 0, 0]} name="Resolves" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-text-secondary mb-3">Avg Handle Time (min)</h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={teamData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
                        <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                        <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="aht" fill={SUCCESS} radius={[4, 4, 0, 0]} name="AHT (min)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="border border-border/40 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-bg-elevated/40 text-text-muted h-9 border-b border-border/40">
                      <th className="font-semibold pl-4 pr-3">Agent</th>
                      <th className="font-semibold pr-3">Resolves</th>
                      <th className="font-semibold pr-3">Avg AHT</th>
                      <th className="font-semibold pr-3">Utilization</th>
                      <th className="font-semibold text-right pr-4">CSAT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {teamData.map(agent => (
                      <tr key={agent.name} className="h-11 hover:bg-bg-elevated/20 transition-colors">
                        <td className="font-bold pl-4 pr-3 text-text-primary">{agent.name}</td>
                        <td className="font-mono pr-3">{agent.resolves}</td>
                        <td className="pr-3 text-text-secondary">{agent.aht} min</td>
                        <td className="pr-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1 bg-bg-elevated rounded-full overflow-hidden">
                              <div className="h-full bg-accent-primary rounded-full" style={{ width: `${agent.utilization}%` }} />
                            </div>
                            <span className="font-mono text-text-secondary">{agent.utilization}%</span>
                          </div>
                        </td>
                        <td className="text-right pr-4 font-mono font-bold text-accent-success">⭐ {agent.csat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── FINANCIAL ── */}
          {activeTab === 'financial' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-bg-elevated/30 border border-border/40 rounded-xl p-4">
                  <div className="text-[10px] text-text-muted font-mono uppercase mb-1">Total Revenue YTD</div>
                  <div className="text-2xl font-bold font-mono text-text-primary">€1.01M</div>
                  <div className="text-[10px] text-accent-success flex items-center gap-0.5 mt-1"><ArrowUpRight className="w-3 h-3" />+22.4% YoY</div>
                </div>
                <div className="bg-bg-elevated/30 border border-border/40 rounded-xl p-4">
                  <div className="text-[10px] text-text-muted font-mono uppercase mb-1">Cash Collected</div>
                  <div className="text-2xl font-bold font-mono text-text-primary">€983K</div>
                  <div className="text-[10px] text-text-muted mt-1">97.3% collection rate</div>
                </div>
                <div className="bg-bg-elevated/30 border border-border/40 rounded-xl p-4">
                  <div className="text-[10px] text-text-muted font-mono uppercase mb-1">Outstanding ARR</div>
                  <div className="text-2xl font-bold font-mono text-accent-warning">€40K</div>
                  <div className="text-[10px] text-accent-danger flex items-center gap-0.5 mt-1"><AlertTriangle className="w-3 h-3" />1 overdue invoice</div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-text-secondary mb-3">Monthly Revenue vs Cash Collected</h3>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={financialData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={ACCENT} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={SUCCESS} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={SUCCESS} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
                      <XAxis dataKey="month" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} tickFormatter={v => `€${(v/1000).toFixed(0)}K`} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`€${v.toLocaleString()}`, '']} />
                      <Legend verticalAlign="top" height={28} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                      <Area type="monotone" dataKey="revenue" stroke={ACCENT} fill="url(#revGrad)" strokeWidth={2} name="Invoiced Revenue" dot={false} />
                      <Area type="monotone" dataKey="collected" stroke={SUCCESS} fill="url(#colGrad)" strokeWidth={2} name="Cash Collected" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="border border-border/40 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-bg-elevated/40 text-text-muted h-9 border-b border-border/40">
                      <th className="font-semibold pl-4 pr-3">Month</th>
                      <th className="font-semibold pr-3">Revenue</th>
                      <th className="font-semibold pr-3">Collected</th>
                      <th className="font-semibold pr-3">Expenses</th>
                      <th className="font-semibold text-right pr-4">Net Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {financialData.map(row => {
                      const margin = (((row.revenue - row.expenses) / row.revenue) * 100).toFixed(1);
                      return (
                        <tr key={row.month} className="h-10 hover:bg-bg-elevated/20 transition-colors">
                          <td className="font-bold pl-4 pr-3 text-text-primary">{row.month}</td>
                          <td className="font-mono pr-3">€{(row.revenue/1000).toFixed(0)}K</td>
                          <td className="font-mono pr-3 text-accent-success">€{(row.collected/1000).toFixed(0)}K</td>
                          <td className="font-mono pr-3 text-text-secondary">€{(row.expenses/1000).toFixed(0)}K</td>
                          <td className="text-right pr-4 font-mono font-bold text-accent-primary">{margin}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── CLIENT HEALTH ── */}
          {activeTab === 'client' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-semibold text-text-secondary mb-3">NPS Score Distribution</h3>
                  <div className="h-[180px] flex items-center">
                    <ResponsiveContainer width="50%" height="100%">
                      <PieChart>
                        <Pie data={npsDistribution} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={3} strokeWidth={0}>
                          {npsDistribution.map((_, i) => (
                            <Cell key={i} fill={[SUCCESS, ACCENT, DANGER][i]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2 pl-4">
                      {npsDistribution.map((d, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: [SUCCESS, ACCENT, DANGER][i] }} />
                          <span className="text-text-secondary text-[10px]">{d.name}</span>
                          <span className="ml-auto font-mono font-bold text-text-primary">{d.value}%</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-border/30">
                        <div className="text-[10px] text-text-muted">Net Promoter Score</div>
                        <div className="text-xl font-bold font-mono text-accent-success">+48</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-text-secondary mb-3">CSAT Trend (6 months)</h3>
                  <div className="h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { m: 'Jan', csat: 4.6 }, { m: 'Feb', csat: 4.7 }, { m: 'Mar', csat: 4.75 },
                        { m: 'Apr', csat: 4.8 }, { m: 'May', csat: 4.78 }, { m: 'Jun', csat: 4.82 }
                      ]} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
                        <XAxis dataKey="m" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                        <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} domain={[4.4, 5]} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Line type="monotone" dataKey="csat" stroke={ACCENT} strokeWidth={2} dot={{ fill: ACCENT, r: 3 }} name="Avg CSAT" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="border border-border/40 rounded-xl overflow-hidden text-xs">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 bg-bg-elevated/20">
                  <h3 className="text-xs font-semibold text-text-primary">Client Health Index</h3>
                  <button className="flex items-center gap-1 text-[10px] text-text-muted hover:text-text-primary">
                    <Filter className="w-3 h-3" /> Filter
                  </button>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-bg-elevated/40 text-text-muted h-9 border-b border-border/40">
                      <th className="font-semibold pl-4 pr-3">Client</th>
                      <th className="font-semibold pr-3">NPS</th>
                      <th className="font-semibold pr-3">CSAT</th>
                      <th className="font-semibold pr-3">Open Tickets</th>
                      <th className="font-semibold pr-3">Pay Reliability</th>
                      <th className="font-semibold text-right pr-4">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {clientHealthData.map(client => (
                      <tr key={client.name} className="h-12 hover:bg-bg-elevated/20 transition-colors">
                        <td className="pl-4 pr-3">
                          <div className="font-bold text-text-primary">{client.name}</div>
                          {client.flag && <div className="text-[9px] text-accent-primary font-mono">{client.flag}</div>}
                        </td>
                        <td className="font-mono pr-3 font-bold" style={{ color: client.nps >= 8 ? SUCCESS : client.nps >= 6 ? WARNING : DANGER }}>
                          {client.nps}
                        </td>
                        <td className="font-mono pr-3">⭐ {client.csat}</td>
                        <td className="pr-3">
                          <span className={`font-mono font-bold ${client.openTickets === 0 ? 'text-accent-success' : client.openTickets > 3 ? 'text-accent-danger' : 'text-accent-warning'}`}>
                            {client.openTickets}
                          </span>
                          <span className="text-text-muted"> / {client.tickets}</span>
                        </td>
                        <td className="pr-3">
                          <SlaBar value={client.reliability} />
                        </td>
                        <td className="text-right pr-4">
                          <RiskBadge risk={client.risk} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── SLA COMPLIANCE ── */}
          {activeTab === 'sla' && (
            <div className="space-y-6">
              {/* Summary banner */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Overall SLA', value: '96.8%', color: ACCENT, icon: <CheckCircle className="w-4 h-4" /> },
                  { label: 'Target', value: '95.0%', color: SUCCESS, icon: <Clock className="w-4 h-4" /> },
                  { label: 'Breaches (MTD)', value: '6', color: WARNING, icon: <AlertTriangle className="w-4 h-4" /> },
                  { label: 'Avg Response', value: '1.9h', color: ACCENT, icon: <Activity className="w-4 h-4" /> }
                ].map(item => (
                  <div key={item.label} className="bg-bg-elevated/30 border border-border/40 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color + '22', color: item.color }}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-text-muted uppercase">{item.label}</div>
                      <div className="text-base font-bold font-mono text-text-primary">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-semibold text-text-secondary mb-3">Weekly SLA Compliance Trend</h3>
                  <div className="h-[190px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[...slaData].reverse()} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
                        <XAxis dataKey="week" stroke="#475569" fontSize={8} tickLine={false} axisLine={false} />
                        <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} domain={[90, 100]} tickFormatter={v => `${v}%`} />
                        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v.toFixed(1)}%`, 'Compliance']} />
                        {/* Target threshold line reference */}
                        <Line type="monotone" dataKey="compliance" stroke={ACCENT} strokeWidth={2} dot={{ fill: ACCENT, r: 3 }} name="Compliance %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-text-secondary mb-3">SLA Compliance by Tier (Radar)</h3>
                  <div className="h-[190px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={slaRadarData}>
                        <PolarGrid stroke="#1E1E2E" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 9 }} />
                        <Radar name="Compliance" dataKey="A" stroke={ACCENT} fill={ACCENT} fillOpacity={0.2} strokeWidth={2} />
                        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, 'Compliance']} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="border border-border/40 rounded-xl overflow-hidden text-xs">
                <div className="px-4 py-2.5 border-b border-border/40 bg-bg-elevated/20">
                  <h3 className="text-xs font-semibold text-text-primary">SLA Compliance by Priority Tier</h3>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-bg-elevated/40 text-text-muted h-9 border-b border-border/40">
                      <th className="font-semibold pl-4 pr-3">Priority</th>
                      <th className="font-semibold pr-3">SLA Target</th>
                      <th className="font-semibold pr-3">Avg Actual</th>
                      <th className="font-semibold pr-3 w-48">Compliance</th>
                      <th className="font-semibold text-right pr-4">Breaches</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {slaByPriority.map(row => (
                      <tr key={row.priority} className="h-12 hover:bg-bg-elevated/20 transition-colors">
                        <td className="font-bold pl-4 pr-3 text-text-primary">{row.priority}</td>
                        <td className="font-mono pr-3 text-text-secondary">{row.target}</td>
                        <td className="font-mono pr-3">{row.avgActual}</td>
                        <td className="pr-3 w-48"><SlaBar value={row.compliance} /></td>
                        <td className="text-right pr-4">
                          <span className={`font-mono font-bold ${row.breaches === 0 ? 'text-accent-success' : row.breaches <= 2 ? 'text-accent-warning' : 'text-accent-danger'}`}>
                            {row.breaches}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
