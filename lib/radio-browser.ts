import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { Station } from '@/types/radio';

const RADIO_BROWSER_BASES = [
  'https://all.api.radio-browser.info/',
  'https://de1.api.radio-browser.info/',
  'https://nl1.api.radio-browser.info/',
  'https://us1.api.radio-browser.info/',
];

type SearchSortField = 'name' | 'clickcount' | 'votes' | 'bitrate';

interface RadioBrowserStation {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  favicon: string | null;
  country: string | null;
  countrycode: string | null;
  state: string | null;
  tags: string | null;
  bitrate: number | null;
  homepage: string | null;
  lastcheckok: number;
  codec: string | null;
  hls: number;
  votes: number | null;
  clickcount: number | null;
  language: string | null;
}

interface RequestOptions {
  params?: Record<string, string | number | boolean | null | undefined>;
  method?: 'GET' | 'POST';
}

interface SearchStationsOptions {
  limit?: number;
  order?: SearchSortField;
}

const shouldReverseOrder = (order: SearchSortField) =>
  order === 'clickcount' || order === 'votes' || order === 'bitrate';

const getAppVersion = () => {
  const expoConfig = Constants.expoConfig ?? (Constants as unknown as { manifest?: { version?: string } }).manifest;
  if (expoConfig && 'version' in expoConfig && expoConfig.version) {
    return expoConfig.version;
  }
  return 'dev';
};

const USER_AGENT = `interstellar-fm/${getAppVersion()}`;
let cachedHost: string | null = null;

const sanitizeStation = (station: RadioBrowserStation): Station | null => {
  const resolvedUrl = station.url_resolved || station.url;
  if (!resolvedUrl) {
    return null;
  }

  return {
    stationuuid: station.stationuuid,
    name: station.name,
    url: station.url,
    urlResolved: resolvedUrl,
    favicon: station.favicon,
    country: station.country,
    countryCode: station.countrycode,
    state: station.state,
    tags: station.tags,
    bitrate: station.bitrate,
    homepage: station.homepage,
    language: station.language,
    codec: station.codec,
    votes: station.votes,
    clickCount: station.clickcount,
  };
};

const buildCandidateHosts = () => {
  const candidates = new Set<string>();
  if (cachedHost) {
    candidates.add(cachedHost);
  }
  RADIO_BROWSER_BASES.forEach((host) => candidates.add(host));
  return Array.from(candidates);
};

const appendParams = (url: URL, params?: RequestOptions['params']) => {
  if (!params) {
    return;
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    if (typeof value === 'boolean') {
      url.searchParams.set(key, value ? 'true' : 'false');
    } else {
      url.searchParams.set(key, String(value));
    }
  });
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const hosts = buildCandidateHosts();
  let lastError: unknown;

  for (const host of hosts) {
    try {
      const url = new URL(path.startsWith('/') ? path.slice(1) : path, host);
      appendParams(url, options.params);

      const headers: Record<string, string> = {};
      if (Platform.OS !== 'web') {
        headers['User-Agent'] = USER_AGENT;
        headers['X-User-Agent'] = USER_AGENT;
      }

      const response = await fetch(url.toString(), {
        method: options.method ?? 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Radio Browser request failed with status ${response.status}`);
      }

      const json = (await response.json()) as T;
      cachedHost = host;
      return json;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Unable to reach Radio Browser');
};

export const searchStations = async (
  query: string,
  { limit = 50, order = 'name' }: SearchStationsOptions = {},
): Promise<Station[]> => {
  if (!query?.trim()) {
    return [];
  }

  const selectedOrder = order ?? 'name';
  const payload = await request<RadioBrowserStation[]>('json/stations/search', {
    params: {
      name: query.trim(),
      limit,
      order: selectedOrder,
      reverse: shouldReverseOrder(selectedOrder),
      hidebroken: true,
      is_https: true,
    },
  });

  return payload
    .filter((station) => station.lastcheckok === 1)
    .map(sanitizeStation)
    .filter((station): station is Station => station !== null);
};

export const fetchTopStations = async (limit = 30): Promise<Station[]> => {
  const payload = await request<RadioBrowserStation[]>(`json/stations/topclick/${Math.max(1, limit)}`);

  return payload
    .filter((station) => station.lastcheckok === 1)
    .map(sanitizeStation)
    .filter((station): station is Station => station !== null);
};

export const registerStationClick = async (stationuuid: string): Promise<void> => {
  if (!stationuuid) {
    return;
  }

  try {
    await request('json/url/' + encodeURIComponent(stationuuid));
  } catch (error) {
    console.warn('Failed to register station click', error);
  }
};

export type { SearchSortField };
