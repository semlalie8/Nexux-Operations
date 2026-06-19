import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, ArrowLeft, Inbox as InboxIcon, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useNexusStore, Ticket } from '../store/nexusStore';

interface InboxProps {
  standalone?: boolean;
  onClose?: () => void;
}

export const Inbox: React.FC<InboxProps> = ({ standalone = true, onClose }) => {
  const navigate = useNavigate();
  const { tickets, setActiveTicket } = useNexusStore();
  const [activeTab, setActiveTab] = useState<'open' | 'pending'>('open');

  const handleTicketClick = (ticketId: string) => {
    setActiveTicket(ticketId);
    navigate(`/tickets/${ticketId}`);
    if (onClose) onClose();
  };

  // Filter Open tickets
  const openTickets = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress');
  // Needs your response: last message is from client (e.g. Marie Dubois or Liam O'Connor, not Sarah Connor)
  const needsResponse = openTickets.filter(t => {
    const lastMsg = t.messages[t.messages.length - 1];
    return lastMsg ? !lastMsg.isInternal && lastMsg.sender !== 'Sarah Connor' : true;
  });
  
  const waitingOnClient = openTickets.filter(t => {
    const lastMsg = t.messages[t.messages.length - 1];
    return lastMsg ? lastMsg.isInternal || lastMsg.sender === 'Sarah Connor' : false;
  });

  // Filter Pending tickets
  const pendingTickets = tickets.filter(t => t.status === 'Pending Review');

  const priorityColors = {
    Urgent: 'bg-accent-danger/10 text-accent-danger border-accent-danger/20',
    High: 'bg-accent-warning/10 text-accent-warning border-accent-warning/20',
    Medium: 'bg-accent-primary/10 text-accent-primary border-accent-primary/20',
    Low: 'bg-gray-800 text-text-muted border-border'
  };

  const renderTicketCard = (ticket: Ticket) => (
    <div 
      key={ticket.id}
      onClick={() => handleTicketClick(ticket.id)}
      className="p-4 bg-bg-surface border border-border rounded-xl hover:border-accent-primary/50 transition-all cursor-pointer space-y-3 relative group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <img 
            src={ticket.clientAvatar} 
            alt={ticket.clientName}
            className="w-8 h-8 rounded-full border border-border object-cover flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${ticket.clientName}`;
            }}
          />
          <div className="flex flex-col text-left truncate">
            <span className="text-xs font-bold text-text-primary truncate">{ticket.clientCompany}</span>
            <span className="text-[10px] text-text-muted">{ticket.clientName}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className="text-[9px] font-mono text-text-muted">{ticket.lastMessageTime}</span>
          <div className="flex items-center gap-1">
            {ticket.clientOutsideHours && (
              <span title="Client is outside business hours"><Moon className="w-3 h-3 text-accent-warning fill-accent-warning/20" /></span>
            )}
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border ${priorityColors[ticket.priority]}`}>
              {ticket.priority}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="text-xs font-semibold text-text-primary truncate group-hover:text-accent-primary transition-colors">
          {ticket.subject}
        </h4>
        <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
          {ticket.lastMessage}
        </p>
      </div>

      <div className="text-[9px] font-mono text-text-muted pt-2 border-t border-border/40 flex justify-between">
        <span>Case #{ticket.id}</span>
        <span className="text-accent-primary">{ticket.projectService}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-bg-surface border-r border-border w-full md:w-[280px] shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          {standalone && (
            <button 
              onClick={() => {
                if (onClose) onClose();
                else navigate('/dashboard');
              }}
              className="p-1 rounded hover:bg-bg-elevated text-text-secondary hover:text-text-primary"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <h2 className="text-base font-bold font-heading text-text-primary flex items-center gap-2">
            <InboxIcon className="w-4 h-4 text-accent-primary" />
            Inbox
          </h2>
        </div>

        <span className="text-[10px] bg-bg-elevated px-2 py-0.5 rounded-full font-mono text-text-secondary border border-border">
          {openTickets.length} Open
        </span>
      </div>

      {/* Tabs */}
      <div className="p-2 border-b border-border flex gap-1 bg-bg-base/40">
        <button
          onClick={() => setActiveTab('open')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'open' 
              ? 'bg-accent-primary text-text-primary shadow' 
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          Open
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
            activeTab === 'pending' 
              ? 'border-accent-primary bg-accent-primary/10 text-accent-primary' 
              : 'border-transparent text-text-muted hover:text-text-secondary'
          }`}
        >
          Pending
        </button>
      </div>

      {/* Ticket Queue list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {activeTab === 'open' ? (
          <>
            {/* Needs Response */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-semibold text-text-muted uppercase tracking-wider pl-1.5">
                Needs your response
              </div>
              {needsResponse.length > 0 ? (
                needsResponse.map(renderTicketCard)
              ) : (
                <div className="p-6 text-center border border-dashed border-border rounded-xl bg-bg-base/20 space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-accent-success mx-auto" />
                  <p className="text-[11px] font-semibold text-text-secondary">No tickets need response</p>
                  <p className="text-[10px] text-text-muted">Nice work! 🎉</p>
                </div>
              )}
            </div>

            {/* Waiting on Client */}
            <div className="space-y-2 pt-2">
              <div className="text-[10px] font-mono font-semibold text-text-muted uppercase tracking-wider pl-1.5">
                Waiting on client
              </div>
              {waitingOnClient.length > 0 ? (
                waitingOnClient.map(renderTicketCard)
              ) : (
                <div className="p-6 text-center border border-dashed border-border rounded-xl bg-bg-base/20">
                  <p className="text-[10px] text-text-muted">No tickets are waiting on clients.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Pending Tab */
          <div className="space-y-2">
            <div className="text-[10px] font-mono font-semibold text-text-muted uppercase tracking-wider pl-1.5">
              QA Review / Approval Hold
            </div>
            {pendingTickets.length > 0 ? (
              pendingTickets.map(renderTicketCard)
            ) : (
              <div className="p-6 text-center border border-dashed border-border rounded-xl bg-bg-base/20 space-y-2">
                <ShieldAlert className="w-6 h-6 text-text-muted mx-auto" />
                <p className="text-[11px] font-semibold text-text-secondary">No tickets in pending states</p>
                <p className="text-[10px] text-text-muted">All active cases are in service queue.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Inbox;
