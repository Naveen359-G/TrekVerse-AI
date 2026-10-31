export default function GroupAndPlanB() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg text-primary font-body deck-grain">
      <h1 className="absolute left-[6vw] top-[8vh] w-[88vw] font-display font-extrabold text-[4.6vw] leading-[1.08]">GroupSync and PlanB</h1>
      <div className="absolute left-[6vw] top-[28vh] w-[42vw] h-[60vh] bg-primary text-bg p-[3.2vw] flex flex-col justify-center">
        <svg viewBox="0 0 64 48" fill="none" stroke="currentColor" strokeWidth="2" className="w-[4vw] h-[3vw] mb-[4vh] text-accent" aria-hidden="true"><circle cx="24" cy="12" r="7" /><path d="M10 40v-5a14 14 0 0 1 28 0v5M40 6a7 7 0 0 1 0 14M44 27a12 12 0 0 1 10 12" /></svg>
        <p className="text-[2.4vw] leading-[1.28]">Compatibility from budgets, time, fitness, activities, group size, and access needs</p>
        <p className="text-[2.4vw] leading-[1.28] mt-[6vh] font-bold text-accent">Votes stay separate from compatibility</p>
      </div>
      <div className="absolute left-[52vw] top-[28vh] w-[42vw] h-[60vh] bg-accent text-primary p-[3.2vw] flex flex-col justify-center">
        <svg viewBox="0 0 64 48" fill="none" stroke="currentColor" strokeWidth="2" className="w-[4vw] h-[3vw] mb-[4vh]" aria-hidden="true"><path d="M7 40V12a6 6 0 0 1 6-6h29M34 1l8 5-8 5M7 23h28a12 12 0 0 1 12 12v5M40 32l7 8 7-8" /></svg>
        <p className="text-[2.4vw] leading-[1.28]">Preview, reject, apply, or restore scenario-based alternatives</p>
        <p className="text-[2.4vw] leading-[1.28] mt-[6vh] font-bold">Accepted revisions update the connected trip</p>
      </div>
    </div>
  );
}
