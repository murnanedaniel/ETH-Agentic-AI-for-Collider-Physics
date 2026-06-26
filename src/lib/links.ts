// External destinations the talk links out to (hub-and-spoke). Centralised so
// targets can be swapped (deployed ↔ local) without touching scene components.
//
// Override any of these at build/run time with NEXT_PUBLIC_* env vars, e.g.
//   NEXT_PUBLIC_COLLIDER2031_URL=http://localhost:5173 npm run dev

export const LINKS = {
  // Part 2 → the Collider 2031 design-fiction platform (deployed).
  collider2031:
    process.env.NEXT_PUBLIC_COLLIDER2031_URL ??
    "https://www.danielmurnane.com/Collider-2031/",

  // Part 3 → the three real deliverables ("where we actually are in 2026").
  colliderml:
    process.env.NEXT_PUBLIC_COLLIDERML_URL ??
    "https://opendatadetector.github.io/ColliderML",

  // ScienceDash opens TWO tabs: the project page + the live deployed instance
  // (Tailscale funnel via homebox).
  sciencedash:
    process.env.NEXT_PUBLIC_SCIENCEDASH_URL ??
    "https://danielmurnane.com/sciencedash",
  sciencedashLive:
    process.env.NEXT_PUBLIC_SCIENCEDASH_LIVE_URL ??
    "https://homebox.tail598781.ts.net/",

  // ChATLAS is CERN-internal; may be unreachable at ETH → screenshot fallback.
  chatlas:
    process.env.NEXT_PUBLIC_CHATLAS_URL ??
    "https://chatlas-flask-chatlas.app.cern.ch",
} as const;

export function openExternal(url: string) {
  if (typeof window !== "undefined") window.open(url, "_blank", "noopener");
}
