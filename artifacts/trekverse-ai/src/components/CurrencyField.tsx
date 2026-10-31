import { currencies, currencyOrINR, exchangeReference, type Currency } from '@/lib/currency';

export function CurrencyNote() {
  return <p className="origin-help">Illustrative prices, not live quotes. Conversion uses frozen ECB reference rates dated {exchangeReference.date} via <a href={exchangeReference.source} target="_blank" rel="noreferrer">Frankfurter</a> (1 EUR = INR 88.507 / MYR 4.6223 / SGD 1.4091). Fees and current rates may differ.</p>;
}
export default function CurrencyField({ value, onChange }: { value?: Currency; onChange: (currency: Currency) => void }) {
  return <div className="field"><label>Planning currency
    <select aria-label="Planning currency" value={currencyOrINR(value)} onChange={event => onChange(currencyOrINR(event.target.value))}>
      {currencies.map(currency => <option key={currency} value={currency}>{currency === 'INR' ? 'INR · Indian rupee' : currency === 'MYR' ? 'MYR · Malaysian ringgit' : 'SGD · Singapore dollar'}</option>)}
    </select>
  </label><p className="origin-help">Changing currency converts budget amounts using the dated reference below. Saved plans keep their own currency.</p><CurrencyNote/></div>;
}
