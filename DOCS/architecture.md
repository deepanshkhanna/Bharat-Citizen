# System Architecture — Smart Bharat

Smart Bharat is built on a modern full-stack architecture using **TanStack Start**, which leverages React 19 for rendering and **Vinxi/Nitro** for server-side execution. Data is stored in a live **Supabase PostgreSQL database** using **Drizzle ORM**.

## Architecture Overview

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

The application runs as a unified full-stack server process. The frontend handles interactive routing, accessibility options, and state, while the backend API layer exposes server functions (`createServerFn`) that execute on the server and query the database directly.

## Runtime Components

### 1. Frontend Router (TanStack Router)
Renders components dynamically based on client navigation. Loaders handle asynchronous API prefetching server-side before routes render.

### 2. State Management (React & TanStack Query)
Leverages React context for UI configurations (e.g. Copilot Drawer toggle state, language options) and TanStack Query for data fetching, caching, and state synchronization.

### 3. Backend RPC Layer (Server Functions)
Replaces traditional REST/GraphQL APIs with type-safe server functions. These functions:
- Receive parameters validated by standard schema rules.
- Query PostgreSQL using Drizzle.
- Retrieve data and serialize it automatically back to the client.

### 4. Services Layer
- **AI Router**: Decouples model calls from specific APIs, managing base URLs and authentication keys for OpenAI, Groq, and OpenRouter.
- **Context Prompt Engine**: Injects dynamic database values (e.g. schemes rules, complaint statuses, user categories) into the LLM system prompt for context-rich guidance.
- **Session Manager**: Scopes user profiles and data securely using localStorage UUID keys.
