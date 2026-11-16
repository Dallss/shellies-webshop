// Soap bubbles that drift upward. Purely decorative: hidden for visitors
// who prefer reduced motion (see .bubble-field in globals.css).
// Positions are fixed (not random) so server and browser render the same.

type BubbleSpec = { left: string; size: number; dur: number; delay: number };

const DEFAULT_BUBBLES: BubbleSpec[] = [
  { left: "6%", size: 26, dur: 13, delay: -2 },
  { left: "14%", size: 14, dur: 10, delay: -7 },
  { left: "27%", size: 38, dur: 16, delay: -11 },
  { left: "39%", size: 18, dur: 11, delay: -4 },
  { left: "52%", size: 30, dur: 14, delay: -9 },
  { left: "63%", size: 12, dur: 9, delay: -1 },
  { left: "74%", size: 22, dur: 12, delay: -6 },
  { left: "86%", size: 34, dur: 15, delay: -13 },
  { left: "94%", size: 16, dur: 10, delay: -3 },
];

export function BubbleField({ rise = 900, tone = "light" }: { rise?: number; tone?: "light" | "dark" }) {
  const ring = tone === "light" ? "border-white/80 bg-white/30" : "border-white/60 bg-white/15";
  return (
    <div aria-hidden className="bubble-field pointer-events-none absolute inset-0 overflow-hidden">
      {DEFAULT_BUBBLES.map((b, i) => (
        <span
          key={i}
          className={`bubble absolute -bottom-12 rounded-full border-2 ${ring}`}
          style={
            {
              left: b.left,
              width: b.size,
              height: b.size,
              "--dur": `${b.dur}s`,
              "--delay": `${b.delay}s`,
              "--rise": `${rise}px`,
            } as React.CSSProperties
          }
        >
          <span className="absolute left-[22%] top-[18%] h-[28%] w-[28%] rounded-full bg-white/80" />
        </span>
      ))}
    </div>
  );
}
