import assert from 'node:assert/strict';
import test from 'node:test';
import { DiscoveryError, distanceKm, isDiscoveredCity, searchCities, searchNearby, type DiscoveredCity } from '../src/lib/discovery.ts';
import { matchesOrigin, resolveOrigin } from '../src/lib/planning.ts';

const city: DiscoveredCity = { id: 'osm-relation-9001', label: 'Springfield, Illinois, United States', country: 'United States', lat: 39.8, lon: -89.65, sourceUrl: 'https://www.openstreetmap.org/relation/9001' };
const json = (data: unknown) => new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
const cityRow = (id: number, label: string) => ({ osm_type: 'relation', osm_id: id, lat: '39.8', lon: '-89.65', display_name: label, addresstype: 'city', address: { country: 'United States' } });
function online(t: any, value = true) {
  t.mock.getter(globalThis, 'navigator', () => ({ onLine: value }));
}

test('an external city requires explicit disambiguated selection and cannot match a curated catalog', () => {
  assert.equal(resolveOrigin('Springfield').kind, 'unsupported');
  assert.equal(resolveOrigin(city.label, city).kind, 'city');
  assert.equal(resolveOrigin('Some other city', city).kind, 'unsupported');
  assert.equal(matchesOrigin({ originCity: 'Hyderabad' }, city.label), false);
  assert.equal(matchesOrigin({ originCity: 'Kuala Lumpur' }, city.label), false);
  assert.equal(isDiscoveredCity({ ...city, lat: 100 }), false);
  assert.equal(isDiscoveredCity({ ...city, sourceUrl: 'javascript:alert(1)' }), false);
  const saved = { preferences: { city: 'Hyderabad' }, destinationId: 'ananthagiri' };
  const before = JSON.stringify(saved);
  resolveOrigin(city.label, city);
  assert.equal(JSON.stringify(saved), before);
});

test('manual city lookup retains ambiguous choices, rejects countries, caches, and supports offline cache', async t => {
  online(t);
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async (input: string) => {
    calls++;
    assert.match(String(input), /nominatim/);
    assert.match(String(input), /q=Springfield/);
    return json([cityRow(9001, city.label), cityRow(9002, 'Springfield, Massachusetts, United States'),
      { ...cityRow(9003, 'United States'), addresstype: 'country' }, null]);
  });
  const result = await searchCities('Springfield');
  assert.equal(result.items.length, 2);
  assert.equal(result.cached, false);
  assert.notEqual(result.items[0].id, result.items[1].id);
  assert.equal((await searchCities(' Springfield ')).cached, true);
  assert.equal(calls, 1);
  t.mock.restoreAll();
  online(t, false);
  assert.equal((await searchCities('Springfield')).items.length, 2);
  await assert.rejects(searchCities('Uncached City'), (error: DiscoveryError) => error.code === 'offline');
});

test('nearby lookup uses selected coordinates and only source-backed named places in radius', async t => {
  online(t);
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async (url: string, options: RequestInit) => {
    calls++;
    assert.match(url, /overpass/);
    assert.match(String(options.body), /39.8%2C-89.65/);
    return json({ elements: [
      { type: 'node', id: 1, lat: 39.81, lon: -89.65, tags: { name: 'Local Park', leisure: 'park' } },
      { type: 'way', id: 2, center: { lat: 39.82, lon: -89.65 }, tags: { name: 'Reserve', leisure: 'nature_reserve' } },
      { type: 'node', id: 1, lat: 39.81, lon: -89.65, tags: { name: 'Local Park', leisure: 'park' } },
      { type: 'node', id: 3, lat: 17.4, lon: 78.5, tags: { name: 'Unrelated Hyderabad Park', leisure: 'park' } },
      { type: 'node', id: 4, lat: 39.81, lon: -89.65, tags: { leisure: 'park' } },
      { type: 'node', id: 5, lat: 39.81, lon: -89.65, tags: { name: 'Unknown feature' } },
      { type: 'node', id: 6, lat: 999, lon: -89.65, tags: { name: 'Bad coordinates', leisure: 'park' } },
      null,
    ] });
  });
  const result = await searchNearby(city);
  assert.deepEqual(result.items.map(place => place.name), ['Local Park', 'Reserve']);
  assert.equal(result.items[0].sourceUrl, 'https://www.openstreetmap.org/node/1');
  assert.ok(result.items.every(place => !('difficulty' in place) && !('hours' in place) && !('cost' in place)));
  assert.equal((await searchNearby(city)).cached, true);
  assert.equal(calls, 1);
  assert.equal(distanceKm(city, city), 0);
  assert.ok(distanceKm(city, { lat: 17.4, lon: 78.5 }) > 25);
});

test('empty nearby results are honest and cached without a fallback', async t => {
  online(t);
  t.mock.method(globalThis, 'fetch', async () => json({ elements: [] }));
  const emptyCity = { ...city, id: 'osm-relation-9010' };
  assert.deepEqual((await searchNearby(emptyCity)).items, []);
  assert.equal((await searchNearby(emptyCity)).cached, true);
});

test('partial, failed, malformed and offline responses never become unrelated candidates', async t => {
  online(t);
  t.mock.method(globalThis, 'fetch', async () => json({ elements: [], remark: 'runtime error: Query timed out' }));
  const failedCity = { ...city, id: 'osm-relation-9020' };
  await assert.rejects(searchNearby(failedCity), /incomplete/);
  // Errors are not cached; a retry can succeed.
  globalThis.fetch = async () => json({ elements: [] });
  assert.deepEqual((await searchNearby(failedCity)).items, []);
  globalThis.fetch = async () => new Response('', { status: 429 });
  await assert.rejects(searchNearby({ ...city, id: 'osm-relation-9021' }), (error: DiscoveryError) => error.code === 'unavailable');
  globalThis.fetch = async () => json(null);
  await assert.rejects(searchNearby({ ...city, id: 'osm-relation-9022' }), /incomplete/);
  t.mock.restoreAll();
  online(t, false);
  await assert.rejects(searchNearby({ ...city, id: 'osm-relation-9023' }), (error: DiscoveryError) => error.code === 'offline');
});

test('a stalled provider aborts within the timeout', async t => {
  online(t);
  t.mock.timers.enable({ apis: ['setTimeout'] });
  t.mock.method(globalThis, 'fetch', async (_url: string, options: RequestInit) => new Promise((_resolve, reject) => {
    options.signal!.addEventListener('abort', () => reject(new Error('aborted')));
  }));
  const result = searchNearby({ ...city, id: 'osm-relation-9030' });
  const rejection = assert.rejects(result, (error: DiscoveryError) => error.code === 'timeout');
  t.mock.timers.tick(12000);
  await rejection;
});

test('concurrent requests for one origin share a fetch; another origin never shares its results', async t => {
  online(t);
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => { calls++; return json({ elements: [] }); });
  const target = { ...city, id: 'osm-relation-9040' };
  await Promise.all([searchNearby(target), searchNearby(target)]);
  assert.equal(calls, 1);
  await searchNearby({ ...target, id: 'osm-relation-9041', lat: 40 });
  assert.equal(calls, 2);
});

test('expired results are not silently reused offline', async t => {
  online(t);
  t.mock.method(globalThis, 'fetch', async () => json({ elements: [] }));
  const target = { ...city, id: 'osm-relation-9050' };
  const result = await searchNearby(target);
  t.mock.method(Date, 'now', () => result.fetchedAt + 25 * 60 * 60 * 1000);
  t.mock.restoreAll();
  online(t, false);
  t.mock.method(Date, 'now', () => result.fetchedAt + 25 * 60 * 60 * 1000);
  await assert.rejects(searchNearby(target), (error: DiscoveryError) => error.code === 'offline');
});

test('persisted source results survive a new session; damaged entries are not used', async t => {
  online(t, false);
  const target = { ...city, id: 'osm-relation-9060' };
  const entry = { items: [{ id: 'node-10', name: 'Cached Park', kind: 'Park', lat: 39.81, lon: -89.65, distanceKm: 1.1,
    sourceUrl: 'https://www.openstreetmap.org/node/10' }], fetchedAt: Date.now(), cached: false };
  const storage = { getItem: () => JSON.stringify(entry) };
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });
  try {
    const result = await searchNearby(target);
    assert.equal(result.cached, true);
    assert.equal(result.items[0].name, 'Cached Park');
    entry.items[0].sourceUrl = 'https://untrusted.invalid/place';
    await assert.rejects(searchNearby(target), (error: DiscoveryError) => error.code === 'offline');
  } finally { Reflect.deleteProperty(globalThis, 'localStorage'); }
});
