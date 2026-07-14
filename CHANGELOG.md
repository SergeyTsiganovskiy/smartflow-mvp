# Changelog

All notable changes to SmartFlow Beauty are documented here. The project follows Semantic Versioning once a release tag is created.

## [Unreleased]

### Added

- Installation health check for schema, settings, calendars, webhooks, triggers, and request recipients.
- Deterministic tests for critical validation, migration, notification, callback, and Telegram update flows.
- Version reporting through `getSmartFlowVersion()` and `runSmartFlowHealthCheck()`.

### Changed

- Administrative request notifications reach every configured administrator plus optional recipients.
- Appointment views read live data instead of the removed Calendar cache.
- Client booking, rescheduling, cancellation, localization, pagination, and configuration workflows were simplified.
- Deployment and user documentation was expanded for pilot installations.

### Security

- Bot tokens are migrated from the Settings sheet to Script Properties, with precedence, fallback, diagnostics, and rotation instructions.
- Telegram updates are serialized and deduplicated per bot without losing failed or out-of-order updates.
- Administrative callbacks require current administrator access and stale actions cannot create duplicates.
- Legacy Owner, financial, localized-entity, and Calendar-cache concepts were removed from runtime code.

## [0.1.0-alpha] - Unreleased

Initial pilot release candidate. Do not create the release tag until the release checklist and external-pilot regression pass.
