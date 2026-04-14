export default function CountriesTable({ countries }) {
  const sorted = [...(countries || [])].sort((a, b) => b.activeUsers - a.activeUsers);
  const maxUsers = sorted[0]?.activeUsers || 0;

  return (
    <div className="card flex flex-col h-full animate-fade-in-up" style={{ animationDelay: '500ms' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <h2 className="text-sm font-semibold text-white">Active Countries</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{sorted.length} countries · realtime</p>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto custom-scroll p-2 min-h-[300px] max-h-[400px]">
        {sorted.length === 0 ? (
          <div className="flex items-center justify-center h-full p-8 text-sm pt-20" style={{ color: 'var(--text-muted)' }}>
            No active country data available.
          </div>
        ) : (
          <div className="flex flex-col">
            {sorted.map((item, index) => {
              const { country, activeUsers } = item;
              const barWidth = maxUsers > 0 ? (activeUsers / maxUsers) * 100 : 0;
              const isTop = index === 0;

              return (
                <div
                  key={item.countryCode || country || index}
                  className="grid items-center rounded-md transition-all duration-150 cursor-default"
                  style={{
                    gridTemplateColumns: '1fr 30px',
                    padding: '10px 12px',
                    background: isTop ? 'rgba(255,255,255,0.03)' : 'transparent',
                    marginBottom: '2px',
                  }}
                  onMouseEnter={e => { if (!isTop) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={e => { if (!isTop) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div className="flex flex-col gap-1.5 overflow-hidden">
                    <span className="text-xs font-semibold text-white truncate" title={country}>{country}</span>
                    <div className="w-full rounded-sm h-[3px] overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div
                        className="h-full rounded-sm transition-all"
                        style={{
                          width: `${barWidth}%`,
                          background: isTop ? 'var(--accent-red)' : 'rgba(255,255,255,0.15)',
                        }}
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold font-mono" style={{ color: isTop ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {activeUsers}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
