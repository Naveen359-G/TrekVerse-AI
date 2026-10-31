import { useEffect, useRef, useState } from 'react';
import { resolveOrigin, supportedOrigins } from '@/lib/planning';
import { searchCities, type DiscoveredCity, type DiscoveryResult } from '@/lib/discovery';

export default function OriginField({ value, selected, onChange, id }: {
  value: string; selected?: DiscoveredCity;
  onChange: (city: string, selected?: DiscoveredCity) => void; id: string;
}) {
  const result = resolveOrigin(value, selected);
  const [response, setResponse] = useState<DiscoveryResult<DiscoveredCity>>();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const request = useRef(0);
  useEffect(() => {
    request.current++;
    setResponse(undefined); setStatus(''); setLoading(false);
    return () => { request.current++; };
  }, [value, selected?.id]);
  const search = async () => {
    const token = ++request.current;
    setLoading(true); setResponse(undefined); setStatus('');
    try {
      const data = await searchCities(value);
      if (token !== request.current) return;
      setResponse(data);
      setStatus(data.items.length ? 'Choose the city and region you mean. No city is selected automatically.' : 'No matching cities found. Add a region or country and try again. Countries alone are not starting cities.');
    } catch (error) { if (token === request.current) setStatus(error instanceof Error ? error.message : 'City search failed. Retry later.'); }
    finally { if (token === request.current) setLoading(false); }
  };
  return <div className="field origin-field">
    <label htmlFor={id}>Starting city</label>
    <input id={id} aria-label="Starting city" aria-describedby={`${id}-help`} aria-invalid={result.kind !== 'city'} list={`${id}-cities`} value={value} onChange={event => onChange(event.target.value)} placeholder="e.g. Vancouver, Canada" autoComplete="off" required maxLength={120} />
    <datalist id={`${id}-cities`}>{supportedOrigins.map(origin => <option key={origin.city} value={origin.city}>{origin.country}</option>)}</datalist>
    <p id={`${id}-help`} className={`origin-help ${result.kind === 'city' ? '' : 'origin-error'}`}>{result.message}</p>
    {result.suggestions.length > 0 && <div className="filters">{result.suggestions.map(city => <button key={city} type="button" className="chip" onClick={() => onChange(city)}>Use {city}</button>)}</div>}
    <p className="origin-help">Curated cities work offline. Optional online search sends only the typed city to Nominatim; nearby search sends the selected coordinates to Overpass. No trip or group data is sent. Queries and results are stored on this device; cached results can be reused for 24 hours.</p>
    <button type="button" className="btn ghost small" disabled={loading || value.trim().length < 2} onClick={search}>{loading ? 'Searching cities…' : 'Search cities online'}</button>
    <p className="origin-help" role="status" aria-live="polite">{status}</p>
    {response && <>
      <p className="origin-help">{response.cached ? 'Cached' : 'Fetched'} {new Date(response.fetchedAt).toLocaleString()} · cache valid for 24 hours.</p>
      <ul>{response.items.map(city => <li key={city.id}>
        <button className="btn ghost small" type="button" onClick={() => onChange(city.label, city)}>Use {city.label}</button>{' '}
        <a href={city.sourceUrl} target="_blank" rel="noreferrer">Map source</a>
      </li>)}</ul>
    </>}
    {selected && value === selected.label && <p className="origin-help"><a href={selected.sourceUrl} target="_blank" rel="noreferrer">Selected city source</a> · {selected.lat.toFixed(4)}, {selected.lon.toFixed(4)}</p>}
    <p className="origin-help">City search: Nominatim · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors (ODbL)</a></p>
  </div>;
}
