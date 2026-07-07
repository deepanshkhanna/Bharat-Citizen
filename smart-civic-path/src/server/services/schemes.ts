import { eq, count } from "drizzle-orm";
import { getDb } from "../db/index";
import { schemes as schemesTable } from "../db/schema";
import type { Scheme, EligibilityItem, MatchLevel } from "../../data/schemes";

/**
 * Dynamically computes the match level of a scheme for a specific profile category.
 */
export function computeMatchLevel(schemeCategory: string, schemeId: string, profileCategory?: string | null): MatchLevel {
  if (!profileCategory) return "medium"; // default fallback

  const pCat = profileCategory.trim();
  const sCat = schemeCategory.trim();

  // Universal schemes that are eligible for every citizen (high match for all)
  const generalSchemes = ["ayushman-bharat", "pm-suraksha-bima", "pm-jeevan-jyoti", "digital-india", "digilocker", "pm-garib-kalyan"];
  if (generalSchemes.includes(schemeId)) {
    return "high";
  }

  // Profile category to Scheme category mapping rules
  const mapping: Record<string, string[]> = {
    Student: ["Students", "Education"],
    Farmer: ["Farmers"],
    "Senior Citizen": ["Senior Citizens", "Health"],
    "Job Seeker": ["Education", "Business"],
    "Woman Entrepreneur": ["Women", "Business"],
    "Small Business Owner": ["Business"],
  };

  const matchedCategories = mapping[pCat] || [];
  if (matchedCategories.includes(sCat)) {
    return "high";
  }

  return "low"; // Low match if no demographic overlap
}

/**
 * Convert a DB row to the frontend Scheme type.
 * This ensures API responses match the existing frontend type exactly.
 */
function rowToScheme(row: typeof schemesTable.$inferSelect, profileCategory?: string | null): Scheme {
  const defaultEligibility = JSON.parse(row.eligibilityJson) as EligibilityItem[];
  const category = row.category as Scheme["category"];
  const id = row.id;

  // Dynamically calculate match level
  const match = computeMatchLevel(category, id, profileCategory);

  // Dynamically calculate eligibility rules met status based on demographic class match
  const eligibility = defaultEligibility.map((item) => {
    const labelLower = item.label.toLowerCase();
    const isStudentPrereq = labelLower.includes("student");
    const isFarmerPrereq = labelLower.includes("farmer") || labelLower.includes("landholding");
    const isWomanPrereq = labelLower.includes("girl") || labelLower.includes("woman") || labelLower.includes("entrepreneur");
    const isSeniorPrereq = labelLower.includes("60") || labelLower.includes("retirement");

    let met = item.met;

    if (profileCategory) {
      if (isStudentPrereq && profileCategory !== "Student") met = false;
      if (isStudentPrereq && profileCategory === "Student") met = true;
      if (isFarmerPrereq && profileCategory !== "Farmer") met = false;
      if (isFarmerPrereq && profileCategory === "Farmer") met = true;
      if (isWomanPrereq && profileCategory !== "Woman Entrepreneur") met = false;
      if (isWomanPrereq && profileCategory === "Woman Entrepreneur") met = true;
      if (isSeniorPrereq && profileCategory !== "Senior Citizen") met = false;
      if (isSeniorPrereq && profileCategory === "Senior Citizen") met = true;
    }

    return { ...item, met };
  });

  return {
    id: row.id,
    name: row.name,
    shortName: row.shortName ?? undefined,
    category: category,
    tagline: row.tagline,
    overview: row.overview,
    match,
    eligibility,
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
  profileCategory?: string | null;
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

  const schemes = rows.map((row) => rowToScheme(row, opts?.profileCategory));
  return { schemes, total: schemes.length };
}

/**
 * Get a single scheme by ID.
 */
export async function getSchemeById(id: string, profileCategory?: string | null): Promise<Scheme | null> {
  const db = getDb();
  const rows = await db
    .select()
    .from(schemesTable)
    .where(eq(schemesTable.id, id));

  const row = rows[0];
  return row ? rowToScheme(row, profileCategory) : null;
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

  // Default popular schemes (featuring our general, eligible-for-all schemes)
  return ["pm-suraksha-bima", "pm-jeevan-jyoti", "digilocker"];
}
