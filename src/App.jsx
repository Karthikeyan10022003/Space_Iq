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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('analytics');
  const [dateFilter, setDateFilter] = useState('last7days');

  const { data, loading, error, lastUpdated, refreshing, refresh } = useRealtimeData(dateFilter);

  const handleNavClick = useCallback((pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 backdrop-blur-sm"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex`}>
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(p => !p)}
          activePage={activePage}
          onNavClick={handleNavClick}
        />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <TopHeader
          activePage={activePage}
          lastUpdated={lastUpdated}
          refreshing={refreshing}
          onRefresh={refresh}
          sidebarCollapsed={sidebarCollapsed}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Content */}
        <main className="flex-1 overflow-y-auto custom-scroll p-5 lg:p-6">
          {activePage === 'analytics'     && <AnalyticsPage data={data} loading={loading} error={error} onRetry={refresh} dateFilter={dateFilter} />}
          {activePage === 'google_ads'    && <GoogleAdsPage />}
          {activePage === 'facebook_ads'  && <FacebookAdsPage />}
          {activePage === 'linkedin'      && <LinkedInPage />}
        </main>
      </div>
    </div>
  );
}
