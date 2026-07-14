import assert from 'node:assert/strict';
import test from 'node:test';
import { loadAppsScript } from './load-apps-script.mjs';

function createHarness(initial = {}) {
  const values = { ...initial };
  let lockDepth = 0;
  const properties = {
    getProperty(key) {
      return values[key] || null;
    },
    setProperty(key, value) {
      values[key] = String(value);
    },
    deleteProperty(key) {
      delete values[key];
    }
  };
  const app = loadAppsScript(['TelegramUpdateGuard.gs'], {
    PropertiesService: { getScriptProperties() { return properties; } },
    LockService: {
      getScriptLock() {
        return {
          waitLock() { lockDepth++; },
          releaseLock() { lockDepth--; }
        };
      }
    }
  });

  return { app, values, getLockDepth() { return lockDepth; } };
}

test('successful Telegram update is processed once', () => {
  const harness = createHarness();
  let calls = 0;

  assert.equal(harness.app.processTelegramUpdateOnce(101, 'client', () => { calls++; }).duplicate, false);
  assert.equal(harness.app.processTelegramUpdateOnce(101, 'client', () => { calls++; }).duplicate, true);
  assert.equal(calls, 1);
  assert.equal(harness.getLockDepth(), 0);
});

test('failed Telegram update is not marked as processed', () => {
  const harness = createHarness();

  assert.throws(() => harness.app.processTelegramUpdateOnce(102, 'admin', () => { throw new Error('failure'); }));
  const retry = harness.app.processTelegramUpdateOnce(102, 'admin', () => {});

  assert.equal(retry.duplicate, false);
  assert.equal(harness.getLockDepth(), 0);
});

test('out-of-order Telegram update IDs are processed independently', () => {
  const harness = createHarness();
  const processed = [];

  harness.app.processTelegramUpdateOnce(200, 'client', () => { processed.push(200); });
  harness.app.processTelegramUpdateOnce(199, 'client', () => { processed.push(199); });

  assert.deepEqual(processed, [200, 199]);
});

test('client and admin update histories are isolated', () => {
  const harness = createHarness();
  let calls = 0;

  harness.app.processTelegramUpdateOnce(300, 'client', () => { calls++; });
  harness.app.processTelegramUpdateOnce(300, 'admin', () => { calls++; });

  assert.equal(calls, 2);
});

test('legacy last update ID is migrated without replay', () => {
  const harness = createHarness({ CLIENT_LAST_UPDATE_ID: '400' });
  let calls = 0;

  const result = harness.app.processTelegramUpdateOnce(400, 'client', () => { calls++; });

  assert.equal(result.duplicate, true);
  assert.equal(calls, 0);
  assert.equal(harness.values.CLIENT_LAST_UPDATE_ID, undefined);
  assert.ok(harness.values.TELEGRAM_PROCESSED_UPDATES_CLIENT);
});

test('Telegram update history stays within the bounded property payload', () => {
  const harness = createHarness();
  const now = Date.now();
  const history = Array.from({ length: 400 }, (_, index) => [String(100000000 + index), now]);
  const pruned = Array.from(harness.app.pruneTelegramUpdateHistory(history, now));

  assert.equal(pruned.length, 250);
  assert.ok(JSON.stringify(pruned).length < 9000);
});
