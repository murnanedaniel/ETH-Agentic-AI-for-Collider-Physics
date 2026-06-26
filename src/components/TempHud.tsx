"use client";

import { motion, AnimatePresence } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// A small corner readout: the live temperature in Zürich, shown both in °C and
// as a percentage of the Sun's surface temperature (in Kelvin). Polls every
// 60 s; when the reading ticks UP by ≥0.1 °C it "pings" — a flash + a soft blip.
//
// Sun's effective surface temperature: 5772 K (IAU 2015 nominal value).
// Zürich ≈ 47.37° N, 8.54° E. Weather via Open-Meteo (no API key needed).

const SUN_K = 5772;
const ZURICH = { lat: 47.3769, lon: 8.5417 };
const POLL_MS = 60_000;
const PING_DELTA_C = 0.1;
const WEATHER_URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${ZURICH.lat}` +
  `&longitude=${ZURICH.lon}&current=temperature_2m`;

function playBlip() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    // Browsers may start the context suspended until a user gesture; the deck
    // is click-driven, so by the time anyone's watching it'll resume fine.
    const resume = ctx.resume?.();
    const start = () => {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1320, t);
      osc.frequency.exponentialRampToValueAtTime(1760, t + 0.12);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.06, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.24);
      osc.onended = () => ctx.close();
    };
    if (resume && typeof resume.then === "function") resume.then(start).catch(start);
    else start();
  } catch {
    /* audio is best-effort */
  }
}

export function TempHud({ theme }: { theme: "dark" | "light" }) {
  const [tempC, setTempC] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [ping, setPing] = useState(false);
  const prevRef = useRef<number | null>(null);
  const pingTimer = useRef<number | null>(null);

  const poll = useCallback(async () => {
    try {
      const res = await fetch(WEATHER_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      const c = data?.current?.temperature_2m;
      if (typeof c !== "number") throw new Error("no temp");
      setError(false);
      setTempC(c);
      const prev = prevRef.current;
      if (prev !== null && c >= prev + PING_DELTA_C) {
        setPing(true);
        playBlip();
        if (pingTimer.current) window.clearTimeout(pingTimer.current);
        pingTimer.current = window.setTimeout(() => setPing(false), 2200);
      }
      prevRef.current = c;
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    poll();
    const id = window.setInterval(poll, POLL_MS);
    return () => {
      window.clearInterval(id);
      if (pingTimer.current) window.clearTimeout(pingTimer.current);
    };
  }, [poll]);

  const kelvin = tempC === null ? null : tempC + 273.15;
  const pct = kelvin === null ? null : (kelvin / SUN_K) * 100;

  const light = theme === "light";
  const base = light
    ? "bg-white/65 border-ink/12 text-ink"
    : "bg-black/45 border-white/12 text-zinc-200";
  const muted = light ? "text-ink/45" : "text-zinc-500";
  const accent = light ? "text-amber-600" : "text-amber-300";

  return (
    <motion.div
      className={`fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-full border backdrop-blur px-3 h-9 font-mono text-[11px] tabular-nums select-none ${base}`}
      title="Zürich air temperature, in °C and as a fraction of the Sun's surface (5772 K)"
      animate={
        ping
          ? {
              scale: [1, 1.12, 1, 1.06, 1],
              boxShadow: [
                "0 0 0 0 rgba(245,158,11,0)",
                "0 0 0 6px rgba(245,158,11,0.35)",
                "0 0 0 0 rgba(245,158,11,0)",
              ],
            }
          : { scale: 1, boxShadow: "0 0 0 0 rgba(245,158,11,0)" }
      }
      transition={{ duration: ping ? 1.1 : 0.3 }}
    >
      {/* sun glyph */}
      <motion.span
        className={accent}
        style={{ fontSize: 13, lineHeight: 1 }}
        animate={ping ? { rotate: [0, 20, -10, 0] } : { rotate: 0 }}
        transition={{ duration: 0.9 }}
      >
        ☀
      </motion.span>

      {error || tempC === null ? (
        <span className={muted}>{error ? "Zürich · —" : "Zürich · …"}</span>
      ) : (
        <>
          <span>{tempC.toFixed(1)}°C</span>
          <span className={muted}>·</span>
          <span className={accent}>{pct!.toFixed(2)}%</span>
          <span className={muted}>of ☉</span>
        </>
      )}

      <AnimatePresence>
        {ping && (
          <motion.span
            className={`${accent} text-[10px]`}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
          >
            ▲ warming
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
