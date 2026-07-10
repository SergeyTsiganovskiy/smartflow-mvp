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
- service CRUD with price and duration ranges;
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
- calendar cache;
- audit logging;
- configurable admin request recipients.

The next major area is the complete **Settings** module, followed by global refactoring, testing, and release preparation.

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
