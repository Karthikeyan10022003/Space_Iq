import CountriesTable from '../components/analytics/CountriesTable';
import DevicePieChart from '../components/analytics/DevicePieChart';
import KPICards from '../components/analytics/KPICards';
import TopPagesTable from '../components/analytics/TopPagesTable';
import TrafficLineChart from '../components/analytics/TrafficLineChart';
import TrafficSourcesChart from '../components/analytics/TrafficSourcesChart';
import AnalyticsSkeleton from '../components/ui/AnalyticsSkeleton';
import ErrorState from '../components/ui/ErrorState';

export default function AnalyticsPage({ data, loading, error, onRetry }) {
  if (loading) return <AnalyticsSkeleton />;
  if (error)   return <ErrorState error={error} onRetry={onRetry} />;
  if (!data)   return null;

  const realtime      = data.realtime ?? {};
  const overviewPages = data.pages?.pages ?? [];
  const sourcesData   = data.sources?.sources ?? [];
  const devicesData   = data.devices?.devices ?? [];
  const countriesData = data.realtimeCountries?.countries ?? [];

  return (
    <div className="space-y-6">
      {/* ── KPI Cards ──────────────────────────────────────────────────────── */}
      <KPICards data={data} />

      {/* ── Traffic over time ──────────────────────────────────────────────── */}
      <TrafficLineChart data={realtime.usersPerMinute ?? []} />

      {/* ── Sources + Devices ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <TrafficSourcesChart sources={sourcesData} />
        </div>
        <DevicePieChart devices={devicesData} />
      </div>

      {/* ── Top Pages & Countries ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <TopPagesTable pages={overviewPages} />
        </div>
        <div>
          <CountriesTable countries={countriesData} />
        </div>
      </div>
    </div>
  );
}
