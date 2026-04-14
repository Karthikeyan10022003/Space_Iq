import { useState } from 'react';

// ─── Icon components ──────────────────────────────────────────────────────────
const ChevronIcon = ({ right }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    {right ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
  </svg>
);

const navItems = [
  {
    id: 'analytics',
    label: 'GA4 Analytics',
    badge: 'LIVE',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: 'google_ads',
    label: 'Google Ads',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
      </svg>
    ),
  },
  {
    id: 'facebook_ads',
    label: 'Facebook Ads',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
];

function NavItem({ item, active, onClick, collapsed }) {
  return (
    <button
      onClick={onClick}
      className={`nav-item w-full ${active ? 'active' : ''}`}
      style={{ justifyContent: collapsed ? 'center' : 'flex-start', paddingLeft: collapsed ? 0 : undefined }}
      title={collapsed ? item.label : undefined}
    >
      <span className="flex-shrink-0 nav-icon" style={{ color: active ? 'var(--accent-red)' : 'var(--text-secondary)' }}>
        {item.icon}
      </span>

      {!collapsed && (
        <span className="flex-1 text-left">{item.label}</span>
      )}

      {/* LIVE badge */}
      {!collapsed && item.badge && (
        <span
          className="text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider flex-shrink-0"
          style={{ background: 'var(--accent-red)', color: '#fff' }}
        >
          {item.badge}
        </span>
      )}
    </button>
  );
}

export default function Sidebar({ collapsed, onToggle, activePage, onNavClick }) {
  return (
    <aside
      className="flex flex-col flex-shrink-0 transition-all duration-300 relative"
      style={{
        width: collapsed ? 60 : 220,
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo area */}
      <div
        className="flex items-center gap-3 px-4 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)', height: 57 }}
      >
        {/* Hexagon logo mark */}
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--accent-red)' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/>
          </svg>
        </div>

        {/* Brand name — hide when collapsed */}
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-sm font-bold text-white leading-tight tracking-tight whitespace-nowrap">
              The Hive
            </div>
            <div className="text-[10px] font-medium whitespace-nowrap" style={{ color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
              WORKSPACES
            </div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto custom-scroll">
        {navItems.map(item => (
          <NavItem
            key={item.id}
            item={item}
            active={activePage === item.id}
            onClick={() => onNavClick(item.id)}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
        <button
          onClick={onToggle}
          className="nav-item w-full"
          style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span style={{ color: 'var(--text-secondary)' }}>
            <ChevronIcon right={collapsed} />
          </span>
          {!collapsed && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
