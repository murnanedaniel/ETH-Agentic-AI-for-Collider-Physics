export type SceneId =
  | "title"
  | "rateRamp"
  | "gnnSolution"
  | "speedJourney"
  | "loopsViz"
  | "quirksAside"
  | "innerLoopHistory"
  | "loopsVizMiddle"
  | "easter1Release"
  | "easter2Bug"
  | "rorvigRunPhone"
  | "easter5Dispatch"
  | "easter3SmokingGun"
  | "easter4CrossEval"
  | "easter6Architecture"
  | "easter7Discovery"
  | "easter8Reveal"
  | "easter9Thesis"
  | "easter10WhyPossible"
  | "statsFeint"
  // ── Part 2 · flip to 2028 (the concept) ──
  | "calendarFlip2028"
  | "platform2028"
  | "loopsVizOuter"
  | "nbiGraph"
  | "matchmaking"
  | "faculty2031Teaching"
  | "phdPedagogy"
  // ── Part 2 climax · flip to 2031 (the platform, external) ──
  | "calendarFlip2031"
  | "colliderLabLaunch"
  // ── Part 3 · flip back to 2026 (the real deliverables) ──
  | "calendarFlip2026back"
  | "deliverables2026"
  | "nbiAINativeCallToAction"
  | "claudeFinalSlide";

export type Theme = "dark" | "light";

export type Scene = {
  id: SceneId;
  label: string;
  act: 1 | 2 | 3 | 4;
  startSec: number;
  endSec: number;
  steps: number;
  // theme is derived from `act` in Stage.tsx (act >= 3 → light).
  theme?: Theme;
};

// Four-hinge arc:
//   Part 1 (today, dark) → flip 2028 → Part 2 concept (light) → flip 2031 →
//   Collider 2031 platform (external) → flip back 2026 → Part 3 deliverables.
// Timings past the 2028 flip are indicative — the ~20-min Collider 2031
// excursion happens off-app, so the presenter clock just keeps running.
export const SCENES: Scene[] = [
  // ── Part 1 · today (dark) ──
  { id: "title",                  label: "Title",                          act: 1, startSec: 0,    endSec: 27,   steps: 1 },
  { id: "rateRamp",               label: "40 million per second",          act: 1, startSec: 27,   endSec: 62,   steps: 6 },
  { id: "gnnSolution",            label: "Graph tracking on a real event", act: 1, startSec: 62,   endSec: 113,  steps: 4 },
  { id: "speedJourney",           label: "From 60 s to 100 kHz",           act: 1, startSec: 113,  endSec: 126,  steps: 4 },
  { id: "loopsViz",               label: "Inner loop · rotating",          act: 2, startSec: 126,  endSec: 148,  steps: 1 },
  { id: "quirksAside",            label: "Quirks · highly non-helical",    act: 2, startSec: 148,  endSec: 165,  steps: 2 },
  { id: "innerLoopHistory",       label: "NN history · 38 years",          act: 2, startSec: 165,  endSec: 188,  steps: 2 },
  { id: "loopsVizMiddle",         label: "Inner → middle loops",           act: 2, startSec: 188,  endSec: 195,  steps: 2 },
  { id: "easter1Release",         label: "Easter · ColliderML release",    act: 2, startSec: 195,  endSec: 207,  steps: 1 },
  { id: "easter2Bug",             label: "Easter · bug email",             act: 2, startSec: 207,  endSec: 235,  steps: 1 },
  { id: "easter3SmokingGun",      label: "Easter · beamspot + smoking gun", act: 2, startSec: 235,  endSec: 262,  steps: 3 },
  { id: "rorvigRunPhone",         label: "Easter · Rørvig run (phone)",    act: 2, startSec: 262,  endSec: 295,  steps: 3 },
  { id: "easter5Dispatch",        label: "Easter · terminal + phone + timelapse", act: 2, startSec: 295, endSec: 400, steps: 2 },
  { id: "easter8Reveal",          label: "Easter · the paper · 16 pages",  act: 2, startSec: 400,  endSec: 450,  steps: 3 },
  { id: "easter9Thesis",          label: "Easter · meta-thesis",           act: 2, startSec: 450,  endSec: 470,  steps: 2 },
  { id: "easter10WhyPossible",    label: "Why this was possible",          act: 2, startSec: 470,  endSec: 526,  steps: 2 },
  { id: "statsFeint",             label: "Physics × AI · paper count",     act: 2, startSec: 526,  endSec: 667,  steps: 4 },

  // ── Part 2 · flip → 2028 (the concept, light) ──
  { id: "calendarFlip2028",       label: "Flip · 2026 → 2028",             act: 3, startSec: 667,  endSec: 675,  steps: 1 },
  { id: "platform2028",           label: "2028 · agentic science platform", act: 3, startSec: 675, endSec: 815,  steps: 5 },
  { id: "loopsVizOuter",          label: "Outer loop · all three",         act: 3, startSec: 815,  endSec: 830,  steps: 3 },
  { id: "nbiGraph",               label: "NBI graph + roulette",           act: 3, startSec: 830,  endSec: 895,  steps: 3 },
  { id: "matchmaking",            label: "Live matchmaking",               act: 3, startSec: 895,  endSec: 960,  steps: 2 },
  { id: "faculty2031Teaching",    label: "Teaching in 2028",               act: 3, startSec: 960,  endSec: 1050, steps: 4 },
  { id: "phdPedagogy",            label: "PhD pedagogy · open question",   act: 3, startSec: 1050, endSec: 1110, steps: 4 },

  // ── Part 2 climax · flip → 2031 (the platform, external) ──
  { id: "calendarFlip2031",       label: "Flip · 2028 → 2031",             act: 3, startSec: 1110, endSec: 1120, steps: 1 },
  { id: "colliderLabLaunch",      label: "Enter Collider 2031 (new tab)",  act: 3, startSec: 1120, endSec: 1180, steps: 2 },

  // ── Part 3 · flip back → 2026 (the real deliverables) ──
  { id: "calendarFlip2026back",   label: "Flip · 2031 → 2026 (back to now)", act: 3, startSec: 1180, endSec: 1190, steps: 1 },
  { id: "deliverables2026",       label: "Where we are · ColliderML · ScienceDash · ChATLAS", act: 3, startSec: 1190, endSec: 1290, steps: 4 },
  { id: "nbiAINativeCallToAction",label: "AI-native research institute",   act: 4, startSec: 1290, endSec: 1350, steps: 6 },
  { id: "claudeFinalSlide",       label: "Claude's final slide",           act: 4, startSec: 1350, endSec: 1368, steps: 2 },
];

export const TOTAL_SEC = 1368;

export function formatMMSS(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}
