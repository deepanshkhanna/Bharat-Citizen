import { eq, count } from "drizzle-orm";
import { schemes as schemesTable, complaints, complaintTimeline } from "./schema";
import type { AppDb } from "./index";

// Import the static scheme data from the frontend
import { schemes as staticSchemes } from "../../data/schemes";

export async function seedSchemes(db: AppDb) {
  // Check if schemes already exist
  const existing = await db.select({ value: count() }).from(schemesTable);
  if (existing && existing[0]?.value > 0) return;

  const now = Math.floor(Date.now() / 1000);

  for (const scheme of staticSchemes) {
    await db.insert(schemesTable)
      .values({
        id: scheme.id,
        name: scheme.name,
        shortName: scheme.shortName ?? null,
        category: scheme.category,
        tagline: scheme.tagline,
        overview: scheme.overview,
        matchDefault: scheme.match,
        eligibilityJson: JSON.stringify(scheme.eligibility),
        documentsJson: JSON.stringify(scheme.documents),
        resourcesJson: JSON.stringify(scheme.resources),
        ministry: scheme.ministry,
        createdAt: now,
      });
  }

  console.log(`[seed] Inserted ${staticSchemes.length} schemes`);
}

export async function seedDemoData(db: AppDb) {
  // Seed the demo complaint referenced in recentActivity (BR-2026-104)
  const demoComplaintId = "BR-2026-104";
  const existing = await db
    .select()
    .from(complaints)
    .where(eq(complaints.id, demoComplaintId));

  if (existing.length > 0) return;

  const now = Math.floor(Date.now() / 1000);
  const oneHourAgo = now - 3600;
  const twoHoursAgo = now - 7200;

  // Insert demo complaint
  await db.insert(complaints)
    .values({
      id: demoComplaintId,
      sessionId: "__demo__",
      issueType: "Road",
      location: "Sector 15, Gurugram, Haryana",
      description:
        "Large pothole near the main market entrance causing traffic issues and accidents for two-wheelers.",
      photoUrl: null,
      aiDetectedIssue: "Road surface damage — pothole",
      aiConfidence: "High",
      aiDepartment: "Municipal Corporation — Roads Division",
      status: "under_review",
      createdAt: twoHoursAgo,
      updatedAt: oneHourAgo,
    });

  // Insert timeline entries
  await db.insert(complaintTimeline)
    .values({
      complaintId: demoComplaintId,
      status: "Submitted",
      note: "Complaint registered successfully",
      createdAt: twoHoursAgo,
    });

  await db.insert(complaintTimeline)
    .values({
      complaintId: demoComplaintId,
      status: "Under Review",
      note: "Complaint forwarded to Roads Division for assessment",
      createdAt: oneHourAgo,
    });

  console.log(`[seed] Inserted demo complaint ${demoComplaintId}`);
}
