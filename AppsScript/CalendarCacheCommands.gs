function resetCalendarCache() {
  CALENDAR_CACHE = null;
}

function clearCalendarCacheForDate(dateValue) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.CALENDAR_CACHE);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return;
  }

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  const cacheDateIndex = headers.indexOf('cache_date');

  const targetDate = normalizeDateForStorage(dateValue);

  for (let i = rows.length - 1; i >= 1; i--) {
    const rowDate = normalizeDateForStorage(rows[i][cacheDateIndex]);

    if (rowDate === targetDate) {
      sheet.deleteRow(i + 1);
    }
  }

  resetCalendarCache();
}

function appendCalendarCacheRows(rows) {
  if (!rows || rows.length === 0) {
    return;
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.CALENDAR_CACHE);

  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);

  resetCalendarCache();
}

function syncCalendarCacheForDate(dateValue) {
  const targetDate = normalizeDateForStorage(dateValue);

  clearCalendarCacheForDate(targetDate);

  const rowsToInsert = [];

  const appointmentRows = buildAppointmentCacheRows(targetDate);

  appointmentRows.forEach(function (row) {
    rowsToInsert.push(row);
  });

  const manualRows = buildManualCalendarCacheRows(targetDate);

  manualRows.forEach(function (row) {
    rowsToInsert.push(row);
  });

  appendCalendarCacheRows(rowsToInsert);
}
