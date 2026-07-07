import OpenAI from "openai";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

/**
 * Stream a chat completion from the configured LLM provider.
 * Automatically tries OpenRouter, then falls back to Groq, and finally OpenAI.
 */
export async function* streamChat(
  messages: ChatMessage[],
  opts?: { maxTokens?: number }
): AsyncGenerator<string, void, undefined> {
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  // 1. Try OpenRouter
  if (openrouterKey) {
    try {
      console.log("[ai] Trying OpenRouter stream...");
      const client = new OpenAI({
        apiKey: openrouterKey,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "Smart Bharat",
        },
      });
      const model = process.env.AI_MODEL || "openrouter/free";
      const stream = await client.chat.completions.create({
        model,
        messages,
        stream: true,
        max_tokens: opts?.maxTokens ?? 1024,
        temperature: 0.7,
      });
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) yield content;
      }
      return; // Succeeded
    } catch (err) {
      console.warn("[ai] OpenRouter stream failed, falling back to Groq...", err);
    }
  }

  // 2. Try Groq
  if (groqKey) {
    try {
      console.log("[ai] Trying Groq stream...");
      const client = new OpenAI({
        apiKey: groqKey,
        baseURL: "https://api.groq.com/openai/v1",
      });
      const model = "llama-3.3-70b-versatile";
      const stream = await client.chat.completions.create({
        model,
        messages,
        stream: true,
        max_tokens: opts?.maxTokens ?? 1024,
        temperature: 0.7,
      });
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) yield content;
      }
      return; // Succeeded
    } catch (err) {
      console.warn("[ai] Groq stream failed, falling back to OpenAI...", err);
    }
  }

  // 3. Try OpenAI
  if (openaiKey) {
    try {
      console.log("[ai] Trying OpenAI stream...");
      const client = new OpenAI({ apiKey: openaiKey });
      const model = "gpt-4o-mini";
      const stream = await client.chat.completions.create({
        model,
        messages,
        stream: true,
        max_tokens: opts?.maxTokens ?? 1024,
        temperature: 0.7,
      });
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) yield content;
      }
      return; // Succeeded
    } catch (err) {
      console.error("[ai] OpenAI stream failed:", err);
    }
  }

  throw new Error("All AI stream providers failed or no keys are configured.");
}

/**
 * Non-streaming chat completion (for single-shot tasks like complaint categorization).
 * Automatically tries OpenRouter, then falls back to Groq, and finally OpenAI.
 */
export async function chatCompletion(
  messages: ChatMessage[],
  opts?: { maxTokens?: number }
): Promise<string> {
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  // 1. Try OpenRouter
  if (openrouterKey) {
    try {
      console.log("[ai] Trying OpenRouter completion...");
      const client = new OpenAI({
        apiKey: openrouterKey,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "Smart Bharat",
        },
      });
      const model = process.env.AI_MODEL || "openrouter/free";
      const response = await client.chat.completions.create({
        model,
        messages,
        max_tokens: opts?.maxTokens ?? 512,
        temperature: 0.3,
      });
      return response.choices[0]?.message?.content ?? "";
    } catch (err) {
      console.warn("[ai] OpenRouter completion failed, falling back to Groq...", err);
    }
  }

  // 2. Try Groq
  if (groqKey) {
    try {
      console.log("[ai] Trying Groq completion...");
      const client = new OpenAI({
        apiKey: groqKey,
        baseURL: "https://api.groq.com/openai/v1",
      });
      const model = "llama-3.3-70b-versatile";
      const response = await client.chat.completions.create({
        model,
        messages,
        max_tokens: opts?.maxTokens ?? 512,
        temperature: 0.3,
      });
      return response.choices[0]?.message?.content ?? "";
    } catch (err) {
      console.warn("[ai] Groq completion failed, falling back to OpenAI...", err);
    }
  }

  // 3. Try OpenAI
  if (openaiKey) {
    try {
      console.log("[ai] Trying OpenAI completion...");
      const client = new OpenAI({ apiKey: openaiKey });
      const model = "gpt-4o-mini";
      const response = await client.chat.completions.create({
        model,
        messages,
        max_tokens: opts?.maxTokens ?? 512,
        temperature: 0.3,
      });
      return response.choices[0]?.message?.content ?? "";
    } catch (err) {
      console.error("[ai] OpenAI completion failed:", err);
    }
  }

  throw new Error("All AI completion providers failed or no keys are configured.");
}

/**
 * Categorize a civic complaint using AI.
 */
export async function categorizeComplaint(input: {
  issueType: string;
  location: string;
  description: string;
}): Promise<{
  detected_issue: string;
  confidence: string;
  department: string;
}> {
  const prompt = `Analyze this civic complaint and provide categorization:

Issue Type (user-selected): ${input.issueType}
Location: ${input.location}
Description: ${input.description}

Respond with JSON only, no markdown formatting:
{
  "detected_issue": "brief description of the detected issue",
  "confidence": "High or Medium or Low",
  "department": "name of the responsible government department"
}`;

  try {
    const response = await chatCompletion([
      { role: "system", content: "You are a civic issue categorization system. Respond with valid JSON only." },
      { role: "user", content: prompt },
    ]);

    // Parse the JSON response
    const cleaned = response.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    // Fallback if AI fails
    return {
      detected_issue: input.description.slice(0, 100),
      confidence: "N/A",
      department: "General Municipal Services",
    };
  }
}
