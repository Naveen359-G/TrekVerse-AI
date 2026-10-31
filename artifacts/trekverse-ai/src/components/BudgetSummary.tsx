import { destinationCost, formatMoney, lowestBudget } from '@/lib/currency';
import type { PlanningDestination, PlanningMember, PlanningPreferences } from '@/lib/planning';
import { CurrencyNote } from './CurrencyField';

export default function BudgetSummary({ destination, preferences, members }: {
  destination: PlanningDestination; preferences: PlanningPreferences; members: PlanningMember[];
}) {
  const currency = preferences.currency ?? 'INR';
  const cost = destinationCost(destination, currency, preferences.exchangeRates);
  const cap = lowestBudget(preferences, members);
  return <div className="notice">
    <strong>Planning currency: {currency}</strong>
    <div className="budget-row"><span>Estimate / person</span><strong>{formatMoney(cost, currency)}</strong></div>
    <div className="budget-row"><span>Lowest limit / person</span><strong>{formatMoney(cap, currency)}</strong></div>
    <div className="budget-row"><span>Estimate · {members.length} travellers</span><strong>{formatMoney(cost * members.length, currency)}</strong></div>
    <div className="budget-row"><span>Shared ceiling · lowest limit × {members.length}</span><strong>{formatMoney(cap * members.length, currency)}</strong></div>
    <CurrencyNote rates={preferences.exchangeRates}/>
  </div>;
}
