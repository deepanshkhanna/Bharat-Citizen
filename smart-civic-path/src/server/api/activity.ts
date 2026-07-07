import { createServerFn } from "@tanstack/react-start";
import { eq, desc } from "drizzle-orm";
import { getDb } from "../db/index";
import { activity } from "../db/schema";

/**
 * Server function: Get recent activity for a session.
 */
export const getRecentActivity = createServerFn({ method: "GET" })
  .validator((input: { sessionId?: string; limit?: number }) => input)
  .handler(async ({ data }) => {
    const db = getDb();
    const sessionId = data.sessionId ?? "__anonymous__";
    const limit = data.limit ?? 5;

    const rows = await db
      .select()
      .from(activity)
      .where(eq(activity.sessionId, sessionId))
      .orderBy(desc(activity.createdAt))
      .limit(limit);

    if (rows.length === 0) {
      // Return mock data if no real activity yet
      return {
        activity: [
          {
            title: "PM Scholarship Scheme",
            meta: "Viewed recently",
            type: "scheme_view",
            created_at: Math.floor(Date.now() / 1000),
          },
          {
            title: "Complaint BR-2026-104",
            meta: "Under Review",
            type: "complaint_filed",
            created_at: Math.floor(Date.now() / 1000) - 3600,
          },
          {
            title: "Eligibility Check",
            meta: "High Match",
            type: "eligibility_check",
            created_at: Math.floor(Date.now() / 1000) - 7200,
          },
        ],
      };
    }

    return {
      activity: rows.map((r) => ({
        title: r.title,
        meta: r.meta,
        type: r.type,
        created_at: r.createdAt,
      })),
    };
  });

/**
 * Server function: Log an activity event.
 */
export const logActivity = createServerFn({ method: "POST" })
  .validator(
    (input: {
      sessionId: string;
      type: string;
      title: string;
      meta: string;
      referenceId?: string;
    }) => {
      if (!input.sessionId) throw new Error("Session ID is required");
      if (!input.type) throw new Error("Activity type is required");
      if (!input.title) throw new Error("Activity title is required");
      return input;
    }
  )
  .handler(async ({ data }) => {
    const db = getDb();
    const now = Math.floor(Date.now() / 1000);

    await db.insert(activity)
      .values({
        sessionId: data.sessionId,
        type: data.type,
        title: data.title,
        meta: data.meta ?? "",
        referenceId: data.referenceId ?? null,
        createdAt: now,
      });

    return { success: true };
  });
