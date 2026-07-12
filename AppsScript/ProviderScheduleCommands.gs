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
