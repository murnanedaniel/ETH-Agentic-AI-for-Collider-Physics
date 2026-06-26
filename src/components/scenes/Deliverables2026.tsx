"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { LINKS, openExternal } from "@/lib/links";
import { asset } from "@/lib/asset";

// Part 3 landing: flipped back to 2026. "Where we actually are today" — three
// concrete, openable deliverables. Each card opens in a new tab (hub-and-spoke;
// the deck stays behind). ChATLAS is CERN-internal and may be unreachable at
// ETH, so its card offers a captured-screenshot fallback.
//
//   step 0 — heading
//   step 1 — ColliderML   (live public docs)
//   step 2 — ScienceDash  (the real seed of the 2028 vision — local)
//   step 3 — ChATLAS      (+ screenshot fallback) + closing line

const stop = (e: React.MouseEvent) => e.stopPropagation();

type Card = {
  id: string;
  name: string;
  tagline: string;
  blurb: string;
  urls: string[];      // opens one tab per url
  tag: string;
  fallbackImg?: string;
};

const CARDS: Card[] = [
  {
    id: "colliderml",
    name: "ColliderML",
    tagline: "open detector data + ML benchmarks",
    blurb: "A real dataset and library for HL-LHC machine learning — generation, simulation, reconstruction, all reproducible.",
    urls: [LINKS.colliderml],
    tag: "live · public docs",
  },
  {
    id: "sciencedash",
    name: "ScienceDash",
    tagline: "the research OS, today",
    blurb: "The actual, working seed of everything in 2028: projects, a brain, autonomous workhorses, a human-in-the-loop feed.",
    urls: [LINKS.sciencedash, LINKS.sciencedashLive],
    tag: "project + live instance",
  },
  {
    id: "chatlas",
    name: "ChATLAS",
    tagline: "an AI assistant for a 3000-person collaboration",
    blurb: "Ask the entire ATLAS knowledge base in natural language — docs, software, twikis — grounded and cited.",
    urls: [LINKS.chatlas],
    tag: "CERN-internal",
    fallbackImg: asset("/img/chatlas.png"),
  },
];

export function Deliverables2026({ step }: { step: number }) {
  return (
    <motion.div
      className="absolute inset-0 paper-grid overflow-hidden"
      style={{ backgroundColor: "#f6f1e7" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        >
          <div className="font-mono text-[11px] uppercase tracking-[0.35em] text-ink/45 mb-3">back to now · 2026</div>
          <div className="font-serif italic text-ink leading-tight" style={{ fontSize: "clamp(30px, 4vw, 56px)" }}>
            Where we actually are
          </div>
          <div className="text-[15px] text-ink/55 mt-3">Not 2031 — today. Three things you can open right now.</div>
        </motion.div>

        <div className="grid grid-cols-3 gap-5 w-full max-w-[1280px]">
          {CARDS.map((c, i) => (
            <DeliverableCard key={c.id} card={c} revealed={step >= i + 1} index={i} />
          ))}
        </div>

        <motion.div
          className="mt-10 font-serif italic text-ink/70 text-[clamp(16px,1.6vw,24px)] text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: step >= 3 ? 1 : 0, transition: { duration: 0.7 } }}
        >
          The future was a thought experiment. These are real.
        </motion.div>
      </div>
    </motion.div>
  );
}

function DeliverableCard({ card, revealed, index }: { card: Card; revealed: boolean; index: number }) {
  const [showShot, setShowShot] = useState(false);
  const [shotOk, setShotOk] = useState(true);
  return (
    <motion.div
      className="rounded-2xl bg-white/70 border border-ink/12 ink-shadow p-6 flex flex-col"
      initial={{ opacity: 0, y: 18 }}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0.12, y: 18 }}
      transition={{ duration: 0.6, delay: revealed ? 0.05 : 0 }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="font-serif italic text-ink text-[26px] leading-none">{card.name}</div>
        <span className="font-mono text-[9.5px] px-2 py-0.5 rounded-full bg-ink/8 text-ink/55">{card.tag}</span>
      </div>
      <div className="font-mono text-[11px] text-ink/45 mb-3">{card.tagline}</div>
      <div className="text-[13px] text-ink/65 leading-snug flex-1 mb-5">{card.blurb}</div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => { stop(e); card.urls.forEach(openExternal); }}
          className="inline-flex items-center gap-2 rounded-full bg-ink text-paper px-4 py-2 text-[13px] hover:scale-[1.03] active:scale-100 transition"
        >
          open{card.urls.length > 1 ? ` (${card.urls.length} tabs)` : ""} <span className="text-[15px] leading-none">↗</span>
        </button>
        {card.fallbackImg && (
          <button
            type="button"
            onClick={(e) => { stop(e); setShowShot((s) => !s); }}
            className="font-mono text-[11px] text-ink/50 hover:text-ink underline underline-offset-2"
          >
            {showShot ? "hide preview" : "screenshot"}
          </button>
        )}
      </div>

      {card.fallbackImg && showShot && (
        <motion.div
          className="mt-4 rounded-lg overflow-hidden border border-ink/10 bg-ink/[0.03]"
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
          onClick={stop}
        >
          {shotOk ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={card.fallbackImg} alt={`${card.name} screenshot`} className="w-full" onError={() => setShotOk(false)} />
          ) : (
            <div className="p-4 font-mono text-[11px] text-ink/50 leading-relaxed">
              fallback screenshot not captured yet — drop a PNG at
              <span className="text-ink/70"> public/img/chatlas.png</span>.
              On the day: if the CERN URL is reachable, the live app opens instead.
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
