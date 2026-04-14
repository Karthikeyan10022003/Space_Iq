function TrendBadge({ value, suffix = '%' }) {
  if (value == null) return null;
  const up = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 ${up ? 'badge-up' : 'badge-down'}`}
    >
      {up ? '↑' : '↓'} {Math.abs(value)}{suffix}
    </span>
  );
}

function MetricCard({ title, value, sub, icon, isKeyMetric, trend, delay = 0 }) {
  return (
    <div
      className="card p-5 flex flex-col gap-4 relative overflow-hidden group animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Top row: icon + trend */}
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 transition-colors"
          style={{
            background: isKeyMetric ? 'var(--accent-red)' : 'rgba(255,255,255,0.03)',
            border: isKeyMetric ? 'none' : '1px solid var(--border)',
            color: isKeyMetric ? '#fff' : 'var(--text-secondary)',
          }}
        >
          {icon}
        </div>
        <TrendBadge value={trend} />
      </div>

      {/* Value */}
      <div>
        <div
          className="text-3xl font-bold text-white tracking-tight leading-none mb-1.5"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {value ?? '—'}
        </div>
        <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          {title}
        </div>
        {sub && <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function KPICards({ data }) {
  const overview = data?.overview?.summary ?? {};
  const realtime = data?.realtime ?? {};

  const avgPerMin = realtime.usersPerMinute?.length
    ? Math.round(realtime.usersPerMinute.reduce((s, d) => s + d.activeUsers, 0) / realtime.usersPerMinute.length)
    : 0;
  const peak = realtime.usersPerMinute?.length
    ? Math.max(...realtime.usersPerMinute.map(d => d.activeUsers))
    : 0;

  const cards = [
    // ── 7-Day Overview (0–4)
    {
      title: 'Weekly Active Users',
      value: (overview.activeUsers ?? 0).toLocaleString(),
      sub: 'Last 7 days',
      isKeyMetric: true,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
    {
      title: 'New Users',
      value: (overview.newUsers ?? 0).toLocaleString(),
      sub: 'Last 7 days',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
          <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
        </svg>
      ),
    },
    {
      title: 'Total Sessions',
      value: (overview.sessions ?? 0).toLocaleString(),
      sub: 'Last 7 days',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      ),
    },
    {
      title: 'Total Events',
      value: (overview.eventCount ?? 0).toLocaleString(),
      sub: 'Last 7 days',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
    },
    {
      title: 'Bounce Rate',
      value: `${Math.round((overview.bounceRate || 0) * 100)}%`,
      sub: 'Last 7 days',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
      ),
    },
    // ── Realtime (5–7)
    {
      title: 'Active Users',
      value: (realtime.activeUsersLast30Min ?? 0).toLocaleString(),
      sub: 'Last 30 minutes',
      trend: 12,
      isKeyMetric: true,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
    {
      title: 'Page Views',
      value: (realtime.viewsLast30Min ?? 0).toLocaleString(),
      sub: 'Last 30 minutes',
      trend: 8,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ),
    },
    {
      title: 'Avg / Min',
      value: avgPerMin.toLocaleString(),
      sub: 'Rolling 30-min window',
      trend: -3,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
    },
    {
      title: 'Peak / Min',
      value: peak.toLocaleString(),
      sub: 'Highest single minute',
      trend: null,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-white mb-3 tracking-wide">7-Day Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {cards.slice(0, 5).map((c, i) => (
            <MetricCard key={c.title} {...c} delay={i * 60} />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-white mb-3 px-1">Realtime (Rolling 30 Min)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.slice(5).map((c, i) => (
            <MetricCard key={c.title} {...c} delay={(i + 5) * 60} />
          ))}
        </div>
      </div>
    </div>
  );
}
