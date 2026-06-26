import type { SceneId } from "@/lib/timeline";

// The reading version of the talk: an ordered list of beats, each pairing a
// live embed with the narration for that beat.
//
// NARRATION = the delivered talk, transcribed from the CERN recording (ASR,
// 0:00–46:08, up to "…I'll leave it there. Yeah. Thank you.") and lightly
// cleaned: filler and false-starts trimmed, ASR mishearings of technical terms
// fixed (Perlmutter, Geant, MadGraph, Pythia, HiLumi, milli-charged, MACE,
// AutoAna, ChATLAS, diHiggs, ACTS…). Daniel's phrasing is otherwise kept.
//
// Embeds: deck scenes via /embed (scene), or the live Collider 2031 platform
// routes via url (the 2031 walkthrough was narrated over that site). Beats he
// skipped live (teaching, the Claude final slide) are omitted.

const C2031 = "https://www.danielmurnane.com/Collider-2031";

export type ArticleSection = {
  scene?: SceneId;       // deck scene embed (/embed)
  step?: number;         // starting step for the scene embed (default 0)
  url?: string;          // external embed (Collider 2031 route)
  embedLabel?: string;   // caption for url embeds
  heading?: string;
  say: string[];
};

export const ARTICLE_SECTIONS: ArticleSection[] = [
  // ── Part 1 · today ────────────────────────────────────────────────────
  {
    scene: "title",
    heading: "Getting everyone on the same page",
    say: [
      "Thanks a lot for coming. Wow, it's super hot today — I just flew in from Copenhagen, which is not this bad. Down the bottom-left of my talk there's a temperature gauge; it's a bit hard to see, but it's 33.8°C, which is 5% the temperature of the surface of the Sun. I'm tracking that live through a little API. In Kelvin, of course — it'd be cheating if it were in Celsius.",
      "I'm not sure exactly who here is in particle physics and who isn't, so I want to get everyone on the same page. I'll leave the hands-on examples to the next couple of talks and just try to stimulate some ideas. My background is in collider physics — I'm a member of the ATLAS collaboration, one of its two machine-learning conveners, and this is the kind of thing we work with.",
    ],
  },
  {
    scene: "rateRamp",
    heading: "Forty megahertz",
    say: [
      "We work with the LHC, where collisions happen a lot — we don't have the luxury of taking our time. Not five per second, not ten per second… this is an attempt to visualise one megahertz. We actually gather collisions at 40 megahertz at the Hadron Collider, and at that point it just wasn't possible to render the rate on screen. But if you plastered this whole hall with screens like this, you'd start to see it. It's a lot. And you have to make sense of that data — some of it in real time.",
    ],
  },
  {
    scene: "gnnSolution",
    heading: "Connecting the dots",
    say: [
      "One of the problems I work on more and more these days is tracking. Every collision, we have something like a few thousand particles to reconstruct, and each leaves of order ten hits — plus all the pile-up, so around 300,000 hits in the ATLAS upgrade detector.",
      "One way to solve this is with graph neural networks: we connect all the hits into a candidate graph, then evolve through that graph with a GNN to figure out which edges between hits are true and which are fake. In doing so we reconstruct those order-thousand particles.",
    ],
  },
  {
    scene: "speedJourney",
    heading: "From a minute to ten milliseconds",
    say: [
      "Of course, we don't have a long time to do it. When we started this project a few years ago, it took about a minute per reconstruction. Today it's around 100 milliseconds, and we're pretty sure there's a clear path to about 10 milliseconds. At 10 milliseconds, a thousand-or-so GPUs put you in the ballpark of the megahertz we need for the ATLAS software trigger.",
    ],
  },
  {
    scene: "loopsViz",
    heading: "The inner loop",
    say: [
      "This is really cool — a cutting-edge machine-learning idea — but it's at the level of a task. We're completing a particular task. If you're using words like reconstruct, trigger, reject, we're talking about the inner loop of AI, or what people probably prefer to call ML.",
    ],
  },
  {
    scene: "quirksAside",
    heading: "Same technique, zany tracks",
    say: [
      "It's a nice way to do physics, because we don't need to re-engineer the whole thing from scratch every time we want to find something new. For example, we just put out a paper showing you can reconstruct some really zany tracks with the exact same technique. These are quirks — a type of particle that shows up in a lot of BSM models. They come in pairs, confined at the scale of millimetres or even metres, so they zip away from each other and come back. Current tracking algorithms simply can't find them. For a GNN it's trivial — you just change the loss function.",
    ],
  },
  {
    scene: "innerLoopHistory",
    heading: "None of this is new",
    say: [
      "And it's completely not new. Around 1988 this was shown to work for high-energy physics; by 1991 it was more or less deployed at LEP. That's a while ago, and it keeps getting better. But that's not really what today is about. Today is about going beyond the inner loop.",
    ],
  },
  {
    scene: "loopsVizMiddle",
    heading: "The middle loop",
    say: [
      "So I'll stop talking about ML applications for particular tasks, and zoom out to the middle loop. This is a pretty mature place now: using AI to do whole projects, or parts of projects — writing the code, organising the work, analysing things end to end.",
    ],
  },
  {
    scene: "easter1Release",
    heading: "ColliderML, fully open",
    say: [
      "Let me give an example from about a month ago. We just put out a dataset called ColliderML — around 30 terabytes of full simulation across a bunch of physics channels, all natively open. That's great, but it also means that if there are little quirks in the data, people will find them. You can't hide anything.",
    ],
  },
  {
    scene: "easter2Bug",
    heading: "The email I kept getting",
    say: [
      "One email I got more than once was: hey, we've been training on your dataset, and it's really easy to predict one of the features. One of these is D0, part of the track parameterisation. People could trivially predict it — in fact all they had to do was predict that every track came from (0,0,0), and they'd beat our classical reconstruction algorithm.",
      "I got sick of hearing this, because it's a good question but also provocative when you've spent a long time building a good reconstruction algorithm.",
    ],
  },
  {
    scene: "easter3SmokingGun",
    heading: "The beam spot drifts",
    say: [
      "The heart of the problem: if you assume every collision happens right at the centre of the detector, then yes, most tracks come from near (0,0,0). But in reality the beam spot drifts over time — by up to hundreds of microns — and our simulation wasn't authentically showing that drift. So a trivial ML model predicting (0,0,0) could beat our classical algorithm, which actually generalises to any beam spot. There was real tension there. So I thought: let me just solve this.",
    ],
  },
  {
    scene: "rorvigRunPhone",
    heading: "A project, dictated on a run",
    say: [
      "Over Easter I went for a run — we were staying in a summerhouse in northern Denmark. Not a great pace, just over five minutes a kilometre, but during the run I managed to dictate a very short project: what if you didn't move the beam line — could ML still do equally well? I recorded the project during the run and transcribed it.",
    ],
  },
  {
    scene: "easter5Dispatch",
    heading: "Then Perlmutter woke up",
    say: [
      "Because I was blessed to be at a small summerhouse with my wife and child, I sent the project off to Claude — running on Perlmutter, one of the larger Department of Energy systems. I uploaded the project and basically said: don't interrupt me for a few days. The blue is me defining the project (the animation isn't great over Zoom, but you get the gist). Then Claude started to work. I gave it a budget of around a thousand GPU-hours, and tracked the CPU- and GPU-hours as it went. It worked for about three days.",
    ],
  },
  {
    scene: "easter8Reveal",
    heading: "It gave me back a paper",
    say: [
      "Then it gave me back a paper draft, which was pretty decent. There were some issues with captioning, and some of the conclusions were a little ambitious — Claude is very good at saying \"wow, you've solved all the physics\" when in fact you've made a small dent on one particular problem. Once I'd talked it down from those delusions of grandeur, I shared it with the rest of the ColliderML group. It basically answered the question of which ways you'd use ML here — dispatching various model-training tasks — and came out as a decent first draft.",
    ],
  },
  {
    scene: "easter9Thesis",
    heading: "What the middle loop looks like",
    say: [
      "I think that's a good way to understand the middle loop, circa May–June 2026: a project that might take a few days — especially anything to do with machine learning, which Claude is extremely good at — and that comes out as not a Nature-worthy paper, but certainly an arXiv-worthy one. If you're using words like code, or ChatGPT, you've seen this workflow before.",
    ],
  },
  {
    scene: "easter10WhyPossible",
    heading: "Why this one worked",
    say: [
      "Why did this project work? Having an already well-established codebase, metrics I already trusted from classical algorithms — a trustworthy foundation — makes a Claude-based project much more reliable. And running it all on the cluster: I gave Claude direct access to my full Perlmutter allocations. It's really good at knowing how to use them — it knows how Slurm works, it can sleep and wait for days until a job finishes and then pick it back up. There's almost no excuse not to do this kind of thing. You already have the research taste yourself; a lot of the boring stuff can be automated.",
    ],
  },
  {
    scene: "statsFeint",
    heading: "Test-driven physics",
    say: [
      "Specifically on agentic particle physics, this is a little snapshot of where things were — there were a couple of very early adopters.",
      "Test-driven development is good physics practice now. I write software tests, but I also write physics tests: I have a physical intuition for what some analytical solution should give, so I hard-code those analytical solutions as unit tests. Another example, from last week — I took my thesis from a long time ago and ran it through Claude. I was terrified it would find errors, and it did, which is fine. But I'd spent years on those analytical solutions, and it solved them over a weekend, which is depressing. Then it could use them as test-driven development: for a composite-Higgs model, if it builds new models, they should reduce back to those analytical solutions. Write the test first, make sure it fails, do the research, make sure it passes — that little loop is super powerful.",
      "Can the whole loop be automated? I don't think so — not yet. I don't write code anymore, but explaining what the test should do — the edge cases, the corner cases of a physics scenario — is still a useful human input. Maybe for another few months.",
      "And it's not just particle physics — it's every physics domain, every science domain. This snapshot is incomplete; I didn't thoroughly search the last two months of the other fields. But if you need convincing, I point to this Matthew Schwartz paper, which he co-wrote with Claude. This is a serious guy — a textbook-writing theoretical physicist. Whenever I'm debating theorists who push back — sure, you can do it for experiment or phenomenology, but theory is serious — I point to a serious theorist who wanted to make Claude his co-author.",
    ],
  },

  // ── Part 2 · 2028 ─────────────────────────────────────────────────────
  {
    scene: "calendarFlip2028",
    heading: "Skip forward to 2028",
    say: [
      "But okay — that's today. What if we skip forward a couple of years, to 2028? Where does this go?",
    ],
  },
  {
    scene: "platform2028",
    heading: "Everything, formalised",
    say: [
      "By 2028, all these ad-hoc little things I'm doing in Claude — that everyone is doing — should be formalised. I imagine scientific dashboards where all your projects are well-defined and tracked, with a full suite of agents working on them. You can see how many CPU- and GPU-hours each has, its resource budget, which papers it's contributing to — and people: how are your collaborators interacting with your agents? Can you look at your students' agents, and how their agents interact with yours? What does the ecosystem look like?",
      "That's where these messy experiments start to look more formal — and where we're really in the outer loop: programmes, careers, how you come up with ideas, how you collaborate, teach and publish.",
    ],
  },
  {
    scene: "nbiGraph",
    heading: "What collaboration could look like",
    say: [
      "Take collaboration. I'm at NBI, the Niels Bohr Institute in Copenhagen, and my impression is that people there don't talk to each other very much — they're very siloed. There are about 100 permanent staff, so I scraped them all and built a network. The grey connections are the people you'd expect to know each other — similar abstracts, both particle physicists, both chemists. The yellow connections are people who look similar and have recently published on a coincidentally similar topic, but probably don't know each other.",
    ],
  },
  {
    scene: "matchmaking",
    heading: "A collaboration lottery",
    say: [
      "So I ran a lottery: randomly pick two people with a strong bridging connection, from two different sections of NBI, and have Claude cook up a grant proposal. It did pretty well. I emailed it to them beforehand — I was worried they'd be offended — and they said it basically looked reasonable. One group is condensed matter, the other paleoclimatology; these are not people bumping into each other over coffee. It seems obvious to me this kind of tool should be built into institutes.",
    ],
  },
  {
    scene: "faculty2031Teaching",
    heading: "Teaching — which I skipped on the day",
    say: [
      "Teaching, maybe I'll skip — I'm taking longer than I thought.",
      "[I flipped past this slide live; here's what it argued.] When every undergraduate has a world-class expert in their pocket, students will still want in-person education — to network, to make friends, for a human touch. But presenting new material in a traditional lecture won't make sense when an agent can deliver something more personalised at home. So: reverse lectures — students build intuition with the agent, and the in-person session becomes student-to-student teaching, discussion, project work. Harvard, Stanford and Carnegie Mellon are already testing this, with students progressing about twice as fast.",
    ],
  },
  {
    scene: "phdPedagogy",
    heading: "And what is a PhD, now?",
    say: [
      "Teaching I'll skip — I'm taking longer than I thought. But there's an open question: what does a PhD even look like when an agent can do twice, five times, a hundred times the work of a PhD student, and faster? I hope it means a student uses many agents and gets a lot more done — that we raise the ambition for what a PhD is. It shouldn't just be one or two analyses; it should be something more grand.",
    ],
  },

  // ── Part 3 · the 2031 thought experiment (live Collider 2031) ─────────
  {
    scene: "calendarFlip2031",
    heading: "Jump way ahead: 2031",
    say: [
      "Okay — that was 2028. Let me jump way ahead, to 2031, when the HL-LHC will have been running for a little while, and run a thought experiment for what life looks like for a particle physicist then. This is a role-play, and it's available online — you can go to GitHub, pull the platform, and make your own version of this future.",
    ],
  },
  {
    url: `${C2031}/dashboard`,
    embedLabel: "Collider 2031 · Maja's dashboard",
    heading: "Meet Maja",
    say: [
      "Let's follow a student, Maja, working on a platform called ColliderLab. She's a climate-science PhD student at Zürich, and a member of the HiLumi Metacollaboration. Metacollaborations are cross-detector communities that police their own standards. They had to be created because in 2027 the Swiss parliament passed legislation requiring that every publicly-funded project putting data on a software system make it open instantly — so the regular collaborations like ATLAS and CMS, built on keeping data internal, fell apart, and these open-source meta-collaborations sprang up.",
      "Maja is still a climate scientist, but does a bit of particle physics on the side. She stores about 3 terabytes of data on her local machine, which earns her credits, and she leaves it on at night so analyses can run. What does anyone spend their credits on? GPU-hours. So let's spend some.",
    ],
  },
  {
    url: `${C2031}/foundation`,
    embedLabel: "Collider 2031 · Foundation Space",
    heading: "Foundation Space, an anomaly, and a simulation",
    say: [
      "Maja is working on an idea in Foundation Space — a 100,000-dimensional latent space that captures the processes of the Standard Model: an embedding of the reconstruction and analysis models across the different collaborations. Because all data is collected in real time, events get embedded into this space as they arrive. Some ATLAS and CMS events land outside the Standard-Model surface — usually just detector miscalibrations that a calibration agent picks up. How do you interpolate a surface in 100,000 dimensions? You need a differentiable simulation — and all simulation has been differentiable for a couple of years, since Geant 5.",
      "Over the last few days, Maja noticed a weird little anomaly that appears on the surface, leaves it, and comes back — and the agents can't figure out what it is. These unsolved anomalies are handed out as bounties. Looking at it, there's an ATLAS event and a CMS event at about the same time; because we can attach anomaly scores all the way down to individual hits, both have an anomalous part, happening simultaneously across both detectors over a few minutes.",
      "Maja has a theory, but to test it she has to simulate it — so, right here in Foundation Space, she builds one. By 2031 all simulations are trivial; nobody looks at CMSSW or Athena anymore, you describe it in natural language. Being a climate and planetary scientist, she wants to simulate a solar flare with a program she knows, Solaris, at its M-class settings. That hasn't been simulated before, so the agent finds the program and inserts it into the ATLAS and CMS geometries. A few hundred million events should do it.",
    ],
  },
  {
    url: `${C2031}/calibration`,
    embedLabel: "Collider 2031 · Calibration",
    heading: "Simulation, in minutes",
    say: [
      "How is this so fast — hundreds of millions of full-quality simulations in a few minutes? Ever since Simulation, Reconstruction and Analysis as a Service came online, you just submit tasks to centralised clusters. And since everything was ported to GPU — Geant 5, MadGraph, Pythia — there's an orders-of-magnitude speed-up.",
      "We get back 100 million events, and they don't quite match — which is fine, we haven't built or calibrated this simulation before. So we calibrate it to Foundation Space. Ever since adversarial unfolding was invented in 2027, we can just run the calibration.",
    ],
  },
  {
    url: `${C2031}/solar`,
    embedLabel: "Collider 2031 · Solar confirmation",
    heading: "It's the Sun",
    say: [
      "And once it's properly calibrated, the simulation matches the anomaly she saw almost perfectly. She's solved the bounty — it was a solar flare. She messages her PI: I think I've solved this. The PI says, great, present it at the next group meeting.",
      "She commits her new simulation to Foundation Space — all new simulations go in, so they can be used for future constraints — and some agents check that the commit makes sense.",
    ],
  },
  {
    url: `${C2031}/analysis`,
    embedLabel: "Collider 2031 · Real-time analysis",
    heading: "Who pays for all this?",
    say: [
      "Now — who's paying for hundreds of thousands of GPU-hours? Ever since one of the LHC's big ML advocates took a major tech CEO out drinking and convinced him to donate idle GPU-hours to LHC projects. What sold him was the Higgs vacuum-stability measurement, which he thought was really sexy: can we measure the diHiggs coupling, the top mass and the Higgs mass precisely enough to constrain whether the Higgs vacuum is stable?",
      "Because events come in real time, you can watch the vacuum-stability constraint tighten live. We don't release analysis papers anymore — the data is available in real time and the analyses just update on the fly. And you can spend your credits to bet on outcomes, which generates more credits for the whole ecosystem. Anyone can contribute — GPU-hours, storage, creativity — without being part of a collaboration.",
    ],
  },
  {
    url: `${C2031}/erik?era=2028`,
    embedLabel: "Collider 2031 · Erik · 2028",
    heading: "The other version: Erik, 2028",
    say: [
      "There's another version of this story. Back in 2028, Erik starts his PhD, super excited to learn how particle physics is done — searching for BSM resonances on Run 3 data. He uses AutoAna, where analysis is partly automated by agents. He specifies the analysis, discusses it with the agentic system, tightens cuts, runs on a small unblinded subset for sanity-check histograms, takes it to his weekly supervisor meeting. There's a lot of human in the loop, and he comes away feeling like he's done some physics.",
    ],
  },
  {
    url: `${C2031}/erik?era=2029`,
    embedLabel: "Collider 2031 · Erik · 2029",
    heading: "Erik, 2029 — the manager",
    say: [
      "Jump to 2029. AutoAna has been deprecated — a paper running for two years proved conclusively that including humans in the loop reduced sensitivity, because it introduces bias and inefficiency. So most analyses are now forbidden from human interaction; there isn't even collaboration review, because an approval agent is more effective. Erik's job is to let the agent try thousands of configurations and tweak here and there — he looks like a manager.",
    ],
  },
  {
    url: `${C2031}/erik?stage=defense`,
    embedLabel: "Collider 2031 · Erik · defence",
    heading: "Erik's defence — and exit",
    say: [
      "At his defence, the committee asks why he chose X, Y, Z, and his answer is, more or less, \"because the agent told me to.\" He passes, but leaves physics, disillusioned. And because people aren't doing analyses, ATLAS membership has plummeted — from about 5,200 in 2028 to around 1,500. The agentic analysis made precision and discovery better; it's just not compatible with how a large collaboration staffs thousands of members.",
    ],
  },
  {
    url: `${C2031}/elena?era=2029`,
    embedLabel: "Collider 2031 · Elena · 2029 · design",
    heading: "A better version: Elena, 2029",
    say: [
      "That was a bit of a bummer, so let me do one more — Elena, who I'll admit I haven't fully fleshed out. She starts her PhD in 2029, when agentic analysis has removed the human from the loop, so her advisor suggests she build her own experiment: a search for milli-charged particles from a dark-photon sector. She runs literature reviews with agents, tries different detector geometries — much of which can be optimised automatically, since the simulation is differentiable — and writes a TDR for a little tabletop experiment.",
    ],
  },
  {
    url: `${C2031}/elena?era=2031`,
    embedLabel: "Collider 2031 · Elena · 2031 · run",
    heading: "Elena, 2031 — building and taking data",
    say: [
      "She starts her own small collaboration, MACE — her group plus a few others — and designs a tabletop experiment that's much cheaper thanks to 3D printing and agent-run robotics. She's tinkering now, picking up skills in materials, electronics, experiment design. Around 2030 she commissions it and traps her first ions, making a dent in the dark-photon constraint space. By 2031 she takes a year of data.",
    ],
  },
  {
    url: `${C2031}/elena?era=2032`,
    embedLabel: "Collider 2031 · Elena · 2032 · commit",
    heading: "Elena, 2032 — unblind and commit",
    say: [
      "She unblinds her year of data just before her defence — not quite as constrained as she'd hoped, but a real dent — and commits it to Foundation Space so phenomenologists and experimentalists can use it. That's a more encouraging world: people empowered to do smaller, cheaper experiments, compatible with large collaborations that automate the analysis and reconstruction we all know and love.",
    ],
  },

  // ── Part 4 · back to today: real deliverables ────────────────────────
  {
    scene: "calendarFlip2026back",
    heading: "Back to now — three concrete things",
    say: [
      "That's 2031. In a dream world I'd have more time and give you three concrete examples of what this actually looks like today — because I think we're closer than we realise. I'll steer clear of agentic analysis (Eric will show plenty of that) and give one example: ColliderML.",
    ],
  },
  {
    url: "https://opendatadetector.github.io/ColliderML/",
    embedLabel: "ColliderML · the open dataset",
    heading: "One: ColliderML — fully open",
    say: [
      "ColliderML is a fully-open simulation system on a hypothetical detector called the Open Data Detector. I wish I had more than ten seconds for this. Everything is open — the dataset is about 30 terabytes of full simulation across a range of physics channels — so you can run it on your laptop and build your own workflows.",
    ],
  },
  {
    url: "https://opendatadetector.github.io/ColliderML/builder.html",
    embedLabel: "ColliderML · workflow builder",
    heading: "The workflow builder",
    say: [
      "You build a workflow stage by stage. How do we generate? MadGraph plus Pythia. How do we simulate? Geant 4. What's the pile-up? How do we digitise? You reconstruct with ACTS — the state-of-the-art tracking ATLAS uses — or Pandora, which FCC will use. It's all built in, and you can pull that configuration and run it on your laptop. Or you can ask a copilot — change ttbar to Z→μμ — and it looks at your workflow and suggests the updates. Earlier, when I showed the ColliderLab simulation, that was a toy; this really works.",
    ],
  },
  {
    url: "https://opendatadetector.github.io/ColliderML/guide/remote-simulation.html",
    embedLabel: "ColliderML · laptop or Perlmutter",
    heading: "Run it — laptop, or Perlmutter",
    say: [
      "You can simulate on your laptop, or earn points by submitting good models and running them on Perlmutter for millions of events. The points all run through Hugging Face, which has been generous about hosting the data.",
    ],
  },
  {
    scene: "deliverables2026",
    step: 2,
    heading: "Two: ScienceDash, the dashboard I actually use",
    say: [
      "The dashboard from the 2028 thought experiment isn't speculative — it's the real seed of it, and I run it today. It lives on a little home box: a PC sitting in the corner on top of a paint can, running Claude all the time to manage my projects.",
    ],
  },
  {
    scene: "deliverables2026",
    step: 3,
    heading: "Three: ChATLAS, retrieval on closed data",
    say: [
      "The third is ChATLAS, an AI assistant for ATLAS. [This came up in the Q&A.] We've found that even good old fine-tuning of embeddings improves our ability to find relevant information that's hidden behind ATLAS's login wall — information that, in principle, shouldn't be in the training data of a GPT or a Claude. Fine-tuning takes us from about 30% retrieval accuracy to 70%. It's deep in the weeds, but it points to a space where we can still use our closed data to do things that are good for us as a community.",
      "And maybe I'm going to leave it there. Maybe in the discussion later I can show one of the others — but I'll leave it there. Thank you.",
    ],
  },

  // ── Q&A (transcription was stopped, at the speaker's request, shortly after
  //    the closer — so this captures the first exchanges only) ──────────────
  {
    scene: "easter5Dispatch",
    heading: "Q&A · adversarial agents",
    say: [
      "[From the floor:] When computers first came along they were a great tool for science, but we also got computer viruses. Here, an adversarial agent can be devastating — a disgruntled employee could use agents to delete things or mess with your experiments. How do you see that?",
      "That keeps me up at night, for sure. As I said, I run an open Claude setup on a little home box at home, running all the time — and if someone got into that, they could basically destroy my life, and worse, a lot of scientific data. We're having exactly this discussion in ATLAS: how much privilege do you give an agent on a multi-billion-franc system that could, in principle, find a way to delete data? It shouldn't happen, but these systems can exploit incredible little loopholes. I don't have a good answer for it.",
    ],
  },
  {
    scene: "nbiAINativeCallToAction",
    heading: "Q&A · academia and the frontier labs",
    say: [
      "[From the floor:] How do you see the future of academia being exploited or replaced by AI labs? The frontier labs are automating industry — building RL environments, gathering datasets from Slack, from Claude Code. How might that play out in academia, and how might we build an open-source 'Hugging Face for research': sharing failed experiments, negative results, rethinking H-indexes, citations, PDFs and journals?",
      "I think there's still a little space we can carve out as physicists. Take ChATLAS: even good old fine-tuning of embeddings improves our ability to find information hidden behind ATLAS's login wall — data that shouldn't be in a GPT's or Claude's training set — taking retrieval from about 30% to 70%. That's deep in the weeds, but it points to a space where we can use our closed data for the good of the community. It won't solve the whole thing, though: at some point the floodgates open and all the data should be public. Then we have to totally rethink things — what does ATLAS look like if 80% of the people stop working there because there's nothing to do? The whole funding structure falls apart. How that integrates with the frontier labs — how much we work with them or against them — isn't clear to me. Sorry, another non-answer.",
    ],
  },
  {
    scene: "easter9Thesis",
    heading: "Q&A · is it good enough — and prompt engineering?",
    say: [
      "[Remote question:] If we give an agent a project and it produces a paper, do you think the agent's reasoning about its own results is satisfactory for a review committee? And when you submit a project to an agent, do you prompt in a special way — should physicists be learning prompt engineering, alongside physics, to get good results?",
      "[The recording was stopped here, at my request, just into the Q&A — so my answer to this one, and the questions after it, aren't in the transcript.]",
    ],
  },
];
