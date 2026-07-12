let PROVIDERS_CACHE = null;
let PROVIDERS_INCLUDING_INACTIVE_CACHE = null;

function getProviders() {
  if (PROVIDERS_CACHE) {
    return PROVIDERS_CACHE;
  }

  const providers =
    getProvidersIncludingInactive()
      .filter(function(provider) {
        return String(provider.active).toUpperCase() === 'TRUE' ||
          provider.active === true;
      });

  PROVIDERS_CACHE = providers;

  return PROVIDERS_CACHE;
}

function getInactiveProviders() {
  return getProvidersIncludingInactive()
    .filter(function(provider) {
      return provider.active !== true;
    });
}

function findInactiveProviderByName(name) {
  const targetName = String(name || '').trim();

  return getInactiveProviders().find(function(provider) {
    return String(provider.name || '').trim() === targetName;
  }) || null;
}

function getProvidersIncludingInactive() {

  if (PROVIDERS_INCLUDING_INACTIVE_CACHE) {
    return PROVIDERS_INCLUDING_INACTIVE_CACHE;
  }

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.PROVIDERS);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map(function(header) {
    return String(header).trim();
  });

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function(header, index) {
      item[header] = rows[i][index];
    });

    const nameKey = String(item.name_key || '').trim();

    result.push({
      id: item.provider_id,
      provider_id: item.provider_id,
      location_id: item.location_id,
      name_key: nameKey,
      name: getMessage(nameKey),
      phone: item.phone,
      telegram_id: item.telegram_id,
      calendar_id: item.calendar_id,
      active: String(item.active).toUpperCase() === 'TRUE'
    });
  }

  PROVIDERS_INCLUDING_INACTIVE_CACHE = result;
  return result;
}

function getNextWorkingDateForProvider(providerId) {
  const settings = getSettings();
  const timezone = settings.TimeZone || 'Europe/Kyiv';

  const today = new Date();

  const cacheDays =
    Number(
      settings.CalendarCacheDays || 30
    );

  for (let i = 1; i <= cacheDays; i++) {
    const date = new Date(today);

    date.setDate(
      date.getDate() + i
    );

    const dateString =
      Utilities.formatDate(
        date,
        timezone,
        'yyyy-MM-dd'
      );

    if (isProviderWorkingOnDate(providerId, dateString)) {
      return dateString;
    }
  }

  return '';
}

function isProviderWorkingOnDate(
  providerId,
  dateValue
) {
  const override =
    getProviderOverrideForDate(
      providerId,
      dateValue
    );

  if (override) {
    return (
      String(override.is_working).toUpperCase() === 'TRUE' ||
      override.is_working === true
    );
  }

  const schedule =
    getProviderScheduleForDate(
      providerId,
      dateValue
    );

  if (!schedule) {
    return false;
  }

  return (
    String(schedule.is_working).toUpperCase() === 'TRUE' ||
    schedule.is_working === true
  );
}

function getProviderScheduleForDate(
  providerId,
  dateValue
) {
  const schedules =
    getProviderSchedules();

  const date =
    new Date(
      dateValue + 'T12:00:00'
    );

  const dayCode =
    getWeekDayCode(date);

  for (let i = 0; i < schedules.length; i++) {
    const schedule =
      schedules[i];

    if (
      String(schedule.provider_id) !==
      String(providerId)
    ) {
      continue;
    }

    if (
      String(schedule.day_of_week) !==
      String(dayCode)
    ) {
      continue;
    }

    return schedule;
  }

  return null;
}

function getProviderSchedules() {
  if (PROVIDER_SCHEDULES_CACHE) {
    return PROVIDER_SCHEDULES_CACHE;
  }

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.PROVIDER_SCHEDULE);

  const rows = sheet.getDataRange().getValues();
  const result = [];

  if (rows.length < 2) {
    PROVIDER_SCHEDULES_CACHE = result;
    return result;
  }

  const headers = rows[0].map(function(header) {
    return String(header).trim();
  });

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function(header, index) {
      item[header] = rows[i][index];
    });

    result.push(item);
  }

  PROVIDER_SCHEDULES_CACHE = result;
  return result;
}

function getProviderName(provider) {
  return getMessage(
    provider.name_key
  );
}
function findProviderByName(providerName) {
  const providers = getProviders();
  const targetName = String(providerName).trim();

  for (let i = 0; i < providers.length; i++) {
    if (String(providers[i].name).trim() === targetName) {
      return providers[i];
    }
  }

  return null;
}

function getProvidersByLocation(locationId) {
  const providers = getProviders();
  const result = [];

  providers.forEach(function(provider) {
    if (String(provider.location_id) === String(locationId)) {
      result.push(provider);
    }
  });

  return result;
}

function findProviderById(providerId) {
  const providers = getProviders();

  for (let i = 0; i < providers.length; i++) {
    if (String(providers[i].id) === String(providerId)) {
      return providers[i];
    }
  }

  return null;
}
function getProviderCalendarId(providerId) {
  const provider =
    findProviderById(providerId);

  if (
    provider &&
    provider.calendar_id
  ) {
    return provider.calendar_id;
  }

  const settings =
    getSettings();

  return settings.DefaultCalendarId || '';
}

function getLocalizedProviderName(provider) {
  const settings = getSettings();
  const lang = settings.Language || 'ru';

  const key = 'name_' + lang;

  return String(getProviderName(provider)).trim();
}

function createProviderFromAdminSession(session) {
  const providerName =
    String(session.provider_name || '').trim();

  const locationId =
    String(session.provider_location_id || '').trim();

  const phone =
    String(session.provider_phone || '').trim();

  const telegramId =
    String(session.provider_telegram_id || '').trim();

  return createProvider({
    name: providerName,
    location_id: locationId,
    phone: phone,
    telegram_id: telegramId,
    calendar_id: ''
  });
}

function createProvider(providerData) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.PROVIDERS);

  const providerId =
    generateProviderId();

  const nameKey =
    generateProviderNameKey(providerId);

  createOrUpdateMessageValues(
    nameKey,
    createMessageValuesForAllLanguages(
      providerData.name
    )
  );

  sheet.appendRow([
    providerId,
    providerData.location_id,
    nameKey,
    providerData.phone,
    providerData.telegram_id,
    providerData.calendar_id || '',
    true
  ]);

  createDefaultProviderSchedule(providerId);

  return providerId;
}

function generateProviderNameKey(providerId) {
  return (
    'PROVIDER_NAME_' +
    String(providerId).replace('prov_', '')
  );
}
function updateProviderField(
  providerId,
  field,
  value
) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.PROVIDERS);

  const rows =
    sheet.getDataRange().getValues();

  const headers = rows[0];

  const providerIdIndex =
    headers.indexOf('provider_id');

  for (let i = 1; i < rows.length; i++) {
    if (
      String(rows[i][providerIdIndex]) !==
      String(providerId)
    ) {
      continue;
    }

    const provider = {};

    headers.forEach(function(header, index) {
      provider[header] =
        rows[i][index];
    });

    if (field === 'name') {
      createOrUpdateMessageValues(
        provider.name_key,
        createMessageValuesForAllLanguages(
          value
        )
      );

      return;
    }

    const fieldIndex =
      headers.indexOf(field);

    if (fieldIndex === -1) {
      throw new Error(
        'Field not found: ' +
        field
      );
    }

    sheet
      .getRange(
        i + 1,
        fieldIndex + 1
      )
      .setValue(value);

    return;
  }

  throw new Error(
    'Provider not found: ' +
    providerId
  );
}
