import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useNexusStore } from './store/nexusStore';
import { authApi } from './services/api';

// Shell
import SystemBanner from './components/SystemBanner';
import Sidebar from './components/Sidebar';
import PrivacyModal from './components/PrivacyModal';
import UniversalSearch from './components/UniversalSearch';

// Pages
import Dashboard from './pages/Dashboard';
import Inbox from './pages/Inbox';
import TicketView from './pages/TicketView';
import Projects from './pages/Projects';
import KnowledgeBase from './pages/KnowledgeBase';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Login from './pages/Login';

// Left Side Drawers
import NotificationsPanel from './components/drawers/NotificationsPanel';
import SettingsPanel from './components/drawers/SettingsPanel';
import RemindersPanel from './components/drawers/RemindersPanel';
import FeedbackPanel from './components/drawers/FeedbackPanel';
import QuickLinksPanel from './components/drawers/QuickLinksPanel';
import MessagingPanel from './components/drawers/MessagingPanel';

export const App: React.FC = () => {
  const { acknowledgedPrivacy, acknowledgePrivacy, settings, login, logout, isAuthenticated } = useNexusStore();
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Attempt to restore session from HTTP-only cookie on mount
  useEffect(() => {
    authApi.me()
      .then((data) => {
        const roleMap: Record<string, string> = {
          Agent: 'Agent', SeniorAgent: 'Senior Agent', ProjectManager: 'Project Manager',
          TechnicalLead: 'Technical Lead', FinanceOfficer: 'Finance Officer',
          Administrator: 'Administrator', Trainee: 'Trainee',
        };
        login(roleMap[data.user.role] as Parameters<typeof login>[0]);
      })
      .catch(() => { /* No session - will show login */ })
      .finally(() => setSessionChecked(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync theme choices on load
  useEffect(() => {
    // Inject accent color
    document.documentElement.style.setProperty('--accent-primary', settings.accentColor);
    
    // Set initial dark mode classes
    if (settings.darkMode === 'Dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.darkMode === 'Light') {
      document.documentElement.classList.remove('dark');
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', systemPrefersDark);
    }
  }, [settings.darkMode, settings.accentColor]);

  const handleOpenDrawer = (drawerName: string) => {
    setActiveDrawer(activeDrawer === drawerName ? null : drawerName);
    setIsSearchOpen(false);
  };

  const handleOpenSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setActiveDrawer(null);
  };

  const handleCloseAllDrawers = () => {
    setActiveDrawer(null);
    setIsSearchOpen(false);
  };

  // Layout directions
  const isRtl = settings.rtlMode;
  const rtlClass = isRtl ? 'rtl' : 'ltr';
  const flexDir = isRtl ? 'flex-row-reverse' : 'flex-row';
  
  // Padding based on sidebar position
  const mainPadding = isRtl ? 'pr-[60px] pl-0' : 'pl-[60px] pr-0';

  // Show nothing until session check completes
  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated - show login
  if (!isAuthenticated) {
    return <BrowserRouter><Routes><Route path="*" element={<Login />} /></Routes></BrowserRouter>;
  }

  return (
    <BrowserRouter>
      <div 
        dir={rtlClass} 
        className={`min-h-screen bg-bg-base text-text-primary flex flex-col font-body transition-colors duration-200 select-text`}
      >
        {/* Privacy Notice Modal Guard */}
        {!acknowledgedPrivacy && (
          <PrivacyModal onAcknowledge={acknowledgePrivacy} />
        )}

        {/* Top Sticky System Banner */}
        <SystemBanner />

        {/* Global Application Grid */}
        <div className={`flex flex-1 relative ${flexDir}`}>
          {/* Collapsible Navigation Sidebar */}
          <Sidebar 
            onOpenDrawer={handleOpenDrawer}
            onOpenSearch={handleOpenSearch}
          />

          {/* Sliding Left Drawers (overlaying main area, adjacent to sidebar) */}
          {activeDrawer && (
            <div 
              className={`fixed inset-y-0 z-30 flex bg-black/45 backdrop-blur-sm transition-all duration-300 w-[calc(100vw-60px)] ${
                isRtl ? 'right-[60px] flex-row-reverse' : 'left-[60px] flex-row'
              }`}
            >
              <div className="flex-shrink-0 shadow-2xl relative z-40 bg-bg-surface">
                {activeDrawer === 'notifications' && (
                  <NotificationsPanel onClose={handleCloseAllDrawers} />
                )}
                {activeDrawer === 'settings' && (
                  <SettingsPanel onClose={handleCloseAllDrawers} />
                )}
                {activeDrawer === 'reminders' && (
                  <RemindersPanel onClose={handleCloseAllDrawers} />
                )}
                {activeDrawer === 'feedback' && (
                  <FeedbackPanel onClose={handleCloseAllDrawers} />
                )}
                {activeDrawer === 'quicklinks' && (
                  <QuickLinksPanel onClose={handleCloseAllDrawers} />
                )}
                {activeDrawer === 'messages' && (
                  <MessagingPanel onClose={handleCloseAllDrawers} />
                )}
              </div>
              
              {/* Clicking the remaining backdrop area closes the active drawer */}
              <div className="flex-1" onClick={handleCloseAllDrawers} />
            </div>
          )}

          {/* Cmd+K Search Overlay */}
          <UniversalSearch 
            isOpen={isSearchOpen} 
            onClose={handleCloseAllDrawers} 
          />

          {/* Main Application Routes Content */}
          <main className={`flex-1 min-h-[calc(100vh-36px)] py-6 px-4 md:px-8 transition-all duration-200 ${mainPadding}`}>
            <Routes>
              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Inbox route renders active Ticket screen with Inbox drawer open */}
              <Route path="/inbox" element={
                <div className="flex relative gap-6 h-[80vh] items-stretch">
                  <Inbox standalone={false} />
                  <div className="flex-1 overflow-y-auto">
                    <TicketView />
                  </div>
                </div>
              } />

              <Route path="/tickets/:id" element={<TicketView />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/knowledge" element={<KnowledgeBase />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};
export default App;
