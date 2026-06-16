# SmartFlow Beauty Demo Architecture

## Overview

SmartFlow Beauty Demo is a Telegram-based booking system for a beauty salon.

The system uses:

- Client Telegram Bot for customers
- Telegram inline buttons for appointment actions
- Google Sheets as the main database
- Google Calendar as a shared salon calendar
- Google Apps Script as backend

---

## Main Components

### ClientBot

ClientBot is used by customers to:

- create booking requests
- enter name and phone before selecting service/time
- select location, service, provider, date and time
- add customer note
- view active appointments by phone
- cancel appointments
- reschedule appointments
- view contacts
- receive appointment reminders

Main menu:

- Book
- My appointments
- Contacts
- Main menu

The bot always provides a Main menu button in normal reply keyboards.

---

### Google Sheets

Google Sheets is the primary structured database.

Main sheets:

- Settings
- Messages
- Locations
- Services
- Providers
- ProviderSchedule
- ProviderScheduleOverrides
- Customers
- CustomerServiceSettings
- CustomerConflicts
- Requests
- RequestOptions
- Appointments
- UserSessions
- AuditLog

---

### Google Calendar

Google Calendar is used as a shared salon calendar.

Current model:

- one shared salon calendar
- all providers may use the same calendar
- bot-created appointments are written to Google Calendar
- `calendar_event_id` is stored in Appointments
- manual Calendar events can be shown in My appointments
- manual Calendar events can be cancelled and rescheduled from the bot

Google Calendar is also used as a source of truth for actual appointment time if a master manually moves the event.

---

## Booking Flow

```text
Main menu
↓
Book
↓
Customer name
↓
Customer phone
↓
Location
↓
Service
↓
Provider
↓
Date
↓
Time
↓
Optional additional time options
↓
Customer note
↓
Request created
↓
Owner notified

Phone and name are collected before availability calculation so the system can use customer-specific rules.

Owner Approval Flow
Owner receives request
↓
Owner approves one selected option
↓
Appointment is created
↓
Google Calendar event is created
↓
Request and RequestOptions are updated
↓
Customer is notified with confirmed date/time

Customer confirmation message includes:

date and time
service
provider
location
Availability Engine

Availability is calculated using:

ProviderSchedule
ProviderScheduleOverrides
Service duration
CustomerServiceSettings duration override
Confirmed Appointments of the selected provider
CustomerConflicts blocking rules
Current time filtering for today

Availability does not use shared Calendar busy slots globally, because one shared calendar may contain appointments for different providers.

Provider Schedule

Default schedule is stored in:

ProviderSchedule

Date-specific overrides are stored in:

ProviderScheduleOverrides

ProviderExceptions is not used.

Customer-Specific Duration

The system supports individual service duration for a specific customer, service and provider.

Priority:

CustomerServiceSettings.duration_minutes
↓
Services.default_duration_minutes

The lookup is based on:

customer_id + service_id + provider_id
Customer Conflicts

Some customers should not be present in the salon at the same time.

These rules are stored in:

CustomerConflicts

If customer A conflicts with customer B, appointments of customer B block available slots for customer A, regardless of provider.

Pairs are stored in both directions:

A → B
B → A
My Appointments

Client flow:

My appointments
↓
Enter phone
↓
Search Appointments
↓
Search manual Google Calendar events
↓
Show active records

Bot-created appointments are shown from Appointments.

Manual Google Calendar events are shown only if they are not already linked to an Appointment by calendar_event_id.

When My appointments is opened, bot-created appointments are synchronized with Google Calendar. If a master manually moved an event in Calendar, Appointments.start_at and Appointments.end_at are updated.

Manual Google Calendar Events

Recommended event description:

Customer: Anna
Phone: 0664452124
Service: Haircut
Provider: Alice
Location: Center
Note: -

Minimum required field for lookup:

Phone: 0664452124

Manual Calendar events can be:

viewed
cancelled
rescheduled

They are handled directly by calendar_event_id.

Cancellation Flow

For bot-created appointments:

My appointments
↓
Cancel
↓
Confirm
↓
Appointment.status = cancelled
↓
Calendar event deleted
↓
Client notified
↓
Owner notified

For manual Calendar events:

My appointments
↓
Cancel
↓
Confirm
↓
Calendar event deleted
Reschedule Flow

For bot-created appointments:

My appointments
↓
Reschedule
↓
Confirm
↓
Select new date
↓
Select new time
↓
Appointment updated
↓
Calendar event updated
↓
Client notified
↓
Owner notified

For manual Calendar events:

My appointments
↓
Reschedule
↓
Confirm
↓
Select new date
↓
Select new time
↓
Google Calendar event updated

Manual Calendar event duration is preserved.

Reminders

The system sends appointment reminders one day before the appointment.

Rule:

appointment is tomorrow
status = confirmed
reminder_24h_sent_at is empty
customer.telegram_id exists
current time is between 08:00 and 21:00

After successful sending:

Appointments.reminder_24h_sent_at is filled

If appointment time is changed, reminder status is reset.

Contacts

Contacts are stored in Locations.

Location text is stored through Messages using:

name_key
address_key

This keeps Locations technical and Messages responsible for multilingual text.

Current ClientBot v1 Features
Main menu
Booking
Name and phone before booking
Customer note
Individual customer-service-provider duration
Provider schedule and overrides
Customer conflict blocking
Owner approval
Owner rejection
Google Calendar sync
Manual Calendar event support
My appointments by phone
Cancellation
Reschedule
Contacts
24h reminders