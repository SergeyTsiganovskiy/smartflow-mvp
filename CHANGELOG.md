## changelog.md

```markdown
# Changelog

## 2026-06-15

### Added

- Main menu button available during client flows.
- Contacts branch.
- Contacts are now generated from Locations.
- Multilingual location names and addresses are now stored in Messages.
- Locations now use `name_key` and `address_key`.
- CustomerServiceSettings integration for individual duration.
- Customer lookup by phone before availability calculation.
- CustomerConflicts table.
- Conflict customers now block availability slots.
- Availability now supports customer-specific blocking rules.
- Approved request notification to customer now includes:
  - date
  - time
  - service
  - provider
  - location

### Changed

- Booking flow now starts with customer name and phone.
- Phone is collected before location/service/provider selection.
- Customer-specific duration is used when available.
- Default service duration is used only as fallback.
- Removed Any Provider from ClientBot.
- Rounded same-day available slots to 30-minute steps.
- ProviderExceptions is no longer used.
- ClientConflicts was renamed to CustomerConflicts.

### Fixed

- Same-day slots no longer produce invalid times like 17:23.
- Contact button now works.
- Main menu is available inside booking and My appointments flows.
- Location multilingual architecture was cleaned up.
- Availability investigation confirmed provider-specific filtering works correctly.

---

## 2026-06-14

### Added

- Manual Google Calendar events can appear in My appointments.
- Manual Calendar events are found by phone number.
- Manual Calendar event cards show parsed fields.
- Manual Calendar events can be cancelled.
- Manual Calendar events can be rescheduled.
- Calendar event reschedule preserves original event duration.
- Safe callback handling for long Google Calendar event IDs.
- 24h reminders.
- Appointment time sync from Google Calendar.
- Reminder reset after appointment time changes.

### Changed

- Calendar events created by the bot are excluded from manual Calendar lookup.
- Reschedule flow supports both Appointments and manual Calendar events.
- Calendar event IDs are stored in UserSessions for confirmation actions.
- Reminder logic uses “day before appointment” rather than exact 24h time.

### Fixed

- Telegram `BUTTON_DATA_INVALID` for long Calendar event IDs.
- Duplicate “Select new date” message.
- Custom date selection during reschedule.
- Manual Calendar event cancellation.
- Manual Calendar event reschedule.
- My appointments now shows updated time if Calendar event was manually moved.

---

## 2026-06-13

### Added

- My appointments by phone.
- Phone normalization.
- Google Calendar event creation after approval.
- Appointment cancellation.
- Cancellation confirmation.
- Back to appointment card.
- Appointment reschedule.
- Reschedule confirmation.
- Calendar update after reschedule.
- Client notifications.
- Owner notifications.
- Customer note.
- Customer note in owner request.
- Customer note in Appointment.
- Customer note in Google Calendar.
- Customer note in My appointments.

### Changed

- My appointments no longer depends only on Telegram ID.
- Phone became primary lookup key.
- Availability is calculated from Appointments and provider schedule.
- Shared Calendar no longer blocks all providers globally.

### Fixed

- Leading zero phone issues.
- Request approval callback issues.
- Appointment end time generation.
- Calendar sync after approval.
- Calendar sync after cancellation.
- Calendar sync after reschedule.

---

## 2026-06-12

### Added

- ProviderSchedule.
- ProviderScheduleOverrides.
- CustomerServiceSettings.
- Individual duration model design.
- Individual price model design.
- Availability Engine.
- RequestOptions.
- Appointments table integration.

### Changed

- Services duration model simplified.
- Default duration moved to Services.
- Individual duration moved to CustomerServiceSettings.

---

## Current Stable State

ClientBot v1 is functionally complete.

Supported:

- booking
- customer note
- individual duration
- customer conflicts
- provider schedules
- schedule overrides
- owner approval
- owner rejection
- Google Calendar sync
- manual Calendar events
- My appointments
- cancellation
- reschedule
- reminders
- contacts