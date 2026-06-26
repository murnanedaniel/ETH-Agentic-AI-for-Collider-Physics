"use client";

import { useEffect, useRef, useState } from "react";
import { SCENES } from "@/lib/timeline";
import { ARTICLE_SECTIONS, type ArticleSection } from "@/data/articleNarration";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const RECORDING = "https://indico.cern.ch/event/1692774/contributions/7125252/";
const REPO = "https://github.com/murnanedaniel/ETH-Agentic-AI-for-Collider-Physics";

function labelFor(scene: string) {
  return SCENES.find((s) => s.id === scene)?.label ?? scene;
}

// Lazy, framed, fully-interactive embed of a single scene (iframe → /embed).
function SceneEmbed({ section }: { section: ArticleSection }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "500px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const label = labelFor(section.scene);
  const src = `${BASE}/embed/?scene=${section.scene}${section.step ? `&step=${section.step}` : ""}`;

  return (
    <figure ref={ref} className="my-7">
      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden ink-shadow border border-ink/12 bg-canvas">
        {show ? (
          <iframe
            src={src}
            title={label}
            loading="lazy"
            className="absolute inset-0 w-full h-full"
            style={{ border: "none" }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[12px] text-ink/40">
            {label} · loading…
          </div>
        )}
      </div>
      <figcaption className="mt-2 flex items-center justify-between font-mono text-[11px] text-ink/45">
        <span>{label}</span>
        <span>ↆ live · click or ← → to advance</span>
      </figcaption>
    </figure>
  );
}

export function Article() {
  return (
    <main className="min-h-screen paper-texture text-ink">
      <article className="mx-auto max-w-[820px] px-5 py-16 md:py-24">
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
          <section key={`${section.scene}-${i}`} className="mb-12">
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
            <SceneEmbed section={section} />
          </section>
        ))}

        <footer className="mt-16 pt-8 border-t border-ink/10 font-mono text-[12px] text-ink/45 leading-relaxed">
          <p>
            Narration is being replaced with the delivered transcript (ASR of the
            CERN recording), aligned scene-by-scene. The 2031 excursion and the 2026
            deliverables are filled from what was actually said.
          </p>
          <p className="mt-3">
            <a href={`${BASE}/`} className="underline underline-offset-2 hover:text-ink">↩ back to the live talk</a>
          </p>
        </footer>
      </article>
    </main>
  );
}
