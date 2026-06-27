"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const ARTICLE = `${BASE}/article/`;
const SEEN_KEY = "eth-article-promo-dismissed";

// A landing splash that points first-time visitors at the interactive blog
// version. Suppressed when deep-linking a scene (?scene=/?s= — presenter
// rehearsal) and remembered once dismissed so it never nags on reload.
export function ArticlePromo() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("scene") || params.has("s")) return; // rehearsal deep-link
    try {
      if (localStorage.getItem(SEEN_KEY)) return;
    } catch {}
    setOpen(true);
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {}
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={(e) => {
            e.stopPropagation();
            dismiss();
          }}
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-[560px] rounded-2xl bg-[#f6f1e7] text-ink ink-shadow border border-ink/10 px-8 py-9 md:px-11 md:py-11 text-center"
            initial={{ scale: 0.92, y: 18 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Dismiss"
              onClick={dismiss}
              className="absolute top-3.5 right-4 text-ink/35 hover:text-ink/70 transition text-xl leading-none"
            >
              ✕
            </button>

            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink/45 mb-5">
              Before you begin
            </div>

            <h2 className="font-serif leading-[1.1] text-[clamp(26px,4.4vw,40px)]">
              There&rsquo;s an interactive blog
              <br className="hidden sm:block" /> version of this talk
            </h2>

            <p className="mt-5 font-serif text-[17px] leading-[1.6] text-ink/75">
              Every scene below is live and clickable, set beside what was said while
              it was on screen — plus extra context that didn&rsquo;t fit in the room.
              Read it in ten minutes instead of watching an hour.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={ARTICLE}
                className="rounded-full bg-ink text-paper px-6 py-2.5 font-mono text-[13px] hover:scale-[1.03] transition inline-flex items-center gap-2"
              >
                Check it out <span aria-hidden>↗</span>
              </a>
              <button
                type="button"
                onClick={dismiss}
                className="rounded-full border border-ink/20 px-6 py-2.5 font-mono text-[13px] text-ink/70 hover:bg-ink/5 transition"
              >
                Stay on the talk
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
