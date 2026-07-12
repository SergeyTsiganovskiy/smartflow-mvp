const SHEET_NAMES = {
  SETTINGS: 'Settings',
  MESSAGES: 'Messages',
  USER_STATES: 'UserStates',
  USER_SESSIONS: 'UserSessions',
  CUSTOMERS: 'Customers',
  CUSTOMER_PROFILES: 'CustomerProfiles',
  CUSTOMER_VISIT_HISTORY: 'CustomerVisitHistory',
  CUSTOMER_CONFLICTS: 'CustomerConflicts',
  CUSTOMER_SERVICE_SETTINGS: 'CustomerServiceSettings',
  LOCATIONS: 'Locations',
  PROVIDERS: 'Providers',
  PROVIDER_SCHEDULE: 'ProviderSchedule',
  PROVIDER_SCHEDULE_OVERRIDES: 'ProviderScheduleOverrides',
  SERVICES: 'Services',
  REQUESTS: 'Requests',
  REQUEST_OPTIONS: 'RequestOptions',
  REQUEST_RECIPIENTS: 'RequestRecipients',
  APPOINTMENTS: 'Appointments',
  CALENDAR_CACHE: 'CalendarCache',
  AUDIT_LOG: 'AuditLog',
  WEEK_DAYS: 'WeekDays'
};

let SETTINGS_CACHE = null;

function getSettings() {
  if (SETTINGS_CACHE) {
    return SETTINGS_CACHE;
  }

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.SETTINGS);

  const rows = sheet.getDataRange().getValues();

  const settings = {};

  for (let i = 1; i < rows.length; i++) {
    const key = rows[i][0];
    const value = rows[i][1];

    if (key) {
      settings[key] = value;
    }
  }

  SETTINGS_CACHE = settings;

  return SETTINGS_CACHE;
}

function resetSettingsCache() {
  SETTINGS_CACHE = null;
}
