const base = import.meta.env.BASE_URL;

export default function TrekVerseCover() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg text-primary font-body">
      <img src={`${base}forest-ridge.jpg`} crossOrigin="anonymous" alt="The forest ridge landscape used in TrekVerse" className="absolute right-0 top-0 w-[55vw] h-screen object-cover object-center" />
      <div className="absolute inset-0 cover-wash" />
      <img src={`${base}trekverse-mark.svg`} crossOrigin="anonymous" alt="TrekVerse mountain mark" className="absolute left-[6vw] top-[8vh] w-[4vw] h-[4vw]" />
      <div className="absolute left-[6vw] top-[30vh] w-[52vw]">
        <h1 className="font-display font-extrabold text-[7.2vw] leading-[1.03]">TrekVerse AI</h1>
        <p className="mt-[4vh] w-[43vw] text-[3vw] leading-[1.24] font-bold">Your intelligent weekend adventure OS.</p>
        <p className="mt-[6vh] w-[39vw] text-[2.05vw] leading-[1.45]">Plan nearby. Align the group. Adapt when plans change.</p>
      </div>
      <div className="absolute right-[6vw] bottom-[8vh] w-[12vw] h-[1.2vh] bg-accent" />
    </div>
  );
}
