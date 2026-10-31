export default function BoundariesAndNext() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg text-primary font-body deck-grain">
      <h1 className="absolute left-[6vw] top-[8vh] w-[88vw] font-display font-extrabold text-[4.6vw] leading-[1.08]">MVP boundaries and next steps</h1>
      <div className="absolute left-[6vw] top-[29vh] w-[42vw] h-[24vh] border-t-[0.16vw] border-primary pt-[3vh] pr-[3vw]">
        <p className="text-[2.35vw] leading-[1.3]">Local-first MVP; no mandatory login or API keys</p>
      </div>
      <div className="absolute left-[52vw] top-[29vh] w-[42vw] h-[24vh] border-t-[0.16vw] border-primary pt-[3vh]">
        <p className="text-[2.35vw] leading-[1.3]">Routes, costs, and twin are illustrative; optional network lookup is not safety clearance</p>
      </div>
      <div className="absolute left-[6vw] top-[59vh] w-[42vw] h-[29vh] border-t-[0.16vw] border-primary pt-[3vh] pr-[3vw]">
        <p className="text-[2.35vw] leading-[1.3]">Implemented: offline catalogs, optional research, INR/MYR/SGD with optional rate refresh</p>
      </div>
      <div className="absolute left-[52vw] top-[59vh] w-[42vw] h-[31vh] bg-accent px-[2.4vw] py-[3vh]">
        <p className="text-[2.35vw] leading-[1.3]"><strong>Proposed next:</strong> verified routes, live weather, shared-group collaboration</p>
      </div>
    </div>
  );
}
