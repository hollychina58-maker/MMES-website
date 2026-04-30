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

  // Map timezone to country code
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  const tzToCountry: Record<string, string> = {
    'Asia/Shanghai': 'CN', 'Asia/Hong_Kong': 'HK', 'Asia/Tokyo': 'JP',
    'Asia/Seoul': 'KR', 'Asia/Singapore': 'SG', 'Asia/Bangkok': 'TH',
    'Asia/Jakarta': 'ID', 'Asia/Kuala_Lumpur': 'MY', 'Asia/Manila': 'PH',
    'Asia/Kolkata': 'IN', 'Asia/Dubai': 'AE', 'Asia/Riyadh': 'SA',
    'Asia/Tehran': 'IR', 'Asia/Baghdad': 'IQ', 'Asia/Kuwait': 'KW',
    'Asia/Qatar': 'QA', 'Asia/Bahrain': 'BH', 'Asia/Oman': 'OM',
    'Asia/Amman': 'JO', 'Asia/Beirut': 'LB', 'Asia/Damascus': 'SY',
    'Asia/Ho_Chi_Minh': 'VN', 'Asia/Phnom_Penh': 'KH', 'Asia/Vientiane': 'LA',
    'Asia/Taipei': 'TW', 'Asia/Kathmandu': 'NP', 'Asia/Colombo': 'LK',
    'Asia/Dhaka': 'BD', 'Asia/Karachi': 'PK', 'Asia/Kabul': 'AF',
    'Asia/Tashkent': 'UZ', 'Asia/Almaty': 'KZ', 'Asia/Baku': 'AZ',
    'Asia/Yerevan': 'AM', 'Asia/Tbilisi': 'GE', 'Asia/Ashgabat': 'TM',
    'Europe/London': 'GB', 'Europe/Paris': 'FR', 'Europe/Berlin': 'DE',
    'Europe/Madrid': 'ES', 'Europe/Rome': 'IT', 'Europe/Lisbon': 'PT',
    'Europe/Amsterdam': 'NL', 'Europe/Brussels': 'BE', 'Europe/Vienna': 'AT',
    'Europe/Zurich': 'CH', 'Europe/Stockholm': 'SE', 'Europe/Oslo': 'NO',
    'Europe/Copenhagen': 'DK', 'Europe/Helsinki': 'FI', 'Europe/Warsaw': 'PL',
    'Europe/Prague': 'CZ', 'Europe/Budapest': 'HU', 'Europe/Bucharest': 'RO',
    'Europe/Athens': 'GR', 'Europe/Moscow': 'RU', 'Europe/Kiev': 'UA',
    'Europe/Minsk': 'BY', 'Europe/Riga': 'LV', 'Europe/Vilnius': 'LT',
    'Europe/Tallinn': 'EE', 'Europe/Sofia': 'BG', 'Europe/Belgrade': 'RS',
    'Europe/Ljubljana': 'SI', 'Europe/Zagreb': 'HR', 'Europe/Sarajevo': 'BA',
    'Europe/Dublin': 'IE',
    'America/New_York': 'US', 'America/Los_Angeles': 'US', 'America/Chicago': 'US',
    'America/Denver': 'US', 'America/Phoenix': 'US', 'America/Anchorage': 'US',
    'America/Honolulu': 'US', 'America/Toronto': 'CA', 'America/Vancouver': 'CA',
    'America/Mexico_City': 'MX', 'America/Guadalajara': 'MX', 'America/Cancun': 'MX',
    'America/Bogota': 'CO', 'America/Lima': 'PE', 'America/Santiago': 'CL',
    'America/Buenos_Aires': 'AR', 'America/Sao_Paulo': 'BR', 'America/Rio': 'BR',
    'America/Caracas': 'VE', 'America/Belem': 'BR', 'America/Montevideo': 'UY',
    'America/Asuncion': 'PY', 'America/La_Paz': 'BO', 'America/Quito': 'EC',
    'America/Panama': 'PA', 'America/San_Jose': 'CR', 'America/Guatemala': 'GT',
    'America/Santo_Domingo': 'DO', 'America/Havana': 'CU', 'America/Kingston': 'JM',
    'America/Port-au-Prince': 'HT', 'America/San_Juan': 'PR',
    'Africa/Cairo': 'EG', 'Africa/Lagos': 'NG', 'Africa/Johannesburg': 'ZA',
    'Africa/Nairobi': 'KE', 'Africa/Accra': 'GH', 'Africa/Casablanca': 'MA',
    'Africa/Tunis': 'TN', 'Africa/Algiers': 'DZ', 'Africa/Dakar': 'SN',
    'Africa/Addis_Ababa': 'ET', 'Africa/Khartoum': 'SD', 'Africa/Dar_es_Salaam': 'TZ',
    'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU', 'Australia/Brisbane': 'AU',
    'Australia/Perth': 'AU', 'Australia/Adelaide': 'AU', 'Australia/Darwin': 'AU',
    'Pacific/Auckland': 'NZ', 'Pacific/Fiji': 'FJ',
  };

  const country = tzToCountry[tz] || null;
  return {
    country,
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