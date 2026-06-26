"use client";

import { useCallback, useEffect, useState } from "react";
import { SCENES, type SceneId } from "@/lib/timeline";
import { SCENE_COMPONENTS } from "@/lib/sceneRegistry";

// Chrome-less single-scene renderer for the reading article. The article
// iframes `/embed/?scene=<id>&step=<n>`; because it's its own browsing context,
// the scenes' viewport-relative styling (vw/vh/clamp) scales to the iframe box.
// Fully interactive: click / arrows / dots advance the scene's steps.

export default function EmbedPage() {
  const [sceneId, setSceneId] = useState<SceneId | null>(null);
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setSceneId(p.get("scene") as SceneId | null);
    const st = parseInt(p.get("step") || "0", 10);
    setStep(Number.isFinite(st) && st > 0 ? st : 0);
    setReady(true);
  }, []);

  const scene = SCENES.find((s) => s.id === sceneId);
  const Comp = sceneId ? SCENE_COMPONENTS[sceneId] : undefined;
  const steps = Math.max(1, scene?.steps ?? 1);
  const theme = scene && scene.act >= 3 ? "light" : "dark";

  const advance = useCallback(() => setStep((s) => (s + 1) % steps), [steps]);
  const rewind = useCallback(() => setStep((s) => (s - 1 + steps) % steps), [steps]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "ArrowDown") { e.preventDefault(); advance(); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); rewind(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, rewind]);

  if (!ready) return <div className="w-screen h-screen" style={{ backgroundColor: "#050607" }} />;
  if (!Comp || !scene) {
    return (
      <div className="w-screen h-screen flex items-center justify-center font-mono text-[13px] text-zinc-500" style={{ backgroundColor: "#050607" }}>
        unknown scene: {String(sceneId)}
      </div>
    );
  }

  const dotOn = theme === "light" ? "bg-ink/80" : "bg-white/80";
  const dotOff = theme === "light" ? "bg-ink/25" : "bg-white/25";

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden cursor-pointer select-none ${theme === "light" ? "theme-light" : ""}`}
      style={{ backgroundColor: theme === "light" ? "#f6f1e7" : "#050607" }}
      onClick={advance}
      role="button"
      tabIndex={0}
    >
      <Comp step={step} onAdvance={advance} />

      {steps > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5">
          {Array.from({ length: steps }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`step ${i + 1}`}
              onClick={(e) => { e.stopPropagation(); setStep(i); }}
              className={`h-1.5 rounded-full transition-all ${i === step ? `w-5 ${dotOn}` : `w-1.5 ${dotOff}`}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
