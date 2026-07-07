import { ShieldCheck, Sparkles, UserRound, Landmark, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "verified" | "ai" | "personalized" | "official";

const config: Record<Variant, { label: string; icon: LucideIcon; className: string }> = {
  verified: {
    label: "Verified Source",
    icon: ShieldCheck,
    className: "bg-success/10 text-success border-success/20",
  },
  ai: {
    label: "AI Assisted",
    icon: Sparkles,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  personalized: {
    label: "Personalized",
    icon: UserRound,
    className: "bg-saffron/10 text-saffron border-saffron/30",
  },
  official: {
    label: "Official Resource",
    icon: Landmark,
    className: "bg-info/10 text-info border-info/20",
  },
};

export function TrustBadge({
  variant,
  label,
  className,
}: {
  variant: Variant;
  label?: string;
  className?: string;
}) {
  const c = config[variant];
  const Icon = c.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        c.className,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label ?? c.label}
    </span>
  );
}
