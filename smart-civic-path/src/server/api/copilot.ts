import { createServerFn } from "@tanstack/react-start";
import { v4 as uuid } from "uuid";
import { getDb } from "../db/index";
import { conversations, messages } from "../db/schema";
import { profiles } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { streamChat, type ChatMessage } from "../services/ai";
import { buildSystemPrompt } from "../services/prompts";
import { getSchemeById } from "../services/schemes";

/**
 * Server function: Copilot chat (non-streaming for simplicity with server functions).
 *
 * TanStack Start server functions don't natively support SSE streaming,
 * so we collect the full response and return it. For a future optimization,
 * this could be moved to a raw Nitro API route with SSE.
 */
export const copilotChat = createServerFn({ method: "POST" })
  .validator(
    (input: {
      message: string;
      conversationId?: string | null;
      context?: {
        page?: "scheme" | "complaint" | null;
        schemeId?: string | null;
        complaintId?: string | null;
      };
      sessionId?: string;
    }) => {
      if (!input.message || input.message.trim().length === 0) {
        throw new Error("Message is required");
      }
      if (input.message.length > 2000) {
        throw new Error("Message too long (max 2000 characters)");
      }
      return input;
    }
  )
  .handler(async ({ data }) => {
    const db = getDb();
    const now = Math.floor(Date.now() / 1000);

    // Resolve or create conversation
    let conversationId = data.conversationId;
    if (!conversationId) {
      conversationId = uuid();
      await db.insert(conversations)
        .values({
          id: conversationId,
          sessionId: data.sessionId ?? "__anonymous__",
          contextType: data.context?.page ?? null,
          contextId: data.context?.schemeId ?? data.context?.complaintId ?? null,
          createdAt: now,
        });
    }

    // Load conversation history (last 10 messages)
    const historyRows = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt))
      .limit(10);

    const history = historyRows.reverse();

    // Build context
    let schemeContext = undefined;
    if (data.context?.page === "scheme" && data.context.schemeId) {
      schemeContext = (await getSchemeById(data.context.schemeId)) ?? undefined;
    }

    // Load profile if session available
    let profileData = undefined;
    if (data.sessionId) {
      const profileRows = await db
        .select()
        .from(profiles)
        .where(eq(profiles.sessionId, data.sessionId));
      
      const profile = profileRows[0];
      if (profile) {
        profileData = {
          state: profile.state,
          ageGroup: profile.ageGroup,
          occupation: profile.occupation,
          category: profile.category,
        };
      }
    }

    // Build messages for OpenAI
    const systemPrompt = buildSystemPrompt({
      schemeContext,
      profile: profileData,
    });

    const chatMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history
    for (const msg of history) {
      chatMessages.push({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      });
    }

    // Add current user message
    chatMessages.push({ role: "user", content: data.message });

    // Save user message
    const userMsgId = uuid();
    await db.insert(messages)
      .values({
        id: userMsgId,
        conversationId,
        role: "user",
        content: data.message,
        createdAt: now,
      });

    // Call OpenAI and collect response
    let fullResponse = "";
    try {
      for await (const token of streamChat(chatMessages)) {
        fullResponse += token;
      }
    } catch (error) {
      console.error("[copilot] AI error:", error);
      fullResponse =
        "I'm sorry, I couldn't process that right now. Please try again in a moment. In the meantime, you can check the official government portal for information.";
    }

    // Save assistant message
    const assistantMsgId = uuid();
    await db.insert(messages)
      .values({
        id: assistantMsgId,
        conversationId,
        role: "assistant",
        content: fullResponse,
        createdAt: Math.floor(Date.now() / 1000),
      });

    return {
      conversationId,
      messageId: assistantMsgId,
      content: fullResponse,
    };
  });
