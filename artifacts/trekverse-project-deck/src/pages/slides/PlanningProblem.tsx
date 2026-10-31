const base = import.meta.env.BASE_URL;

export default function PlanningProblem() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg text-primary font-body deck-grain">
      <div className="absolute inset-y-0 left-0 w-[34vw] bg-accent" />
      <h1 className="absolute left-[6vw] top-[17vh] w-[24vw] font-display font-extrabold text-[4.8vw] leading-[1.05]">The weekend planning problem</h1>
      <img src={`${base}trekverse-mark.svg`} crossOrigin="anonymous" alt="TrekVerse mountain mark" className="absolute left-[6vw] bottom-[10vh] w-[4vw] h-[4vw]" />
      <ul className="absolute left-[41vw] top-[13vh] w-[51vw] list-none text-[2.65vw] leading-[1.22]">
        <li className="pb-[5vh] border-b-[0.1vw] border-primary/20">Different budgets, fitness levels, and activity preferences</li>
        <li className="py-[5vh] border-b-[0.1vw] border-primary/20">Unclear trade-offs between destination options</li>
        <li className="py-[5vh] border-b-[0.1vw] border-primary/20">Changing plans without a coordinated alternative</li>
        <li className="pt-[5vh]">Trip details scattered across tools</li>
      </ul>
    </div>
  );
}
