import assert from 'node:assert/strict';
import test from 'node:test';
import { loadAppsScript } from './load-apps-script.mjs';

function loadTelegramWithResponse(responseCode, responseText, auditCalls) {
  return loadAppsScript(['Telegram.gs'], {
    UrlFetchApp: {
      fetch() {
        return {
          getResponseCode() { return responseCode; },
          getContentText() { return responseText; }
        };
      }
    },
    addAuditLog(...args) { auditCalls.push(args); }
  });
}

test('successful Telegram response is returned without diagnostic log noise', () => {
  const audits = [];
  const app = loadTelegramWithResponse(200, '{"ok":true,"result":{"message_id":1}}', audits);

  const result = app.sendTelegramMessage('secret-token', 501, 'Hello');

  assert.equal(JSON.parse(result).ok, true);
  assert.deepEqual(audits, []);
});

test('Telegram API failure is logged without token, chat ID, or message text', () => {
  const audits = [];
  const app = loadTelegramWithResponse(
    403,
    '{"ok":false,"error_code":403,"description":"Forbidden: bot was blocked by the user"}',
    audits
  );

  app.sendTelegramMessage('secret-token', 501, 'private message');

  assert.equal(audits.length, 1);
  assert.equal(audits[0][0], 'TELEGRAM_API_ERROR');
  assert.match(audits[0][1], /"method":"sendMessage"/);
  assert.equal(audits[0][1].includes('secret-token'), false);
  assert.equal(audits[0][1].includes('501'), false);
  assert.equal(audits[0][1].includes('private message'), false);
});

test('invalid Telegram response body is diagnosed without exposing its contents', () => {
  const audits = [];
  const app = loadTelegramWithResponse(502, '<html>temporary proxy failure</html>', audits);

  app.editTelegramMessage('secret-token', 501, 10, 'private message');

  assert.equal(audits.length, 1);
  assert.match(audits[0][1], /INVALID_JSON_RESPONSE/);
  assert.equal(audits[0][1].includes('temporary proxy failure'), false);
});
