import { useCallback, useEffect } from 'react';
import { API_ENDPOINTS } from './api-config';

interface TrackEventPayload {
  event_type: 'page_view' | 'product_click';
  page_url?: string;
  product_id?: string;
  visitor_id?: string;
  country?: string;
  language?: string;
  referrer?: string;
}

function generateVisitorId(): string {
  if (typeof window === 'undefined') return 'server';
  const stored = sessionStorage.getItem('visitor_id');
  if (stored) return stored;

  const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  sessionStorage.setItem('visitor_id', id);
  return id;
}

function getClientInfo() {
  if (typeof window === 'undefined') {
    return { country: null, language: null };
  }

  return {
    country: (Intl.DateTimeFormat().resolvedOptions().timeZone || '').split('/')[0] || null,
    language: navigator.language || null,
  };
}

export async function trackEvent(payload: TrackEventPayload): Promise<void> {
  try {
    const { country, language } = getClientInfo();
    const visitor_id = generateVisitorId();

    const body = {
      ...payload,
      visitor_id,
      country,
      language,
    };

    await fetch(API_ENDPOINTS.analyticsTrack, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch {
    // Silently fail - analytics should not break the app
  }
}

export function usePageTracking(pageUrl?: string) {
  const trackPageView = useCallback((url?: string) => {
    trackEvent({
      event_type: 'page_view',
      page_url: url || pageUrl || (typeof window !== 'undefined' ? window.location.pathname : '/'),
    });
  }, [pageUrl]);

  useEffect(() => {
    trackPageView();
  }, [trackPageView]);
}

export function useProductTracking() {
  const trackClick = useCallback((productId: string, pageUrl?: string) => {
    trackEvent({
      event_type: 'product_click',
      product_id: productId,
      page_url: pageUrl || (typeof window !== 'undefined' ? window.location.pathname : '/'),
    });
  }, []);

  return { trackClick };
}