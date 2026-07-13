let PROVIDER_SCHEDULE_OVERRIDES_CACHE = null;
let PROVIDER_SCHEDULES_CACHE = null;

function getProviderScheduleOverrides() {
  if (PROVIDER_SCHEDULE_OVERRIDES_CACHE) {
    return PROVIDER_SCHEDULE_OVERRIDES_CACHE;
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.PROVIDER_SCHEDULE_OVERRIDES);

  const rows = sheet.getDataRange().getValues();
  const result = [];

  if (rows.length < 2) {
    PROVIDER_SCHEDULE_OVERRIDES_CACHE = result;
    return result;
  }

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function (header, index) {
      item[header] = rows[i][index];
    });

    result.push(item);
  }

  PROVIDER_SCHEDULE_OVERRIDES_CACHE = result;
  return result;
}

function getProviderOverrides(providerId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.PROVIDER_SCHEDULE_OVERRIDES);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function (header, index) {
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

  result.sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });

  return result;
}

function buildOverrideLabel(item, index) {
  let label = String(index + 1) + '. ' + formatDateForDisplay(item.date) + ' — ' + getMessage(item.reason_key);

  if (String(item.is_working).toUpperCase() === 'TRUE') {
    label += ' ' + formatScheduleTime(item.start_time) + '-' + formatScheduleTime(item.end_time);
  }

  return label;
}

function getProviderOverrideForDate(providerId, dateValue) {
  const overrides = getProviderScheduleOverrides();

  for (let i = 0; i < overrides.length; i++) {
    const override = overrides[i];

    if (String(override.provider_id) !== String(providerId)) {
      continue;
    }

    if (normalizeDateForStorage(override.date) !== dateValue) {
      continue;
    }

    if (String(override.active).toUpperCase() !== 'TRUE' && override.active !== true) {
      continue;
    }

    return override;
  }

  return null;
}
