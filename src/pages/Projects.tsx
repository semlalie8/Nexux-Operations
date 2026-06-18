import React, { useState } from 'react';
import { useNexusStore } from '../store/nexusStore';
import { Folder, SlidersHorizontal, Info, ChevronRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { projects } = useNexusStore();
  const [filter, setFilter] = useState<'All' | 'On track' | 'At risk'>('All');

  const filtered = filter === 'All' 
    ? projects 
    : projects.filter(p => p.status === filter);

  const serviceColors = {
    Fintech: 'bg-indigo-950 text-indigo-300 border-indigo-800/40',
    'Web App': 'bg-sky-950 text-sky-300 border-sky-800/40',
    'Mobile App': 'bg-emerald-950 text-emerald-300 border-emerald-800/40',
    Blockchain: 'bg-purple-950 text-purple-300 border-purple-800/40',
    'AI/ML': 'bg-rose-950 text-rose-300 border-rose-800/40',
    API: 'bg-amber-950 text-amber-300 border-amber-800/40',
    DevOps: 'bg-slate-900 text-slate-300 border-slate-700/40'
  };

  const statusChips = {
    'On track': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'At risk': 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse',
    'Off track': 'bg-red-500/10 text-red-500 border-red-500/20',
    'On hold': 'bg-sky-500/10 text-sky-500 border-sky-500/20',
    Completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'In proposal': 'bg-gray-800 text-text-muted border-border'
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight text-text-primary flex items-center gap-2.5">
            <Folder className="w-7 h-7 text-accent-primary" />
            Projects Dashboard
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Overview of all active client software development contracts.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-bg-surface/30 border border-border p-2.5 rounded-xl">
        <button className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-lg border border-border hover:bg-bg-elevated transition-colors font-semibold">
          <SlidersHorizontal className="w-3.5 h-3.5 text-text-muted" />
          Filter options
        </button>

        <div className="flex rounded-lg bg-bg-base/40 p-0.5 border border-border/60">
          {(['All', 'On track', 'At risk'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
                filter === f
                  ? 'bg-bg-elevated text-text-primary'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((p) => (
          <div 
            key={p.id}
            onClick={() => navigate('/tickets/TCK-9481')}
            className="bg-bg-surface border border-border rounded-xl p-5 hover:border-accent-primary/40 transition-colors cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={p.thumbnail} 
                    alt={p.name} 
                    className="w-16 h-12 rounded object-cover border border-border/60 bg-bg-base"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${p.name}`;
                    }}
                  />
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-text-primary text-sm group-hover:text-accent-primary transition-colors">{p.name}</span>
                    <span className="font-mono text-[9px] text-text-muted mt-0.5">{p.code}</span>
                  </div>
                </div>

                <span className={`text-[9px] px-2 py-0.5 rounded font-semibold border ${statusChips[p.status]}`}>
                  {p.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded border ${serviceColors[p.serviceType]}`}>
                  {p.serviceType}
                </span>
                <span className="text-[9px] bg-bg-elevated px-2 py-0.5 rounded border border-border font-mono">
                  {p.contractType}
                </span>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed pt-1">
                Phase: <strong className="text-text-primary">{p.contractPhase}</strong> · {p.locationType.split(' · ')[1]}
              </p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border/20 text-[10px] text-text-muted font-mono mt-4">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Lead: {p.teamLead}
              </span>
              <span className="text-accent-primary font-bold flex items-center gap-0.5">
                Inspect Case <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-8 text-center border border-dashed border-border rounded-xl bg-bg-base/20 md:col-span-2 space-y-1.5 select-none">
            <Info className="w-6 h-6 text-text-muted mx-auto" />
            <p className="text-xs font-semibold text-text-secondary">No projects matched</p>
            <p className="text-[10px] text-text-muted">Adjust filters to display projects.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Projects;
