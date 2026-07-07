import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  GraduationCap,
  Construction,
  MapPin,
  Globe,
  ArrowRight,
  ChevronRight,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useCopilot } from "@/components/copilot-context";
import { MatchBadge } from "@/components/match-badge";
import { popularServices } from "@/data/popular";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";
import type { Scheme } from "@/data/schemes";
import { fetchSchemes, fetchRecommendedSchemes } from "@/server/api/schemes";
import { getRecentActivity } from "@/server/api/activity";
import { getProfile } from "@/server/api/profile";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Bharat — AI Civic Copilot" },
      {
        name: "description",
        content:
          "Discover government schemes, check eligibility, and report public issues with a trusted AI civic copilot.",
      },
    ],
  }),
  component: Home,
});

function Hero() {
  const { openCopilot } = useCopilot();
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/8 via-background to-saffron/8 px-6 py-12 md:px-12 md:py-16">
      <div className="jaali-pattern pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative max-w-2xl">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-background/70 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          AI-assisted civic guidance
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-[56px] lg:leading-[1.05]">
          Smart Bharat
        </h1>
        <p className="mt-3 text-lg font-medium text-foreground/80 md:text-xl">
          AI Civic Copilot for Every Citizen
        </p>
        <p className="mt-4 max-w-xl text-base text-muted-foreground">
          Government services made simple through guided AI assistance — discover schemes, check
          eligibility, prepare documents, and report public issues.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button size="lg" onClick={() => openCopilot()} className="rounded-full px-6">
            <Sparkles className="mr-1.5 h-4 w-4" />
            Ask Smart Bharat
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-6">
            <Link to="/schemes">
              Explore Schemes <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

type ActionCard = {
  label: string;
  hint: string;
  icon: LucideIcon;
  to?: string;
  action?: "copilot";
  tone: "primary" | "saffron" | "success" | "info";
};

const actionCards: ActionCard[] = [
  { label: "Find Schemes", hint: "Explore by category", icon: GraduationCap, to: "/schemes", tone: "primary" },
  { label: "Report Issue", hint: "Road, water, more", icon: Construction, to: "/complaints", tone: "saffron" },
  { label: "Track Complaint", hint: "Live status", icon: MapPin, to: "/complaints", tone: "info" },
  { label: "Explore Services", hint: "Popular offerings", icon: Globe, to: "/schemes", tone: "success" },
  { label: "Ask Smart Bharat", hint: "Talk to the copilot", icon: Sparkles, action: "copilot", tone: "primary" },
];

const toneMap = {
  primary: "bg-primary/10 text-primary",
  saffron: "bg-saffron/10 text-saffron",
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
} as const;

function GuidedActions() {
  const { openCopilot } = useCopilot();
  return (
    <section className="mt-10 md:mt-14">
      <SectionHeader
        eyebrow="Guided actions"
        title="What would you like to do today?"
      />
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {actionCards.map((a) => {
          const Icon = a.icon;
          const content = (
            <div className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
              <span
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-xl",
                  toneMap[a.tone],
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="mt-4">
                <p className="text-sm font-semibold text-foreground">{a.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.hint}</p>
              </div>
            </div>
          );
          return a.action === "copilot" ? (
            <button
              key={a.label}
              onClick={() => openCopilot()}
              className="text-left"
            >
              {content}
            </button>
          ) : (
            <Link key={a.label} to={a.to!}>
              {content}
            </Link>
          );
        })}
      </div>
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

function ProfileNudge({ profile }: { profile: any }) {
  if (profile?.onboardingDone) return null;

  return (
    <section className="mt-10">
      <div className="rounded-2xl border border-saffron/25 bg-gradient-to-br from-saffron/8 to-transparent p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-saffron/15 text-saffron">
              <UserPlus className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Complete Your Civic Profile
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Unlock personalized guidance — better recommendations, faster eligibility checks,
                and step-by-step help tailored to you.
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-saffron" /> Better recommendations</li>
                <li className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-saffron" /> Faster eligibility checks</li>
                <li className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-saffron" /> Personalized assistance</li>
              </ul>
            </div>
          </div>
          <Button asChild className="shrink-0 rounded-full bg-saffron text-saffron-foreground hover:bg-saffron/90">
            <Link to="/profile">Complete Profile</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function PopularForCitizens({
  recommendedIds = ["pm-scholarship", "ayushman-bharat", "pm-kisan"],
  schemes = [],
}: {
  recommendedIds?: string[];
  schemes?: Scheme[];
}) {
  const items = recommendedIds
    .map((id) => schemes.find((s) => s.id === id)!)
    .filter(Boolean);

  const displayItems = items.length > 0 ? items : schemes.slice(0, 3);

  return (
    <section className="mt-12">
      <SectionHeader
        eyebrow="Popular for citizens"
        title="Schemes people are exploring right now"
        actionLabel="View all"
        actionTo="/schemes"
      />
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {displayItems.map((s) => (
          <Link
            key={s.id}
            to="/schemes/$id"
            params={{ id: s.id }}
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {s.category}
              </span>
              <MatchBadge level={s.match} />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">{s.name}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.tagline}</p>
            <div className="mt-auto pt-5">
              <span className="inline-flex items-center text-sm font-medium text-primary">
                View details
                <ChevronRight className="ml-0.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function PopularServices() {
  return (
    <section className="mt-12">
      <SectionHeader eyebrow="Popular services" title="Explore by need" />
      <div className="mt-5 -mx-5 flex gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
        {popularServices.map((s) => {
          const cat = categories.find((c) => c.name.toLowerCase().includes(s.key.split(" ")[0])) ??
            categories[0];
          const Icon = cat.icon;
          return (
            <Link
              key={s.key}
              to="/schemes"
              className="flex min-w-[160px] shrink-0 flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/30"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold text-foreground">{s.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function RecentActivity({ activity = [] }: { activity?: any[] }) {
  return (
    <section className="mt-12">
      <SectionHeader eyebrow="Your activity" title="Recent activity" />
      <div className="mt-5 divide-y divide-border rounded-2xl border border-border bg-card shadow-sm">
        {activity.map((r, i) => (
          <div key={r.title + i} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-foreground">{r.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{r.meta}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  actionLabel,
  actionTo,
}: {
  eyebrow: string;
  title: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary/70">
          {eyebrow}
        </p>
        <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground md:text-[28px]">
          {title}
        </h2>
      </div>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="shrink-0 text-sm font-medium text-primary hover:underline"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

function Home() {
  const sessionId = getSessionId();

  const { data: profileData } = useQuery({
    queryKey: ["profile", sessionId],
    queryFn: () => getProfile({ data: { sessionId } }),
  });

  const profileCategory = profileData?.profile?.category;

  const { data: recommendationsData } = useQuery({
    queryKey: ["recommendations", profileCategory],
    queryFn: () => fetchRecommendedSchemes({ data: { profileCategory: profileCategory || undefined } }),
    enabled: !!profileData,
  });

  const { data: schemesData } = useQuery({
    queryKey: ["schemes"],
    queryFn: () => fetchSchemes({ data: {} }),
  });

  const { data: activityData } = useQuery({
    queryKey: ["recentActivity", sessionId],
    queryFn: () => getRecentActivity({ data: { sessionId } }),
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-12">
      <Hero />
      <GuidedActions />
      <ProfileNudge profile={profileData?.profile} />
      <PopularForCitizens
        recommendedIds={recommendationsData?.schemeIds}
        schemes={schemesData?.schemes}
      />
      <PopularServices />
      <RecentActivity activity={activityData?.activity} />
    </div>
  );
}
