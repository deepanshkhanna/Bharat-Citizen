import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MatchBadge } from "@/components/match-badge";
import { TrustBadge } from "@/components/trust-badge";
import { useCopilot } from "@/components/copilot-context";
import { getScheme, type EligibilityItem } from "@/data/schemes";
import { SchemeDetailSkeleton } from "@/components/skeletons";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/server/api/profile";
import { fetchSchemeById } from "@/server/api/schemes";

export const Route = createFileRoute("/schemes/$id")({
  loader: async ({ params }) => {
    try {
      const result = await fetchSchemeById({ data: { id: params.id } });
      return { scheme: result.scheme } as const;
    } catch (error) {
      throw notFound();
    }
  },
  pendingComponent: SchemeDetailSkeleton,
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.scheme.name} — Smart Bharat` },
          { name: "description", content: loaderData.scheme.tagline },
        ]
      : [{ title: "Scheme — Smart Bharat" }],
  }),
  component: SchemeDetail,
});

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-border py-6 last:border-0">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-primary/70">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function getSessionId(): string {
  if (typeof window === "undefined") return "__ssr__";
  let id = localStorage.getItem("sb_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("sb_session_id", id);
  }
  return id;
}

function SchemeDetail() {
  const loaderData = Route.useLoaderData();
  const { openCopilot } = useCopilot();
  const sessionId = getSessionId();

  const { data: profileData } = useQuery({
    queryKey: ["profile", sessionId],
    queryFn: () => getProfile({ data: { sessionId } }),
  });

  const profileCategory = profileData?.profile?.category;

  const { data: schemeData } = useQuery({
    queryKey: ["scheme", loaderData.scheme.id, profileCategory],
    queryFn: async () => {
      const res = await fetchSchemeById({ data: { id: loaderData.scheme.id, profileCategory: profileCategory || undefined } });
      return res.scheme;
    },
    initialData: loaderData.scheme,
  });

  const scheme = schemeData || loaderData.scheme;

  const askAboutScheme = () =>
    openCopilot({
      context: { page: "scheme", scheme_name: scheme.name, scheme_id: scheme.id },
      seedPrompt: `Tell me about eligibility and how to apply for ${scheme.name}.`,
    });

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 pb-40 md:px-10 md:py-12 md:pb-32">
      <Link
        to="/schemes"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All schemes
      </Link>

      <article className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
        {/* 1. Name */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {scheme.category}
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {scheme.name}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{scheme.ministry}</p>
          </div>
          <MatchBadge level={scheme.match} />
        </div>

        {/* 2. Overview */}
        <Section title="Overview">
          <p className="text-base leading-relaxed text-foreground/90">{scheme.overview}</p>
        </Section>

        {/* 3. Eligibility */}
        <Section title="Eligibility">
          <ul className="space-y-2.5">
            {scheme.eligibility.map((e: EligibilityItem) => (
              <li key={e.label} className="flex items-start gap-3 text-sm">
                {e.met ? (
                  <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-success" size={18} />
                ) : (
                  <AlertCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-saffron" size={18} />
                )}
                <span className={e.met ? "text-foreground" : "text-muted-foreground"}>
                  {e.label}
                  {!e.met && (
                    <span className="ml-1.5 text-xs font-medium text-saffron">
                      · needs attention
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        {/* 4. Match Level */}
        <Section title="Match Level">
          <div className="flex flex-wrap items-center gap-3">
            <MatchBadge level={scheme.match} />
            <span className="text-sm text-muted-foreground">Based on your civic profile</span>
          </div>
        </Section>

        {/* 5. Required Documents */}
        <Section title="Required Documents">
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {scheme.documents.map((d: string) => (
              <li
                key={d}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-surface/60 px-3 py-2.5 text-sm text-foreground"
              >
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                {d}
              </li>
            ))}
          </ul>
        </Section>

        {/* 6. Resources */}
        <Section title="Resources">
          <div className="flex flex-wrap gap-2">
            <ResourceLink href={scheme.resources.officialPortal} label="Official Portal" />
            {scheme.resources.applicationForm && (
              <ResourceLink href={scheme.resources.applicationForm} label="Application Form" />
            )}
            {scheme.resources.learnMore && (
              <ResourceLink href={scheme.resources.learnMore} label="Learn More" />
            )}
          </div>
        </Section>

        {/* 7. Trust */}
        <Section title="Trust">
          <div className="flex flex-wrap gap-2">
            <TrustBadge variant="verified" />
            <TrustBadge variant="ai" />
            <TrustBadge variant="personalized" />
            <TrustBadge variant="official" />
          </div>
        </Section>
      </article>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-16 z-20 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:bottom-0 md:left-64">
        <div className="mx-auto flex max-w-3xl items-center gap-3 md:justify-end md:px-10">
          <Button
            asChild
            variant="outline"
            className="flex-1 rounded-full md:flex-none"
          >
            <a
              href={scheme.resources.officialPortal}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-1.5 h-4 w-4" /> Official Portal
            </a>
          </Button>
          <Button onClick={askAboutScheme} className="flex-1 rounded-full md:flex-none">
            <Sparkles className="mr-1.5 h-4 w-4" /> Ask Smart Bharat
          </Button>
        </div>
      </div>
    </div>
  );
}

function ResourceLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}
