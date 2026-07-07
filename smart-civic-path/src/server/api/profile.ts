import { createServerFn } from "@tanstack/react-start";
import { v4 as uuid } from "uuid";
import { eq } from "drizzle-orm";
import { getDb } from "../db/index";
import { profiles } from "../db/schema";

const VALID_LANGUAGES = ["en", "hi", "ta", "te", "bn"] as const;
const VALID_CATEGORIES = [
  "Student",
  "Farmer",
  "Senior Citizen",
  "Job Seeker",
  "Woman Entrepreneur",
  "Small Business Owner",
] as const;

/**
 * Server function: Get profile by session ID.
 */
export const getProfile = createServerFn({ method: "GET" })
  .validator((input: { sessionId: string }) => {
    if (!input.sessionId) throw new Error("Session ID is required");
    return input;
  })
  .handler(async ({ data }) => {
    const db = getDb();
    const rows = await db
      .select()
      .from(profiles)
      .where(eq(profiles.sessionId, data.sessionId));

    const profile = rows[0];

    if (!profile) {
      return { profile: null };
    }

    return {
      profile: {
        id: profile.id,
        state: profile.state,
        ageGroup: profile.ageGroup,
        occupation: profile.occupation,
        category: profile.category,
        language: profile.language,
        largeText: Boolean(profile.largeText),
        highContrast: Boolean(profile.highContrast),
        onboardingDone: Boolean(profile.onboardingDone),
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    };
  });

/**
 * Server function: Create or update profile.
 */
export const upsertProfile = createServerFn({ method: "POST" })
  .validator(
    (input: {
      sessionId: string;
      state?: string;
      ageGroup?: string;
      occupation?: string;
      category?: string;
      language?: string;
      largeText?: boolean;
      highContrast?: boolean;
    }) => {
      if (!input.sessionId) throw new Error("Session ID is required");
      if (input.language && !VALID_LANGUAGES.includes(input.language as any)) {
        throw new Error(`Invalid language. Must be one of: ${VALID_LANGUAGES.join(", ")}`);
      }
      if (input.category && !VALID_CATEGORIES.includes(input.category as any)) {
        throw new Error(`Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`);
      }
      return input;
    }
  )
  .handler(async ({ data }) => {
    const db = getDb();
    const now = Math.floor(Date.now() / 1000);

    // Check if profile exists
    const rows = await db
      .select()
      .from(profiles)
      .where(eq(profiles.sessionId, data.sessionId));

    const existing = rows[0];

    if (existing) {
      // Update
      await db.update(profiles)
        .set({
          state: data.state ?? existing.state,
          ageGroup: data.ageGroup ?? existing.ageGroup,
          occupation: data.occupation ?? existing.occupation,
          category: data.category ?? existing.category,
          language: data.language ?? existing.language,
          largeText: data.largeText !== undefined ? (data.largeText ? 1 : 0) : existing.largeText,
          highContrast:
            data.highContrast !== undefined ? (data.highContrast ? 1 : 0) : existing.highContrast,
          onboardingDone: 1,
          updatedAt: now,
        })
        .where(eq(profiles.id, existing.id));

      return { success: true, id: existing.id };
    } else {
      // Create
      const id = uuid();
      await db.insert(profiles)
        .values({
          id,
          sessionId: data.sessionId,
          state: data.state ?? null,
          ageGroup: data.ageGroup ?? null,
          occupation: data.occupation ?? null,
          category: data.category ?? null,
          language: data.language ?? "en",
          largeText: data.largeText ? 1 : 0,
          highContrast: data.highContrast ? 1 : 0,
          onboardingDone: 1,
          createdAt: now,
          updatedAt: now,
        });

      return { success: true, id };
    }
  });
