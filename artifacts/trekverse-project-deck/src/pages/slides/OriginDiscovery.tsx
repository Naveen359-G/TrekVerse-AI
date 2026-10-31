export default function OriginDiscovery() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg text-primary font-body deck-grain">
      <h1 className="absolute left-[6vw] top-[8vh] w-[88vw] font-display font-extrabold text-[4.4vw] leading-[1.08]">Origin-aware discovery</h1>
      <div className="absolute left-[6vw] top-[26vh] w-[42vw] h-[66vh] bg-primary text-bg p-[2.6vw] flex flex-col">
        <p className="text-[1.6vw] uppercase tracking-[0.12em] text-accent font-bold">Plannable · offline</p>
        <p className="mt-[1.5vh] font-display font-extrabold text-[2.6vw] leading-[1.15]">Ten city-based catalogs</p>
        <p className="mt-[3vh] text-[2vw] leading-[1.35]">“Malaysis” → choose a city, such as Kuala Lumpur</p>
        <p className="mt-[2.4vh] text-[2vw] leading-[1.35] font-bold text-accent">No unrelated Hyderabad fallback</p>
        <p className="mt-auto text-[2vw] leading-[1.35] opacity-85">Saved trips retain their starting city</p>
      </div>
      <div className="absolute left-[52vw] top-[26vh] w-[42vw] h-[66vh] bg-accent p-[2.6vw] flex flex-col">
        <p className="text-[1.6vw] uppercase tracking-[0.12em] font-bold">Optional · online · research only</p>
        <p className="mt-[1.5vh] text-[2vw] leading-[1.35]">Choose a city with Nominatim. Find mapped places within 25 km via Overpass</p>
        <p className="mt-[2.4vh] text-[1.6vw] leading-[1.35]">OSM attribution · dated 24 h cache · explicit searches</p>
        <p className="mt-auto pt-[2vh] border-t-[0.16vw] border-primary text-[2vw] leading-[1.35] font-bold">Research only: straight-line distance; unknown route, cost, grade, access or safety. No fitness ranking or itinerary</p>
      </div>
    </div>
  );
}
