let PROVIDER_SCHEDULE_OVERRIDES_CACHE = null;
let PROVIDER_SCHEDULES_CACHE = null;

function getProviderScheduleOverrides() {
  if (PROVIDER_SCHEDULE_OVERRIDES_CACHE) {
    return PROVIDER_SCHEDULE_OVERRIDES_CACHE;
  }

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.PROVIDER_SCHEDULE_OVERRIDES);

  const rows = sheet.getDataRange().getValues();
  const result = [];

  if (rows.length < 2) {
    PROVIDER_SCHEDULE_OVERRIDES_CACHE = result;
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

  PROVIDER_SCHEDULE_OVERRIDES_CACHE = result;
  return result;
}



function generateOverrideId() {
  return generateNextEntityId(
    'ProviderScheduleOverrides',
    'override_id',
    'ovr'
  );
}

function createProviderScheduleOverrideFromSession(chatId) {
  const session =
    getUserSession(chatId);

  return createProviderScheduleOverride({
    provider_id: session.override_provider_id,
    date: session.override_date,
    start_time: '',
    end_time: '',
    is_working: false,
    reason_key: session.override_reason_key
  });
}

function createProviderScheduleOverride(data) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.PROVIDER_SCHEDULE_OVERRIDES);

  const overrideId =
    generateOverrideId();

  sheet.appendRow([
    overrideId,
    data.provider_id,
    data.date,
    data.start_time || '',
    data.end_time || '',
    data.is_working,
    data.reason_key,
    true,
    new Date()
  ]);

  return overrideId;
}

function createShortDayOverride(
  chatId
) {
  const session =
    getUserSession(chatId);

  return createProviderScheduleOverride({
    provider_id:
      session.override_provider_id,

    date:
      session.override_date,

    start_time:
      session.override_start_time,

    end_time:
      session.override_end_time,

    is_working: true,

    reason_key:
      session.override_reason_key
  });
}

function getProviderOverrides(providerId) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.PROVIDER_SCHEDULE_OVERRIDES);

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

    if (String(item.provider_id) !== String(providerId)) {
      continue;
    }

    if (String(item.active).toUpperCase() !== 'TRUE') {
      continue;
    }

    result.push({
      override_id: item.override_id,
      provider_id: item.provider_id,
      date: item.date,
      start_time: item.start_time,
      end_time: item.end_time,
      is_working: item.is_working,
      reason_key: item.reason_key,
      active: item.active,
      created_at: item.created_at
    });
  }

  result.sort(function(a, b) {
    return new Date(a.date) - new Date(b.date);
  });

  return result;
}

function buildOverrideLabel(item, index) {
  let label =
    String(index + 1) +
    '. ' +
    formatDateForDisplay(item.date) +
    ' — ' +
    getMessage(item.reason_key);

  if (String(item.is_working).toUpperCase() === 'TRUE') {
    label +=
      ' ' +
      formatScheduleTime(item.start_time) +
      '-' +
      formatScheduleTime(item.end_time);
  }

  return label;
}

function disableProviderOverride(overrideId) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.PROVIDER_SCHEDULE_OVERRIDES);

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const idIndex = headers.indexOf('override_id');
  const activeIndex = headers.indexOf('active');

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][idIndex]) === String(overrideId)) {
      sheet
        .getRange(i + 1, activeIndex + 1)
        .setValue(false);

      return true;
    }
  }

  return false;
}

function getProviderOverrideForDate(
  providerId,
  dateValue
) {
  const overrides =
    getProviderScheduleOverrides();

  for (let i = 0; i < overrides.length; i++) {
    const override =
      overrides[i];

    if (
      String(override.provider_id) !==
      String(providerId)
    ) {
      continue;
    }

    if (
      normalizeDateForStorage(
        override.date
      ) !== dateValue
    ) {
      continue;
    }

    if (
      String(
        override.active
      ).toUpperCase() !== 'TRUE'
      &&
      override.active !== true
    ) {
      continue;
    }

    return override;
  }

  return null;
}
