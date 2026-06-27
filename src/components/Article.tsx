"use client";

import { useEffect, useRef, useState } from "react";
import { SCENES } from "@/lib/timeline";
import { ARTICLE_SECTIONS, type ArticleSection } from "@/data/articleNarration";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const RECORDING = "https://indico.cern.ch/event/1692774/contributions/7125252/";
const REPO = "https://github.com/murnanedaniel/ETH-Agentic-AI-for-Collider-Physics";

// The deck scenes are authored at one large "presentation" size, mixing
// viewport units with FIXED pixels (text-[11px], w-[1700px]…) that don't scale
// down. Dropped straight into a ~780px iframe they cramp and clip. So we render
// each scene iframe at this fixed design canvas (16:10, wide enough for the
// largest fixed element) and CSS-scale the whole iframe to the figure box —
// every scene then looks exactly like the talk, just uniformly smaller.
const DESIGN_W = 1920;
const DESIGN_H = 1200; // 1920/1200 = 16/10, matches the figure's aspect

function labelFor(scene: string) {
  return SCENES.find((s) => s.id === scene)?.label ?? scene;
}

// Window the embeds: mount the iframe only while near the viewport, unload it
// when it scrolls well away. Each iframe boots a whole app, so mounting all of
// them at once overwhelms the renderer (jank + black areas). Caps to ~2-3 live.
function useNearViewport(ref: React.RefObject<HTMLElement | null>) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setShow(entry.isIntersecting),
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return show;
}

// A deck scene, embedded live and immediately interactive (the /embed page
// forwards wheel to the parent so it never traps scroll).
function SceneEmbed({ section }: { section: ArticleSection }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const show = useNearViewport(ref);
  const [scale, setScale] = useState(0);
  const label = labelFor(section.scene!);
  const src = `${BASE}/embed/?scene=${section.scene}${section.step ? `&step=${section.step}` : ""}`;

  // Scale the design-canvas iframe to whatever width the figure box has.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / DESIGN_W),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <figure ref={ref} className="my-9 relative left-1/2 -translate-x-1/2 w-[min(1120px,94vw)]">
      <div ref={boxRef} className="relative w-full aspect-[16/10] rounded-xl overflow-hidden ink-shadow border border-ink/12 bg-canvas">
        {show && scale > 0 ? (
          <iframe
            src={src}
            title={label}
            loading="lazy"
            className="absolute top-0 left-0"
            style={{ border: "none", width: DESIGN_W, height: DESIGN_H, transform: `scale(${scale})`, transformOrigin: "top left" }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[12px] text-ink/40">{label} · loading…</div>
        )}
      </div>
      <figcaption className="mt-2 flex items-center justify-between font-mono text-[11px] text-ink/45">
        <span>{label}</span>
        <span>ↆ live · click or ← → to advance</span>
      </figcaption>
    </figure>
  );
}

// An external app (e.g. a Collider 2031 route), embedded behind a click-to-
// interact overlay. The overlay (part of this document) lets the wheel scroll
// the article; clicking it activates the iframe; a release button deactivates.
function UrlEmbed({ section }: { section: ArticleSection }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const show = useNearViewport(ref);
  const [active, setActive] = useState(false);
  const label = section.embedLabel ?? "Collider 2031";
  return (
    <figure ref={ref} className="my-9 relative left-1/2 -translate-x-1/2 w-[min(1120px,94vw)]">
      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden ink-shadow border border-ink/12 bg-[#0a0e14]">
        {show ? (
          <>
            <iframe
              src={section.url}
              title={label}
              loading="lazy"
              className="absolute inset-0 w-full h-full"
              style={{ border: "none", pointerEvents: active ? "auto" : "none" }}
            />
            {!active ? (
              <button
                type="button"
                onClick={() => setActive(true)}
                className="absolute inset-0 z-10 flex items-end justify-center bg-transparent hover:bg-black/10 transition group"
                aria-label={`Interact with ${label}`}
              >
                <span className="mb-4 rounded-full bg-black/70 text-white/90 px-4 py-1.5 font-mono text-[11px] opacity-80 group-hover:opacity-100">
                  click to explore ↗
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActive(false)}
                className="absolute top-2 right-2 z-10 rounded-full bg-black/70 text-white/90 px-3 py-1 font-mono text-[10px] hover:bg-black/90"
              >
                ✕ release
              </button>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[12px] text-white/40">{label} · loading…</div>
        )}
      </div>
      <figcaption className="mt-2 flex items-center justify-between font-mono text-[11px] text-ink/45">
        <span>{label}</span>
        <span>↗ live · Collider 2031</span>
      </figcaption>
    </figure>
  );
}

function Embed({ section }: { section: ArticleSection }) {
  return section.url ? <UrlEmbed section={section} /> : <SceneEmbed section={section} />;
}

export function Article() {
  return (
    <main className="min-h-screen paper-texture text-ink">
      {/* Persistent paper backdrop: guarantees the cream background fills the
          viewport at any scroll position (the body itself is dark). */}
      <div aria-hidden className="fixed inset-0 -z-10 paper-texture" />
      <article className="relative mx-auto max-w-[820px] px-5 py-16 md:py-24">
        {/* masthead */}
        <header className="mb-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink/45 mb-5">
            The reading version
          </div>
          <h1 className="font-serif text-ink leading-[1.05] text-[clamp(34px,5vw,64px)]">
            Agentic AI for Collider Physics
          </h1>
          <p className="font-serif italic text-ink/70 text-[clamp(18px,2.4vw,30px)] mt-2">
            And science in general
          </p>
          <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[14px] text-ink/70">
            <span className="text-ink">Daniel Murnane</span>
            <span className="text-ink/40">·</span>
            <span>Niels Bohr Institute</span>
            <span className="text-ink/40">·</span>
            <span>ETH Zürich · 25 June 2026</span>
          </div>

          <p className="mt-8 font-serif text-[17px] leading-[1.6] text-ink/80">
            This is the talk as an article: every scene below is the real,{" "}
            <em>live</em> interactive component from the deck — click it, advance it,
            poke at it — set beside what was said while it was on screen. You can read
            it in ten minutes instead of watching an hour.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 font-mono text-[12px]">
            <a href={`${BASE}/`} className="rounded-full bg-ink text-paper px-4 py-1.5 hover:scale-[1.03] transition inline-flex items-center gap-1.5">
              open the live talk <span>↗</span>
            </a>
            <a href={RECORDING} target="_blank" rel="noopener" className="rounded-full border border-ink/20 px-4 py-1.5 hover:bg-ink/5 transition inline-flex items-center gap-1.5">
              ▶ watch the recording
            </a>
            <a href={REPO} target="_blank" rel="noopener" className="rounded-full border border-ink/20 px-4 py-1.5 hover:bg-ink/5 transition inline-flex items-center gap-1.5">
              source
            </a>
          </div>

          <div className="mt-8 border-t border-ink/10" />
        </header>

        {/* sections */}
        {ARTICLE_SECTIONS.map((section, i) => (
          <section key={`${section.scene ?? section.url}-${i}`} className="mb-12">
            {section.heading && (
              <h2 className="font-serif italic text-ink text-[clamp(22px,2.8vw,34px)] leading-tight mb-4">
                {section.heading}
              </h2>
            )}
            {section.say.map((p, j) => (
              <p
                key={j}
                className={`font-serif text-[18px] leading-[1.62] mb-4 ${
                  p.startsWith("[") ? "text-ink/45 italic" : "text-ink/85"
                }`}
              >
                {p}
              </p>
            ))}
            <Embed section={section} />
          </section>
        ))}

        <footer className="mt-16 pt-8 border-t border-ink/10 font-mono text-[12px] text-ink/45 leading-relaxed">
          <p>
            Narration transcribed from the CERN recording (25 June 2026) and lightly
            cleaned. The 2031 beats embed the live Collider 2031 platform — click one to
            explore. Every beat of the talk and the opening Q&amp;A is present; transcription
            was stopped just into the Q&amp;A at the speaker's request, so later questions
            aren't included. The Claude final slide, never shown on the day, is the only
            scene omitted.
          </p>
          <p className="mt-3">
            <a href={`${BASE}/`} className="underline underline-offset-2 hover:text-ink">↩ back to the live talk</a>
            {"  ·  "}
            <a href="https://indico.cern.ch/event/1692774/contributions/7125252/" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-ink">▶ watch the recording</a>
          </p>
        </footer>
      </article>
    </main>
  );
}
