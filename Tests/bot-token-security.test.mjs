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

test('legacy Settings fallback remains available before migration', () => {
  const settings = app.resolveBotTokenSettings(
    { ClientBotToken: 'legacy-client', AdminBotToken: 'legacy-admin' },
    properties({})
  );

  assert.equal(settings.ClientBotToken, 'legacy-client');
  assert.equal(settings.AdminBotToken, 'legacy-admin');
  assert.equal(settings.BotTokenStorage, 'SETTINGS_FALLBACK');
});

test('mixed token storage is visible to health diagnostics', () => {
  const settings = app.resolveBotTokenSettings(
    { ClientBotToken: 'legacy-client', AdminBotToken: 'legacy-admin' },
    properties({ SMARTFLOW_CLIENT_BOT_TOKEN: 'secure-client' })
  );

  assert.equal(settings.ClientBotToken, 'secure-client');
  assert.equal(settings.AdminBotToken, 'legacy-admin');
  assert.equal(settings.BotTokenStorage, 'MIXED');
});
