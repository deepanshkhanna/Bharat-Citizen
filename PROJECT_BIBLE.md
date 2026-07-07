# PROJECT_BIBLE.md

## 1. Executive Summary

### Project Overview
**Smart Bharat** is a full-stack, AI-powered civic operating system designed for Indian citizens. It bridges the gap between complex government administration and everyday users by providing intuitive interfaces to discover schemes, evaluate eligibility, report civic infrastructure issues, and receive real-time, context-aware AI support in their native language.

### Mission
To democratize access to public welfare and civic recourse for every Indian citizen, removing systemic barriers like linguistic exclusion, complex administrative jargon, and disjointed interfaces.

### Objectives
1. **Simplify Discovery**: Consolidate central and state government schemes in a unified, searchable repository.
2. **Evaluate Instantly**: Compute personal scheme eligibility and document checklists dynamically from a citizen profile.
3. **Automate recourses**: Streamline public issue reporting (complaints) via location-based, AI-categorized ticket filing.
4. **Multilingual Copilot**: Offer a persistent, context-aware conversational AI assistant that understands context (specific schemes or complaints) and answers in major regional languages.

### Current Status
* **Frontend**: 100% complete and immutable. Built on React 19, TanStack Start (Router + SSR), and Tailwind CSS.
* **Backend**: 100% complete. Built using TanStack Start Server Functions and deployed to a live **Supabase PostgreSQL database** using **Drizzle ORM**.
* **AI Engine**: Integrated with **OpenRouter** (configured to use the `openrouter/free` auto-routing meta-model, with native fallback routes to Groq or OpenAI).

### Core Value Proposition
"Civic recourse in a single click, in your language." Smart Bharat replaces confusing multi-page forms, department portals, and bureaucratic directories with a unified, conversational interface backed by structured databases.

---

## 2. Product Overview

### Problem Solved
* **Information Asymmetry**: Millions of eligible citizens miss out on welfare schemes because they do not know they exist.
* **Complex Eligibility**: Government notifications use dense legal and administrative text to define eligibility.
* **Fragmented Recourse**: Filing a complaint (e.g., pothole, water leak) requires identifying the correct department, registering on outdated municipal sites, or visiting government offices.
* **Linguistic Barrier**: Most government portals are English-centric, leaving out non-English speakers.

### Target Users & Personas
* **Persona A (Ramesh, 45, Farmer in Maharashtra)**: Speaks Marathi. Needs to check if he qualifies for the PM-KISAN subsidy. Has low tech-literacy, struggles with text forms, and prefers voice or simple conversational queries.
* **Persona B (Priya, 19, Student in Haryana)**: Speaks Hindi and English. Tech-savvy. Wants to find college scholarships and track her application status.
* **Persona C (Arjun, 30, Urban Resident in Gurugram)**: Spotts a broken streetlight or water leak. Wants to report it in under 30 seconds and receive automated updates on which department is resolving it.

### Core Use Cases
1. **Scheme Matching**: Citizen fills out their profile -> App highlights qualifying schemes.
2. **Actionable Checklist**: Citizen clicks on a scheme -> App presents a checklist of required documents (Aadhaar, Income Certificate, etc.) and direct portal links.
3. **Conversational Recourse**: Citizen asks the chat drawer: *"Am I eligible for PM Scholarship if my family income is 2 Lakhs?"* -> Copilot parses the DB scheme data and responds directly.
4. **Civic Ticketing**: Citizen uploads a photo and types: *"Pothole near market"* -> AI categorizes it under "Roads", routes to the municipal road maintenance wing, and generates a tracking ID (e.g. `BR-2026-001`).

### Success Metrics
* **Time-to-Discovery**: Reduces time to find qualifying schemes from hours to under 2 minutes.
* **Resolution Tracking**: 100% transparency on complaint statuses with visual timelines.
* **Linguistic Reach**: Conversational support accessible in Hindi, Tamil, Telugu, Bengali, and English.

---

## 3. Complete Feature Inventory

| Feature | Purpose | Dependencies | Status | Related Systems |
|---|---|---|---|---|
| **AI Q&A Copilot** | Conversational support matching user profile and scheme details | OpenRouter / OpenAI API, `conversations`/`messages` tables | ✅ Live | `src/server/services/ai.ts`, `src/server/api/copilot.ts` |
| **Dynamic Schemes Repository** | Searchable database of all available state and central schemes | `schemes` table, Drizzle ORM | ✅ Live | `src/server/services/schemes.ts`, `src/routes/schemes.tsx` |
| **Interactive Eligibility Engine** | Client-side eligibility checklist comparing user profile against scheme rules | `profiles` table, profile context | ✅ Live | `src/routes/schemes.$id.tsx` |
| **AI Complaint Reporting** | Submit civic complaints with automatic AI classification and routing | OpenRouter API, `complaints`/`complaint_timeline` tables | ✅ Live | `src/components/complaint-form.tsx`, `src/server/api/complaints.ts` |
| **Visual Complaint Tracker** | Trace complaint timeline status from "Submitted" to "Resolved" | `complaints` and `complaint_timeline` tables | ✅ Live | `src/components/complaint-tracker.tsx` |
| **Civic Profile System** | Create and persist age, state, category, language, and accessibility preferences | `profiles` table | ✅ Live | `src/components/profile-form.tsx`, `src/server/api/profile.ts` |
| **Recent Activity Feed** | Displays a chronological log of user's views, checks, and tickets | `activity` table | ✅ Live | `src/server/api/activity.ts` |
| **Accessibility Toggles** | Adjusts text size and screen contrast across the application interface | Profile state | ✅ Live | `src/routes/profile.tsx` |

---

## 4. User Flows

### Flow 1: Profile Customization & Personalised Discovery
```
[User visits Home Page] 
       │
       ▼
[System detects no session -> sets anonymous cookie and localStorage ID]
       │
       ▼
[User clicks "Complete Profile"] -> [Fills State, Age, Occupation, and Category (e.g. Farmer)]
       │
       ▼
[User clicks "Save Profile"] -> [Profile upserted into Supabase database]
       │
       ▼
[User redirected/navigates back to Home]
       │
       ▼
[Home Page loads -> queries recommendations matched to profile category 'Farmer']
       │
       ▼
[Popular for Citizens section updates to feature 'PM-KISAN' and 'PM Fasal Bima' schemes]
```

### Flow 2: Scheme Eligibility & Copilot Guidance
```
[User views Schemes directory] -> [Filters by category 'Farmers' or searches 'Kisan']
       │
       ▼
[User clicks PM-KISAN] -> [Loader queries fetchSchemeById from Supabase]
       │
       ▼
[Detail page renders: Eligibility checklist flags are automatically computed against Profile data]
       │
       ▼
[User clicks "Ask Smart Bharat" button]
       │
       ▼
[Copilot Drawer slides open with context: scheme_id="pm-kisan"]
       │
       ▼
[User types: "Where do I submit my land records?"]
       │
       ▼
[Server receives chat request -> fetches full PM-KISAN scheme context from DB -> builds system prompt]
       │
       ▼
[OpenRouter returns response -> Saved to messages table -> streamed back to user UI]
```

### Flow 3: Complaint Lifecycle (Report, Classify, Track)
```
[User navigates to Complaints page]
       │
       ▼
[User selects issue type (e.g. Road) -> inputs location -> inputs description -> uploads photo]
       │
       ▼
[User clicks "Submit Complaint"]
       │
       ▼
[Server creates ticket -> calls OpenRouter to classify description]
       │
       ▼
[AI returns: detected_issue="Pothole", confidence="High", department="Roads Department"]
       │
       ▼
[Server writes records to complaints and complaint_timeline (status: "Submitted")]
       │
       ▼
[UI displays Confirmation page with complaint ID (e.g. BR-2026-001) and the AI Analysis card]
       │
       ▼
[User inputs ID into Track Complaint -> queries tracking API -> displays status progress timeline]
```

---

## 5. UI System

### Routing & Pages
We utilize **TanStack Router** to manage routing. Key files are mapped as follows:
* `/` (`src/routes/index.tsx`): Home dashboard showcasing hero action buttons, personalized scheme matching nudges, category tags, and the user's recent activities.
* `/schemes` (`src/routes/schemes.tsx`): Schemes directory showing category grid tags, search filters, and matching scheme cards.
* `/schemes/$id` (`src/routes/schemes.$id.tsx`): Split scheme view detailing benefits, eligibility checklists (with matching profile symbols), document indexes, and resources.
* `/complaints` (`src/routes/complaints.tsx`): Tabs for filing a new issue and tracking existing issues via ID.
* `/profile` (`src/routes/profile.tsx`): Settings form mapping state, category, age, language, and accessibility toggles.
* `/copilot` (`src/routes/copilot.tsx`): Dedicated full-screen conversational interface.

### Components
* `AppShell` (`src/components/app-shell.tsx`): Renders desktop sidebar navigation, mobile bottom navigation, and handles global context providers like the Copilot Drawer.
* `CopilotDrawer` (`src/components/copilot-drawer.tsx`): The persistent sliding drawer housing chat dialogues, loading states, and contextual headers.
* `ComplaintForm` (`src/components/complaint-form.tsx`): Renders form fields, triggers location maps, and base64 file upload compression.
* `ComplaintTracker` (`src/components/complaint-tracker.tsx`): Tracks complaint status and renders the visual progress timeline.
* `ComplaintConfirmation` (`src/components/complaint-confirm.tsx`): Displays success messages, AI analysis cards, and tracking ID copy actions.

### Design Principles
* **Curated Color Palette**: Primary deep blue shades, warm saffron warning highlights, success greens, and cool surface background cards.
* **Typography**: Uses modern sans-serif fonts styled via Tailwind classes.
* **Glassmorphism**: Backdrop blur overlays on modals and mobile navigation menus.
* **Trust Elements**: "AI Assisted" trust badges and warning disclaimers to reassure citizens.

---

## 6. Backend System

### Architecture
The backend is built as a **stateless API layer** running inside Vite/Nitro. It does not require a standalone Node server process; instead, it exposes endpoints via **TanStack Start Server Functions** (`createServerFn`).

```
┌──────────────────────────────────────────────────────────────────┐
│                   Vite / Vinxi Development Process               │
│                                                                  │
│  ┌───────────────────────┐             ┌──────────────────────┐  │
│  │   Frontend (React)    ├────────────►│   Server Functions   │  │
│  │    TanStack Router    │             │   (RPC Endpoints)    │  │
│  └───────────────────────┘             └──────────┬───────────┘  │
└───────────────────────────────────────────────────┼──────────────┘
                                                    │ Pool Connection
                                         ┌──────────▼───────────┐
                                         │  Supabase Postgres   │
                                         └──────────────────────┘
```

### Services
* **Database Connection Manager** (`src/server/db/index.ts`): Instantiates and exposes a PostgreSQL connection pool (`pg.Pool`) configured to handle connection limits in serverless execution environments.
* **AI Service Wrapper** (`src/server/services/ai.ts`): Acts as the gateway to LLMs. Utilizes the OpenAI SDK, checks for environment variables, configures base URLs, and routes tasks to OpenRouter or Groq.
* **Context Prompt Builder** (`src/server/services/prompts.ts`): Gathers runtime environment details (current scheme data or complaint IDs) and user profile info to construct context-rich instructions for the LLM.
* **Session Handler** (`src/server/services/session.ts`): Generates UUID identifiers to isolate user activities and profile configurations anonymously.

---

## 7. API Documentation

All APIs are exposed as RPC-style Server Functions and are consumed natively by the frontend.

### 7.1 `fetchSchemes`
* **Method**: `GET`
* **Input**:
  ```json
  {
    "category": "string (optional)",
    "q": "string (optional)"
  }
  ```
* **Output**:
  ```json
  {
    "schemes": [
      {
        "id": "pm-scholarship",
        "name": "PM Scholarship Scheme",
        "category": "Students",
        "tagline": "Welfare support...",
        "match": "high",
        "eligibility": [{ "label": "Age must be...", "met": false }],
        "documents": ["Aadhaar card", "Income certificate"],
        "resources": { "officialPortal": "https://..." }
      }
    ],
    "total": 1
  }
  ```

### 7.2 `fetchSchemeById`
* **Method**: `GET`
* **Input**: `{ "id": "string" }`
* **Output**: `{ "scheme": { ... } }`

### 7.3 `fetchRecommendedSchemes`
* **Method**: `GET`
* **Input**: `{ "profileCategory": "string (optional)" }`
* **Output**: `{ "schemeIds": ["pm-scholarship", "ayushman-bharat"] }`

### 7.4 `copilotChat`
* **Method**: `POST`
* **Input**:
  ```json
  {
    "message": "string (required)",
    "conversationId": "string | null",
    "context": {
      "page": "scheme | complaint | null",
      "schemeId": "string | null",
      "complaintId": "string | null"
    },
    "sessionId": "string (required)"
  }
  ```
* **Output**:
  ```json
  {
    "conversationId": "uuid",
    "messageId": "uuid",
    "content": "AI text response..."
  }
  ```

### 7.5 `submitComplaint`
* **Method**: `POST`
* **Input**:
  ```json
  {
    "issueType": "Road | Water | Electricity | Sanitation | Public Safety",
    "location": "string",
    "description": "string",
    "photo": "string | null (Base64)",
    "sessionId": "string"
  }
  ```
* **Output**:
  ```json
  {
    "id": "BR-2026-001",
    "status": "submitted",
    "ai_analysis": {
      "detected_issue": "Pothole in middle of street",
      "confidence": "High",
      "department": "Municipal Roads Department"
    },
    "timeline": [
      { "status": "Submitted", "note": "Complaint registered successfully", "created_at": 1720000000 }
    ]
  }
  ```

### 7.6 `getComplaint`
* **Method**: `GET`
* **Input**: `{ "id": "string" }`
* **Output**:
  ```json
  {
    "id": "BR-2026-001",
    "issue_type": "Road",
    "location": "Sector 15",
    "status": "under_review",
    "ai_analysis": { ... },
    "timeline": [ ... ]
  }
  ```

---

## 8. Database Documentation

Database engine: **PostgreSQL (Supabase)**. Object mapping via **Drizzle ORM**.

```
  ┌───────────────┐          ┌─────────────┐
  │   profiles    │          │  activity   │
  └───────────────┘          └─────────────┘
  
  ┌───────────────┐          ┌───────────────────────┐
  │  complaints   │◄─────────┤  complaint_timeline   │
  └───────────────┘          └───────────────────────┘
  
  ┌───────────────┐          ┌───────────────────────┐
  │ conversations │◄─────────┤       messages        │
  └───────────────┘          └───────────────────────┘
```

### 8.1 Table: `schemes`
Stores details about central and state welfare benefits.
* `id` (`text`): Primary key.
* `name` (`text`): Official scheme name.
* `short_name` (`text`): Compact identifier.
* `category` (`text`): Recipient category.
* `tagline` (`text`): Brief pitch.
* `overview` (`text`): Detailed overview.
* `match_default` (`text`): Default match rating.
* `eligibility_json` (`text`): Stringified array of eligibility rules.
* `documents_json` (`text`): Stringified list of required credentials.
* `resources_json` (`text`): Stringified map of support URLs.
* `ministry` (`text`): Hosting ministry.
* `created_at` (`integer`): Creation timestamp.

### 8.2 Table: `profiles`
Stores preferences and settings.
* `id` (`text`): Primary key.
* `session_id` (`text`): Unique index matching browser cookie.
* `state` (`text`): Selected state.
* `age_group` (`text`): Selected age bracket.
* `occupation` (`text`): Occupation name.
* `category` (`text`): Demographic profile class.
* `language` (`text`): UI locale code (e.g. `hi`).
* `large_text` (`integer`): Accessibility font size scaling trigger.
* `high_contrast` (`integer`): Accessibility contrast state.
* `onboarding_done` (`integer`): Flag indicating form completion.

### 8.3 Table: `complaints`
Stores registered tickets.
* `id` (`text`): Primary key (format `BR-YYYY-NNN`).
* `session_id` (`text`): Owner session.
* `issue_type` (`text`): Selected type.
* `location` (`text`): Descriptive location text.
* `description` (`text`): Contextual issue text.
* `photo_url` (`text`): Base64 image payload.
* `ai_detected_issue` (`text`): Issue type parsed by the LLM.
* `ai_confidence` (`text`): Categorization confidence rating.
* `ai_department` (`text`): Automatically routed department.
* `status` (`text`): Current status (e.g. `submitted`).

### 8.4 Table: `complaint_timeline`
Tracks complaint progress history.
* `id` (`serial`): Primary key.
* `complaint_id` (`text`): Reference index to `complaints`.
* `status` (`text`): Timeline step name.
* `note` (`text`): Detail note.
* `created_at` (`integer`): Timestamp.

---

## 9. Agent System

### 9.1 Copilot Agent
* **Role**: Expert guide for government programs and civic ticketing.
* **Memory**: Persists conversation history by fetching the last 10 messages from the database for the active thread.
* **Context Assembly**: Compiles information dynamically based on the user's active page:
  * *On Scheme page*: Injects full overview, rules, documents, and links.
  * *On Tracker page*: Injects complaint ID and latest status.
  * *Global*: Injects the user's profile state.
* **Failure Guard**: If the API call fails, defaults to a helpful message instructing the user to try again or search manually.

### 9.2 Issue Categorizer Agent
* **Role**: Stateless classifier for public complaints.
* **Prompt Schema**:
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
* **Fallback Strategy**: If parsing fails, defaults to a safe fallback:
  * Department: "General Municipal Services"
  * Detected Issue: truncated description text.

---

## 10. External Integrations

### 10.1 Supabase Postgres
* **Purpose**: Database hosting and storage.
* **Driver**: Node-postgres (`pg`) connection pooling.
* **Timeout Options**: 30-second idle timeout, 5-second connection timeout, maximum of 10 connections.

### 10.2 OpenRouter
* **Purpose**: AI query completion and classification.
* **Connection**: Custom OpenAI base URL mapping (`https://openrouter.ai/api/v1`).
* **Model**: Auto-routes through `openrouter/free` (using Gemini Flash free fallback).
* **Fallback**: Configured to check `GROQ_API_KEY` (using `llama-3.3-70b-versatile`) or `OPENAI_API_KEY` (`gpt-4o-mini`) if OpenRouter is unreachable.

---

## 11. Authentication & Authorization

### 11.1 Anonymous Session Model
Smart Bharat uses a **zero-friction anonymous access model**:
* No username or password registration is required.
* Upon first load, a UUID is generated, saved to the browser's `localStorage` (`sb_session_id`), and matched to an HTTP-only session cookie.
* Profiles, complaints, and chat histories are bound to this session ID.
* User data is isolated; database queries filter by `session_id` to prevent cross-user access.

---

## 12. Infrastructure

### 12.1 Environment Variables (`.env.local`)
```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxx
SUPABASE_SECRET_KEY=sb_secret_xxxx
SUPABASE_JWKS_URL=https://xxxx.supabase.co/auth/v1/.well-known/jwks.json

# Database URI (Pool/Direct connect URL-encoded)
DATABASE_URL=postgresql://postgres:password@xxxx.supabase.co:5432/postgres

# AI Config (Choose Groq, OpenRouter, or OpenAI)
GROQ_API_KEY=
OPENROUTER_API_KEY=
OPENAI_API_KEY=
AI_MODEL=openrouter/free
```

---

## 13. Architecture Decision Records

### ADR 1: Switch Database from SQLite to Supabase Postgres
* **Status**: Decided (Approved)
* **Date**: July 7, 2026
* **Context**: SQLite file-level locks and Vercel's ephemeral serverless filesystem cause data loss on container cold starts.
* **Decision**: Switched DB core to PostgreSQL hosted on Supabase, connected using Drizzle ORM pg-core adapter.
* **Consequences**: Data is preserved across serverless cold starts. Database migrations are pushed instantly via `drizzle-kit`.

### ADR 2: Implement Multi-Provider AI Support
* **Status**: Decided (Approved)
* **Date**: July 7, 2026
* **Context**: Free models on public API directories are subject to rate limits.
* **Decision**: Designed the AI service to dynamically adapt. It connects to OpenRouter, Groq, or OpenAI depending on the available keys.
* **Consequences**: Zero single-point-of-failure for LLM connectivity. Allows the app to run completely for free using free model routing.

---

## 14. File & Folder Map

```
smart-civic-path/
├── drizzle.config.ts          # Drizzle migrations configuration
├── package.json               # Package dependencies (pg, drizzle, openai)
├── src/
│   ├── components/            # Shared UI components
│   │   ├── complaint-form.tsx     # Issue submission form
│   │   ├── complaint-tracker.tsx  # Timeline progress tracker
│   │   ├── copilot-drawer.tsx     # Floating assistant panel
│   │   └── profile-form.tsx       # Personalization options
│   ├── routes/                # TanStack Router screens
│   │   ├── index.tsx              # Home dashboard
│   │   ├── schemes.tsx            # Schemes index search list
│   │   ├── schemes.$id.tsx        # Details view & checklists
│   │   ├── complaints.tsx         # Issue submission routes
│   │   └── profile.tsx            # Settings & locale selections
│   └── server/                # Backend API layer
│       ├── db/
│       │   ├── index.ts           # pg.Pool and Drizzle connection manager
│       │   ├── schema.ts          # Postgres table schemas mapping
│       │   └── seed.ts            # Seeder module for schemes & demo records
│       ├── api/
│       │   ├── copilot.ts         # Assistant chat endpoints
│       │   ├── complaints.ts      # Recourse registration and tracking
│       │   └── profile.ts         # Preferences persistence
│       └── services/
│           ├── ai.ts              # OpenRouter & Groq gateway
│           └── prompts.ts         # System instructions constructor
```

---

## 15. Operational Procedures

### Local Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/deepanshkhanna/Bharat-Citizen.git
   cd Bharat-Citizen/smart-civic-path
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local` and fill in your Supabase connection string and OpenRouter/Groq keys.
4. **Deploy Database Tables**:
   Ensure Drizzle Kit connects and pushes the schemas to Supabase Postgres:
   ```bash
   npx drizzle-kit push
   ```
5. **Start Dev Server**:
   ```bash
   npm run dev
   ```

---

## 16. Known Limitations
* **Ephemeral Serverless Cold-starts**: Handled by connection pooling configurations on pg.Pool.
* **OpenRouter Free Tier Limits**: Mitigated by using the `openrouter/free` routing model. In production, we suggest upgrading to a paid model slug like `google/gemini-2.5-flash` for high throughput.

---

## 17. Change Log

* **2026-07-07**: Switched database from SQLite to Supabase Postgres using Drizzle ORM pg-core adapter.
* **2026-07-07**: Added HMR support for env loaders and configured native fallback APIs for Groq/OpenRouter/OpenAI.
* **2026-07-07**: Developed the complaints wizard, timeline tracking components, and completed the first Git push to origin main.
* **2026-07-07**: Implemented automatic profile nudge popup modal on Home dashboard load, restricted match badges unless profile is onboardingDone, implemented dynamic eligibility checks/matching on schemes based on user category, added 5 universally applicable schemes, and removed all "Demo Ready" placeholders for launch.

---

## 18. Future Contributor Guide
To add a new feature or database table:
1. Declare the columns in `src/server/db/schema.ts` using `pg-core` types.
2. Run `npx drizzle-kit push` to update the live Supabase instance.
3. If writing database operations, use `await db.select(...)` rather than synchronous SQLite calls.
4. Update `PROJECT_BIBLE.md` to document the new features and tables.

---

## 19. PROJECT_BIBLE Governance Rules
* This document is the **authoritative source of truth**.
* Any changes to schemas, APIs, external integrations, or routes **must be documented here** before a task can be marked complete.
