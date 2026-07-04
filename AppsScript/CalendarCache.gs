// =========================
// CALENDAR CACHE
// =========================

let CALENDAR_CACHE = null;

function resetCalendarCache() {
    CALENDAR_CACHE = null;
}

function getCalendarCache() {
    if (CALENDAR_CACHE) {
        return CALENDAR_CACHE;
    }

    const sheet = SpreadsheetApp
        .getActiveSpreadsheet()
        .getSheetByName('CalendarCache');

    const rows =
        sheet.getDataRange().getValues();

    const result = [];

    if (rows.length < 2) {
        CALENDAR_CACHE = result;
        return result;
    }

    const headers =
        rows[0].map(function(header) {
            return String(header).trim();
        });

    for (let i = 1; i < rows.length; i++) {
        const item = {};


        headers.forEach(function(header, index) {
            item[header] = rows[i][index];
        });

        result.push(item);


    }

    CALENDAR_CACHE = result;

    return result;
}

function clearCalendarCacheForDate(dateValue) {
    const sheet = SpreadsheetApp
        .getActiveSpreadsheet()
        .getSheetByName('CalendarCache');

    const rows =
        sheet.getDataRange().getValues();

    if (rows.length < 2) {
        return;
    }

    const headers =
        rows[0].map(function(header) {
            return String(header).trim();
        });

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

    resetCalendarCache();
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

    resetCalendarCache();
}

function buildCalendarCacheRow(record) {
    const now =
        new Date();

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

    const headers =
        rows[0].map(function(header) {
            return String(header).trim();
        });

    const targetDate =
        normalizeDateForStorage(dateValue);

    for (let i = 1; i < rows.length; i++) {
        const item = {};


        headers.forEach(function(header, index) {
            item[header] = rows[i][index];
        });

        if (normalizeDateForStorage(item.start_at) !== targetDate) {
            continue;
        }

        if (String(item.status || '').toLowerCase() !== 'confirmed') {
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
                cache_id: 'cache_' + new Date().getTime() + '_' + i,

                cache_date: targetDate,

                source: 'appointment',

                appointment_id: item.appointment_id,

                calendar_event_id: item.calendar_event_id,

                customer_id: item.customer_id,

                customer_name: customer ? customer.name : '',

                phone: customer ? customer.phone : '',

                service_id: item.service_id,

                service_name: service ? service.name : '',

                provider_id: item.provider_id,

                provider_name: provider ? provider.name : '',

                location_id: item.location_id,

                location_name: location ? location.name : '',

                start_at: item.start_at,

                end_at: item.end_at,

                status: item.status,

                title: '',

                description: '',

                customer_note: item.customer_note,

                synced_at: new Date()
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
                cache_id: 'cache_manual_' +
                    new Date().getTime() +
                    '_' +
                    index,


                cache_date: targetDate,

                source: 'calendar_manual',

                appointment_id: '',

                calendar_event_id: item.calendar_event_id || '',

                customer_id: item.customer_id || '',

                customer_name: item.customer_name || '',

                phone: item.phone || '',

                service_id: item.service_id || '',

                service_name: item.service_name || '',

                provider_id: item.provider_id || '',

                provider_name: item.provider_name || '',

                location_id: item.location_id || '',

                location_name: item.location_name || '',

                start_at: item.start_at,

                end_at: item.end_at,

                status: 'confirmed',

                title: item.title || '',

                description: item.description || '',

                customer_note: item.customer_note || '',

                synced_at: new Date()
            })
        );


    });

    return result;
}

function getCachedAppointmentsByDate(dateValue) {
    const targetDate =
        normalizeDateForStorage(dateValue);

    const result =
        getCalendarCache().filter(function(item) {
            const cacheDate =
                normalizeDateForStorage(item.cache_date);


            const status =
                String(item.status || '').toLowerCase();

            return cacheDate === targetDate &&
                status === 'confirmed';
        });


    result.sort(function(a, b) {
        return new Date(a.start_at) - new Date(b.start_at);
    });

    return result;
}

function getCachedAppointmentsByProvider(providerId) {
    const now =
        new Date();

    const result =
        getCalendarCache().filter(function(item) {
            const status =
                String(item.status || '').toLowerCase();


            return String(item.provider_id) === String(providerId) &&
                status === 'confirmed' &&
                new Date(item.start_at) >= now;
        });


    result.sort(function(a, b) {
        return new Date(a.start_at) - new Date(b.start_at);
    });

    return result;
}

function getCustomerVisitHistory(phone) {
    const phoneKey =
        getPhoneSearchKey(phone);

    const result =
        getCalendarCache().filter(function(item) {
            const status =
                String(item.status || '').toLowerCase();


            return getPhoneSearchKey(item.phone) === phoneKey &&
                status === 'confirmed';
        });


    result.sort(function(a, b) {
        return new Date(b.start_at) - new Date(a.start_at);
    });

    return result;
}

function syncCalendarCacheNearDatesTrigger() {
  runWithCalendarCacheLock(function() {
    syncCalendarCacheNearDatesTriggerInternal();
  });
}

function syncCalendarCacheNearDatesTriggerInternal() {
    const settings =
        getSettings();

    const timezone =
        settings.TimeZone || 'Europe/Kyiv';

    for (let i = -1; i <= 2; i++) {
        const date =
            new Date();


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

    syncCustomerVisitHistoryFromCalendarCache();
    syncCustomerProfiles();
}

function syncCalendarCacheLongRangeTrigger() {
  runWithCalendarCacheLock(function() {
    syncCalendarCacheLongRangeTriggerInternal();
  });
}

function syncCalendarCacheLongRangeTriggerInternal() {
  const settings =
    getSettings();

  const timezone =
    settings.TimeZone || 'Europe/Kyiv';

  const cacheDays =
    Number(
      settings.CalendarCacheDays || 30
    );

  const startDate =
    new Date();

  for (let i = 3; i <= cacheDays; i++) {
    const date =
      new Date(startDate);

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

  syncCustomerVisitHistoryFromCalendarCache();
  clearOldCalendarCache();
  syncCustomerProfiles();
}

function runWithCalendarCacheLock(callback) {
  const lock =
    LockService.getScriptLock();

  const locked =
    lock.tryLock(30000);

  if (!locked) {
    addAuditLog(
      'CALENDAR_CACHE_LOCK_SKIP',
      'Another sync is already running'
    );

    return;
  }

  try {
    callback();
  } finally {
    lock.releaseLock();
  }
}

function clearOldCalendarCache() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('CalendarCache');

  const rows =
    sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return;
  }

  const headers =
    rows[0].map(function(header) {
      return String(header).trim();
    });

  const cacheDateIndex =
    headers.indexOf('cache_date');

  const settings =
    getSettings();

  const timezone =
    settings.TimeZone || 'Europe/Kyiv';

  const yesterday =
    new Date();

  yesterday.setDate(
    yesterday.getDate() - 1
  );

  const minDate =
    Utilities.formatDate(
      yesterday,
      timezone,
      'yyyy-MM-dd'
    );

  for (let i = rows.length - 1; i >= 1; i--) {
    const cacheDate =
      normalizeDateForStorage(
        rows[i][cacheDateIndex]
      );

    if (cacheDate < minDate) {
      sheet.deleteRow(i + 1);
    }
  }

  resetCalendarCache();
}

function getNextCustomerAppointment(phone) {
  const phoneKey =
    getPhoneSearchKey(phone);

  const now =
    new Date();

  const result =
    getCalendarCache().filter(function(item) {
      const itemPhoneKey =
        getPhoneSearchKey(item.phone);

      const status =
        String(item.status || '').toLowerCase();

      if (itemPhoneKey !== phoneKey) {
        return false;
      }

      if (status !== 'confirmed') {
        return false;
      }

      if (new Date(item.start_at) < now) {
        return false;
      }

      return true;
    });

  result.sort(function(a, b) {
    return new Date(a.start_at) - new Date(b.start_at);
  });

  return result[0] || null;
}

function initializeCalendarCache() {
    syncCalendarCacheNearDatesTrigger();
    syncCalendarCacheLongRangeTrigger();
}