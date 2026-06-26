// ─────────────────────────────────────────────────────────────────────
// Mock state for the 2028 "fully agentic science platform" vision.
// Deliberately UNNAMED (no "ScienceDash" branding) — this is the
// speculative future; the real ScienceDash is only revealed in the 2026
// landing. Physics-flavoured (HL-LHC, tracking, foundation models) to rhyme
// with the rest of the talk, but everything here is fiction set in 2028.
// ─────────────────────────────────────────────────────────────────────

export type ProjectStatus =
  | "ideating"
  | "running"
  | "stalled"
  | "drafting"
  | "review"
  | "published";

export type Project = {
  id: string;
  title: string;
  hypothesis: string;
  status: ProjectStatus;
  progress: number;       // 0..1
  agents: number;         // agents currently assigned
  gpuHours: number;       // burned this week
  lead: string;           // human PI / student
  updated: string;        // relative
};

export const PROJECTS: Project[] = [
  {
    id: "p-track",
    title: "Token-budgeted tracking at HL-LHC",
    hypothesis: "A learned bin schedule beats fixed binning at 200 pileup.",
    status: "running",
    progress: 0.62,
    agents: 4,
    gpuHours: 1840,
    lead: "M. Andersen",
    updated: "2 min ago",
  },
  {
    id: "p-found",
    title: "Foundation model for calorimeter showers",
    hypothesis: "Pre-training on 1B sim showers transfers to rare decays.",
    status: "drafting",
    progress: 0.88,
    agents: 3,
    gpuHours: 9120,
    lead: "S. Lindqvist",
    updated: "11 min ago",
  },
  {
    id: "p-anom",
    title: "Unsupervised anomaly search in dijet tails",
    hypothesis: "Latent-space density flags BSM without a signal template.",
    status: "review",
    progress: 0.95,
    agents: 2,
    gpuHours: 540,
    lead: "E. Cook",
    updated: "1 h ago",
  },
  {
    id: "p-unfold",
    title: "Adversarial unfolding for ITk calibration",
    hypothesis: "Conditional flows recover truth spectra below current syst.",
    status: "stalled",
    progress: 0.34,
    agents: 1,
    gpuHours: 210,
    lead: "PhD · J. Roth",
    updated: "6 h ago",
  },
  {
    id: "p-trig",
    title: "Learned trigger menu under rate budget",
    hypothesis: "RL allocates bandwidth better than the hand-tuned menu.",
    status: "ideating",
    progress: 0.08,
    agents: 1,
    gpuHours: 12,
    lead: "agent-proposed",
    updated: "just now",
  },
  {
    id: "p-syst",
    title: "Auto-derived systematics for ttbar xsec",
    hypothesis: "Agents reproduce the published systematics table end-to-end.",
    status: "published",
    progress: 1.0,
    agents: 0,
    gpuHours: 3300,
    lead: "P. Hedegård",
    updated: "3 d ago",
  },
];

export type AgentRole =
  | "planner"
  | "workhorse"
  | "reviewer"
  | "scout"
  | "referee";

export type Agent = {
  id: string;
  name: string;
  role: AgentRole;
  project: string;        // project id
  task: string;
  state: "working" | "waiting" | "blocked" | "idle";
  resource: string;       // what compute it holds
  uptime: string;
};

export const ROLE_LABEL: Record<AgentRole, string> = {
  planner: "planner",
  workhorse: "workhorse",
  reviewer: "reviewer",
  scout: "literature scout",
  referee: "referee-sim",
};

export const AGENTS: Agent[] = [
  { id: "a1", name: "planner-track",   role: "planner",   project: "p-track", task: "decompose: bin-schedule ablation → 6 runs", state: "working", resource: "1 CPU node · orchestration", uptime: "4d 02h" },
  { id: "a2", name: "wh-track-01",     role: "workhorse", project: "p-track", task: "train bins-vs-tokens v3 · epoch 12/40",       state: "working", resource: "4× H200 · perlmutter", uptime: "19h" },
  { id: "a3", name: "wh-track-02",     role: "workhorse", project: "p-track", task: "sweep learning-rate × warmup (9 cfg)",        state: "working", resource: "8× H200 · perlmutter", uptime: "19h" },
  { id: "a4", name: "review-track",    role: "reviewer",  project: "p-track", task: "awaiting run results to score eff/fake",       state: "waiting", resource: "1 CPU · on-call",       uptime: "4d" },
  { id: "a5", name: "wh-found-01",     role: "workhorse", project: "p-found", task: "pre-train shower-FM · 1B tokens · 71%",        state: "working", resource: "64× H200 · multi-node",  uptime: "2d 06h" },
  { id: "a6", name: "scout-found",     role: "scout",     project: "p-found", task: "watch arXiv hep-ex/ph · 3 new preprints",      state: "working", resource: "1 CPU · web + RAG",     uptime: "31d" },
  { id: "a7", name: "draft-found",     role: "reviewer",  project: "p-found", task: "write §4 results · 2 figures pending",          state: "working", resource: "1 CPU · drafting",      uptime: "8h" },
  { id: "a8", name: "referee-anom",    role: "referee",   project: "p-anom",  task: "adversarial review: 'is the bump a fluke?'",    state: "working", resource: "1 CPU · red-team",      uptime: "2h" },
  { id: "a9", name: "wh-unfold-01",    role: "workhorse", project: "p-unfold",task: "BLOCKED · flow training diverged at step 1.2k", state: "blocked", resource: "2× H200 · held",        uptime: "6h" },
];

export type Paper = {
  id: string;
  title: string;
  project: string;
  venue: string;
  sections: number;       // completed
  totalSections: number;
  figures: number;
  state: "outline" | "drafting" | "internal-review" | "submitted";
  progress: number;       // 0..1
};

export const PAPERS: Paper[] = [
  { id: "pp1", title: "Token-budgeted tracking for HL-LHC", project: "p-track", venue: "→ Comput. Softw. Big Sci.", sections: 3, totalSections: 7, figures: 5, state: "drafting", progress: 0.45 },
  { id: "pp2", title: "A foundation model for calorimeter showers", project: "p-found", venue: "→ NeurIPS ML4PS", sections: 6, totalSections: 7, figures: 9, state: "internal-review", progress: 0.86 },
  { id: "pp3", title: "Template-free anomaly search in dijet tails", project: "p-anom", venue: "→ Phys. Rev. D", sections: 7, totalSections: 7, figures: 6, state: "submitted", progress: 1.0 },
  { id: "pp4", title: "Auto-derived systematics for the ttbar cross-section", project: "p-syst", venue: "Phys. Rev. D · published", sections: 7, totalSections: 7, figures: 8, state: "submitted", progress: 1.0 },
];

export type ResourcePool = {
  name: string;
  used: number;
  total: number;
  unit: string;
};

export const RESOURCES: ResourcePool[] = [
  { name: "GPU-hours · this week", used: 15084, total: 24000, unit: "h" },
  { name: "Token budget · this week", used: 412, total: 600, unit: "M tok" },
  { name: "Perlmutter queue", used: 7, total: 12, unit: "jobs" },
  { name: "Storage", used: 318, total: 500, unit: "TB" },
];

export const CLUSTERS = [
  { host: "perlmutter", gpus: 96, status: "running" as const, note: "tracking + foundation pre-train" },
  { host: "lumi-eap", gpus: 32, status: "running" as const, note: "anomaly latent-density sweep" },
  { host: "local-dev", gpus: 4, status: "idle" as const, note: "interactive debugging" },
];

export type Person = {
  name: string;
  kind: "student" | "collaborator" | "faculty";
  note: string;
  agentTouch: string;     // how an agent is interacting with them
};

export const PEOPLE: Person[] = [
  { name: "J. Roth", kind: "student", note: "PhD · unfolding", agentTouch: "tutor-agent walked through why the flow diverged; queued reading" },
  { name: "L. Berg", kind: "student", note: "MSc · trigger", agentTouch: "planner proposed a starter project from her stated interests" },
  { name: "E. Cook", kind: "collaborator", note: "Climate & Geophysics", agentTouch: "matchmaker flagged a cross-section overlap on time-series anomaly methods" },
  { name: "P. Hedegård", kind: "faculty", note: "Condensed Matter", agentTouch: "review-agent pinged for sign-off on the ttbar systematics table" },
];

export type FeedKind = "decision" | "suggestion" | "status" | "approval";

export type FeedItem = {
  id: string;
  kind: FeedKind;
  who: string;
  body: string;
  time: string;
  // approval items start pending and can be approved/held by clicking
  needsApproval?: boolean;
};

export const FEED: FeedItem[] = [
  { id: "f1", kind: "status",     who: "wh-track-01",  body: "epoch 12/40 · tracking_eff=0.984 · fake=2.1e-4", time: "now" },
  { id: "f2", kind: "suggestion", who: "scout-found",  body: "new arXiv preprint overlaps §2 — fold into related work?", time: "3 min" },
  { id: "f3", kind: "approval",   who: "planner-track",body: "spend 4,000 GPU-h on the full bin-schedule sweep?", time: "5 min", needsApproval: true },
  { id: "f4", kind: "decision",   who: "review-anom",  body: "held submission 1 cycle — referee-sim found an unmodelled syst.", time: "1 h" },
  { id: "f5", kind: "approval",   who: "draft-found",  body: "submit shower-FM paper to NeurIPS ML4PS?", time: "1 h", needsApproval: true },
  { id: "f6", kind: "status",     who: "wh-unfold-01", body: "BLOCKED · flow diverged · paused & flagged for human", time: "2 h" },
];

export const STATUS_META: Record<ProjectStatus, { label: string; tone: string }> = {
  ideating:  { label: "ideating",     tone: "var(--accent)" },
  running:   { label: "running",      tone: "#0e7490" },
  stalled:   { label: "stalled",      tone: "#b45309" },
  drafting:  { label: "drafting",     tone: "#6d28d9" },
  review:    { label: "in review",    tone: "#9d174d" },
  published: { label: "published",    tone: "#15803d" },
};
