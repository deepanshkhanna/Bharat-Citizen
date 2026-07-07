import { createServerFn } from "@tanstack/react-start";
import { v4 as uuid } from "uuid";
import { eq, desc } from "drizzle-orm";
import { getDb } from "../db/index";
import { complaints, complaintTimeline } from "../db/schema";
import { categorizeComplaint } from "../services/ai";

// Valid issue types matching UI.md
const VALID_ISSUE_TYPES = ["Road", "Water", "Electricity", "Sanitation", "Public Safety"] as const;

async function generateComplaintId(): Promise<string> {
  const year = new Date().getFullYear();
  const db = getDb();
  // Count existing complaints to generate sequential ID
  const existing = await db.select().from(complaints);
  const num = existing.length + 1;
  return `BR-${year}-${String(num).padStart(3, "0")}`;
}

/**
 * Server function: Submit a new complaint.
 */
export const submitComplaint = createServerFn({ method: "POST" })
  .validator(
    (input: {
      issueType: string;
      location: string;
      description: string;
      photo?: string | null;
      sessionId?: string;
    }) => {
      if (!input.issueType || !VALID_ISSUE_TYPES.includes(input.issueType as any)) {
        throw new Error(`Invalid issue type. Must be one of: ${VALID_ISSUE_TYPES.join(", ")}`);
      }
      if (!input.location || input.location.trim().length === 0) {
        throw new Error("Location is required");
      }
      if (!input.description || input.description.trim().length === 0) {
        throw new Error("Description is required");
      }
      if (input.description.length > 2000) {
        throw new Error("Description too long (max 2000 characters)");
      }
      return input;
    }
  )
  .handler(async ({ data }) => {
    const db = getDb();
    const now = Math.floor(Date.now() / 1000);
    const complaintId = await generateComplaintId();

    // AI categorization
    let aiAnalysis: { detected_issue: string; confidence: string; department: string };
    try {
      aiAnalysis = await categorizeComplaint({
        issueType: data.issueType,
        location: data.location,
        description: data.description,
      });
    } catch {
      aiAnalysis = {
        detected_issue: data.description.slice(0, 100),
        confidence: "N/A",
        department: "General Municipal Services",
      };
    }

    // Insert complaint
    await db.insert(complaints)
      .values({
        id: complaintId,
        sessionId: data.sessionId ?? "__anonymous__",
        issueType: data.issueType,
        location: data.location,
        description: data.description,
        photoUrl: data.photo ?? null,
        aiDetectedIssue: aiAnalysis.detected_issue,
        aiConfidence: aiAnalysis.confidence,
        aiDepartment: aiAnalysis.department,
        status: "submitted",
        createdAt: now,
        updatedAt: now,
      });

    // Insert initial timeline entry
    await db.insert(complaintTimeline)
      .values({
        complaintId,
        status: "Submitted",
        note: "Complaint registered successfully",
        createdAt: now,
      });

    // Return complaint with timeline
    const timeline = await db
      .select()
      .from(complaintTimeline)
      .where(eq(complaintTimeline.complaintId, complaintId));

    return {
      id: complaintId,
      status: "submitted",
      ai_analysis: {
        detected_issue: aiAnalysis.detected_issue,
        confidence: aiAnalysis.confidence,
        department: aiAnalysis.department,
      },
      timeline: timeline.map((t: any) => ({
        status: t.status,
        note: t.note,
        created_at: t.createdAt,
      })),
    };
  });

/**
 * Server function: Get complaint by ID with timeline.
 */
export const getComplaint = createServerFn({ method: "GET" })
  .validator((input: { id: string }) => {
    if (!input.id || input.id.trim().length === 0) {
      throw new Error("Complaint ID is required");
    }
    return input;
  })
  .handler(async ({ data }) => {
    const db = getDb();

    const rows = await db
      .select()
      .from(complaints)
      .where(eq(complaints.id, data.id));

    const complaint = rows[0];

    if (!complaint) {
      throw new Error(`Complaint not found: ${data.id}`);
    }

    const timeline = await db
      .select()
      .from(complaintTimeline)
      .where(eq(complaintTimeline.complaintId, data.id))
      .orderBy(complaintTimeline.createdAt);

    return {
      id: complaint.id,
      issue_type: complaint.issueType,
      location: complaint.location,
      description: complaint.description,
      photo_url: complaint.photoUrl,
      status: complaint.status,
      ai_analysis: {
        detected_issue: complaint.aiDetectedIssue,
        confidence: complaint.aiConfidence,
        department: complaint.aiDepartment,
      },
      timeline: timeline.map((t: any) => ({
        status: t.status,
        note: t.note,
        created_at: t.createdAt,
      })),
      created_at: complaint.createdAt,
    };
  });

/**
 * Server function: List complaints for a session.
 */
export const listComplaints = createServerFn({ method: "GET" })
  .validator((input: { sessionId?: string }) => input)
  .handler(async ({ data }) => {
    const db = getDb();
    const sessionId = data.sessionId ?? "__anonymous__";

    const rows = await db
      .select()
      .from(complaints)
      .where(eq(complaints.sessionId, sessionId))
      .orderBy(desc(complaints.createdAt));

    // Also include demo complaints
    const demoRows = await db
      .select()
      .from(complaints)
      .where(eq(complaints.sessionId, "__demo__"));

    const allComplaints = [...rows, ...demoRows.filter((d) => !rows.some((r) => r.id === d.id))];

    return {
      complaints: allComplaints.map((c) => ({
        id: c.id,
        issue_type: c.issueType,
        location: c.location,
        status: c.status,
        created_at: c.createdAt,
      })),
    };
  });
