# SmartFlow Project Description

## 1. Overview

SmartFlow is a lightweight business automation platform for small appointment-based companies. It replaces a complex CRM interface with two Telegram bots connected to Google Sheets and Google Calendar.

A typical installation contains:

- one Google Spreadsheet;
- one Google Apps Script project;
- one Telegram Client Bot;
- one Telegram Admin Bot;
- one or more Google Calendars;
- configuration and localization stored in Google Sheets.

There is no dedicated VPS, SQL server, Docker deployment, or mandatory centralized SaaS backend.

## 2. Vision

SmartFlow aims to become a reusable Telegram-based operating layer for small service businesses.

The current beauty-salon implementation is the first business template, not a permanent limitation. Potential templates include:

- beauty salons;
- barbershops;
- nail and massage studios;
- private clinics;
- repair workshops;
- automotive services;
- trainers and fitness studios;
- tutors;
- pet grooming;
- other appointment-based businesses.

## 3. Problems addressed

Small businesses often manage appointments manually in chats, spreadsheets, or paper calendars. Common problems include:

- fragmented customer communication;
- inconsistent staff schedules;
- forgotten appointments;
- duplicated customer records;
- lack of customer history;
- expensive or overcomplicated CRMs;
- resistance to installing another application;
- high implementation and support costs.

SmartFlow uses tools many businesses already know: Telegram, Google Sheets, and Google Calendar.

## 4. Product goals

### 4.1 Simple deployment

Target deployment:

```text
Copy spreadsheet
→ Copy Apps Script project
→ Configure bot tokens
→ Configure webhooks
→ Configure calendar
→ Start using
```

### 4.2 Business-owned data

Each business owns its spreadsheet, Apps Script deployment, calendar, bot credentials, and operational data.

### 4.3 Low operational cost

The platform avoids permanent infrastructure and minimizes recurring technical costs.

### 4.4 Low support burden

Support is reduced through predictable menus, localization tables, reusable CRUD flows, explicit states, audit logs, and configuration through Telegram or Sheets.

### 4.5 Reusable engine

Business-specific information should be data rather than hardcoded logic: names, prices, durations, schedules, locations, messages, recipients, and settings.

## 5. Users and roles

### Customer

The customer can:

- register or identify themselves;
- select a location;
- select a service;
- select a provider or any provider;
- choose one or more date/time options;
- enter contact data and notes;
- send a booking request;
- review current/future appointments;
- cancel or reschedule;
- confirm an appointment from a reminder.

### Administrator

The administrator can:

- receive and process booking requests;
- review appointments;
- manage customers and conflicts;
- manage providers and schedules;
- manage services;
- manage locations;
- configure the system.

The project is moving away from a special technical “Owner” callback role. Operational request processing belongs to the Admin Bot.

### Provider

A provider is a business resource associated with a location, schedule, overrides, and appointments. A separate provider UI is not required in the current version.

## 6. Client Bot functionality

### 6.1 Start menu

Typical customer actions:

- Book;
- Services;
- Prices;
- Contacts;
- My appointments.

All labels are loaded from the `Messages` sheet.

### 6.2 Booking flow

Typical sequence:

```text
Location
→ Service
→ Provider
→ Date
→ Period / Time
→ Additional option
→ Name
→ Phone
→ Note
→ Request creation
```

The customer can propose several appointment options, including one preferred option.

### 6.3 Provider selection

The customer can select a specific provider or an “any provider” option.

### 6.4 Date selection

Supported choices include today, tomorrow, day after tomorrow, and a custom date.

The custom date range uses the `BookingDaysAhead` setting, with a fallback of 60 days.

### 6.5 Customer identification

Customers are associated with Telegram ID and phone number. Data may include name, language, timestamps, last visit, and notes.

### 6.6 My appointments

Only current and future appointments are displayed. Past appointments are hidden.

The intended rule prefers appointment end time, so an ongoing appointment does not disappear prematurely.

### 6.7 Cancellation and rescheduling

Inline callback flows support:

- confirmation dialogs;
- appointment status updates;
- Google Calendar updates/deletion;
- customer/admin notifications;
- message replacement after processing.

### 6.8 Reminder and customer confirmation

A 24-hour reminder contains a localized inline confirmation button.

After confirmation:

- `customer_confirmed = TRUE`;
- `customer_confirmed_at` is saved;
- the inline button is removed;
- the customer receives confirmation feedback;
- active admin recipients are notified;
- Admin Bot appointment lists show the confirmation status.

## 7. Admin Bot functionality

### 7.1 Mobile-friendly main menu

The compact main menu contains frequently used sections:

```text
Appointments
Customers
Settings
```

Settings contains:

```text
Providers
Services
Locations
```

This keeps the Telegram reply keyboard small on mobile devices.

### 7.2 New request notification

An admin notification contains:

- customer;
- phone;
- note;
- location;
- service;
- provider;
- proposed date/time options;
- approval buttons;
- rejection button.

Recipients are read from `RequestRecipients`.

### 7.3 Request approval

Approval performs:

1. request and option lookup;
2. duplicate appointment check;
3. appointment creation;
4. Google Calendar event creation;
5. request status update;
6. option status update;
7. customer status update where applicable;
8. admin message edit;
9. client notification.

### 7.4 Request rejection

Rejection updates request/options, edits the admin message, and notifies the customer.

### 7.5 Appointment views

Views include:

- today;
- tomorrow;
- by date;
- by provider;
- next working day.

Cards can show time, customer, phone, confirmation status, service, provider, location, note, and a manual-calendar marker.

### 7.6 Customer management

Features include profile lookup by phone, retry when not found, customer-specific services/pricing, and conflict management.

### 7.7 Provider management

Provider features:

- list;
- create;
- edit;
- enable/disable;
- recurring schedule;
- working-day start/end;
- schedule overrides.

Creation wizard:

```text
Name
→ Location
→ Phone
→ Telegram ID
→ Create
```

### 7.8 Service management

Service features:

- list;
- create;
- edit;
- enable/disable;
- location association;
- minimum/maximum price;
- minimum/maximum duration.

Creation wizard:

```text
Name
→ Location
→ Min price
→ Max price
→ Min duration
→ Max duration
→ Create
```

### 7.9 Location management

Location features:

- list;
- create;
- edit;
- enable/disable.

Fields include localized name/address keys, working hours, Instagram, Telegram, website, Google Maps URL, two phones, and active status.

Creation wizard:

```text
Name
→ Address
→ Phone
→ Create
```

## 8. Localization

Current languages:

- Ukrainian;
- Russian;
- English.

Visible text is stored in `Messages` and accessed through `MESSAGE_KEYS`.

Locations can store `name_key` and `address_key`, allowing dynamic business data to use the same localization system.

The target rule is: no hardcoded user-facing text.

## 9. Navigation model

Stable menus are stored in a navigation stack. Wizard prompts are stored as interaction states, not menu entries.

Admin hierarchy:

```text
MAIN
├── APPOINTMENTS
├── CUSTOMERS
└── SETTINGS
    ├── PROVIDERS
    ├── SERVICES
    └── LOCATIONS
```

This enables:

- wizard → parent section;
- section → Settings;
- Settings → Main;
- rendering a parent menu without adding a duplicate stack entry.

## 10. Business rules

### Active entities

Inactive locations/providers/services remain in storage but are normally excluded from customer booking.

### Request recipients

A recipient is eligible when:

```text
active = TRUE
receive_new_requests = TRUE
telegram_id is present
```

### Statuses

Typical statuses include pending, confirmed, rejected, cancelled, rescheduled, and completed.

### Manual calendar entries

Google Calendar events created outside SmartFlow can appear in admin lists with a manual-calendar marker.

### Parallel work

The architecture can support businesses where a provider serves multiple clients in parallel. Strict slot exclusion is therefore configurable rather than universally assumed.

## 11. Non-functional requirements

### Reliability

- duplicate Telegram updates are ignored;
- callbacks should be idempotent;
- request approval must not create duplicate appointments;
- cache invalidation follows writes;
- missing data fails safely;
- significant failures are audited.

### Maintainability

- domain logic is separated into modules;
- callbacks are split by responsibility;
- helpers reduce duplication;
- UI text is localized;
- targeted wizard resets preserve navigation.

### Performance

- settings/messages/entities are cached;
- CalendarCache avoids repeated calendar reads;
- Sheets are read in batches.

### Security

- Admin Bot access is restricted by Telegram ID;
- credentials are not committed;
- production spreadsheets remain private;
- deployment permissions are configured carefully.

## 12. Deployment model

A client installation requires:

1. spreadsheet template;
2. Apps Script source;
3. Client Bot token;
4. Admin Bot token;
5. Client webhook;
6. Admin webhook with `?bot=admin`;
7. calendar configuration;
8. allowed admin IDs;
9. request recipients;
10. time-driven triggers for reminders/sync.

## 13. Current state

### Implemented

- dual bots;
- webhook routing;
- duplicate-update protection;
- localization;
- navigation stack;
- wizard states;
- booking requests;
- multi-location support;
- providers, schedules, overrides;
- services;
- customers and conflicts;
- request approval/rejection;
- appointments;
- Calendar integration;
- cancellation/rescheduling;
- reminders and confirmation;
- CalendarCache;
- audit logging;
- location CRUD;
- compact admin menu.

### In progress

- full Settings module;
- cache-reset UX;
- remaining configuration editors;
- global refactoring.

### Planned

- feature flags;
- richer reports and analytics;
- Telegram Web App;
- reusable business templates;
- role-based permissions;
- automated installation;
- stronger automated tests;
- improved conflict analysis.

## 14. Success criteria

SmartFlow is successful when a small business can:

- deploy without maintaining a server;
- receive requests in Telegram;
- manage daily work from a phone;
- own its data;
- configure core entities without code;
- reduce missed appointments;
- reduce manual scheduling;
- reuse the same engine across service industries.
