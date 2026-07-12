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
