// =========================
// CALENDAR CACHE
// =========================

function clearCalendarCacheForDate(dateValue) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('CalendarCache');

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return;
  }

  const headers = rows[0];

  const cacheDateIndex =
    headers.indexOf('cache_date');

  const targetDate =
    normalizeDateForStorage(dateValue);

  for (let i = rows.length - 1; i >= 1; i--) {
    const rowDate =
      normalizeDateForStorage(
        rows[i][cacheDateIndex]
      );

    if (rowDate === targetDate) {
      sheet.deleteRow(i + 1);
    }
  }
}

function saveCalendarCacheRecord(record) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('CalendarCache');

  const now = new Date();

  sheet.appendRow([
    record.cache_id || '',
    record.cache_date || '',

    record.source || '',

    record.appointment_id || '',
    record.calendar_event_id || '',

    record.customer_id || '',
    record.customer_name || '',
    record.phone || '',

    record.service_id || '',
    record.service_name || '',

    record.provider_id || '',
    record.provider_name || '',

    record.location_id || '',
    record.location_name || '',

    record.start_at || '',
    record.end_at || '',

    record.status || '',

    record.title || '',
    record.description || '',
    record.customer_note || '',

    record.synced_at || now,
    record.created_at || now,
    record.updated_at || now
  ]);
}

function syncCalendarCacheForDate(dateValue) {
  const targetDate =
    normalizeDateForStorage(dateValue);

  clearCalendarCacheForDate(targetDate);

  const rowsToInsert = [];

  const appointmentRows =
    buildAppointmentCacheRows(targetDate);

  appointmentRows.forEach(function(row) {
    rowsToInsert.push(row);
  });

  const manualRows =
    buildManualCalendarCacheRows(targetDate);

  manualRows.forEach(function(row) {
    rowsToInsert.push(row);
  });

  appendCalendarCacheRows(rowsToInsert);
}

function appendCalendarCacheRows(rows) {
  if (!rows || rows.length === 0) {
    return;
  }

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('CalendarCache');

  sheet
    .getRange(
      sheet.getLastRow() + 1,
      1,
      rows.length,
      rows[0].length
    )
    .setValues(rows);
}

function buildCalendarCacheRow(record) {
  const now = new Date();

  return [
    record.cache_id || '',
    record.cache_date || '',

    record.source || '',

    record.appointment_id || '',
    record.calendar_event_id || '',

    record.customer_id || '',
    record.customer_name || '',
    record.phone || '',

    record.service_id || '',
    record.service_name || '',

    record.provider_id || '',
    record.provider_name || '',

    record.location_id || '',
    record.location_name || '',

    record.start_at || '',
    record.end_at || '',

    record.status || 'confirmed',

    record.title || '',
    record.description || '',
    record.customer_note || '',

    record.synced_at || now,
    record.created_at || now,
    record.updated_at || now
  ];
}

function buildAppointmentCacheRows(dateValue) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Appointments');

  const rows =
    sheet.getDataRange().getValues();

  const result = [];

  if (rows.length < 2) {
    return result;
  }

  const headers = rows[0].map(function(header) {
    return String(header).trim();
  });

  const targetDate =
    normalizeDateForStorage(dateValue);

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function(header, index) {
      item[header] = rows[i][index];
    });

    if (
      normalizeDateForStorage(item.start_at) !==
      targetDate
    ) {
      continue;
    }

    if (
      String(item.status || '').toLowerCase() !==
      'confirmed'
    ) {
      continue;
    }

    if (!isAppointmentStillValid(item)) {
      continue;
    }

    const customer =
      getCustomerById(item.customer_id);

    const provider =
      findProviderById(item.provider_id);

    const service =
      findServiceById(item.service_id);

    const location =
      findLocationById(item.location_id);

    result.push(
      buildCalendarCacheRow({
        cache_id:
          'cache_' + new Date().getTime() + '_' + i,

        cache_date: targetDate,
        source: 'appointment',

        appointment_id:
          item.appointment_id,

        calendar_event_id:
          item.calendar_event_id,

        customer_id:
          item.customer_id,

        customer_name:
          customer ? customer.name : '',

        phone:
          customer ? customer.phone : '',

        service_id:
          item.service_id,

        service_name:
          service ? service.name : '',

        provider_id:
          item.provider_id,

        provider_name:
          provider ? provider.name : '',

        location_id:
          item.location_id,

        location_name:
          location ? location.name : '',

        start_at:
          item.start_at,

        end_at:
          item.end_at,

        status:
          item.status,

        title: '',
        description: '',
        customer_note:
          item.customer_note,

        synced_at:
          new Date()
      })
    );
  }

  return result;
}

function buildManualCalendarCacheRows(dateValue) {
  const appointments =
    getManualCalendarAppointmentsByDateOptimized(
      dateValue
    );

  const targetDate =
    normalizeDateForStorage(dateValue);

  const result = [];

  appointments.forEach(function(item, index) {
    result.push(
      buildCalendarCacheRow({
        cache_id:
          'cache_manual_' +
          new Date().getTime() +
          '_' +
          index,

        cache_date:
          targetDate,

        source:
          'calendar_manual',

        appointment_id:
          '',

        calendar_event_id:
          item.calendar_event_id || '',

        customer_id:
          item.customer_id || '',

        customer_name:
          item.customer_name || '',

        phone:
          item.phone || '',

        service_id:
          item.service_id || '',

        service_name:
          item.service_name || '',

        provider_id:
          item.provider_id || '',

        provider_name:
          item.provider_name || '',

        location_id:
          item.location_id || '',

        location_name:
          item.location_name || '',

        start_at:
          item.start_at,

        end_at:
          item.end_at,

        status:
          'confirmed',

        title:
          item.title || '',

        description:
          item.description || '',

        customer_note:
          item.customer_note || '',

        synced_at:
          new Date()
      })
    );
  });

  return result;
}

function getCachedAppointmentsByDate111(dateValue) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('CalendarCache');

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map(function(header) {
    return String(header).trim();
  });

  const cacheDateIndex = headers.indexOf('cache_date');
  const statusIndex = headers.indexOf('status');

  const targetDate =
    normalizeDateForStorage(dateValue);

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const cacheDate =
      normalizeDateForStorage(rows[i][cacheDateIndex]);

    if (cacheDate !== targetDate) {
      continue;
    }

    const status =
      String(rows[i][statusIndex] || '').toLowerCase();

    if (status !== 'confirmed') {
      continue;
    }

    const item = {};

    headers.forEach(function(header, index) {
      item[header] = rows[i][index];
    });

    result.push(item);
  }

  result.sort(function(a, b) {
    return new Date(a.start_at) - new Date(b.start_at);
  });

  return result;
}

function getCachedAppointmentsByDate(dateValue) {
  const t0 = new Date().getTime();

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('CalendarCache');

  const t1 = new Date().getTime();

  const rows = sheet.getDataRange().getValues();

  const t2 = new Date().getTime();

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map(function(header) {
    return String(header).trim();
  });

  const cacheDateIndex = headers.indexOf('cache_date');
  const statusIndex = headers.indexOf('status');

  const targetDate =
    normalizeDateForStorage(dateValue);

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const cacheDate =
      normalizeDateForStorage(rows[i][cacheDateIndex]);

    if (cacheDate !== targetDate) {
      continue;
    }

    const status =
      String(rows[i][statusIndex] || '').toLowerCase();

    if (status !== 'confirmed') {
      continue;
    }

    const item = {};

    headers.forEach(function(header, index) {
      item[header] = rows[i][index];
    });

    result.push(item);
  }

  result.sort(function(a, b) {
    return new Date(a.start_at) - new Date(b.start_at);
  });

  return result;
}

function syncCalendarCacheNearDatesTrigger() {
  const settings = getSettings();
  const timezone = settings.TimeZone || 'Europe/Kyiv';

  for (let i = 0; i <= 2; i++) {
    const date = new Date();

    date.setDate(
      date.getDate() + i
    );

    const dateString =
      Utilities.formatDate(
        date,
        timezone,
        'yyyy-MM-dd'
      );

    syncCalendarCacheForDate(
      dateString
    );
  }
}

function syncCalendarCacheLongRangeTrigger() {
  const settings = getSettings();
  const timezone = settings.TimeZone || 'Europe/Kyiv';

  // temp 
  //clearOldCalendarCache();

  const startDate = new Date();

  for (let i = 3; i <= 60; i++) {
    const date = new Date(
      startDate
    );

    date.setDate(
      date.getDate() + i
    );

    const dateString =
      Utilities.formatDate(
        date,
        timezone,
        'yyyy-MM-dd'
      );

    syncCalendarCacheForDate(
      dateString
    );
  }
}

function clearOldCalendarCache() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('CalendarCache');

  const rows = sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return;
  }

  const headers = rows[0].map(function(header) {
    return String(header).trim();
  });

  const cacheDateIndex =
    headers.indexOf('cache_date');

  const settings = getSettings();

  const timezone =
    settings.TimeZone || 'Europe/Kyiv';

  const today =
    Utilities.formatDate(
      new Date(),
      timezone,
      'yyyy-MM-dd'
    );

  for (let i = rows.length - 1; i >= 1; i--) {
    const cacheDate =
      normalizeDateForStorage(
        rows[i][cacheDateIndex]
      );

    if (cacheDate < today) {
      sheet.deleteRow(i + 1);
    }
  }
}

function initializeCalendarCache() {
  syncCalendarCacheNearDatesTrigger();
  syncCalendarCacheLongRangeTrigger();
}


