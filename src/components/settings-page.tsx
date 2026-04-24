'use client';
import { useState, useCallback, useSyncExternalStore, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from './theme-provider';
import { useAuth } from '@/lib/auth-context';

interface Settings {
  apiKey: string;
  autoSave: boolean;
  systemPrompt: string;
}

const DEFAULT_SETTINGS: Settings = {
  apiKey: '',
  autoSave: false,
  systemPrompt: '',
};

const STORAGE_KEY = 'resume-screener-settings';

function getStoredSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_SETTINGS;
}

function subscribeToNothing() {
  return () => {};
}

function useIsHydrated() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  );
}


export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(() => getStoredSettings());
  const [initialSettings, setInitialSettings] = useState<Settings>(() => getStoredSettings());
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const isHydrated = useIsHydrated();

  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);

  const validateApiKey = (key: string): string | null => {
    if (!key) return null;
    if (!key.startsWith('sk-')) return 'API key should start with "sk-"';
    if (key.length < 20) return 'API key appears to be too short';
    return null;
  };

  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (key === 'apiKey') {
      setApiKeyError(validateApiKey(value as string));
    }
  }, []);

  const handleSave = useCallback(async (currentSettings: Settings, currentApiKeyError: string | null) => {
    if (currentApiKeyError) return;

    setSaveStatus('saving');

    await new Promise(resolve => setTimeout(resolve, 400));

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentSettings));
      setInitialSettings(currentSettings);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, []);

  useEffect(() => {
    if (settings.autoSave && hasChanges && !apiKeyError) {
      const timer = setTimeout(() => {
        handleSave(settings, apiKeyError);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [settings, hasChanges, handleSave, apiKeyError]);

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setApiKeyError(null);
  };

  const isDark = theme === 'dark';

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <span className="text-[var(--text-muted)]">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start justify-between mb-10 opacity-0 animate-fade-up">
          <div>
            <h1 className="font-display text-4xl text-[var(--text-primary)] tracking-tight mb-2">Settings</h1>
            <p className="text-[var(--text-tertiary)]">Manage your preferences</p>
          </div>
          {hasChanges && (
            <span className="px-3 py-1.5 text-xs font-medium bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-full border border-[var(--border-secondary)]">
              Unsaved changes
            </span>
          )}
        </div>

        <div className="space-y-6">
          {user && (
            <section className="opacity-0 animate-fade-up bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-[var(--border-primary)]">
                <h2 className="font-medium text-[var(--text-primary)]">Account</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">Manage your account</p>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      router.push('/');
                      signOut();
                    }}
                    className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </section>
          )}

          <section className="opacity-0 animate-fade-up stagger-1 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl relative z-10">
            <div className="px-6 py-5 border-b border-[var(--border-primary)]">
              <h2 className="font-medium text-[var(--text-primary)]">API Configuration</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">Connect to OpenAI services</p>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">API Key</label>
                  {settings.apiKey && !apiKeyError && (
                    <span className="text-xs text-[var(--text-muted)]">Valid format</span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.apiKey}
                    onChange={(e) => updateSetting('apiKey', e.target.value)}
                    placeholder="sk-proj-..."
                    spellCheck={false}
                    className={`w-full pr-20 pl-4 py-3 bg-[var(--bg-tertiary)] border rounded-xl text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:outline-none transition-all font-mono ${
                      apiKeyError
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-[var(--border-primary)] focus:border-neutral-400 dark:focus:border-neutral-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {showApiKey ? 'Hide' : 'Show'}
                  </button>
                </div>
                {apiKeyError && (
                  <p className="mt-2 text-xs text-red-500">{apiKeyError}</p>
                )}
              </div>

            </div>
          </section>

          <section className="opacity-0 animate-fade-up stagger-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-[var(--border-primary)]">
              <h2 className="font-medium text-[var(--text-primary)]">Appearance</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">Customize the look and feel</p>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-[var(--text-secondary)]">
                    {isDark ? 'Dark mode' : 'Light mode'}
                  </span>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {isDark ? 'Easy on the eyes' : 'Bright and clear'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    isDark
                      ? 'bg-neutral-900 dark:bg-white'
                      : 'bg-[var(--bg-tertiary)] border border-[var(--border-primary)]'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-200 ${
                      isDark
                        ? 'left-6 bg-white dark:bg-neutral-900'
                        : 'left-1 bg-[var(--text-muted)]'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          <section className="opacity-0 animate-fade-up stagger-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-[var(--border-primary)]">
              <h2 className="font-medium text-[var(--text-primary)]">Advanced</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">Power user settings</p>
            </div>

            <div className="p-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">System Prompt</label>
                  {settings.systemPrompt && (
                    <button
                      type="button"
                      onClick={() => updateSetting('systemPrompt', '')}
                      className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <textarea
                  value={settings.systemPrompt}
                  onChange={(e) => updateSetting('systemPrompt', e.target.value)}
                  placeholder="You are a technical recruiter. Focus on engineering skills and system design experience..."
                  rows={5}
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] text-sm placeholder-[var(--text-muted)] focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-all resize-none font-mono"
                />
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  Prepended to every search query. Overrides the default recruiter persona.
                </p>
              </div>
            </div>
          </section>

          <section className="opacity-0 animate-fade-up stagger-5 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl">
            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                Reset to defaults
              </button>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[var(--text-muted)]">Auto-save</span>
                  <button
                    type="button"
                    onClick={() => updateSetting('autoSave', !settings.autoSave)}
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      settings.autoSave
                        ? 'bg-neutral-900 dark:bg-white'
                        : 'bg-[var(--bg-tertiary)] border border-[var(--border-primary)]'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-200 ${
                        settings.autoSave
                          ? 'left-5 bg-white dark:bg-neutral-900'
                          : 'left-1 bg-[var(--text-muted)]'
                      }`}
                    />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handleSave(settings, apiKeyError)}
                  disabled={!hasChanges || saveStatus === 'saving' || !!apiKeyError}
                  className={`px-6 py-2.5 text-sm font-medium rounded-xl transition-all ${
                    !hasChanges || !!apiKeyError
                      ? 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed'
                      : saveStatus === 'saved'
                        ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                        : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100'
                  }`}
                >
                  {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : saveStatus === 'error' ? 'Error' : 'Save changes'}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
