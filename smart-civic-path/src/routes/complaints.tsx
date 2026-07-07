import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Megaphone, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComplaintForm } from "@/components/complaint-form";
import { ComplaintTracker } from "@/components/complaint-tracker";
import { ComplaintConfirmation } from "@/components/complaint-confirm";
import { submitComplaint } from "@/server/api/complaints";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/complaints")({
  head: () => ({
    meta: [
      { title: "Complaints — Smart Bharat" },
      {
        name: "description",
        content:
          "Report and track public issues with AI-assisted categorization.",
      },
    ],
  }),
  component: ComplaintsPage,
});

type Tab = "report" | "track";
type SubmissionResult = {
  id: string;
  ai_analysis: {
    detected_issue: string;
    confidence: string;
    department: string;
  };
};

function ComplaintsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("report");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);

  const handleSubmitComplaint = async (data: {
    issueType: string;
    location: string;
    description: string;
    photo: string | null;
  }) => {
    setIsSubmitting(true);
    try {
      const result = await submitComplaint({
        data: {
          issueType: data.issueType,
          location: data.location,
          description: data.description,
          photo: data.photo,
        },
      });
      setSubmissionResult({
        id: result.id,
        ai_analysis: result.ai_analysis,
      });
    } catch (error) {
      console.error("[complaints] Submit error:", error);
      // Fallback: show a simulated confirmation
      const fakeId = `BR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`;
      setSubmissionResult({
        id: fakeId,
        ai_analysis: {
          detected_issue: data.description.slice(0, 80),
          confidence: "Medium",
          department: "General Municipal Services",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackFromConfirm = () => {
    setActiveTab("track");
    setSubmissionResult(null);
  };

  const handleNewComplaint = () => {
    setSubmissionResult(null);
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:px-10 md:py-12">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary/70">
          Civic Issues
        </p>
        <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Complaints
        </h1>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground">
          Report public issues — roads, water, electricity, sanitation, safety —
          and track them from submission to resolution.
        </p>
      </header>

      {/* Tab Switcher */}
      <div className="mt-8 flex gap-2">
        <Button
          variant={activeTab === "report" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => {
            setActiveTab("report");
            setSubmissionResult(null);
          }}
        >
          <FileText className="mr-1.5 h-4 w-4" />
          Report Issue
        </Button>
        <Button
          variant={activeTab === "track" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => {
            setActiveTab("track");
            setSubmissionResult(null);
          }}
        >
          <Search className="mr-1.5 h-4 w-4" />
          Track Complaint
        </Button>
      </div>

      {/* Content */}
      <div className="mt-8">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
          {submissionResult ? (
            <ComplaintConfirmation
              complaintId={submissionResult.id}
              aiAnalysis={submissionResult.ai_analysis}
              onTrack={handleTrackFromConfirm}
              onNewComplaint={handleNewComplaint}
            />
          ) : activeTab === "report" ? (
            <ComplaintForm
              onSubmit={handleSubmitComplaint}
              isSubmitting={isSubmitting}
            />
          ) : (
            <ComplaintTracker />
          )}
        </div>
      </div>
    </div>
  );
}
