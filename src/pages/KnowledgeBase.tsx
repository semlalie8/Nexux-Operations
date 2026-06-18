import React, { useState, useMemo } from 'react';
import { useNexusStore } from '../store/nexusStore';
import {
  BookOpen, Search, Lock, HelpCircle, Plus, Edit2, Trash2,
  X, Eye, Clock, ChevronRight, Shield, Globe, AlertTriangle, Save, ArrowLeft
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  cat: string;
  isLocked: boolean;
  desc: string;
  tags: string[];
  body: string;
  author: string;
  authorAvatar: string;
  updatedAt: string;
  views: number;
}

const CATEGORIES = ['All', 'Operations', 'Database', 'Blockchain', 'Compliance', 'Billing', 'Mobile', 'API', 'Security'];

const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art_1',
    title: 'Handling production deployment failures',
    cat: 'Operations',
    isLocked: true,
    desc: 'Diagnostic protocols for upstream container crashes and port proxy setups.',
    tags: ['deployment', 'nginx', 'docker', 'production'],
    body: `## Overview

Production deployment failures require a systematic diagnostic approach. This runbook covers the most common failure modes and their remediation steps.

## Step 1: Verify Deployment Status

Check the deployment history in your CI/CD system and identify which version was deployed:

\`\`\`bash
kubectl rollout history deployment/api-gateway -n production
\`\`\`

## Step 2: Examine Container Logs

Pull the logs from the failing pod(s):

\`\`\`bash
kubectl logs -n production <pod-name> --previous --tail=200
\`\`\`

## Step 3: Rollback if Necessary

If the failure is confirmed and cannot be hotfixed within 15 minutes, initiate a rollback:

\`\`\`bash
kubectl rollout undo deployment/api-gateway -n production
\`\`\`

## Escalation Path

If rollback does not restore service, escalate to the Technical Lead on-call immediately via the Nexus Emergency Channel.`,
    author: 'Hiroshi Tanaka',
    authorAvatar: '3.png',
    updatedAt: '3 days ago',
    views: 142
  },
  {
    id: 'art_2',
    title: 'Client data migration request process',
    cat: 'Database',
    isLocked: false,
    desc: 'Regulatory and SOC 2 requirements for copying production client records.',
    tags: ['database', 'migration', 'soc2', 'gdpr'],
    body: `## Overview

Client data migrations must comply with GDPR and our SOC 2 Type II controls. This document outlines the required approval and documentation workflow.

## Prerequisites

- Signed data processing agreement (DPA) from client
- Written authorisation from client DPO or legal counsel  
- Internal sign-off from Security & Compliance team

## Process Steps

1. Raise a Data Migration Request ticket in Nexus
2. Attach client authorisation documents
3. Get Security Lead sign-off
4. Schedule migration in the maintenance window
5. Complete post-migration integrity checks
6. Issue a migration completion certificate to the client

## Compliance Notes

All data transferred must be logged in the audit trail. Retention policies must be respected for both source and target environments.`,
    author: 'Sophie Martin',
    authorAvatar: '4.png',
    updatedAt: '1 week ago',
    views: 89
  },
  {
    id: 'art_3',
    title: 'Smart contract audit — escalation workflow',
    cat: 'Blockchain',
    isLocked: true,
    desc: 'Escalation paths for identified critical gas vulnerabilities and audit sign-offs.',
    tags: ['blockchain', 'solidity', 'audit', 'gas'],
    body: `## Overview

When a critical gas vulnerability is identified during smart contract development or third-party audit, this workflow defines the escalation and communication steps.

## Severity Levels

- **Critical**: Potential fund drain or reentrancy attack — stop all deployments immediately
- **High**: Excess gas causing failed transactions under congestion
- **Medium**: Gas optimization opportunity with no security risk

## Escalation Steps

1. Developer flags issue in the project repository with tag \`[AUDIT-CRITICAL]\`
2. Technical Lead is notified within 15 minutes
3. Deployment to testnet/mainnet is frozen
4. Internal audit review call is scheduled within 2 hours
5. Client is notified of timeline impact

## Documentation Required

All critical findings must be documented in the security audit log with proposed mitigation and estimated timeline.`,
    author: 'Alex Rivera',
    authorAvatar: '2.png',
    updatedAt: '5 days ago',
    views: 67
  },
  {
    id: 'art_4',
    title: 'Fintech regulatory compliance — EU PSD2 guide',
    cat: 'Compliance',
    isLocked: false,
    desc: 'Compliance guidelines for double-factor payment tokenizations under PSD2.',
    tags: ['psd2', 'fintech', 'compliance', 'eu', 'payments', 'sca'],
    body: `## EU PSD2 Compliance Overview

The Payment Services Directive 2 (PSD2) mandates Strong Customer Authentication (SCA) for all electronic payments within the EU. All fintech products we build for EU clients must adhere to these standards.

## Key Requirements

### Strong Customer Authentication (SCA)
At least 2 of the following 3 factors must be used:
- Something the user **knows** (PIN, password)
- Something the user **has** (phone, token)
- Something the user **is** (biometric)

### Transaction Monitoring
All payment transactions must be logged with IP address, device fingerprint, and geolocation for fraud monitoring.

## Implementation Checklist

- [ ] OAuth 2.0 flows with 3DS2 integration
- [ ] Token-based authentication with short expiry  
- [ ] Fraud detection scoring on every transaction
- [ ] Regulatory reporting API to EBA
- [ ] Incident response plan for payment failures`,
    author: 'Sarah Connor',
    authorAvatar: '5.png',
    updatedAt: '2 weeks ago',
    views: 203
  },
  {
    id: 'art_5',
    title: 'How to process a service credit request',
    cat: 'Billing',
    isLocked: false,
    desc: 'Financial adjusters validation for SLA breach compensation credit notes.',
    tags: ['billing', 'sla', 'credit', 'invoice', 'refund'],
    body: `## Service Credit Request Process

When an SLA breach is confirmed, affected clients may be entitled to service credits as per their contract terms.

## Validation Steps

1. **Confirm breach**: Pull SLA compliance report from Nexus Reports → SLA tab
2. **Check contract terms**: Navigate to the client's Contract tab to review their specific credit entitlement percentages
3. **Calculate credit amount**: Apply the percentage to the affected billing period's invoice value
4. **Get Finance Officer approval**: Requests above €5,000 require dual sign-off
5. **Issue credit note**: Generate in billing system and attach to the client's account

## Credit Tiers (Default SLA)

| Downtime | Credit |
|----------|--------|
| 99.5–99.9% | 5% |
| 99.0–99.5% | 10% |
| <99.0% | 25% |

## Notes

Credit notes must be issued within 30 days of the breach date.`,
    author: 'Sophie Martin',
    authorAvatar: '4.png',
    updatedAt: '4 days ago',
    views: 55
  },
  {
    id: 'art_6',
    title: 'Mobile app store rejection — appeal process',
    cat: 'Mobile',
    isLocked: false,
    desc: 'Guidelines for Store guidelines appeals and sandbox permissions verification.',
    tags: ['mobile', 'app store', 'rejection', 'apple', 'android'],
    body: `## App Store Rejection Appeal Guide

App store rejections are common and most can be resolved by addressing the specific guideline cited in the rejection notice.

## Apple App Store

1. Login to **App Store Connect** and navigate to the Resolution Center
2. Read the rejection reason carefully — note the specific guideline number (e.g., 2.1, 4.3)
3. Address the issue in your build or prepare a written response
4. Submit your response or updated build through Resolution Center
5. Track the review — expect a response in 24–72 hours

## Google Play

1. Check the **Policy Manager** in Play Console for the specific violation
2. Fix or appeal within 30 days of the rejection
3. Use the **App Content** section to declare sensitive permissions properly

## Common Rejection Reasons

- **Guideline 2.1**: App crashes or has bugs — fix before resubmission
- **Guideline 4.3**: Duplicate app — ensure your app has unique functionality  
- **Guideline 5.1.1**: Privacy policy missing or incomplete`,
    author: 'Sarah Connor',
    authorAvatar: '5.png',
    updatedAt: '1 week ago',
    views: 78
  }
];

const BLANK_ARTICLE: Omit<Article, 'id' | 'views' | 'updatedAt' | 'author' | 'authorAvatar'> = {
  title: '',
  cat: 'Operations',
  isLocked: false,
  desc: '',
  tags: [],
  body: ''
};

type Mode = 'list' | 'view' | 'create' | 'edit';

export const KnowledgeBase: React.FC = () => {
  const { user } = useNexusStore();
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [mode, setMode] = useState<Mode>('list');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Article>>({});
  const [tagInput, setTagInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const canEdit = ['Administrator', 'Senior Agent', 'Technical Lead', 'Project Manager'].includes(user.role);
  const canAccessLocked = ['Administrator', 'Senior Agent', 'Technical Lead'].includes(user.role);

  const filtered = useMemo(() => {
    return articles.filter(art => {
      const matchesCat = selectedCat === 'All' || art.cat === selectedCat;
      const matchesSearch = !searchQuery ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.cat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        art.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [articles, searchQuery, selectedCat]);

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    articles.forEach(a => { counts[a.cat] = (counts[a.cat] || 0) + 1; });
    return counts;
  }, [articles]);

  const openView = (art: Article) => {
    setSelectedArticle(art);
    setArticles(prev => prev.map(a => a.id === art.id ? { ...a, views: a.views + 1 } : a));
    setMode('view');
  };

  const openCreate = () => {
    setEditDraft({ ...BLANK_ARTICLE });
    setTagInput('');
    setMode('create');
  };

  const openEdit = (art: Article) => {
    setEditDraft({ ...art });
    setTagInput('');
    setMode('edit');
  };

  const handleSave = () => {
    if (!editDraft.title?.trim()) return;
    if (mode === 'create') {
      const newArt: Article = {
        ...BLANK_ARTICLE,
        ...editDraft,
        id: `art_${Date.now()}`,
        author: user.name,
        authorAvatar: user.avatar,
        updatedAt: 'Just now',
        views: 0
      } as Article;
      setArticles(prev => [newArt, ...prev]);
      setSelectedArticle(newArt);
      setMode('view');
    } else if (mode === 'edit' && editDraft.id) {
      setArticles(prev => prev.map(a => a.id === editDraft.id ? { ...a, ...editDraft, updatedAt: 'Just now' } : a));
      const updated = { ...(articles.find(a => a.id === editDraft.id)!), ...editDraft, updatedAt: 'Just now' };
      setSelectedArticle(updated);
      setMode('view');
    }
  };

  const handleDelete = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
    setDeleteConfirm(null);
    setMode('list');
    setSelectedArticle(null);
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !(editDraft.tags || []).includes(tag)) {
      setEditDraft(d => ({ ...d, tags: [...(d.tags || []), tag] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setEditDraft(d => ({ ...d, tags: (d.tags || []).filter(t => t !== tag) }));
  };

  // ── Article Viewer ──────────────────────────────────────────────────────────
  if (mode === 'view' && selectedArticle) {
    const art = articles.find(a => a.id === selectedArticle.id) || selectedArticle;
    const isLocked = art.isLocked && !canAccessLocked;
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <button onClick={() => setMode('list')} className="hover:text-text-primary flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Knowledge Base
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-text-secondary">{art.cat}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-text-primary font-medium truncate max-w-xs">{art.title}</span>
        </div>

        <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
          {/* Article header */}
          <div className="p-6 border-b border-border/40 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[10px] bg-bg-elevated border border-border px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider text-text-muted">
                    {art.cat}
                  </span>
                  {art.isLocked && (
                    <span className="flex items-center gap-1 text-accent-danger font-semibold font-mono text-[9px] uppercase">
                      <Lock className="w-3 h-3" /> Restricted
                    </span>
                  )}
                  {art.tags.map(tag => (
                    <span key={tag} className="text-[9px] bg-accent-primary/10 text-accent-primary border border-accent-primary/20 px-1.5 py-0.5 rounded font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="font-heading font-extrabold text-text-primary text-2xl leading-tight">{art.title}</h1>
                <p className="text-text-secondary text-sm mt-2 leading-relaxed">{art.desc}</p>
              </div>
              {canEdit && (
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(art)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-text-secondary hover:text-text-primary hover:border-border/80 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(art.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-accent-danger/40 rounded-lg text-xs text-accent-danger hover:bg-accent-danger/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-[10px] text-text-muted font-mono">
              <span className="flex items-center gap-1">
                <img src={`/${art.authorAvatar}`} className="w-4 h-4 rounded-full object-cover" alt="" />
                {art.author}
              </span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated {art.updatedAt}</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {art.views} views</span>
            </div>
          </div>

          {/* Body */}
          {isLocked ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-accent-danger/10 border border-accent-danger/30 flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-accent-danger" />
              </div>
              <h3 className="font-heading font-bold text-text-primary">Restricted Access</h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                This article is restricted to Senior Agent level and above. Contact your administrator to request access.
              </p>
            </div>
          ) : (
            <div className="p-6 prose-sm max-w-none">
              <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap font-mono bg-bg-base/30 rounded-xl p-5 border border-border/30">
                {art.body}
              </div>
            </div>
          )}
        </div>

        {/* Delete confirm modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-bg-surface border border-border rounded-2xl p-6 w-full max-w-sm space-y-4">
              <div className="flex items-center gap-2 text-accent-danger">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-heading font-bold text-text-primary">Delete Article?</h3>
              </div>
              <p className="text-xs text-text-secondary">Are you sure you want to permanently delete "<strong>{art.title}</strong>"? This cannot be undone.</p>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-3 py-2 border border-border rounded-lg text-xs text-text-secondary hover:text-text-primary transition-colors">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-3 py-2 bg-accent-danger text-white rounded-lg text-xs font-semibold hover:bg-accent-danger/85 transition-colors">
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Article Editor ──────────────────────────────────────────────────────────
  if (mode === 'create' || mode === 'edit') {
    return (
      <div className="space-y-6 animate-fade-in max-w-3xl">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setMode(mode === 'edit' && selectedArticle ? 'view' : 'list')} className="text-text-muted hover:text-text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-heading font-extrabold text-text-primary">
              {mode === 'create' ? 'New Article' : 'Edit Article'}
            </h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setMode(mode === 'edit' && selectedArticle ? 'view' : 'list')} className="px-3 py-1.5 border border-border rounded-lg text-xs text-text-secondary hover:text-text-primary transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!editDraft.title?.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-accent-primary text-white rounded-lg text-xs font-semibold hover:bg-accent-primary/85 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-3.5 h-3.5" /> {mode === 'create' ? 'Publish' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1.5 block">Article Title *</label>
            <input
              value={editDraft.title || ''}
              onChange={e => setEditDraft(d => ({ ...d, title: e.target.value }))}
              placeholder="Enter article title…"
              className="w-full bg-bg-surface border border-border rounded-xl text-sm text-text-primary px-4 py-3 focus:outline-none focus:border-accent-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1.5 block">Category</label>
              <select
                value={editDraft.cat || 'Operations'}
                onChange={e => setEditDraft(d => ({ ...d, cat: e.target.value }))}
                className="w-full bg-bg-surface border border-border rounded-xl text-xs text-text-primary px-4 py-2.5 focus:outline-none focus:border-accent-primary transition-colors"
              >
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1.5 block">Access</label>
              <div className="flex gap-2">
                {[false, true].map(locked => (
                  <button
                    key={String(locked)}
                    onClick={() => setEditDraft(d => ({ ...d, isLocked: locked }))}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      editDraft.isLocked === locked
                        ? locked ? 'border-accent-danger/50 bg-accent-danger/10 text-accent-danger' : 'border-accent-success/50 bg-accent-success/10 text-accent-success'
                        : 'border-border text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {locked ? <><Lock className="w-3.5 h-3.5" /> Restricted</> : <><Globe className="w-3.5 h-3.5" /> Internal</>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1.5 block">Summary / Description</label>
            <textarea
              value={editDraft.desc || ''}
              onChange={e => setEditDraft(d => ({ ...d, desc: e.target.value }))}
              placeholder="Brief description shown on the article card…"
              rows={2}
              className="w-full bg-bg-surface border border-border rounded-xl text-xs text-text-primary px-4 py-3 focus:outline-none focus:border-accent-primary resize-none transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1.5 block">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(editDraft.tags || []).map(tag => (
                <span key={tag} className="flex items-center gap-1 text-[10px] bg-accent-primary/10 text-accent-primary border border-accent-primary/25 px-2 py-0.5 rounded-full font-mono">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-accent-danger transition-colors"><X className="w-2.5 h-2.5" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag and press Enter…"
                className="flex-1 bg-bg-surface border border-border rounded-xl text-xs text-text-primary px-4 py-2 focus:outline-none focus:border-accent-primary transition-colors"
              />
              <button onClick={addTag} className="px-3 py-2 border border-border rounded-xl text-xs text-text-muted hover:text-text-primary transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-1.5 block">Article Body (Markdown supported)</label>
            <textarea
              value={editDraft.body || ''}
              onChange={e => setEditDraft(d => ({ ...d, body: e.target.value }))}
              placeholder="Write your article content here. Markdown formatting is supported…"
              rows={18}
              className="w-full bg-bg-surface border border-border rounded-xl text-xs text-text-primary px-4 py-3 focus:outline-none focus:border-accent-primary resize-none font-mono leading-relaxed transition-colors"
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Article List ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight text-text-primary flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-accent-primary" />
            Knowledge Base
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Browse internal operational procedures, runbooks, and compliance guides.
          </p>
        </div>
        {canEdit && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-accent-primary hover:bg-accent-primary/85 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> New Article
          </button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 flex-shrink-0 space-y-1">
          <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2 pl-2">Categories</div>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                selectedCat === cat
                  ? 'bg-accent-primary/15 text-accent-primary border border-accent-primary/30'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
              }`}
            >
              <span>{cat}</span>
              {cat !== 'All' && catCounts[cat] && (
                <span className={`text-[9px] font-mono ${selectedCat === cat ? 'text-accent-primary' : 'text-text-muted'}`}>
                  {catCounts[cat]}
                </span>
              )}
              {cat === 'All' && (
                <span className={`text-[9px] font-mono ${selectedCat === cat ? 'text-accent-primary' : 'text-text-muted'}`}>
                  {articles.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search articles, runbooks, or tags…"
              className="w-full bg-bg-surface border border-border rounded-xl text-xs text-text-primary px-4 py-3 pl-10 focus:outline-none focus:border-accent-primary shadow-sm transition-colors"
            />
            <Search className="w-4 h-4 text-text-muted absolute left-4 top-3.5 pointer-events-none" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-text-muted hover:text-text-primary transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Stats bar */}
          <div className="text-[10px] text-text-muted font-mono">
            Showing <span className="text-text-primary font-semibold">{filtered.length}</span> of {articles.length} articles
            {selectedCat !== 'All' && <span> · filtered by <span className="text-accent-primary">{selectedCat}</span></span>}
          </div>

          {/* Articles grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(art => (
              <div
                key={art.id}
                className="bg-bg-surface border border-border rounded-xl p-5 hover:border-accent-primary/40 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] bg-bg-elevated/80 border border-border px-2 py-0.5 rounded text-text-muted font-mono font-bold uppercase tracking-wider">
                      {art.cat}
                    </span>
                    {art.isLocked && (
                      <span className="flex items-center gap-1 text-accent-danger font-semibold font-mono text-[9px] uppercase">
                        <Lock className="w-3 h-3" /> Restricted
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading font-bold text-text-primary text-sm group-hover:text-accent-primary transition-colors leading-tight">
                    {art.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{art.desc}</p>

                  {art.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {art.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[9px] bg-bg-elevated/60 text-text-muted border border-border/50 px-1.5 py-0.5 rounded font-mono">
                          {tag}
                        </span>
                      ))}
                      {art.tags.length > 3 && (
                        <span className="text-[9px] text-text-muted font-mono">+{art.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-border/20 mt-4">
                  <div className="flex items-center gap-3 text-[10px] text-text-muted font-mono">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{art.updatedAt}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{art.views}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {canEdit && (
                      <button
                        onClick={() => openEdit(art)}
                        className="text-text-muted hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => openView(art)}
                      className="text-accent-primary hover:underline font-bold text-[10px]"
                    >
                      Read Article →
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="p-8 text-center border border-dashed border-border rounded-xl bg-bg-base/20 md:col-span-2 space-y-1.5 select-none">
                <HelpCircle className="w-6 h-6 text-text-muted mx-auto" />
                <p className="text-xs font-semibold text-text-secondary">No articles found</p>
                <p className="text-[10px] text-text-muted">Try a different search query or category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
