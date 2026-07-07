import { createServerFn } from "@tanstack/react-start";
import { listSchemes, getSchemeById, getRecommendedSchemeIds } from "../services/schemes";

/**
 * Server function: List schemes with optional filtering.
 */
export const fetchSchemes = createServerFn({ method: "GET" })
  .validator((input: { category?: string; q?: string; profileCategory?: string }) => input)
  .handler(async ({ data }) => {
    return await listSchemes({
      category: data.category,
      q: data.q,
      profileCategory: data.profileCategory,
    });
  });

/**
 * Server function: Get a single scheme by ID.
 */
export const fetchSchemeById = createServerFn({ method: "GET" })
  .validator((input: { id: string; profileCategory?: string }) => {
    if (!input.id) throw new Error("Scheme ID is required");
    return input;
  })
  .handler(async ({ data }) => {
    const scheme = await getSchemeById(data.id, data.profileCategory);
    if (!scheme) {
      throw new Error(`Scheme not found: ${data.id}`);
    }
    return { scheme };
  });

/**
 * Server function: Get recommended scheme IDs.
 */
export const fetchRecommendedSchemes = createServerFn({ method: "GET" })
  .validator((input: { profileCategory?: string }) => input)
  .handler(async ({ data }) => {
    const ids = await getRecommendedSchemeIds(data.profileCategory);
    return { schemeIds: ids };
  });
