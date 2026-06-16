# Changelog.md

# SmartFlow Beauty Demo Changelog

---

# Version 1.0.0

## Status

```text
ClientBot v1 Stable
```

Release Date:

```text
2026-06
```

---

# Booking Flow

## Added

```text
Customer Name Collection
Customer Phone Collection
Automatic Customer Lookup
Automatic Customer Creation
Location Selection
Service Selection
Provider Selection
Date Selection
Custom Date Selection
Time Selection
Customer Note
Request Creation
```

---

## Added

Support for:

```text
1 Preferred Time Option
2 Preferred Time Options
3 Preferred Time Options
```

---

## Fixed

```text
Invalid Time Selection Handling
Date Re-selection Flow
Custom Date Navigation
Option Selection Validation
```

---

# Main Menu

## Added

Persistent:

```text
🏠 Main Menu
```

button.

---

## Added To

```text
Booking Flow
My Appointments Flow
Reschedule Flow
Date Selection
Custom Date Selection
Time Selection
```

---

## Fixed

```text
Main Menu missing during reschedule
Main Menu missing after date selection
Main Menu missing after custom date selection
```

---

# Provider Selection

## Changed

Removed:

```text
Any Provider
```

---

## New Logic

Customer must select:

```text
Specific Provider
```

Availability is calculated only for that provider.

---

# Availability Engine

## Added

Provider-based availability calculation.

Sources:

```text
ProviderSchedule
ProviderScheduleOverrides
Appointments
```

---

## Added

Current day filtering.

Rules:

```text
Past slots hidden
30 minute buffer
30 minute rounding
```

---

## Added

Customer-specific duration support.

Priority:

```text
CustomerServiceSettings.duration_minutes
↓
Services.default_duration_minutes
```

---

## Added

Customer conflict blocking.

Sources:

```text
CustomerConflicts
Appointments
```

Rule:

```text
Conflicting customers
cannot overlap
inside salon.
```

---

## Fixed

```text
Invalid generated times
17:23
17:41
17:52
```

---

## Fixed

Availability after selecting:

```text
Today
```

---

# Customer Service Settings

## Added

Table:

```text
CustomerServiceSettings
```

---

## Added

Per-customer settings:

```text
Duration
Price
```

---

## Added

Lookup key:

```text
customer_id
service_id
provider_id
```

---

# Customer Conflicts

## Added

Table:

```text
CustomerConflicts
```

---

## Added

Bidirectional conflict model.

Example:

```text
A → B
B → A
```

---

## Added

Salon-wide overlap prevention.

---

## Renamed

```text
ClientConflicts
↓
CustomerConflicts
```

---

# Request System

## Added

Owner approval workflow.

Actions:

```text
Approve Option 1
Approve Option 2
Approve Option 3
Reject Request
```

---

## Added

Request statuses:

```text
pending
confirmed
rejected
```

---

## Added

Request options table.

```text
RequestOptions
```

---

## Added

Customer note support.

Customer note now stored in:

```text
Requests
Appointments
Google Calendar
```

---

# Owner Notifications

## Added

Confirmation message after approval.

---

## Added

Selected option highlighting.

When request contains:

```text
2 or 3 options
```

approved option becomes:

```text
Bold
```

inside owner message.

---

## Added

Customer receives:

```text
Date
Time
Service
Provider
Location
```

inside confirmation message.

---

# Appointment System

## Added

Table:

```text
Appointments
```

---

## Added

Statuses:

```text
confirmed
cancelled
completed
no_show
```

---

## Added

Calendar synchronization.

---

## Added

Appointment cancellation.

---

## Added

Appointment reschedule.

---

## Added

Appointment notes.

---

# Google Calendar

## Added

Automatic event creation.

---

## Added

Automatic event update.

---

## Added

Automatic event deletion.

---

## Added

Calendar Event ID storage.

Field:

```text
calendar_event_id
```

---

## Added

Localized description generation.

Fields:

```text
Customer
Phone
Service
Provider
Location
Note
```

are generated using:

```text
Messages
```

language.

---

## Added

Technical section.

Format:

```text
[TECH]
appointment_id=...
```

---

## Changed

Removed:

```text
SMARTFLOW_DATA
JSON block
```

---

## Changed

System now uses:

```text
appointment_id
```

as the only technical identifier.

---

## Fixed

Language-dependent parsing issues.

---

## Fixed

Future language expansion compatibility.

---

# Manual Calendar Events

## Added

Support for displaying manual calendar events.

---

## Added

Support for cancellation.

---

## Added

Support for reschedule.

---

## Added

Support for mixed calendar usage.

---

# My Appointments

## Added

Lookup by:

```text
Phone Number
```

---

## Added

Display:

```text
Date
Time
Service
Provider
Location
```

---

## Added

Actions:

```text
Reschedule
Cancel
```

---

## Fixed

Appointment lookup reliability.

---

## Fixed

Calendar synchronization issues.

---

# Contacts

## Added

Contacts section.

---

## Added

Location information:

```text
Address
Working Hours
Phone 1
Phone 2
Instagram
Telegram
Website
Google Maps
```

---

## Changed

Localization architecture.

Moved to:

```text
Messages
```

using:

```text
name_key
address_key
```

---

# Localization

## Added

Multilingual support.

Languages:

```text
uk
ru
en
```

---

## Added

Calendar localization.

---

## Added

Location localization.

---

## Fixed

Hardcoded language values.

---

# Reminders

## Added

24-hour reminder system.

---

## Conditions

```text
Tomorrow Appointment
Confirmed Status
Reminder Not Sent
Telegram Id Exists
```

---

## Added

Reminder tracking field:

```text
reminder_24h_sent_at
```

---

## Added

Reminder reset after reschedule.

---

# Session Management

## Added

UserSessions support for:

```text
Booking
My Appointments
Cancellation
Reschedule
Calendar Operations
```

---

# Logging

## Added

AuditLog integration.

---

## Added

Availability diagnostics.

---

## Added

Calendar diagnostics.

---

## Added

Request diagnostics.

---

# Removed

## Deleted

```text
Any Provider
ProviderExceptions
ClientConflicts
SMARTFLOW_DATA JSON Block
```

---

# Current Stable Feature Set

```text
Booking
Owner Approval
Google Calendar
Customer Notes
Customer-Specific Duration
Customer Conflicts
My Appointments
Cancellation
Reschedule
Contacts
Localization
Reminders
Audit Logging
Main Menu Navigation
```

---

# Next Milestone

```text
AdminBot v1
```

Primary goal:

```text
Full business management
without direct Google Sheets editing.
```
