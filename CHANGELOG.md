# Changelog

All notable changes to SmartFlow Beauty are documented here. The project follows Semantic Versioning once a release tag is created.

## [Unreleased]

### Added

- Installation health check for schema, settings, calendars, webhooks, triggers, and request recipients.
- Deterministic tests for critical validation, migration, notification, callback, and Telegram update flows.
- Appointment-lifecycle smoke tests for request persistence, idempotent approval and rejection, rescheduling, cancellation, provider-specific Calendar conflicts, and duplicate-safe visit synchronization.
- Version reporting through `getSmartFlowVersion()` and `runSmartFlowHealthCheck()`.

### Changed

- Administrative request notifications reach every configured administrator plus optional recipients.
- Telegram API responses are checked centrally, while diagnostics exclude bot tokens, chat IDs, message text, and raw response bodies.
- Appointment views read live data instead of the removed Calendar cache.
- Client booking, rescheduling, cancellation, localization, pagination, and configuration workflows were simplified.
- A newly created request is confirmed in the same message that restores the Client Bot main keyboard, without an extra action prompt.
- Deployment and user documentation was expanded for pilot installations.

### Security

- Bot tokens are migrated from the Settings sheet to Script Properties, with strict runtime resolution, diagnostics, and rotation instructions.
- Obsolete bot-token rows are removed from the current Settings schema and clean deployment workbook.
- Telegram updates are serialized and deduplicated per bot without losing failed or out-of-order updates.
- Administrative callbacks require current administrator access and stale actions cannot create duplicates.
- Legacy Owner, financial, localized-entity, and Calendar-cache concepts were removed from runtime code.

## [0.1.0-alpha] - Unreleased

Initial pilot release candidate. Do not create the release tag until the release checklist and external-pilot regression pass.
