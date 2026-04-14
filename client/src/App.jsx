import { useState, useCallback } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopHeader from './components/layout/TopHeader';
import AnalyticsPage from './pages/AnalyticsPage';
import GoogleAdsPage from './pages/GoogleAdsPage';
import FacebookAdsPage from './pages/FacebookAdsPage';
import LinkedInPage from './pages/LinkedInPage';
import useRealtimeData from './hooks/useRealtimeData';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('analytics');

  const { data, loading, error, lastUpdated, refreshing, refresh } = useRealtimeData();

  const handleNavClick = useCallback((pageId) => {
    setActivePage(pageId);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(p => !p)}
        activePage={activePage}
        onNavClick={handleNavClick}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <TopHeader
          activePage={activePage}
          lastUpdated={lastUpdated}
          refreshing={refreshing}
          onRefresh={refresh}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto custom-scroll p-5 lg:p-6">
          {activePage === 'analytics'     && <AnalyticsPage data={data} loading={loading} error={error} onRetry={refresh} />}
          {activePage === 'google_ads'    && <GoogleAdsPage />}
          {activePage === 'facebook_ads'  && <FacebookAdsPage />}
          {activePage === 'linkedin'      && <LinkedInPage />}
        </main>
      </div>
    </div>
  );
}
