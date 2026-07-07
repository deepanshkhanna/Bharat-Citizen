import { Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopilot } from "@/components/copilot-context";

export function PhasePlaceholder({
  title,
  icon: Icon,
  intro,
  features,
}: {
  title: string;
  icon: LucideIcon;
  intro: string;
  features: string[];
}) {
  const { openCopilot } = useCopilot();
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:px-10 md:py-16">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm md:p-12">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            Coming in Phase 2
          </span>
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-base text-muted-foreground">{intro}</p>

        <ul className="mt-6 space-y-2.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm text-foreground">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {f}
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-muted-foreground">
          This section is being built next.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Home
            </Link>
          </Button>
          <Button onClick={() => openCopilot()}>
            <Sparkles className="mr-1.5 h-4 w-4" /> Ask Smart Bharat
          </Button>
        </div>
      </div>
    </div>
  );
}
