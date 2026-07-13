function syncCalendarCacheNearDatesTrigger() {
  runWithCalendarCacheLock(function () {
    syncCalendarCacheNearDatesTriggerInternal();
  });
}

function syncCalendarCacheNearDatesTriggerInternal() {
  const settings = getSettings();

  const timezone = settings.TimeZone || 'Europe/Kyiv';

  for (let i = -1; i <= 2; i++) {
    const date = new Date();

    date.setDate(date.getDate() + i);

    const dateString = Utilities.formatDate(date, timezone, 'yyyy-MM-dd');

    syncCalendarCacheForDate(dateString);
  }

  syncCustomerVisitHistoryFromCalendarCache();
  syncCustomerProfiles();
}

function syncCalendarCacheLongRangeTrigger() {
  runWithCalendarCacheLock(function () {
    syncCalendarCacheLongRangeTriggerInternal();
  });
}

function syncCalendarCacheLongRangeTriggerInternal() {
  const settings = getSettings();

  const timezone = settings.TimeZone || 'Europe/Kyiv';

  const cacheDays = Number(settings.CalendarCacheDays || 30);

  const startDate = new Date();

  for (let i = 3; i <= cacheDays; i++) {
    const date = new Date(startDate);

    date.setDate(date.getDate() + i);

    const dateString = Utilities.formatDate(date, timezone, 'yyyy-MM-dd');

    syncCalendarCacheForDate(dateString);
  }

  syncCustomerVisitHistoryFromCalendarCache();
  clearOldCalendarCache();
  syncCustomerProfiles();
}

function runWithCalendarCacheLock(callback) {
  const lock = LockService.getScriptLock();

  const locked = lock.tryLock(30000);

  if (!locked) {
    addAuditLog('CALENDAR_CACHE_LOCK_SKIP', 'Another sync is already running');

    return;
  }

  try {
    callback();
  } finally {
    lock.releaseLock();
  }
}

function clearOldCalendarCache() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.CALENDAR_CACHE);

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return;
  }

  const headers = rows[0].map(function (header) {
    return String(header).trim();
  });

  const cacheDateIndex = headers.indexOf('cache_date');

  const settings = getSettings();

  const timezone = settings.TimeZone || 'Europe/Kyiv';

  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);

  const minDate = Utilities.formatDate(yesterday, timezone, 'yyyy-MM-dd');

  for (let i = rows.length - 1; i >= 1; i--) {
    const cacheDate = normalizeDateForStorage(rows[i][cacheDateIndex]);

    if (cacheDate < minDate) {
      sheet.deleteRow(i + 1);
    }
  }

  resetCalendarCache();
}

function initializeCalendarCache() {
  syncCalendarCacheNearDatesTrigger();
  syncCalendarCacheLongRangeTrigger();
}
