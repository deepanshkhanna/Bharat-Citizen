import type { Scheme } from "../../data/schemes";

/**
 * Build the system prompt for the Smart Bharat copilot.
 */
export function buildSystemPrompt(opts?: {
  schemeContext?: Scheme;
  complaintContext?: { id: string; issueType: string; status: string };
  profile?: {
    state?: string | null;
    ageGroup?: string | null;
    occupation?: string | null;
    category?: string | null;
  };
}): string {
  let prompt = `You are Smart Bharat, an AI civic assistant for Indian citizens. You help people:
1. Find relevant government schemes
2. Understand eligibility criteria
3. Know what documents are needed
4. Report and track public issues
5. Navigate government services

Rules:
- Be concise and helpful. Use bullet points for lists.
- When discussing schemes, always mention eligibility criteria and required documents.
- Never invent scheme names or make up eligibility criteria. Only reference schemes you have been given context about.
- If you don't know something, say so and suggest checking the official portal.
- Always add a brief disclaimer: "Please verify details on the official portal before applying."
- Be empathetic and patient. Many users are not tech-savvy.
- If asked about complaints, guide users through the reporting process.
- Use simple language. Avoid jargon.
- Keep responses under 300 words unless the user asks for more detail.`;

  // Add scheme context if viewing a specific scheme
  if (opts?.schemeContext) {
    const s = opts.schemeContext;
    prompt += `

CURRENT CONTEXT — The user is viewing this government scheme:
Name: ${s.name}
Category: ${s.category}
Ministry: ${s.ministry}
Overview: ${s.overview}
Eligibility Criteria: ${JSON.stringify(s.eligibility)}
Required Documents: ${s.documents.join(", ")}
Official Portal: ${s.resources.officialPortal}
${s.resources.applicationForm ? `Application Form: ${s.resources.applicationForm}` : ""}

Focus your answers on this scheme. If the user asks about eligibility, reference the criteria above. If they ask about documents, list the required ones.`;
  }

  // Add complaint context if tracking a complaint
  if (opts?.complaintContext) {
    const c = opts.complaintContext;
    prompt += `

CURRENT CONTEXT — The user is tracking this complaint:
Complaint ID: ${c.id}
Issue Type: ${c.issueType}
Current Status: ${c.status}

Help the user understand their complaint status and what to expect next.`;
  }

  // Add profile context for personalization
  if (opts?.profile) {
    const p = opts.profile;
    const profileParts: string[] = [];
    if (p.state) profileParts.push(`State: ${p.state}`);
    if (p.ageGroup) profileParts.push(`Age Group: ${p.ageGroup}`);
    if (p.occupation) profileParts.push(`Occupation: ${p.occupation}`);
    if (p.category) profileParts.push(`Category: ${p.category}`);

    if (profileParts.length > 0) {
      prompt += `

CITIZEN PROFILE:
${profileParts.join("\n")}

Use this profile information to personalize your recommendations and eligibility assessments.`;
    }
  }

  return prompt;
}
