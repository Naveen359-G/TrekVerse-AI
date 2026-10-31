const base = import.meta.env.BASE_URL;

export default function DemoJourney() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg text-primary font-body deck-grain">
      <h1 className="absolute left-[6vw] top-[8vh] w-[88vw] font-display font-extrabold text-[4.6vw] leading-[1.08]">The demo weekend journey</h1>
      <ul className="absolute left-[6vw] top-[29vh] w-[33vw] list-none text-[2.25vw] leading-[1.3]">
        <li className="font-bold mb-[4vh]">Hyderabad → Ananthagiri Hills</li>
        <li className="mb-[4vh]">Sunday · four people · two beginners</li>
        <li className="mb-[4vh]">₹2,000/person budget → <strong className="font-display font-extrabold">₹1,450</strong> illustrative estimate</li>
        <li>Explainable fit, dated itinerary, budget breakdown, and readiness</li>
      </ul>
      <img src={`${base}my-adventures.jpg`} crossOrigin="anonymous" alt="Actual TrekVerse My Adventures interface with Ananthagiri Hills and its budget" className="absolute left-[44vw] top-[27vh] w-[50vw] h-[64vh] object-contain rounded-[1vw] product-shot bg-bg" />
    </div>
  );
}
