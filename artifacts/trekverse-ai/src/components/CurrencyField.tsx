import { useEffect, useRef, useState } from 'react';
import { currencies, currencyOrINR, exchangeReference, refreshExchangeRates, snapshotRates, type Currency, type ExchangeRates } from '@/lib/currency';

export function CurrencyNote({ rates = exchangeReference }: { rates?: ExchangeRates }) {
  return <p className="origin-help" data-testid="text-rate-provenance">Illustrative destination prices, not live quotes. Conversion provider: <a data-testid="link-rate-provider" href={rates.source} target="_blank" rel="noreferrer">{rates.provider}</a>. Rate date: {rates.date}. {rates.retrievedAt ? `Retrieved: ${new Date(rates.retrievedAt).toLocaleString()}.` : 'Bundled offline reference; no online refresh.'} 1 EUR = {currencies.map(currency => `${currency} ${rates.perEUR[currency]}`).join(' / ')}. Reference rates are not retail quotes; fees and current rates may differ.</p>;
}
export default function CurrencyField({ value, onChange, rates = exchangeReference, onRatesChange }: { value?: Currency; onChange: (currency: Currency) => void; rates?: ExchangeRates; onRatesChange?: (rates: ExchangeRates) => void }) {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const refresh = async () => {
    setLoading(true);
    setStatus('Retrieving latest published reference rates…');
    try {
      const next = await refreshExchangeRates();
      if (!mounted.current) return;
      onRatesChange?.(next);
      setStatus(`Refresh succeeded. Published rates dated ${next.date} selected for new plans. Budget inputs and existing trips are unchanged.`);
    } catch (error) {
      if (mounted.current) setStatus(error instanceof Error ? error.message : 'Refresh failed. Rates are unchanged.');
    } finally {
      if (mounted.current) setLoading(false);
    }
  };
  return <div className="field"><label>Planning currency
    <select data-testid="select-planning-currency" aria-label="Planning currency" value={currencyOrINR(value)} onChange={event => onChange(currencyOrINR(event.target.value))}>
      {currencies.map(currency => <option key={currency} value={currency}>{currency === 'INR' ? 'INR · Indian rupee' : currency === 'MYR' ? 'MYR · Malaysian ringgit' : 'SGD · Singapore dollar'}</option>)}
    </select>
  </label><p className="origin-help">Changing currency converts budget amounts using the selected reference below. Rate selection applies to new plans only; existing trips keep their currency and historical rates. Refreshing does not change budget inputs.</p><CurrencyNote rates={rates}/>
  {onRatesChange && <><div className="filters">
    <button type="button" data-testid="button-refresh-rates" className="btn ghost small" disabled={loading} onClick={refresh}>{loading ? 'Refreshing rates…' : 'Refresh rates for new plans'}</button>
    <button type="button" data-testid="button-offline-rates" className="btn ghost small" disabled={loading} onClick={() => { onRatesChange(snapshotRates()); setStatus('Bundled offline rates selected for new plans. Existing trips and budget inputs are unchanged.'); }}>Use bundled offline rates</button>
  </div><p role="status" aria-live="polite" data-testid="status-rate-retrieval" className="origin-help">{status || (rates.retrievedAt ? 'Previously retrieved rates selected; no request in progress.' : 'Offline default selected; no request made.')}</p></>}
  </div>;
}
