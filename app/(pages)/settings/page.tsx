/* eslint-disable prettier/prettier */
'use client';
import { useState, useEffect } from 'react';
import { Settings, Moon, Sun, Globe, Bell, Shield, Trash2, Download, ChevronRight, Check, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/lib/firebase/auth-context';

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className={`relative h-6 w-11 rounded-full transition-all ${on ? 'bg-[var(--neon-pink)]' : 'bg-[hsl(var(--muted))]'}`}>
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${on ? 'left-6' : 'left-1'}`} />
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-[0.55rem] tracking-[0.25em] uppercase text-[hsl(var(--muted-foreground))]"
        style={{ fontFamily: 'var(--font-geist-mono)' }}>
        {title}
      </p>
      <div className="card-cyber divide-y divide-[hsl(var(--border))]">{children}</div>
    </div>
  );
}

function Row({ icon: Icon, label, desc, children }: { icon: any; label: string; desc?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'hsl(var(--muted))' }}>
        <Icon size={15} className="text-[hsl(var(--muted-foreground))]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {desc && <p className="text-xs text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'var(--font-geist-sans)' }}>{desc}</p>}
      </div>
      {children}
    </div>
  );
}

const QUALITIES = ['Auto', '4K', '1080p', '720p', '480p'];
const LANGUAGES = ['English', 'Japanese', 'Spanish', 'French', 'German', 'Korean'];
const THEMES_OPTS = [
  { key: 'dark', label: 'Dark', icon: Moon },
  { key: 'light', label: 'Light', icon: Sun },
  { key: 'system', label: 'System', icon: Monitor },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [prefs, setPrefs] = useState({
    autoplay: true,
    notifications: false,
    adBlock: true,
    subtitles: true,
    quality: 'Auto',
    language: 'English',
    saveHistory: true,
    matureContent: false,
  });

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('demonlord_prefs');
    if (stored) setPrefs(p => ({ ...p, ...JSON.parse(stored) }));
  }, []);

  const setPref = (key: string, val: any) => {
    const next = { ...prefs, [key]: val };
    setPrefs(next);
    localStorage.setItem('demonlord_prefs', JSON.stringify(next));
  };

  const clearData = (key: string, label: string) => {
    if (confirm(`Clear your ${label}?`)) {
      localStorage.removeItem(key);
      alert(`${label} cleared.`);
    }
  };

  const exportData = () => {
    const data = {
      watchlist: JSON.parse(localStorage.getItem('demonlord_watchlist') ?? '[]'),
      history: JSON.parse(localStorage.getItem('demonlord_history') ?? '[]'),
      prefs,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'demonlord-data.json'; a.click();
    URL.revokeObjectURL(url);
  };

  if (!mounted) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center"
          style={{ background: 'hsl(var(--muted))' }}>
          <Settings size={18} />
        </div>
        <div>
          <h1 className="text-xl font-black" style={{ fontFamily: 'var(--font-geist-mono)' }}>Settings</h1>
          <p className="text-xs text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'var(--font-geist-mono)' }}>
            Preferences & account
          </p>
        </div>
      </div>

      {/* Appearance */}
      <Section title="APPEARANCE">
        <div className="p-4 space-y-3">
          <p className="text-sm font-medium">Theme</p>
          <div className="grid grid-cols-3 gap-2">
            {THEMES_OPTS.map(t => (
              <button key={t.key} onClick={() => setTheme(t.key)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                  theme === t.key
                    ? 'border-[var(--neon-pink)] bg-[color-mix(in_srgb,var(--neon-pink)_8%,transparent)]'
                    : 'border-[hsl(var(--border))] hover:border-[hsl(var(--muted-foreground))]'
                }`}>
                <t.icon size={18} style={{ color: theme === t.key ? 'var(--neon-pink)' : undefined }} />
                <span className="text-xs font-medium">{t.label}</span>
                {theme === t.key && <Check size={11} style={{ color: 'var(--neon-pink)' }} />}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Playback */}
      <Section title="PLAYBACK">
        <Row icon={Globe} label="Preferred Quality" desc="Default video quality">
          <div className="flex gap-1 flex-wrap justify-end">
            {QUALITIES.map(q => (
              <button key={q} onClick={() => setPref('quality', q)}
                className={`text-[0.6rem] px-2 py-1 rounded-lg transition-all ${
                  prefs.quality === q
                    ? 'text-white font-bold'
                    : 'text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))]'
                }`}
                style={{ background: prefs.quality === q ? 'var(--neon-pink)' : undefined,
                  fontFamily: 'var(--font-geist-mono)' }}>
                {q}
              </button>
            ))}
          </div>
        </Row>
        <Row icon={Globe} label="Subtitle Language">
          <select value={prefs.language} onChange={e => setPref('language', e.target.value)}
            className="text-xs border border-[hsl(var(--border))] rounded-lg px-2 py-1.5 bg-[hsl(var(--card))] outline-none focus:border-[var(--neon-pink)]">
            {LANGUAGES.map(l => <option key={l}>{l}</option>)}
          </select>
        </Row>
        <Row icon={Shield} label="Auto-play" desc="Play next episode automatically">
          <Toggle on={prefs.autoplay} onToggle={() => setPref('autoplay', !prefs.autoplay)} />
        </Row>
        <Row icon={Shield} label="Show Subtitles" desc="Enable subtitles by default">
          <Toggle on={prefs.subtitles} onToggle={() => setPref('subtitles', !prefs.subtitles)} />
        </Row>
        <Row icon={Shield} label="Ad Blocker" desc="Block ads in embedded players">
          <Toggle on={prefs.adBlock} onToggle={() => setPref('adBlock', !prefs.adBlock)} />
        </Row>
      </Section>

      {/* Privacy */}
      <Section title="PRIVACY">
        <Row icon={Bell} label="Save Watch History" desc="Store what you've watched locally">
          <Toggle on={prefs.saveHistory} onToggle={() => setPref('saveHistory', !prefs.saveHistory)} />
        </Row>
        <Row icon={Shield} label="Mature Content" desc="Show 18+ content in results">
          <Toggle on={prefs.matureContent} onToggle={() => setPref('matureContent', !prefs.matureContent)} />
        </Row>
      </Section>

      {/* Data */}
      <Section title="DATA & STORAGE">
        <Row icon={Download} label="Export My Data" desc="Download watchlist & history as JSON">
          <button onClick={exportData}
            className="text-xs border border-[hsl(var(--border))] rounded-lg px-3 py-1.5 hover:border-[var(--neon-blue)] hover:text-[var(--neon-blue)] transition-all"
            style={{ fontFamily: 'var(--font-geist-mono)' }}>
            Export
          </button>
        </Row>
        <Row icon={Trash2} label="Clear Watch History" desc="Remove all watched items">
          <button onClick={() => clearData('demonlord_history', 'watch history')}
            className="text-xs border border-[hsl(var(--border))] rounded-lg px-3 py-1.5 hover:border-red-400 hover:text-red-400 transition-all"
            style={{ fontFamily: 'var(--font-geist-mono)' }}>
            Clear
          </button>
        </Row>
        <Row icon={Trash2} label="Clear Watchlist" desc="Remove all saved items">
          <button onClick={() => clearData('demonlord_watchlist', 'watchlist')}
            className="text-xs border border-[hsl(var(--border))] rounded-lg px-3 py-1.5 hover:border-red-400 hover:text-red-400 transition-all"
            style={{ fontFamily: 'var(--font-geist-mono)' }}>
            Clear
          </button>
        </Row>
      </Section>

      {/* Account */}
      {user && (
        <Section title="ACCOUNT">
          <Row icon={Settings} label={user.email ?? 'Signed in'} desc={user.displayName ?? 'Firebase user'}>
            <button onClick={signOut}
              className="text-xs border border-red-400/40 text-red-400 rounded-lg px-3 py-1.5 hover:bg-red-400/10 transition-all"
              style={{ fontFamily: 'var(--font-geist-mono)' }}>
              Sign Out
            </button>
          </Row>
        </Section>
      )}

      {/* Version */}
      <p className="text-center text-[0.55rem] text-[hsl(var(--muted-foreground))] opacity-50"
        style={{ fontFamily: 'var(--font-geist-mono)' }}>
        DemonLord v5.0 · Neural Cinema · demonlord.pp.ua
      </p>
    </div>
  );
}
