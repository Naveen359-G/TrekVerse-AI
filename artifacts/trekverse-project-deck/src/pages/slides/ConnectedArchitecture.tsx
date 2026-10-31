export default function ConnectedArchitecture() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg text-primary font-body deck-grain">
      <h1 className="absolute left-[6vw] top-[8vh] w-[88vw] font-display font-extrabold text-[4.6vw] leading-[1.08]">One connected, documented plan</h1>
      <div className="absolute left-[6vw] top-[30vh] w-[88vw] flex items-stretch gap-[1.2vw]">
        <div className="w-[18vw] border-t-[0.3vw] border-primary pt-[2vh]"><p className="font-display font-extrabold text-[2.3vw]">Brief</p><p className="mt-[1vh] text-[1.7vw] leading-[1.3]">origin, dates, budgets</p></div>
        <p className="text-[2.6vw] self-center">→</p>
        <div className="w-[20vw] border-t-[0.3vw] border-primary pt-[2vh]"><p className="font-display font-extrabold text-[2.3vw]">Matching + group</p><p className="mt-[1vh] text-[1.7vw] leading-[1.3]">explainable trade-offs</p></div>
        <p className="text-[2.6vw] self-center">→</p>
        <div className="w-[18vw] bg-accent p-[1.6vw]"><p className="font-display font-extrabold text-[2.3vw]">Accepted trip</p><p className="mt-[1vh] text-[1.7vw] leading-[1.3]">single source of truth</p></div>
        <p className="text-[2.6vw] self-center">→</p>
        <div className="w-[22vw] border-t-[0.3vw] border-primary pt-[2vh]"><p className="font-display font-extrabold text-[2.3vw]">Itinerary · budget · twin · readiness</p></div>
      </div>
      <div className="absolute left-[6vw] top-[62vh] w-[88vw] h-[28vh] bg-primary text-bg px-[3vw] flex items-center gap-[4vw]">
        <p className="font-display font-extrabold text-[7vw] leading-none text-accent">16</p>
        <p className="w-[60vw] text-[2.1vw] leading-[1.35]">maintained Markdown documents plus replit.md: requirements, actual feature status, architecture and data contracts, testing and demo, decisions, limits, roadmap</p>
      </div>
    </div>
  );
}
