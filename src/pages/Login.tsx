import React, { useState } from 'react';
import { useNexusStore } from '../store/nexusStore';
import { authApi } from '../services/api';

export const Login: React.FC = () => {
  const { login } = useNexusStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authApi.login(email, password);
      const user = data.user;

      // Map DB role enum back to display label
      const roleMap: Record<string, string> = {
        Agent: 'Agent',
        SeniorAgent: 'Senior Agent',
        ProjectManager: 'Project Manager',
        TechnicalLead: 'Technical Lead',
        FinanceOfficer: 'Finance Officer',
        Administrator: 'Administrator',
        Trainee: 'Trainee',
      };
      
      login(roleMap[user.role] as Parameters<typeof login>[0]);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-bg-base flex flex-col items-center justify-center p-4">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm sm:max-w-sm relative min-w-0 mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-primary/10 border border-accent-primary/20 rounded-2xl mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-accent-primary">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">NEXUS</h1>
          <p className="text-sm text-text-muted mt-1">Operations Platform</p>
        </div>

        {/* Card */}
        <div className="bg-bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-text-primary">Sign in to your workspace</h2>
            <p className="text-xs text-text-muted mt-0.5">Internal access only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-text-secondary mb-1.5">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@nexus.internal"
                className="w-full bg-bg-elevated border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 transition-all"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-bg-elevated border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 transition-all"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 text-xs text-red-400">
                {error}
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-accent-primary hover:bg-accent-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-5 p-3 bg-bg-base/50 border border-border/50 rounded-xl overflow-hidden min-w-0">
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Demo credentials</p>
            <div className="space-y-1">
              {[
                ['Administrator', 'ellen.ripley@nexus.internal'],
                ['Senior Agent', 'sarah.connor@nexus.internal'],
                ['Finance Officer', 'sophie.martin@nexus.internal'],
              ].map(([role, email]) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => { setEmail(email); setPassword('nexus2026!'); }}
                  className="w-full flex items-center px-2 py-1.5 rounded-lg hover:bg-bg-elevated transition-colors group overflow-hidden"
                >
                  <span className="text-[10px] font-semibold text-accent-primary whitespace-nowrap">{role}</span>
                  <span className="text-[10px] text-text-muted ml-2 truncate">{email}</span>
                </button>
              ))}
            </div>
            <p className="text-[9px] text-text-muted mt-2">Password: <code className="text-accent-primary">nexus2026!</code></p>
          </div>
        </div>

        <p className="text-center text-[10px] text-text-muted mt-4">
          © 2026 Nexus Platform · Confidential · Internal Use Only
        </p>
      </div>
    </div>
  );
};

export default Login;
