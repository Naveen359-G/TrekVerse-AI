const base = import.meta.env.BASE_URL;

export default function TrailExperience() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg text-primary font-body deck-grain">
      <h1 className="absolute left-[6vw] top-[8vh] w-[88vw] font-display font-extrabold text-[4.6vw] leading-[1.08]">The simulated trail experience</h1>
      <img src={`${base}digital-twin.jpg`} crossOrigin="anonymous" alt="Historical sample capture of the TrekVerse Digital Twin interface with route preview, controls, and checkpoints" className="absolute left-[6vw] top-[27vh] w-[48vw] h-[64vh] object-contain rounded-[1vw] product-shot bg-bg" />
      <ul className="absolute left-[60vw] top-[28vh] w-[34vw] list-none text-[2.05vw] leading-[1.3]">
        <li className="mb-[3.2vh]"><strong>Digital Twin:</strong> synthetic timed progress, checkpoints, and pace controls</li>
        <li className="mb-[3.2vh]"><strong>QuestTrail:</strong> one-time XP rewards and achievement history</li>
        <li className="mb-[3.2vh]"><strong>Impact:</strong> dated, self-reported contributions</li>
        <li>Saved trips and progress stay in browser-local storage</li>
      </ul>
    </div>
  );
}
