export default function CurrencyBudgets() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg text-primary font-body deck-grain">
      <h1 className="absolute left-[6vw] top-[8vh] w-[88vw] font-display font-extrabold text-[4.6vw] leading-[1.08]">Budgets in the group's currency</h1>
      <div className="absolute left-[6vw] top-[30vh] w-[52vw] flex gap-[2vw]">
        <p className="font-display font-extrabold text-[7vw] leading-none">INR</p>
        <p className="font-display font-extrabold text-[7vw] leading-none text-muted">MYR</p>
        <p className="font-display font-extrabold text-[7vw] leading-none text-muted">SGD</p>
      </div>
      <p className="absolute left-[6vw] top-[52vh] w-[46vw] text-[2.3vw] leading-[1.3]">One selection drives consistent budget conversion and formatting across the trip</p>
      <p className="absolute left-[6vw] top-[72vh] w-[46vw] text-[2vw] leading-[1.35] text-muted">Older saved trips without a currency stay in INR, whatever their city</p>
      <div className="absolute left-[60vw] top-[28vh] w-[34vw] h-[62vh] bg-primary text-bg p-[2.8vw] flex flex-col justify-center">
        <p className="text-[1.6vw] uppercase tracking-[0.12em] text-accent font-bold">Rate basis</p>
        <p className="mt-[2vh] font-display font-extrabold text-[2.8vw] leading-[1.15]">2 Jan 2025</p>
        <p className="mt-[2vh] text-[2vw] leading-[1.35]">Frozen ECB reference via Frankfurter</p>
        <p className="mt-[5vh] text-[2vw] leading-[1.35]">Not live rates. Refresh not yet shipped</p>
      </div>
    </div>
  );
}
