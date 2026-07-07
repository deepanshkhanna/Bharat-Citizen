import { CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrustBadge } from "@/components/trust-badge";
import { useState } from "react";

type AiAnalysis = {
  detected_issue: string;
  confidence: string;
  department: string;
};

type ComplaintConfirmProps = {
  complaintId: string;
  aiAnalysis: AiAnalysis;
  onTrack: () => void;
  onNewComplaint: () => void;
};

export function ComplaintConfirmation({
  complaintId,
  aiAnalysis,
  onTrack,
  onNewComplaint,
}: ComplaintConfirmProps) {
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(complaintId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Success Card */}
      <div className="rounded-3xl border border-success/30 bg-gradient-to-br from-success/8 to-transparent p-8 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h2 className="mt-5 text-2xl font-bold text-foreground">
          Complaint Submitted
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your civic complaint has been registered successfully.
        </p>

        {/* Complaint ID */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 shadow-sm">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Complaint ID
          </span>
          <span className="text-lg font-bold text-foreground">
            {complaintId}
          </span>
          <button
            onClick={copyId}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            aria-label="Copy complaint ID"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
        {copied && (
          <p className="mt-2 text-xs text-success">Copied to clipboard!</p>
        )}
      </div>

      {/* AI Analysis Card */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-center gap-2">
          <TrustBadge variant="ai" />
          <span className="text-xs font-medium uppercase tracking-wider text-primary/70">
            AI Analysis
          </span>
        </div>
        <div className="mt-3 space-y-2.5">
          <div className="flex items-start justify-between gap-2 text-sm">
            <span className="text-muted-foreground">Detected Issue</span>
            <span className="text-right font-medium text-foreground">
              {aiAnalysis.detected_issue}
            </span>
          </div>
          <div className="flex items-start justify-between gap-2 text-sm">
            <span className="text-muted-foreground">Confidence</span>
            <span className="font-medium text-foreground">
              {aiAnalysis.confidence}
            </span>
          </div>
          <div className="flex items-start justify-between gap-2 text-sm">
            <span className="text-muted-foreground">Responsible Department</span>
            <span className="text-right font-medium text-foreground">
              {aiAnalysis.department}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={onTrack} className="flex-1 rounded-full">
          Track This Complaint
        </Button>
        <Button
          onClick={onNewComplaint}
          variant="outline"
          className="flex-1 rounded-full"
        >
          Report Another Issue
        </Button>
      </div>
    </div>
  );
}
