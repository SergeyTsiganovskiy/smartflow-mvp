# SmartFlow Database Schema

## 1. Overview

SmartFlow uses Google Sheets as its database and configuration store. Each logical table is a worksheet.

Conventions:

- IDs are strings such as `loc_001`, `prov_001`, `srv_001`, `req_...`, `appt_...`;
- timestamps are Google Sheets dates or ISO-compatible date-time values;
- booleans may appear as `TRUE/FALSE` or boolean values;
- entity names and addresses are stored directly in their domain sheets;
- inactive rows are retained instead of deleted.

## 2. Relationship overview

```text
Locations
├── Providers
│   ├── ProviderSchedules
│   ├── ProviderOverrides
│   └── Appointments
├── Services
└── Appointments

Customers
├── Requests
│   └── RequestOptions
├── Appointments
├── CustomerConflicts
└── CustomerServiceSettings

Appointments
└── Google Calendar

UserStates + UserSessions
└── Telegram interaction state
```

## 3. Settings

Purpose: global installation configuration.

| Column | Type | Description |
|---|---|---|
| `key` | String | Unique setting name |
| `value` | Any | Setting value |

Known keys:

```text
Language
TimeZone
AdminTelegramIds
AppsScriptUrl
DefaultCalendarId
DefaultWorkStartTime
DefaultWorkEndTime
ReminderDayBefore
BookingDaysAhead
PaginationPageSize

Bot tokens are not Settings rows. Runtime secrets are stored only in Script Properties as `SMARTFLOW_CLIENT_BOT_TOKEN` and `SMARTFLOW_ADMIN_BOT_TOKEN`; `getSettings()` overlays those values without exposing the property names to normal configuration workflows. Existing installations first run `migrateBotTokensToScriptProperties()` and then `migrateRemoveLegacyBotTokenSettings()`.

Admin Bot configuration writes are restricted by an application-level allowlist. Infrastructure secrets are managed only through Script Properties and are never configurable through bot UI. Updating a normal setting invalidates the in-memory Settings cache immediately.

`AdminTelegramIds` must be stored as plain text. Comma-separated Telegram IDs must never be stored as a numeric value because spreadsheet locale parsing and numeric precision can corrupt the list.

`DefaultWorkStartTime` and `DefaultWorkEndTime` are active defaults used when a provider schedule is created and when an existing schedule day is enabled without usable times. Admin Bot validates and updates them together, but the update does not modify existing `ProviderSchedule` rows.

`PaginationPageSize` controls every paginated Admin Bot view. Valid values are
integers from 1 to 10; missing or invalid values safely fall back to 5.

Financial and branding metadata are intentionally absent from Settings. The application does not store prices or currency.
```

Notes:

- settings are cached;
- reset cache after updates;
- never commit production values.

## 4. Messages

Purpose: localization of static user-interface text.

| Column | Type | Description |
|---|---|---|
| `key` | String | Unique key |
| `uk` | String | Ukrainian |
| `ru` | String | Russian |
| `en` | String | English |

Business entity values do not belong in this sheet.

## 5. UserStates

Purpose: current state-machine state for each Telegram user/chat.

| Column | Type | Description |
|---|---|---|
| `telegram_id` | String/Number | Chat/user ID |
| `state` | String | Current state |
| `updated_at` | DateTime | Last change |

Examples:

```text
WAITING_LOCATION
WAITING_SERVICE
WAITING_PROVIDER_NAME
WAITING_SERVICE_DURATION_MIN
WAITING_LOCATION_NEW_VALUE
```

## 6. UserSessions

Purpose: temporary wizard data, navigation, and interaction context.

Physical columns:

```text
telegram_id
session_data
updated_at
```

`session_data` is serialized JSON. All fields below are JSON properties, not
physical Sheet columns.

Navigation fields include `navigation_stack`, `navigation_render_only`,
`previous_menu`, and `admin_back_menu`.

Booking fields:

```text
location_id
service_id
provider_id
option_count
current_option_date
current_option_time
option1_date / option1_time
option2_date / option2_time
option3_date / option3_time
customer_name
customer_phone
customer_note
```

Provider fields:

```text
provider_name
provider_location_id
provider_phone
edit_provider_id
edit_provider_field
schedule_provider_id
schedule_day_code
override_provider_id
override_reason_key
override_date
override_start_time
override_end_time
```

Service fields:

```text
service_name
service_location_id
service_duration_min
service_duration_max
edit_service_id
edit_service_field
```

Location fields:

```text
location_name
location_address
location_phone
edit_location_id
edit_location_field
```

Appointment fields:

```text
reschedule_appointment_id
reschedule_date
reschedule_time
```

Customer/conflict fields may include:

```text
customer_id
customer_name
customer_phone
customer_note
customer_service_customer_id
customer_service_phone
customer_service_service_id
conflict_main_phone
conflict_main_phone_key
conflict_main_customer_name
delete_conflict_main_phone
delete_conflict_main_phone_key
delete_conflict_main_customer_name
```

## 7. Customers

Purpose: registered customers.

| Column | Type | Description |
|---|---|---|
| `customer_id` | String | Primary ID |
| `telegram_id` | String/Number | Telegram ID |
| `name` | String | Name |
| `phone` | String | Normalized phone |
| `language` | String | Preferred language |
| `status` | String | Optional lifecycle status |
| `active` | Boolean | Optional active flag |
| `created_at` | DateTime | Created |
| `updated_at` | DateTime | Updated |
| `last_visit_at` | DateTime | Last visit |
| `notes` | String | Internal notes |

Relationships: Requests, Appointments, Conflicts, CustomerServiceSettings.

## 8. Locations

Purpose: business branches.

Current columns:

| Column | Type | Description |
|---|---|---|
| `location_id` | String | Primary ID |
| `name` | String | Location name |
| `address` | String | Location address |
| `working_hours` | String | Human-readable hours |
| `instagram` | String | Instagram |
| `telegram` | String | Telegram |
| `website` | String | Website |
| `google_maps_url` | String | Maps URL |
| `phone_1` | String | Primary phone |
| `phone_2` | String | Secondary phone |
| `active` | Boolean | Active flag |

Example:

```text
loc_001 | Alice Hair Hub | Kyiv, Main Street 1 |
Пн-Сб 09:00-18:00 | instagram.com/... | @... |
https://... | https://maps.google.com/... |
380000000001 | 380000000002 | TRUE
```

## 9. Providers

Purpose: staff/providers.

| Column | Type | Description |
|---|---|---|
| `provider_id` | String | Primary ID |
| `location_id` | String | Location |
| `name` | String | Provider name |
| `phone` | String | Phone |
| `telegram_id` | String/Number | Optional Telegram ID |
| `calendar_id` | String | Optional calendar |
| `active` | Boolean | Active flag |

## 10. ProviderSchedules

Purpose: recurring weekly provider schedule.

| Column | Type | Description |
|---|---|---|
| `provider_id` | String | Provider |
| `name` | String | Optional display name |
| `day` | String | `MON`..`SUN` |
| `start` | Time | Start |
| `end` | Time | End |
| `active` | Boolean | Works this day |

## 11. ProviderOverrides

Purpose: one-time schedule exceptions.

Typical columns:

| Column | Type | Description |
|---|---|---|
| `override_id` | String | Primary ID |
| `provider_id` | String | Provider |
| `date` | Date | Date |
| `start_time` | Time | Optional start |
| `end_time` | Time | Optional end |
| `reason_key` | String | Localized reason |
| `active` | Boolean | Active |
| `created_at` | DateTime | Created |

## 12. Services

Purpose: business services.

| Column | Type | Description |
|---|---|---|
| `service_id` | String | Primary ID |
| `location_id` | String | Location |
| `name` | String | Service name |
| `duration_min` | Number | Min minutes |
| `duration_max` | Number | Max minutes |
| `active` | Boolean | Active |

## 13. CustomerServiceSettings

Purpose: customer-specific service duration overrides.

Typical columns:

| Column | Type | Description |
|---|---|---|
| `profile_id` | String | Customer profile |
| `phone` | String | Customer phone |
| `phone_key` | String | Normalized phone lookup key |
| `customer_name` | String | Customer name snapshot |
| `service_id` | String | Service |
| `service_name` | String | Service name snapshot |
| `duration_minutes` | Number | Customer-specific duration |
| `updated_at` | DateTime | Updated |
| `notes` | String | Optional notes |

Price and currency fields are intentionally excluded from the schema.

## 14. Requests

Purpose: booking requests before approval.

| Column | Type | Description |
|---|---|---|
| `request_id` | String | Primary ID |
| `customer_id` | String | Customer |
| `location_id` | String | Location |
| `service_id` | String | Service |
| `provider_id` | String | Provider/any provider |
| `status` | String | Request status |
| `created_at` | DateTime | Created |
| `updated_at` | DateTime | Updated |

Typical statuses: `pending`, `confirmed`, `rejected`, `cancelled`.

## 15. RequestOptions

Purpose: multiple proposed date/time choices.

| Column | Type | Description |
|---|---|---|
| `option_id` | String | Primary ID |
| `request_id` | String | Request |
| `option_number` | Number | Order |
| `date` / `preferred_date` | Date | Date |
| `period` | String | Optional period |
| `time` / `preferred_time` | Time | Time |
| `priority` | Number/Boolean | Preferred option |
| `status` | String | Pending/selected/rejected |

The final template should standardize the date/time column names.

## 16. Appointments

Purpose: confirmed bookings.

| Column | Type | Description |
|---|---|---|
| `appointment_id` | String | Primary ID |
| `request_id` | String | Source request |
| `customer_id` | String | Customer |
| `location_id` | String | Location |
| `service_id` | String | Service |
| `provider_id` | String | Provider |
| `start_at` | DateTime | Start |
| `end_at` | DateTime | End |
| `status` | String | Status |
| `calendar_event_id` | String | Google event |
| `customer_note` | String | Note |
| `reminder_24h_sent_at` | DateTime | Reminder sent |
| `reminder_2h_sent_at` | DateTime | Optional reminder |
| `customer_confirmed` | Boolean | Confirmed by customer |
| `customer_confirmed_at` | DateTime | Confirmation time |
| `created_at` | DateTime | Created |
| `updated_at` | DateTime | Updated |

The reminder and customer-confirmation fields are cleared whenever `start_at` or
`end_at` changes, including client rescheduling and Calendar synchronization.

## 17. CustomerConflicts

Purpose: duplicate/related customer identity conflicts.

Typical columns:

| Column | Type | Description |
|---|---|---|
| `conflict_id` | String | Primary ID |
| `main_customer_id` | String | Main customer |
| `conflicting_customer_id` | String | Related customer |
| `main_phone` | String | Canonical phone |
| `conflicting_phone` | String | Alternate phone |
| `status` | String | Active/resolved |
| `created_at` | DateTime | Created |
| `updated_at` | DateTime | Updated |

Exact columns should be verified.

## 18. RequestRecipients

Purpose: admin notification routing.

| Column | Type | Description |
|---|---|---|
| `telegram_id` | String/Number | Recipient |
| `active` | Boolean | Enabled |
| `receive_new_requests` | Boolean | Receives new requests |
| `name` | String | Optional name |
| `role` | String | Optional future role |
| `receive_confirmations` | Boolean | Optional future flag |

Current selection rule:

```text
active = TRUE
receive_new_requests = TRUE
telegram_id exists
```

All IDs from Settings `AdminTelegramIds` are automatic notification recipients.
Active `RequestRecipients` rows are additional recipients; the final list is
deduplicated by Telegram ID. Only current administrators may execute Admin Bot
callback actions even when another recipient can see a notification.

## 19. AuditLog

Purpose: operational/debug logging.

Typical columns:

| Column | Type | Description |
|---|---|---|
| `timestamp` | DateTime | Event time |
| `action` | String | Event type |
| `details` | String/JSON | Context |

Examples:

```text
DOPOST_ERROR
ADMIN_CALLBACK
APPROVE_OPTION_DEBUG
ADMIN_BACK_STACK_DEBUG
```

## 20. Telegram update history

Processed Telegram update IDs are not stored in a worksheet. Client and Admin Bot
use separate bounded JSON histories in Apps Script Properties. Each compact entry
contains the exact `update_id` and processing timestamp. The ID is written only
after successful business handling; the script lock prevents concurrent delivery
of the same update from executing twice.

The history keeps up to 250 entries from the previous seven days. The former
single `CLIENT_LAST_UPDATE_ID` / `ADMIN_LAST_UPDATE_ID` values are migrated
automatically on first use and then removed.

## 21. Schema conventions

### IDs

Current prefixed IDs:

```text
loc_001
prov_001
srv_003
req_...
appt_...
```

For production, avoid relying only on row count. Prefer UUID or timestamp-plus-random suffix.

### Phones

Store as strings to preserve `+`, leading zeros, and exact formatting.

### Date/time

Use real Sheets date/time values and standardize time-zone handling.

### Booleans

Use real booleans, but readers should tolerate `TRUE`, `true`, and boolean `true`.

### Soft deletion

Use `active = FALSE` for entities instead of deleting rows.

### Localization

Use message keys only for static user-interface text. Store entity names and
addresses directly in `Locations`, `Providers`, and `Services`.

### Performance

Google Sheets has no indexes. Use batch reads, maps keyed by ID, and caches for frequently accessed data.

## 22. Items to verify before release

- exact Requests column order;
- exact RequestOptions date/time names;
- final Customers status fields;
- CustomerConflicts schema;
- customer-specific services sheet name;
- ProviderOverrides sheet name and columns;
- Telegram update history retention and Script Properties capacity;
- final reminder columns;
- final AuditLog columns.

This document describes the logical schema known from the implemented application. The production spreadsheet template should become the final authoritative schema source.
