type WordmarkSize = "hero" | "nav";

/**
 * Type sizes are chosen by cap height, not font size: bold Inter's cap height
 * measures 0.705em, so 28px ≈ 20px caps on desktop and 25px ≈ 18px on mobile.
 */
const sizeClass: Record<WordmarkSize, string> = {
  hero: "text-[40px] md:text-[56px] lg:text-[64px]",
  nav: "text-[25px] md:text-[28px]",
};

/**
 * The robot head that stands in for the second O — the artwork from
 * robot-head.svg, drawn in a 100×170 viewBox with the head body spanning
 * y 44–168 (124 units).
 *
 * The wrapper is one cap height tall (0.705em, measured from the rendered R —
 * Inter's nominal 0.727em overshoots) and the row aligns on the baseline. The
 * wrapper has no text, so its baseline is synthesised from its bottom edge: the
 * head body stands on the letters' baseline and reaches their cap line at any
 * size. (Centring drifted by up to 1.4px, because Chrome rounds the font's
 * ascent and descent to whole pixels differently at each size.) The SVG is
 * scaled so those 124 units fill the wrapper, and shifted up by the 44 units
 * above the head so the antenna overhangs the cap line. Everything is in em, so
 * nav and hero scale identically.
 *
 * Head and antenna fill with currentColor to match the letters; eyes and mouth
 * are solid black.
 */
function RobotHead() {
  return (
    <span className="relative inline-block h-[0.705em] w-[calc(0.705em*100/124)] flex-none">
      <svg
        viewBox="0 0 100 170"
        className="absolute left-0 top-[calc(0.705em*-44/124)] h-[calc(0.705em*170/124)] w-full overflow-visible"
        aria-hidden
      >
        {/* antenna */}
        <circle cx="50" cy="12" r="11" fill="currentColor" />
        <rect x="47" y="20" width="6" height="30" fill="currentColor" />
        {/* head: tall rounded capsule, flatter top, rounder bottom */}
        <path
          d="M8 88 C8 60 24 44 50 44 C76 44 92 60 92 88 L92 128 C92 152 72 168 50 168 C28 168 8 152 8 128 Z"
          fill="currentColor"
        />
        {/* eyes */}
        <circle cx="33" cy="98" r="12" fill="#000000" />
        <circle cx="67" cy="98" r="12" fill="#000000" />
        {/* mouth */}
        <rect x="38" y="132" width="24" height="6" rx="3" fill="#000000" />
      </svg>
    </span>
  );
}

/**
 * "PR FOR ROBOTS" with the robot head in place of the second O. Single source
 * for the hero title and the nav mark so the two can't drift apart.
 */
export function Wordmark({ size = "hero" }: { size?: WordmarkSize }) {
  return (
    <span
      className={`inline-flex flex-wrap items-center gap-x-[0.24em] font-bold uppercase leading-[0.94] tracking-[-0.02em] text-white ${sizeClass[size]}`}
    >
      <span className="whitespace-nowrap">PR FOR</span>
      <span className="inline-flex items-baseline whitespace-nowrap">
        <span>R</span>
        <RobotHead />
        <span>BOTS</span>
      </span>
    </span>
  );
}
