import { Platform } from 'react-native';
import { fetchTopStations, searchStations } from '@/lib/radio-browser';

const rawStation = {
  stationuuid: 'secure', name: 'Cosmic Jazz', url: 'https://example.com/live',
  url_resolved: 'https://example.com/live', favicon: null, lastcheckok: 1,
};
const originalFetch = global.fetch;
const mockFetch = jest.fn();
const response = (body: unknown) => ({ ok: true, json: async () => body });

beforeEach(() => {
  global.fetch = mockFetch;
  mockFetch.mockReset();
});

afterEach(() => {
  global.fetch = originalFetch;
  jest.restoreAllMocks();
  jest.useRealTimers();
});

it('does not request empty searches', async () => {
  expect(await searchStations('  ')).toEqual([]);
  expect(mockFetch).not.toHaveBeenCalled();
});

it('requests secure popular stations and sanitizes broken or invalid results', async () => {
  jest.replaceProperty(Platform, 'OS', 'web');
  mockFetch.mockResolvedValue(response([
    rawStation,
    { ...rawStation, stationuuid: 'broken', lastcheckok: 0 },
    { ...rawStation, stationuuid: 'insecure', url_resolved: 'http://example.com/live' },
    { ...rawStation, stationuuid: 'invalid', url_resolved: 'not a URL' },
  ]));

  const stations = await fetchTopStations(20);
  expect(stations).toHaveLength(1);
  expect(stations[0]).toMatchObject({ stationuuid: 'secure', urlResolved: rawStation.url_resolved });
  const url = new URL(mockFetch.mock.calls[0][0]);
  expect(url.pathname).toBe('/json/stations/search');
  expect(Object.fromEntries(url.searchParams)).toMatchObject({
    limit: '20', order: 'clickcount', reverse: 'true', is_https: 'true', hidebroken: 'true',
  });
});

it('trims search queries and sorts popular results in descending order', async () => {
  mockFetch.mockResolvedValue(response([rawStation]));
  await searchStations('  Jazz  ', { order: 'votes' });
  const url = new URL(mockFetch.mock.calls[0][0]);
  expect(Object.fromEntries(url.searchParams)).toMatchObject({ name: 'Jazz', order: 'votes', reverse: 'true' });
});

it('retries another mirror when a server fails', async () => {
  mockFetch.mockRejectedValueOnce(new Error('Offline')).mockResolvedValue(response([rawStation]));
  await expect(searchStations('Jazz')).resolves.toHaveLength(1);
  expect(mockFetch).toHaveBeenCalledTimes(2);
  expect(new URL(mockFetch.mock.calls[0][0]).host).not.toBe(new URL(mockFetch.mock.calls[1][0]).host);
});

it('times out a stalled mirror and tries the next one', async () => {
  jest.useFakeTimers();
  mockFetch.mockImplementationOnce((_url, options: RequestInit) => new Promise((_resolve, reject) => {
    options.signal?.addEventListener('abort', () => reject(new Error('Timed out')));
  })).mockResolvedValue(response([rawStation]));
  const result = searchStations('Jazz');
  await jest.advanceTimersByTimeAsync(8000);
  await expect(result).resolves.toHaveLength(1);
  expect(mockFetch).toHaveBeenCalledTimes(2);
});
