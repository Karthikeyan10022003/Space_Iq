import { useState } from 'react';

const SearchIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const BellIcon    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const RefreshIcon = ({ spinning }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: spinning ? 'spin 1s linear infinite' : 'none' }}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;

const pageTitles = {
  analytics:    'GA4 Analytics',
  google_ads:   'Google Ads',
  facebook_ads: 'Facebook Ads',
  linkedin:     'LinkedIn Ads',
};

function formatTime(date) {
  if (!date) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function TopHeader({ activePage, lastUpdated, refreshing, onRefresh }) {
  const [showNotif, setShowNotif]     = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header
      className="flex-shrink-0 flex items-center gap-3 px-5 h-14 z-20 relative"
      style={{
        background: 'var(--bg-header)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Page title */}
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <h1 className="text-base font-semibold text-white truncate">{pageTitles[activePage] ?? 'Dashboard'}</h1>

        {/* ── Live indicator (analytics only) ──────────────────────────────── */}
        {activePage === 'analytics' && (
          <div className="flex items-center gap-2 ml-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--accent-red)' }} />
            <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--text-primary)' }}>LIVE</span>
            {lastUpdated && (
              <span className="text-xs ml-1" style={{ color: 'var(--text-secondary)' }}>
                · Updated {formatTime(lastUpdated)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Search bar ───────────────────────────────────────────────────── */}
      <div
        className="hidden sm:flex items-center gap-2.5 rounded-md px-3 py-2"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          width: 220,
          transition: 'border-color 0.2s',
        }}
        onFocus={e => e.currentTarget.style.borderColor = 'var(--text-secondary)'}
        onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
        tabIndex={0}
      >
        <span style={{ color: 'var(--text-secondary)' }}><SearchIcon /></span>
        <input
          type="text"
          placeholder="Search…"
          className="bg-transparent outline-none text-xs w-full"
          style={{ color: 'var(--text-primary)' }}
        />
      </div>

      {/* ── Refresh button (analytics only) ──────────────────────────────── */}
      {activePage === 'analytics' && (
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all duration-200 disabled:opacity-50"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          title="Refresh data"
        >
          <RefreshIcon spinning={refreshing} />
          <span className="hidden sm:block">{refreshing ? 'Refreshing…' : 'Refresh'}</span>
        </button>
      )}

      {/* ── Notifications ─────────────────────────────────────────────────── */}
      <div className="relative">
        <button
          onClick={() => { setShowNotif(p => !p); setShowProfile(false); }}
          className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <BellIcon />
          {/* Red dot */}
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-red)' }} />
        </button>

        {showNotif && (
          <div
            className="absolute right-0 top-12 w-72 rounded-xl overflow-hidden z-50 animate-fade-in"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
          >
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <p className="text-sm font-semibold text-white">Notifications</p>
            </div>
            {[
              { title: 'Traffic spike detected', time: '2 min ago' },
              { title: 'Weekly report ready', time: '1 hr ago' },
              { title: 'New session record', time: '3 hr ago' },
            ].map((n, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors"
                style={{ borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.5)' }} />
                <div>
                  <p className="text-xs font-medium text-white">{n.title}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Profile ────────────────────────────────────────────────────────── */}
      <div className="relative">
        <button
          onClick={() => { setShowProfile(p => !p); setShowNotif(false); }}
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-colors"
          style={{ background: showProfile ? 'rgba(255,255,255,0.05)' : 'transparent' }}
          onMouseEnter={e => { if (!showProfile) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
          onMouseLeave={e => { if (!showProfile) e.currentTarget.style.background = 'transparent'; }}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
            HW
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">Hive Workspace</p>
            <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Admin</p>
          </div>
        </button>

        {showProfile && (
          <div
            className="absolute right-0 top-12 w-52 rounded-xl overflow-hidden z-50 animate-fade-in"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
          >
            {['Profile', 'Account Settings', 'Sign out'].map((item, i) => (
              <button
                key={i}
                className="w-full text-left px-4 py-2.5 text-xs transition-colors"
                style={{ color: i === 2 ? 'var(--accent-red)' : 'var(--text-primary)', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
