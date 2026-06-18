import React, { useState } from 'react';
import { useNexusStore } from '../../store/nexusStore';
import { Send, Plus, Search, ArrowLeft } from 'lucide-react';

interface MessagingPanelProps {
  onClose?: () => void;
}

export const MessagingPanel: React.FC<MessagingPanelProps> = () => {
  const { messages, sendDirectMessage } = useNexusStore();
  const [activeTab, setActiveTab] = useState<'chats' | 'team'>('chats');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  
  // Compose DMs state
  const [showCompose, setShowCompose] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [composeText, setComposeText] = useState('');
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null);

  // Active chat state
  const [chatText, setChatText] = useState('');

  const teamMembers = [
    { id: 'hiroshi_tanaka', name: 'Hiroshi Tanaka', role: 'Technical Lead', avatar: '3.png', status: 'online' },
    { id: 'sophie_martin', name: 'Sophie Martin', role: 'Finance Officer', avatar: '4.png', status: 'away' },
    { id: 'emma_watson', name: 'Emma Watson', role: 'Technical Lead', avatar: '7.png', status: 'online' },
    { id: 'alex_rivera', name: 'Alex Rivera', role: 'Senior Agent', avatar: '2.png', status: 'dnd' }
  ];

  const activeThread = messages.find(m => m.senderId === activeThreadId);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim() || !activeThreadId) return;

    sendDirectMessage(activeThreadId, chatText);
    setChatText('');
  };

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeText.trim() || !selectedRecipientId) return;

    sendDirectMessage(selectedRecipientId, composeText);
    setActiveThreadId(selectedRecipientId);
    setComposeText('');
    setShowCompose(false);
    setSelectedRecipientId(null);
  };

  const filteredTeam = teamMembers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-bg-surface border-l border-border w-[320px] animate-slide-in relative">
      {/* Thread View Overlay */}
      {activeThreadId && activeThread ? (
        <div className="absolute inset-0 bg-bg-surface z-10 flex flex-col">
          {/* Thread Header */}
          <div className="p-4 border-b border-border flex items-center gap-2">
            <button 
              onClick={() => setActiveThreadId(null)}
              className="p-1 hover:bg-bg-elevated rounded text-text-secondary hover:text-text-primary"
            >
              <ArrowLeft className="w-4.5 h-4.5" />
            </button>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative">
                <img 
                  src={activeThread.senderAvatar} 
                  alt={activeThread.senderName} 
                  className="w-7 h-7 rounded-full object-cover border border-border"
                />
                <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-bg-surface ${
                  activeThread.senderStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
              </div>
              <div className="flex flex-col text-left truncate leading-tight">
                <span className="text-xs font-bold text-text-primary truncate">{activeThread.senderName}</span>
                <span className="text-[9px] text-text-muted">{activeThread.senderRole}</span>
              </div>
            </div>
          </div>

          {/* Messages Bubble list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeThread.thread.map((msg) => (
              <div 
                key={msg.id}
                className={`flex flex-col max-w-[80%] ${msg.isSelf ? 'ml-auto items-end' : 'items-start'}`}
              >
                <div className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                  msg.isSelf 
                    ? 'bg-accent-primary text-text-primary rounded-tr-none' 
                    : 'bg-bg-elevated border border-border text-text-secondary rounded-tl-none'
                }`}>
                  {msg.content.includes('```') ? (
                    <pre className="font-mono text-[10px] bg-black/35 p-1.5 rounded overflow-x-auto whitespace-pre-wrap">
                      {msg.content.replace(/```/g, '')}
                    </pre>
                  ) : (
                    msg.content
                  )}
                </div>
                <span className="text-[8px] font-mono text-text-muted mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Message input */}
          <form onSubmit={handleSendChat} className="p-3 bg-bg-elevated border-t border-border flex gap-2">
            <input
              type="text"
              required
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              placeholder="Send message..."
              className="flex-1 bg-bg-surface border border-border rounded-lg text-xs text-text-primary px-3 py-1.5 focus:outline-none"
            />
            <button
              type="submit"
              className="p-1.5 bg-accent-primary hover:bg-accent-primary/80 transition-colors text-white rounded-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : showCompose ? (
        /* Compose View Overlay */
        <div className="absolute inset-0 bg-bg-surface z-10 flex flex-col p-4 space-y-4">
          <div className="flex justify-between items-center border-b border-border/40 pb-2">
            <h3 className="font-heading font-bold text-text-primary text-xs">New Message</h3>
            <button onClick={() => setShowCompose(false)} className="text-xs text-text-muted hover:text-text-primary">Cancel</button>
          </div>

          <form onSubmit={handleComposeSubmit} className="space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-text-muted uppercase">Recipient</label>
                <select
                  required
                  value={selectedRecipientId || ''}
                  onChange={(e) => setSelectedRecipientId(e.target.value || null)}
                  className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-secondary px-3 py-2 focus:outline-none"
                >
                  <option value="">Select recipient...</option>
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-text-muted uppercase">Message Body</label>
                <textarea
                  required
                  value={composeText}
                  onChange={(e) => setComposeText(e.target.value)}
                  placeholder="Type message details..."
                  className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-2 h-28 focus:outline-none resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedRecipientId || !composeText.trim()}
              className="w-full h-10 bg-accent-primary hover:bg-accent-primary/80 disabled:opacity-50 text-text-primary text-xs font-semibold rounded-lg shadow mt-4"
            >
              Send Message
            </button>
          </form>
        </div>
      ) : null}

      {/* Main Chats list drawer */}
      {/* Header Info */}
      <div className="p-3 bg-bg-base/30 border-b border-border flex items-center justify-between text-xs text-text-secondary font-mono select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>You're online</span>
        </div>
        
        <button 
          onClick={() => setShowCompose(true)}
          className="p-1 hover:bg-bg-elevated rounded text-accent-primary"
          title="Compose message"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="p-2 border-b border-border flex gap-1 bg-bg-base/30 text-[10px] font-semibold">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 py-1.5 rounded-md transition-all ${
            activeTab === 'chats' ? 'bg-bg-elevated text-text-primary' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          Inbox
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`flex-1 py-1.5 rounded-md transition-all ${
            activeTab === 'team' ? 'bg-bg-elevated text-text-primary' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          TEAM ({teamMembers.length})
        </button>
      </div>

      {/* List content */}
      <div className="flex-1 overflow-y-auto p-2">
        {activeTab === 'chats' ? (
          <div className="space-y-1">
            {messages.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveThreadId(chat.senderId)}
                className="p-3 bg-bg-surface hover:bg-bg-elevated/40 border border-transparent rounded-xl cursor-pointer flex items-center justify-between gap-3 transition-all"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="relative flex-shrink-0">
                    <img 
                      src={chat.senderAvatar} 
                      alt={chat.senderName} 
                      className="w-8 h-8 rounded-full object-cover border border-border"
                    />
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-bg-surface ${
                      chat.senderStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />
                  </div>
                  <div className="flex flex-col text-left truncate">
                    <span className="text-xs font-bold text-text-primary truncate">{chat.senderName}</span>
                    <span className="text-[10px] text-text-muted truncate mt-0.5">{chat.preview}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className="text-[8px] font-mono text-text-muted">{chat.time}</span>
                  {chat.unreadCount > 0 && (
                    <span className="w-4 h-4 bg-accent-primary text-text-primary font-mono text-[9px] rounded-full flex items-center justify-center font-bold">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Team Directory Tab */
          <div className="space-y-2">
            <div className="relative px-2 pb-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search team members..."
                className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-primary px-3 py-1.5 pl-8 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-text-muted absolute left-5 top-3.5 pointer-events-none" />
            </div>

            <div className="space-y-1">
              {filteredTeam.map((member) => (
                <div
                  key={member.id}
                  onClick={() => {
                    // Start or select chat
                    setActiveThreadId(member.id);
                  }}
                  className="p-2.5 bg-bg-surface hover:bg-bg-elevated/40 border border-transparent rounded-xl cursor-pointer flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="w-8 h-8 rounded-full object-cover border border-border"
                      />
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-bg-surface ${
                        member.status === 'online' ? 'bg-emerald-500' : member.status === 'away' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                    </div>
                    <div className="flex flex-col text-left truncate">
                      <span className="text-xs font-bold text-text-primary truncate">{member.name}</span>
                      <span className="text-[9px] text-text-muted font-mono truncate">{member.role}</span>
                    </div>
                  </div>
                  
                  <span className="text-[10px] text-accent-primary hover:underline font-semibold font-mono">DM</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default MessagingPanel;
