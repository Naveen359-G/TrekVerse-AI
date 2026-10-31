/** Optional, explicit-request-only OSM discovery. No routing or safety claims. */
export type DiscoveredCity = {
  id: string;
  label: string;
  country: string;
  lat: number;
  lon: number;
  sourceUrl: string;
};
export type NearbyPlace = {
  id: string;
  name: string;
  kind: string;
  lat: number;
  lon: number;
  distanceKm: number;
  sourceUrl: string;
};
export type DiscoveryResult<T> = { items: T[]; fetchedAt: number; cached: boolean };
const TTL = 24 * 60 * 60 * 1000;
const PREFIX = 'tv-discovery-v1:';
const memory = new Map<string, DiscoveryResult<unknown>>();
const pending = new Map<string, Promise<DiscoveryResult<unknown>>>();
let lastCityRequest = 0;

export class DiscoveryError extends Error {
  constructor(public code: 'offline' | 'timeout' | 'unavailable', message: string) { super(message); }
}
const validCoordinates = (lat: number, lon: number) => Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
export function isDiscoveredCity(value: unknown): value is DiscoveredCity {
  const city = value as DiscoveredCity | undefined;
  return !!city && typeof city.id === 'string' && /^osm-(node|way|relation)-\d+$/.test(city.id) &&
    typeof city.label === 'string' && typeof city.country === 'string' &&
    validCoordinates(city.lat, city.lon) && /^https:\/\/www\.openstreetmap\.org\/(node|way|relation)\/\d+$/.test(city.sourceUrl);
}
export function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const dLat = radians(b.lat - a.lat), dLon = radians(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
}
async function cachedRequest<T>(key: string, validate: (value: unknown) => value is T, load: () => Promise<T[]>): Promise<DiscoveryResult<T>> {
  let stored = memory.get(key);
  try { stored ??= JSON.parse(localStorage.getItem(PREFIX + key) || 'null'); } catch { /* Cache is optional. */ }
  if (stored && Array.isArray(stored.items) && stored.items.every(validate) && stored.fetchedAt <= Date.now() && Date.now() - stored.fetchedAt < TTL)
    return { ...stored, cached: true } as DiscoveryResult<T>;
  const existing = pending.get(key);
  if (existing) return existing as Promise<DiscoveryResult<T>>;
  if (typeof navigator !== 'undefined' && !navigator.onLine)
    throw new DiscoveryError('offline', 'Offline. Curated catalogs still work. Connect to search online; only unexpired cached searches are available offline.');
  const request = (async () => {
    const result = { items: await load(), fetchedAt: Date.now(), cached: false };
    if (memory.size >= 40) memory.delete(memory.keys().next().value!);
    memory.set(key, result);
    try {
      // Bound the persistent cache, including empty results.
      const keys = Object.keys(localStorage).filter(item => item.startsWith(PREFIX));
      if (keys.length >= 40) localStorage.removeItem(keys[0]);
      localStorage.setItem(PREFIX + key, JSON.stringify(result));
    } catch { /* Storage quota/private mode must not prevent online discovery. */ }
    return result;
  })();
  pending.set(key, request);
  try { return await request; } finally { pending.delete(key); }
}
async function fetchJson(url: string, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal, credentials: 'omit' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch {
    if (controller.signal.aborted) throw new DiscoveryError('timeout', 'Online search timed out after 12 seconds. Retry later or use a curated city.');
    throw new DiscoveryError('unavailable', `The map provider is unavailable or the connection failed. Retry later. No unrelated destinations were substituted.`);
  } finally { clearTimeout(timeout); }
}
export function searchCities(query: string): Promise<DiscoveryResult<DiscoveredCity>> {
  const text = query.trim().replace(/\s+/g, ' ');
  if (text.length < 2 || text.length > 120) return Promise.reject(new Error('Enter a city name between 2 and 120 characters.'));
  return cachedRequest(`city:${text.toLowerCase()}`, isDiscoveredCity, async () => {
    // Nominatim disallows autocomplete: only a deliberate button press calls this.
    if (Date.now() - lastCityRequest < 1100) throw new DiscoveryError('unavailable', 'Please wait a moment before another city search.');
    lastCityRequest = Date.now();
    const params = new URLSearchParams({ q: text, format: 'jsonv2', addressdetails: '1', limit: '8', featuretype: 'city', 'accept-language': 'en' });
    const data = await fetchJson(`https://nominatim.openstreetmap.org/search?${params}`);
    if (!Array.isArray(data)) throw new DiscoveryError('unavailable', 'The city provider returned an invalid response.');
    const cities = data.flatMap(item => {
      if (!item || !['city', 'town', 'village', 'municipality', 'borough'].includes(item.addresstype) ||
          !['node', 'way', 'relation'].includes(item.osm_type) || !/^\d+$/.test(String(item.osm_id))) return [];
      const city: DiscoveredCity = {
        id: `osm-${item.osm_type}-${item.osm_id}`, label: item.display_name,
        country: item.address?.country || '', lat: Number(item.lat), lon: Number(item.lon),
        sourceUrl: `https://www.openstreetmap.org/${item.osm_type}/${item.osm_id}`,
      };
      return isDiscoveredCity(city) ? [city] : [];
    });
    return [...new Map(cities.map(city => [city.id, city])).values()];
  });
}
export function searchNearby(city: DiscoveredCity): Promise<DiscoveryResult<NearbyPlace>> {
  if (!isDiscoveredCity(city)) return Promise.reject(new Error('Select a city from the online results first.'));
  const isPlace = (value: unknown): value is NearbyPlace => {
    const place = value as NearbyPlace | undefined;
    return !!place && typeof place.id === 'string' && typeof place.name === 'string' && typeof place.kind === 'string' &&
      validCoordinates(place.lat, place.lon) && Number.isFinite(place.distanceKm) && place.distanceKm >= 0 && place.distanceKm <= 25 &&
      /^https:\/\/www\.openstreetmap\.org\/(node|way|relation)\/\d+$/.test(place.sourceUrl) && distanceKm(city, place) <= 25;
  };
  return cachedRequest(`nearby:${city.id}:${city.lat}:${city.lon}`, isPlace, async () => {
    const around = `(around:25000,${city.lat},${city.lon})`;
    const query = `[out:json][timeout:10];(nwr["leisure"="nature_reserve"]${around};nwr["leisure"="park"]${around};nwr["tourism"="viewpoint"]${around};nwr["natural"="waterfall"]${around};nwr["natural"="peak"]${around};);out center tags 100;`;
    const data = await fetchJson('https://overpass-api.de/api/interpreter', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ data: query }),
    });
    // A partial query is not a reliable no-results response.
    if (!data || !Array.isArray(data.elements) || data.remark) throw new DiscoveryError('unavailable', 'Nearby search was incomplete. Retry later; no other city’s results will be shown.');
    const places: NearbyPlace[] = data.elements.flatMap((item: any) => {
      if (!item || typeof item !== 'object') return [];
      const lat = Number(item.lat ?? item.center?.lat), lon = Number(item.lon ?? item.center?.lon);
      const name = item.tags?.['name:en'] || item.tags?.name;
      if (typeof name !== 'string' || !name.trim() || !validCoordinates(lat, lon) ||
          !['node', 'way', 'relation'].includes(item.type) || !/^\d+$/.test(String(item.id))) return [];
      const distance = distanceKm(city, { lat, lon });
      if (distance > 25) return [];
      const kind = item.tags.leisure === 'nature_reserve' ? 'Nature reserve' : item.tags.leisure === 'park' ? 'Park' :
        item.tags.tourism === 'viewpoint' ? 'Viewpoint' : item.tags.natural === 'waterfall' ? 'Waterfall' :
        item.tags.natural === 'peak' ? 'Peak' : null;
      if (!kind) return [];
      return [{ id: `${item.type}-${item.id}`, name, kind, lat, lon, distanceKm: Math.round(distance * 10) / 10,
        sourceUrl: `https://www.openstreetmap.org/${item.type}/${item.id}` }];
    });
    return [...new Map(places.map(place => [place.id, place])).values()].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 30);
  });
}
