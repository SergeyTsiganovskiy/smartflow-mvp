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
let SETTINGS_CACHE_VERSION = null;

function getSettingsCacheVersion() {
  return PropertiesService.getScriptProperties().getProperty('SETTINGS_CACHE_VERSION') || '0';
}

function getSettings() {
  const currentVersion = getSettingsCacheVersion();

  if (SETTINGS_CACHE && SETTINGS_CACHE_VERSION === currentVersion) {
    return SETTINGS_CACHE;
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.SETTINGS);

  const rows = sheet.getDataRange().getValues();

  const settings = {};

  for (let i = 1; i < rows.length; i++) {
    const key = String(rows[i][0] || '').trim();
    const value = rows[i][1];

    if (key) {
      settings[key] = value;
    }
  }

  SETTINGS_CACHE = settings;
  SETTINGS_CACHE_VERSION = currentVersion;

  return SETTINGS_CACHE;
}

function resetSettingsCache() {
  SETTINGS_CACHE = null;
  SETTINGS_CACHE_VERSION = null;

  PropertiesService.getScriptProperties().setProperty('SETTINGS_CACHE_VERSION', Utilities.getUuid());
}

function isSettingEnabled(value, defaultValue) {
  if (value === '' || value === null || value === undefined) {
    return defaultValue === true;
  }

  if (value === true || value === false) {
    return value;
  }

  return String(value).trim().toUpperCase() === 'TRUE';
}
