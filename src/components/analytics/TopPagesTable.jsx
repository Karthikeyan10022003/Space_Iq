function formatDuration(seconds) {
  const s = parseInt(seconds) || 0;
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function PageRow({ page, index, maxUsers }) {
  const isTop = index === 0;
  const barWidth = maxUsers > 0 ? (page.activeUsers / maxUsers) * 100 : 0;
  const bounceHigh = parseFloat(page.bounce) > 0.6;

  return (
    <div
      className="group grid gap-3 items-center transition-all duration-150 cursor-default"
      style={{
        gridTemplateColumns: '32px 1fr 130px 70px 80px 80px',
        padding: '12px 20px',
        borderBottom: '1px solid var(--border)',
        background: isTop ? 'rgba(255,255,255,0.03)' : 'transparent',
      }}
      onMouseEnter={e => { if (!isTop) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
      onMouseLeave={e => { if (!isTop) e.currentTarget.style.background = 'transparent'; }}
    >
      {/* Rank */}
      <div className="flex justify-center">
        {isTop ? (
          <span
            className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0"
            style={{ background: 'var(--accent-gold)', color: '#fff' }}
          >1</span>
        ) : (
          <span className="text-[11px] font-mono" style={{ color: 'var(--text-secondary)' }}>{index + 1}</span>
        )}
      </div>

      {/* Page path + title */}
      <div className="min-w-0">
        <div className="text-xs font-semibold text-white truncate" title={page.title || page.path}>
          {page.title || page.path}
        </div>
        {page.title && page.path !== page.title && (
          <div className="text-[10px] truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>{page.path}</div>
        )}
      </div>

      {/* Activity bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 rounded-sm h-[3px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div
            className="h-full rounded-sm transition-all"
            style={{
              width: `${barWidth}%`,
              background: isTop ? 'var(--accent-gold)' : 'rgba(255,255,255,0.15)',
            }}
          />
        </div>
        <span className="text-[11px] font-bold font-mono flex-shrink-0" style={{ color: isTop ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
          {page.activeUsers}
        </span>
      </div>

      {/* Views */}
      <div className="text-right text-xs font-mono text-white">{page.views.toLocaleString()}</div>

      {/* Avg time */}
      <div className="text-right text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{page.avgTime}</div>

      {/* Bounce rate */}
      <div className="text-right">
        <span
          className="text-[11px] font-bold font-mono"
          style={{ color: bounceHigh ? 'var(--accent-gold)' : 'var(--text-secondary)' }}
        >
          {page.bounce}%
        </span>
      </div>
    </div>
  );
}

export default function TopPagesTable({ pages }) {
  const sorted = [...(pages || [])]
    .map(p => ({
      ...p,
      avgTime: formatDuration(p.avgDuration),
      bounce: Math.round(parseFloat(p.bounceRate || 0) * 100),
    }))
    .sort((a, b) => b.activeUsers - a.activeUsers);

  const maxUsers = sorted[0]?.activeUsers || 0;

  return (
    <div className="card animate-fade-in-up flex flex-col" style={{ animationDelay: '450ms' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <h2 className="text-sm font-semibold text-white">Top Pages</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{sorted.length} pages Â· sorted by active users</p>
        </div>
        <div
          className="flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-semibold tracking-wider"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          {sorted.reduce((s, p) => s + p.activeUsers, 0)} ACTIVE
        </div>
      </div>

      {/* Column headers */}
      <div
        className="grid gap-3 px-5 py-2 text-[11px] font-semibold uppercase tracking-wider"
        style={{
          gridTemplateColumns: '32px 1fr 130px 70px 80px 80px',
          color: 'var(--text-muted)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="text-center">#</div>
        <div>Page</div>
        <div>Activity</div>
        <div className="text-right">Views</div>
        <div className="text-right">Avg Time</div>
        <div className="text-right">Bounce</div>
      </div>

      {/* Rows */}
      <div className="overflow-auto custom-scroll">
        {sorted.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm" style={{ color: 'var(--text-muted)' }}>
            No page data available.
          </div>
        ) : (
          sorted.map((page, i) => (
            <PageRow key={page.path || i} page={page} index={i} maxUsers={maxUsers} />
          ))
        )}
      </div>
    </div>
  );
}
