import OpenAI from "openai";

let _client: OpenAI | undefined;
let _modelName = "gpt-4o-mini";

function getClient(): OpenAI {
  if (!_client) {
    const groqKey = process.env.GROQ_API_KEY;
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (groqKey) {
      console.log("[ai] Initializing Groq client");
      _client = new OpenAI({
        apiKey: groqKey,
        baseURL: "https://api.groq.com/openai/v1",
      });
      _modelName = process.env.AI_MODEL || "llama-3.3-70b-versatile";
    } else if (openrouterKey) {
      console.log("[ai] Initializing OpenRouter client");
      _client = new OpenAI({
        apiKey: openrouterKey,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "Smart Bharat",
        },
      });
      _modelName = process.env.AI_MODEL || "google/gemini-2.5-flash:free";
    } else if (openaiKey) {
      console.log("[ai] Initializing OpenAI client");
      _client = new OpenAI({ apiKey: openaiKey });
      _modelName = process.env.AI_MODEL || "gpt-4o-mini";
    } else {
      throw new Error(
        "No AI API keys found. Please set either GROQ_API_KEY, OPENROUTER_API_KEY, or OPENAI_API_KEY in your environment."
      );
    }
  }
  return _client;
}

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

/**
 * Stream a chat completion from the configured LLM provider.
 * Returns an async iterable of content tokens.
 */
export async function* streamChat(
  messages: ChatMessage[],
  opts?: { maxTokens?: number }
): AsyncGenerator<string, void, undefined> {
  const client = getClient();
  const stream = await client.chat.completions.create({
    model: _modelName,
    messages,
    stream: true,
    max_tokens: opts?.maxTokens ?? 1024,
    temperature: 0.7,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}

/**
 * Non-streaming chat completion (for single-shot tasks like complaint categorization).
 */
export async function chatCompletion(
  messages: ChatMessage[],
  opts?: { maxTokens?: number }
): Promise<string> {
  const client = getClient();
  const response = await client.chat.completions.create({
    model: _modelName,
    messages,
    max_tokens: opts?.maxTokens ?? 512,
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content ?? "";
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
