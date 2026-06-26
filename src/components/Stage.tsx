"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SCENES, type SceneId } from "@/lib/timeline";
import { useKeyboard } from "@/lib/useKeyboard";
import { useElapsed } from "@/lib/useElapsed";
import { PresenterClock } from "./PresenterClock";
import { PaperRollOverlay } from "./PaperRollOverlay";
import { TempHud } from "./TempHud";
import { TitleSlide } from "./scenes/TitleSlide";
import { RateRamp } from "./scenes/RateRamp";
import { GnnSolution } from "./scenes/GnnSolution";
import { SpeedJourney } from "./scenes/SpeedJourney";
import { InnerLoopHistory } from "./scenes/InnerLoopHistory";
import { QuirksAside } from "./scenes/QuirksAside";
import { LoopsVizMiddle } from "./scenes/LoopsVizMiddle";
import { LoopsVizOuter } from "./scenes/LoopsVizOuter";
import { PlaceholderScene } from "./scenes/PlaceholderScene";
import { EasterRelease } from "./scenes/EasterRelease";
import { EasterBug } from "./scenes/EasterBug";
import { RorvigRunPhone } from "./scenes/RorvigRunPhone";
import { EasterSmokingGun } from "./scenes/EasterSmokingGun";
import { EasterCrossEval } from "./scenes/EasterCrossEval";
import { EasterDispatch } from "./scenes/EasterDispatch";
import { EasterArchitecture } from "./scenes/EasterArchitecture";
import { EasterDiscovery } from "./scenes/EasterDiscovery";
import { EasterReveal } from "./scenes/EasterReveal";
import { EasterThesis } from "./scenes/EasterThesis";
import { EasterWhyPossible } from "./scenes/EasterWhyPossible";
import { StatsFeint } from "./scenes/StatsFeint";
import { NbiGraph } from "./scenes/NbiGraph";
import { Matchmaking } from "./scenes/Matchmaking";
import { Faculty2031Teaching } from "./scenes/Faculty2031Teaching";
import { PhDPedagogy } from "./scenes/PhDPedagogy";
import { NBIAINativeCallToAction } from "./scenes/NBIAINativeCallToAction";
import { ClaudeFinalSlide } from "./scenes/ClaudeFinalSlide";
import { CalendarFlip2028, CalendarFlip2031, CalendarFlip2026Back } from "./scenes/CalendarFlip";
import { Platform2028 } from "./scenes/Platform2028";
import { ColliderLabLaunch } from "./scenes/ColliderLabLaunch";
import { Deliverables2026 } from "./scenes/Deliverables2026";
import { LoopsViz } from "./scenes/LoopsViz";

type SceneComponent = (props: {
  step: number;
  onAdvance?: () => void;
}) => React.ReactElement;

const SCENE_COMPONENTS: Partial<Record<SceneId, SceneComponent>> = {
  title: TitleSlide,
  rateRamp: RateRamp,
  gnnSolution: GnnSolution,
  speedJourney: SpeedJourney,
  loopsViz: LoopsViz as unknown as SceneComponent,
  quirksAside: QuirksAside as unknown as SceneComponent,
  innerLoopHistory: InnerLoopHistory as unknown as SceneComponent,
  loopsVizMiddle: LoopsVizMiddle as unknown as SceneComponent,
  loopsVizOuter: LoopsVizOuter as unknown as SceneComponent,
  easter1Release: EasterRelease as unknown as SceneComponent,
  easter2Bug: EasterBug as unknown as SceneComponent,
  rorvigRunPhone: RorvigRunPhone as unknown as SceneComponent,
  easter3SmokingGun: EasterSmokingGun as unknown as SceneComponent,
  easter4CrossEval: EasterCrossEval as unknown as SceneComponent,
  easter5Dispatch: EasterDispatch as unknown as SceneComponent,
  easter6Architecture: EasterArchitecture as unknown as SceneComponent,
  easter7Discovery: EasterDiscovery as unknown as SceneComponent,
  easter8Reveal: EasterReveal as unknown as SceneComponent,
  easter9Thesis: EasterThesis as unknown as SceneComponent,
  easter10WhyPossible: EasterWhyPossible as unknown as SceneComponent,
  statsFeint: StatsFeint as unknown as SceneComponent,
  // ── Part 2 · 2028 concept (light) ──
  calendarFlip2028: CalendarFlip2028 as unknown as SceneComponent,
  platform2028: Platform2028 as unknown as SceneComponent,
  nbiGraph: NbiGraph as unknown as SceneComponent,
  matchmaking: Matchmaking as unknown as SceneComponent,
  faculty2031Teaching: Faculty2031Teaching as unknown as SceneComponent,
  phdPedagogy: PhDPedagogy as unknown as SceneComponent,
  // ── Part 2 climax · 2031 platform (external) ──
  calendarFlip2031: CalendarFlip2031 as unknown as SceneComponent,
  colliderLabLaunch: ColliderLabLaunch as unknown as SceneComponent,
  // ── Part 3 · back to 2026 deliverables ──
  calendarFlip2026back: CalendarFlip2026Back as unknown as SceneComponent,
  deliverables2026: Deliverables2026 as unknown as SceneComponent,
  nbiAINativeCallToAction: NBIAINativeCallToAction as unknown as SceneComponent,
  claudeFinalSlide: ClaudeFinalSlide as unknown as SceneComponent,
};

export function Stage() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  // Presenter clock + reset button hidden by default (press P to reveal).
  const [clockVisible, setClockVisible] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [running, setRunning] = useState(false);
  const [keyDebug, setKeyDebug] = useState(false);
  const [lastKey, setLastKey] = useState<string>("");

  const { elapsed, reset } = useElapsed(running);

  // Deep-link: ?scene=<id> or ?s=<index> jumps straight to a scene on load
  // (handy for rehearsing a single beat). Silently ignored if not found.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const byId = params.get("scene");
    const byIdx = params.get("s");
    let idx = -1;
    if (byId) idx = SCENES.findIndex((s) => s.id === byId);
    else if (byIdx) idx = parseInt(byIdx, 10);
    if (idx >= 0 && idx < SCENES.length) {
      setSceneIdx(idx);
      setStepIdx(0);
    }
  }, []);

  const scene = SCENES[sceneIdx];
  // Theme is now driven by act number, not per-scene flags.
  // Acts 1+2 = dark, Acts 3+4 = light. This guarantees exactly one
  // dark→light transition (the CalendarFlip scene at the Act 2/3 boundary).
  const theme = scene.act >= 3 ? "light" : "dark";

  const advance = useCallback(() => {
    setRunning(true);
    const current = SCENES[sceneIdx];
    if (stepIdx < current.steps - 1) {
      setStepIdx(stepIdx + 1);
      return;
    }
    if (sceneIdx < SCENES.length - 1) {
      setSceneIdx(sceneIdx + 1);
      setStepIdx(0);
    }
  }, [sceneIdx, stepIdx]);

  const rewind = useCallback(() => {
    if (stepIdx > 0) {
      setStepIdx(stepIdx - 1);
      return;
    }
    if (sceneIdx > 0) {
      const prev = SCENES[sceneIdx - 1];
      setSceneIdx(sceneIdx - 1);
      setStepIdx(Math.max(0, prev.steps - 1));
    }
  }, [sceneIdx, stepIdx]);

  const restart = useCallback(() => {
    setSceneIdx(0);
    setStepIdx(0);
    setRunning(false);
    reset();
  }, [reset]);

  useKeyboard({
    onAdvance: advance,
    onRewind: rewind,
    onToggleClock: () => setClockVisible((v) => !v),
    onToggleFallback: () => setFallback((v) => !v),
    onRestart: restart,
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      setLastKey(e.key);
      if (e.key === "k" || e.key === "K") setKeyDebug((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Paper-roll overlay state machine — persists across scene transitions.
  // scene 0 (title): flat plane (progress=0) — this IS the title's cream paper,
  //                  sitting behind the title text which renders at z-40.
  // scene 1 (rateRamp) steps 0–4: rolled + settled tube (~0.98)
  // scene 1 step 5 (grid) + later scenes: fully faded (1.0)
  const rollTarget = useMemo(() => {
    if (sceneIdx === 0) return 0;
    if (sceneIdx === 1 && stepIdx < 5) return 0.98;
    return 1.0;
  }, [sceneIdx, stepIdx]);
  // Duration: slow rolling-in from title (1.8s), faster transitions afterward.
  const rollDurationMs = sceneIdx === 1 && stepIdx === 0 && rollTarget === 0.98 ? 1800 : 900;

  const rendered = useMemo(() => {
    const Comp = SCENE_COMPONENTS[scene.id];
    if (Comp) return <Comp key={scene.id} step={stepIdx} onAdvance={advance} />;
    return <PlaceholderScene key={scene.id} id={scene.id} label={scene.label} act={scene.act} />;
  }, [scene, stepIdx, advance]);

  return (
    <motion.div
      className={`relative w-screen h-screen overflow-hidden cursor-pointer select-none ${theme === "light" ? "theme-light" : ""}`}
      onClick={advance}
      role="button"
      tabIndex={0}
      animate={{ backgroundColor: theme === "light" ? "#f6f1e7" : "#050607" }}
      transition={{ duration: 1.2, ease: [0.65, 0, 0.3, 1] }}
    >
      <AnimatePresence mode="wait">{rendered}</AnimatePresence>

      <PaperRollOverlay target={rollTarget} durationMs={rollDurationMs} />

      <TempHud theme={theme} />

      {clockVisible && (
        <button
          type="button"
          aria-label="Restart from the beginning"
          onClick={(e) => {
            e.stopPropagation();
            restart();
          }}
          className={`fixed top-4 right-4 z-50 h-9 px-3 flex items-center gap-1.5 rounded-full backdrop-blur border text-[11px] font-mono transition ${
            theme === "light"
              ? "bg-white/60 hover:bg-white/80 border-ink/10 text-ink/70"
              : "bg-black/50 hover:bg-black/70 border-white/10 text-zinc-300"
          }`}
        >
          <span className="text-sm leading-none">↺</span>
          <span>reset</span>
        </button>
      )}

      {keyDebug && (
        <div className="fixed top-4 left-4 z-50 font-mono text-[13px] bg-black/80 text-emerald-400 px-3 py-2 rounded border border-white/10">
          last key: <strong>{lastKey || "—"}</strong>
          <div className="text-[10px] text-zinc-500 mt-0.5">K to hide</div>
        </div>
      )}

      {clockVisible && (
        <PresenterClock
          elapsed={elapsed}
          sceneIdx={sceneIdx}
          stepIdx={stepIdx}
          total={SCENES.length}
          fallback={fallback}
          running={running}
        />
      )}

      {/* Hide the Next.js dev indicator (the N icon bottom-left) when the
          presenter clock is hidden — talk-mode is meant to be a clean canvas. */}
      {!clockVisible && (
        <style>{`nextjs-portal { display: none !important; }`}</style>
      )}
    </motion.div>
  );
}
