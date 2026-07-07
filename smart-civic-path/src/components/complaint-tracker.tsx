import { useState } from "react";
import {
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrustBadge } from "@/components/trust-badge";
import { cn } from "@/lib/utils";
import { getComplaint } from "@/server/api/complaints";

type TimelineEntry = {
  status: string;
  note: string | null;
  created_at: number;
};

type ComplaintData = {
  id: string;
  issue_type: string;
  location: string;
  description: string;
  status: string;
  ai_analysis: {
    detected_issue: string | null;
    confidence: string | null;
    department: string | null;
  };
  timeline: TimelineEntry[];
  created_at: number;
};

const STATUS_CONFIG: Record<
  string,
  { icon: typeof CheckCircle2; color: string; label: string }
> = {
  Submitted: {
    icon: Clock,
    color: "text-primary",
    label: "Submitted",
  },
  "Under Review": {
    icon: AlertCircle,
    color: "text-saffron",
    label: "Under Review",
  },
  Assigned: {
    icon: ArrowRight,
    color: "text-info",
    label: "Assigned",
  },
  Resolved: {
    icon: CheckCircle2,
    color: "text-success",
    label: "Resolved",
  },
};

export function ComplaintTracker() {
  const [trackingId, setTrackingId] = useState("");
  const [complaint, setComplaint] = useState<ComplaintData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = trackingId.trim();
    if (!id) return;

    setIsLoading(true);
    setError(null);
    setComplaint(null);

    try {
      const result = await getComplaint({ data: { id } });
      setComplaint(result as ComplaintData);
    } catch (err) {
      setError("Complaint not found. Please check the ID and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <form onSubmit={handleTrack} className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter complaint ID (e.g. BR-2026-104)"
            className="h-14 rounded-full pl-11 pr-4 text-base"
          />
        </div>
        <Button
          type="submit"
          disabled={!trackingId.trim() || isLoading}
          className="w-full rounded-full py-5"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Looking up…
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Track Complaint
            </>
          )}
        </Button>
      </form>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Complaint Details */}
      {complaint && (
        <div className="space-y-5">
          {/* Header */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-primary/70">
                  Complaint
                </p>
                <h3 className="mt-1 text-xl font-bold text-foreground">
                  {complaint.id}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {complaint.issue_type} · {complaint.location}
                </p>
              </div>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                  complaint.status === "submitted" && "bg-primary/10 text-primary",
                  complaint.status === "under_review" && "bg-saffron/10 text-saffron",
                  complaint.status === "assigned" && "bg-info/10 text-info",
                  complaint.status === "resolved" && "bg-success/10 text-success",
                )}
              >
                {complaint.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </span>
            </div>
          </div>

          {/* AI Analysis Card */}
          {complaint.ai_analysis.detected_issue && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <div className="flex items-center gap-2">
                <TrustBadge variant="ai" />
                <span className="text-xs font-medium uppercase tracking-wider text-primary/70">
                  AI Analysis
                </span>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Detected Issue</span>
                  <span className="font-medium text-foreground">
                    {complaint.ai_analysis.detected_issue}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-medium text-foreground">
                    {complaint.ai_analysis.confidence}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Responsible Department
                  </span>
                  <span className="font-medium text-foreground">
                    {complaint.ai_analysis.department}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-primary/70">
              Timeline
            </h4>
            <div className="mt-4 space-y-0">
              {complaint.timeline.map((entry, i) => {
                const config = STATUS_CONFIG[entry.status] ?? STATUS_CONFIG.Submitted;
                const Icon = config.icon;
                const isLast = i === complaint.timeline.length - 1;

                return (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "grid h-8 w-8 shrink-0 place-items-center rounded-full",
                          isLast ? "bg-primary/10" : "bg-surface",
                        )}
                      >
                        <Icon
                          className={cn("h-4 w-4", config.color)}
                          size={16}
                        />
                      </span>
                      {!isLast && (
                        <div className="h-8 w-px bg-border" />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="text-sm font-medium text-foreground">
                        {entry.status}
                      </p>
                      {entry.note && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {entry.note}
                        </p>
                      )}
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {new Date(entry.created_at * 1000).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
