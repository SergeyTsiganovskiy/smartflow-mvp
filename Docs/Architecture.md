# SmartFlow Beauty Demo Architecture

## Components

### Client Telegram Bot

Handles:

- booking flow
- appointment lookup
- appointment cancellation
- customer communication

Main scenarios:

- Book appointment
- My Appointments
- Cancel appointment
- Contacts

---

### Owner Telegram Bot

Handles:

- incoming booking requests
- request approval
- request rejection
- cancellation notifications

---

### Google Sheets Database

Acts as primary database.

Tables:

- Settings
- Messages
- Locations
- Services
- Providers
- ProviderSchedules
- Customers
- Requests
- RequestOptions
- Appointments
- UserSessions
- AuditLog

---

### Google Calendar

Single shared salon calendar.

Purpose:

- visual schedule
- staff visibility
- appointment overview

Availability is calculated from Appointments table, not Calendar events.

All providers currently use:

calendar_id = primary

---

## Booking Flow

Client
→ Location
→ Service
→ Provider
→ Date
→ Time
→ Name
→ Phone
→ Request

Owner
→ Approve

System
→ Appointment
→ Calendar Event
→ Customer Notification

---

## Appointment Lookup

Client
→ My Appointments
→ Phone Number
→ Active Appointments

Search is performed by normalized phone number.

---

## Cancellation Flow

Client
→ My Appointments
→ Cancel

Confirmation:

Cancel
→ Yes
→ Appointment.status = cancelled
→ Calendar Event deleted
→ Customer notification
→ Owner notification

Cancel
→ No
→ Appointment remains active