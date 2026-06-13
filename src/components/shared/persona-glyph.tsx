import { cn } from "@/lib/utils";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/** Faceless, premium customer marker: an accent-glowing disc with initials. */
export function PersonaGlyph({
  name,
  accent,
  size = 44,
  className,
}: {
  name: string;
  accent: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("relative grid shrink-0 place-items-center rounded-xl ring-1 ring-white/15", className)}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${accent}cc, ${accent}40)`,
        boxShadow: `0 0 14px ${accent}55, inset 0 0 12px rgba(255,255,255,0.08)`,
      }}
    >
      <span className="font-mono font-bold text-white" style={{ fontSize: size * 0.32 }}>
        {initials(name)}
      </span>
    </span>
  );
}
