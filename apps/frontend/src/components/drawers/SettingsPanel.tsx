import React, { useState } from 'react';
import { useNexusStore } from '../../store/nexusStore';
import { X, Check } from 'lucide-react';

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const { settings, updateSettings, createTicket } = useNexusStore();
  const [activeTab, setActiveTab] = useState<'notifications' | 'language' | 'theme'>('notifications');

  // Accent color presets
  const presets = [
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Emerald', value: '#10B981' },
    { name: 'Sky', value: '#0EA5E9' },
    { name: 'Rose', value: '#F43F5E' },
    { name: 'Amber', value: '#F59E0B' },
    { name: 'Purple', value: '#A855F7' }
  ];

  const handleTestNotification = () => {
    // Generate a test notification
    createTicket({
      subject: 'Test Notification Trigger',
      priority: 'Low',
      lastMessage: 'This is a test notification generated from settings. Sandbox environment is running correctly.'
    });
    alert('Test notification triggered! Check the Notifications panel in your sidebar.');
  };

  const handleLangChange = (lang: string) => {
    const isAr = lang === 'ar';
    updateSettings({
      language: lang,
      rtlMode: isAr
    });
  };

  const toggleNotificationSetting = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };

  return (
    <div className="flex flex-col h-full bg-bg-surface border-l border-border w-[320px] animate-slide-in">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-bold font-heading text-text-primary">Settings</h2>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-bg-elevated rounded text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="p-2 border-b border-border flex gap-1 bg-bg-base/30 text-[10px] font-semibold">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 py-1.5 rounded-md transition-all ${
            activeTab === 'notifications' ? 'bg-bg-elevated text-text-primary' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('language')}
          className={`flex-1 py-1.5 rounded-md transition-all ${
            activeTab === 'language' ? 'bg-bg-elevated text-text-primary' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          Language
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`flex-1 py-1.5 rounded-md transition-all ${
            activeTab === 'theme' ? 'bg-bg-elevated text-text-primary' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          Dark Mode
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'notifications' && (
          /* Notifications Settings */
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-border/20 pb-3">
              <span className="text-xs font-bold text-text-primary">Show notifications</span>
              <button
                onClick={() => toggleNotificationSetting('showNotifications')}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${
                  settings.showNotifications ? 'bg-accent-primary' : 'bg-bg-elevated border border-border'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${settings.showNotifications ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            {settings.showNotifications && (
              <div className="space-y-3">
                <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider pl-1">
                  When do you want to be notified?
                </div>
                
                {[
                  { key: 'notifyNewReply', label: 'New reply on a ticket' },
                  { key: 'notifyNewNote', label: 'New internal note on a ticket' },
                  { key: 'notifyNewTicket', label: 'New ticket assigned to me' },
                  { key: 'notifyNewMessage', label: 'New message from a team member' },
                  { key: 'notifyDeployment', label: 'Deployment status change' },
                  { key: 'notifyInvoice', label: 'Invoice status change' },
                  { key: 'notifyClient', label: 'New client message' },
                  { key: 'notifySla', label: 'SLA breach warning' },
                ].map((item) => (
                  <label 
                    key={item.key} 
                    className="flex items-center justify-between text-xs text-text-secondary hover:text-text-primary cursor-pointer select-none py-1"
                  >
                    <span>{item.label}</span>
                    <input
                      type="checkbox"
                      checked={!!settings[item.key as keyof typeof settings]}
                      onChange={() => toggleNotificationSetting(item.key as keyof typeof settings)}
                      className="accent-accent-primary w-3.5 h-3.5"
                    />
                  </label>
                ))}
              </div>
            )}

            <button
              onClick={handleTestNotification}
              className="w-full h-9 bg-bg-elevated hover:bg-bg-elevated/70 border border-border text-text-secondary hover:text-text-primary transition-colors text-xs font-semibold rounded-lg flex items-center justify-center shadow-sm mt-4"
            >
              Send a test notification
            </button>
          </div>
        )}

        {activeTab === 'language' && (
          /* Language & Formats */
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-text-muted uppercase font-bold">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleLangChange(e.target.value)}
                className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-secondary px-3 py-2 focus:outline-none focus:border-accent-primary"
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="ar">Arabic (RTL)</option>
                <option value="es">Spanish</option>
                <option value="de">German</option>
                <option value="pt">Portuguese</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-text-muted uppercase font-bold">Date Format</label>
              <select
                value={settings.dateFormat}
                onChange={(e) => updateSettings({ dateFormat: e.target.value })}
                className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-secondary px-3 py-2 focus:outline-none"
              >
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-text-muted uppercase font-bold">Time Format</label>
              <select
                value={settings.timeFormat}
                onChange={(e) => updateSettings({ timeFormat: e.target.value })}
                className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-secondary px-3 py-2 focus:outline-none"
              >
                <option>24h</option>
                <option>12h</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-text-muted uppercase font-bold">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => updateSettings({ timezone: e.target.value })}
                className="w-full bg-bg-elevated border border-border rounded-lg text-xs text-text-secondary px-3 py-2 focus:outline-none"
              >
                <option>Europe/Paris</option>
                <option>Europe/London</option>
                <option>America/New_York</option>
                <option>Asia/Tokyo</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                onClick={() => alert('Language preferences saved in session.')}
                className="w-full h-9 bg-accent-primary hover:bg-accent-primary/80 transition-colors text-text-primary text-xs font-semibold rounded-lg"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {activeTab === 'theme' && (
          /* Dark Mode & Accent Color */
          <div className="space-y-5">
            {/* Dark Mode selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-text-muted uppercase font-bold">Theme Choice</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Dark', 'Light', 'System'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => updateSettings({ darkMode: mode })}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      settings.darkMode === mode
                        ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                        : 'border-border bg-bg-elevated/40 text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color picker */}
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-text-muted uppercase font-bold">Accent Color</label>
              <div className="grid grid-cols-6 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => updateSettings({ accentColor: preset.value })}
                    className="w-8 h-8 rounded-full border flex items-center justify-center transition-transform hover:scale-105"
                    style={{ backgroundColor: preset.value, borderColor: settings.accentColor === preset.value ? '#FFFFFF' : 'transparent' }}
                    title={preset.name}
                  >
                    {settings.accentColor === preset.value && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-[9px] font-mono text-text-muted uppercase font-bold">Custom Hex Value</label>
                <input
                  type="text"
                  value={settings.accentColor}
                  onChange={(e) => updateSettings({ accentColor: e.target.value })}
                  placeholder="e.g. #6366F1"
                  className="w-full bg-bg-elevated border border-border rounded-lg text-xs font-mono text-text-primary px-3 py-1.5 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default SettingsPanel;
