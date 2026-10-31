import { useEffect, useRef, useState } from 'react';
import { searchNearby, type DiscoveredCity, type DiscoveryResult, type NearbyPlace } from '@/lib/discovery';

export default function NearbyDiscovery({ city }: { city: DiscoveredCity }) {
  const [response, setResponse] = useState<DiscoveryResult<NearbyPlace>>();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const request = useRef(0);
  useEffect(() => {
    request.current++; setResponse(undefined); setStatus(''); setLoading(false);
    return () => { request.current++; };
  }, [city.id, city.lat, city.lon]);
  const search = async () => {
    const token = ++request.current;
    setLoading(true); setResponse(undefined); setStatus('');
    try {
      const result = await searchNearby(city);
      if (token !== request.current) return;
      setResponse(result);
      setStatus(result.items.length ? `${result.items.length} named map candidates found.` : 'No named nearby places found within 25 km in this source. Coverage may be incomplete. Try another city; no unrelated places were substituted.');
    } catch (error) { if (token === request.current) setStatus(error instanceof Error ? error.message : 'Nearby search failed. Please retry later.'); }
    finally { if (token === request.current) setLoading(false); }
  };
  return <section className="panel">
    <h2>Nearby map candidates</h2>
    <p>Parks, nature reserves, viewpoints, peaks and waterfalls within 25 km of the selected city coordinates. This is a limited map search, not a complete destination catalog.</p>
    <div className="notice"><strong>Research only — not a planned trek.</strong> Route, travel time, cost, trail grade, accessibility, opening status and safety are unknown. Distances below are straight-line distances to mapped points or feature centers, not driving or walking routes. Confirm with official and local sources before travel. These candidates are not ranked for fitness or used to generate itineraries.</div>
    <button type="button" className="btn lime" onClick={search} disabled={loading}>{loading ? 'Searching nearby…' : 'Find nearby places online'}</button>
    <p role="status" aria-live="polite">{status}</p>
    {response && <p className="origin-help">{response.cached ? 'Cached' : 'Fetched'} {new Date(response.fetchedAt).toLocaleString()} · valid for 24 hours · Overpass API · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors (ODbL)</a></p>}
    <div className="grid-2">{response?.items.map(place => <article className="panel" key={place.id}>
      <span className="eyebrow">{place.kind} · unverified access</span>
      <h3>{place.name}</h3>
      <p>{place.distanceKm} km straight-line from {city.label}</p>
      <p>Trail grade and travel time: unknown. No safety clearance.</p>
      <a className="btn ghost small" href={place.sourceUrl} target="_blank" rel="noreferrer">View mapped place and source</a>
    </article>)}</div>
    {!response && !loading && !status && <p>No online search has run. Curated catalogs and existing saved trips remain available without a network connection.</p>}
  </section>;
}
