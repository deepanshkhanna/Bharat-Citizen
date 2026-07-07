import { eq, count } from "drizzle-orm";
import { getDb } from "../db/index";
import { schemes as schemesTable } from "../db/schema";
import type { Scheme, EligibilityItem, MatchLevel } from "../../data/schemes";

/**
 * Convert a DB row to the frontend Scheme type.
 * This ensures API responses match the existing frontend type exactly.
 */
function rowToScheme(row: typeof schemesTable.$inferSelect): Scheme {
  return {
    id: row.id,
    name: row.name,
    shortName: row.shortName ?? undefined,
    category: row.category as Scheme["category"],
    tagline: row.tagline,
    overview: row.overview,
    match: row.matchDefault as MatchLevel,
    eligibility: JSON.parse(row.eligibilityJson) as EligibilityItem[],
    documents: JSON.parse(row.documentsJson) as string[],
    resources: JSON.parse(row.resourcesJson) as Scheme["resources"],
    ministry: row.ministry,
  };
}

/**
 * Get all schemes, optionally filtered by category and/or search query.
 */
export async function listSchemes(opts?: {
  category?: string;
  q?: string;
}): Promise<{ schemes: Scheme[]; total: number }> {
  const db = getDb();
  let rows = await db.select().from(schemesTable);

  // Filter by category
  if (opts?.category) {
    rows = rows.filter((r) => r.category === opts.category);
  }

  // Filter by search query (case-insensitive text match)
  if (opts?.q) {
    const q = opts.q.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.tagline.toLowerCase().includes(q) ||
        r.overview.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }

  const schemes = rows.map(rowToScheme);
  return { schemes, total: schemes.length };
}

/**
 * Get a single scheme by ID.
 */
export async function getSchemeById(id: string): Promise<Scheme | null> {
  const db = getDb();
  const rows = await db
    .select()
    .from(schemesTable)
    .where(eq(schemesTable.id, id));

  const row = rows[0];
  return row ? rowToScheme(row) : null;
}

/**
 * Get recommended scheme IDs based on profile category.
 * Falls back to popular schemes if no profile match.
 */
export async function getRecommendedSchemeIds(profileCategory?: string | null): Promise<string[]> {
  const db = getDb();
  const rows = await db.select().from(schemesTable);

  if (profileCategory) {
    // Map profile categories to scheme categories
    const categoryMap: Record<string, string[]> = {
      Student: ["Students", "Education"],
      Farmer: ["Farmers"],
      "Senior Citizen": ["Senior Citizens", "Health"],
      "Job Seeker": ["Education", "Business"],
      "Woman Entrepreneur": ["Women", "Business"],
      "Small Business Owner": ["Business"],
    };

    const targetCategories = categoryMap[profileCategory] ?? [];
    if (targetCategories.length > 0) {
      const matched = rows
        .filter((r) => targetCategories.includes(r.category))
        .sort((a, b) => {
          const matchOrder = { high: 0, medium: 1, low: 2 };
          return (
            (matchOrder[a.matchDefault as MatchLevel] ?? 2) -
            (matchOrder[b.matchDefault as MatchLevel] ?? 2)
          );
        })
        .slice(0, 3);

      if (matched.length > 0) {
        return matched.map((r) => r.id);
      }
    }
  }

  // Default popular schemes
  return ["pm-scholarship", "ayushman-bharat", "pm-kisan"];
}
