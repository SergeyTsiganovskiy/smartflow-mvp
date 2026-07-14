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
  AUDIT_LOG: 'AuditLog',
  WEEK_DAYS: 'WeekDays'
};

let SETTINGS_CACHE = null;
let SETTINGS_CACHE_VERSION = null;
let SETTINGS_TOKEN_FALLBACK = null;

const BOT_TOKEN_PROPERTY_KEYS = {
  ClientBotToken: 'SMARTFLOW_CLIENT_BOT_TOKEN',
  AdminBotToken: 'SMARTFLOW_ADMIN_BOT_TOKEN'
};

function resolveBotTokenSettings(settings, properties) {
  const resolved = settings;
  let propertyTokenCount = 0;

  Object.keys(BOT_TOKEN_PROPERTY_KEYS).forEach(function (settingKey) {
    const propertyValue = String(properties.getProperty(BOT_TOKEN_PROPERTY_KEYS[settingKey]) || '').trim();

    if (propertyValue) {
      resolved[settingKey] = propertyValue;
      propertyTokenCount++;
    }
  });

  resolved.BotTokenStorage =
    propertyTokenCount === 2 ? 'SCRIPT_PROPERTIES' : propertyTokenCount === 0 ? 'SETTINGS_FALLBACK' : 'MIXED';

  return resolved;
}

function getSettingsCacheVersion() {
  return PropertiesService.getScriptProperties().getProperty('SETTINGS_CACHE_VERSION') || '0';
}

function getSettings() {
  const currentVersion = getSettingsCacheVersion();

  if (SETTINGS_CACHE && SETTINGS_CACHE_VERSION === currentVersion) {
    SETTINGS_CACHE.ClientBotToken = SETTINGS_TOKEN_FALLBACK.ClientBotToken;
    SETTINGS_CACHE.AdminBotToken = SETTINGS_TOKEN_FALLBACK.AdminBotToken;
    resolveBotTokenSettings(SETTINGS_CACHE, PropertiesService.getScriptProperties());
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

  SETTINGS_TOKEN_FALLBACK = {
    ClientBotToken: settings.ClientBotToken,
    AdminBotToken: settings.AdminBotToken
  };
  resolveBotTokenSettings(settings, PropertiesService.getScriptProperties());

  SETTINGS_CACHE = settings;
  SETTINGS_CACHE_VERSION = currentVersion;

  return SETTINGS_CACHE;
}

function resetSettingsCache() {
  SETTINGS_CACHE = null;
  SETTINGS_CACHE_VERSION = null;
  SETTINGS_TOKEN_FALLBACK = null;

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
