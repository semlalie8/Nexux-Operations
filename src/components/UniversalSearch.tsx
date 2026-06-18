import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNexusStore } from '../store/nexusStore';
import { 
  Search, X, Building, Ticket as TicketIcon, Folder, 
  CreditCard, User as UserIcon, BookOpen, AlertTriangle 
} from 'lucide-react';

interface UniversalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  type: 'client' | 'ticket' | 'project' | 'invoice' | 'team' | 'article';
  categoryLabel: string;
  icon: React.ReactNode;
  label: string;
  detail: string;
  link: string;
}

export const UniversalSearch: React.FC<UniversalSearchProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { clients, tickets, projects, invoices } = useNexusStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Key listeners for shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation inside search
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        const item = results[selectedIndex];
        navigate(item.link);
        onClose();
        setQuery('');
      }
    }
  };

  // Perform search matching
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const matches: SearchResult[] = [];

    // 1. Clients
    clients.forEach(c => {
      if (c.company.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)) {
        matches.push({
          id: c.id,
          type: 'client',
          categoryLabel: '🏢 Clients',
          icon: <Building className="w-4 h-4 text-sky-400" />,
          label: c.company,
          detail: `${c.name} · ${c.city}, ${c.country}`,
          link: `/tickets/TCK-9481` // Navigates back to case page showing profile context
        });
      }
    });

    // 2. Tickets
    tickets.forEach(t => {
      if (t.id.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.projectService.toLowerCase().includes(q)) {
        matches.push({
          id: t.id,
          type: 'ticket',
          categoryLabel: '🎫 Tickets',
          icon: <TicketIcon className="w-4 h-4 text-accent-primary" />,
          label: `Case #${t.id}`,
          detail: `${t.subject} (${t.status})`,
          link: `/tickets/${t.id}`
        });
      }
    });

    // 3. Projects
    projects.forEach(p => {
      if (p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.serviceType.toLowerCase().includes(q)) {
        matches.push({
          id: p.id,
          type: 'project',
          categoryLabel: '📁 Projects',
          icon: <Folder className="w-4 h-4 text-emerald-400" />,
          label: p.name,
          detail: `${p.code} · ${p.serviceType} (${p.status})`,
          link: `/projects`
        });
      }
    });

    // 4. Invoices
    invoices.forEach(inv => {
      if (inv.id.toLowerCase().includes(q) || inv.projectName.toLowerCase().includes(q)) {
        matches.push({
          id: inv.id,
          type: 'invoice',
          categoryLabel: '💰 Invoices',
          icon: <CreditCard className="w-4 h-4 text-amber-400" />,
          label: inv.id,
          detail: `${inv.projectName} · ${inv.amount} (${inv.status})`,
          link: `/tickets/TCK-9481`
        });
      }
    });

    // 5. Team Members
    const team = [
      { name: 'Hiroshi Tanaka', role: 'Technical Lead', mail: 'h.tanaka@nexus.io' },
      { name: 'Sarah Connor', role: 'Senior Agent', mail: 's.connor@nexus.io' },
      { name: 'Sophie Martin', role: 'Finance Officer', mail: 's.martin@nexus.io' }
    ];
    team.forEach((m, idx) => {
      if (m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)) {
        matches.push({
          id: `team_${idx}`,
          type: 'team',
          categoryLabel: '👤 Team Members',
          icon: <UserIcon className="w-4 h-4 text-indigo-400" />,
          label: m.name,
          detail: m.role,
          link: `/dashboard`
        });
      }
    });

    // 6. Knowledge Articles
    const articles = [
      { title: 'Handling production deployment failures', desc: 'SOP log diagnostics' },
      { title: 'Smart contract audit — escalation workflow', desc: 'Web3 security audits' },
      { title: 'How to process a service credit request', desc: 'Accounting compensation rules' }
    ];
    articles.forEach((art, idx) => {
      if (art.title.toLowerCase().includes(q) || art.desc.toLowerCase().includes(q)) {
        matches.push({
          id: `art_${idx}`,
          type: 'article',
          categoryLabel: '📚 Knowledge Articles',
          icon: <BookOpen className="w-4 h-4 text-purple-400" />,
          label: art.title,
          detail: art.desc,
          link: `/knowledge`
        });
      }
    });

    setResults(matches);
    setSelectedIndex(0);
  }, [query, clients, tickets, projects, invoices]);

  if (!isOpen) return null;

  // Group results by categoryLabel
  const groupedResults: { [key: string]: SearchResult[] } = {};
  results.forEach(res => {
    if (!groupedResults[res.categoryLabel]) {
      groupedResults[res.categoryLabel] = [];
    }
    groupedResults[res.categoryLabel].push(res);
  });

  // Flat array list for mapping index
  const flatResultList = Object.values(groupedResults).flat();

  return (
    <div className="fixed inset-y-0 left-[60px] bg-black/50 backdrop-blur-sm z-30 flex animate-fade-in w-[calc(100vw-60px)]">
      {/* Sliding Search Overlay Panel */}
      <div 
        className="w-[280px] bg-bg-surface border-r border-border h-full flex flex-col animate-slide-in shadow-2xl"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Box */}
        <div className="p-4 border-b border-border flex items-center justify-between gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-2 pl-8 focus:outline-none focus:border-accent-primary"
            />
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-2.5 pointer-events-none" />
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-bg-elevated rounded text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Results / Help Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            /* Help Box (before search query) */
            <div className="space-y-4 select-none">
              <div className="bg-bg-elevated/40 border border-border/60 rounded-xl p-3.5 space-y-2 text-[11px] text-text-secondary leading-relaxed text-left">
                <p>
                  You can search by almost anything: client name, email address, phone number, ticket ID, project name, invoice number, contract ID, technology stack, or team member name.
                </p>
              </div>

              <div className="text-[9px] font-mono text-text-muted bg-bg-elevated/20 p-2.5 rounded-lg border border-border/40 text-left">
                Keyboard shortcuts: <br />
                <strong className="text-text-secondary">Tab or ↑↓</strong> to navigate <br />
                <strong className="text-text-secondary">Enter ↵</strong> to select <br />
                <strong className="text-text-secondary">Esc</strong> to dismiss
              </div>
            </div>
          ) : results.length === 0 ? (
            /* No Results state */
            <div className="p-8 text-center border border-dashed border-border rounded-xl bg-bg-base/20 space-y-2 select-none">
              <AlertTriangle className="w-6 h-6 text-accent-warning mx-auto" />
              <p className="text-xs font-semibold text-text-secondary">No results for "{query}"</p>
              <p className="text-[10px] text-text-muted leading-relaxed">Try a different search term or check spelling.</p>
            </div>
          ) : (
            /* Search Results grouped list */
            <div className="space-y-4">
              {Object.entries(groupedResults).map(([category, items]) => (
                <div key={category} className="space-y-1">
                  <div className="text-[9px] font-mono font-bold text-text-muted uppercase tracking-wider pl-1 select-none">
                    {category}
                  </div>
                  
                  <div className="space-y-1">
                    {items.map((item) => {
                      // Resolve index in flatResultList
                      const flatIndex = flatResultList.findIndex(f => f.id === item.id && f.type === item.type);
                      const isSelected = selectedIndex === flatIndex;
                      
                      return (
                        <div
                          key={`${item.type}_${item.id}`}
                          onClick={() => {
                            navigate(item.link);
                            onClose();
                            setQuery('');
                          }}
                          className={`p-2 rounded-lg cursor-pointer flex items-start gap-2.5 transition-all text-left ${
                            isSelected 
                              ? 'bg-accent-primary text-text-primary' 
                              : 'bg-transparent text-text-secondary hover:bg-bg-elevated/40'
                          }`}
                        >
                          <div className={`mt-0.5 flex-shrink-0 ${isSelected ? 'text-white' : 'text-text-muted'}`}>
                            {item.icon}
                          </div>
                          <div className="flex flex-col truncate leading-tight">
                            <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-text-primary'}`}>
                              {item.label}
                            </span>
                            <span className={`text-[9px] truncate mt-0.5 ${isSelected ? 'text-indigo-200' : 'text-text-muted'}`}>
                              {item.detail}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Click backdrop to close */}
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};
export default UniversalSearch;
