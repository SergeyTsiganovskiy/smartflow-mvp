# Changelog

All notable changes to SmartFlow will be documented in this file.

The format is based on Keep a Changelog principles.

---

# [0.1.0-alpha] - 2026-06-11

## Project Initialization

Initial working MVP for Beauty Salon booking workflow.

---

## Added

### Core Architecture

* Client-owned installation architecture
* Telegram-first workflow
* Google Apps Script backend
* Google Sheets database
* Multi-language support foundation (uk, ru, en)

---

### Telegram Integration

* Telegram Client Bot
* Webhook integration
* Telegram message delivery helper
* Webhook management functions:

  * setClientWebhook()
  * deleteClientWebhook()
  * getClientWebhookInfo()

---

### Configuration

* Settings table
* Dynamic settings loader
* Sheet constants configuration

---

### Localization

* Messages table
* Multi-language message resolver
* Language selection through Settings

---

### State Management

* UserStates table
* setUserState()
* getUserState()

---

### Session Management

* UserSessions table
* setUserSessionValue()

Used for storing temporary booking data during multi-step dialogs.

---

### Logging

* AuditLog table
* addAuditLog()

Used for debugging and future monitoring.

---

### Booking Wizard

Implemented:

Start
↓
Book Appointment
↓
Select Location
↓
Select Service

---

### Locations

Implemented:

* Locations table
* getLocations()
* findLocationByName()

---

### Services

Implemented:

* Services table
* getServices()

---

### Client Bot

Implemented:

* handleClientMessage()
* sendClientStartMenu()
* showLocations()
* showServices()

---

### Testing Utilities

Implemented:

* testMessages()
* testSendTelegram()
* testSendToOwner()

---

## Database Tables Created

* Settings
* Messages
* Locations
* Services
* Customers
* Requests
* RequestOptions
* Appointments
* UserStates
* UserSessions
* AuditLog

---

## Architecture Decisions

### Client-Owned Installation

Each client receives:

* Own Telegram bot
* Own Google Sheets
* Own Apps Script project

Benefits:

* Full data ownership
* Better privacy
* Easier sales
* Lower liability

---

### MVP Scheduling Strategy

Instead of automatic booking:

Customer submits up to three preferred appointment options.

Provider manually confirms appointment.

This minimizes complexity during MVP stage.

---

## Fixed

### Webhook Deployment Issues

Resolved:

* Multiple deployment confusion
* Incorrect webhook target versions
* Web App version synchronization issues

---

# [0.2.0] - Planned

## Booking Completion Flow

Planned:

Select Service
↓
Select Provider
↓
Select Preferred Time Slots
↓
Customer Name
↓
Customer Phone
↓
Create Request

Expected additions:

* Providers table
* Provider selection
* Request creation
* Customer creation
* RequestOptions creation


## Added

- Provider selection
- Date selection
- Period selection
- Localization refactoring
- Constants.gs
- MESSAGE_KEYS
- STATES
- PROVIDER_IDS

- Customer creation
- Request creation
- Request options creation
- Multiple preferred dates
- Name collection
- Phone collection
- Request finalization

- Owner notification on new request
- Customer creation
- Request creation
- Request options creation
- Multiple preferred dates
- Date formatting
- Provider formatting
- Session cleanup between requests

Status: In Progress
---

# [0.3.0] - Planned

## Admin Bot

Planned:

* New request notifications
* Request approval
* Request rejection
* Provider dashboard
* Daily schedule

---

# [1.0.0] - Vision

Universal SmartFlow platform for small businesses:

* Beauty salons
* Massage therapists
* Repair services
* Private specialists
* Workshops
* OLX stores

Single engine.
Multiple industries.
Telegram as the operational hub.
