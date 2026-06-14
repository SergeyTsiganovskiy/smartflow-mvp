# SmartFlow Beauty Demo Architecture

## Overview

SmartFlow Beauty Demo is a Telegram-based booking system for a beauty salon.

The system uses:

- Telegram Bot for client interaction
- Telegram inline buttons for owner/client actions
- Google Sheets as the main database
- Google Calendar as a shared salon schedule
- Google Apps Script as the backend

---

## Main Components

### Client Telegram Bot

Used by clients to:

- create booking requests
- view active appointments
- cancel appointments
- reschedule appointments
- view contacts

Start menu:

- Book
- My appointments
- Contacts

---

### Owner Flow

The owner receives booking requests in Telegram and can:

- approve selected time option
- reject request
- receive cancellation notifications
- receive reschedule notifications

---

### Google Sheets Database

Google Sheets is the primary source of structured data.

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
- all providers can use the same `calendar_id`
- `primary` can be used for MVP
- records created by the bot are written to Google Calendar
- manual Google Calendar events can also be shown in My appointments

Availability is calculated mainly from Appointments, not from all Calendar events.

This allows different providers to have appointments at the same time in the shared calendar.

---

## Booking Flow

Client flow:

```text
/start
↓
Book
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
Customer name
↓
Phone
↓
Request created


Owner flow:

New request
↓
Approve selected option
↓
Appointment created
↓
Google Calendar event created
↓
Customer notified

Availability Engine

Availability uses:

Provider weekly schedule
Provider date overrides
Appointment duration
Confirmed Appointments
Current time filtering for today

Manual Calendar events are not used to block slots globally, because the salon uses one shared calendar.

Appointment Duration

Duration priority:

CustomerServiceSettings.duration_minutes
↓
Services.default_duration_minutes
My Appointments

Client flow:

My appointments
↓
Enter phone
↓
Normalize phone
↓
Search Appointments
↓
Search manual Google Calendar events
↓
Show active records

Appointments created by the bot are shown from the Appointments table.

Manual events from Google Calendar are shown only if they are not already linked to an Appointment by calendar_event_id.

Manual Google Calendar Events

Manual event description should contain:

Customer: Anna
Phone: 0664452124
Service: Haircut
Provider: Alice
Location: Center

Minimum required field:

Phone: 0664452124

Manual Calendar events can be:

viewed in My appointments
cancelled
rescheduled

They are handled by calendar_event_id.

Cancellation Flow

For Appointments created by the bot:

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

For Appointments created by the bot:

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
Appointment start/end updated
↓
Google Calendar event updated
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

Manual Calendar event duration is preserved during reschedule.

Phone Search

Phone numbers are normalized to digits.

Supported input examples:

0664452124
380664452124
+380 66 445 21 24

Search uses significant trailing digits, so different common formats can match the same customer.

Current Stable Features
Booking
Owner approval
Request rejection
Appointment creation
Shared Google Calendar event creation
My appointments by phone
Manual Calendar event lookup
Appointment cancellation
Calendar event cancellation
Appointment reschedule
Calendar event reschedule
Client notifications
Owner notifications