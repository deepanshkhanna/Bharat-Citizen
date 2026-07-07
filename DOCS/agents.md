# AI Agent Systems — Smart Bharat

Smart Bharat incorporates specialized, task-focused LLM agents into its architecture, rather than general chat loops.

## 1. Copilot Agent

### Purpose
Guides citizens on government scheme guidelines, required application documentation, and civic recourse instructions in their regional language.

### Inputs
- User message string.
- Page context (e.g. active `scheme_id` or active `complaint_id`).
- Profile details (age, state, category).
- Database scheme documents, overview guidelines, and support links.

### Context Prompts
System prompts are assembled dynamically on the server:
- Gathers database definitions of the active scheme.
- Merges the demographic profile details.
- Commands the LLM to write replies in regional Indian languages (Hindi, Tamil, Telugu, Bengali) if requested by the user.

### Failure Handling
Includes robust try/catch wraps. If the OpenRouter/Groq endpoints are offline, defaults to a clean, user-friendly fallback instructing them to check the official state URL directly.

---

## 2. Issue Categorizer Agent

### Purpose
Automatically classifies citizen complaint descriptions to extract the core problem, routing confidence, and the responsible government department.

### Model Prompt Schema
```
Analyze this civic complaint and provide categorization:
Issue Type (user-selected): {type}
Location: {location}
Description: {desc}
Respond with JSON only:
{
  "detected_issue": "...",
  "confidence": "High | Medium | Low",
  "department": "..."
}
```

### Outputs
- `detected_issue`: Concise summary of the infrastructural issue.
- `confidence`: AI confidence score.
- `department`: Automatically matched government division (e.g., "Municipal Roads Division").

### Fallback
If parsing or generation fails, defaults to a safe, general routing:
- Department: "General Municipal Services"
- Detected Issue: truncated description text.
