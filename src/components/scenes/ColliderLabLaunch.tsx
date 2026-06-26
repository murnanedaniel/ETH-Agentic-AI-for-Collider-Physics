"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { LINKS, openExternal } from "@/lib/links";

// Part 2 climax: the 2031 calendar-flip lands here. One big launch card that
// opens the Collider 2031 platform in a new tab; the presenter walks ~20 min
// over there, closes the tab, and returns to this scene (the deck stays open
// behind it — hub-and-spoke).
//
//   step 0 — the invitation ("step inside 2031")
//   step 1 — launched state ("we'll come back here")

const stop = (e: React.MouseEvent) => e.stopPropagation();

export function ColliderLabLaunch({ step }: { step: number }) {
  const [launched, setLaunched] = useState(false);
  const open = step >= 1 || launched;

  return (
    <motion.div
      className="absolute inset-0 paper-grid overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: "var(--canvas)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.7 } }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <div className="text-center px-6 max-w-2xl">
        <motion.div
          className="font-mono text-[11px] uppercase tracking-[0.35em] text-ink/45 mb-5"
          initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}
        >
          the thought experiment · 2031
        </motion.div>

        <motion.div
          className="font-serif italic text-ink leading-tight mb-3"
          style={{ fontSize: "clamp(34px, 5vw, 64px)" }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.35 } }}
        >
          Collider 2031
        </motion.div>

        <motion.div
          className="text-[15px] text-ink/60 leading-relaxed mb-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }}
        >
          Not a slide — a place. Step inside the platform and look around:
          the people, the discovery, the way physics gets done five years from now.
        </motion.div>

        <motion.button
          type="button"
          onClick={(e) => { stop(e); openExternal(LINKS.collider2031); setLaunched(true); }}
          className="inline-flex items-center gap-3 rounded-full bg-ink text-paper px-7 py-3.5 text-[15px] font-sans hover:scale-[1.03] active:scale-100 transition shadow-lg"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.65 } }}
        >
          <span>Enter Collider 2031</span>
          <span className="text-[18px] leading-none">↗</span>
        </motion.button>

        <motion.div
          className="font-mono text-[11px] text-ink/40 mt-5"
          initial={{ opacity: 0 }} animate={{ opacity: open ? 1 : 0 }}
        >
          {open
            ? "↳ opened in a new tab — we'll come back here when we return to today."
            : "opens in a new tab · the talk stays right here"}
        </motion.div>
      </div>
    </motion.div>
  );
}
