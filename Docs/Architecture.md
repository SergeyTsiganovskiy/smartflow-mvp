# SmartFlow Technical Architecture

## 1. Overview

SmartFlow is an event-driven Google Apps Script application integrating two Telegram bots, Google Sheets, and Google Calendar.

Primary event sources:

- Telegram webhook updates;
- time-driven Apps Script triggers;
- manual admin actions;
- calendar synchronization jobs;
- test/debug functions.

## 2. System context

```text
Telegram Customer
      │
      ▼
  Client Bot
      │ webhook
      ▼
Google Apps Script
 ├── Routing
 ├── State machines
 ├── Navigation
 ├── Business logic
 ├── Persistence
 ├── Calendar integration
 └── Notifications
      │
      ├── Google Sheets
      ├── Google Calendar
      └── Admin Bot
```

## 3. Runtime

Google Apps Script provides:

- `doPost(e)` HTTP entry point;
- SpreadsheetApp;
- Calendar services/helpers;
- UrlFetchApp for Telegram API;
- Utilities for date/time;
- triggers;
- execution logs.

No dedicated server is required.

## 4. Webhook routing

Both bots can use the same Apps Script deployment.

Typical endpoints:

```text
Client: /exec
Admin:  /exec?bot=admin
```

`doPost(e)`:

1. parses JSON;
2. resolves bot type;
3. rejects duplicate updates;
4. routes messages or callback queries;
5. logs top-level errors;
6. returns `OK` or `ERROR`.

Simplified routing:

```javascript
if (botType === 'admin') {
  if (update.message) handleAdminMessage(update.message);
  if (update.callback_query) handleAdminCallback(update.callback_query);
  return;
}

if (update.message) handleClientMessage(update.message);
if (update.callback_query) handleClientCallback(update.callback_query);
```

## 5. Bot separation

### Client Bot

Main entry points:

```text
handleClientMessage()
handleClientCallback()
```

Client callbacks include appointment confirmation and appointment cancel/reschedule actions.

`processAppointmentConfirmation()` handles the 24-hour reminder confirmation.

Other appointment actions are delegated to `handleAppointmentCallback()`.

### Admin Bot

Main entry points:

```text
handleAdminMessage()
handleAdminCallback()
```

Request approval/rejection is delegated to:

```text
processRequestApproveOption()
processRequestReject()
```

Admin request messages must be edited with `AdminBotToken`; client messages with `ClientBotToken`.

## 6. Module organization

The exact filenames may evolve, but the architecture is domain-oriented.

### Infrastructure

- `Code.gs` — webhook entry points and global bot routing;
- `Config.gs` — sheet names, runtime settings, and settings cache;
- `States.gs`, `Menus.gs`, `MessageKeys.gs` — conversation states, menu identifiers, and localization keys;
- `Telegram.gs` — Telegram message and callback API helpers;
- `TelegramWebhooks.gs` — webhook setup, inspection, deletion, and manual polling;
- `Messages.gs`, `MessageCommands.gs` — localized message reads and writes;
- `AuditLog.gs` — persistent diagnostic and operational audit entries;
- `DateUtils.gs`, `TimeUtils.gs`, `DateTimeUtils.gs`, `BookingDateTimeUtils.gs`, `ScheduleDateTimeUtils.gs`, `PhoneUtils.gs`, `IdUtils.gs`, `TextUtils.gs` — focused shared helpers, separating date-only, time-only, combined date-time, booking, and schedule concerns;
- `CalendarMetadata.gs`, `KeyboardUtils.gs`, `TelegramUpdateGuard.gs` — integration-specific helpers.

### Bot and callback modules

- client entry and routing: `ClientBot.gs`, `ClientCommandRouter.gs`, `ClientStateRouter.gs`;
- client command handlers: `ClientNavigationCommandHandler.gs` and `ClientMenuCommandHandler.gs` preserve navigation-before-menu priority;
- client workflows: `ClientBooking.gs`, `ClientAppointments.gs`, `ClientContacts.gs`;
- client state handlers: `ClientBookingStateHandler.gs` handles the booking wizard; `ClientAppointmentStateHandler.gs` handles appointment lookup states; `ClientRescheduleStateHandler.gs` handles rescheduling date/time states;
- admin entry, access, and routing: `AdminBot.gs`, `AdminAccess.gs`, `AdminCommandRouter.gs`, `AdminStateRouter.gs`;
- admin command handlers: navigation and section handlers run first, followed by `AdminProviderCommandHandler.gs`, `AdminServiceCommandHandler.gs`, `AdminAppointmentCommandHandler.gs`, `AdminCustomerCommandHandler.gs`, and `AdminLocationCommandHandler.gs`;
- admin configuration: `AdminConfiguration.gs` owns the Settings → Configuration menu and configuration states; `ConfigurationRegistry.gs` is the allowlist of values editable through Admin Bot; `ConfigCommands.gs` owns Settings sheet mutations and cache reset;
- admin state handlers: `AdminServiceStateHandler.gs`, `AdminAppointmentStateHandler.gs`, `AdminCustomerStateHandler.gs`, `AdminLocationStateHandler.gs`, `AdminProviderStateHandler.gs`, `AdminScheduleStateHandler.gs`, and `AdminOverrideStateHandler.gs` preserve the original domain priority;
- callback workflows: `AppointmentCallbacks.gs`, `AppointmentCards.gs`, `AppointmentConfirmations.gs`, `AppointmentRescheduling.gs`, `RequestCallbacks.gs`;
- request and appointment notifications: `Notifications.gs`, `RequestNotifications.gs`, `Reminders.gs`.

### Admin workflow modules

Large admin sections are split by operation while preserving global Apps Script function names:

- customers: `AdminCustomers.gs`, `AdminCustomerProfileView.gs`, `AdminCustomerList.gs`, `AdminCustomerVisitHistory.gs`, `AdminCustomerProfiles.gs`;
- customer service settings: `AdminCustomerServiceView.gs`, `AdminCustomerServiceEditing.gs`, `AdminCustomerServiceDeletion.gs`;
- customer conflicts: `CustomerConflicts.gs`, `AdminCustomerConflictCreation.gs`, `AdminCustomerConflictView.gs`, `AdminCustomerConflictDeletion.gs`;
- appointments: `AdminAppointments.gs`, `AdminAppointmentDaily.gs`, `AdminAppointmentFilters.gs`, `AdminAppointmentNextWorkingDay.gs`;
- locations: `AdminLocations.gs`, `AdminLocationCreation.gs`, `AdminLocationEditing.gs`, `AdminLocationActivation.gs`;
- services: `AdminServices.gs`, `AdminServiceCreation.gs`, `AdminServiceEditing.gs`, `AdminServiceActivation.gs`;
- providers: `AdminProviders.gs`, `AdminProviderCreation.gs`, `AdminProviderEditing.gs`, `AdminProviderActivation.gs`;
- provider schedules: `AdminProviderScheduleView.gs`, `AdminProviderSchedules.gs`, `AdminProviderScheduleTimeEditing.gs`;
- schedule overrides: `AdminProviderOverrideSelection.gs`, `AdminProviderOverrideCreation.gs`, `AdminProviderOverrideList.gs`, `AdminProviderOverrideDeletion.gs`.

### Navigation

- `CoreNavigation.gs`;
- `ClientNavigation.gs`;
- `AdminNavigation.gs`;
- `AdminBackNavigation.gs`.

### Domain persistence

Sheet-backed domains use an explicit query/command split where useful:

- customers: `Customers.gs`, `CustomerCommands.gs`;
- customer profiles: `CustomerProfiles.gs`, `CustomerProfileCommands.gs`, `CustomerProfileSync.gs`;
- visit history: `CustomerVisitHistory.gs`, `CustomerVisitHistoryCommands.gs`, `CustomerVisitHistorySync.gs`;
- customer conflicts: `CustomerConflictRepository.gs`, `CustomerConflictCommands.gs`;
- customer service settings: `CustomerServiceSettings.gs`, `CustomerServiceSettingCommands.gs`;
- providers: `Providers.gs`, `ProviderCommands.gs`;
- provider schedules: `ProviderSchedules.gs`, `ProviderScheduleCommands.gs`;
- provider overrides: `ProviderOverrides.gs`, `ProviderOverrideCommands.gs`;
- services: `Services.gs`, `ServiceCommands.gs`;
- locations: `Locations.gs`, `LocationCommands.gs`;
- requests: `Requests.gs`, `RequestCommands.gs`;
- appointments: `AppointmentQueries.gs`, `AppointmentListQueries.gs`, `Appointments.gs`;
- conversation state: `UserStates.gs`, `UserStateCommands.gs`, `Sessions.gs`, `SessionCommands.gs`.

Query modules own reads and caches. Command modules own Sheet mutations. This separation is organizational only: Apps Script still exposes all top-level functions globally.

Only keys declared in `ADMIN_CONFIGURATION_SETTINGS` may be changed through Admin Bot. Infrastructure secrets and integration identifiers are deliberately excluded from this registry.

Security-sensitive configuration validators run before Settings writes. `AdminTelegramIds` is normalized to unique comma-separated numeric IDs, cannot be empty, and must retain the acting administrator.

Boolean configuration values are persisted as native Sheet booleans. `send24hAppointmentReminders()` evaluates `ReminderDayBefore` before any appointment reads or Telegram calls and defaults to enabled when the setting is absent.

Numeric configuration definitions declare inclusive minimum and maximum values in `ConfigurationRegistry`. Cross-setting validation additionally enforces `CalendarCacheDays >= BookingDaysAhead` before either value is written.

Default work hours are configured as a validated pair. Admin Bot accepts only `HH:MM-HH:MM`, requires both values to be valid 24-hour times, and requires the end to be later than the start. Both Settings values are validated before writes. The editor explicitly states that existing provider schedule rows are not changed.

Configuration action labels must remain domain-specific. Generic labels such as "Enable" and "Disable" can collide with location or service commands because stable menu commands are intentionally routed before state handlers.

Configuration states are the exception to general stable-command priority: after Main Menu and Back handling, `AdminCommandRouter` delegates active configuration states before matching domain commands. This prevents stale or customized `Messages` values from routing a configuration action into a location, service, or provider workflow.

The `AdminTelegramIds` Settings value is written with an explicit plain-text cell format. This prevents locale-dependent comma parsing and spreadsheet numeric precision loss from corrupting Telegram IDs or locking every administrator out.

`migrateConfigurationMessages()` is an idempotent deployment migration. It validates the `Messages` columns, appends only missing configuration localization keys, resets the message cache, writes an audit event, and returns a migration summary. Repeated execution does not overwrite existing translations.

### Calendar, availability, and diagnostics

- `Availability.gs` — provider-aware slot calculation;
- `Calendar.gs` — Calendar reads and provider matching;
- `CalendarSynchronization.gs` — synchronization of linked appointments;
- `CalendarEvents.gs`, `CalendarEventQueries.gs` — Calendar event commands and queries;
- `ManualCalendarAppointments.gs` — manual Calendar events shown as occupied provider slots and admin appointments;
- `CalendarCache.gs`, `CalendarCacheCommands.gs` — cache reads and mutations;
- `CalendarCacheBuilders.gs`, `CalendarCacheQueries.gs`, `CalendarCacheSync.gs` — cache row construction, domain queries, and trigger orchestration;
- `Diagnostics.gs` — manual test and deployment-check functions isolated from webhook routing.

### Refactoring safety checks

- `Scripts/validate-project.mjs` checks syntax, duplicate global functions, undefined or duplicated message, sheet-name, state, and menu constants, hardcoded runtime states, hardcoded sheet names, and legacy Owner references;
- `Scripts/verify-function-moves.mjs` compares all global function bodies and top-level `const`, `let`, and `var` declarations with a Git reference;
- mechanical file moves must pass both checks and `git diff --check` before deployment;
- behavior-changing work is isolated from mechanical moves and requires targeted regression after `clasp push`.

## 7. Navigation architecture

### Stable menus

Admin menu identifiers include:

```text
ADMIN_MAIN
ADMIN_APPOINTMENTS
ADMIN_CUSTOMERS
ADMIN_CUSTOMER_CONFLICTS
ADMIN_SETTINGS
ADMIN_PROVIDERS
ADMIN_SERVICES
ADMIN_LOCATIONS
```

Hierarchy:

```text
MAIN
├── APPOINTMENTS
├── CUSTOMERS
└── SETTINGS
    ├── PROVIDERS
    ├── SERVICES
    └── LOCATIONS
```

### Navigation stack

Stored in `UserSessions` as serialized JSON.

Example:

```json
[
  {"menu":"ADMIN_MAIN"},
  {"menu":"ADMIN_SETTINGS"},
  {"menu":"ADMIN_PROVIDERS"}
]
```

Core concepts:

- `getNavigationStack`;
- `saveNavigationStack`;
- `pushNavigation`;
- `trimNavigationToMenu`;
- `getCurrentNavigation`;
- `resetNavigation`.

### Duplicate prevention

`pushNavigation()` must:

- skip pushes in render-only mode;
- tolerate boolean/string values for the flag;
- skip pushing the same current menu twice.

### Render-only mode

Used when a parent menu is displayed after a wizard without adding a duplicate stack entry.

```javascript
setNavigationRenderOnly(chatId, true);
try {
  openAdminMenu(chatId, settings, menu);
} finally {
  setNavigationRenderOnly(chatId, false);
}
```

### Menu registry

```javascript
ADMIN_NAVIGATION_HANDLERS[ADMIN_MENUS.MAIN] = sendAdminMainMenu;
ADMIN_NAVIGATION_HANDLERS[ADMIN_MENUS.SETTINGS] = sendSettingsMenu;
ADMIN_NAVIGATION_HANDLERS[ADMIN_MENUS.PROVIDERS] = sendProvidersMenu;
ADMIN_NAVIGATION_HANDLERS[ADMIN_MENUS.SERVICES] = sendServicesMenu;
ADMIN_NAVIGATION_HANDLERS[ADMIN_MENUS.LOCATIONS] = sendLocationsMenu;
```

Every stable menu must be registered. A missing handler causes fallback to Main.

### Back behavior

Back is processed in two stages:

1. wizard-specific return;
2. generic stack pop.

Expected flows:

```text
Provider wizard → Providers
Providers → Settings
Settings → Main
```

## 8. State machine and sessions

### State

The current interaction step is stored separately from navigation.

Examples:

```text
WAITING_PROVIDER_NAME
WAITING_PROVIDER_LOCATION
WAITING_PROVIDER_PHONE
WAITING_SERVICE_PRICE_MIN
WAITING_LOCATION_NEW_VALUE
WAITING_CUSTOM_DATE
```

### Session

Temporary values include booking data, wizard fields, edit IDs, schedule data, override data, rescheduling data, and navigation metadata.

### Targeted resets

Do not use global session clearing inside wizards if navigation must survive.

Use:

```text
resetProviderWizardSession()
resetServiceWizardSession()
resetLocationWizardSession()
resetAdminWizard()
```

These clear temporary domain data while preserving `navigation_stack`.

## 9. Telegram keyboard architecture

Reply keyboards remain visible until replaced.

Rules:

- selection step → send options keyboard;
- text step → send `buildKeyboardWithMainMenu([])`;
- do not call the keyboard builder separately without passing its result;
- inline keyboards are used for message-specific actions.

Examples of inline actions:

- approve/reject request;
- confirm appointment;
- cancel/reschedule appointment;
- Yes/No confirmation.

Localized confirmation labels use `CONFIRM_YES` and `CONFIRM_NO`.

## 10. Callback architecture

### Client callbacks

`handleClientCallback()` handles customer confirmation and delegates appointment actions.

### Admin callbacks

`handleAdminCallback()` parses callback data such as:

```text
approve_option_1|req_...
reject_request|req_...
```

and delegates to request callback functions.

### Appointment callbacks

`handleAppointmentCallback()` handles:

- calendar event cancel/reschedule;
- appointment cancel/reschedule;
- confirmation dialogs;
- return to appointment card.

### Token correctness

A Telegram message can only be edited by the bot that sent it.

- admin notification → `AdminBotToken`;
- customer message → `ClientBotToken`.

## 11. Localization

`Messages` uses:

```text
key | uk | ru | en
```

Code uses:

```javascript
getMessage(MESSAGE_KEYS.KEY)
```

Dynamic entities can also use message keys, for example location names and addresses.

The target is zero hardcoded UI text.

## 12. Settings and caches

### Settings

`getSettings()` reads key/value rows and stores an in-memory object in `SETTINGS_CACHE`.

The in-memory cache is guarded by a shared `SETTINGS_CACHE_VERSION` value in Script Properties. Every runtime instance compares its local version before returning cached settings. Settings writes replace the shared version with a UUID, forcing all warm Apps Script instances to reload the Sheet on their next settings read.

Settings keys are trimmed when read. A command that finds a key containing leading or trailing whitespace rewrites column A with the canonical key before updating its value. This prevents visually identical Sheet keys such as `CalendarCacheDays ` from silently falling back to defaults.

Typical settings:

```text
BusinessName
Language
Currency
TimeZone
ClientBotToken
AdminBotToken
AdminTelegramIds
AppsScriptUrl
DefaultCalendarId
DefaultWorkStartTime
DefaultWorkEndTime
BookingDaysAhead
CalendarCacheDays
ReminderDayBefore
```

The Settings module should automatically reset the cache after updates.

`DefaultWorkStartTime` and `DefaultWorkEndTime` are active schedule defaults. Provider creation uses them for every weekday, and enabling an existing schedule day uses them when stored times are missing. Admin Bot edits them as one interval while preserving all existing provider schedule rows.

`BusinessName` is reserved metadata and currently has no runtime consumer. It is retained for future branding and multi-template work, but should not be exposed in Admin Bot before a visible use is implemented.

### Runtime caches

Known caches:

```text
SETTINGS_CACHE
MESSAGES_CACHE
LOCATIONS_CACHE
CALENDAR_CACHE
```

### Location API

```text
getActiveLocations()
getAllLocations()
getLocations()  // compatibility alias
```

### Cache invalidation

Writes must invalidate relevant caches:

- location write → locations cache;
- message write → messages cache;
- setting write → settings cache;
- appointment/calendar write → calendar cache.

## 13. Calendar architecture

### Appointment creation

```text
Approved request
→ Appointments row
→ Google Calendar event
→ CalendarCache refresh
```

### Synchronization

`syncAppointmentWithCalendar()` validates appointment/calendar consistency.

### Manual calendar events

Normalized with:

```text
source = calendar_manual
```

and shown with a marker in Admin Bot.

Manual events remain Calendar-only records and are not mirrored into `Appointments`. They occupy a slot only in the provider calendar containing the event; calendars of other providers remain available for the same interval.

Admin Bot extracts any available customer, phone, service, provider, location, and comment values from the localized structured Calendar description. Missing values do not prevent the event from occupying the slot or appearing in appointment lists. Calendar ownership, rather than a provider label in the description, determines which provider is busy.

Manual events do not enter Client Bot confirmation, reminder, cancellation, or rescheduling flows.

Planned synchronization will process an ended manual event with a valid phone number as a completed visit. It will upsert `CustomerProfiles` and visit history idempotently, even if other customer details are missing.

### Cancellation/rescheduling

Flows update Sheets, Calendar, cache, session, and Telegram messages.

## 14. Request processing

### Request creation

The Client Bot writes a `Requests` row plus several `RequestOptions`.

### Approval

`processRequestApproveOption()`:

1. parses selected priority;
2. loads request/option;
3. prevents duplicate appointment creation;
4. creates appointment;
5. creates calendar event;
6. updates statuses;
7. edits admin message;
8. notifies customer.

### Rejection

`processRequestReject()` updates statuses, edits the admin message, and notifies the customer.

## 15. Notifications

Admin recipients come from `RequestRecipients`.

Current eligibility:

```text
active = TRUE
receive_new_requests = TRUE
telegram_id exists
```

Customer confirmation notifications can reuse the same recipient mechanism.

## 16. Duplicate update protection

Telegram may retry updates.

SmartFlow checks:

```text
update_id + bot_type
```

before executing business logic.

This is essential for approve/reject/cancel/reschedule/confirm operations.

## 17. Logging and error handling

Top-level webhook errors are written to `AuditLog`.

Examples:

```text
DOPOST_ERROR
ADMIN_CALLBACK
APPROVE_OPTION_DEBUG
ADMIN_BACK_STACK_DEBUG
```

Temporary debugging events should be removed after fixes.

Telegram helpers should expose failed API responses even when `muteHttpExceptions` is enabled.


## 18. Security

- restrict Admin Bot by Telegram ID;
- never commit bot tokens;
- keep production Sheets private;
- use placeholders in templates;
- rotate leaked tokens;
- configure web app permissions carefully;
- avoid exposing customer data in logs.

Refactoring priority is security first, followed by preservation of current behavior and separation of responsibilities. Schema fields are not changed until their production meaning is explicitly established. Structural changes must be incremental, reviewable, and reversible.

## 19. Extension points

Future extensions:

- Telegram Web App;
- provider-specific interface;
- roles and permissions;
- analytics/reports;
- payments;
- inventory;
- loyalty/subscriptions;
- additional business templates;
- automated installer.

## 20. Remaining architectural work

- complete Settings CRUD;
- centralize cache invalidation;
- split remaining large functions;
- remove remaining hardcoded strings;
- migrate historical `OWNER_*` storage keys in the `Messages` sheet to `ADMIN_*`; code identifiers and notification paths already use Admin terminology;
- standardize CRUD helpers;
- formalize date/time parsing;
- add navigation/state tests;
- document triggers and deployment.
