# Roadmap.md

# SmartFlow Beauty Demo Roadmap

## Current Status

```text
ClientBot v1 Stable
```

Implemented:

* Booking Flow
* Owner Approval Flow
* Google Calendar Integration
* My Appointments
* Cancellation
* Reschedule
* Reminders
* Contacts
* Localization
* Customer-Specific Duration
* Customer Conflict Rules

---

# Phase 1 — ClientBot v1

## Completed

### Booking

```text
✔ Name Collection
✔ Phone Collection
✔ Customer Lookup/Create
✔ Location Selection
✔ Service Selection
✔ Provider Selection
✔ Date Selection
✔ Custom Date Selection
✔ Time Selection
✔ Up To 3 Preferred Options
✔ Customer Note
✔ Request Creation
```

---

### Availability

```text
✔ Weekly Provider Schedule
✔ Schedule Overrides
✔ Existing Appointment Blocking
✔ Current-Day Slot Filtering
✔ 30 Minute Step
✔ Customer-Specific Duration
✔ Customer Conflict Blocking
```

---

### Request Processing

```text
✔ Owner Notification
✔ Approve Request
✔ Reject Request
✔ Appointment Creation
✔ Google Calendar Event Creation
✔ Customer Notification
```

---

### Appointments

```text
✔ My Appointments
✔ Search By Phone
✔ Appointment Card
✔ Cancellation
✔ Reschedule
✔ Calendar Synchronization
```

---

### Google Calendar

```text
✔ Event Creation
✔ Event Update
✔ Event Deletion
✔ TECH Block
✔ appointment_id Link
✔ Language Independent Parsing
```

---

### Reminders

```text
✔ 24 Hour Reminder
✔ One-Time Reminder Logic
✔ Reminder Reset After Reschedule
```

---

### Contacts

```text
✔ Locations Table Integration
✔ Multilingual Locations
✔ Phones
✔ Social Links
✔ Working Hours
```

---

# Phase 2 — AdminBot v1

## Goal

Allow salon owner to manage the entire system without opening Google Sheets.

---

# Admin Main Menu

Planned:

```text
👤 Customers
👩‍💼 Providers
💅 Services
🗓 Schedules
📅 Appointments
⚙ Settings
```

---

# Priority 1

## Providers

### Add Provider

```text
Enter Name
↓
Select Location
↓
Enter Phone
↓
Enter Telegram Id
↓
Enter Calendar Id
↓
Save
```

### Edit Provider

```text
Find Provider
↓
Select Field
↓
Update
```

### Disable Provider

```text
Provider Active = FALSE
```

---

## Services

### Add Service

```text
Name
Duration
Price
Save
```

### Edit Service

```text
Name
Duration
Price
Status
```

### Disable Service

```text
active = FALSE
```

---

## Schedules

### Weekly Schedule

```text
Select Provider
↓
Select Day
↓
Set Time
```

### Override

```text
Select Provider
↓
Select Date
↓
Day Off
or
Custom Hours
```

---

## Customers

### Find Customer

```text
Phone
↓
Customer Card
```

### Create Customer

```text
Name
Phone
Notes
```

### Customer Card

Display:

```text
Name
Phone
Visits
Last Visit
Notes
```

---

## CustomerServiceSettings

### Individual Duration

```text
Find Customer
↓
Select Service
↓
Select Provider
↓
Set Duration
```

### Individual Price

```text
Find Customer
↓
Select Service
↓
Select Provider
↓
Set Price
```

---

## CustomerConflicts

### Add Conflict

```text
Customer A
↓
Customer B
↓
Save
```

System creates:

```text
A → B
B → A
```

---

# Priority 2

## Appointments

### Today's Appointments

```text
Today
```

Grouped by:

```text
Provider
```

---

### Tomorrow's Appointments

```text
Tomorrow
```

---

### Search Appointments

```text
Phone
Customer
Provider
Date
```

---

### Cancel Appointment

```text
Select Appointment
↓
Confirm
```

---

### Reschedule Appointment

```text
Select Appointment
↓
Select Date
↓
Select Time
```

---

### Mark Completed

```text
Appointment.status = completed
```

---

### Mark No Show

```text
Appointment.status = no_show
```

---

### Manual Appointment Creation

```text
Customer
Service
Provider
Date
Time
```

Creates:

```text
Appointment
Calendar Event
```

---

# Priority 3

## Marketing

### Broadcast Message

```text
All Customers
```

### Filtered Broadcast

```text
By Provider
By Service
By Last Visit
```

---

## Analytics

### Revenue

```text
Today
Week
Month
Year
```

---

### Provider Load

```text
Appointments Per Provider
```

---

### Popular Services

```text
Top Services
```

---

### Customer Retention

```text
Repeat Visits
```

---

### New Customers

```text
Period Statistics
```

---

# Phase 3 — Admin Web App

## Goal

Replace step-by-step Telegram dialogs with forms.

Possible implementation:

```text
Telegram Web App
Google Apps Script Web App
```

---

## Candidate Screens

### Customer Card

```text
Name
Phone
Notes
Visits
Custom Settings
Conflicts
```

---

### Provider Card

```text
Provider
Location
Phone
Calendar
Schedule
```

---

### Schedule Editor

Weekly grid:

```text
MON-FRI
09:00-18:00
```

---

### Appointment Board

Calendar view:

```text
Today
Week
Month
```

---

# Future Ideas

## Waiting List

```text
Notify when slot becomes available
```

---

## Automatic Confirmation

For selected services.

---

## Provider Telegram Bot

Separate bot for masters.

Functions:

```text
Today Schedule
Confirm Arrival
Mark Completed
Block Time
```

---

## Online Payments

Possible integrations:

```text
WayForPay
Fondy
Stripe
```

---

# Long-Term Goal

```text
Owner manages salon
without Google Sheets
without Google Calendar UI
through SmartFlow interfaces only.
```
