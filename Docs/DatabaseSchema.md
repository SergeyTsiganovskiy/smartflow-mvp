# Database Schema

## Settings

Stores global configuration.

Typical fields:

```text
Key
Value
```

Important keys:

```text
ClientBotToken
OwnerTelegramId
Language
TimeZone
Currency
```

---

## Messages

Stores localized bot messages.

```text
message_key
uk
ru
en
```

Used through:

```javascript
getMessage(MESSAGE_KEYS.KEY)
```

---

## Locations

```text
location_id
name_uk
name_ru
name_en
address
active
```

Purpose:

Stores salon branches.

---

## Services

```text
service_id
name_uk
name_ru
name_en
default_duration_minutes
base_price
active
```

Purpose:

Stores default service settings.

`default_duration_minutes` is used when no individual duration exists.

`base_price` is used when no individual price exists.

---

## Providers

```text
provider_id
location_id
name_uk
name_ru
name_en
phone
telegram_id
calendar_id
active
```

Purpose:

Stores providers/masters.

For MVP all providers may use the same shared calendar:

```text
primary
```

---

## ProviderSchedule

```text
provider_id
provider_name
day_of_week
start_time
end_time
is_working
notes
```

Allowed `day_of_week` values:

```text
MON
TUE
WED
THU
FRI
SAT
SUN
```

Purpose:

Default weekly schedule for each provider.

`provider_name` is duplicated for human readability.

---

## ProviderScheduleOverrides

```text
provider_id
provider_name
date
start_time
end_time
is_working
notes
```

Purpose:

Overrides weekly schedule for specific dates.

Examples:

```text
day off
short day
extra working day
vacation
holiday
```

Date format should preferably be:

```text
YYYY-MM-DD
```

The code also normalizes common date formats.

---

## Customers

```text
customer_id
telegram_id
name
phone
language
created_at
updated_at
last_visit_at
status
notes
```

Statuses:

```text
lead
confirmed
```

Purpose:

Stores customers.

Phone is the main lookup key.

Telegram ID is used only as a communication channel when available.

---

## CustomerServiceSettings

```text
customer_id
customer_name
phone
service_id
service_name
provider_id
provider_name
duration_minutes
price
updated_at
notes
```

Purpose:

Stores individual customer settings for a specific service and provider.

Examples:

```text
Customer A + Coloring + Marina = 240 minutes
Customer B + Coloring + Marina = 180 minutes
```

Human-readable columns are duplicated intentionally.

Duration priority:

```text
CustomerServiceSettings.duration_minutes
↓
Services.default_duration_minutes
```

Price priority:

```text
CustomerServiceSettings.price
↓
Services.base_price
```

---

## Requests

```text
request_id
customer_id
service_id
provider_id
location_id
status
created_at
```

Statuses:

```text
pending
confirmed
rejected
```

Purpose:

Stores booking requests before they become appointments.

---

## RequestOptions

```text
option_id
request_id
preferred_date
preferred_time
priority
status
created_at
```

Statuses:

```text
pending
approved
rejected
```

Purpose:

Stores client preferred time options.

A request can have up to 3 options.

---

## Appointments

```text
appointment_id
request_id
customer_id
service_id
provider_id
location_id
start_at
end_at
status
calendar_event_id
created_at
updated_at
```

Statuses:

```text
confirmed
cancelled
completed
no_show
```

Purpose:

Stores confirmed appointments.

`calendar_event_id` links the Appointment to Google Calendar.

When appointment is cancelled:

```text
status = cancelled
calendar event is deleted
```

When appointment is rescheduled:

```text
start_at updated
end_at updated
calendar event updated
```

---

## UserSessions

```text
telegram_id
location_id
service_id
provider_id
reschedule_appointment_id
pending_calendar_event_id
option_count
current_option_date
current_option_time
option1_date
option1_time
option2_date
option2_time
option3_date
option3_time
reschedule_date
reschedule_time
customer_name
customer_phone
updated_at
```

Purpose:

Stores temporary user state and flow data.

Used for:

- booking flow
- My appointments phone retry
- appointment reschedule
- manual Calendar event cancellation
- manual Calendar event reschedule

Important temporary fields:

```text
reschedule_appointment_id
pending_calendar_event_id
reschedule_date
reschedule_time
```

---

## AuditLog

```text
created_at
event
details
```

Purpose:

Debugging and operational visibility.

Temporary debug logs should be removed or reduced before production use.

---

## Manual Google Calendar Event Format

Recommended event title:

```text
Haircut
```

Recommended description:

```text
Customer: Anna
Phone: 0664452124
Service: Haircut
Provider: Alice
Location: Center
```

Minimum required for lookup:

```text
Phone: 0664452124
```

Manual Calendar events are not stored in Appointments unless created through the bot.

They are handled directly by `calendar_event_id`.

---

## Phone Normalization

Input examples:

```text
0664452124
380664452124
+380 66 445 21 24
```

The system normalizes phone numbers and searches by significant trailing digits.

---

## Callback Actions

Main callback actions:

```text
approve_option_1|request_id
approve_option_2|request_id
approve_option_3|request_id
reject_request|request_id

cancel_appointment|appointment_id
confirm_cancel|appointment_id
back_to_appointment|appointment_id

reschedule_appointment|appointment_id
confirm_reschedule|appointment_id

cancel_calendar_event|calendar_event_id
confirm_cancel_calendar_event
back_to_calendar_event

reschedule_calendar_event|calendar_event_id
confirm_reschedule_calendar_event
```

Long Calendar event IDs are stored in UserSessions as:

```text
pending_calendar_event_id
```

because Telegram callback data has a length limit.