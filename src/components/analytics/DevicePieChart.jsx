import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <div
      className="rounded-lg px-3 py-2.5 text-xs"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
    >
      <p className="font-semibold mb-0.5" style={{ color: 'var(--text-secondary)' }}>{name}</p>
      <p className="text-white font-bold">{value} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>sessions</span></p>
    </div>
  );
}

export default function DevicePieChart({ devices }) {
  const maxSessions = Math.max(...(devices || []).map(d => d.sessions || 0));

  const data = (devices || []).map(d => ({
    name: d.device,
    value: d.sessions,
    color: d.sessions === maxSessions && maxSessions > 0 ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)',
  }));

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white">Device Breakdown</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Sessions by device Â· last 7 days</p>
      </div>

      {/* Pie chart */}
      <div style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-3 space-y-3">
        {data.map(d => {
          const pct = total ? Math.round((d.value / total) * 100) : 0;
          return (
            <div key={d.name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-xs font-semibold capitalize" style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                </div>
                <span className="text-xs font-bold text-white">{pct}%</span>
              </div>
              {/* Mini bar */}
              <div className="w-full rounded-sm h-[3px]" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div
                  className="h-full rounded-sm"
                  style={{ width: `${pct}%`, background: d.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
