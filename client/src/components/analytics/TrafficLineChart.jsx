import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2.5 text-xs"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      }}
    >
      <p className="font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--accent-red)' }} />
        <span className="text-white font-bold">{payload[0].value}</span>
        <span style={{ color: 'var(--text-secondary)' }}>active users</span>
      </div>
    </div>
  );
}

export default function TrafficLineChart({ data }) {
  if (!data?.length) return null;

  const maxVal = Math.max(...data.map(d => d.activeUsers));
  const peakItem = data.find(d => d.activeUsers === maxVal);

  return (
    <div className="card p-5 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white">Traffic — Last 30 Minutes</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Active users per minute</p>
        </div>
        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-[2px] rounded-full inline-block" style={{ background: 'rgba(255,255,255,0.2)' }} />
            Active users
          </div>
          {maxVal > 0 && (
            <div className="flex items-center gap-1.5 font-medium ml-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-red)' }} />
              <span style={{ color: 'var(--text-primary)' }}>Peak {maxVal}</span>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="rgba(255,255,255,0.15)" stopOpacity={1} />
                <stop offset="100%" stopColor="rgba(255,255,255,0)"    stopOpacity={1} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" tickLine={false} axisLine={false} interval={5} />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent', stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            {peakItem && (
              <ReferenceLine x={peakItem.label} stroke="var(--accent-red)" strokeDasharray="3 3" />
            )}
            <Area
              type="monotone"
              dataKey="activeUsers"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={2}
              fill="url(#trafficGrad)"
              dot={false}
              activeDot={{ r: 4, fill: 'var(--accent-red)', stroke: 'var(--bg-base)', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
