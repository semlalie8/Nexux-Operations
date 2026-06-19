import React, { useState } from 'react';
import { Project } from '../../store/nexusStore';
import { 
  Github, FileText, Plus
} from 'lucide-react';

interface ActivityTabProps {
  project: Project;
}

export const ActivityTab: React.FC<ActivityTabProps> = ({ project }) => {
  const [subTab, setSubTab] = useState<'timeline' | 'milestones' | 'deployments' | 'repos' | 'qa'>('timeline');
  const [milestones, setMilestones] = useState(project.milestones);
  const [deployments, setDeployments] = useState(project.deployments);
  
  // Milestone state form
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [mName, setMName] = useState('');
  const [mDue, setMDue] = useState('');

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName.trim()) return;

    setMilestones([
      ...milestones,
      { name: mName, due: mDue || 'TBD', status: 'Pending', signoff: 'Pending' }
    ]);
    setMName('');
    setMDue('');
    setShowAddMilestoneModal(false);
  };

  const handleRollback = (version: string) => {
    alert(`Initiating automated rollback pipeline to ${version}. Auditing logs and scaling containers...`);
    // Add dummy deployment
    const rollbackEvent = {
      env: 'Production',
      version: `${version}-rollback`,
      by: 'Sarah Connor',
      date: 'Just now',
      status: 'Live',
      rollback: false
    };
    setDeployments([rollbackEvent, ...deployments]);
  };

  const deploymentStatusChips: Record<string, string> = {
    Live: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Staging: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Failed: 'bg-red-500/10 text-red-500 border-red-500/20',
    'In progress': 'bg-accent-primary/10 text-accent-primary border-accent-primary/20 animate-pulse'
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-4 border-b border-border/30 pb-3">
        {(['timeline', 'milestones', 'deployments', 'repos', 'qa'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`text-xs font-semibold px-1 py-0.5 relative transition-all capitalize ${
              subTab === tab ? 'text-accent-primary' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab === 'repos' ? 'Repositories' : tab === 'qa' ? 'QA & Testing' : tab}
            {subTab === tab && (
              <div className="absolute left-0 right-0 bottom-[-13px] h-0.5 bg-accent-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Project name indicator */}
      <div className="flex items-center justify-between text-xs text-text-muted pb-1 border-b border-border/10 font-mono">
        <span>Active Project Context: <strong className="text-text-primary">{project.name}</strong></span>
        <span>ID: {project.code}</span>
      </div>

      {subTab === 'timeline' && (
        /* Timeline sub-tab */
        <div className="space-y-4">
          <div className="text-xs font-mono text-text-muted uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
            Project Phase Tracker
          </div>
          
          <div className="space-y-3">
            {project.timeline.map((phase, i) => (
              <div 
                key={i}
                className="bg-bg-surface border border-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-border/80 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text-primary">{phase.phase}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                      phase.status === 'Completed' ? 'bg-accent-success/15 text-accent-success' : 'bg-accent-warning/15 text-accent-warning'
                    }`}>
                      {phase.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted">
                    Duration: {phase.duration} · Developers assigned: {phase.teamSize}
                  </p>
                </div>

                <div className="w-full md:w-48 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-text-secondary">
                    <span>Progress</span>
                    <span>{phase.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent-primary rounded-full transition-all duration-500" 
                      style={{ width: `${phase.progress}%` }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'milestones' && (
        /* Milestones sub-tab */
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
              Project Milestones
            </h3>
            
            <button
              onClick={() => setShowAddMilestoneModal(true)}
              className="px-2.5 py-1 bg-accent-primary hover:bg-accent-primary/80 text-text-primary font-semibold text-xs rounded-lg flex items-center gap-1 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add Milestone
            </button>
          </div>

          <div className="bg-bg-surface/50 border border-border rounded-xl p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/40 text-text-muted h-8">
                    <th className="font-semibold pb-2">Milestone Name</th>
                    <th className="font-semibold pb-2">Target Date</th>
                    <th className="font-semibold pb-2">Delivery Status</th>
                    <th className="font-semibold pb-2 text-right">Sign-off Approver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {milestones.map((m, i) => (
                    <tr key={i} className="h-10 hover:bg-bg-base/30 transition-colors">
                      <td className="font-bold text-text-primary">{m.name}</td>
                      <td className="font-mono text-text-secondary">{m.due}</td>
                      <td>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                          m.status === 'Delivered' 
                            ? 'bg-accent-success/15 text-accent-success border-accent-success/25'
                            : 'bg-accent-warning/15 text-accent-warning border-accent-warning/25 animate-pulse'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="text-right font-semibold text-text-primary">{m.signoff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {subTab === 'deployments' && (
        /* Deployments sub-tab */
        <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
            Deployment Log
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 text-text-muted h-8">
                  <th className="font-semibold pb-2">Environment</th>
                  <th className="font-semibold pb-2">Version</th>
                  <th className="font-semibold pb-2">Deployed By</th>
                  <th className="font-semibold pb-2">Date Deployed</th>
                  <th className="font-semibold pb-2">CI/CD Status</th>
                  <th className="font-semibold pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {deployments.map((d, i) => (
                  <tr key={i} className="h-12 hover:bg-bg-base/30 transition-colors">
                    <td className="font-bold text-text-primary">{d.env}</td>
                    <td className="font-mono text-accent-primary font-bold">{d.version}</td>
                    <td className="font-mono text-text-secondary">{d.by}</td>
                    <td>{d.date}</td>
                    <td>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${deploymentStatusChips[d.status]}`}>
                        {d.status === 'Live' ? '✅ Live' : d.status === 'Staging' ? '🟡 Staging' : d.status}
                      </span>
                    </td>
                    <td className="text-right">
                      {d.rollback ? (
                        <button
                          onClick={() => handleRollback(d.version)}
                          className="px-2 py-1 bg-accent-danger/10 hover:bg-accent-danger/25 border border-accent-danger/20 text-accent-danger text-[10px] font-bold rounded transition-colors"
                        >
                          Rollback
                        </button>
                      ) : (
                        <span className="text-[10px] text-text-muted font-mono">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'repos' && (
        /* Repositories sub-tab */
        <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
            Linked Code Repositories
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 text-text-muted h-8">
                  <th className="font-semibold pb-2">Repository</th>
                  <th className="font-semibold pb-2 font-mono">Branch</th>
                  <th className="font-semibold pb-2 font-mono">Commit</th>
                  <th className="font-semibold pb-2 text-center">Open PRs</th>
                  <th className="font-semibold pb-2 text-center">CI Status</th>
                  <th className="font-semibold pb-2 text-right">Coverage %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {project.repos.map((repo, i) => (
                  <tr key={i} className="h-12 hover:bg-bg-base/30 transition-colors">
                    <td className="font-semibold text-text-primary flex items-center gap-1.5 h-12">
                      <Github className="w-4 h-4 text-text-muted" />
                      <a href={`#repo-${i}`} className="underline hover:text-accent-primary transition-colors">{repo.name}</a>
                    </td>
                    <td className="font-mono text-text-secondary">{repo.branch}</td>
                    <td className="font-mono text-text-muted font-semibold">{repo.commit}</td>
                    <td className="text-center font-bold text-text-primary">{repo.prs}</td>
                    <td className="text-center">
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                        repo.ci === 'Passing' ? 'bg-accent-success/15 text-accent-success' : 'bg-accent-danger/15 text-accent-danger animate-pulse'
                      }`}>
                        {repo.ci}
                      </span>
                    </td>
                    <td className="text-right font-mono font-bold text-text-primary">{repo.coverage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'qa' && (
        /* QA & Testing sub-tab */
        <div className="bg-bg-surface/50 border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-heading font-semibold text-text-primary text-xs uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary">
            QA Pipelines & Test Suites
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 text-text-muted h-8">
                  <th className="font-semibold pb-2">Suite Name</th>
                  <th className="font-semibold pb-2">Run Date</th>
                  <th className="font-semibold pb-2 text-center">Passed</th>
                  <th className="font-semibold pb-2 text-center">Failed</th>
                  <th className="font-semibold pb-2 text-center">Coverage %</th>
                  <th className="font-semibold pb-2 text-right">Report Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {project.qaRuns.map((run, i) => (
                  <tr key={i} className="h-12 hover:bg-bg-base/30 transition-colors">
                    <td className="font-bold text-text-primary">{run.suite}</td>
                    <td className="text-text-secondary">{run.date}</td>
                    <td className="text-center text-accent-success font-semibold">{run.passed}</td>
                    <td className="text-center text-accent-danger font-semibold">{run.failed}</td>
                    <td className="text-center font-mono font-semibold text-text-primary">{run.coverage}%</td>
                    <td className="text-right">
                      <button 
                        onClick={() => alert(`Opening QA HTML artifact coverage report for ${run.suite}...`)}
                        className="text-accent-primary hover:underline font-semibold flex items-center gap-1 justify-end w-full"
                      >
                        <FileText className="w-3.5 h-3.5" /> Full report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Milestone Modal */}
      {showAddMilestoneModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <form onSubmit={handleAddMilestone} className="bg-bg-surface border border-border rounded-xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-heading font-bold text-text-primary text-base">Add Milestone</h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-text-muted uppercase">Milestone Name</label>
                <input
                  type="text"
                  required
                  value={mName}
                  onChange={(e) => setMName(e.target.value)}
                  placeholder="e.g. Smart Contract Audit Signoff"
                  className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-2 focus:outline-none focus:border-accent-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-text-muted uppercase">Due Date</label>
                <input
                  type="text"
                  value={mDue}
                  onChange={(e) => setMDue(e.target.value)}
                  placeholder="e.g. Aug 10, 2026"
                  className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-2 focus:outline-none focus:border-accent-primary"
                />
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowAddMilestoneModal(false)}
                className="flex-1 h-9 bg-transparent hover:bg-bg-elevated border border-border text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-9 bg-accent-primary hover:bg-accent-primary/80 text-text-primary text-xs font-semibold rounded-lg"
              >
                Create Milestone
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default ActivityTab;
