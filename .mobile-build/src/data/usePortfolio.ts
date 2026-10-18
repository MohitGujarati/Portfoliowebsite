import { useEffect, useRef, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parsePortfolio, type Portfolio } from './model';
import { fetchPortfolio } from './api';

const CACHE = 'mohit:portfolio:v1';
const api = (process.env.EXPO_PUBLIC_API_URL || '').trim().replace(/\/$/, '');

export function usePortfolio() {
  const [data, setData] = useState<Portfolio | null>(null);
  const [source, setSource] = useState<'loading' | 'cached' | 'live'>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState('');
  const active = useRef(true);
  const busy = useRef(false);
  const hasData = useRef(false);
  const abort = useRef<AbortController | null>(null);
  const refresh = useCallback(async () => {
    if (busy.current) return;
    if (!api) {
      setNotice('API URL is missing. Add EXPO_PUBLIC_API_URL to .env and restart Expo.');
      return;
    }
    busy.current = true;
    setRefreshing(true);
    const controller = new AbortController();
    abort.current = controller;
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const valid = await fetchPortfolio(api, controller.signal);
      if (!active.current) return;
      hasData.current = true;
      setData(valid);
      setSource('live');
      setNotice('Portfolio updated.');
      await AsyncStorage.setItem(CACHE, JSON.stringify(valid)).catch(() => {
        if (active.current) setNotice('Updated. Offline caching is unavailable on this device.');
      });
    } catch {
      if (active.current)
        setNotice(
          hasData.current
            ? 'Could not reach the server. Showing the last synced data.'
            : 'Could not load portfolio data. Start the API server and try again.',
        );
    } finally {
      clearTimeout(timeout);
      controller.abort();
      busy.current = false;
      if (active.current) setRefreshing(false);
    }
  }, []);
  useEffect(() => {
    active.current = true;
    (async () => {
      try {
        const cached = await AsyncStorage.getItem(CACHE);
        const valid = cached ? parsePortfolio(JSON.parse(cached)) : null;
        if (valid && active.current) {
          hasData.current = true;
          setData(valid);
          setSource('cached');
        }
      } catch {
        /* Ignore corrupt cache; the live request below remains authoritative. */
      }
      if (active.current) void refresh();
    })();
    return () => {
      active.current = false;
      abort.current?.abort();
    };
  }, [refresh]);
  return { data, source, refreshing, notice, refresh, clearNotice: () => setNotice('') };
}
