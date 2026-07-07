# Smart Bharat 🇮🇳
### AI-Powered Civic Operating System for India

Smart Bharat is a full-stack, AI-powered civic platform designed to bring administration and public benefits directly to the fingertips of Indian citizens. Built on a serverless, database-backed architecture using **TanStack Start**, **Supabase Postgres**, and **OpenRouter**, it removes the complex hurdles of government scheme discovery, eligibility assessment, and local infrastructure recourse.

---

## ⚡ Live Demo
* **Local Web Interface**: `http://localhost:5173/`
* **Live Database Dashboard**: [Supabase Console](https://supabase.com/dashboard)
* **API Engine Integration**: Connected via OpenRouter & Groq API

---

## 💡 Why This Matters (Impact)

> **Millions of eligible citizens miss out on life-changing welfare programs because of fragmented government portals, dense legal terminology, and language barriers.**

Smart Bharat unifies the entire civic lifecycle into a single, mobile-responsive multilingual dashboard:

* **Discovery**: Translates a single search query into qualifying welfare opportunities.
* **Eligibility**: Automatically compares a user's age, state, and occupation rules to compute instant matching indicators.
* **Filing & Recourse**: Resolves municipal issues (potholes, leaks, electrical faults) by routing tickets to responsible government departments automatically using AI.
* **Contextual Guidance**: Provides a persistent, conversational AI partner that translates answers into regional Indian languages (Hindi, Marathi, Tamil, etc.).

---

## 🎨 Screen Showcase

### 1. Home Dashboard
*Personalized recommendations automatically adapt when a user updates their demographic profile class.*

![Home Dashboard Screenshot](docs/images/home_dashboard.png)

### 2. Schemes Index & Dynamic Queries
*Search state and central welfare offerings by category and get instant match ratings.*

![Schemes Directory Screenshot](docs/images/schemes_list.png)

### 3. Contextual AI Chat Companion
*Floating assistant drawer slides open and automatically ingests page context to answer queries.*

![AI Chat Drawer Screenshot](docs/images/copilot_chat.png)

---

## 🛠️ Technology Stack

* **Frontend**: React 19, TanStack Start (Router + SSR), Tailwind CSS, Lucide icons.
* **Database**: PostgreSQL (hosted on Supabase), structured via Drizzle ORM.
* **Backend RPC API**: TanStack Start Server Functions (`createServerFn`).
* **LLM Engine**: OpenRouter client mapping (using auto-routing free meta-model `openrouter/free`), with fallbacks to Groq (`llama-3.3-70b-versatile`) or OpenAI (`gpt-4o-mini`).
* **Package Manager**: NPM / Bun.

---

## 🏗️ Architecture Design

```
 ┌──────────────────────────────────────────────────────────────┐
 │                   Vite / Vinxi Development Process            │
 │                                                              │
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

The application is deployed as a single full-stack runtime. The frontend communicates with the server-side Vinxi endpoints using type-safe Server Functions. The server connects directly to the PostgreSQL pool, eliminating the need for a separate express API layer.

---

## 🤖 AI Workflow & Agent System

Smart Bharat employs two specialized AI agents to drive workflows:

1. **Copilot Agent**: Compiles user messages, conversation history (10 latest messages), scheme details, and user profiles into a system prompt. Translates instructions into major regional languages.
2. **Issue Categorizer**: Analyzes civic complaint description texts, auto-classifies issue types, computes confidence values, and routes the ticket to the responsible department (e.g. Municipal Roads Wing).

---

## 🗄️ Database Schema

The PostgreSQL schema consists of 7 relational tables:

* **`schemes`**: Details about government welfare programs (rules, criteria, documents, official links).
* **`profiles`**: Session-linked preferences (state, age group, occupation, language, accessibility toggles).
* **`complaints`**: User registered civic issue reports.
* **`complaint_timeline`**: Historical tracker logs for complaint ticket statuses.
* **`conversations` & `messages`**: Persists conversation history.
* **`activity`**: Stores citizen action logs (viewed schemes, ran checks).

---

## 🚀 Deployed Codebase Structure

* **[PROJECT_BIBLE.md](PROJECT_BIBLE.md)**: The single, comprehensive, and authoritative source of truth for the entire codebase.
* **[docs/architecture.md](docs/architecture.md)**: Documentation of runtime layers and server functions.
* **[docs/database.md](docs/database.md)**: Complete database column schemas, constraints, and relationships.
* **[docs/agents.md](docs/agents.md)**: AI agent logic, prompt structures, and fallback behaviors.

---

## ⚙️ Operational Local Boot
To run this project locally:

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
4. **Push Schema to Supabase**:
   ```bash
   $env:DATABASE_URL="postgresql://postgres:password@xxxx.supabase.co:5432/postgres"; npx drizzle-kit push
   ```
5. **Start Dev Server**:
   ```bash
   npm run dev
   ```
