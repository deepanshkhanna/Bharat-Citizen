import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Layers,
  Megaphone,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CopilotDrawer, CopilotFAB } from "@/components/copilot-drawer";
import { CopilotProvider, useCopilot } from "@/components/copilot-context";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  match: (path: string) => boolean;
  action?: "copilot";
};

const nav: NavItem[] = [
  { to: "/", label: "Home", icon: Home, match: (p) => p === "/" },
  { to: "/schemes", label: "Schemes", icon: Layers, match: (p) => p.startsWith("/schemes") },
  { to: "/complaints", label: "Complaints", icon: Megaphone, match: (p) => p.startsWith("/complaints") },
  { to: "/copilot", label: "Copilot", icon: Sparkles, match: (p) => p.startsWith("/copilot") },
  { to: "/profile", label: "Profile", icon: UserRound, match: (p) => p.startsWith("/profile") },
];

function BrandMark() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Sparkles className="h-4 w-4" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold text-foreground">Smart Bharat</span>
        <span className="text-[11px] text-muted-foreground">AI Civic Copilot</span>
      </span>
    </Link>
  );
}

function DesktopSidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-background px-4 py-6 md:flex">
      <div className="px-2">
        <BrandMark />
      </div>
      <nav className="mt-8 flex flex-col gap-1">
        {nav.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-surface hover:text-foreground",
              )}
            >
              <Icon className="h-4.5 w-4.5" size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl border border-border bg-surface p-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success" />
          <span className="text-xs font-semibold text-foreground">Active Connection</span>
        </div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
          Connected to the national welfare network and local municipal divisions.
        </p>
      </div>
    </aside>
  );
}

function MobileTopBar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:hidden">
      <BrandMark />
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        Live Connection
      </span>
    </header>
  );
}

function MobileBottomNav({ pathname }: { pathname: string }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="grid grid-cols-5">
        {nav.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 pt-2 pb-1.5 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function ShellInner({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { open } = useCopilot();

  return (
    <div className="min-h-dvh bg-background">
      <div className="flex">
        <DesktopSidebar pathname={pathname} />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileTopBar />
          <main className="min-w-0 flex-1 pb-24 md:pb-16">{children}</main>
        </div>
      </div>
      <MobileBottomNav pathname={pathname} />
      {!open && <CopilotFAB />}
      <CopilotDrawer />
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <CopilotProvider>
      <ShellInner>{children}</ShellInner>
    </CopilotProvider>
  );
}
