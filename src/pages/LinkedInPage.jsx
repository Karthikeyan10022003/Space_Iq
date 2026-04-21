import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// â”€â”€â”€ Mock Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const kpis = [
  { label: 'Impressions',    value: '486K',    change: +31.2, isKey: false },
  { label: 'Members Reached',value: '94,200',  change: +22.8, isKey: false },
  { label: 'Clicks',         value: '12,840',  change: +17.4, isKey: true  },
  { label: 'CTR',            value: '2.64%',   change: +0.6,  isKey: false },
  { label: 'Avg. CPC',       value: '$4.82',   change: -8.1,  isKey: false },
  { label: 'Total Spend',    value: '$61,887', change: +14.2, isKey: false },
  { label: 'Leads',          value: '841',     change: +28.9, isKey: true  },
  { label: 'Cost / Lead',    value: '$73.59',  change: -10.8, isKey: false },
];

const weeklyData = [
  { day: 'Mon', impressions: 58000, clicks: 1520 },
  { day: 'Tue', impressions: 72000, clicks: 1980 },
  { day: 'Wed', impressions: 68000, clicks: 1840 },
  { day: 'Thu', impressions: 84000, clicks: 2240 },
  { day: 'Fri', impressions: 91000, clicks: 2560 },
  { day: 'Sat', impressions: 61000, clicks: 1400 },
  { day: 'Sun', impressions: 52000, clicks: 1300 },
];

const jobFunctions = [
  { name: 'Engineering',       value: 28 },
  { name: 'Marketing',         value: 22 },
  { name: 'HR / People Ops',   value: 18 },
  { name: 'Operations',        value: 16 },
  { name: 'Finance',           value: 10 },
  { name: 'Other',             value: 6  },
];

const seniority = [
  { level: 'C-Suite',  pct: 12 },
  { level: 'VP',       pct: 18 },
  { level: 'Director', pct: 26 },
  { level: 'Manager',  pct: 31 },
  { level: 'IC',       pct: 13 },
];

const campaigns = [
  { name: 'Thought Leadership â€“ CXOs',        impressions: 98200,  clicks: 2800, ctr: 2.85, spend: 16200, leads: 210, cpl: 77.1, status: 'active' },
  { name: 'Lead Gen â€“ HR Software Buyers',    impressions: 114000, clicks: 3400, ctr: 2.98, spend: 15800, leads: 198, cpl: 79.8, status: 'active' },
  { name: 'Retargeting â€“ Website Visitors',   impressions: 61000,  clicks: 2800, ctr: 4.59, spend: 12100, leads: 201, cpl: 60.2, status: 'active' },
  { name: 'Sponsored Content â€“ Case Studies', impressions: 142000, clicks: 2440, ctr: 1.72, spend: 11187, leads: 152, cpl: 73.6, status: 'active' },
  { name: 'InMail â€“ Director to C-Suite',     impressions: 71000,  clicks: 1400, ctr: 1.97, spend: 6600,  leads: 80,  cpl: 82.5, status: 'paused' },
];

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2.5 text-xs" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
      <p className="font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span className="text-white font-bold">{Number(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default function LinkedInPage() {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: '#0A66C2' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
              </svg>
            </div>
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>LinkedIn Campaign Manager Â· Last 7 days</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>B2B lead generation performance across all ad formats</p>
        </div>
        <div className="px-3 py-1.5 rounded-md text-xs font-medium" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
          Apr 7 â€“ Apr 14, 2026
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {kpis.map((k, i) => {
          const up = k.change >= 0;
          const kpiIcons = [
            <svg key={0} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
            <svg key={1} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
            <svg key={2} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg>,
            <svg key={3} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
            <svg key={4} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
            <svg key={5} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
            <svg key={6} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 15a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 4.16l3-.07a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 11a16 16 0 0 0 6 6l.85-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.5 18z"/></svg>,
            <svg key={7} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
          ];
          return (
            <div key={k.label} className="card p-5 flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: k.isKey ? 'var(--accent-gold)' : 'rgba(255,255,255,0.03)', border: k.isKey ? 'none' : '1px solid var(--border)', color: k.isKey ? '#fff' : 'var(--text-secondary)' }}>
                  {kpiIcons[i]}
                </div>
                <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${up ? 'badge-up' : 'badge-down'}`}>{up ? 'â†‘' : 'â†“'} {Math.abs(k.change)}%</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-white tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
                <div className="text-xs font-semibold uppercase tracking-wider mt-1" style={{ color: 'var(--text-secondary)' }}>{k.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Impressions chart + Audience breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="lg:col-span-2 card p-5 animate-fade-in-up" style={{ animationDelay: '420ms' }}>
          <h3 className="text-sm font-semibold text-white mb-1">Daily Impressions &amp; Clicks</h3>
          <p className="text-xs mb-5" style={{ color: 'var(--text-secondary)' }}>Weekly engagement trend</p>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barCategoryGap="32%">
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="impressions" name="Impressions" radius={[4, 4, 0, 0]} maxBarSize={36}>
                  {weeklyData.map((_, i) => <Cell key={i} fill={i === 4 ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audience */}
        <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '460ms' }}>
          <h3 className="text-sm font-semibold text-white mb-1">Job Functions</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>Click share by function</p>
          <div className="space-y-3">
            {jobFunctions.map((j, i) => (
              <div key={j.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold" style={{ color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{j.name}</span>
                  <span className="text-xs font-bold font-mono text-white">{j.value}%</span>
                </div>
                <div className="w-full rounded-sm h-[3px]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="h-full rounded-sm" style={{ width: `${j.value * 2.8}%`, background: i === 0 ? 'var(--accent-gold)' : 'rgba(255,255,255,0.15)' }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <h3 className="text-xs font-semibold text-white mb-3">Seniority Mix</h3>
            <div className="space-y-2">
              {seniority.map((s, i) => (
                <div key={s.level} className="flex items-center gap-3">
                  <span className="text-[11px] font-mono w-16 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>{s.level}</span>
                  <div className="flex-1 rounded-sm h-[3px]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="h-full rounded-sm" style={{ width: `${s.pct * 2.8}%`, background: i === 3 ? 'var(--accent-gold)' : 'rgba(255,255,255,0.12)' }} />
                  </div>
                  <span className="text-[11px] font-bold font-mono text-white w-8 text-right">{s.pct}%</span>
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
            <h3 className="text-sm font-semibold text-white">Campaigns</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{campaigns.length} campaigns Â· sorted by spend</p>
          </div>
        </div>
        <div className="grid px-5 py-2 text-[11px] font-semibold uppercase tracking-wider" style={{ gridTemplateColumns: '1fr 90px 80px 60px 90px 70px 70px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
          <div>Campaign</div><div className="text-right">Impressions</div><div className="text-right">Clicks</div><div className="text-right">CTR</div><div className="text-right">Spend</div><div className="text-right">Leads</div><div className="text-right">CPL</div>
        </div>
        {campaigns.map((c, i) => (
          <div key={c.name} className="grid px-5 items-center transition-colors cursor-default"
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            style={{ gridTemplateColumns: '1fr 90px 80px 60px 90px 70px 70px', padding: '13px 20px', borderBottom: i < campaigns.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.status === 'active' ? 'var(--accent-gold)' : 'var(--text-muted)', opacity: c.status === 'active' ? 1 : 0.4 }} />
              <span className="text-xs font-semibold text-white truncate">{c.name}</span>
            </div>
            <div className="text-right text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{c.impressions.toLocaleString()}</div>
            <div className="text-right text-xs font-mono text-white">{c.clicks.toLocaleString()}</div>
            <div className="text-right text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{c.ctr}%</div>
            <div className="text-right text-xs font-bold font-mono text-white">${c.spend.toLocaleString()}</div>
            <div className="text-right text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{c.leads}</div>
            <div className="text-right text-xs font-bold font-mono" style={{ color: c.cpl < 70 ? 'var(--accent-gold)' : 'var(--text-secondary)' }}>${c.cpl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
