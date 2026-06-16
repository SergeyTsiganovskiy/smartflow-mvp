# Architecture.md

# SmartFlow Beauty Demo Architecture

## Overview

SmartFlow Beauty Demo is a beauty salon booking system built on:

* Telegram Client Bot
* Google Apps Script
* Google Sheets
* Google Calendar

The system follows a request → approval → appointment workflow.

Customers submit booking requests through Telegram.

Owners review requests and approve one of the proposed time options.

After approval:

* Appointment is created
* Google Calendar event is created
* Customer receives confirmation
* Reminder workflow becomes active

---

# Main Components

## ClientBot

ClientBot is used by customers.

Functions:

* Book appointment
* View appointments
* Cancel appointment
* Reschedule appointment
* View contacts
* Receive reminders

Main menu:

```text
📅 Записаться
📋 Мои записи
📞 Контакты
🏠 Главное меню
```

Main menu button is available throughout all major flows.

---

## Google Sheets

Google Sheets acts as the primary database.

Main entities:

```text
Settings
Messages
Locations
Services
Providers
ProviderSchedule
ProviderScheduleOverrides
Customers
CustomerServiceSettings
CustomerConflicts
Requests
RequestOptions
Appointments
UserSessions
AuditLog
```

---

## Google Calendar

Google Calendar is used as:

* Appointment calendar
* Manual appointment source
* Synchronization source

Each appointment created by the bot receives:

```text
calendar_event_id
```

stored inside Appointments.

---

# Booking Flow

Customer flow:

```text
Book
↓
Enter Name
↓
Enter Phone
↓
Select Location
↓
Select Service
↓
Select Provider
↓
Select Date
↓
Select Time
↓
Add more options? (up to 3)
↓
Enter Note
↓
Request Created
```

Request is sent to owner.

---

# Owner Approval Flow

Owner receives request.

Request contains:

```text
Customer
Phone
Location
Service
Provider
Note
Time Options
```

Owner may:

```text
Approve Option 1
Approve Option 2
Approve Option 3
Reject Request
```

After approval:

```text
Appointment created
Calendar event created
Request status updated
Customer notified
```

Confirmed option is highlighted in owner message when multiple options exist.

---

# Availability Engine

Availability is calculated from:

```text
Provider Schedule
Provider Schedule Overrides
Existing Provider Appointments
Customer-specific Duration
Customer Conflict Rules
Current Time Restrictions
```

Slot step:

```text
30 minutes
```

---

# Schedule System

## ProviderSchedule

Stores weekly schedules.

Example:

```text
MON 09:00-18:00
TUE 09:00-18:00
...
```

---

## ProviderScheduleOverrides

Stores date-specific changes.

Examples:

```text
Vacation
Day Off
Holiday
Short Day
Extra Day
```

Priority:

```text
Override
↓
Weekly Schedule
```

---

# Customer Identification

Customer is identified primarily by:

```text
Phone Number
```

During booking:

```text
Name
↓
Phone
↓
Customer Lookup/Create
↓
Availability Search
```

This allows customer-specific business rules.

---

# Customer-Specific Duration

System supports individual service duration.

Priority:

```text
CustomerServiceSettings.duration_minutes
↓
Services.default_duration_minutes
```

Lookup key:

```text
customer_id
service_id
provider_id
```

Examples:

```text
Default Haircut = 60 min

Customer A:
Haircut with Alice = 90 min

Customer B:
Haircut with Alice = 45 min
```

---

# Customer Conflicts

Some customers should never be present simultaneously.

Rules stored in:

```text
CustomerConflicts
```

Example:

```text
cust_001 → cust_005
cust_005 → cust_001
```

When calculating availability:

```text
Appointments of conflicting customers
also block available slots
```

Conflict works salon-wide.

Not provider-specific.

---

# Request System

Requests are temporary objects.

Status:

```text
pending
confirmed
rejected
```

A request may contain:

```text
1-3 preferred time options
```

Stored separately in:

```text
RequestOptions
```

---

# Appointment System

Appointment is created only after approval.

Statuses:

```text
confirmed
cancelled
completed
no_show
```

Appointment stores:

```text
Customer
Service
Provider
Location
Start
End
Calendar Event Id
Note
Reminder Status
```

---

# Google Calendar Integration

Every approved appointment creates:

```text
Calendar Event
```

Description contains:

Localized visible information:

```text
Customer
Phone
Service
Provider
Location
Note
```

And technical section:

```text
[TECH]
appointment_id=...
```

Example:

```text
Клиент: Иван
Телефон: 0661234567
Услуга: Стрижка
Мастер: Алиса
Локация: Центр
Комментарий: -

[TECH]
appointment_id=appt_123
```

The system never parses localized text.

All technical operations use:

```text
appointment_id
```

from TECH section.

---

# My Appointments

Customer enters phone.

System searches:

```text
Appointments
Google Calendar
```

Displays:

```text
Date
Time
Service
Provider
Location
```

Available actions:

```text
Reschedule
Cancel
```

---

# Cancellation Flow

```text
My Appointments
↓
Cancel
↓
Confirm
↓
Appointment.status = cancelled
↓
Calendar Event Deleted
↓
Notifications Sent
```

---

# Reschedule Flow

```text
My Appointments
↓
Reschedule
↓
Choose Date
↓
Choose Time
↓
Appointment Updated
↓
Calendar Event Updated
```

Supports:

```text
Bot-created appointments
Manual calendar appointments
```

Main menu button is available on every step.

---

# Reminder System

24-hour reminders.

Conditions:

```text
Appointment Tomorrow
Status = confirmed
Reminder Not Sent
Telegram Id Exists
```

After sending:

```text
reminder_24h_sent_at
```

is filled.

If appointment time changes:

```text
Reminder flag reset
```

---

# Contacts

Contacts are stored in Locations.

Localized text is stored in Messages.

Locations contain:

```text
name_key
address_key
phone_1
phone_2
instagram
telegram
website
google_maps_url
working_hours
```

Messages contain:

```text
LOCATION_001_NAME
LOCATION_001_ADDRESS
```

This separates:

```text
Business Data
↓
Locations

Translations
↓
Messages
```

---

# Localization

All UI text comes from:

```text
Messages
```

Supported languages:

```text
uk
ru
en
```

System language is controlled through:

```text
Settings.Language
```

---

# Session Management

Temporary state is stored in:

```text
UserSessions
```

Stores:

```text
Customer
Service
Provider
Location
Current Flow State
Booking Options
Reschedule Data
```

---

# Audit Logging

All critical operations write to:

```text
AuditLog
```

Used for:

```text
Debugging
Availability Investigation
Request Processing
Calendar Sync
```

---

# Removed Features

No longer used:

```text
Any Provider
ProviderExceptions
ClientConflicts
SMARTFLOW_DATA JSON block
```

Current replacements:

```text
Specific Provider Selection
ProviderScheduleOverrides
CustomerConflicts
TECH appointment_id block
```

---

# Current Status

ClientBot v1 Stable

Implemented:

```text
Booking
My Appointments
Contacts
Approval Flow
Google Calendar
Customer Durations
Customer Conflicts
Cancellation
Reschedule
Reminders
Localization
Main Menu Navigation
```

Next phase:

```text
AdminBot v1
```
