## changelog.md

```markdown
# Changelog

## 2026-06-14

### Added

- Manual Google Calendar events can now appear in My appointments.
- Manual Calendar events are found by phone number in event title or description.
- Manual Calendar event cards now show parsed fields:
  - Customer
  - Phone
  - Service
  - Provider
  - Location
- Manual Calendar events can be cancelled from the bot.
- Manual Calendar events can be rescheduled from the bot.
- Calendar event reschedule preserves original event duration.
- Added pending calendar event handling through UserSessions.
- Added safe callback handling for long Google Calendar event IDs.

### Changed

- Calendar events created by the bot are excluded from manual Calendar lookup to avoid duplicate display.
- Reschedule flow now supports both Appointments and manual Calendar events.
- Calendar event IDs are no longer passed directly in long callback payloads for confirmation actions.
- Reschedule date flow now has separate messages for normal booking and rescheduling.

### Fixed

- Duplicate “Select new date” message during reschedule.
- Custom date selection during Calendar event reschedule.
- Telegram `BUTTON_DATA_INVALID` caused by long callback data.
- Manual Calendar event cancellation flow.
- Manual Calendar event reschedule flow.

---

## 2026-06-13

### Added

- My appointments feature.
- Appointment lookup by phone number.
- Phone number normalization.
- Search by significant trailing phone digits.
- Google Calendar event creation after appointment confirmation.
- Google Calendar event ID storage in Appointments.
- Appointment cancellation.
- Cancellation confirmation.
- Back to appointment card action.
- Appointment reschedule.
- Reschedule confirmation.
- Google Calendar event update after reschedule.
- Owner notification after cancellation.
- Owner notification after reschedule.
- Client notification after cancellation.
- Client notification after reschedule.

### Changed

- My appointments no longer depends on telegram_id.
- Phone is the primary lookup key for client appointment lookup.
- Availability is calculated from Appointments and provider schedule.
- Shared calendar is used for salon visibility.
- Calendar events no longer block availability for all providers in the shared calendar.

### Fixed

- Leading zero issues in phone numbers.
- Appointment date/time formatting.
- Request approval callback issues.
- Appointment end_at generation.
- Google Calendar sync after approval.
- Google Calendar sync after cancellation.
- Google Calendar sync after reschedule.
- Past time slots shown for the current day.

---

## 2026-06-12

### Added

- ProviderSchedule table.
- ProviderScheduleOverrides table.
- CustomerServiceSettings table.
- Individual service duration support.
- Individual service price support.
- Availability Engine design.
- Appointment table integration.
- RequestOptions flow.

### Changed

- Simplified Services duration model.
- Replaced min/max duration logic with default duration and customer-specific settings.
- Replaced price range with base_price.
- Customers are created/updated by phone instead of Telegram-only identity.

---

## Current Stable Version

The system currently supports:

- booking
- owner approval
- appointment creation
- shared Google Calendar sync
- My appointments
- manual Calendar event lookup
- cancellation
- reschedule
- Calendar cleanup
- client notifications
- owner notifications