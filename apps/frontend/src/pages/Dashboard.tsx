import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer 
} from 'recharts';
import { Clock, HelpCircle, ChevronDown, TrendingUp } from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';

export const Dashboard: React.FC = () => {
  const { user } = useNexusStore();
  const [timeRange, setTimeRange] = useState('Last 24 hours');
  const [showChartData, setShowChartData] = useState(true); // Toggle to demo empty state

  // Time-aware greeting
  const getGreeting = () => {
    const hours = new Date().getHours();
    const firstName = user.name.split(' ')[0];
    if (hours < 12) return `Good morning, ${firstName}!`;
    if (hours < 18) return `Good afternoon, ${firstName}!`;
    return `Good evening, ${firstName}!`;
  };

  // Mock data for Average Ticket Resolves
  const chartData = [
    { time: '8 AM', resolves: 2 },
    { time: '11 AM', resolves: 5 },
    { time: '2 PM', resolves: 8 },
    { time: '5 PM', resolves: 4 },
    { time: '8 PM', resolves: 7 },
    { time: '11 PM', resolves: 3 },
    { time: '2 AM', resolves: 1 },
    { time: '5 AM', resolves: 0 },
  ];

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const metrics = [
    { title: 'Reopen rate', value: '4.2', suffix: '%', delta: '-1.2 pts', positive: true, tooltip: 'Percentage of resolved cases that are reopened by the client.' },
    { title: 'Mis-escalation rate', value: '1.8', suffix: '%', delta: '-0.4 pts', positive: true, tooltip: 'Percentage of cases routed to the wrong technical department.' },
    { title: 'First Contact Resolution', value: '72.5', suffix: '%', delta: '+3.1 pts', positive: true, tooltip: 'Percentage of tickets resolved on the initial interaction.' },
    { title: 'Average Handle Time', value: '18.4', suffix: ' min', delta: '-2.3 min', positive: true, tooltip: 'Mean active time spent by agents resolving a ticket.' },
    { title: 'SLA Compliance', value: '96.8', suffix: '%', delta: '+1.5 pts', positive: true, tooltip: 'Percentage of cases closed within contracted service level agreements.' },
    { title: 'CSAT Score', value: '4.82', suffix: ' / 5', delta: '+0.12 pts', positive: true, tooltip: 'Average client satisfaction rating out of 5 stars.' },
    { title: 'Tickets closed', value: '142', suffix: '', delta: '+12%', positive: true, tooltip: 'Total volume of support cases closed in the selected period.' },
    { title: 'Escalations sent', value: '8', suffix: '', delta: '-2', positive: true, tooltip: 'Total tickets escalated to engineering tiers.' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight text-text-primary">
            {getGreeting()}
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Here's a snapshot of how you're doing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-surface border border-border text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Shift Status: Active Support Tier 2</span>
          </div>
          <div className="text-text-muted text-xs font-mono">{currentDate}</div>
        </div>
      </div>

      {/* Productivity Section */}
      <section className="bg-bg-surface border border-border rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-accent-primary/10 text-accent-primary">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold font-heading text-text-primary">Productivity</h2>
              <p className="text-[10px] text-text-muted font-mono mt-0.5">
                Last updated 12 minutes ago · Updated hourly
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {/* Toggle empty state button for evaluation/training */}
            <button 
              onClick={() => setShowChartData(!showChartData)}
              className="text-[10px] text-text-muted hover:text-text-secondary border border-border px-2 py-1.5 rounded bg-bg-elevated/40"
            >
              Toggle Demo Data: {showChartData ? 'ON' : 'OFF'}
            </button>
            <div className="relative flex-1 min-w-[120px]">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full appearance-none bg-bg-elevated border border-border rounded-lg text-xs text-text-secondary px-3 py-1.5 pr-8 hover:text-text-primary focus:outline-none cursor-pointer"
              >
                <option>Last 24 hours</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Custom</option>
              </select>
              <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Primary Chart — Average Ticket Resolves */}
        <div className="w-full h-[220px] relative">
          {showChartData ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  fontFamily="JetBrains Mono"
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  domain={[0, 10]}
                  fontFamily="JetBrains Mono"
                />
                <ChartTooltip 
                  contentStyle={{ backgroundColor: '#16161F', borderColor: '#1E1E2E', borderRadius: '8px' }}
                  labelStyle={{ fontFamily: 'Syne', fontWeight: 'bold', color: '#F8FAFC' }}
                  itemStyle={{ color: '#6366F1' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="resolves" 
                  stroke="#6366F1" 
                  strokeWidth={2}
                  dot={{ r: 4, stroke: '#6366F1', strokeWidth: 2, fill: '#0A0A0F' }}
                  activeDot={{ r: 6, fill: '#6366F1' }}
                  filter="url(#glow)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            /* Graceful Empty State */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-surface/50 border border-dashed border-border rounded-lg p-6">
              <div className="w-full h-full opacity-10 absolute pointer-events-none">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.map(d => ({ ...d, resolves: 0 }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <HelpCircle className="w-10 h-10 text-text-muted mb-2 relative z-10" />
              <h3 className="font-heading font-semibold text-text-primary text-sm relative z-10">-- per day · No data</h3>
              <p className="text-text-muted text-xs mt-1 relative z-10">There is currently no resolve data available for this time range.</p>
            </div>
          )}
        </div>
      </section>

      {/* Other Metrics Section */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-accent-primary/10 text-accent-primary">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold font-heading text-text-primary">Other Metrics</h2>
              <p className="text-[10px] text-text-muted font-mono mt-0.5">
                Last updated 2 days ago · Updated every 24 hours
              </p>
            </div>
          </div>
          <div className="relative w-full md:w-auto">
            <select className="w-full md:w-auto appearance-none bg-bg-surface border border-border rounded-lg text-xs text-text-secondary px-3 py-1.5 pr-8 hover:text-text-primary focus:outline-none cursor-pointer">
              <option>This week</option>
              <option>This month</option>
              <option>Last 30 days</option>
            </select>
            <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
        </div>

        <div className="border border-border/60 bg-bg-surface/30 rounded-xl p-4">
          <div className="text-xs font-mono text-text-muted mb-4 uppercase tracking-wider pl-1 border-l-2 border-accent-primary">
            Case Handling
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric, i) => (
              <div 
                key={i}
                className="bg-bg-surface border border-border rounded-xl p-5 hover:border-border/80 transition-all group relative flex flex-col justify-between h-28"
              >
                <div className="flex items-start justify-between">
                  {/* Tooltip trigger */}
                  <div className="flex items-center gap-1.5 cursor-help select-none">
                    <span className="text-xs text-text-secondary font-medium border-b border-dashed border-text-muted group-hover:border-text-secondary">
                      {metric.title}
                    </span>
                    {/* Tooltip display */}
                    <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute left-5 top-[-10px] bg-bg-elevated border border-border text-[10px] text-text-secondary p-2 rounded shadow-xl max-w-[200px] z-50 transition-opacity duration-200">
                      {metric.tooltip}
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-medium ${
                    metric.title === 'CSAT Score' || metric.title === 'SLA Compliance' || metric.title === 'Tickets closed' || metric.title.includes('Resolution')
                      ? 'text-accent-success bg-accent-success/10'
                      : 'text-accent-warning bg-accent-warning/10'
                  } px-2 py-0.5 rounded-full`}>
                    {metric.delta}
                  </span>
                </div>
                
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-bold text-text-primary tracking-tight">{metric.value}</span>
                  <span className="text-sm font-mono text-text-muted font-semibold">{metric.suffix}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
export default Dashboard;
