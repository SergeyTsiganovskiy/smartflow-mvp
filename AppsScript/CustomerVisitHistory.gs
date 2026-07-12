// =========================
// CUSTOMER VISIT HISTORY
// =========================

let CUSTOMER_VISIT_HISTORY_CACHE = null;

function resetCustomerVisitHistoryCache() {
  CUSTOMER_VISIT_HISTORY_CACHE = null;
}

function getCustomerVisitHistoryRows() {
  if (CUSTOMER_VISIT_HISTORY_CACHE) {
    return CUSTOMER_VISIT_HISTORY_CACHE;
  }

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAMES.CUSTOMER_VISIT_HISTORY);

  const rows =
    sheet.getDataRange().getValues();

  const result = [];

  if (rows.length < 2) {
    CUSTOMER_VISIT_HISTORY_CACHE = result;
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

  CUSTOMER_VISIT_HISTORY_CACHE = result;

  return result;
}

function findCustomerVisitByCalendarEventId(
  calendarEventId
) {
  const visits =
    getCustomerVisitHistoryRows();

  for (let i = 0; i < visits.length; i++) {
    if (
      String(visits[i].calendar_event_id) ===
      String(calendarEventId)
    ) {
      return visits[i];
    }
  }

  return null;
}

function createCustomerVisitHistory(
  data
) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(
      SHEET_NAMES.CUSTOMER_VISIT_HISTORY
    );

  const now =
    new Date();

  sheet.appendRow([
    'visit_' + now.getTime(),

    data.phone || '',
    getPhoneSearchKey(data.phone || ''),

    data.customer_name || '',

    data.source || '',

    data.appointment_id || '',
    data.calendar_event_id || '',

    data.service_id || '',
    data.service_name || '',

    data.provider_id || '',
    data.provider_name || '',

    data.location_id || '',
    data.location_name || '',

    data.start_at || '',
    data.end_at || '',

    data.status || '',

    data.customer_note || '',

    now,
    now,
    now
  ]);

  resetCustomerVisitHistoryCache();
}


function getCustomerVisitHistoryByPhone(phone) {
  const phoneKey =
    getPhoneSearchKey(phone);

  const result =
    getCustomerVisitHistoryRows()
      .filter(function(visit) {
        return String(visit.phone_key) === String(phoneKey);
      });

  result.sort(function(a, b) {
    return new Date(b.start_at) - new Date(a.start_at);
  });

  return result;
}

function updateCustomerVisitHistory(
  visitId,
  updates
) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(
      SHEET_NAMES.CUSTOMER_VISIT_HISTORY
    );

  const rows =
    sheet.getDataRange().getValues();

  if (rows.length < 2) {
    return false;
  }

  const headers =
    rows[0].map(function(header) {
      return String(header).trim();
    });

  const visitIdIndex =
    headers.indexOf('visit_id');

  for (let i = 1; i < rows.length; i++) {
    if (
      String(rows[i][visitIdIndex]) !==
      String(visitId)
    ) {
      continue;
    }

    Object.keys(updates).forEach(function(key) {
      const columnIndex =
        headers.indexOf(key);

      if (columnIndex === -1) {
        return;
      }

      rows[i][columnIndex] =
        updates[key];
    });

    const updatedAtIndex =
      headers.indexOf('updated_at');

    if (updatedAtIndex !== -1) {
      rows[i][updatedAtIndex] =
        new Date();
    }

    sheet
      .getRange(
        i + 1,
        1,
        1,
        headers.length
      )
      .setValues([
        rows[i]
      ]);

    resetCustomerVisitHistoryCache();

    return true;
  }

  return false;
}

