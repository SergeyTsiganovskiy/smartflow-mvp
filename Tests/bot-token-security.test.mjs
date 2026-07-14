import assert from 'node:assert/strict';
import test from 'node:test';
import { loadAppsScript } from './load-apps-script.mjs';

const app = loadAppsScript(['Config.gs', 'ConfigurationMigrations.gs'], {
  PropertiesService: {
    getScriptProperties() {
      return { getProperty() { return null; } };
    }
  }
});

test('migration accepts Telegram token shape without exposing token contents', () => {
  assert.equal(app.isMigratableBotToken('123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcd'), true);
  assert.equal(app.isMigratableBotToken('PASTE_CLIENT_BOT_TOKEN'), false);
  assert.equal(app.isMigratableBotToken(''), false);
});

test('legacy Settings cleanup refuses to run without both Script Property tokens', () => {
  assert.throws(
    () => app.migrateRemoveLegacyBotTokenSettings(),
    /SMARTFLOW_CLIENT_BOT_TOKEN is missing or invalid/
  );
});

function properties(values) {
  return {
    getProperty(key) {
      return values[key] || null;
    }
  };
}

test('Script Properties override legacy Settings bot tokens', () => {
  const settings = app.resolveBotTokenSettings(
    { ClientBotToken: 'legacy-client', AdminBotToken: 'legacy-admin' },
    properties({
      SMARTFLOW_CLIENT_BOT_TOKEN: 'secure-client',
      SMARTFLOW_ADMIN_BOT_TOKEN: 'secure-admin'
    })
  );

  assert.equal(settings.ClientBotToken, 'secure-client');
  assert.equal(settings.AdminBotToken, 'secure-admin');
  assert.equal(settings.BotTokenStorage, 'SCRIPT_PROPERTIES');
});

test('legacy Settings tokens are ignored after migration checkpoint', () => {
  const settings = app.resolveBotTokenSettings(
    { ClientBotToken: 'legacy-client', AdminBotToken: 'legacy-admin' },
    properties({})
  );

  assert.equal(settings.ClientBotToken, '');
  assert.equal(settings.AdminBotToken, '');
  assert.equal(settings.BotTokenStorage, 'INCOMPLETE');
});

test('missing Script Property is visible to health diagnostics', () => {
  const settings = app.resolveBotTokenSettings(
    { ClientBotToken: 'legacy-client', AdminBotToken: 'legacy-admin' },
    properties({ SMARTFLOW_CLIENT_BOT_TOKEN: 'secure-client' })
  );

  assert.equal(settings.ClientBotToken, 'secure-client');
  assert.equal(settings.AdminBotToken, '');
  assert.equal(settings.BotTokenStorage, 'INCOMPLETE');
});

test('legacy token rows are deleted only after both properties are valid', () => {
  const rows = ['Language', 'ClientBotToken', 'AdminBotToken', 'TimeZone'];
  const cleanupApp = loadAppsScript(['ConfigurationMigrations.gs'], {
    BOT_TOKEN_PROPERTY_KEYS: {
      ClientBotToken: 'SMARTFLOW_CLIENT_BOT_TOKEN',
      AdminBotToken: 'SMARTFLOW_ADMIN_BOT_TOKEN'
    },
    SHEET_NAMES: { SETTINGS: 'Settings' },
    PropertiesService: {
      getScriptProperties() {
        return {
          getProperty() { return '123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcd'; }
        };
      }
    },
    SpreadsheetApp: {
      getActiveSpreadsheet() {
        return {
          getSheetByName() {
            return {
              getLastRow() { return rows.length + 1; },
              getRange() { return { getValues() { return rows.map((value) => [value]); } }; },
              deleteRow(rowNumber) { rows.splice(rowNumber - 2, 1); }
            };
          }
        };
      }
    },
    resetSettingsCache() {},
    addAuditLog() {},
    Logger: { log() {} }
  });

  const result = cleanupApp.migrateRemoveLegacyBotTokenSettings();

  assert.deepEqual(rows, ['Language', 'TimeZone']);
  assert.deepEqual(Array.from(result.deletedRows), ['ClientBotToken', 'AdminBotToken']);
});
