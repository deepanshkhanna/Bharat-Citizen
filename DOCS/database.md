# Database Design — Smart Bharat

Smart Bharat uses **PostgreSQL** hosted on **Supabase** for persistent, serverless-friendly storage. Objects are mapped using **Drizzle ORM** schemas.

## Entity Relationship Model

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

### Table Definitions

### 1. `schemes`
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

### 2. `profiles`
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

### 3. `complaints`
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

### 4. `complaint_timeline`
Tracks complaint progress history.
* `id` (`serial`): Primary key.
* `complaint_id` (`text`): Reference index to `complaints`.
* `status` (`text`): Timeline step name.
* `note` (`text`): Detail note.
* `created_at` (`integer`): Timestamp.

### 5. `conversations`
Maintains conversational threads.
* `id` (`text`): Primary key.
* `session_id` (`text`): Associated session.
* `context_type` (`text`): Page context type (`scheme` | `complaint`).
* `context_id` (`text`): References scheme or complaint ID.
* `created_at` (`integer`): Creation timestamp.

### 6. `messages`
Individual dialog lines.
* `id` (`text`): Primary key.
* `conversation_id` (`text`): References `conversations`.
* `role` (`text`): `user` or `assistant`.
* `content` (`text`): Text query or reply content.
* `created_at` (`integer`): Creation timestamp.

### 7. `activity`
Chronological interaction logs.
* `id` (`serial`): Primary key.
* `session_id` (`text`): Owner session.
* `type` (`text`): Action classification tag.
* `title` (`text`): Action heading title.
* `meta` (`text`): Detail metadata.
* `reference_id` (`text`): Optional reference ID.
* `created_at` (`integer`): Timestamp.
