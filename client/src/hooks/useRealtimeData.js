import { useState, useEffect, useCallback, useRef } from 'react';

const BACKEND_URL = import.meta.env.PROD ? 'https://space-iq-iota.vercel.app' : '';
const API_URL = `${BACKEND_URL}/api/dashboard`;
const POLL_INTERVAL = 30_000;

export default function useRealtimeData() {
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing]   = useState(false);
  const timerRef = useRef(null);

  const fetchData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    timerRef.current = setInterval(() => fetchData(), POLL_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [fetchData]);

  const refresh = useCallback(() => {
    clearInterval(timerRef.current);
    fetchData(true);
    timerRef.current = setInterval(() => fetchData(), POLL_INTERVAL);
  }, [fetchData]);

  return { data, loading, error, lastUpdated, refreshing, refresh };
}
