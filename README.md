# SmartFlow

Telegram-first automation platform for small business.

## Overview

SmartFlow helps small businesses manage customer requests using Telegram as a single control center.

The system is designed for:

* Beauty salons
* Barbershops
* Massage therapists
* Repair services
* Private specialists
* OLX stores
* Small local businesses

---

## Core Idea

Customer requests may come from:

* Telegram
* Instagram
* Website
* OLX
* Prom
* Other sources

SmartFlow converts all requests into a single workflow.

---

## Architecture

Client-owned installation.

Each business receives:

* Own Telegram Bot
* Own Google Sheets database
* Own Google Apps Script backend
* Full ownership of data

SmartFlow provides:

* Templates
* Setup
* Documentation
* Support
* Reusable modules

---

## Current MVP

Implemented:

* Telegram webhook
* Multi-language support (uk, ru, en)
* Booking flow
* Location selection
* Service selection
* User state management
* User session management
* Audit log

Current flow:

Start
↓
Book Appointment
↓
Select Location
↓
Select Service

---

## Project Structure

```text
AppsScript/
│
├── Code.gs
├── ClientBot.gs
├── Database.gs
├── Telegram.gs
├── Config.gs
└── Messages.gs

Docs/
│
├── Architecture.md
├── DatabaseSchema.md
└── Roadmap.md
```

## Philosophy

Start simple.

Instead of complex scheduling:

Customer submits up to 3 preferred time slots.

Master manually confirms the appointment.

This approach reduces complexity and improves reliability during MVP stage.

---

## Roadmap

### v0.2

* Provider selection
* Multiple appointment options
* Customer name
* Customer phone
* Request creation

### v0.3

* Admin Bot

### v0.4

* Appointment reminders

### v0.5

* Google Calendar integration

### v0.6

* Multi-location support

### v0.7

* Website booking

### v0.8

* Instagram integration

### v0.9

* OLX integration

### v1.0

Universal SmartFlow platform for small business.

---

## Status

SmartFlow Beauty MVP v0.1-alpha

Work in progress.
