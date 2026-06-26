"use client";

import { motion, useMotionValue, useTransform, animate, type MotionValue } from "motion/react";
import { useEffect } from "react";

// Parameterized calendar-flip transition. Drives a single 0..1 `phase`;
// everything else is a useTransform on it.
//
//   t=0        : start card centered, large (scale 1.4)
//   t≈0.6s     : card shrinks to scale 0.85
//   whiz window: strip whizzes, |span| month-cards whip past (forward or reverse)
//   t≈end      : destination card centered, grows to scale 1.2
//
// Background + card colours interpolate fromTheme → toTheme over the whole arc.
// Used three times in the ETH arc: →2028, →2031, and back →2026 (reverse).

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CARD_W = 320;                        // px
const CARD_GAP = 18;                       // px
const STRIDE = CARD_W + CARD_GAP;
const DEFAULT_DURATION = 7.4;

type Theme = "dark" | "light";

const THEMES: Record<Theme, {
  bg: string; cardBg: string; text: string; muted: string; border: string;
}> = {
  dark: {
    bg: "#050607", cardBg: "#18181b", text: "#f4f4f5",
    muted: "#71717a", border: "rgba(255,255,255,0.08)",
  },
  light: {
    bg: "#f6f1e7", cardBg: "#fbf6ec", text: "#141414",
    muted: "#6b6b6b", border: "rgba(20,20,20,0.12)",
  },
};

// Robust for negative offsets (reverse flips count backwards in time).
function monthAtOffset(startMonthIdx: number, startYear: number, offset: number) {
  const total = startMonthIdx + offset;
  const idx = ((total % 12) + 12) % 12;
  const yearOffset = Math.floor(total / 12);
  return { month: MONTHS[idx], year: startYear + yearOffset };
}

export type CalendarFlipProps = {
  startYear?: number;
  startMonth?: number;     // 0-indexed (April = 3)
  targetYear?: number;
  targetMonth?: number;    // 0-indexed; defaults to startMonth
  fromTheme?: Theme;
  toTheme?: Theme;
  label?: string;
  duration?: number;
};

export function CalendarFlip({
  startYear = 2026,
  startMonth = 3,
  targetYear = 2028,
  targetMonth,
  fromTheme = "dark",
  toTheme = "light",
  label = "thinking forward…",
  duration = DEFAULT_DURATION,
}: CalendarFlipProps = {}) {
  const endMonth = targetMonth ?? startMonth;
  // Signed month span between start and destination.
  const span = (targetYear - startYear) * 12 + (endMonth - startMonth);
  const step = span === 0 ? 1 : Math.sign(span);
  const nSteps = Math.abs(span);
  const nCards = nSteps + 1;
  // Going back in time (span < 0) → whiz the strip the opposite way, so it
  // reads as rewinding rather than fast-forwarding.
  const dir = span < 0 ? -1 : 1;

  const cards = Array.from({ length: nCards }, (_, k) =>
    monthAtOffset(startMonth, startYear, k * step),
  );

  const from = THEMES[fromTheme];
  const to = THEMES[toTheme];

  // Single 0..1 driver.
  const phase = useMotionValue(0);

  useEffect(() => {
    const ctrl = animate(phase, 1, { duration, ease: [0.42, 0, 0.45, 1] });
    return () => ctrl.stop();
  }, [phase, duration]);

  // currentIdx: 0 → nSteps (which card is centered). Hold during the shrink
  // window, advance through the whiz window, settle at the destination.
  const currentIdx = useTransform(
    phase,
    [0, 0.08, 0.84, 1],
    [0, 0, nSteps, nSteps],
  );

  // Card scale: 1.4 → 0.85 during shrink, hold during whiz, → 1.2 at end.
  const scale = useTransform(
    phase,
    [0, 0.06, 0.10, 0.84, 0.93, 1],
    [1.4, 1.4, 0.85, 0.85, 1.2, 1.2],
  );

  // Theme colours interpolating fromTheme → toTheme.
  const bg        = useTransform(phase, [0, 1], [from.bg, to.bg]);
  const cardBg    = useTransform(phase, [0, 1], [from.cardBg, to.cardBg]);
  const textColor = useTransform(phase, [0, 1], [from.text, to.text]);
  const muted     = useTransform(phase, [0, 1], [from.muted, to.muted]);
  const borderClr = useTransform(phase, [0, 1], [from.border, to.border]);

  // Ambient label fades out as we near the destination.
  const labelOpacity = useTransform(phase, [0, 0.05, 0.85, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundColor: bg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {/* ambient label */}
      <motion.div
        className="absolute top-12 left-1/2 -translate-x-1/2 font-mono text-[12px] tracking-[0.35em] uppercase"
        style={{ color: muted, opacity: labelOpacity }}
      >
        {label}
      </motion.div>

      {/* card strip — each card is positioned relative to its index, with the
          strip offset by -currentIdx * STRIDE so the active card sits at center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          style={{ scale, width: 0, height: 0 }}
        >
          {cards.map((c, i) => (
            <CalendarCard
              key={`${c.month}-${c.year}-${i}`}
              i={i}
              dir={dir}
              month={c.month}
              year={c.year}
              currentIdx={currentIdx}
              cardBg={cardBg}
              textColor={textColor}
              borderClr={borderClr}
              muted={muted}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

// Preset wrappers — one per SceneId so they slot into SCENE_COMPONENTS.
export function CalendarFlip2028() {
  return <CalendarFlip startYear={2026} targetYear={2028} fromTheme="dark" toTheme="light" label="thinking forward…" />;
}

export function CalendarFlip2031() {
  return <CalendarFlip startYear={2028} targetYear={2031} fromTheme="light" toTheme="light" label="further still…" />;
}

export function CalendarFlip2026Back() {
  return <CalendarFlip startYear={2031} targetYear={2026} fromTheme="light" toTheme="light" label="…back to now" />;
}

type CardProps = {
  i: number;
  dir: number;
  month: string;
  year: number;
  currentIdx: MotionValue<number>;
  cardBg: MotionValue<string>;
  textColor: MotionValue<string>;
  borderClr: MotionValue<string>;
  muted: MotionValue<string>;
};

function CalendarCard({
  i, dir, month, year, currentIdx, cardBg, textColor, borderClr, muted,
}: CardProps) {
  // Each card's screen-x = (i - currentIdx) * STRIDE, flipped by `dir` so
  // reverse flips rewind rather than fast-forward.
  const x = useTransform(currentIdx, (c) => (i - c) * STRIDE * dir);
  // Fade cards far from center so off-screen ones don't distract.
  const opacity = useTransform(currentIdx, (c) => {
    const d = Math.abs(i - c);
    if (d < 0.6) return 1;
    if (d > 2.5) return 0;
    return Math.max(0, 1 - (d - 0.6) * 0.6);
  });

  return (
    <motion.div
      className="absolute rounded-lg flex flex-col items-center justify-center font-serif"
      style={{
        left: -CARD_W / 2,
        top: -CARD_W * 0.6,
        width: CARD_W,
        height: CARD_W * 1.2,
        x,
        opacity,
        backgroundColor: cardBg,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: borderClr,
        boxShadow: "0 22px 50px -18px rgba(0,0,0,0.5), 0 6px 16px -8px rgba(0,0,0,0.35)",
      }}
    >
      <motion.div
        className="font-mono uppercase tracking-[0.35em] text-[11px] mb-3"
        style={{ color: muted }}
      >
        {year}
      </motion.div>
      <motion.div
        className="italic text-center"
        style={{
          color: textColor,
          fontSize: "clamp(40px, 5.5vw, 92px)",
          lineHeight: 1.05,
        }}
      >
        {month}
      </motion.div>
    </motion.div>
  );
}
