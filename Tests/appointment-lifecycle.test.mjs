import assert from 'node:assert/strict';
import test from 'node:test';
import { loadAppsScript } from './load-apps-script.mjs';

function createMutableSheet(headers, dataRows) {
  const rows = [headers, ...dataRows];

  return {
    rows,
    getDataRange() {
      return { getValues() { return rows.map((row) => [...row]); } };
    },
    getRange(row, column) {
      return {
        setValue(value) {
          rows[row - 1][column - 1] = value;
        }
      };
    },
    appendRow(row) {
      rows.push([...row]);
    }
  };
}

test('final booking action creates one request and returns Client Bot to main menu', () => {
  const calls = [];
  const session = { option_count: 1, customer_note: 'old value' };
  const app = loadAppsScript(['ClientBookingStateHandler.gs'], {
    STATES: { WAITING_CUSTOMER_NOTE: 'WAITING_CUSTOMER_NOTE' },
    MESSAGE_KEYS: { BOOK_APPOINTMENT: 'BOOK_APPOINTMENT', REQUEST_CREATED: 'REQUEST_CREATED' },
    getMessage(key) { return key === 'BOOK_APPOINTMENT' ? 'Book appointment' : 'Request created'; },
    setUserSessionValue(chatId, key, value) {
      calls.push(['session-value', chatId, key, value]);
      session[key] = value;
    },
    getUserSession() { return session; },
    finalizeRequestFromSession(currentSession) {
      calls.push(['finalize', currentSession.customer_note]);
      return 'req_1';
    },
    notifyAdminsAboutRequestFromSession(currentSession, requestId) {
      calls.push(['notify-admins', currentSession.customer_note, requestId]);
    },
    sendTelegramMessage(token, chatId, text) { calls.push(['send', token, chatId, text]); },
    clearUserSession(chatId) { calls.push(['clear-session', chatId]); },
    setUserState(chatId, state) { calls.push(['state', chatId, state]); },
    sendClientStartMenu(chatId, currentSettings, messageKey) {
      calls.push(['main-menu', chatId, currentSettings.ClientBotToken, messageKey]);
    }
  });

  app.handleClientBookingState(
    101,
    'Book appointment',
    'WAITING_CUSTOMER_NOTE',
    { ClientBotToken: 'client-token' }
  );

  assert.equal(calls.filter((call) => call[0] === 'finalize').length, 1);
  assert.deepEqual(calls.find((call) => call[0] === 'finalize'), ['finalize', '']);
  assert.deepEqual(calls.find((call) => call[0] === 'notify-admins'), ['notify-admins', '', 'req_1']);
  assert.equal(calls.some((call) => call[0] === 'send'), false);
  assert.deepEqual(calls.at(-1), ['main-menu', 101, 'client-token', 'REQUEST_CREATED']);
});

test('finalized booking persists one pending request and only complete options', () => {
  const requestHeaders = [
    'request_id', 'customer_id', 'service_id', 'provider_id', 'location_id',
    'status', 'created_at', 'customer_note'
  ];
  const optionHeaders = [
    'option_id', 'request_id', 'preferred_date', 'preferred_time',
    'priority', 'status', 'created_at'
  ];
  const requests = createMutableSheet(requestHeaders, []);
  const options = createMutableSheet(optionHeaders, []);
  let sequence = 0;
  const app = loadAppsScript(['RequestCommands.gs'], {
    SHEET_NAMES: { REQUESTS: 'Requests', REQUEST_OPTIONS: 'RequestOptions' },
    SpreadsheetApp: {
      getActiveSpreadsheet() {
        return {
          getSheetByName(name) { return name === 'Requests' ? requests : options; }
        };
      }
    },
    generateId(prefix) { sequence += 1; return prefix + '_' + sequence; },
    createOrUpdateCustomer() { return 'customer_1'; },
    addAuditLog() {}
  });
  const requestId = app.finalizeRequestFromSession({
    service_id: 'service_1',
    provider_id: 'provider_1',
    location_id: 'location_1',
    customer_note: '',
    option1_date: '2026-07-20',
    option1_time: '10:00',
    option2_date: '2026-07-21',
    option2_time: '11:00',
    option3_date: '2026-07-22'
  });

  assert.equal(requestId, 'req_1');
  assert.equal(requests.rows.length, 2);
  assert.equal(requests.rows[1][requestHeaders.indexOf('customer_id')], 'customer_1');
  assert.equal(requests.rows[1][requestHeaders.indexOf('status')], 'pending');
  assert.equal(options.rows.length, 3);
  assert.deepEqual(
    options.rows.slice(1).map((row) => row[optionHeaders.indexOf('priority')]),
    [1, 2]
  );
  assert.equal(options.rows.every((row, index) => index === 0 || row[optionHeaders.indexOf('request_id')] === requestId), true);
});

test('rescheduling updates dates and clears reminder and confirmation state', () => {
  const headers = [
    'appointment_id',
    'start_at',
    'end_at',
    'updated_at',
    'reminder_24h_sent_at',
    'reminder_2h_sent_at',
    'customer_confirmed',
    'customer_confirmed_at'
  ];
  const oldStart = new Date('2026-07-15T09:00:00Z');
  const oldEnd = new Date('2026-07-15T10:00:00Z');
  const sheet = createMutableSheet(headers, [
    ['appt_1', oldStart, oldEnd, new Date('2026-07-14T10:00:00Z'), 'sent', 'sent', true, 'confirmed-at']
  ]);
  const app = loadAppsScript(['Appointments.gs'], {
    SHEET_NAMES: { APPOINTMENTS: 'Appointments' },
    SpreadsheetApp: {
      getActiveSpreadsheet() {
        return { getSheetByName() { return sheet; } };
      }
    }
  });
  const newStart = new Date('2026-07-16T11:00:00Z');
  const newEnd = new Date('2026-07-16T12:00:00Z');

  app.updateAppointmentDateTime('appt_1', newStart, newEnd);

  const row = sheet.rows[1];
  assert.equal(row[headers.indexOf('start_at')], newStart);
  assert.equal(row[headers.indexOf('end_at')], newEnd);
  assert.equal(row[headers.indexOf('reminder_24h_sent_at')], '');
  assert.equal(row[headers.indexOf('reminder_2h_sent_at')], '');
  assert.equal(row[headers.indexOf('customer_confirmed')], '');
  assert.equal(row[headers.indexOf('customer_confirmed_at')], '');
  assert.equal(row[headers.indexOf('updated_at')] instanceof Date, true);
});

test('failed Calendar reschedule restores original dates, reminders, and confirmation', () => {
  const calls = [];
  const app = loadAppsScript(['ClientRescheduleStateHandler.gs'], {
    updateAppointmentDateTime(...args) { calls.push(['date-time', ...args]); },
    updateAppointmentField(...args) { calls.push(['field', ...args]); }
  });
  const appointment = {
    appointment_id: 'appt_1',
    reminder_24h_sent_at: 'sent-24h',
    reminder_2h_sent_at: 'sent-2h',
    customer_confirmed: true,
    customer_confirmed_at: 'confirmed-at'
  };

  app.restoreAppointmentAfterRescheduleCalendarFailure(appointment, 'old-start', 'old-end');

  assert.deepEqual(calls, [
    ['date-time', 'appt_1', 'old-start', 'old-end'],
    ['field', 'appt_1', 'reminder_24h_sent_at', 'sent-24h'],
    ['field', 'appt_1', 'reminder_2h_sent_at', 'sent-2h'],
    ['field', 'appt_1', 'customer_confirmed', true],
    ['field', 'appt_1', 'customer_confirmed_at', 'confirmed-at']
  ]);
});

test('confirmed cancellation updates storage, Calendar, admins, and sends an informational card', () => {
  const calls = [];
  const appointment = {
    appointment_id: 'appt_1',
    service_id: 'svc_1',
    provider_id: 'provider_1',
    location_id: 'location_1'
  };
  const app = loadAppsScript(['AppointmentCallbacks.gs'], {
    getSettings() { return { ClientBotToken: 'client-token' }; },
    getAppointmentById() { return appointment; },
    updateAppointmentStatus(...args) { calls.push(['status', ...args]); },
    deleteCalendarEvent(value) { calls.push(['calendar-delete', value.appointment_id]); },
    notifyAdminsAboutCancellation(value) { calls.push(['notify-admins', value.appointment_id]); },
    getMessage(key) { return key; },
    MESSAGE_KEYS: { APPOINTMENT_CANCELLED: 'APPOINTMENT_CANCELLED' },
    editTelegramMessage(...args) { calls.push(['edit', ...args]); },
    findServiceById() { return { name: 'Service' }; },
    findProviderById() { return { name: 'Provider' }; },
    findLocationById() { return { name: 'Location' }; },
    sendAppointmentCard(...args) { calls.push(['card', ...args]); }
  });

  app.handleAppointmentCallback({
    data: 'confirm_cancel|appt_1',
    message: { chat: { id: 101 }, message_id: 55 }
  });

  assert.deepEqual(calls[0], ['status', 'appt_1', 'cancelled']);
  assert.deepEqual(calls[1], ['calendar-delete', 'appt_1']);
  assert.deepEqual(calls[2], ['notify-admins', 'appt_1']);
  const card = calls.find((call) => call[0] === 'card');
  assert.equal(card.at(-1), false);
});

test('administrator approval creates one appointment and a repeated action cannot duplicate it', () => {
  const calls = [];
  let requestStatus = 'pending';
  let appointment = null;
  const app = loadAppsScript(['RequestCallbacks.gs'], {
    getSettings() { return { AdminBotToken: 'admin-token', ClientBotToken: 'client-token' }; },
    getRequestById() {
      return {
        request_id: 'req_1', customer_id: 'customer_1', service_id: 'svc_1',
        provider_id: 'provider_1', location_id: 'location_1'
      };
    },
    getRequestOptionByPriority() {
      return { priority: 1, preferred_date: '2026-07-20', preferred_time: '10:00' };
    },
    isRequestAlreadyProcessed() { return requestStatus !== 'pending'; },
    getAppointmentByRequestId() { return appointment; },
    createAppointmentFromRequest() {
      calls.push(['create-appointment']);
      appointment = { appointment_id: 'appt_1', calendar_event_id: '' };
      return 'appt_1';
    },
    createCalendarEventForAppointment(id) {
      calls.push(['create-calendar', id]);
      appointment.calendar_event_id = 'event_1';
      return 'event_1';
    },
    updateCustomerStatus(...args) { calls.push(['customer-status', ...args]); },
    updateRequestStatus(...args) {
      calls.push(['request-status', ...args]);
      requestStatus = args[1];
    },
    updateRequestOptionsAfterApproval(...args) { calls.push(['option-status', ...args]); },
    getCustomerById() { return { telegram_id: '501' }; },
    findServiceById() { return { name: 'Service' }; },
    findProviderById() { return { name: 'Provider' }; },
    findLocationById() { return { name: 'Location' }; },
    getRequestOptionsByRequestId() { return [{ priority: 1 }]; },
    buildAdminRequestConfirmedText() { return 'Confirmed'; },
    editTelegramMessage(...args) { calls.push(['edit-admin', ...args]); },
    editTelegramMessageReplyMarkup(...args) { calls.push(['remove-keyboard', ...args]); },
    sendTelegramMessage(...args) { calls.push(['send', ...args]); },
    formatDateForDisplay(value) { return value; },
    formatTimeForDisplay(value) { return value; },
    getMessage(key) { return key; },
    MESSAGE_KEYS: {
      REQUEST_APPROVED_CLIENT: 'REQUEST_APPROVED_CLIENT',
      REQUEST_ALREADY_PROCESSED: 'REQUEST_ALREADY_PROCESSED'
    },
    addAuditLog() {}
  });
  const callback = { message: { chat: { id: 202 }, message_id: 77 } };

  app.processRequestApproveOption(callback, 'approve_option_1', 'req_1');
  app.processRequestApproveOption(callback, 'approve_option_1', 'req_1');

  assert.equal(calls.filter((call) => call[0] === 'create-appointment').length, 1);
  assert.deepEqual(calls.find((call) => call[0] === 'create-calendar'), ['create-calendar', 'appt_1']);
  assert.deepEqual(calls.find((call) => call[0] === 'request-status'), ['request-status', 'req_1', 'confirmed']);
  assert.equal(calls.filter((call) => call[0] === 'remove-keyboard').length, 1);
});

test('Calendar failure keeps request retryable and reuses the incomplete appointment', () => {
  const calls = [];
  let appointment = null;
  let calendarAttempt = 0;
  let requestStatus = 'pending';
  const app = loadAppsScript(['RequestCallbacks.gs'], {
    getSettings() { return { AdminBotToken: 'admin-token', ClientBotToken: 'client-token' }; },
    getRequestById() {
      return {
        request_id: 'req_1', customer_id: 'customer_1', service_id: 'svc_1',
        provider_id: 'provider_1', location_id: 'location_1'
      };
    },
    getRequestOptionByPriority() {
      return { priority: 1, preferred_date: '2026-07-20', preferred_time: '10:00' };
    },
    isRequestAlreadyProcessed() { return requestStatus !== 'pending'; },
    getAppointmentByRequestId() { return appointment; },
    createAppointmentFromRequest() {
      calls.push(['create-appointment']);
      appointment = { appointment_id: 'appt_1', calendar_event_id: '' };
      return appointment.appointment_id;
    },
    createCalendarEventForAppointment() {
      calendarAttempt += 1;
      calls.push(['calendar-attempt', calendarAttempt]);
      if (calendarAttempt === 1) return '';
      appointment.calendar_event_id = 'event_1';
      return 'event_1';
    },
    updateCustomerStatus(...args) { calls.push(['customer-status', ...args]); },
    updateRequestStatus(requestId, status) {
      calls.push(['request-status', requestId, status]);
      requestStatus = status;
    },
    updateRequestOptionsAfterApproval(...args) { calls.push(['option-status', ...args]); },
    getCustomerById() { return null; },
    findServiceById() { return null; },
    findProviderById() { return null; },
    findLocationById() { return null; },
    getRequestOptionsByRequestId() { return [{ priority: 1 }]; },
    buildAdminRequestConfirmedText() { return 'Confirmed'; },
    editTelegramMessage(...args) { calls.push(['edit-admin', ...args]); },
    editTelegramMessageReplyMarkup() {},
    sendTelegramMessage(...args) { calls.push(['send', ...args]); },
    getMessage(key) { return key; },
    MESSAGE_KEYS: {
      REQUEST_CALENDAR_ERROR: 'REQUEST_CALENDAR_ERROR',
      REQUEST_ALREADY_PROCESSED: 'REQUEST_ALREADY_PROCESSED'
    },
    addAuditLog() {}
  });
  const callback = { message: { chat: { id: 202 }, message_id: 77 } };

  app.processRequestApproveOption(callback, 'approve_option_1', 'req_1');
  assert.equal(requestStatus, 'pending');
  assert.equal(calls.filter((call) => call[0] === 'create-appointment').length, 1);
  assert.equal(calls.some((call) => call.includes('REQUEST_CALENDAR_ERROR')), true);

  app.processRequestApproveOption(callback, 'approve_option_1', 'req_1');
  assert.equal(requestStatus, 'confirmed');
  assert.equal(calls.filter((call) => call[0] === 'create-appointment').length, 1);
  assert.equal(calls.filter((call) => call[0] === 'calendar-attempt').length, 2);
});

test('appointment cancellation deletes the event from the provider calendar', () => {
  const calls = [];
  const event = { deleteEvent() { calls.push(['delete-event']); } };
  const calendar = { getEventById(id) { calls.push(['get-event', id]); return event; } };
  const app = loadAppsScript(['CalendarEvents.gs'], {
    getProviderCalendarId(providerId) {
      calls.push(['provider-calendar', providerId]);
      return 'provider-calendar-id';
    },
    CalendarApp: {
      getCalendarById(id) { calls.push(['get-calendar', id]); return calendar; },
      getDefaultCalendar() { throw new Error('default calendar must not be used'); }
    },
    addAuditLog(...args) { calls.push(['audit', ...args]); }
  });

  const result = app.deleteCalendarEvent({
    appointment_id: 'appt_1', provider_id: 'provider_1', calendar_event_id: 'event_1'
  });

  assert.equal(result, true);
  assert.deepEqual(calls, [
    ['provider-calendar', 'provider_1'],
    ['get-calendar', 'provider-calendar-id'],
    ['get-event', 'event_1'],
    ['delete-event']
  ]);
});

test('administrator rejection is applied once and a repeated action only removes stale buttons', () => {
  const calls = [];
  let status = 'pending';
  const app = loadAppsScript(['RequestCallbacks.gs'], {
    getSettings() { return { AdminBotToken: 'admin-token', ClientBotToken: 'client-token' }; },
    isRequestAlreadyProcessed() { return status !== 'pending'; },
    appointmentExistsForRequest() { return false; },
    updateRequestStatus(requestId, nextStatus) {
      calls.push(['request-status', requestId, nextStatus]);
      status = nextStatus;
    },
    updateRequestOptionsAfterApproval(...args) { calls.push(['option-status', ...args]); },
    getRequestById() { return { customer_id: 'customer_1' }; },
    getCustomerById() { return { telegram_id: '501' }; },
    editTelegramMessageReplyMarkup(...args) { calls.push(['remove-keyboard', ...args]); },
    editTelegramMessage(...args) { calls.push(['edit-admin', ...args]); },
    sendTelegramMessage(...args) { calls.push(['send', ...args]); },
    getMessage(key) { return key; },
    MESSAGE_KEYS: {
      REQUEST_ALREADY_PROCESSED: 'REQUEST_ALREADY_PROCESSED',
      ADMIN_REQUEST_REJECTED_STATUS: 'ADMIN_REQUEST_REJECTED_STATUS',
      REQUEST_REJECTED_CLIENT: 'REQUEST_REJECTED_CLIENT'
    }
  });
  const callback = { message: { chat: { id: 202 }, message_id: 77, text: 'Request' } };

  app.processRequestReject(callback, 'req_1');
  app.processRequestReject(callback, 'req_1');

  assert.equal(calls.filter((call) => call[0] === 'request-status').length, 1);
  assert.deepEqual(calls.find((call) => call[0] === 'option-status'), ['option-status', 'req_1', 0]);
  assert.equal(calls.filter((call) => call[0] === 'remove-keyboard').length, 1);
});

test('completed visit synchronization upserts the same Calendar event without duplication', () => {
  const calls = [];
  let existingVisit = null;
  const visit = {
    source: 'appointment', appointment_id: 'appt_1', calendar_event_id: 'event_1',
    phone: '0501112233', customer_name: 'Customer', service_id: 'service_1',
    service_name: 'Service', provider_id: 'provider_1', provider_name: 'Provider',
    location_id: 'location_1', location_name: 'Location',
    start_at: new Date('2026-07-20T10:00:00Z'), end_at: new Date('2026-07-20T11:00:00Z'),
    status: 'confirmed', customer_note: ''
  };
  const app = loadAppsScript(['CustomerVisitHistorySync.gs'], {
    findCustomerVisitByCalendarEventId() { return existingVisit; },
    createCustomerVisitHistory(value) {
      calls.push(['create', value.calendar_event_id]);
      existingVisit = { visit_id: 'visit_1', ...value };
    },
    updateCustomerVisitHistory(...args) { calls.push(['update', ...args]); }
  });

  app.upsertCustomerVisit(visit);
  app.upsertCustomerVisit(visit);

  assert.deepEqual(calls, [['create', 'event_1']]);
});

test('a busy interval blocks only the selected provider', () => {
  const app = loadAppsScript(['Availability.gs'], {
    getProviderScheduleForDate() {
      return { is_working: true, start_time: '09:00', end_time: '12:00' };
    },
    timeToMinutes(value) {
      const [hours, minutes] = value.split(':').map(Number);
      return hours * 60 + minutes;
    },
    minutesToTime(value) {
      return String(Math.floor(value / 60)).padStart(2, '0') + ':' + String(value % 60).padStart(2, '0');
    },
    isSameDate() { return false; },
    getProviderAppointmentsForDate(providerId) {
      return providerId === 'provider_a' ? [{ startTime: '10:00', endTime: '11:00' }] : [];
    },
    extractTimeFromDateTime() { return ''; }
  });

  const providerA = Array.from(app.getAvailableTimeSlots('provider_a', '2026-07-20', 60));
  const providerB = Array.from(app.getAvailableTimeSlots('provider_b', '2026-07-20', 60));

  assert.equal(providerA.includes('10:00'), false);
  assert.equal(providerB.includes('10:00'), true);
});

test('manual Calendar interval blocks its provider with normal overlap rules', () => {
  const app = loadAppsScript(['Availability.gs'], {
    getProviderScheduleForDate() {
      return { is_working: true, start_time: '09:00', end_time: '12:00' };
    },
    timeToMinutes(value) {
      const [hours, minutes] = value.split(':').map(Number);
      return hours * 60 + minutes;
    },
    minutesToTime(value) {
      return String(Math.floor(value / 60)).padStart(2, '0') + ':' + String(value % 60).padStart(2, '0');
    },
    isSameDate() { return false; },
    getProviderAppointmentsForDate() {
      return [{ startTime: '10:15', endTime: '10:45', source: 'calendar' }];
    },
    extractTimeFromDateTime() { return ''; }
  });

  const slots = Array.from(app.getAvailableTimeSlots('provider_a', '2026-07-20', 30));

  assert.equal(slots.includes('10:00'), false);
  assert.equal(slots.includes('10:30'), false);
  assert.equal(slots.includes('11:00'), true);
});
