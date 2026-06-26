"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  PROJECTS, AGENTS, PAPERS, RESOURCES, CLUSTERS, PEOPLE, FEED,
  ROLE_LABEL, STATUS_META,
  type Project, type Agent, type FeedItem,
} from "@/data/platform2028";

// ─────────────────────────────────────────────────────────────────────
// The 2028 vision: a fully agentic science platform, presented as a living,
// clickable mock. UNNAMED on purpose ("what this could become") — the real
// ScienceDash is only revealed later, in the 2026 landing.
//
// One scene, five views. `step` drives the guided tour (presenter presses
// space); the sidebar + cards are also fully clickable for free exploration.
// Every interactive click stopPropagation()s so it doesn't advance the deck.
//
//   step 0 — projects (clickable → drill into a project)
//   step 1 — agents   (live roster · heartbeats · click → nudge)
//   step 2 — papers   (sections filling in, live)
//   step 3 — resources(HPC pools + clusters + live GPU-h burn)
//   step 4 — people + activity feed (human-in-the-loop approval gates)
// ─────────────────────────────────────────────────────────────────────

const VIEWS = ["projects", "agents", "papers", "resources", "people"] as const;
type View = (typeof VIEWS)[number];

const NAV: { id: View; label: string; glyph: string }[] = [
  { id: "projects",  label: "Projects",  glyph: "◧" },
  { id: "agents",    label: "Agents",    glyph: "◇" },
  { id: "papers",    label: "Papers",    glyph: "▤" },
  { id: "resources", label: "Resources", glyph: "▦" },
  { id: "people",    label: "People",    glyph: "◌" },
];

const VIEW_CAPTION: Record<View, string> = {
  projects:  "every curiosity is a project — status, hypothesis, agents, budget.",
  agents:    "a fleet of agents, each with a role, a task, and the compute it holds.",
  papers:    "papers write themselves into being — section by section, figure by figure.",
  resources: "the platform sees its own footprint: clusters, GPU-hours, token budget.",
  people:    "and the humans stay in the loop — tutoring students, signing off, deciding.",
};

const stop = (e: React.MouseEvent) => e.stopPropagation();

export function Platform2028({ step }: { step: number }) {
  const [view, setView] = useState<View>("projects");
  const [project, setProject] = useState<Project | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);

  // Guided tour: step drives the default view (presenter can still click).
  useEffect(() => {
    const v = VIEWS[Math.min(Math.max(step, 0), VIEWS.length - 1)];
    setView(v);
    setProject(null);
    setAgent(null);
  }, [step]);

  return (
    <motion.div
      className="absolute inset-0 paper-grid overflow-hidden"
      style={{ backgroundColor: "var(--canvas)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.7 } }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
        <div
          className="w-full max-w-[1640px] h-[82vh] rounded-2xl bg-paper/95 ink-shadow border border-ink/10 overflow-hidden flex flex-col"
          onClick={stop}
        >
          {/* top bar */}
          <div className="h-12 flex items-center px-4 gap-3 border-b border-ink/10 bg-ink/[0.025]">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-ink/15" />
              <div className="h-3 w-3 rounded-full bg-ink/15" />
              <div className="h-3 w-3 rounded-full bg-ink/15" />
            </div>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-ink/70 text-[15px]">▥</span>
              <span className="font-mono text-[12px] text-ink/55">workspace</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-ink/10 text-ink/60">2028</span>
            </div>
            <div className="flex-1" />
            <LiveTicker />
          </div>

          <div className="flex-1 flex min-h-0">
            {/* sidebar */}
            <nav className="w-52 flex-shrink-0 border-r border-ink/10 bg-ink/[0.02] py-4 flex flex-col gap-1">
              {NAV.map((n) => {
                const active = n.id === view;
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={(e) => { stop(e); setView(n.id); setProject(null); setAgent(null); }}
                    className={`mx-3 px-3 py-2 rounded-lg text-left flex items-center gap-3 transition ${
                      active ? "bg-ink/[0.08] text-ink" : "text-ink/55 hover:bg-ink/[0.04]"
                    }`}
                  >
                    <span className="text-[15px] w-4">{n.glyph}</span>
                    <span className="font-sans text-[14px]">{n.label}</span>
                  </button>
                );
              })}
              <div className="flex-1" />
              <div className="mx-5 mt-2 font-mono text-[10px] text-ink/35 leading-relaxed">
                9 agents · 6 projects<br />4 papers in flight
              </div>
            </nav>

            {/* main content */}
            <div className="flex-1 min-w-0 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  className="absolute inset-0 overflow-auto scrollbar-hidden p-6"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {view === "projects" && <ProjectsView onOpen={setProject} />}
                  {view === "agents" && <AgentsView onOpen={setAgent} />}
                  {view === "papers" && <PapersView />}
                  {view === "resources" && <ResourcesView />}
                  {view === "people" && <PeopleFeedView />}
                </motion.div>
              </AnimatePresence>

              {/* drill-down drawers */}
              <AnimatePresence>
                {project && <ProjectDrawer project={project} onClose={() => setProject(null)} />}
                {agent && <AgentDrawer agent={agent} onClose={() => setAgent(null)} />}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <motion.div
          key={view}
          className="mt-3 font-mono italic text-[12px] text-center text-ink/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.2 } }}
        >
          {VIEW_CAPTION[view]}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── top-bar live ticker ───────────────────────────────────────────────
function LiveTicker() {
  const msgs = useMemo(() => [
    "wh-track-01 · epoch 12/40",
    "scout-found · 3 new preprints",
    "review-anom · held 1 cycle",
    "planner-track · awaiting approval",
  ], []);
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((x) => (x + 1) % msgs.length), 2600);
    return () => window.clearInterval(id);
  }, [msgs.length]);
  return (
    <div className="flex items-center gap-2 font-mono text-[11px] text-ink/50">
      <Pulse tone="#15803d" />
      <AnimatePresence mode="wait">
        <motion.span key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.3 }}>
          {msgs[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function Pulse({ tone }: { tone: string }) {
  return (
    <motion.span
      className="inline-block h-2 w-2 rounded-full"
      style={{ backgroundColor: tone }}
      animate={{ opacity: [1, 0.3, 1], scale: [1, 0.85, 1] }}
      transition={{ duration: 1.6, repeat: Infinity }}
    />
  );
}

function StatusPill({ status }: { status: Project["status"] }) {
  const m = STATUS_META[status];
  return (
    <span
      className="font-mono text-[10px] px-2 py-0.5 rounded-full"
      style={{ color: m.tone, backgroundColor: `color-mix(in srgb, ${m.tone} 14%, transparent)` }}
    >
      {m.label}
    </span>
  );
}

function Bar({ value, tone = "var(--accent)" }: { value: number; tone?: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-ink/10 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: tone }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.round(value * 100)}%` }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    </div>
  );
}

// ── projects ──────────────────────────────────────────────────────────
function ProjectsView({ onOpen }: { onOpen: (p: Project) => void }) {
  return (
    <div>
      <ViewHead title="Projects" sub="from a prompt to a paper — each project run by its own agents" />
      <div className="grid grid-cols-3 gap-4">
        {PROJECTS.map((p, i) => (
          <motion.button
            key={p.id}
            type="button"
            onClick={(e) => { stop(e); onOpen(p); }}
            className="text-left rounded-xl bg-white/70 border border-ink/10 p-4 hover:border-ink/25 hover:bg-white transition group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
          >
            <div className="flex items-center justify-between mb-2">
              <StatusPill status={p.status} />
              <span className="font-mono text-[10px] text-ink/40">{p.updated}</span>
            </div>
            <div className="font-serif italic text-ink text-[17px] leading-snug mb-1">{p.title}</div>
            <div className="text-[12px] text-ink/55 leading-snug mb-3 line-clamp-2">{p.hypothesis}</div>
            <Bar value={p.progress} tone={STATUS_META[p.status].tone} />
            <div className="flex items-center justify-between mt-2 font-mono text-[10.5px] text-ink/45">
              <span>{p.agents} agents · {p.gpuHours.toLocaleString()} GPU-h</span>
              <span className="opacity-0 group-hover:opacity-100 transition">open →</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function ProjectDrawer({ project, onClose }: { project: Project; onClose: () => void }) {
  const agents = AGENTS.filter((a) => a.project === project.id);
  const paper = PAPERS.find((pp) => pp.project === project.id);
  return (
    <>
      <motion.div className="absolute inset-0 bg-ink/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => { stop(e); onClose(); }} />
      <motion.div
        className="absolute top-0 right-0 bottom-0 w-[420px] bg-paper border-l border-ink/15 shadow-2xl p-6 overflow-auto scrollbar-hidden"
        initial={{ x: 440 }} animate={{ x: 0 }} exit={{ x: 440 }} transition={{ type: "spring", stiffness: 320, damping: 34 }}
        onClick={stop}
      >
        <div className="flex items-start justify-between mb-3">
          <StatusPill status={project.status} />
          <button type="button" onClick={(e) => { stop(e); onClose(); }} className="text-ink/40 hover:text-ink text-[18px] leading-none">×</button>
        </div>
        <div className="font-serif italic text-ink text-[22px] leading-snug mb-1">{project.title}</div>
        <div className="text-[13px] text-ink/60 mb-4">{project.hypothesis}</div>

        <Field label="lead" value={project.lead} />
        <Field label="progress" value={`${Math.round(project.progress * 100)}%`} />
        <Field label="compute" value={`${project.gpuHours.toLocaleString()} GPU-h this week`} />

        <SectionLabel>assigned agents</SectionLabel>
        <div className="flex flex-col gap-1.5 mb-4">
          {agents.length === 0 && <div className="font-mono text-[11px] text-ink/40">— archived · agents released —</div>}
          {agents.map((a) => (
            <div key={a.id} className="flex items-center gap-2 font-mono text-[11.5px] text-ink/70">
              <Pulse tone={a.state === "working" ? "#15803d" : a.state === "blocked" ? "#b91c1c" : "#b45309"} />
              <span className="text-ink/55">{ROLE_LABEL[a.role]}</span>
              <span className="truncate">{a.task}</span>
            </div>
          ))}
        </div>

        {paper && (
          <>
            <SectionLabel>paper in flight</SectionLabel>
            <div className="rounded-lg border border-ink/10 bg-white/60 p-3">
              <div className="font-serif italic text-ink text-[14px] leading-snug mb-1">{paper.title}</div>
              <div className="font-mono text-[10.5px] text-ink/45 mb-2">{paper.venue} · {paper.figures} figures</div>
              <Bar value={paper.progress} tone="#6d28d9" />
            </div>
          </>
        )}
      </motion.div>
    </>
  );
}

// ── agents ────────────────────────────────────────────────────────────
const STATE_TONE: Record<Agent["state"], string> = {
  working: "#15803d", waiting: "#b45309", blocked: "#b91c1c", idle: "#71717a",
};

function AgentsView({ onOpen }: { onOpen: (a: Agent) => void }) {
  return (
    <div>
      <ViewHead title="Agent fleet" sub="planners decompose · workhorses compute · reviewers & referees check · scouts read" />
      <div className="grid grid-cols-3 gap-3">
        {AGENTS.map((a, i) => (
          <motion.button
            key={a.id}
            type="button"
            onClick={(e) => { stop(e); onOpen(a); }}
            className="text-left rounded-xl bg-white/70 border border-ink/10 p-3.5 hover:border-ink/25 hover:bg-white transition"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04 } }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[12.5px] text-ink">{a.name}</span>
              <Pulse tone={STATE_TONE[a.state]} />
            </div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink/45 mb-1.5">{ROLE_LABEL[a.role]}</div>
            <div className="text-[11.5px] text-ink/65 leading-snug mb-2 h-8 line-clamp-2">{a.task}</div>
            <div className="font-mono text-[10px] text-ink/40">{a.resource}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function AgentDrawer({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  return (
    <>
      <motion.div className="absolute inset-0 bg-ink/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => { stop(e); onClose(); }} />
      <motion.div
        className="absolute top-0 right-0 bottom-0 w-[420px] bg-paper border-l border-ink/15 shadow-2xl p-6 overflow-auto scrollbar-hidden flex flex-col"
        initial={{ x: 440 }} animate={{ x: 0 }} exit={{ x: 440 }} transition={{ type: "spring", stiffness: 320, damping: 34 }}
        onClick={stop}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Pulse tone={STATE_TONE[agent.state]} />
            <span className="font-mono text-[15px] text-ink">{agent.name}</span>
          </div>
          <button type="button" onClick={(e) => { stop(e); onClose(); }} className="text-ink/40 hover:text-ink text-[18px] leading-none">×</button>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink/45 mb-4">{ROLE_LABEL[agent.role]} · {agent.state}</div>

        <Field label="task" value={agent.task} />
        <Field label="holds" value={agent.resource} />
        <Field label="uptime" value={agent.uptime} />

        <SectionLabel>nudge</SectionLabel>
        <div className="rounded-lg border border-ink/12 bg-white/60 p-3 mt-1">
          {!sent ? (
            <div className="flex gap-2">
              <input
                readOnly
                placeholder="re-prioritise, narrow scope, pause…"
                className="flex-1 bg-transparent font-mono text-[11.5px] text-ink/70 placeholder:text-ink/35 outline-none"
                onClick={stop}
              />
              <button
                type="button"
                onClick={(e) => { stop(e); setSent(true); }}
                className="font-mono text-[11px] px-3 py-1 rounded bg-ink/85 text-paper hover:bg-ink transition"
              >
                send
              </button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[11.5px] text-ink/70 leading-relaxed">
              <span className="text-emerald-700">✓ acknowledged.</span> agent will fold this into its next planning cycle and report back on the feed.
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}

// ── papers ────────────────────────────────────────────────────────────
function PapersView() {
  return (
    <div>
      <ViewHead title="Papers in flight" sub="outline → draft → internal review → submitted, mostly while you sleep" />
      <div className="flex flex-col gap-3">
        {PAPERS.map((p, i) => (
          <motion.div
            key={p.id}
            className="rounded-xl bg-white/70 border border-ink/10 p-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06 } }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-serif italic text-ink text-[17px] leading-snug">{p.title}</div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-ink/8 text-ink/55">{p.state}</span>
            </div>
            <div className="font-mono text-[11px] text-ink/45 mb-3">{p.venue} · {p.figures} figures</div>
            <div className="flex items-center gap-1.5 mb-1">
              {Array.from({ length: p.totalSections }).map((_, s) => (
                <motion.div
                  key={s}
                  className="h-2 flex-1 rounded-full"
                  style={{ backgroundColor: s < p.sections ? "#6d28d9" : "rgba(20,20,20,0.10)" }}
                  initial={{ opacity: 0.2, scaleY: 0.5 }}
                  animate={{ opacity: 1, scaleY: 1, transition: { delay: 0.2 + s * 0.06 } }}
                />
              ))}
            </div>
            <div className="font-mono text-[10.5px] text-ink/45">{p.sections}/{p.totalSections} sections written</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── resources ─────────────────────────────────────────────────────────
function ResourcesView() {
  const [burn, setBurn] = useState(15084);
  useEffect(() => {
    const id = window.setInterval(() => setBurn((b) => b + Math.floor(3 + Math.abs((b % 7) - 3))), 1200);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div>
      <ViewHead title="Resources" sub="the platform watches its own footprint — compute, budget, storage" />
      <div className="grid grid-cols-2 gap-4 mb-6">
        {RESOURCES.map((r, i) => {
          const used = i === 0 ? burn : r.used;
          return (
            <motion.div
              key={r.name}
              className="rounded-xl bg-white/70 border border-ink/10 p-4"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-[13px] text-ink/65">{r.name}</span>
                <span className="font-mono text-[12px] text-ink/80">
                  {used.toLocaleString()} <span className="text-ink/40">/ {r.total.toLocaleString()} {r.unit}</span>
                </span>
              </div>
              <Bar value={Math.min(used / r.total, 1)} tone={used / r.total > 0.85 ? "#b45309" : "var(--accent)"} />
            </motion.div>
          );
        })}
      </div>
      <SectionLabel>clusters</SectionLabel>
      <div className="flex flex-col gap-2">
        {CLUSTERS.map((c) => (
          <div key={c.host} className="flex items-center gap-3 rounded-lg bg-white/50 border border-ink/10 px-4 py-2.5">
            <Pulse tone={c.status === "running" ? "#15803d" : "#71717a"} />
            <span className="font-mono text-[12.5px] text-ink w-32">{c.host}</span>
            <span className="font-mono text-[11px] text-ink/55 w-20">{c.gpus} GPUs</span>
            <span className="text-[11.5px] text-ink/50 flex-1">{c.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── people + feed ─────────────────────────────────────────────────────
const KIND_GLYPH = { student: "◐", collaborator: "◑", faculty: "●" } as const;

function PeopleFeedView() {
  return (
    <div className="grid grid-cols-2 gap-6 h-full">
      <div>
        <ViewHead title="People" sub="students tutored · collaborators bridged · faculty consulted" />
        <div className="flex flex-col gap-2.5">
          {PEOPLE.map((p, i) => (
            <motion.div
              key={p.name}
              className="rounded-xl bg-white/70 border border-ink/10 p-3.5"
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0, transition: { delay: i * 0.06 } }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-ink/50 text-[13px]">{KIND_GLYPH[p.kind]}</span>
                <span className="font-sans text-[14px] text-ink">{p.name}</span>
                <span className="font-mono text-[10px] text-ink/40">{p.note}</span>
              </div>
              <div className="text-[11.5px] text-ink/60 leading-snug pl-5">↳ {p.agentTouch}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex flex-col min-h-0">
        <ViewHead title="Activity" sub="the human stays in the loop — decisions, suggestions, sign-offs" />
        <FeedList />
      </div>
    </div>
  );
}

const FEED_TONE: Record<FeedItem["kind"], string> = {
  decision: "#0e7490", suggestion: "#6d28d9", status: "#71717a", approval: "#b45309",
};

function FeedList() {
  const [resolved, setResolved] = useState<Record<string, "approved" | "held">>({});
  return (
    <div className="flex flex-col gap-2 overflow-auto scrollbar-hidden pr-1">
      {FEED.map((f, i) => {
        const r = resolved[f.id];
        return (
          <motion.div
            key={f.id}
            className="rounded-lg bg-white/65 border border-ink/10 p-3"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ color: FEED_TONE[f.kind], backgroundColor: `color-mix(in srgb, ${FEED_TONE[f.kind]} 12%, transparent)` }}>{f.kind}</span>
              <span className="font-mono text-[11px] text-ink/55">{f.who}</span>
              <span className="flex-1" />
              <span className="font-mono text-[10px] text-ink/35">{f.time}</span>
            </div>
            <div className="text-[12.5px] text-ink/75 leading-snug">{f.body}</div>
            {f.needsApproval && (
              <div className="mt-2.5">
                {!r ? (
                  <div className="flex gap-2">
                    <button type="button" onClick={(e) => { stop(e); setResolved((s) => ({ ...s, [f.id]: "approved" })); }}
                      className="font-mono text-[11px] px-3 py-1 rounded bg-emerald-700 text-white hover:bg-emerald-800 transition">approve</button>
                    <button type="button" onClick={(e) => { stop(e); setResolved((s) => ({ ...s, [f.id]: "held" })); }}
                      className="font-mono text-[11px] px-3 py-1 rounded bg-ink/10 text-ink/70 hover:bg-ink/20 transition">hold</button>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[11px]" style={{ color: r === "approved" ? "#15803d" : "#b45309" }}>
                    {r === "approved" ? "✓ approved — agents proceeding" : "⏸ held — agents will wait for you"}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ── small shared bits ─────────────────────────────────────────────────
function ViewHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-4">
      <div className="font-serif italic text-ink text-[clamp(20px,1.7vw,28px)] leading-none">{title}</div>
      <div className="font-mono text-[11px] text-ink/50 mt-1.5">{sub}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40 mt-4 mb-2">{children}</div>;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 py-1.5 border-b border-ink/8">
      <span className="font-mono text-[11px] text-ink/40 w-20 flex-shrink-0">{label}</span>
      <span className="text-[12.5px] text-ink/75 leading-snug">{value}</span>
    </div>
  );
}
