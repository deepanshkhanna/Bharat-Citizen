import { cn } from "@/lib/utils";
import type { MatchLevel } from "@/data/schemes";

const config: Record<MatchLevel, { label: string; dot: string; className: string }> = {
  high: {
    label: "High Match",
    dot: "bg-success",
    className: "bg-success/10 text-success border-success/20",
  },
  medium: {
    label: "Medium Match",
    dot: "bg-saffron",
    className: "bg-saffron/10 text-saffron border-saffron/30",
  },
  low: {
    label: "Low Match",
    dot: "bg-destructive",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export function MatchBadge({ level, className }: { level: MatchLevel; className?: string }) {
  const c = config[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
        c.className,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}
