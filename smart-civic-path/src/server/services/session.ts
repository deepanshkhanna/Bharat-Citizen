import { v4 as uuid } from "uuid";

const COOKIE_NAME = "sb_session";
const MAX_AGE = 86400; // 24 hours

/**
 * Extract session ID from request cookie header.
 * Returns the session ID or null if not present.
 */
export function getSessionId(request: Request): string | null {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

/**
 * Get existing session or create a new one.
 * Returns { sessionId, isNew, setCookieHeader? }
 */
export function resolveSession(request: Request): {
  sessionId: string;
  isNew: boolean;
  setCookieHeader?: string;
} {
  const existing = getSessionId(request);
  if (existing) {
    return { sessionId: existing, isNew: false };
  }

  const sessionId = uuid();
  const setCookieHeader = `${COOKIE_NAME}=${sessionId}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${MAX_AGE}`;
  return { sessionId, isNew: true, setCookieHeader };
}

/**
 * Build a Set-Cookie header string for a given session ID.
 */
export function buildSessionCookie(sessionId: string): string {
  return `${COOKIE_NAME}=${sessionId}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${MAX_AGE}`;
}
