import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkles, ChevronRight, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCopilot } from "@/components/copilot-context";
import { categories } from "@/data/categories";
import type { Scheme } from "@/data/schemes";
import { MatchBadge } from "@/components/match-badge";
import { cn } from "@/lib/utils";
import { fetchSchemes } from "@/server/api/schemes";
import { SchemesSkeleton } from "@/components/skeletons";

export const Route = createFileRoute("/schemes")({
  head: () => ({
    meta: [
      { title: "Schemes — Smart Bharat" },
      {
        name: "description",
        content:
          "Search central and state government schemes by category. Understand eligibility, required documents, and how to apply.",
      },
    ],
  }),
  component: SchemesPage,
});

function SchemesPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Scheme["category"] | null>(null);
  const { openCopilot } = useCopilot();

  const { data, isLoading } = useQuery({
    queryKey: ["schemes", activeCategory, query],
    queryFn: () =>
      fetchSchemes({
        data: {
          category: activeCategory || undefined,
          q: query || undefined,
        },
      }),
  });

  const filtered = data?.schemes ?? [];

  const clear = () => {
    setQuery("");
    setActiveCategory(null);
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-12">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary/70">
          Discover
        </p>
        <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Government Schemes
        </h1>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground">
          Search opportunities across ministries, or ask Smart Bharat to guide you to the right one.
        </p>
      </header>

      {/* Category grid */}
      <section className="mt-8">
        <h2 className="sr-only">Categories</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((c) => {
            const Icon = c.icon;
            const active = activeCategory === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setActiveCategory(active ? null : c.name)}
                className={cn(
                  "group flex flex-col items-start rounded-2xl border p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30",
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-xl",
                    active ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-semibold text-foreground">{c.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{c.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Search */}
      <section className="mt-8">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about any government scheme..."
            className="h-14 rounded-full border-border bg-card pl-11 pr-4 text-base shadow-sm"
          />
        </div>
        {(activeCategory || query) && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              {filtered.length} result{filtered.length === 1 ? "" : "s"}
              {activeCategory && ` in ${activeCategory}`}
              {query && ` for "${query}"`}
            </span>
            <button
              onClick={clear}
              className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs hover:bg-surface"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          </div>
        )}
      </section>

      {/* Results */}
      <section className="mt-6">
        {isLoading ? (
          <SchemesSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState onClear={clear} query={query} openCopilot={openCopilot} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <SchemeCard key={s.id} scheme={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SchemeCard({ scheme }: { scheme: Scheme }) {
  return (
    <Link
      to="/schemes/$id"
      params={{ id: scheme.id }}
      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {scheme.category}
        </span>
        <MatchBadge level={scheme.match} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{scheme.name}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{scheme.tagline}</p>
      <div className="mt-auto flex items-center justify-between pt-5">
        <span className="text-xs text-muted-foreground">{scheme.ministry}</span>
        <ChevronRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function EmptyState({
  onClear,
  query,
  openCopilot,
}: {
  onClear: () => void;
  query: string;
  openCopilot: ReturnType<typeof useCopilot>["openCopilot"];
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface/60 px-6 py-12 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Search className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        No matching schemes found
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Try another category, or ask Smart Bharat for help finding a scheme.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button variant="outline" onClick={onClear} className="rounded-full">
          Clear filters
        </Button>
        <Button
          onClick={() =>
            openCopilot({
              seedPrompt: query
                ? `Help me find a scheme related to "${query}".`
                : "Help me find a relevant government scheme.",
            })
          }
          className="rounded-full"
        >
          <Sparkles className="mr-1.5 h-4 w-4" />
          Ask Smart Bharat
        </Button>
      </div>
    </div>
  );
}
