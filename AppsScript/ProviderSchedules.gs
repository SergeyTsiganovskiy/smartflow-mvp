let WEEK_DAYS_CACHE = null;

function getWeekDays() {
  if (WEEK_DAYS_CACHE) {
    return WEEK_DAYS_CACHE;
  }
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.WEEK_DAYS);

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

    if (String(item.active).toUpperCase() !== 'TRUE') {
      continue;
    }

    result.push({
      day_code: String(item.day_code).trim(),
      sort_order: Number(item.sort_order || 0),
      active: item.active,
      message_key: String(item.message_key || '').trim()
    });
  }

  result.sort(function(a, b) {
    return a.sort_order - b.sort_order;
  });

  WEEK_DAYS_CACHE = result;
  return result;
}

function createDefaultProviderSchedule(providerId) {
  const settings = getSettings();

  const startTime =
    settings.DefaultWorkStartTime || '09:00';

  const endTime =
    settings.DefaultWorkEndTime || '20:00';

  const days =
    getWeekDays();

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.PROVIDER_SCHEDULE);

  days.forEach(function(day) {
    sheet.appendRow([
      providerId,
      day.day_code,
      startTime,
      endTime,
      true
    ]);
  });
}

function getProviderSchedule(providerId) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.PROVIDER_SCHEDULE);

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

    result.push({
      provider_id: item.provider_id,
      day_of_week: item.day_of_week,
      start_time: item.start_time,
      end_time: item.end_time,
      is_working: item.is_working
    });
  }

  const weekDays = getWeekDays();

  result.sort(function(a, b) {
    const dayA = weekDays.find(function(day) {
      return day.day_code === a.day_of_week;
    });

    const dayB = weekDays.find(function(day) {
      return day.day_code === b.day_of_week;
    });

    return (
      Number(dayA ? dayA.sort_order : 99) -
      Number(dayB ? dayB.sort_order : 99)
    );
  });

  return result;
}

function updateProviderScheduleField(
  providerId,
  dayCode,
  fieldName,
  value
) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.PROVIDER_SCHEDULE);

  const rows =
    sheet.getDataRange().getValues();

  const headers = rows[0];

  const providerIndex =
    headers.indexOf('provider_id');

  const dayIndex =
    headers.indexOf('day_of_week');

  const fieldIndex =
    headers.indexOf(fieldName);

  for (let i = 1; i < rows.length; i++) {
    if (
      String(rows[i][providerIndex]) === String(providerId) &&
      String(rows[i][dayIndex]) === String(dayCode)
    ) {
      sheet
        .getRange(i + 1, fieldIndex + 1)
        .setValue(value);

      return true;
    }
  }

  return false;
}
