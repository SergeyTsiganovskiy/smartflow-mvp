import assert from 'node:assert/strict';
import test from 'node:test';
import { loadAppsScript } from './load-apps-script.mjs';

const recipientsApp = loadAppsScript(['AdminAccess.gs', 'Requests.gs']);

test('all configured administrators receive notifications with recipient deduplication', () => {
  const adminIds = Array.from(recipientsApp.getAdminTelegramIds({ AdminTelegramIds: '111,222,111' }));
  const recipients = Array.from(
    recipientsApp.mergeAdminNotificationRecipients(adminIds, [
      { telegram_id: '222', name: 'Duplicate admin' },
      { telegram_id: '333', name: 'Additional recipient' }
    ])
  );

  assert.deepEqual(
    recipients.map((item) => String(item.telegram_id)),
    ['111', '222', '333']
  );
});

test('unauthorized Admin Bot callback is rejected before business routing', () => {
  const calls = [];
  const app = loadAppsScript(['Code.gs'], {
    getSettings() { return { AdminBotToken: 'admin-token' }; },
    isAdminUser() { return false; },
    getMessage() { return 'Access denied'; },
    MESSAGE_KEYS: { ADMIN_ACCESS_DENIED: 'ADMIN_ACCESS_DENIED' },
    answerTelegramCallbackQuery(...args) { calls.push(['answer', ...args]); },
    addAuditLog(...args) { calls.push(['audit', ...args]); },
    processRequestApproveOption() { calls.push(['approve']); },
    processRequestReject() { calls.push(['reject']); }
  });

  app.handleAdminCallback({ id: 'callback-1', from: { id: 999 }, data: 'reject_request|req_1' });

  assert.equal(calls.some((entry) => entry[0] === 'approve' || entry[0] === 'reject'), false);
  assert.deepEqual(calls[0], ['answer', 'admin-token', 'callback-1', 'Access denied', true]);
  assert.deepEqual(calls[1], ['audit', 'ADMIN_CALLBACK_ACCESS_DENIED', '999']);
});

test('processed request cannot be rejected by a stale second-admin callback', () => {
  const calls = [];
  const app = loadAppsScript(['RequestCallbacks.gs'], {
    getSettings() { return { AdminBotToken: 'admin-token' }; },
    isRequestAlreadyProcessed() { return true; },
    appointmentExistsForRequest() { return true; },
    getMessage() { return 'Already processed'; },
    MESSAGE_KEYS: { REQUEST_ALREADY_PROCESSED: 'REQUEST_ALREADY_PROCESSED' },
    editTelegramMessageReplyMarkup(...args) { calls.push(['remove-keyboard', ...args]); },
    sendTelegramMessage(...args) { calls.push(['send', ...args]); },
    updateRequestStatus() { calls.push(['update']); }
  });

  app.processRequestReject(
    { message: { chat: { id: 222 }, message_id: 10, text: 'Request' } },
    'req_1'
  );

  assert.deepEqual(calls, [
    ['remove-keyboard', 'admin-token', 222, 10],
    ['send', 'admin-token', 222, 'Already processed']
  ]);
});

test('processed request approval removes stale second-admin buttons', () => {
  const calls = [];
  const app = loadAppsScript(['RequestCallbacks.gs'], {
    getSettings() { return { AdminBotToken: 'admin-token' }; },
    getRequestById() { return { request_id: 'req_1' }; },
    getRequestOptionByPriority() { return { priority: 1 }; },
    appointmentExistsForRequest() { return true; },
    addAuditLog() {},
    getMessage() { return 'Already processed'; },
    MESSAGE_KEYS: { REQUEST_ALREADY_PROCESSED: 'REQUEST_ALREADY_PROCESSED' },
    editTelegramMessageReplyMarkup(...args) { calls.push(['remove-keyboard', ...args]); },
    sendTelegramMessage(...args) { calls.push(['send', ...args]); }
  });

  app.processRequestApproveOption(
    { message: { chat: { id: 222 }, message_id: 10, text: 'Request' } },
    'approve_option_1',
    'req_1'
  );

  assert.deepEqual(calls, [
    ['remove-keyboard', 'admin-token', 222, 10],
    ['send', 'admin-token', 222, 'Already processed']
  ]);
});
