# SmartFlow Project Description

## 1. Overview

SmartFlow is a lightweight business automation platform for small appointment-based companies. It replaces a complex CRM interface with two Telegram bots connected to Google Sheets and Google Calendar.

Apps Script source formatting is standardized with Prettier using the repository
configuration. The 120-character line width keeps long message keys and Apps
Script API calls compact without sacrificing consistent indentation.

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

Business-specific information should be data rather than hardcoded logic: names, durations, schedules, locations, messages, recipients, and settings.

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

There is no separate technical Owner callback role. Operational request processing belongs to the Admin Bot.

### Provider

A provider is a business resource associated with a location, schedule, overrides, and appointments. A separate provider UI is not required in the current version.

## 6. Client Bot functionality

### 6.1 Start menu

Typical customer actions:

- Book;
- Services;
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

Changing an appointment date or time starts a new reminder-confirmation cycle.
The reminder timestamps, customer confirmation flag, and confirmation timestamp
are cleared so a new reminder can be sent and confirmed for the updated time.

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

Recipients are formed from every `AdminTelegramIds` entry plus eligible
`RequestRecipients`, deduplicated by Telegram ID.

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

After a successful client reschedule, Client Bot replaces the time-slot keyboard
with normal navigation and shows only the updated appointment card with its new
date/time, service, provider, location, and note. The informational card has no
reschedule or cancel actions. A successful cancellation likewise sends the client
the cancelled appointment card without action buttons. Regular My Appointments
cards retain both actions. Admin notification remains unchanged.
When the card originates from a linked Google Calendar event, these actions still
operate on the authoritative `Appointments` row; Calendar is updated only through
the normal appointment synchronization path.

### 7.6 Customer management

Features include profile lookup by phone, retry when not found, customer-specific
service settings, visit history, and conflict management. Customer lists and visit
history use the shared `PaginationPageSize` setting with localized previous/next
navigation buttons.

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
→ Create
```

`telegram_id` is optional and is not requested during provider creation. It can
be added later through provider editing.

### 7.8 Service management

Service features:

- list;
- create;
- edit;
- enable/disable;
- location association;
- minimum/maximum duration.

Creation wizard:

```text
Name
→ Location
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

Fields include direct name and address values, working hours, Instagram, Telegram, website, Google Maps URL, two phones, and active status.

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

Static visible interface text is stored in `Messages` and accessed through `MESSAGE_KEYS`.
Location, provider, and service names, as well as location addresses, are domain
data and are stored directly in their respective sheets. They do not change when
the interface language changes.

Navigation footers and pagination labels are rebuilt in the selected interface
language. Navigation handlers accept every configured translation, so buttons
from the previously displayed keyboard remain safe to press after a language change.

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

Google Calendar events created outside SmartFlow:

- occupy time only for the provider whose calendar contains the event;
- do not block other providers working at the same time;
- appear in Admin Bot appointment lists with a manual-calendar marker;
- remain Calendar events and do not create `Appointments` rows;
- do not participate in Client Bot confirmation, reminder, cancellation, or rescheduling flows.

When present, structured event details are read from the Calendar description:

```text
Customer: ...
Phone: ...
Service: ...
Provider: ...
Location: ...
Comment: ...
```

Actual labels are localized through message keys. The containing provider calendar is authoritative for slot ownership; a provider value written in the description is display data.

Missing description fields do not stop the event from occupying its provider's time or appearing in Admin Bot.

After a manual event has ended, the hourly completed-visit synchronization records events from the previous seven days when a valid phone number is available. It normalizes phones, avoids duplicate visits by Calendar event ID, and updates `CustomerProfiles` even when optional customer information is absent.

### Customer data roles

- `Customers` is operational and populated dynamically through bot activity.
- `CustomerProfiles` represents customers who received a service and may also be maintained manually through Admin Bot.
- A profile may be created automatically after a completed visit, including a completed manual Calendar event with a valid phone number.

### Scheduling isolation

Providers may work in parallel. A busy interval belonging to one provider must never make the same interval unavailable for another provider.

### Bot roles

The supported interaction roles are Client and Admin. Admin access uses `AdminTelegramIds`. Every administrator automatically receives Admin notifications; eligible `RequestRecipients` add optional recipients.

The Admin Bot Settings section includes a Configuration submenu. User-editable settings are explicitly allowlisted; bot tokens, webhook URLs, Calendar identifiers, and other infrastructure values are not exposed through the Telegram UI. The first supported configuration workflow changes the application language using localized values from `Messages`.

Administrators manage `AdminTelegramIds` through separate Add and Delete actions. Each action accepts one numeric Telegram ID and persists the normalized complete list as a comma-separated Settings value. Adding preserves existing IDs and rejects duplicates. Deleting rejects unknown IDs and prevents the acting administrator from deleting their own access.

Starting Admin Bot does not change notification routing. Membership in
`AdminTelegramIds` is authoritative. Every Admin Bot callback rechecks this rule,
and a stale reject callback cannot change a request already processed by another
administrator.

The Administrators menu also provides a read-only list action that displays every Telegram ID currently allowed to use Admin Bot.

The Configuration menu controls the `ReminderDayBefore` setting. When disabled, the 24-hour reminder trigger exits before selecting or notifying appointments. Missing settings default to enabled to preserve existing installations.

`BookingDaysAhead` is the single editable horizon from 1 to 365 days. It controls client booking, rescheduling, admin date selection, future Calendar reads, and next-working-day searches.

`PaginationPageSize` is a shared page size for every paginated Admin Bot view.
It accepts values from 1 to 10 and defaults to 5 when the setting is missing or
invalid.

`DefaultWorkStartTime` and `DefaultWorkEndTime` are edited together as one `HH:MM-HH:MM` interval. The end must be later than the start. Updating these defaults affects newly created provider schedules and missing-time fallback behavior; it does not rewrite existing provider schedules.

When a cross-setting horizon constraint fails, the bot keeps the current input state and displays the exact maximum or minimum acceptable value. Successful horizon updates return through the registered Configuration menu rather than the parent Settings menu.

After deploying the configuration workflow to an existing installation, run `migrateConfigurationMessages()` once from the Apps Script editor. The migration is safe to repeat and preserves existing message translations.

Repeat `migrateConfigurationMessages()` after deploying newly added configuration editors. It appends only localization keys that are not already present.

Run `migratePaginationConfiguration()` after deploying shared pagination settings.
It creates or refreshes the pagination messages and sets `PaginationPageSize` to
5 only when the current value is missing or outside the supported 1–10 range.
Valid existing values are preserved.

Existing installations that ran the first configuration migration should run `migrateConfigurationMenuIcon()` once to add the localized gear icon to the Configuration menu item.

Run `migrateSystemConfigurationSettings()` once after deploying the system-settings cleanup. It safely removes obsolete `OwnerTelegramId`, `ReminderMonth`, and experimental `EnableLogs` rows, resets the shared Settings cache, and is safe to repeat.

`DefaultWorkStartTime` and `DefaultWorkEndTime` remain active settings because provider schedule creation and day enabling still consume them.

The product intentionally does not store service prices or currency. Service management is limited to booking-relevant data such as location, duration, availability, and customer-specific duration overrides.

After enabling or disabling a service, Admin Bot automatically renders the Services menu.

Run `migrateRemoveFinancialFields()` once after deploying the financial-field cleanup. It removes `BusinessName` and `Currency` Settings rows, obsolete price localization rows, price columns from `Services` and `CustomerServiceSettings`, obsolete price fields from `UserSessions`, and price values from valid session JSON. It is safe to repeat. Historical `AuditLog` payloads are preserved as immutable operational history.

Run `migrateEntityNamesFromMessages()` once after deploying direct entity-name
storage. It resolves every existing location name/address, provider name, and
service name using the currently selected interface language (with safe language
fallbacks), renames the corresponding columns, and then deletes only the migrated
dynamic rows from `Messages`. The migration is safe to repeat.

Immediately after deploying the Calendar-cache removal, run
`migrateRemoveCalendarCache()` once from the Apps Script editor. It removes the
obsolete cache sheet, setting, localization rows, and cache refresh triggers, then
creates the hourly `syncCompletedCustomerVisitsTrigger` if it is missing. The
migration is safe to repeat. Appointment views read live `Appointments` and Google
Calendar data after this deployment, so they no longer wait for a refresh trigger.

After backing up an installation created from the legacy workbook, run
`migrateCleanupLegacyWorkbookSchema()` once. It restores the `AuditLog` header
without replacing its first event, removes only fully blank columns after the four
localized `Messages` columns, migrates legacy `UserSessions` values into
`session_data`, reduces that sheet to three physical columns, and deletes the
unused `ProviderServices` and `Notifications` sheets. The migration is safe to
repeat, but the backup is mandatory because the first run intentionally removes
obsolete columns and sheets.

`runSmartFlowHealthCheck()` is a read-only installation diagnostic. It returns a
structured report for the required sheet headers, protected Settings, active
provider Calendar access, client/admin webhook URLs, required and duplicate
installable triggers, and active request recipients. The report contains only
technical codes, counts, sheet/column names, and provider IDs; it never includes
bot tokens or customer data.

Production bot tokens are stored in Apps Script Script Properties rather than the shared Settings sheet. Existing installations migrate with `migrateBotTokensToScriptProperties()`, which validates both tokens before writing either property and clears the legacy cells only after both properties are stored. Runtime fallback keeps the bots available before migration, but health check treats fallback or mixed storage as a release blocker.

The pilot application version is stored in `VERSION` and mirrored by `SMARTFLOW_VERSION` in Apps Script. The health-check report includes this non-secret value to confirm which Web App version is deployed. Releases are recorded in `CHANGELOG.md` and follow the repeatable `Docs/Guides/Version 1.0/RELEASE_CHECKLIST.md`, including rollback criteria.

### Parallel work

The architecture can support businesses where a provider serves multiple clients in parallel. Strict slot exclusion is therefore configurable rather than universally assumed.

## 11. Non-functional requirements

### Reliability

- duplicate Telegram updates are ignored;
- processed Telegram update IDs are stored separately per bot only after successful handling;
- failed and out-of-order Telegram updates are not discarded by the duplicate guard;
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
- Sheets are read in batches.
- appointment views read current `Appointments` and Google Calendar data directly;
- provider-range views query each unique Calendar once for the requested range.

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
- live Calendar-backed admin appointment views;
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
