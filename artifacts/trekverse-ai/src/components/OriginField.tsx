import { resolveOrigin, supportedOrigins } from '@/lib/planning';

export default function OriginField({ value, onChange, id }: { value: string; onChange: (city: string) => void; id: string }) {
  const result = resolveOrigin(value);
  return <div className="field origin-field">
    <label htmlFor={id}>Starting city</label>
    <input id={id} aria-label="Starting city" aria-describedby={`${id}-help`} aria-invalid={result.kind !== 'city'} list={`${id}-cities`} value={value} onChange={event => onChange(event.target.value)} placeholder="e.g. Kuala Lumpur, Malaysia" autoComplete="off" required />
    <datalist id={`${id}-cities`}>{supportedOrigins.map(origin => <option key={origin.city} value={origin.city}>{origin.country}</option>)}</datalist>
    <p id={`${id}-help`} className={`origin-help ${result.kind === 'city' ? '' : 'origin-error'}`} role={result.kind === 'city' ? 'status' : 'alert'}>{result.message}</p>
    {result.suggestions.length > 0 && <div className="filters">{result.suggestions.map(city => <button key={city} type="button" className="chip" onClick={() => onChange(city)}>Use {city}</button>)}</div>}
    {result.kind === 'unsupported' && <p className="origin-help">Available cities: {supportedOrigins.map(origin => origin.city).join(', ')}.</p>}
  </div>;
}
