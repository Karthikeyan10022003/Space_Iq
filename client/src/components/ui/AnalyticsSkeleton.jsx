function SkeletonBox({ className = '', style = {} }) {
  return (
    <div
      className={`shimmer rounded-md ${className}`}
      style={{ background: 'rgba(255,255,255,0.04)', ...style }}
    />
  );
}

export default function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI cards skeleton */}
      <div>
        <SkeletonBox style={{ height: 14, width: 120, marginBottom: 12 }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <SkeletonBox style={{ width: 36, height: 36, borderRadius: 6 }} />
                <SkeletonBox style={{ width: 48, height: 18, borderRadius: 4 }} />
              </div>
              <div>
                <SkeletonBox style={{ height: 28, width: '60%', marginBottom: 8 }} />
                <SkeletonBox style={{ height: 12, width: '80%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Line chart skeleton */}
      <div className="card p-5">
        <SkeletonBox style={{ height: 14, width: 160, marginBottom: 6 }} />
        <SkeletonBox style={{ height: 10, width: 100, marginBottom: 20 }} />
        <SkeletonBox style={{ height: 180, borderRadius: 6 }} />
      </div>

      {/* Sources + devices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card p-5">
          <SkeletonBox style={{ height: 14, width: 120, marginBottom: 6 }} />
          <SkeletonBox style={{ height: 10, width: 80, marginBottom: 20 }} />
          <SkeletonBox style={{ height: 160, borderRadius: 6 }} />
        </div>
        <div className="card p-5">
          <SkeletonBox style={{ height: 14, width: 120, marginBottom: 6 }} />
          <SkeletonBox style={{ height: 10, width: 80, marginBottom: 20 }} />
          <SkeletonBox style={{ height: 160, borderRadius: 6 }} />
        </div>
      </div>

      {/* Pages + countries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card">
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <SkeletonBox style={{ height: 14, width: 80, marginBottom: 6 }} />
            <SkeletonBox style={{ height: 10, width: 140 }} />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <SkeletonBox style={{ width: 24, height: 14 }} />
              <SkeletonBox style={{ flex: 1, height: 14 }} />
              <SkeletonBox style={{ width: 60, height: 14 }} />
              <SkeletonBox style={{ width: 40, height: 14 }} />
            </div>
          ))}
        </div>
        <div className="card p-5">
          <SkeletonBox style={{ height: 14, width: 120, marginBottom: 6 }} />
          <SkeletonBox style={{ height: 10, width: 80, marginBottom: 16 }} />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="mb-4">
              <SkeletonBox style={{ height: 12, width: '70%', marginBottom: 6 }} />
              <SkeletonBox style={{ height: 4 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
