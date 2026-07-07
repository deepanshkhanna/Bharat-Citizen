import { pgTable, text, integer, serial } from "drizzle-orm/pg-core";

// ── Schemes ──────────────────────────────────────────────
export const schemes = pgTable("schemes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name"),
  category: text("category").notNull(),
  tagline: text("tagline").notNull(),
  overview: text("overview").notNull(),
  matchDefault: text("match_default").notNull().default("medium"),
  eligibilityJson: text("eligibility_json").notNull(), // JSON array
  documentsJson: text("documents_json").notNull(), // JSON array
  resourcesJson: text("resources_json").notNull(), // JSON object
  ministry: text("ministry").notNull(),
  createdAt: integer("created_at").notNull(),
});

// ── Profiles ─────────────────────────────────────────────
export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  state: text("state"),
  ageGroup: text("age_group"),
  occupation: text("occupation"),
  category: text("category"),
  language: text("language").notNull().default("en"),
  largeText: integer("large_text").notNull().default(0),
  highContrast: integer("high_contrast").notNull().default(0),
  onboardingDone: integer("onboarding_done").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

// ── Complaints ───────────────────────────────────────────
export const complaints = pgTable("complaints", {
  id: text("id").primaryKey(), // BR-YYYY-NNN
  sessionId: text("session_id").notNull(),
  issueType: text("issue_type").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  photoUrl: text("photo_url"),
  aiDetectedIssue: text("ai_detected_issue"),
  aiConfidence: text("ai_confidence"),
  aiDepartment: text("ai_department"),
  status: text("status").notNull().default("submitted"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

// ── Complaint Timeline ───────────────────────────────────
export const complaintTimeline = pgTable("complaint_timeline", {
  id: serial("id").primaryKey(),
  complaintId: text("complaint_id").notNull(),
  status: text("status").notNull(),
  note: text("note"),
  createdAt: integer("created_at").notNull(),
});

// ── Conversations ────────────────────────────────────────
export const conversations = pgTable("conversations", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  contextType: text("context_type"), // 'scheme' | 'complaint' | null
  contextId: text("context_id"),
  createdAt: integer("created_at").notNull(),
});

// ── Messages ─────────────────────────────────────────────
export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").notNull(),
  role: text("role").notNull(), // 'user' | 'assistant'
  content: text("content").notNull(),
  createdAt: integer("created_at").notNull(),
});

// ── Activity ─────────────────────────────────────────────
export const activity = pgTable("activity", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  type: text("type").notNull(), // scheme_view, complaint_filed, eligibility_check, copilot_query
  title: text("title").notNull(),
  meta: text("meta").notNull(),
  referenceId: text("reference_id"),
  createdAt: integer("created_at").notNull(),
});
