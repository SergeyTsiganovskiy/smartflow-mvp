# Database Schema

## Settings

Stores global configuration.

```text
Key
Value

Important keys:

ClientBotToken
OwnerTelegramId
Language
TimeZone
Currency
Messages

Stores localized text.

message_key
uk
ru
en

Used through:

getMessage(MESSAGE_KEYS.KEY)

Examples:

START
MAIN_MENU
MAIN_MENU_TEXT
BOOK
MY_APPOINTMENTS
CONTACTS
LOCATION_CENTER_NAME
LOCATION_CENTER_ADDRESS
Locations

Stores technical location data.

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

Example:

loc_001
LOCATION_CENTER_NAME
LOCATION_CENTER_ADDRESS
Пн-Сб 09:00-18:00
instagram.com/alice_hair_hub
@alice_hair_hub
https://example.com
https://maps.google.com/...
380000000001
380000000002
TRUE

Localized name and address are stored in Messages.

Services
service_id
name_uk
name_ru
name_en
default_duration_minutes
base_price
active

Purpose:

Stores service defaults.

default_duration_minutes is used if no individual customer duration exists.

Providers
provider_id
location_id
name_uk
name_ru
name_en
phone
telegram_id
calendar_id
active

Purpose:

Stores providers/masters.

For MVP, multiple providers may use the same shared calendar.

ProviderSchedule
provider_id
provider_name
day_of_week
start_time
end_time
is_working
notes

Allowed day values:

MON
TUE
WED
THU
FRI
SAT
SUN

Purpose:

Default weekly schedule for each provider.

ProviderScheduleOverrides
provider_id
provider_name
date
start_time
end_time
is_working
notes

Purpose:

Overrides default weekly schedule for specific dates.

Examples:

day off
vacation
short day
extra working day
holiday

ProviderExceptions is not used.

Customers
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

Statuses:

lead
confirmed

Phone is the main lookup key.

Telegram ID is used for notifications and reminders when available.

CustomerServiceSettings
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

Purpose:

Stores individual customer settings for a specific service and provider.

Duration priority:

CustomerServiceSettings.duration_minutes
↓
Services.default_duration_minutes

Price priority:

CustomerServiceSettings.price
↓
Services.base_price

Lookup key:

customer_id + service_id + provider_id
CustomerConflicts
customer_id
conflict_customer_id
active
notes

Purpose:

Prevents conflicting customers from being present at the same time.

Store both directions:

cust_001 | cust_005 | TRUE
cust_005 | cust_001 | TRUE

When customer cust_001 books, appointments of cust_005 block available slots.

This rule works salon-wide, regardless of provider.

Requests
request_id
customer_id
service_id
provider_id
location_id
customer_note
status
created_at

Statuses:

pending
confirmed
rejected

Purpose:

Stores booking requests before approval.

RequestOptions
option_id
request_id
preferred_date
preferred_time
priority
status
created_at

Statuses:

pending
approved
rejected

A request can have up to 3 preferred time options.

Appointments
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

Statuses:

confirmed
cancelled
completed
no_show

Purpose:

Stores confirmed appointments.

calendar_event_id links Appointment to Google Calendar.

When appointment is cancelled:

status = cancelled
calendar event is deleted

When appointment is rescheduled:

start_at updated
end_at updated
calendar event updated
reminder_24h_sent_at reset
UserSessions
telegram_id
customer_id
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
customer_note
updated_at

Purpose:

Temporary user state and flow data.

Used for:

booking
customer lookup
individual duration
My appointments
cancellation
reschedule
manual Calendar event actions
AuditLog
created_at
event
details

Purpose:

Debugging and operational visibility.

Temporary debug logs should be reduced before production.

Manual Google Calendar Event Format

Recommended event title:

Haircut — Anna

Recommended description:

Customer: Anna
Phone: 0664452124
Service: Haircut
Provider: Alice
Location: Center
Note: -

Minimum required for lookup:

Phone: 0664452124

Manual Calendar events are not stored in Appointments unless created by the bot.

Phone Normalization

Supported input examples:

0664452124
380664452124
+380 66 445 21 24

Search uses normalized phone digits.

Callback Actions
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

Long Calendar event IDs are stored in UserSessions:

pending_calendar_event_id

because Telegram callback data has a length limit.

Removed / Not Used
Any Provider
ProviderExceptions
ClientConflicts
START_BUTTON

Current names:

CustomerConflicts
MAIN_MENU