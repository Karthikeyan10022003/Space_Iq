import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const kpis = [
  { label: 'Reach',        value: '892K',    change: +21.4, isKey: false },
  { label: 'Impressions',  value: '2.41M',   change: +18.2, isKey: false },
  { label: 'Link Clicks',  value: '61,340',  change: +13.7, isKey: true  },
  { label: 'CTR',          value: '2.54%',   change: +0.3,  isKey: false },
  { label: 'CPM',          value: '$8.91',   change: -4.2,  isKey: false },
  { label: 'Total Spend',  value: '$21,474', change: +9.8,  isKey: false },
  { label: 'Conversions',  value: '3,182',   change: +24.1, isKey: true  },
  { label: 'Cost / Conv.', value: '$6.75',   change: -11.3, isKey: false },
];

const dailyData = [
  { day: 'Mon', reach: 118000, clicks: 7800 },
  { day: 'Tue', reach: 134000, clicks: 9100 },
  { day: 'Wed', reach: 128000, clicks: 8600 },
  { day: 'Thu', reach: 145000, clicks: 10200 },
  { day: 'Fri', reach: 162000, clicks: 11400 },
  { day: 'Sat', reach: 97000,  clicks: 7200 },
  { day: 'Sun', reach: 108000, clicks: 7040 },
];

const ageData = [
  { age: '18-24', pct: 18 },
  { age: '25-34', pct: 34 },
  { age: '35-44', pct: 26 },
  { age: '45-54', pct: 14 },
  { age: '55+',   pct: 8  },
];

const placementData = [
  { name: 'Facebook Feed',   value: 46, color: 'var(--accent-red)' },
  { name: 'Instagram Feed',  value: 28, color: 'rgba(255,255,255,0.15)' },
  { name: 'Stories',         value: 14, color: 'rgba(255,255,255,0.08)' },
  { name: 'Reels',           value: 8,  color: 'rgba(255,255,255,0.05)' },
  { name: 'Audience Network',value: 4,  color: 'rgba(255,255,255,0.03)' },
];

const campaigns = [
  { name: 'Workspace Awareness – Broad',    reach: 312000, clicks: 18400, ctr: 2.9, spend: 7200, conv: 1040, cpa: 6.9, status: 'active' },
  { name: 'Retargeting – Website Visitors', reach: 84000,  clicks: 12800, ctr: 5.8, spend: 5100, conv: 892,  cpa: 5.7, status: 'active' },
  { name: 'Lookalike – Top Customers',      reach: 241000, clicks: 14200, ctr: 3.4, spend: 4974, conv: 728,  cpa: 6.8, status: 'active' },
  { name: 'Lead Gen – HR Managers',         reach: 148000, clicks: 9100,  ctr: 3.1, spend: 3100, conv: 412,  cpa: 7.5, status: 'active' },
  { name: 'Engagement – Page Post Ads',     reach: 107000, clicks: 6840,  ctr: 2.0, spend: 1100, conv: 110,  cpa: 10.0, status: 'paused' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
const kpiIcons = ['reach', 'imp', 'click', 'ctr', 'cpm', 'spend', 'conv', 'cpa'];
const iconSVGs = {
  reach: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  imp:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  click: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg>,
  ctr:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
  cpm:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  spend: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  conv:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  cpa:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
};

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2.5 text-xs" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
      <p className="font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      {payload.map((p, i) => <div key={i} className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: p.color }} /><span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span><span className="text-white font-bold">{Number(p.value).toLocaleString()}</span></div>)}
    </div>
  );
}

export default function FacebookAdsPage() {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: '#1877F2' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </div>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Meta Ads Manager · Last 7 days</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Performance across Facebook &amp; Instagram placements</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          Apr 7 – Apr 14, 2026
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {kpis.map((k, i) => {
          const up = k.change >= 0;
          return (
            <div key={k.label} className="card p-5 flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: k.isKey ? 'var(--accent-red)' : 'rgba(255,255,255,0.03)', border: k.isKey ? 'none' : '1px solid var(--border)', color: k.isKey ? '#fff' : 'var(--text-secondary)' }}>
                  {iconSVGs[kpiIcons[i]]}
                </div>
                <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${up ? 'badge-up' : 'badge-down'}`}>{up ? '↑' : '↓'} {Math.abs(k.change)}%</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-white tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
                <div className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--text-secondary)' }}>{k.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reach chart + Placement pie + Age breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Daily reach */}
        <div className="lg:col-span-2 card p-5 animate-fade-in-up" style={{ animationDelay: '420ms' }}>
          <h3 className="text-sm font-semibold text-white mb-1">Daily Reach &amp; Link Clicks</h3>
          <p className="text-xs mb-5" style={{ color: 'var(--text-secondary)' }}>Audience engagement trend this week</p>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barCategoryGap="32%">
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="reach" name="Reach" radius={[4, 4, 0, 0]} maxBarSize={36}>
                  {dailyData.map((_, i) => <Cell key={i} fill={i === 4 ? 'var(--accent-red)' : 'rgba(255,255,255,0.1)'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Placement & Age */}
        <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '460ms' }}>
          <h3 className="text-sm font-semibold text-white mb-1">Placements</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>Impression share by placement</p>
          <div className="space-y-3">
            {placementData.map((p, i) => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold" style={{ color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{p.name}</span>
                  <span className="text-xs font-bold font-mono text-white">{p.value}%</span>
                </div>
                <div className="w-full rounded-sm h-[3px]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="h-full rounded-sm" style={{ width: `${p.value}%`, background: p.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <h3 className="text-xs font-semibold text-white mb-3">Age Breakdown</h3>
            <div className="space-y-2">
              {ageData.map((a, i) => (
                <div key={a.age} className="flex items-center gap-3">
                  <span className="text-[11px] font-mono w-12 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>{a.age}</span>
                  <div className="flex-1 rounded-sm h-[3px]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="h-full rounded-sm" style={{ width: `${a.pct * 2.2}%`, background: i === 1 ? 'var(--accent-red)' : 'rgba(255,255,255,0.12)' }} />
                  </div>
                  <span className="text-[11px] font-bold font-mono text-white w-8 text-right">{a.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns table */}
      <div className="card animate-fade-in-up" style={{ animationDelay: '520ms' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h3 className="text-sm font-semibold text-white">Ad Sets</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{campaigns.length} campaigns · sorted by spend</p>
          </div>
        </div>
        <div className="grid px-5 py-2 text-[11px] font-semibold uppercase tracking-wider" style={{ gridTemplateColumns: '1fr 90px 80px 60px 80px 80px 60px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
          <div>Campaign</div><div className="text-right">Reach</div><div className="text-right">Clicks</div><div className="text-right">CTR</div><div className="text-right">Spend</div><div className="text-right">Conv.</div><div className="text-right">CPA</div>
        </div>
        {campaigns.map((c, i) => (
          <div key={c.name} className="grid px-5 items-center transition-colors cursor-default"
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            style={{ gridTemplateColumns: '1fr 90px 80px 60px 80px 80px 60px', padding: '13px 20px', borderBottom: i < campaigns.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.status === 'active' ? 'var(--accent-red)' : 'var(--text-muted)', opacity: c.status === 'active' ? 1 : 0.4 }} />
              <span className="text-xs font-semibold text-white truncate">{c.name}</span>
            </div>
            <div className="text-right text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{c.reach.toLocaleString()}</div>
            <div className="text-right text-xs font-mono text-white">{c.clicks.toLocaleString()}</div>
            <div className="text-right text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{c.ctr}%</div>
            <div className="text-right text-xs font-bold font-mono text-white">${c.spend.toLocaleString()}</div>
            <div className="text-right text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{c.conv}</div>
            <div className="text-right text-xs font-bold font-mono" style={{ color: c.cpa < 7 ? 'var(--accent-red)' : 'var(--text-secondary)' }}>${c.cpa}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
