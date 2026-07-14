# SmartFlow

SmartFlow is a Telegram-first business automation platform built on **Google Apps Script**, **Google Sheets**, **Google Calendar**, and the **Telegram Bot API**.

It is designed for small appointment-based businesses that need booking, customer management, staff management, notifications, and configuration without running a traditional CRM server.

The current reference implementation targets a **beauty salon**, while the architecture is intended to be reusable for barbershops, massage studios, nail studios, clinics, repair services, fitness studios, tutors, pet grooming, and other service businesses.

## Core idea

- customers use a dedicated **Client Bot**;
- administrators use a separate **Admin Bot**;
- Google Apps Script is the backend;
- Google Sheets stores data and configuration;
- Google Calendar stores and synchronizes confirmed appointments;
- each business can own its own deployment and data.

## Main features

### Client Bot

- multilingual UI: Ukrainian, Russian, English;
- customer registration and profile lookup;
- location, service, provider, date, and time selection;
- “any provider” option;
- multiple appointment options;
- booking request creation;
- current and future appointment list;
- cancellation and rescheduling;
- 24-hour reminders;
- customer appointment confirmation;
- configurable booking horizon through `BookingDaysAhead`.

### Admin Bot

- new request notifications;
- approve or reject proposed appointment options;
- appointment views by day, date, and provider;
- customer management and conflict handling;
- provider CRUD, schedules, and overrides;
- service CRUD with duration ranges;
- location CRUD;
- customer confirmation status in appointment lists;
- hierarchical mobile-friendly navigation;
- wizard-based creation and editing.

## Technology stack

- Google Apps Script
- Google Sheets
- Telegram Bot API
- Google Calendar
- JavaScript
- Git / GitHub

## High-level architecture

```text
Customer
   │
   ▼
Client Bot
   │
   ▼
Google Apps Script
   ├── Google Sheets
   ├── Google Calendar
   └── Telegram Bot API
              │
              ▼
          Admin Bot
```

## Documentation

- [`PROJECT.md`](PROJECT.md) — vision, scope, business rules, and functionality;
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — modules, routing, navigation, caching, and integrations;
- [`DATABASE_SCHEMA.md`](DATABASE_SCHEMA.md) — logical Google Sheets schema and relationships.
- [`CHANGELOG.md`](CHANGELOG.md) — release changes and security notes;
- [`RELEASE_CHECKLIST.md`](Docs/Guides/Version%201.0/RELEASE_CHECKLIST.md) — repeatable pilot release procedure.

## Local verification

Run the static project validator and the deterministic unit tests with the bundled or local Node.js runtime:

```text
node Scripts/validate-project.mjs
node Scripts/run-tests.mjs
```

## Client production upload

Client-specific deployment profiles live under `deployments/`. Profiles committed to Git contain placeholders only; the actual `deployment.local.json` is ignored and must never contain Telegram tokens or customer data.

Run a safe non-mutating preflight from the repository root before uploading a client installation:

```text
.\Scripts\deploy-client.cmd -Client salon-alice
```

After checking the displayed client name and Script ID, upload with:

```text
.\Scripts\deploy-client.cmd -Client salon-alice -Push
```

The utility refuses dirty worktrees and placeholder profiles, runs validation and tests, verifies access to the target Apps Script project, requires an exact client-name confirmation, and restores the developer `.clasp.json` afterward. It uploads source code only: updating the production Web App version, running migrations, health check, and release regression remain explicit post-upload steps.

The unit-test harness loads selected Apps Script files into an isolated VM context. In addition to domain and validation functions, it now covers the critical appointment lifecycle with deterministic adapters: final request persistence, idempotent administrator approval and rejection, rescheduling state reset, cancellation, provider-specific availability, manual Calendar conflicts, and duplicate-safe visit synchronization. Real Google authorization, Telegram delivery, triggers, and Calendar mutations remain integration-regression scenarios.

Before deployment or after an incident, run `runSmartFlowHealthCheck()` from the Apps Script editor. The read-only check validates the workbook schema, protected Settings, provider Calendar access, both Telegram webhooks, required triggers, duplicate triggers, and active request recipients without returning tokens or customer data.

The canonical application version is stored in `VERSION` and must match `SMARTFLOW_VERSION` in `AppsScript/Version.gs`. Both `getSmartFlowVersion()` and the health-check report expose this non-secret version for deployment verification.

Webhook processing uses a locked, per-bot history of exact Telegram `update_id` values. An update is recorded only after successful handling, preventing duplicate mutations without losing failed or out-of-order deliveries.

Outgoing Telegram calls share one response validator. Failed HTTP or Bot API responses create a sanitized `TELEGRAM_API_ERROR` audit event containing the method and status information, but never the bot token, chat ID, message text, or raw response body.

Calendar mutations are retry-safe at critical boundaries. A failed Calendar event creation leaves the request pending and reuses its incomplete appointment on retry. A failed reschedule restores the previous appointment time, reminder state, and customer confirmation. Event cancellation resolves the provider calendar instead of assuming the default calendar.

Every ID in `AdminTelegramIds` automatically receives administrative notifications. Additional active `RequestRecipients` are merged without duplicates, while approve/reject callbacks remain restricted to current administrators.

## Current status

Implemented foundations include:

- dual-bot architecture;
- multilingual message system;
- booking request flow;
- Google Calendar integration;
- navigation stack and Back behavior;
- wizard state management;
- appointment cancellation, rescheduling, reminders, and confirmation;
- customer, provider, service, and location management;
- live Google Calendar-backed appointment views;
- audit logging;
- configurable admin request recipients.

The codebase has been decomposed into focused workflow, query, command, synchronization, and integration modules. The next major areas are router simplification, the complete **Settings** module, broader automated testing, and release preparation.

## Design principles

- Telegram-first interface;
- no dedicated server required;
- business-owned data;
- localized UI text;
- minimal hardcoding;
- explicit state machines;
- separation of transport, navigation, business logic, and persistence;
- reusable modules for multiple service industries.

## Security note

Do not commit production bot tokens, calendar identifiers, customer data, or other secrets.

## License

Add the selected license here.
