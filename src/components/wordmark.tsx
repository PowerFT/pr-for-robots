type WordmarkSize = "hero" | "nav";

/**
 * Type sizes are chosen by cap height, not font size: Inter's cap height is
 * ~0.727em, so 28px ≈ 20px caps on desktop and 25px ≈ 18px on mobile.
 */
const sizeClass: Record<WordmarkSize, string> = {
  hero: "text-[40px] md:text-[56px] lg:text-[64px]",
  nav: "text-[25px] md:text-[28px]",
};

/**
 * The robot head that stands in for the second O.
 *
 * Every dimension is expressed in the viewBox, and the viewBox is sized in em,
 * so the head scales with the surrounding type instead of drifting — the
 * antenna stem in particular used to be a fixed 2px, which read as hairline at
 * hero size and as a slab at nav size.
 *
 * The wrapper is 0.72em tall so the parent's `items-center` aligns it exactly
 * like a letter; the SVG is pinned to the wrapper's bottom and allowed to
 * overflow upward by 0.22em for the antenna, which keeps the head box sitting
 * on the same baseline as R and BOTS at any size.
 */
function RobotHead() {
  return (
    <span className="relative mx-[0.04em] inline-block h-[0.72em] w-[0.72em] flex-none">
      <svg
        viewBox="0 0 72 94"
        className="absolute bottom-0 left-0 h-[0.94em] w-full overflow-visible"
        fill="none"
        aria-hidden
      >
        {/* antenna */}
        <circle cx="36" cy="6" r="6" fill="#F2681C" />
        <rect x="34.5" y="6" width="3" height="16" fill="#F2681C" />
        {/* head */}
        <rect
          x="3.75"
          y="37.75"
          width="64.5"
          height="52.5"
          rx="10.25"
          stroke="#F2681C"
          strokeWidth="7.5"
        />
        {/* eyes */}
        <circle cx="25.5" cy="64" r="5" fill="#F2681C" />
        <circle cx="46.5" cy="64" r="5" fill="#F2681C" />
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
      <span className="inline-flex items-center whitespace-nowrap">
        <span>R</span>
        <RobotHead />
        <span>BOTS</span>
      </span>
    </span>
  );
}
