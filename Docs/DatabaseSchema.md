# DatabaseSchema.md

# SmartFlow Beauty Demo Database Schema

## Settings

Global application settings.

### Columns

```text
key
value
```

### Examples

```text
ClientBotToken
OwnerTelegramId
Language
TimeZone
```

---

# Messages

Localization table.

All user-facing text is stored here.

### Columns

```text
message_key
uk
ru
en
```

### Examples

```text
START
BOOK
MY_APPOINTMENTS
CONTACTS
MAIN_MENU
CALENDAR_CUSTOMER
CALENDAR_PHONE
CALENDAR_SERVICE
CALENDAR_PROVIDER
CALENDAR_LOCATION
CALENDAR_NOTE
```

---

# Locations

Business locations.

### Columns

```text
location_id
name_key
address_key
working_hours
instagram
telegram
website
google_maps_url
phone_1
phone_2
active
```

### Example

```text
loc_001
LOCATION_001_NAME
LOCATION_001_ADDRESS
Пн-Сб 09:00-18:00
instagram.com/alice
@alice
https://site.com
https://maps.google.com/...
380000000001
380000000002
TRUE
```

Localized values are retrieved through Messages.

---

# Services

Services offered by the salon.

### Columns

```text
service_id
name_uk
name_ru
name_en
default_duration_minutes
base_price
active
```

### Example

```text
serv_001
Стрижка
Стрижка
Haircut
60
500
TRUE
```

---

# Providers

Salon masters.

### Columns

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

### Example

```text
prov_001
loc_001
Аліса
Алиса
Alice
380000000001
123456789
calendar@gmail.com
TRUE
```

---

# ProviderSchedule

Weekly schedule.

### Columns

```text
provider_id
provider_name
day_of_week
start_time
end_time
is_working
notes
```

### Example

```text
prov_001
Алиса
MON
09:00
18:00
TRUE
-
```

### Allowed Days

```text
MON
TUE
WED
THU
FRI
SAT
SUN
```

---

# ProviderScheduleOverrides

Date-specific schedule overrides.

### Columns

```text
provider_id
provider_name
date
start_time
end_time
is_working
notes
```

### Examples

```text
Vacation
Holiday
Day Off
Extra Working Day
Short Day
```

Priority:

```text
Override
↓
ProviderSchedule
```

---

# Customers

Customer directory.

### Columns

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

### Statuses

```text
lead
confirmed
```

### Example

```text
cust_001
123456789
Иван
0661234567
ru
...
confirmed
VIP
```

Primary lookup:

```text
phone
```

---

# CustomerServiceSettings

Individual customer settings.

### Purpose

Override service duration and price for a specific customer.

### Columns

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

### Lookup Key

```text
customer_id
+
service_id
+
provider_id
```

### Duration Priority

```text
CustomerServiceSettings.duration_minutes
↓
Services.default_duration_minutes
```

### Price Priority

```text
CustomerServiceSettings.price
↓
Services.base_price
```

### Example

```text
cust_001
Иван
0661234567
serv_001
Стрижка
prov_001
Алиса
90
700
...
VIP
```

---

# CustomerConflicts

Customers that must not overlap in the salon.

### Columns

```text
customer_id
conflict_customer_id
active
notes
```

### Example

```text
cust_001
cust_005
TRUE
Не пересекать
```

And reverse:

```text
cust_005
cust_001
TRUE
Не пересекать
```

### Behavior

When customer A books:

```text
Appointments of customer B
also block availability
```

Conflict works salon-wide.

---

# Requests

Booking requests awaiting approval.

### Columns

```text
request_id
customer_id
service_id
provider_id
location_id
customer_note
status
created_at
```

### Statuses

```text
pending
confirmed
rejected
```

---

# RequestOptions

Preferred appointment options.

### Columns

```text
option_id
request_id
preferred_date
preferred_time
priority
status
created_at
```

### Statuses

```text
pending
approved
rejected
```

### Example

```text
option_001
req_001
2026-06-20
10:00
1
pending
...
```

Maximum:

```text
3 options per request
```

---

# Appointments

Confirmed appointments.

### Columns

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
customer_note
reminder_24h_sent_at
```

### Statuses

```text
confirmed
cancelled
completed
no_show
```

### Example

```text
appt_001
req_001
cust_001
serv_001
prov_001
loc_001
2026-06-20 10:00
2026-06-20 11:00
confirmed
calendar_event_id
...
```

---

# UserSessions

Temporary Telegram state storage.

### Columns

```text
telegram_id
state
customer_id
customer_name
customer_phone

location_id
service_id
provider_id

current_option_date
current_option_time

option_count

option1_date
option1_time

option2_date
option2_time

option3_date
option3_time

customer_note

reschedule_appointment_id
pending_calendar_event_id

reschedule_date
reschedule_time

updated_at
```

### Purpose

Stores active Telegram conversations.

Used for:

```text
Booking
My Appointments
Reschedule
Cancellation
Calendar Operations
```

---

# AuditLog

System log.

### Columns

```text
created_at
event
details
```

### Examples

```text
AVAILABLE_SLOTS
TIME_OPTIONS_DURATION
PROVIDER_APPOINTMENTS
SLOTS_DEBUG_FULL
REQUEST_CREATED
CALENDAR_SYNC
```

Used for debugging and investigations.

---

# Google Calendar Event Format

### Event Title

```text
Haircut — Ivan
```

### Event Description

Localized block:

```text
Клиент: Иван
Телефон: 0661234567
Услуга: Стрижка
Мастер: Алиса
Локация: Центр
Комментарий: VIP
```

Technical block:

```text
[TECH]
appointment_id=appt_001
```

### Purpose

System uses only:

```text
appointment_id
```

for all technical operations.

The visible localized section is never parsed.

---

# Availability Sources

Availability calculation uses:

```text
ProviderSchedule
ProviderScheduleOverrides
Appointments
CustomerServiceSettings
CustomerConflicts
```

### Excluded

Not used:

```text
Google Calendar Busy Time
ProviderExceptions
Any Provider
```

---

# Current Stable Version

```text
ClientBot v1 Stable
```
