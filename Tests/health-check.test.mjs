import assert from 'node:assert/strict';
import test from 'node:test';
import { loadAppsScript } from './load-apps-script.mjs';

const app = loadAppsScript(['Config.gs', 'Version.gs', 'HealthCheck.gs'], {
  Logger: { log() {} },
  PropertiesService: {
    getScriptProperties() {
      return { getProperty() { return '0'; } };
    }
  }
});

test('application version is exposed for deployment verification', () => {
  assert.equal(app.getSmartFlowVersion(), '0.1.0-alpha');
});

test('health check detects missing required headers', () => {
  assert.deepEqual(Array.from(app.getMissingHeaders(['id', 'name'], ['id', 'name', 'active'])), ['active']);
  assert.deepEqual(Array.from(app.getMissingHeaders(['id', 'name', 'active'], ['id', 'active'])), []);
});

test('health check rejects placeholders and accepts configured secrets', () => {
  assert.equal(app.isConfiguredSecret(''), false);
  assert.equal(app.isConfiguredSecret('PASTE_CLIENT_BOT_TOKEN'), false);
  assert.equal(app.isConfiguredSecret('configured-value'), true);
});

test('health check treats Europe/Kiev and Europe/Kyiv as the same timezone', () => {
  assert.equal(app.normalizeHealthTimezone('Europe/Kiev'), 'Europe/Kyiv');
  assert.equal(app.normalizeHealthTimezone('Europe/Kyiv'), 'Europe/Kyiv');
});

test('health check validates infrastructure settings without exposing values', () => {
  const valid = app.checkHealthSettings(
    {
      TimeZone: 'Europe/Kyiv',
      ClientBotToken: 'client-secret',
      AdminBotToken: 'admin-secret',
      BotTokenStorage: 'SCRIPT_PROPERTIES',
      AppsScriptUrl: 'https://script.google.com/macros/s/deployment-id/exec',
      AdminTelegramIds: '123456,789012',
      BookingDaysAhead: 30,
      PaginationPageSize: 5
    },
    { getSpreadsheetTimeZone() { return 'Europe/Kyiv'; } },
    'Europe/Kyiv'
  );
  assert.equal(valid.ok, true);
  assert.equal(valid.details.includes('secret'), false);

  const legacyAlias = app.checkHealthSettings(
    {
      TimeZone: 'Europe/Kyiv',
      ClientBotToken: 'client-secret',
      AdminBotToken: 'admin-secret',
      BotTokenStorage: 'SCRIPT_PROPERTIES',
      AppsScriptUrl: 'https://script.google.com/macros/s/deployment-id/exec',
      AdminTelegramIds: '123456',
      BookingDaysAhead: 30,
      PaginationPageSize: 5
    },
    { getSpreadsheetTimeZone() { return 'Europe/Kiev'; } },
    'Europe/Kiev'
  );
  assert.equal(legacyAlias.ok, true);

  const invalid = app.checkHealthSettings(
    {
      TimeZone: 'UTC',
      ClientBotToken: 'PASTE_CLIENT_BOT_TOKEN',
      AdminBotToken: '',
      BotTokenStorage: 'INCOMPLETE',
      AppsScriptUrl: 'https://example.com/dev',
      AdminTelegramIds: 'invalid',
      BookingDaysAhead: 0,
      PaginationPageSize: 11
    },
    { getSpreadsheetTimeZone() { return 'Europe/Kyiv'; } },
    'Europe/Kyiv'
  );
  assert.equal(invalid.ok, false);
  assert.equal(invalid.details.includes('PASTE_CLIENT_BOT_TOKEN'), false);
});

test('health check requires one copy of each required trigger', () => {
  const trigger = (name) => ({ getHandlerFunction() { return name; } });
  const valid = app.checkHealthTriggers(
    [trigger('send24hAppointmentReminders'), trigger('syncCompletedCustomerVisitsTrigger')],
    true
  );
  assert.equal(valid.ok, true);

  const duplicate = app.checkHealthTriggers(
    [trigger('syncCompletedCustomerVisitsTrigger'), trigger('syncCompletedCustomerVisitsTrigger')],
    false
  );
  assert.equal(duplicate.ok, false);
  assert.match(duplicate.details, /duplicates=syncCompletedCustomerVisitsTrigger/);
});

test('health check requires an active request recipient', () => {
  assert.equal(app.checkHealthRecipients([]).ok, false);
  assert.equal(app.checkHealthRecipients([{ telegram_id: '123' }]).ok, true);
});
