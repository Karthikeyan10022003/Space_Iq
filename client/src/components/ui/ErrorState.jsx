export default function ErrorState({ error, onRetry }) {
  const isAuth = error?.includes('Not authenticated') || error?.includes('401');

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md px-6 animate-fade-in">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-xl mx-auto mb-5 flex items-center justify-center"
          style={{ background: 'rgba(225,29,72,0.1)', border: '1px solid rgba(225,29,72,0.2)' }}
        >
          {isAuth ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          )}
        </div>

        <h2 className="text-lg font-bold text-white mb-2">
          {isAuth ? 'Authentication Required' : 'Failed to Load Data'}
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          {isAuth
            ? 'You need to authorize Google Analytics access first.'
            : error || 'An unexpected error occurred while fetching analytics data.'}
        </p>

        <div className="flex items-center justify-center gap-3">
          {isAuth && (
            <a
              href={import.meta.env.PROD ? 'https://space-iq-iota.vercel.app/auth/login' : '/auth/login'}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{ background: 'var(--accent-gold)', color: '#fff' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Connect Google Analytics
            </a>
          )}
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
