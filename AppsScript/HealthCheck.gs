const HEALTH_CHECK_SCHEMAS = {
  Settings: ['key', 'value'],
  Messages: ['key', 'uk', 'ru', 'en'],
  UserStates: ['telegram_id', 'state', 'updated_at'],
  UserSessions: ['telegram_id', 'session_data', 'updated_at'],
  Customers: ['customer_id', 'telegram_id', 'name', 'phone'],
  CustomerProfiles: ['profile_id', 'phone', 'phone_key', 'name'],
  CustomerVisitHistory: ['visit_id', 'phone', 'phone_key', 'customer_name'],
  CustomerConflicts: ['conflict_id', 'phone', 'phone_key', 'customer_name'],
  CustomerServiceSettings: ['profile_id', 'phone', 'phone_key', 'service_id'],
  Locations: ['location_id', 'name', 'active'],
  Providers: ['provider_id', 'location_id', 'name', 'calendar_id', 'active'],
  ProviderSchedule: ['provider_id', 'day_of_week', 'start_time', 'end_time', 'is_working'],
  ProviderScheduleOverrides: ['override_id', 'provider_id', 'date', 'is_working', 'active'],
  Services: ['service_id', 'location_id', 'name', 'duration_min', 'duration_max', 'active'],
  Requests: ['request_id', 'customer_id', 'service_id', 'provider_id', 'location_id', 'status'],
  RequestOptions: ['option_id', 'request_id', 'preferred_date', 'preferred_time', 'priority', 'status'],
  RequestRecipients: ['telegram_id', 'receive_new_requests', 'active'],
  Appointments: ['appointment_id', 'request_id', 'customer_id', 'start_at', 'end_at', 'status'],
  AuditLog: ['timestamp', 'action', 'details'],
  WeekDays: ['day_code', 'sort_order', 'active', 'message_key']
};

function createHealthCheckItem(code, ok, details) {
  return { code: code, ok: ok === true, details: String(details || '') };
}

function getMissingHeaders(actualHeaders, requiredHeaders) {
  const available = {};

  actualHeaders.forEach(function (header) {
    available[String(header || '').trim()] = true;
  });

  return requiredHeaders.filter(function (header) {
    return !available[header];
  });
}

function checkHealthSchema(spreadsheet) {
  const missingSheets = [];
  const invalidSheets = [];

  Object.keys(HEALTH_CHECK_SCHEMAS).forEach(function (sheetName) {
    const sheet = spreadsheet.getSheetByName(sheetName);

    if (!sheet) {
      missingSheets.push(sheetName);
      return;
    }

    const expected = HEALTH_CHECK_SCHEMAS[sheetName];
    const actual = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), expected.length)).getValues()[0];
    const missingHeaders = getMissingHeaders(actual, expected);

    if (missingHeaders.length > 0) {
      invalidSheets.push(sheetName + ': ' + missingHeaders.join(', '));
    }
  });

  if (missingSheets.length > 0 || invalidSheets.length > 0) {
    return createHealthCheckItem(
      'SCHEMA',
      false,
      ['missing sheets=' + (missingSheets.join(', ') || '-'), 'missing columns=' + (invalidSheets.join('; ') || '-')].join(
        ' | '
      )
    );
  }

  return createHealthCheckItem('SCHEMA', true, String(Object.keys(HEALTH_CHECK_SCHEMAS).length) + ' required sheets');
}

function isConfiguredSecret(value) {
  const text = String(value || '').trim();
  return Boolean(text) && text.indexOf('PASTE_') !== 0;
}

function normalizeHealthTimezone(value) {
  const timezone = String(value || '').trim();
  const aliases = {
    'Europe/Kiev': 'Europe/Kyiv'
  };

  return aliases[timezone] || timezone;
}

function checkHealthSettings(settings, spreadsheet, scriptTimezone) {
  const problems = [];
  const spreadsheetTimezone = spreadsheet.getSpreadsheetTimeZone();
  const timezone = String(settings.TimeZone || '').trim();
  const normalizedTimezone = normalizeHealthTimezone(timezone);
  const normalizedSpreadsheetTimezone = normalizeHealthTimezone(spreadsheetTimezone);
  const normalizedScriptTimezone = normalizeHealthTimezone(scriptTimezone);

  if (
    !normalizedTimezone ||
    normalizedTimezone !== normalizedSpreadsheetTimezone ||
    normalizedTimezone !== normalizedScriptTimezone
  ) {
    problems.push(
      'TimeZone mismatch: Settings=' +
        (timezone || '-') +
        ', spreadsheet=' +
        (spreadsheetTimezone || '-') +
        ', Apps Script=' +
        (scriptTimezone || '-')
    );
  }

  if (!isConfiguredSecret(settings.ClientBotToken)) {
    problems.push('ClientBotToken is missing');
  }

  if (!isConfiguredSecret(settings.AdminBotToken)) {
    problems.push('AdminBotToken is missing');
  }

  if (!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(String(settings.AppsScriptUrl || '').trim())) {
    problems.push('AppsScriptUrl must be a production /exec URL');
  }

  if (!String(settings.AdminTelegramIds || '').split(',').some(function (id) { return /^\d+$/.test(id.trim()); })) {
    problems.push('AdminTelegramIds has no numeric administrator ID');
  }

  const bookingDays = Number(settings.BookingDaysAhead);
  const pageSize = Number(settings.PaginationPageSize);

  if (!Number.isInteger(bookingDays) || bookingDays < 1 || bookingDays > 365) {
    problems.push('BookingDaysAhead must be 1-365');
  }

  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 10) {
    problems.push('PaginationPageSize must be 1-10');
  }

  return createHealthCheckItem('SETTINGS', problems.length === 0, problems.join('; ') || 'required settings are valid');
}

function checkHealthCalendars(providers, defaultCalendarId) {
  const missingCalendarProviders = [];

  providers.forEach(function (provider) {
    const calendarId = String(provider.calendar_id || defaultCalendarId || '').trim();

    if (!calendarId || !CalendarApp.getCalendarById(calendarId)) {
      missingCalendarProviders.push(String(provider.provider_id || provider.id || 'unknown'));
    }
  });

  return createHealthCheckItem(
    'CALENDARS',
    missingCalendarProviders.length === 0,
    missingCalendarProviders.length === 0
      ? String(providers.length) + ' active provider calendars are accessible'
      : 'inaccessible calendar for provider IDs: ' + missingCalendarProviders.join(', ')
  );
}

function getHealthWebhookResult(botToken, expectedUrl) {
  if (!isConfiguredSecret(botToken)) {
    return false;
  }

  const response = UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + '/getWebhookInfo', {
    method: 'get',
    muteHttpExceptions: true
  });
  const status = response.getResponseCode();

  if (status < 200 || status >= 300) {
    return false;
  }

  const payload = JSON.parse(response.getContentText());
  return payload.ok === true && payload.result && String(payload.result.url || '') === expectedUrl;
}

function checkHealthWebhooks(settings) {
  const baseUrl = String(settings.AppsScriptUrl || '').trim();
  const clientOk = getHealthWebhookResult(settings.ClientBotToken, baseUrl + '?bot=client');
  const adminOk = getHealthWebhookResult(settings.AdminBotToken, baseUrl + '?bot=admin');

  return createHealthCheckItem(
    'WEBHOOKS',
    clientOk && adminOk,
    'client=' + (clientOk ? 'OK' : 'ERROR') + ', admin=' + (adminOk ? 'OK' : 'ERROR')
  );
}

function checkHealthTriggers(triggers, reminderEnabled) {
  const counts = {};

  triggers.forEach(function (trigger) {
    const handler = trigger.getHandlerFunction();
    counts[handler] = (counts[handler] || 0) + 1;
  });

  const required = ['syncCompletedCustomerVisitsTrigger'];

  if (isSettingEnabled(reminderEnabled, true)) {
    required.push('send24hAppointmentReminders');
  }

  const missing = required.filter(function (handler) { return !counts[handler]; });
  const duplicates = Object.keys(counts).filter(function (handler) { return counts[handler] > 1; });

  return createHealthCheckItem(
    'TRIGGERS',
    missing.length === 0 && duplicates.length === 0,
    'missing=' + (missing.join(', ') || '-') + ' | duplicates=' + (duplicates.join(', ') || '-')
  );
}

function checkHealthRecipients(recipients) {
  return createHealthCheckItem(
    'REQUEST_RECIPIENTS',
    recipients.length > 0,
    recipients.length > 0 ? String(recipients.length) + ' active recipient(s)' : 'no active request recipient'
  );
}

function runSmartFlowHealthCheck() {
  const checks = [];
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  try {
    checks.push(checkHealthSchema(spreadsheet));
  } catch (error) {
    checks.push(createHealthCheckItem('SCHEMA', false, 'check failed'));
  }

  let settings = {};

  try {
    settings = getSettings();
    checks.push(checkHealthSettings(settings, spreadsheet, Session.getScriptTimeZone()));
  } catch (error) {
    checks.push(createHealthCheckItem('SETTINGS', false, 'check failed'));
  }

  try {
    checks.push(checkHealthCalendars(getProviders(), settings.DefaultCalendarId));
  } catch (error) {
    checks.push(createHealthCheckItem('CALENDARS', false, 'check failed'));
  }

  try {
    checks.push(checkHealthWebhooks(settings));
  } catch (error) {
    checks.push(createHealthCheckItem('WEBHOOKS', false, 'check failed'));
  }

  try {
    checks.push(checkHealthTriggers(ScriptApp.getProjectTriggers(), settings.ReminderDayBefore));
  } catch (error) {
    checks.push(createHealthCheckItem('TRIGGERS', false, 'check failed'));
  }

  try {
    checks.push(checkHealthRecipients(getAdminNotificationRecipients(settings)));
  } catch (error) {
    checks.push(createHealthCheckItem('REQUEST_RECIPIENTS', false, 'check failed'));
  }

  const failed = checks.filter(function (check) { return !check.ok; }).length;
  const report = {
    ok: failed === 0,
    checked_at: new Date().toISOString(),
    passed: checks.length - failed,
    failed: failed,
    checks: checks
  };

  Logger.log(JSON.stringify(report));
  return report;
}
