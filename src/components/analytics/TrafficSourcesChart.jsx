import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2.5 text-xs"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
    >
      <p className="font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-white font-bold">{payload[0].value}</span>
        <span style={{ color: 'var(--text-secondary)' }}>sessions</span>
      </div>
    </div>
  );
}

export default function TrafficSourcesChart({ sources }) {
  const maxUsers = Math.max(...(sources || []).map(s => s.sessions || s.activeUsers || 0));
  const data = (sources || []).map(s => {
    const val = s.sessions || s.activeUsers || 0;
    return {
      source: s.channel,
      users: val,
      color: val === maxUsers ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)',
    };
  });
  const total = data.reduce((s, d) => s + d.users, 0);

  return (
    <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white">Traffic Sources</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>By channel Â· last 7 days</p>
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }} barCategoryGap="30%">
            <XAxis dataKey="source" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar dataKey="users" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {data.map(d => {
          const pct = total ? Math.round((d.users / total) * 100) : 0;
          return (
            <div key={d.source} className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: d.color }} />
              <span className="flex-1 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{d.source}</span>
              <span className="text-xs font-bold text-white font-mono">{d.users}</span>
              <span className="text-[11px] w-8 text-right font-medium" style={{ color: 'var(--text-muted)' }}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
