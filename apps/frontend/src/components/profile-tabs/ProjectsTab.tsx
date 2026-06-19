import React, { useState } from 'react';
import { ClientProfile, Project, useNexusStore } from '../../store/nexusStore';
import { SlidersHorizontal, Info, AlertCircle } from 'lucide-react';

interface ProjectsTabProps {
  client: ClientProfile;
  onSelectProject?: (project: Project) => void;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({ client, onSelectProject }) => {
  const { projects } = useNexusStore();
  const [subTab, setSubTab] = useState<'active' | 'completed' | 'proposals' | 'archived'>('active');
  const [timeFilter, setTimeFilter] = useState<'all' | 'current' | 'past' | 'upcoming'>('all');

  // Filter projects for this client
  const clientProjects = projects.filter(p => {
    if (client.id === 'CL-001') return p.id === 'PRJ-101'; // PayTech
    return p.id === 'PRJ-102'; // DeFi Labs
  });

  const activeProjects = clientProjects.filter(p => p.status !== 'Completed');
  const completedProjects = clientProjects.filter(p => p.status === 'Completed');

  const getDisplayedProjects = () => {
    switch (subTab) {
      case 'active':
        return activeProjects;
      case 'completed':
        return completedProjects;
      case 'proposals':
      case 'archived':
      default:
        return []; // Proposals/Archived are empty in initial mock
    }
  };

  const displayedProjects = getDisplayedProjects();

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
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex gap-4 border-b border-border/30 pb-3">
        {(['active', 'completed', 'proposals', 'archived'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`text-xs font-semibold px-1 py-0.5 relative transition-all capitalize ${
              subTab === tab ? 'text-accent-primary' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab}
            {subTab === tab && (
              <div className="absolute left-0 right-0 bottom-[-13px] h-0.5 bg-accent-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-bg-surface/30 border border-border/40 p-2.5 rounded-xl">
        <button className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary px-2.5 py-1.5 rounded-lg border border-border hover:bg-bg-elevated transition-colors font-medium">
          <SlidersHorizontal className="w-3.5 h-3.5 text-text-muted" />
          Open filters
        </button>

        <div className="flex rounded-lg bg-bg-base/40 p-0.5 border border-border/60">
          {(['all', 'upcoming', 'current', 'past'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-3 py-1 text-[10px] font-semibold rounded-md transition-all capitalize ${
                timeFilter === f
                  ? 'bg-bg-elevated text-text-primary'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Project list table */}
      <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
          {subTab === 'active' ? 'Active Projects' : 'Projects List'}
        </h3>

        {displayedProjects.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl bg-bg-base/20 space-y-1">
            <Info className="w-6 h-6 text-text-muted mx-auto" />
            <p className="text-xs font-semibold text-text-secondary">No projects found</p>
            <p className="text-[10px] text-text-muted">No records matching the selected status tab.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 text-text-muted h-8">
                  <th className="font-semibold pb-2 pl-2">Thumbnail</th>
                  <th className="font-semibold pb-2">Project Name</th>
                  <th className="font-semibold pb-2">Service Type</th>
                  <th className="font-semibold pb-2">Current Phase</th>
                  <th className="font-semibold pb-2">Start Date</th>
                  <th className="font-semibold pb-2">Est. End</th>
                  <th className="font-semibold pb-2">Lead</th>
                  <th className="font-semibold pb-2 text-right">Contract Value</th>
                  <th className="font-semibold pb-2 text-right pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {displayedProjects.map((p) => (
                  <tr 
                    key={p.id} 
                    onClick={() => onSelectProject && onSelectProject(p)}
                    className="h-16 hover:bg-bg-base/40 transition-colors cursor-pointer"
                  >
                    <td className="pl-2">
                      <img 
                        src={p.thumbnail} 
                        alt={p.name}
                        className="w-16 h-12 rounded object-cover border border-border/50 bg-bg-base"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${p.name}`;
                        }}
                      />
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-bold text-text-primary text-xs hover:text-accent-primary transition-colors">{p.name}</span>
                        <span className="font-mono text-[9px] text-text-muted">{p.code}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${serviceColors[p.serviceType]}`}>
                        {p.serviceType}
                      </span>
                    </td>
                    <td className="text-text-secondary font-medium">{p.contractPhase}</td>
                    <td>{p.startDate}</td>
                    <td>{p.endDate}</td>
                    <td className="font-mono text-text-secondary">{p.teamLead}</td>
                    <td className="text-right font-mono text-text-primary font-bold">{p.contractValue}</td>
                    <td className="text-right pr-2">
                      <span className={`text-[9px] px-2 py-0.5 rounded font-semibold border ${statusChips[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="text-[10px] font-mono text-text-muted flex items-start gap-1.5 bg-bg-elevated/20 p-3 rounded-lg border border-border/40">
        <AlertCircle className="w-4 h-4 text-accent-primary flex-shrink-0" />
        <span>Clicking a project row loaded inside this view will trigger the corresponding timelines, repositories, and QA pipelines in the Activity tab.</span>
      </div>
    </div>
  );
};
export default ProjectsTab;
