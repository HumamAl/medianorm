// NO "use client" — pure JSX, no hooks

interface ExecutiveSummaryProps {
  commonApproach: string;
  differentApproach: string;
  accentWord?: string;
}

export function ExecutiveSummary({
  commonApproach,
  differentApproach,
  accentWord,
}: ExecutiveSummaryProps) {
  const renderDifferentApproach = () => {
    if (!accentWord) return <span>{differentApproach}</span>;
    const escaped = accentWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = differentApproach.split(new RegExp(`(${escaped})`, "i"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === accentWord.toLowerCase() ? (
            <span key={i} className="text-primary font-semibold">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div
      className="relative overflow-hidden rounded-sm p-5 md:p-6"
      style={{
        background: "oklch(0.10 0.02 var(--primary-h, 265))",
        backgroundImage:
          "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.03), transparent 70%)",
      }}
    >
      {/* Common approach — what devs typically do */}
      <p className="text-xs md:text-sm leading-relaxed text-white/45 font-mono">
        {commonApproach}
      </p>
      <hr className="my-3 border-white/10" />
      {/* Differentiated approach */}
      <p className="text-sm md:text-base leading-relaxed font-medium text-white/85">
        {renderDifferentApproach()}
      </p>
      <p className="text-[11px] text-white/35 mt-3">
        <a
          href="/"
          className="hover:text-white/55 transition-colors underline underline-offset-2"
          style={{ transitionDuration: "var(--dur-fast, 60ms)" }}
        >
          See the demo
        </a>
      </p>
    </div>
  );
}
