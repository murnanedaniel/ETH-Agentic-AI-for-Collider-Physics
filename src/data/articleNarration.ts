import type { SceneId } from "@/lib/timeline";

// The reading version of the talk: an ordered list of sections, each pairing a
// live (embedded, interactive) scene with the spoken narration for that beat.
//
// NARRATION SOURCE: interim text below is condensed from the prepared script
// (faculty_retreat/script/script.md). It will be REPLACED by the real delivered
// transcript (ASR of the CERN recording) aligned to these scenes. New ETH-only
// beats (2031 excursion, 2026 deliverables) are marked and will be filled from
// the transcript, where they were actually spoken.

export type ArticleSection = {
  scene: SceneId;
  step?: number;        // default embed step (a representative "full" frame)
  heading?: string;
  // paragraphs of spoken narration
  say: string[];
  // set when the prose is interim (script-derived or placeholder), not yet
  // replaced by the aligned recording transcript.
  interim?: boolean;
};

export const ARTICLE_SECTIONS: ArticleSection[] = [
  {
    scene: "rateRamp",
    step: 5,
    heading: "Forty million collisions a second",
    interim: true,
    say: [
      "Thank you for the invitation to talk about my favourite topic: replacing all physicists with artificial intelligence. I'm a postdoc in subatomic physics, working with the ATLAS detector at the LHC, where we're preparing for the upgrade using machine learning to overcome the firehose of data.",
      "Two bunches of protons collide and produce a spray of particles — not once per second, not 10 Hz, but at 40 MHz, once every 25 nanoseconds. These 15,000 beams flashing at 60 Hz are about 1 MHz; if we plastered the whole room with this slide, we'd get close to 40 MHz.",
    ],
  },
  {
    scene: "gnnSolution",
    step: 3,
    heading: "Connecting the dots",
    interim: true,
    say: [
      "The problem isn't just the rate, it's the complexity. One collision in the tracker has ~350k energy deposits tracing ~10k interesting particles, and we're only allowed to miss a few percent. A group I lead with Berkeley, L2IT, Heidelberg and Wisconsin solves this with graph neural networks: build a graph, then pass messages to evolve a solution to the combinatorial problem.",
      "When we started in 2021 it took about a minute per event. Today it's ~100 ms, with a clear path to 10 ms. With 1000 GPUs we expect to hit the 100 kHz needed for the ATLAS software trigger by 2031.",
    ],
  },
  {
    scene: "loopsViz",
    heading: "The inner loop",
    interim: true,
    say: [
      "Solving these problems with ML is the inner loop of research — replacing a hand-tuned algorithm with a flexible model that adapts to any detector or physics goal. The same model finds standard-model particles or strange BSM trajectories like quirks.",
      "The inner loop is old: Bruce Denby proposed neural networks for HEP reconstruction in 1988, and by 1991 ALEPH at LEP was running Hopfield nets on real TPC data. But this talk isn't about the inner loop — let's consider a middle loop: project-level.",
    ],
  },
  {
    scene: "easter2Bug",
    heading: "An Easter anecdote",
    interim: true,
    say: [
      "I'm part of ColliderML, which released the largest fully-open detector simulation of LHC-like data. Over Easter I got the third email in a month about a weird thing: people fitting track shapes found our baseline much worse than a simple ML algorithm.",
      "We knew why. Our baseline works wherever the collision happens — at the origin or drifted hundreds of microns. But all our data was centred at the origin, so people's ML was learning that bias. It's a known LHC tracking issue that creates tension between ML and traditional people, and keeps getting ignored.",
    ],
  },
  {
    scene: "rorvigRunPhone",
    heading: "A plan, recorded on a run",
    interim: true,
    say: [
      "So I went for a run near a summerhouse at Rørvig, and recorded a plan: simulate new datasets that move the beamline, run different baselines, train ML on one simulation and test generalisation to others, and build a new architecture — global fitting — that fits all tracks at once and learns in-situ where the beamspot actually is. I sent the audio transcript to Claude Code and told it to complete the project.",
    ],
  },
  {
    scene: "easter5Dispatch",
    step: 1,
    heading: "Two minutes of typing, then Perlmutter woke up",
    interim: true,
    say: [
      "To be specific: I ran Claude Code on Berkeley's Perlmutter cluster, with access to hundreds of CPU and GPU nodes and permission to request what it needed. Between diaper changes and beach trips I checked in via Remote Control on my phone, nudging it occasionally.",
      "The resource usage: ~1000 CPU-hours of completely new simulation of a drifting beamline that exists nowhere publicly, and ~400 GPU-hours of training, inference, and building a new architecture. It didn't copy, plagiarise, or hallucinate — there is no published ML track-fitting study with a drifting beamspot. It did serious work, faster and more meticulously than I would. Here's the project, sped up 100×.",
    ],
  },
  {
    scene: "easter8Reveal",
    step: 2,
    heading: "A paper by Monday morning",
    interim: true,
    say: [
      "By Monday, Claude had written a 10-page paper proposing a solution to robust track fitting in LHC-like environments. Not perfect — I proof-read it and asked for some overconfident claims to be removed. Then I shared it with the ColliderML group, including some of ATLAS and FCC's most experienced tracking experts. The feedback: fix a caption, tweak the conclusion. I didn't read a line of code or a single decimal of data.",
    ],
  },
  {
    scene: "easter9Thesis",
    heading: "What the middle loop looks like",
    interim: true,
    say: [
      "This is the middle loop: a clearly-defined project a PhD student or strong masters student could do alone with weekly check-ins. You've tasted it — code autocomplete, ChatGPT polishing a proposal, AI literature review. The difference between autocomplete and Claude writing a whole codebase and iterating is just trust, reliability, and resources.",
      "The capability already exists. Since Claude Opus 4.5 last December, it lets scientists broadly automate the work of an early PhD student — and within a couple of years, an early postdoc. I say that as a postdoc, and not because I'm betting on better models: even if they don't improve, we'll learn to use them far better.",
    ],
  },
  {
    scene: "easter10WhyPossible",
    heading: "Why this was possible",
    interim: true,
    say: [
      "I have no secret skills or private models. I spent the last year streamlining the systems: simulating realistic data, fast access to compute, reliable and transparent ML pipelines. With those in place, Claude had the tools and permission to work. If your science involves computation, data, simulation, literature, long analytical arguments — you can probably already publish decent work in a fairly automated way. The only missing piece is research taste, which you already have.",
    ],
  },
  {
    scene: "statsFeint",
    step: 3,
    heading: "Not just particle physics",
    interim: true,
    say: [
      "In the last six months there have been one, then two, then five, now almost ten papers on doing particle physics analysis with agentic AI. I won't fit an exponential, but you get the gist. An analysis is a perfect fit: much of it is following recipes and patterns and surveying existing work. It's not plug-and-play — a PhD student is lucky to finish one before their defence — but these systems reproduce them in days with a little hand-holding.",
      "Biology is the same. Chemistry, condensed matter, astrophysics, climate, theory — the same. Here's a paper co-published by Matthew Schwartz and Claude. By the end of this year, a non-negligible fraction of physics papers will include AI-produced content.",
    ],
  },
  {
    scene: "platform2028",
    step: 0,
    heading: "A thought experiment: 2028",
    interim: true,
    say: [
      "So let's run some thought experiments. What does your day look like in 2028? You get in, the coffee machine's broken, and you check your dashboard. This is the shape of it: every project has documentation, hypotheses, budget, a codebase, ML logging — and a brain, a live Claude Code thread with a heartbeat that checks in a few times a day with the project, the experiments, you, and the workhorses.",
      "The workhorses are Claude Code sessions on big clusters, with a strict budget and a mandate to prove or disprove hypotheses, write and test code, review literature, and respond to each other. Ideally you rarely touch them directly — you read the feed and nudge the brain. You'd be surprised how much meaningful work autonomous agents produce with maybe once-an-hour human input. I think that moves to once-a-day before we know it.",
    ],
  },
  {
    scene: "nbiGraph",
    step: 2,
    heading: "What collaboration looks like",
    interim: true,
    say: [
      "We can taste this today. Here's a graph of all NBI faculty, positioned by scientific profile — quantum physicists cluster together, near subatomic, far from climate. But the bridges are the interesting part: I scraped everyone's recent five papers and embedded them, and these bridges show similarities your profiles wouldn't suggest.",
    ],
  },
  {
    scene: "matchmaking",
    step: 1,
    heading: "A collaboration lottery",
    interim: true,
    say: [
      "So let's play a collaboration lottery. Pick two groups at random — Climate and Condensed Matter — then two researchers sharing a close bridge: Per Hedegård and Eliza Cook. Per does minimal-model magnetism, DFT and Hubbard models. Eliza dates ice cores by the volcanic tephra trapped inside. Different ends of the building — but both care about the iron-redox state of those shards: Eliza because it controls stratospheric sulphate, Per because his spin-Hamiltonian toolkit can invert magnetic susceptibility to Fe³⁺/Fe²⁺ ratios without destroying the shard. Claude drafts an interdisciplinary grant abstract, and maybe we have a new project.",
    ],
  },
  {
    scene: "faculty2031Teaching",
    step: 3,
    heading: "What teaching looks like",
    interim: true,
    say: [
      "What does teaching look like when every undergraduate has a world-class expert in their pocket? Students will still want in-person education — to network, to make friends, for a human touch. But presenting new material in a traditional lecture won't make sense when an agent can deliver something more personalised at home.",
      "So: reverse lectures. Students study alone or in groups, build intuition with the agent, and the in-person session becomes student-to-student teaching, deep discussion, project work. Harvard, Stanford and Carnegie Mellon are already testing this, with students progressing about twice as fast.",
    ],
  },
  {
    scene: "phdPedagogy",
    step: 3,
    heading: "And PhDs? This keeps me up at night",
    interim: true,
    say: [
      "As for PhD students, I'm at a loss — this keeps me up at night. What does project-based pedagogy look like when a human takes twice, five times, a hundred times as long as an agent? Should a PhD be mostly training in managing AI for science? I hope the bar rises instead: that we get more ambitious, propose entirely new kinds of projects to explore new phenomena that used to need many people and a huge budget, but now a supervisor and a student can do.",
    ],
  },
  {
    scene: "colliderLabLaunch",
    step: 1,
    heading: "A thought experiment, made walkable: 2031",
    interim: true,
    say: [
      "[2031 excursion — spoken narration to be filled from the recording transcript. At this point in the talk I left the slides entirely and opened Collider 2031, a design-fiction platform, walking through the people, the discovery, and how physics gets done five years out.]",
    ],
  },
  {
    scene: "deliverables2026",
    step: 3,
    heading: "Back to now: three real things",
    interim: true,
    say: [
      "[2026 deliverables — narration to be filled from the recording transcript. We snap back from 2031 to today and land on three things you can open right now: ColliderML, ScienceDash, and ChATLAS.]",
    ],
  },
  {
    scene: "nbiAINativeCallToAction",
    step: 5,
    heading: "A call to action",
    interim: true,
    say: [
      "Research institutes are wrestling with these questions, and some are coming out conservative or vague — especially in Europe. That's an opportunity. An institute can use AI to collaborate far more effectively, promote and develop AI research tools, give students very clear guidance and dedicated courses, and write down what a PhD v2 looks like — all backed by a world-class first-principles attitude. With some careful thought there's an exciting opportunity here.",
    ],
  },
  {
    scene: "claudeFinalSlide",
    step: 1,
    heading: "A final slide, written by Claude",
    interim: true,
    say: [
      "For fun, I had Claude read this talk and propose a final slide. Here it is.",
    ],
  },
];
