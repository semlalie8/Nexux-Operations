import React, { useState, useMemo } from 'react';
import { X, Lock, ExternalLink, Play, CheckCircle, Sparkles, ChevronRight, AlertTriangle, Zap, Search } from 'lucide-react';
import { useNexusStore } from '../../store/nexusStore';

interface SolutionsPanelProps {
  onClose: () => void;
}

interface Guide {
  id: string;
  name: string;
  category: string;
  tags: string[];
  steps: Array<{ title: string; desc: string; code?: string }>;
}

interface Article {
  id: string;
  title: string;
  cat: string;
  isLocked: boolean;
  desc: string;
  tags: string[];
  url?: string;
}

const ALL_GUIDES: Guide[] = [
  {
    id: 'g_1',
    name: 'Nginx 504 Gateway Timeout Debugger',
    category: 'Operations',
    tags: ['nginx', '504', 'gateway timeout', 'proxy', 'backend', 'production', 'payment', 'api'],
    steps: [
      { title: 'Step 1: Inspect Nginx Error Logs', desc: 'Access the Nginx error logs via your container orchestrator. Look for upstream timed out messages and note the upstream host + port.', code: 'sudo tail -n 200 /var/log/nginx/error.log | grep "upstream timed out"' },
      { title: 'Step 2: Monitor Database Connection Pool', desc: 'Check for stalled PostgreSQL queries. Unindexed joins during peak load can exhaust the connection pool and starve the API server.', code: 'SELECT pid, now() - query_start AS duration, query, state FROM pg_stat_activity WHERE state != \'idle\' ORDER BY duration DESC;' },
      { title: 'Step 3: Check Upstream Container CPU & Memory', desc: 'Identify CPU-bound processes. A spike above 90% CPU sustained for >30s typically indicates an infinite loop or unbounded query.', code: 'docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemPerc}}"' },
      { title: 'Step 4: Tune Nginx Timeouts', desc: 'If upstream latency is consistently high, temporarily raise proxy timeouts while you debug the root cause.', code: 'proxy_read_timeout 120s;\nproxy_connect_timeout 60s;\nproxy_send_timeout 60s;' },
      { title: 'Step 5: Restart / Scale Upstream', desc: 'Once the root cause is identified, perform a rolling restart of the affected container or scale the service horizontally.' }
    ]
  },
  {
    id: 'g_2',
    name: 'Solidity Gas Optimizer Review',
    category: 'Blockchain',
    tags: ['solidity', 'gas', 'erc20', 'staking', 'blockchain', 'smart contract', 'optimize'],
    steps: [
      { title: 'Step 1: Check Compiler Optimizer Settings', desc: 'Ensure the Solidity optimizer is enabled and set to the agreed run count in hardhat.config.ts.', code: 'optimizer: { enabled: true, runs: 200 }' },
      { title: 'Step 2: Trace Storage vs Memory Usage in Loops', desc: 'Replace all storage reads inside loops with memory variables. Each SLOAD costs 800 gas; reading from memory costs 3 gas.', code: '// Bad:\nfor (uint i = 0; i < stakers.length; i++) { ... stakers[i] ... }\n// Good:\nuint len = stakers.length;\nfor (uint i = 0; i < len; i++) { ... }' },
      { title: 'Step 3: Run Gas Reporter Tests', desc: 'Run hardhat test with gas reporter enabled and compare against baseline.', code: 'REPORT_GAS=true npx hardhat test' }
    ]
  },
  {
    id: 'g_3',
    name: 'Production Deployment Failure Recovery',
    category: 'DevOps',
    tags: ['deployment', 'docker', 'kubernetes', 'ci/cd', 'rollback', 'production'],
    steps: [
      { title: 'Step 1: Identify Failing Service', desc: 'Check which pods / containers are in CrashLoopBackOff or Error state.', code: 'kubectl get pods -n production --field-selector=status.phase!=Running' },
      { title: 'Step 2: Read Container Logs', desc: 'Tail the logs of the failing pod to identify the startup error.', code: 'kubectl logs -n production <pod-name> --previous --tail=100' },
      { title: 'Step 3: Execute Rollback', desc: 'Roll back to the last stable deployment revision.', code: 'kubectl rollout undo deployment/<deployment-name> -n production' }
    ]
  },
  {
    id: 'g_4',
    name: 'Mobile App Store Rejection Appeal',
    category: 'Mobile',
    tags: ['mobile', 'app store', 'rejection', 'apple', 'google play', 'appeal'],
    steps: [
      { title: 'Step 1: Identify Rejection Reason', desc: 'Retrieve the specific rejection codes from App Store Connect or Google Play Console.' },
      { title: 'Step 2: Prepare Appeal Documentation', desc: 'Draft a formal response with screenshots demonstrating guideline compliance.' },
      { title: 'Step 3: Submit Appeal & Monitor', desc: 'Submit through the official Resolution Center. Expected response time is 24–72 business hours.' }
    ]
  },
  {
    id: 'g_5',
    name: 'Service Credit Request Processing',
    category: 'Billing',
    tags: ['billing', 'credit', 'sla breach', 'invoice', 'refund', 'compensation'],
    steps: [
      { title: 'Step 1: Validate SLA Breach', desc: 'Confirm the breach duration and affected services against the SLA definition in the contract.' },
      { title: 'Step 2: Calculate Credit Amount', desc: 'Apply the percentage credit formula from the SLA terms to the affected billing period.' },
      { title: 'Step 3: Issue Credit Note', desc: 'Generate a credit note in the billing system and notify the Finance Officer for approval before sending to client.' }
    ]
  }
];

const ALL_ARTICLES: Article[] = [
  { id: 'art_1', title: 'Handling production deployment failures', cat: 'Operations', isLocked: true, desc: 'Diagnostic protocols for upstream container crashes and port proxy setups.', tags: ['deployment', 'production', 'nginx', 'container', 'docker'] },
  { id: 'art_2', title: 'Client data migration request process', cat: 'Database', isLocked: false, desc: 'Regulatory and SOC 2 requirements for copying production client records.', tags: ['database', 'migration', 'soc2', 'compliance', 'data'] },
  { id: 'art_3', title: 'Smart contract audit — escalation workflow', cat: 'Blockchain', isLocked: true, desc: 'Escalation paths for identified critical gas vulnerabilities and audit sign-offs.', tags: ['blockchain', 'solidity', 'audit', 'smart contract', 'gas'] },
  { id: 'art_4', title: 'Fintech regulatory compliance — EU PSD2 guide', cat: 'Compliance', isLocked: false, desc: 'Compliance guidelines for double-factor payment tokenizations.', tags: ['fintech', 'psd2', 'compliance', 'payments', 'eu', 'regulation'] },
  { id: 'art_5', title: 'How to process a service credit request', cat: 'Billing', isLocked: false, desc: 'Financial adjusters validation for SLA breach compensation.', tags: ['billing', 'sla', 'credit', 'invoice', 'refund'] },
  { id: 'art_6', title: 'Mobile app store rejection — appeal process', cat: 'Mobile', isLocked: false, desc: 'Guidelines for Store guidelines appeals and sandbox permissions verification.', tags: ['mobile', 'app store', 'rejection', 'apple', 'android'] }
];

const PUBLIC_ARTICLES = [
  { id: 'pub_1', title: 'How to access your project dashboard', url: '#', tags: ['portal', 'dashboard', 'project'] },
  { id: 'pub_2', title: 'Understanding your invoice', url: '#', tags: ['billing', 'invoice', 'payment'] },
  { id: 'pub_3', title: 'Our SLA policy', url: '#', tags: ['sla', 'policy', 'support'] },
  { id: 'pub_4', title: 'API rate limiting & quota guide', url: '#', tags: ['api', 'rate limit', 'quota'] }
];

function computeMatchScore(text: string, tags: string[]): number {
  const words = text.toLowerCase().split(/[\s,.:_\-/]+/).filter(w => w.length > 2);
  let score = 0;
  for (const tag of tags) {
    for (const word of words) {
      if (tag.includes(word) || word.includes(tag)) {
        score += tag === word ? 3 : 1;
      }
    }
  }
  return score;
}

export const SolutionsPanel: React.FC<SolutionsPanelProps> = ({ onClose }) => {
  const { tickets, activeTicketId } = useNexusStore();
  const [activeGuide, setActiveGuide] = useState<string | null>(null);
  const [guideStep, setGuideStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ai' | 'guides' | 'articles'>('ai');

  const activeTicket = tickets.find(t => t.id === activeTicketId);

  // AI-matching: build context from active ticket
  const ticketContext = useMemo(() => {
    if (!activeTicket) return '';
    return [
      activeTicket.subject,
      activeTicket.projectService,
      activeTicket.projectName,
      activeTicket.messages.map(m => m.content).join(' '),
      activeTicket.lastMessage
    ].join(' ');
  }, [activeTicket]);

  const matchedGuides = useMemo(() => {
    const scored = ALL_GUIDES.map(g => ({
      ...g,
      score: computeMatchScore(ticketContext, g.tags)
    })).filter(g => g.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
    return scored;
  }, [ticketContext]);

  const matchedArticles = useMemo(() => {
    const scored = ALL_ARTICLES.map(a => ({
      ...a,
      score: computeMatchScore(ticketContext, a.tags)
    })).filter(a => a.score > 0).sort((a, b) => b.score - a.score).slice(0, 4);
    return scored;
  }, [ticketContext]);

  const confidenceLabel = (score: number) => {
    if (score >= 6) return { label: 'High match', color: 'text-accent-success', bg: 'bg-accent-success/10 border-accent-success/30' };
    if (score >= 3) return { label: 'Likely match', color: 'text-accent-warning', bg: 'bg-accent-warning/10 border-accent-warning/30' };
    return { label: 'Possible match', color: 'text-text-muted', bg: 'bg-bg-elevated/40 border-border/40' };
  };

  const searchFiltered = (query: string) => {
    const q = query.toLowerCase();
    return {
      guides: ALL_GUIDES.filter(g => g.name.toLowerCase().includes(q) || g.tags.some(t => t.includes(q))),
      articles: ALL_ARTICLES.filter(a => a.title.toLowerCase().includes(q) || a.tags.some(t => t.includes(q)))
    };
  };

  const activeGuideData = activeGuide ? ALL_GUIDES.find(g => g.id === activeGuide) : null;

  const handleStartGuide = (guideId: string) => {
    setActiveGuide(guideId);
    setGuideStep(0);
    setCompletedSteps(new Set());
  };

  const markCurrentDone = () => {
    setCompletedSteps(prev => new Set([...prev, guideStep]));
  };

  const nextStep = () => {
    if (!activeGuideData) return;
    markCurrentDone();
    if (guideStep < activeGuideData.steps.length - 1) {
      setGuideStep(guideStep + 1);
    } else {
      // All done
      alert(`✅ Runbook "${activeGuideData.name}" completed. All steps checked. Resolution checklist satisfied.`);
      setActiveGuide(null);
      setCompletedSteps(new Set());
    }
  };

  const { guides: searchGuides, articles: searchArticles } = searchQuery ? searchFiltered(searchQuery) : { guides: [], articles: [] };

  return (
    <div className="flex flex-col h-full bg-bg-surface border-l border-border w-[360px] animate-slide-in relative">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between gap-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-primary" />
          <h2 className="text-sm font-bold font-heading text-text-primary">Solutions</h2>
          {activeTicket && (
            <span className="text-[9px] font-mono bg-accent-primary/15 text-accent-primary border border-accent-primary/25 px-1.5 py-0.5 rounded">
              AI-matched · {activeTicketId}
            </span>
          )}
        </div>
        <button onClick={onClose} className="p-1 hover:bg-bg-elevated rounded text-text-muted hover:text-text-primary transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0 relative">
        <Search className="w-3.5 h-3.5 text-text-muted absolute left-7 top-[22px]" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search guides and articles…"
          className="w-full bg-bg-elevated/60 border border-border/60 rounded-lg text-xs text-text-primary pl-8 pr-3 py-2 focus:outline-none focus:border-accent-primary/60 placeholder-text-muted/60 transition-colors"
        />
      </div>

      {/* Tabs */}
      {!searchQuery && (
        <div className="flex gap-1 px-4 pb-2 flex-shrink-0">
          {(['ai', 'guides', 'articles'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-accent-primary/15 text-accent-primary border border-accent-primary/30'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated/40'
              }`}
            >
              {tab === 'ai' ? '✨ AI Suggested' : tab === 'guides' ? '📖 All Guides' : '📄 Articles'}
            </button>
          ))}
        </div>
      )}

      {/* Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">

        {/* SEARCH RESULTS */}
        {searchQuery && (
          <>
            {searchGuides.length > 0 && (
              <Section label="Runbook Guides">
                {searchGuides.map(g => (
                  <GuideCard key={g.id} guide={g} onStart={handleStartGuide} confidence={null} />
                ))}
              </Section>
            )}
            {searchArticles.length > 0 && (
              <Section label="Knowledge Articles">
                {searchArticles.map(a => (
                  <ArticleRow key={a.id} article={a} />
                ))}
              </Section>
            )}
            {searchGuides.length === 0 && searchArticles.length === 0 && (
              <div className="text-center py-10 space-y-1.5">
                <Search className="w-5 h-5 text-text-muted mx-auto" />
                <p className="text-xs text-text-muted">No results for "{searchQuery}"</p>
              </div>
            )}
          </>
        )}

        {/* AI TAB */}
        {!searchQuery && activeTab === 'ai' && (
          <>
            {activeTicket ? (
              <>
                {/* Context card */}
                <div className="bg-accent-primary/8 border border-accent-primary/20 rounded-xl p-3 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-accent-primary" />
                    <span className="text-[10px] font-semibold text-accent-primary uppercase tracking-wider">AI Context Analysis</span>
                  </div>
                  <p className="text-[10px] text-text-secondary leading-relaxed">
                    Analysing <span className="font-semibold text-text-primary">{activeTicketId}</span> — {activeTicket.projectService} · {activeTicket.projectName}. Surfacing relevant runbooks and articles.
                  </p>
                </div>

                {matchedGuides.length > 0 && (
                  <Section label="Recommended Runbooks">
                    {matchedGuides.map(g => (
                      <GuideCard key={g.id} guide={g} onStart={handleStartGuide} confidence={confidenceLabel(g.score)} />
                    ))}
                  </Section>
                )}

                {matchedArticles.length > 0 && (
                  <Section label="Matched Knowledge Articles">
                    {matchedArticles.map(a => (
                      <ArticleRow key={a.id} article={a} confidence={confidenceLabel(a.score)} />
                    ))}
                  </Section>
                )}

                <Section label="Public Help Center">
                  {PUBLIC_ARTICLES.map(p => (
                    <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-border/10 last:border-0">
                      <span className="text-xs text-text-secondary truncate pr-3">{p.title}</span>
                      <ExternalLink className="w-3 h-3 text-text-muted cursor-pointer hover:text-text-primary flex-shrink-0" />
                    </div>
                  ))}
                </Section>
              </>
            ) : (
              <div className="text-center py-10 space-y-2">
                <AlertTriangle className="w-6 h-6 text-text-muted mx-auto" />
                <p className="text-xs text-text-muted">Open a ticket to activate AI-matching</p>
              </div>
            )}
          </>
        )}

        {/* ALL GUIDES TAB */}
        {!searchQuery && activeTab === 'guides' && (
          <Section label="All Runbook Guides">
            {ALL_GUIDES.map(g => (
              <GuideCard key={g.id} guide={g} onStart={handleStartGuide} confidence={null} />
            ))}
          </Section>
        )}

        {/* ARTICLES TAB */}
        {!searchQuery && activeTab === 'articles' && (
          <>
            <Section label="Internal Knowledge Articles">
              {ALL_ARTICLES.map(a => (
                <ArticleRow key={a.id} article={a} />
              ))}
            </Section>
            <Section label="Public Help Center">
              {PUBLIC_ARTICLES.map(p => (
                <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-border/10 last:border-0">
                  <span className="text-xs text-text-secondary truncate pr-3">{p.title}</span>
                  <ExternalLink className="w-3 h-3 text-text-muted cursor-pointer hover:text-text-primary flex-shrink-0" />
                </div>
              ))}
            </Section>
          </>
        )}
      </div>

      {/* GUIDE OVERLAY */}
      {activeGuide && activeGuideData && (
        <div className="absolute inset-0 bg-bg-base/97 z-20 flex flex-col">
          {/* Guide header */}
          <div className="p-4 border-b border-border/40 flex-shrink-0">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="w-3 h-3 text-accent-primary" />
                  <span className="text-[10px] font-semibold text-accent-primary uppercase tracking-wider">Runbook Assistant</span>
                </div>
                <h4 className="text-sm font-bold text-text-primary leading-tight">{activeGuideData.name}</h4>
              </div>
              <button onClick={() => setActiveGuide(null)} className="text-text-muted hover:text-text-primary text-xs border border-border/40 px-2 py-0.5 rounded hover:bg-bg-elevated/40 transition-colors">
                Exit
              </button>
            </div>

            {/* Progress bar */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1 bg-bg-elevated rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-primary transition-all duration-500 rounded-full"
                  style={{ width: `${((guideStep + 1) / activeGuideData.steps.length) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-text-muted whitespace-nowrap">
                {guideStep + 1} / {activeGuideData.steps.length}
              </span>
            </div>

            {/* Step pills */}
            <div className="flex gap-1 mt-2 flex-wrap">
              {activeGuideData.steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-1.5 rounded-full transition-colors ${
                    completedSteps.has(i)
                      ? 'bg-accent-success'
                      : i === guideStep
                      ? 'bg-accent-primary'
                      : 'bg-bg-elevated'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="space-y-2">
              <h5 className="text-sm font-bold text-text-primary">{activeGuideData.steps[guideStep].title}</h5>
              <p className="text-xs text-text-secondary leading-relaxed">{activeGuideData.steps[guideStep].desc}</p>
            </div>

            {activeGuideData.steps[guideStep].code && (
              <div className="bg-bg-elevated rounded-lg border border-border/40 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/30 bg-bg-elevated/80">
                  <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider">Command / Code</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(activeGuideData.steps[guideStep].code!)}
                    className="text-[9px] text-accent-primary hover:underline"
                  >
                    Copy
                  </button>
                </div>
                <pre className="text-[10px] font-mono text-text-primary p-3 leading-relaxed whitespace-pre-wrap break-all">
                  {activeGuideData.steps[guideStep].code}
                </pre>
              </div>
            )}

            {/* Mark done */}
            <button
              onClick={markCurrentDone}
              className={`flex items-center gap-2 text-xs font-semibold rounded-lg px-3 py-2 border transition-all w-full ${
                completedSteps.has(guideStep)
                  ? 'border-accent-success/40 text-accent-success bg-accent-success/10'
                  : 'border-border/40 text-text-muted hover:text-text-primary hover:border-border'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {completedSteps.has(guideStep) ? 'Step completed ✓' : 'Mark step as done'}
            </button>
          </div>

          {/* Footer nav */}
          <div className="p-4 border-t border-border/40 flex-shrink-0 flex items-center justify-between gap-3">
            <button
              disabled={guideStep === 0}
              onClick={() => setGuideStep(s => s - 1)}
              className="px-3 py-1.5 border border-border/40 rounded-lg text-xs text-text-muted hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={nextStep}
              className="flex-1 px-3 py-2 bg-accent-primary hover:bg-accent-primary/85 transition-colors text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5"
            >
              {guideStep === activeGuideData.steps.length - 1 ? (
                <><CheckCircle className="w-3.5 h-3.5" /> Finish Guide</>
              ) : (
                <>Next Step <ChevronRight className="w-3.5 h-3.5" /></>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Sub-components ────────────────────────────────────────────────────────────
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-[10px] font-mono font-semibold text-text-muted uppercase tracking-wider pl-1.5 border-l-2 border-accent-primary/60">
        {label}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function GuideCard({ guide, onStart, confidence }: {
  guide: Guide & { score?: number };
  onStart: (id: string) => void;
  confidence: { label: string; color: string; bg: string } | null;
}) {
  return (
    <div className={`border rounded-xl p-3 flex flex-col gap-2 transition-colors hover:border-accent-primary/30 ${confidence ? confidence.bg : 'bg-bg-elevated/30 border-border/50'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <span className="text-xs text-text-primary font-semibold leading-tight">{guide.name}</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[9px] font-mono text-text-muted bg-bg-elevated px-1.5 py-0.5 rounded">{guide.category}</span>
            {confidence && (
              <span className={`text-[9px] font-semibold ${confidence.color}`}>{confidence.label}</span>
            )}
          </div>
        </div>
        <button
          onClick={() => onStart(guide.id)}
          className="px-2.5 py-1 bg-transparent hover:bg-accent-primary/15 border border-accent-primary text-accent-primary text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1 flex-shrink-0"
        >
          <Play className="w-2.5 h-2.5 fill-accent-primary" /> Start
        </button>
      </div>
    </div>
  );
}

function ArticleRow({ article, confidence }: {
  article: Article & { score?: number };
  confidence?: { label: string; color: string; bg: string } | null;
}) {
  return (
    <div className={`flex items-start justify-between py-2 px-2 rounded-lg border transition-colors hover:border-border/60 ${confidence ? confidence.bg : 'border-transparent'}`}>
      <div className="flex-1 min-w-0 pr-3">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[9px] font-mono text-text-muted bg-bg-elevated px-1.5 py-0.5 rounded">{article.cat}</span>
          {confidence && <span className={`text-[9px] font-semibold ${confidence.color}`}>{confidence.label}</span>}
        </div>
        <a href={`#${article.id}`} className="text-xs font-medium text-text-secondary hover:text-accent-primary truncate block transition-colors">
          {article.title}
        </a>
      </div>
      {article.isLocked && <Lock className="w-3 h-3 text-text-muted flex-shrink-0 mt-1" />}
    </div>
  );
}

export default SolutionsPanel;
