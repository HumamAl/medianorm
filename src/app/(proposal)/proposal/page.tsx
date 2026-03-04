import { profile, portfolioProjects } from "@/data/proposal";
import { ProjectCard } from "@/components/proposal/project-card";
import { SkillsGrid } from "@/components/proposal/skills-grid";

export default function ProposalPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">

      {/* ── Section 1: Hero — project-first dark panel ── */}
      <section
        className="relative rounded-sm overflow-hidden"
        style={{ background: `oklch(0.10 0.02 var(--primary-h, 265))` }}
      >
        {/* Subtle radial accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 0%, oklch(0.45 0.22 265 / 0.12), transparent 70%)",
          }}
        />

        <div className="relative px-8 pt-8 pb-6 space-y-4">
          {/* Effort badge — mandatory */}
          <div className="inline-flex items-center gap-2">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-white/50">
              Built this demo for your project
            </span>
          </div>

          {/* Role prefix */}
          <p className="font-mono text-[10px] tracking-widest uppercase text-white/40">
            React Engineer · AI Integration · Data Pipelines
          </p>

          {/* Name headline */}
          <h1 className="text-4xl md:text-5xl tracking-tight leading-none">
            <span className="font-light text-white/70">Hi, I&apos;m</span>{" "}
            <span className="font-bold text-white">{profile.name}</span>
          </h1>

          {/* Tailored value prop — specific to MediaNorm */}
          <p className="text-base text-white/65 max-w-2xl leading-relaxed">
            {profile.tagline}
          </p>

          <p className="text-sm text-white/50 leading-relaxed max-w-2xl">
            {profile.bio}
          </p>
        </div>

        {/* Stats shelf */}
        <div className="relative border-t border-white/10 bg-white/5 px-8 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="font-mono text-xl font-bold text-white">24+</div>
              <div className="font-mono text-[10px] text-white/50 uppercase tracking-wider mt-0.5">
                Projects Shipped
              </div>
            </div>
            <div>
              <div className="font-mono text-xl font-bold text-white">&lt;48hr</div>
              <div className="font-mono text-[10px] text-white/50 uppercase tracking-wider mt-0.5">
                Demo Turnaround
              </div>
            </div>
            <div>
              <div className="font-mono text-xl font-bold text-white">15+</div>
              <div className="font-mono text-[10px] text-white/50 uppercase tracking-wider mt-0.5">
                Industries Served
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Proof of Work ── */}
      <section className="space-y-4">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            Proof of Work
          </p>
          <h2 className="text-lg font-semibold tracking-tight mt-1">
            Relevant Projects
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {portfolioProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              tech={project.tech}
              relevance={project.relevance}
              outcome={project.outcome}
              liveUrl={project.liveUrl}
            />
          ))}
        </div>
      </section>

      {/* ── Section 3: How I Work ── */}
      <section className="space-y-4">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            Process
          </p>
          <h2 className="text-lg font-semibold tracking-tight mt-1">
            How I Work
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {profile.approach.map((step, i) => (
            <div
              key={step.title}
              className="flex gap-3 p-4 rounded-sm border border-border/60 bg-card"
            >
              <div className="shrink-0">
                <span className="font-mono text-xs font-bold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold">{step.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline note */}
        <p className="text-xs text-muted-foreground font-mono">
          Cadence: 20-25 hrs/week · iterative · direct with you, no PM layer
        </p>
      </section>

      {/* ── Section 4: Skills Grid ── */}
      <section className="space-y-4">
        <div>
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            Tech Stack
          </p>
          <h2 className="text-lg font-semibold tracking-tight mt-1">
            What I Build With
          </h2>
        </div>

        <SkillsGrid categories={profile.skillCategories} />
      </section>

      {/* ── Section 5: CTA — dark panel bookend ── */}
      <section
        className="rounded-sm overflow-hidden text-center"
        style={{ background: `oklch(0.10 0.02 var(--primary-h, 265))` }}
      >
        <div className="px-8 py-10 space-y-4">
          {/* Availability indicator */}
          <div className="flex items-center justify-center gap-2">
            <span className="relative inline-flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--success)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--success)]" />
            </span>
            <span
              className="text-xs font-mono"
              style={{
                color: "color-mix(in oklch, var(--success) 80%, white)",
              }}
            >
              Currently available for new projects
            </span>
          </div>

          {/* Tailored headline */}
          <h2 className="text-xl font-bold text-white">
            Your reconciliation backlog is a solvable engineering problem.
          </h2>

          {/* Specific body copy */}
          <p className="text-sm text-white/60 max-w-md mx-auto leading-relaxed">
            I built the demo to show how the matching engine works against real
            buy-plan data. The production version — with your vendor formats,
            your tolerance rules, and your approval workflow — ships
            incrementally. No big-bang delivery.
          </p>

          {/* Primary action — text, not a dead button */}
          <div className="pt-2 space-y-2">
            <p className="text-base font-semibold text-white">
              Reply on Upwork to start
            </p>
            <p className="text-xs text-white/40">or</p>
            <a
              href="/"
              className="text-xs text-white/50 hover:text-white/70 transition-colors"
              style={{ transitionDuration: "var(--dur-fast)" }}
            >
              Check the demo first
            </a>
          </div>

          {/* Signature */}
          <p className="text-xs text-white/30 border-t border-white/10 pt-4 mt-4 font-mono">
            -- Humam
          </p>
        </div>
      </section>

    </div>
  );
}
