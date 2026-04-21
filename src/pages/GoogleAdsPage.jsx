import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';

// â”€â”€â”€ Mock Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const kpis = [
  { label: 'Impressions', value: '1.24M', change: +14.2, isKey: false, icon: 'eye' },
  { label: 'Clicks', value: '38,402', change: +8.7, isKey: true, icon: 'cursor' },
  { label: 'CTR', value: '3.09%', change: +0.4, isKey: false, icon: 'percent' },
  { label: 'Avg. CPC', value: '$1.42', change: -6.1, isKey: false, icon: 'tag' },
  { label: 'Total Spend', value: '$54,531', change: +11.3, isKey: false, icon: 'wallet' },
  { label: 'Conversions', value: '2,814', change: +19.6, isKey: true, icon: 'check' },
  { label: 'Conv. Rate', value: '7.33%', change: +0.9, isKey: false, icon: 'trend' },
  { label: 'ROAS', value: '6.4x', change: +1.2, isKey: false, icon: 'roas' },
];

const weeklySpend = [
  { day: 'Mon', spend: 7200, conversions: 310 },
  { day: 'Tue', spend: 8400, conversions: 380 },
  { day: 'Wed', spend: 9100, conversions: 420 },
  { day: 'Thu', spend: 7800, conversions: 360 },
  { day: 'Fri', spend: 10200, conversions: 490 },
  { day: 'Sat', spend: 6300, conversions: 280 },
  { day: 'Sun', spend: 5531, conversions: 574 },
];

const campaigns = [
  { name: 'Brand â€“ Branded Keywords', impressions: 312000, clicks: 14200, ctr: 4.55, cpc: 0.88, spend: 12496, conv: 1104, roas: 8.4, status: 'active' },
  { name: 'Search â€“ Competitor Terms', impressions: 198000, clicks: 7900,  ctr: 3.99, cpc: 1.62, spend: 12798, conv: 543,  roas: 5.9, status: 'active' },
  { name: 'Display â€“ Remarketing',     impressions: 480000, clicks: 5200,  ctr: 1.08, cpc: 2.10, spend: 10920, conv: 371,  roas: 4.2, status: 'active' },
  { name: 'Shopping â€“ Core Products',  impressions: 156000, clicks: 7800,  ctr: 5.00, cpc: 1.31, spend: 10218, conv: 592,  roas: 7.1, status: 'active' },
  { name: 'YouTube â€“ Awareness',       impressions: 94000,  clicks: 3302,  ctr: 3.51, cpc: 2.45, spend: 8100,  conv: 204,  roas: 3.0, status: 'paused' },
];

const adGroups = [
  { name: 'Workspace Software',   clicks: 9200, ctr: 4.8, conv: 780, cpc: 1.12 },
  { name: 'Office Management',    clicks: 7400, ctr: 3.9, conv: 610, cpc: 1.35 },
  { name: 'Remote Teams',         clicks: 6800, ctr: 3.5, conv: 540, cpc: 1.55 },
  { name: 'Coworking Spaces',     clicks: 5200, ctr: 2.8, conv: 412, cpc: 1.88 },
  { name: 'HR Productivity',      clicks: 4100, ctr: 2.4, conv: 320, cpc: 2.10 },
];

// â”€â”€â”€ Components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const icons = {
  eye:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  cursor:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg>,
  percent: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
  tag:     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  wallet:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  check:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  trend:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  roas:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
};

function KPICard({ kpi, i }) {
  const up = kpi.change >= 0;
  return (
    <div className="card p-5 flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-md flex items-center justify-center"
          style={{ background: kpi.isKey ? 'var(--accent-gold)' : 'rgba(255,255,255,0.03)', border: kpi.isKey ? 'none' : '1px solid var(--border)', color: kpi.isKey ? '#fff' : 'var(--text-secondary)' }}>
          {icons[kpi.icon]}
        </div>
        <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${up ? 'badge-up' : 'badge-down'}`}>
          {up ? 'â†‘' : 'â†“'} {Math.abs(kpi.change)}%
        </span>
      </div>
      <div>
        <div className="text-2xl font-bold text-white tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>{kpi.value}</div>
        <div className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--text-secondary)' }}>{kpi.label}</div>
      </div>
    </div>
  );
}

function SpendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2.5 text-xs" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
      <p className="font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span className="text-white font-bold">{p.name === 'Spend' ? `$${p.value.toLocaleString()}` : p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function GoogleAdsPage() {
  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: '#4285F4' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
            </div>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Google Ads Â· Last 7 days</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Campaign performance across all active ad groups</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          Apr 7 â€“ Apr 14, 2026
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {kpis.map((k, i) => <KPICard key={k.label} kpi={k} i={i} />)}
      </div>

      {/* Spend chart + Ad Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Spend chart */}
        <div className="lg:col-span-2 card p-5 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white">Daily Spend & Conversions</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>This week's budget utilization</p>
            </div>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySpend} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barCategoryGap="32%">
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip content={<SpendTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="spend" name="Spend" radius={[4, 4, 0, 0]} maxBarSize={36}>
                  {weeklySpend.map((_, i) => <Cell key={i} fill={i === 6 ? 'var(--accent-gold)' : 'rgba(255,255,255,0.12)'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Ad Groups */}
        <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '440ms' }}>
          <h3 className="text-sm font-semibold text-white mb-1">Top Ad Groups</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>By clicks Â· this week</p>
          <div className="space-y-3">
            {adGroups.map((g, i) => {
              const maxClicks = adGroups[0].clicks;
              const w = (g.clicks / maxClicks) * 100;
              return (
                <div key={g.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold truncate" style={{ color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)', maxWidth: 140 }} title={g.name}>{g.name}</span>
                    <span className="text-xs font-bold font-mono text-white ml-2 flex-shrink-0">{g.clicks.toLocaleString()}</span>
                  </div>
                  <div className="w-full rounded-sm h-[3px]" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-full rounded-sm" style={{ width: `${w}%`, background: i === 0 ? 'var(--accent-gold)' : 'rgba(255,255,255,0.18)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="card animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h3 className="text-sm font-semibold text-white">Campaigns</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{campaigns.length} campaigns Â· sorted by spend</p>
          </div>
        </div>
        {/* Column headers */}
        <div className="grid px-5 py-2 text-[11px] font-semibold uppercase tracking-wider" style={{ gridTemplateColumns: '1fr 100px 80px 70px 80px 90px 80px 70px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
          <div>Campaign</div><div className="text-right">Impressions</div><div className="text-right">Clicks</div><div className="text-right">CTR</div><div className="text-right">CPC</div><div className="text-right">Spend</div><div className="text-right">Conv.</div><div className="text-right">ROAS</div>
        </div>
        {campaigns.map((c, i) => (
          <div key={c.name} className="grid px-5 items-center transition-colors" onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            style={{ gridTemplateColumns: '1fr 100px 80px 70px 80px 90px 80px 70px', padding: '13px 20px', borderBottom: i < campaigns.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div className="flex items-center gap-2 min-w-0">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.status === 'active' ? '' : 'opacity-30'}`} style={{ background: c.status === 'active' ? 'var(--accent-gold)' : 'var(--text-muted)' }} />
              <span className="text-xs font-semibold text-white truncate">{c.name}</span>
            </div>
            <div className="text-right text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{c.impressions.toLocaleString()}</div>
            <div className="text-right text-xs font-mono text-white">{c.clicks.toLocaleString()}</div>
            <div className="text-right text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{c.ctr}%</div>
            <div className="text-right text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>${c.cpc}</div>
            <div className="text-right text-xs font-bold font-mono text-white">${c.spend.toLocaleString()}</div>
            <div className="text-right text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{c.conv}</div>
            <div className="text-right text-xs font-bold font-mono" style={{ color: c.roas >= 6 ? 'var(--accent-gold)' : 'var(--text-secondary)' }}>{c.roas}x</div>
          </div>
        ))}
      </div>
    </div>
  );
}
